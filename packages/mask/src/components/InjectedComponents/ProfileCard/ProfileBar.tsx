import { type HTMLProps, memo, useEffect, useRef, useState } from 'react'
import { useCopyToClipboard } from 'react-use'
import { v4 as uuid } from 'uuid'
import { CrossIsolationMessages, type SocialAccount, type SocialIdentity } from '@masknet/shared-base'
import { Icons } from '@masknet/icons'
import { Box, Link, Typography, ThemeProvider } from '@mui/material'
import { useWeb3State, useChainContext } from '@masknet/web3-hooks-base'
import { AddressItem, Image, useSnackbarCallback, TokenWithSocialGroupMenu } from '@masknet/shared'
import { makeStyles, MaskLightTheme, MaskDarkTheme } from '@masknet/theme'
import { isSameAddress } from '@masknet/web3-shared-base'
import { ChainId } from '@masknet/web3-shared-evm'
import type { Web3Helper } from '@masknet/web3-helpers'
import { TrendingAPI } from '@masknet/web3-providers/types'
import { useI18N } from '../../../utils/index.js'
import { AvatarDecoration } from './AvatarDecoration.js'
import { useCollectionByTwitterHandler } from '../../../plugins/Trader/trending/useTrending.js'
import { PluginTraderMessages } from '../../../plugins/Trader/messages.js'

const useStyles = makeStyles<void, 'avatarDecoration'>()((theme, _, refs) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        columnGap: 4,
    },
    avatar: {
        position: 'relative',
        height: 40,
        width: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        flexGrow: 0,
        filter: 'drop-shadow(0px 6px 12px rgba(28, 104, 243, 0.2))',
        backdropFilter: 'blur(16px)',
        '& img': {
            position: 'absolute',
            borderRadius: '100%',
            // Adjust to fit the rainbow border.
            transform: 'scale(0.94, 0.96) translate(0, 1px)',
        },
        [`& .${refs.avatarDecoration}`]: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            transform: 'scale(1)',
        },
    },
    avatarImageContainer: {
        borderRadius: '50%',
    },
    avatarDecoration: {},
    description: {
        height: 40,
        marginLeft: 10,
        overflow: 'auto',
        flexGrow: 1,
    },
    nickname: {
        color: theme.palette.text.primary,
        fontWeight: 700,
        fontSize: 18,
        lineHeight: '22px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    addressRow: {
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        columnGap: 2,
    },
    address: {
        color: theme.palette.text.primary,
        fontSize: 14,
        height: 18,
        fontWeight: 400,
        lineHeight: '18px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    linkIcon: {
        lineHeight: '14px',
        height: 14,
        overflow: 'hidden',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        flexShrink: 0,
    },
}))

export interface ProfileBarProps extends HTMLProps<HTMLDivElement> {
    identity: SocialIdentity
    socialAccounts: Array<SocialAccount<Web3Helper.ChainIdAll>>
    address?: string
    badgeBounding?: DOMRect
    onAddressChange?: (address: string) => void
}

/**
 * What a Profile includes:
 * - SNS info
 * - Wallets
 */
export const ProfileBar = memo<ProfileBarProps>(
    ({ socialAccounts, address, identity, onAddressChange, className, children, badgeBounding, ...rest }) => {
        const { classes, theme, cx } = useStyles()
        const { t } = useI18N()
        const containerRef = useRef<HTMLDivElement>(null)
        const { current: avatarClipPathId } = useRef<string>(uuid())

        const { value: collectionList = [] } = useCollectionByTwitterHandler(identity.identifier?.userId)

        const [, copyToClipboard] = useCopyToClipboard()

        const onCopy = useSnackbarCallback({
            executor: async () => copyToClipboard(address!),
            deps: [],
            successText: t('copy_success'),
        })

        const { Others } = useWeb3State()
        const { chainId } = useChainContext()

        const [walletMenuOpen, setWalletMenuOpen] = useState(false)
        useEffect(() => {
            const closeMenu = () => setWalletMenuOpen(false)
            window.addEventListener('scroll', closeMenu, false)
            return () => {
                window.removeEventListener('scroll', closeMenu, false)
            }
        }, [])
        const selectedAddress = socialAccounts.find((x) => isSameAddress(x.address, address))

        return (
            <Box className={cx(classes.root, className)} {...rest} ref={containerRef}>
                <div className={classes.avatar}>
                    <Image
                        src={identity.avatar}
                        height={40}
                        width={40}
                        alt={identity.nickname}
                        containerProps={{
                            className: classes.avatarImageContainer,
                            style: {
                                WebkitClipPath: `url(#${avatarClipPathId}-clip-path)`,
                            },
                        }}
                    />
                    <AvatarDecoration
                        className={classes.avatarDecoration}
                        clipPathId={avatarClipPathId}
                        userId={identity.identifier?.userId}
                        size={40}
                    />
                </div>
                <Box className={classes.description}>
                    <Typography className={classes.nickname} title={identity.nickname}>
                        {identity.nickname}
                    </Typography>
                    {address ? (
                        <div className={classes.addressRow}>
                            <AddressItem
                                socialAccount={selectedAddress}
                                disableLinkIcon
                                TypographyProps={{ className: classes.address }}
                            />
                            <Icons.PopupCopy onClick={onCopy} size={14} className={classes.linkIcon} />
                            <Link
                                href={Others?.explorerResolver.addressLink(chainId ?? ChainId.Mainnet, address)}
                                target="_blank"
                                title={t('view_on_explorer')}
                                rel="noopener noreferrer"
                                onClick={(event) => {
                                    event.stopPropagation()
                                }}
                                className={classes.linkIcon}>
                                <Icons.LinkOut size={14} />
                            </Link>
                            <Icons.ArrowDrop
                                size={14}
                                color={theme.palette.text.primary}
                                onClick={() => {
                                    setWalletMenuOpen((v) => !v)
                                }}
                            />
                        </div>
                    ) : null}
                </Box>
                <ThemeProvider theme={theme.palette.mode === 'light' ? MaskLightTheme : MaskDarkTheme}>
                    <TokenWithSocialGroupMenu
                        walletMenuOpen={walletMenuOpen}
                        setWalletMenuOpen={setWalletMenuOpen}
                        containerRef={containerRef}
                        fromSocialCard
                        onAddressChange={onAddressChange}
                        currentAddress={address}
                        socialAccounts={socialAccounts}
                        collectionList={collectionList}
                        onTokenChange={(currentResult) => {
                            setWalletMenuOpen(false)
                            if (!badgeBounding) return
                            PluginTraderMessages.trendingAnchorObserved.sendToLocal({
                                name: identity.identifier?.userId || '',
                                identity,
                                address,
                                badgeBounding,
                                type: TrendingAPI.TagType.HASH,
                                isCollectionProjectPopper: true,
                                currentResult,
                            })

                            CrossIsolationMessages.events.profileCardEvent.sendToLocal({ open: false })
                        }}
                    />
                </ThemeProvider>
                {children}
            </Box>
        )
    },
)
