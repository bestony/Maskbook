import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react'
import { Trans } from '@lingui/react/macro'
import { Icons } from '@masknet/icons'
import { useLastRecognizedIdentity, usePostInfoDetails, usePostLink } from '@masknet/plugin-infra/content-script'
import { requestLogin, share } from '@masknet/plugin-infra/content-script/context'
import { LoadingStatus, TransactionConfirmModal } from '@masknet/shared'
import { EMPTY_LIST, NetworkPluginID, Sniffings } from '@masknet/shared-base'
import { queryClient } from '@masknet/shared-base-ui'
import { ActionButton, makeStyles } from '@masknet/theme'
import type { HappyRedPacketV4 } from '@masknet/web3-contracts/types/HappyRedPacketV4.js'
import { useChainContext, useNetwork, useNetworkContext } from '@masknet/web3-hooks-base'
import { EVMChainResolver, FireflyRedPacket } from '@masknet/web3-providers'
import { FireflyRedPacketAPI, RedPacketStatus, type RedPacketJSONPayload } from '@masknet/web3-providers/types'
import { TokenType, formatBalance, isZero, minus } from '@masknet/web3-shared-base'
import { ChainId } from '@masknet/web3-shared-evm'
import { Box, Card, Grow } from '@mui/material'
import { memo, useCallback, useMemo, useState } from 'react'
import { RedPacketEnvelope } from '../components/RedPacketEnvelope.js'
import { Conditions } from '../Conditions/index.js'
import { useAvailabilityComputed } from '../hooks/useAvailabilityComputed.js'
import { useClaimCallback } from '../hooks/useClaimCallback.js'
import { useRedPacketContract } from '../hooks/useRedPacketContract.js'
import { useRefundCallback } from '../hooks/useRefundCallback.js'
import { OperationFooter } from './OperationFooter.js'
import { RequestLoginFooter } from './RequestLoginFooter.js'
import { useRedPacketCover } from './useRedPacketCover.js'

const useStyles = makeStyles()((theme) => {
    return {
        root: {
            borderRadius: theme.spacing(2),
            position: 'relative',
            display: 'flex',
            backgroundColor: 'transparent',
            backgroundRepeat: 'no-repeat',
            color: theme.palette.common.white,
            flexDirection: 'column',
            gap: theme.spacing(2),
            justifyContent: 'space-between',
            margin: theme.spacing(0, 'auto', 2),
            boxSizing: 'border-box',
            width: 'calc(100% - 32px)',
            [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
                padding: theme.spacing(1, 1.5),
                width: 'calc(100% - 20px)',
            },
            padding: 0,
            aspectRatio: '480 / 336',
        },
        footer: {
            margin: theme.spacing(2),
        },
        envelope: {
            height: '100%',
            width: '100%',
        },
        conditions: {
            position: 'absolute',
            zIndex: 9,
            inset: 24,
            margin: 'auto',
        },
        actionButton: {
            display: 'flex',
            gap: theme.spacing(0.5),
            lineHeight: '18px',
            backgroundColor: theme.palette.maskColor.dark,
            width: '100%',
            color: 'white',
            '&:hover': {
                backgroundColor: theme.palette.maskColor.dark,
            },
        },
    }
})

export interface RedPacketProps {
    payload: RedPacketJSONPayload
}

export const RedPacket = memo(function RedPacket({ payload }: RedPacketProps) {
    const { _ } = useLingui()
    const token = payload.token
    const { pluginID } = useNetworkContext()
    const payloadChainId: ChainId =
        (token?.chainId as ChainId) ?? EVMChainResolver.chainId(payload.network ?? '') ?? ChainId.Mainnet
    const { account } = useChainContext<NetworkPluginID.PLUGIN_EVM>({
        chainId: payloadChainId,
        account: pluginID === NetworkPluginID.PLUGIN_EVM ? undefined : '',
    })

    // #region token detailed
    const {
        availability,
        computed: availabilityComputed,
        checkAvailability,
        claimStrategyStatus,
        recheckClaimStatus,
        checkingClaimStatus,
    } = useAvailabilityComputed(account, payload)

    // #endregion

    const { canClaim, canRefund, listOfStatus, isClaimed, isEmpty, isExpired, isRefunded } = availabilityComputed

    // #region remote controlled transaction dialog
    const postLink = usePostLink()

    const [{ loading: isClaiming, value: claimTxHash }, claimCallback] = useClaimCallback(account, payload)
    const source = usePostInfoDetails.source()
    const platform = source?.toLowerCase()
    const postUrl = usePostInfoDetails.url()
    const handle = usePostInfoDetails.handle()
    const link = postLink.toString() || postUrl?.toString()

    // TODO payload.chainId is undefined on production mode
    const network = useNetwork(pluginID, payload.chainId || payload.token?.chainId)

    const getShareText = useCallback(
        (hasClaimed: boolean) => {
            const promote_short = _(msg`🧧🧧🧧 Try sending Lucky Drop to your friends with Mask.io.`)
            const isOnTwitter = Sniffings.is_twitter_page
            const isOnFacebook = Sniffings.is_facebook_page
            const shareTextOption = {
                sender: payload.sender.name.replace(/^@/, ''),
                payload: link!,
                network: network?.name ?? 'Mainnet',
                account: isOnTwitter ? 'realMaskNetwork' : 'masknetwork',
                interpolation: { escapeValue: false },
            }
            if (hasClaimed) {
                const claimed = _(
                    msg`I just claimed a lucky drop from @${shareTextOption.sender} on ${shareTextOption.network} network.`,
                )
                return isOnTwitter || isOnFacebook ?
                        _(msg`${claimed} Follow @${shareTextOption.account} (mask.io) to claim lucky drops.`) +
                            `\n${promote_short}\n#mask_io #LuckyDrop\n${shareTextOption.payload}`
                    :   `${claimed}\n${promote_short}\n${shareTextOption.payload}`
            }
            const head = _(
                msg`Hi friends, I just found a lucky drop sent by @${shareTextOption.sender} on ${shareTextOption.network} network.`,
            )

            return isOnTwitter || isOnFacebook ?
                    _(msg`${head} Follow @${shareTextOption.account} (mask.io) to claim lucky drops.`) +
                        `\n${promote_short}\n#mask_io #LuckyDrop\n${shareTextOption.payload}`
                :   `${head}\n${promote_short}\n${shareTextOption.payload}`
        },
        [payload, link, claimTxHash, network?.name, platform, handle, _],
    )
    const claimedShareText = useMemo(() => getShareText(true), [getShareText])

    const [{ loading: isRefunding }, _isRefunded, refundCallback] = useRefundCallback(
        payload.contract_version,
        account,
        payload.rpid,
        payloadChainId,
    )

    const redPacketContract = useRedPacketContract(payloadChainId, payload.contract_version) as HappyRedPacketV4
    const checkResult = useCallback(async () => {
        const data = await redPacketContract.methods.check_availability(payload.rpid).call({
            // check availability is ok w/o account
            from: account,
        })
        if (isZero(data.claimed_amount)) return
        TransactionConfirmModal.open({
            shareText: claimedShareText,
            token,
            tokenType: TokenType.Fungible,
            messageTextForNFT: _(msg`1 NFT claimed.`),
            messageTextForFT: _(
                msg`You claimed ${formatBalance(data.claimed_amount, token?.decimals, { significant: 2 })} $${token?.symbol}.`,
            ),
            title: _(msg`Lucky Drop`),
            share: (text) => share?.(text, source ? source : undefined),
        })
    }, [token, redPacketContract, payload.rpid, account, claimedShareText, source])

    const [showRequirements, setShowRequirements] = useState(false)
    const me = useLastRecognizedIdentity()
    const myProfileId = me?.profileId
    const myHandle = me?.identifier?.userId
    const onClaimOrRefund = useCallback(async () => {
        let hash: string | undefined
        if (canClaim) {
            const result = await recheckClaimStatus()
            if (result === false) {
                setShowRequirements(true)
                return
            }
            hash = await claimCallback()
            if (myProfileId && myHandle && hash) {
                await FireflyRedPacket.finishClaiming(
                    payload.rpid,
                    FireflyRedPacketAPI.PlatformType.twitter,
                    myProfileId,
                    myHandle,
                    hash,
                )
            }
            await checkResult()
            queryClient.invalidateQueries({
                queryKey: ['redpacket', 'history'],
            })
        } else if (canRefund) {
            hash = await refundCallback()
        }
        if (typeof hash === 'string') {
            checkAvailability()
        }
    }, [
        canClaim,
        canRefund,
        claimCallback,
        checkResult,
        recheckClaimStatus,
        checkAvailability,
        payload.rpid,
        myProfileId,
        myHandle,
    ])

    const outdated = isEmpty || (!canRefund && listOfStatus.includes(RedPacketStatus.expired))

    const { classes } = useStyles()

    // RedPacket created from Mask has no cover settings
    const { data: cover, isLoading: isLoadingCover } = useRedPacketCover({
        ...payload,
        token,
        sender: payload.sender.name,
        message: payload.sender.message,
        claimedAmount: availability?.claimed_amount,
        claimed: availability?.claimed,
    })

    // the red packet can fetch without account
    if (!availability || !token || isLoadingCover) return <LoadingStatus minHeight={148} />

    const card = (
        <Card className={classes.root} component="article" elevation={0}>
            <RedPacketEnvelope
                className={classes.envelope}
                cover={cover?.backgroundImageUrl || new URL('../assets/cover.png', import.meta.url).href}
                message={payload.sender.message}
                token={token}
                shares={payload.shares}
                isClaimed={isClaimed}
                isEmpty={isEmpty}
                isExpired={isExpired}
                isRefunded={isRefunded}
                claimedCount={+availability.claimed}
                total={payload.total}
                totalClaimed={minus(payload.total, payload.total_remaining || availability.balance).toFixed()}
                claimedAmount={availability.claimed_amount}
                creator={payload.sender.name}
                showConditionButton={!!claimStrategyStatus?.claimStrategyStatus.length}
                onClickCondition={() => setShowRequirements(true)}
            />
            {cover ?
                <Grow in={showRequirements} timeout={250}>
                    <Conditions
                        unsatisfied={!!account && claimStrategyStatus?.canClaim === false}
                        statusList={claimStrategyStatus?.claimStrategyStatus ?? EMPTY_LIST}
                        className={classes.conditions}
                        onClose={() => setShowRequirements(false)}
                    />
                </Grow>
            :   null}
        </Card>
    )

    if (outdated) return card
    if (!myHandle)
        return (
            <>
                {card}
                <RequestLoginFooter
                    className={classes.footer}
                    onRequest={() => {
                        requestLogin?.(source)
                    }}
                />
            </>
        )

    if (claimStrategyStatus?.canClaim === false && account) {
        return (
            <>
                {card}
                <Box className={classes.footer}>
                    <ActionButton
                        className={classes.actionButton}
                        variant="roundedDark"
                        fullWidth
                        onClick={() => setShowRequirements(true)}>
                        <Trans>Who can claim</Trans>
                        <Icons.Questions size={18} />
                    </ActionButton>
                </Box>
            </>
        )
    }

    return (
        <>
            {card}
            <OperationFooter
                className={classes.footer}
                chainId={payloadChainId}
                canClaim={canClaim}
                canRefund={canRefund}
                isClaiming={isClaiming || checkingClaimStatus}
                isRefunding={isRefunding}
                onClaimOrRefund={onClaimOrRefund}
            />
        </>
    )
})
