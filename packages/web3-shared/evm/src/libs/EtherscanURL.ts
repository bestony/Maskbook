import type { ChainId } from '../types/index.js'
import { getEtherscanConstants } from '../constants/index.js'

export class EtherscanURL {
    /**
     * @deprecated Don't new EtherscanURL()
     * Use EtherscanURL.from() stead
     */
    constructor() {}

    static from(chainId: ChainId) {
        const { ETHERSCAN_URL = '' } = getEtherscanConstants(chainId)
        return ETHERSCAN_URL
    }
}
