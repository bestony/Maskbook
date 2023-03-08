import {
    CircularProgress,
    type ListItemButtonProps,
    type ListItemIconProps,
    type ListItemTextProps,
    type TypographyProps,
    Typography as MuiTypography,
    ListItemButton as MuiListItemButton,
    ListItemIcon as MuiListItemIcon,
    ListItemText as MuiListItemText,
    Box,
    useTheme,
} from '@mui/material'
import { ProviderType } from '@masknet/web3-shared-evm'
import { TransactionStatusType } from '@masknet/web3-shared-base'
import {
    useProviderDescriptor,
    useChainContext,
    useChainColor,
    useChainIdValid,
    useWeb3State,
    useReverseAddress,
    useChainIdMainnet,
    useRecentTransactions,
} from '@masknet/web3-hooks-base'
import { useCallback } from 'react'
import { WalletIcon } from '@masknet/shared'
import { useRemoteControlledDialog } from '@masknet/shared-base-ui'
import { WalletMessages } from '@masknet/plugin-wallet'
import { Icons } from '@masknet/icons'
import { makeStyles } from '@masknet/theme'
import { FiberManualRecord as FiberManualRecordIcon } from '@mui/icons-material'
import { useMountReport } from '@masknet/web3-telemetry/hooks'
import { TelemetryAPI } from '@masknet/web3-providers/types'
import { useI18N } from '../../utils/index.js'
import GuideStep from '../GuideStep/index.js'

const useStyles = makeStyles()((theme) => ({
    title: {
        color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'rgb(15, 20, 25)',
        display: 'flex',
        alignItems: 'center',
    },
    chainIcon: {
        fontSize: 18,
        width: 18,
        height: 18,
    },
}))
export interface ToolboxHintProps {
    Container?: React.ComponentType<React.PropsWithChildren<{}>>
    ListItemButton?: React.ComponentType<Pick<ListItemButtonProps, 'onClick' | 'children'>>
    ListItemText?: React.ComponentType<Pick<ListItemTextProps, 'primary'>>
    ListItemIcon?: React.ComponentType<Pick<ListItemIconProps, 'children'>>
    Typography?: React.ComponentType<Pick<TypographyProps, 'children' | 'className'>>
    iconSize?: number
    badgeSize?: number
    mini?: boolean
    category: 'wallet' | 'application'
}
export function ToolboxHintUnstyled(props: ToolboxHintProps) {
    return props.category === 'wallet' ? <ToolboxHintForWallet {...props} /> : <ToolboxHintForApplication {...props} />
}

function ToolboxHintForApplication(props: ToolboxHintProps) {
    const {
        ListItemButton = MuiListItemButton,
        ListItemIcon = MuiListItemIcon,
        Container = 'div',
        Typography = MuiTypography,
        iconSize = 24,
        mini,
        ListItemText = MuiListItemText,
    } = props
    const { classes } = useStyles()
    const { t } = useI18N()
    const { openDialog } = useRemoteControlledDialog(WalletMessages.events.applicationDialogUpdated)
    useMountReport(TelemetryAPI.EventID.AccessToolbox)
    return (
        <GuideStep step={1} total={4} tip={t('user_guide_tip_1')}>
            <Container>
                <ListItemButton onClick={openDialog}>
                    <ListItemIcon>
                        <Icons.MaskBlue size={iconSize} />
                    </ListItemIcon>
                    {mini ? null : (
                        <ListItemText
                            primary={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    <Typography className={classes.title}>{t('mask_network')}</Typography>
                                </Box>
                            }
                        />
                    )}
                </ListItemButton>
            </Container>
        </GuideStep>
    )
}

function ToolboxHintForWallet(props: ToolboxHintProps) {
    const { t } = useI18N()
    const {
        ListItemButton = MuiListItemButton,
        ListItemText = MuiListItemText,
        ListItemIcon = MuiListItemIcon,
        Container = 'div',
        Typography = MuiTypography,
        iconSize = 24,
        badgeSize = 12,
        mini,
    } = props
    const { classes } = useStyles()
    const { openWallet, walletTitle, chainColor, shouldDisplayChainIndicator, account } = useToolbox()

    const theme = useTheme()
    const providerDescriptor = useProviderDescriptor()

    return (
        <GuideStep step={2} total={4} tip={t('user_guide_tip_2')}>
            <Container>
                <ListItemButton onClick={openWallet}>
                    <ListItemIcon>
                        {!!account && providerDescriptor?.type !== ProviderType.MaskWallet ? (
                            <WalletIcon
                                size={iconSize}
                                badgeSize={badgeSize}
                                mainIcon={providerDescriptor?.icon} // switch the icon to meet design
                                badgeIconBorderColor={theme.palette.background.paper}
                            />
                        ) : (
                            <Icons.ConnectWallet size={iconSize} />
                        )}
                    </ListItemIcon>
                    {mini ? null : (
                        <ListItemText
                            primary={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    <Typography className={classes.title}>{walletTitle}</Typography>
                                    {shouldDisplayChainIndicator ? (
                                        <FiberManualRecordIcon
                                            className={classes.chainIcon}
                                            style={{
                                                color: chainColor,
                                            }}
                                        />
                                    ) : null}
                                </Box>
                            }
                        />
                    )}
                </ListItemButton>
            </Container>
        </GuideStep>
    )
}

function useToolbox() {
    const { t } = useI18N()
    const { account } = useChainContext()
    const chainColor = useChainColor()
    const chainIdValid = useChainIdValid()
    const chainIdMainnet = useChainIdMainnet()
    const { Others } = useWeb3State()

    // #region recent pending transactions
    const pendingTransactions = useRecentTransactions(undefined, TransactionStatusType.NOT_DEPEND)
    // #endregion

    // #region Wallet
    const { openDialog: openWalletStatusDialog } = useRemoteControlledDialog(
        WalletMessages.events.walletStatusDialogUpdated,
    )
    const { openDialog: openSelectProviderDialog } = useRemoteControlledDialog(
        WalletMessages.events.selectProviderDialogUpdated,
    )
    // #endregion

    const { value: domain } = useReverseAddress(undefined, account)

    function renderButtonText() {
        if (!account) return t('plugin_wallet_connect_wallet')
        if (pendingTransactions.length <= 0)
            return Others?.formatDomainName?.(domain) || Others?.formatAddress?.(account, 4) || account
        return (
            <>
                <span style={{ marginRight: 12 }}>
                    {t('plugin_wallet_pending_transactions', {
                        count: pendingTransactions.length,
                    })}
                </span>
                <CircularProgress thickness={6} size={20} color="inherit" />
            </>
        )
    }

    const openWallet = useCallback(() => {
        return account ? openWalletStatusDialog() : openSelectProviderDialog()
    }, [openWalletStatusDialog, openSelectProviderDialog, account])

    const walletTitle = renderButtonText()

    const shouldDisplayChainIndicator = account && chainIdValid && !chainIdMainnet
    return {
        openWallet,
        walletTitle,
        shouldDisplayChainIndicator,
        chainColor,
        account,
    }
}
