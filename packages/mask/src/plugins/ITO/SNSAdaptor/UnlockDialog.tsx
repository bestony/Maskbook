import { makeStyles, ActionButton } from '@masknet/theme'
import { NetworkPluginID } from '@masknet/shared-base'
import { formatBalance, type FungibleToken, isGreaterThan, rightShift } from '@masknet/web3-shared-base'
import { useCallback, useState } from 'react'
import {
    type SchemaType,
    formatEthereumAddress,
    explorerResolver,
    useITOConstants,
    type ChainId,
} from '@masknet/web3-shared-evm'
import { Link, Typography } from '@mui/material'
import { Trans } from 'react-i18next'
import {
    useSelectFungibleToken,
    FungibleTokenInput,
    WalletConnectedBoundary,
    EthereumERC20TokenApprovedBoundary,
} from '@masknet/shared'
import { useI18N } from '../../../utils/index.js'
import { useChainContext, useFungibleTokenBalance } from '@masknet/web3-hooks-base'

function isMoreThanMillion(allowance: string, decimals: number) {
    return isGreaterThan(allowance, `100000000000e${decimals}`) // 100 billion
}

const useStyles = makeStyles()((theme) => ({
    root: {},
    tip: {
        margin: theme.spacing(1.5, 0, 1),
        fontSize: 10,
    },
    button: {
        marginTop: theme.spacing(1.5),
    },
}))

export interface UnlockDialogProps {
    tokens: Array<FungibleToken<ChainId, SchemaType.ERC20>>
}

export function UnlockDialog(props: UnlockDialogProps) {
    const { tokens } = props
    const { t } = useI18N()
    const { classes } = useStyles()

    const { chainId } = useChainContext<NetworkPluginID.PLUGIN_EVM>()
    const { ITO2_CONTRACT_ADDRESS } = useITOConstants(chainId)
    // #region select token
    const [token, setToken] = useState<FungibleToken<ChainId, SchemaType.ERC20>>(tokens[0])
    const selectFungibleToken = useSelectFungibleToken<void, NetworkPluginID.PLUGIN_EVM>()
    const onSelectTokenChipClick = useCallback(async () => {
        const picked = await selectFungibleToken({
            disableNativeToken: true,
            disableSearchBar: true,
            selectedTokens: token?.address ? [token.address] : [],
            whitelist: tokens.map((x) => x.address),
        })
        if (picked) setToken(picked as FungibleToken<ChainId, SchemaType.ERC20>)
    }, [tokens, token?.address])
    // #endregion
    // #region amount
    const [rawAmount, setRawAmount] = useState('')
    const amount = rightShift(rawAmount || '0', token?.decimals)
    const { value: tokenBalance = '0' } = useFungibleTokenBalance(NetworkPluginID.PLUGIN_EVM, token?.address ?? '')
    // #endregion
    if (!tokens.length) return <Typography>{t('plugin_ito_empty_token')}</Typography>
    return (
        <div className={classes.root}>
            <FungibleTokenInput
                label={t('amount')}
                amount={rawAmount}
                balance={tokenBalance ?? '0'}
                token={token}
                onAmountChange={setRawAmount}
                onSelectToken={onSelectTokenChipClick}
            />
            {ITO2_CONTRACT_ADDRESS ? (
                <Typography className={classes.tip} variant="body2" color="textSecondary">
                    <Trans
                        i18nKey="plugin_ito_unlock_tip"
                        components={{
                            contractLink: (
                                <Link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={explorerResolver.addressLink(chainId, ITO2_CONTRACT_ADDRESS)}
                                />
                            ),
                        }}
                        values={{
                            address: formatEthereumAddress(ITO2_CONTRACT_ADDRESS, 4),
                            symbol: token.symbol ?? 'Unknown',
                        }}
                    />
                </Typography>
            ) : null}
            <WalletConnectedBoundary expectedChainId={chainId}>
                <EthereumERC20TokenApprovedBoundary
                    onlyInfiniteUnlock
                    amount={amount.toFixed()}
                    spender={ITO2_CONTRACT_ADDRESS}
                    token={token}>
                    {(allowance: string) => (
                        <ActionButton className={classes.button} fullWidth disabled>
                            {isMoreThanMillion(allowance, token.decimals)
                                ? t('plugin_ito_amount_unlocked_infinity', {
                                      symbol: token.symbol ?? 'Token',
                                  })
                                : t('plugin_ito_amount_unlocked', {
                                      amount: formatBalance(allowance, token.decimals, 2),
                                      symbol: token.symbol ?? 'Token',
                                  })}
                        </ActionButton>
                    )}
                </EthereumERC20TokenApprovedBoundary>
            </WalletConnectedBoundary>
        </div>
    )
}
