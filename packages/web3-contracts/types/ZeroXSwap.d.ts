/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types.js'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type QuoteSignerUpdated = ContractEventLog<{
    quoteSigner: string
    0: string
}>
export type TransformedERC20 = ContractEventLog<{
    taker: string
    inputToken: string
    outputToken: string
    inputTokenAmount: string
    outputTokenAmount: string
    0: string
    1: string
    2: string
    3: string
    4: string
}>
export type TransformerDeployerUpdated = ContractEventLog<{
    transformerDeployer: string
    0: string
}>

export interface ZeroXSwap extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): ZeroXSwap
    clone(): ZeroXSwap
    methods: {
        FEATURE_NAME(): NonPayableTransactionObject<string>

        FEATURE_VERSION(): NonPayableTransactionObject<string>

        _transformERC20(
            args: [
                string,
                string,
                string,
                number | string | BN,
                number | string | BN,
                [number | string | BN, string | number[]][],
                boolean,
                string,
            ],
        ): PayableTransactionObject<string>

        createTransformWallet(): NonPayableTransactionObject<string>

        getQuoteSigner(): NonPayableTransactionObject<string>

        getTransformWallet(): NonPayableTransactionObject<string>

        getTransformerDeployer(): NonPayableTransactionObject<string>

        migrate(transformerDeployer: string): NonPayableTransactionObject<string>

        setQuoteSigner(quoteSigner: string): NonPayableTransactionObject<void>

        setTransformerDeployer(transformerDeployer: string): NonPayableTransactionObject<void>

        transformERC20(
            inputToken: string,
            outputToken: string,
            inputTokenAmount: number | string | BN,
            minOutputTokenAmount: number | string | BN,
            transformations: [number | string | BN, string | number[]][],
        ): PayableTransactionObject<string>

        transformERC20Staging(
            inputToken: string,
            outputToken: string,
            inputTokenAmount: number | string | BN,
            minOutputTokenAmount: number | string | BN,
            transformations: [number | string | BN, string | number[]][],
        ): PayableTransactionObject<string>

        sellToUniswap(
            tokens: string[],
            sellAmount: number | string | BN,
            minBuyAmount: number | string | BN,
            isSushi: boolean,
        ): PayableTransactionObject<void>

        sellToPancakeSwap(
            tokens: string[],
            sellAmount: number | string | BN,
            minBuyAmount: number | string | BN,
            fork: number | string | BN,
        ): PayableTransactionObject<void>
    }
    events: {
        QuoteSignerUpdated(cb?: Callback<QuoteSignerUpdated>): EventEmitter
        QuoteSignerUpdated(options?: EventOptions, cb?: Callback<QuoteSignerUpdated>): EventEmitter

        TransformedERC20(cb?: Callback<TransformedERC20>): EventEmitter
        TransformedERC20(options?: EventOptions, cb?: Callback<TransformedERC20>): EventEmitter

        TransformerDeployerUpdated(cb?: Callback<TransformerDeployerUpdated>): EventEmitter
        TransformerDeployerUpdated(options?: EventOptions, cb?: Callback<TransformerDeployerUpdated>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'QuoteSignerUpdated', cb: Callback<QuoteSignerUpdated>): void
    once(event: 'QuoteSignerUpdated', options: EventOptions, cb: Callback<QuoteSignerUpdated>): void

    once(event: 'TransformedERC20', cb: Callback<TransformedERC20>): void
    once(event: 'TransformedERC20', options: EventOptions, cb: Callback<TransformedERC20>): void

    once(event: 'TransformerDeployerUpdated', cb: Callback<TransformerDeployerUpdated>): void
    once(event: 'TransformerDeployerUpdated', options: EventOptions, cb: Callback<TransformerDeployerUpdated>): void
}
