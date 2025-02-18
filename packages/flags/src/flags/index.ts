const devOnly = process.env.NODE_ENV === 'development'
const insiderOnly = process.env.channel === 'insider' || devOnly
const betaOrInsiderOnly = insiderOnly || process.env.channel === 'beta'

// TODO: In future, we can turn this object into a Proxy to receive flags from remote

export const flags = {
    isolated_dashboard_bridge_enabled: false,
    mask_SDK_ready: betaOrInsiderOnly,
    use_register_content_script: true,
    /** Firefox has a special API that can inject to the document with a higher permission. */
    has_firefox_xray_vision: process.env.engine === 'firefox',
    support_testnet_switch: betaOrInsiderOnly,
    // #region Experimental features
    trader_all_api_cached_enabled: devOnly,
    /** Prohibit the use of test networks in production */
    wallet_allow_testnet: betaOrInsiderOnly || process.env.NODE_ENV !== 'production',
    // #endregion

    bsc_enabled: true,
    polygon_enabled: true,
    arbitrum_enabled: true,
    xdai_enabled: true,
    optimism_enabled: true,
    avalanche_enabled: true,
    fantom_enabled: true,
    celo_enabled: true,
    aurora_enabled: true,
    astar_enabled: true,
    nft_airdrop_enabled: false,
    post_actions_enabled: true,
    next_id_tip_enabled: true,

    using_emoji_flag: true,

    // we still need to handle image encoding
    v37PayloadDefaultEnabled: false, // new Date() > new Date('2022-07-01'),
    i18nTranslationHotUpdate: true,
    sandboxedPluginRuntime: insiderOnly,

    simplehash_ab_percentage: 50,
} as const

if (process.env.NODE_ENV === 'development') {
    console.log('Mask Network starts with flags:', flags)
}
