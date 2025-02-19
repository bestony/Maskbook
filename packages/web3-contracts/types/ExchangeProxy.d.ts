/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from 'bn.js'
import type { ContractOptions } from 'web3-eth-contract'
import type { EventLog } from 'web3-core'
import type { EventEmitter } from 'events'
import type {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types.js'

export interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type OwnershipTransferred = ContractEventLog<{
    previousOwner: string
    newOwner: string
    0: string
    1: string
}>

export interface ExchangeProxy extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): ExchangeProxy
    clone(): ExchangeProxy
    methods: {
        batchSwapExactIn(
            swaps: [string, string, string, number | string | BN, number | string | BN, number | string | BN][],
            tokenIn: string,
            tokenOut: string,
            totalAmountIn: number | string | BN,
            minTotalAmountOut: number | string | BN,
        ): PayableTransactionObject<string>

        batchSwapExactOut(
            swaps: [string, string, string, number | string | BN, number | string | BN, number | string | BN][],
            tokenIn: string,
            tokenOut: string,
            maxTotalAmountIn: number | string | BN,
        ): PayableTransactionObject<string>

        isOwner(): NonPayableTransactionObject<boolean>

        multihopBatchSwapExactIn(
            swapSequences: [
                string,
                string,
                string,
                number | string | BN,
                number | string | BN,
                number | string | BN,
            ][][],
            tokenIn: string,
            tokenOut: string,
            totalAmountIn: number | string | BN,
            minTotalAmountOut: number | string | BN,
        ): PayableTransactionObject<string>

        multihopBatchSwapExactOut(
            swapSequences: [
                string,
                string,
                string,
                number | string | BN,
                number | string | BN,
                number | string | BN,
            ][][],
            tokenIn: string,
            tokenOut: string,
            maxTotalAmountIn: number | string | BN,
        ): PayableTransactionObject<string>

        owner(): NonPayableTransactionObject<string>

        renounceOwnership(): NonPayableTransactionObject<void>

        setRegistry(_registry: string): NonPayableTransactionObject<void>

        smartSwapExactIn(
            tokenIn: string,
            tokenOut: string,
            totalAmountIn: number | string | BN,
            minTotalAmountOut: number | string | BN,
            nPools: number | string | BN,
        ): PayableTransactionObject<string>

        smartSwapExactOut(
            tokenIn: string,
            tokenOut: string,
            totalAmountOut: number | string | BN,
            maxTotalAmountIn: number | string | BN,
            nPools: number | string | BN,
        ): PayableTransactionObject<string>

        transferOwnership(newOwner: string): NonPayableTransactionObject<void>

        viewSplitExactIn(
            tokenIn: string,
            tokenOut: string,
            swapAmount: number | string | BN,
            nPools: number | string | BN,
        ): NonPayableTransactionObject<{
            swaps: [string, string, string, string, string, string][]
            totalOutput: string
            0: [string, string, string, string, string, string][]
            1: string
        }>

        viewSplitExactOut(
            tokenIn: string,
            tokenOut: string,
            swapAmount: number | string | BN,
            nPools: number | string | BN,
        ): NonPayableTransactionObject<{
            swaps: [string, string, string, string, string, string][]
            totalOutput: string
            0: [string, string, string, string, string, string][]
            1: string
        }>
    }
    events: {
        OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter
        OwnershipTransferred(options?: EventOptions, cb?: Callback<OwnershipTransferred>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'OwnershipTransferred', cb: Callback<OwnershipTransferred>): void
    once(event: 'OwnershipTransferred', options: EventOptions, cb: Callback<OwnershipTransferred>): void
}
