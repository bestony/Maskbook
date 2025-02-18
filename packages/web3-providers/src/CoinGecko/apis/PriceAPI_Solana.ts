import type { HubOptions } from '@masknet/web3-shared-base'
import { type ChainId, getCoinGeckoConstants, isNativeTokenAddress } from '@masknet/web3-shared-solana'
import { getTokenPriceByCoinId, getTokenPrice } from './base.js'
import type { PriceAPI } from '../../entry-types.js'

export class CoinGeckoPriceAPI_Solana implements PriceAPI.Provider<ChainId> {
    getFungibleTokenPrice(
        chainId: ChainId,
        address: string,
        options?: HubOptions<ChainId> | undefined,
    ): Promise<number> {
        const { PLATFORM_ID = '', COIN_ID = '' } = getCoinGeckoConstants(options?.chainId ?? chainId)

        if (isNativeTokenAddress(address)) {
            return getTokenPriceByCoinId(COIN_ID, options?.currencyType)
        }
        return getTokenPrice(PLATFORM_ID, address, options?.currencyType)
    }
}
