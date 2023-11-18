import { useEffect, useState } from 'react'
import { Contract } from 'ethers'

import { Wallet } from '@/features/wallet'
import {
    checkAllowance,
    formatFromDecimals,
    formatToDecimals,
    isERC20,
    useDecimals,
} from '@/features/tokens'
import { getPoolData, isFirstToken, usePoolContract } from '@/features/pool'

import ERC20abi from '../../../constants/ERC20.json'
import { tokenList } from '../../../constants/addresses'
import { SWAP_STATE, SwapState } from '../types/SwapState'

export const useSwap = (wallet: Wallet, token0: string, token1: string) => {
    const { poolContract, poolAddress } = usePoolContract(
        wallet,
        token0,
        token1
    )

    const [amount0, _setAmount0] = useState<string>('')
    const [amount1, _setAmount1] = useState<string>('')

    const decimals0 = useDecimals(token0, wallet)
    const decimals1 = useDecimals(token1, wallet)

    const [currentSwapState, setCurrentSwapState] = useState<SwapState>(
        SWAP_STATE.INITIAL
    )

    const getButtonValue = () => {
        let value = 'Swap'
        if (
            !(currentSwapState === SWAP_STATE.APPROVED) &&
            !(currentSwapState === SWAP_STATE.INITIAL)
        ) {
            value = 'Approve '
            if (currentSwapState === SWAP_STATE.APPROVE) value = value + token0
        }

        if (currentSwapState === SWAP_STATE.INSUFFICIENTLIQUIDITY)
            value = 'Insufficient liquidity'

        return value
    }

    const onApprove = async () => {
        const contract = new Contract(
            tokenList[token0],
            ERC20abi,
            wallet.signer
        )
        await contract.Approve(poolAddress!, 2n ** 256n - 1n)
        setCurrentSwapState((currentSwapState + 1) as SwapState)
    }

    const onSwap = async () => {
        let value = {}
        if (!isERC20(token0)) {
            value = {
                value: formatFromDecimals(Number(amount0), decimals0),
            }
        }

        await poolContract!.swap(
            isFirstToken(token0),
            formatFromDecimals(Number(amount0), decimals0),
            value
        )

        setCurrentSwapState(SWAP_STATE.SWAPPED)
    }

    const setAmount0 = async (amount: string) => {
        const amountn = formatFromDecimals(Number(amount), decimals0)

        if (Number(amount) >= 0) _setAmount0(amount)

        if (amountn > 0) {
            const { b0, b1, liquidity } = await getPoolData(poolContract!)

            if (isFirstToken(token0))
                _setAmount1(
                    formatToDecimals(
                        b1 - liquidity / (b0 + amountn),
                        decimals1
                    ).toString()
                )
            else
                _setAmount1(
                    formatToDecimals(
                        b0 - liquidity / (b1 + amountn),
                        decimals1
                    ).toString()
                )
        } else _setAmount1('')
    }

    const setAmount1 = async (amount: string) => {
        const amountn = formatFromDecimals(Number(amount), decimals1)
        if (Number(amount) >= 0) _setAmount1(amount)

        if (amountn > 0) {
            const { b0, b1, liquidity } = await getPoolData(poolContract!)

            if (isFirstToken(token1) && isERC20(token1) && amountn > b0)
                setCurrentSwapState(SWAP_STATE.INSUFFICIENTLIQUIDITY)
            else if (isERC20(token1) && amountn > b1)
                setCurrentSwapState(SWAP_STATE.INSUFFICIENTLIQUIDITY)
            else setCurrentSwapState(SWAP_STATE.INITIAL)

            if (isFirstToken(token0))
                _setAmount0(
                    Math.abs(
                        formatToDecimals(
                            b0 - liquidity / (b1 - amountn),
                            decimals0
                        )
                    ).toString()
                )
            else
                _setAmount0(
                    Math.abs(
                        formatToDecimals(
                            b1 - liquidity / (b0 - amountn),
                            decimals0
                        )
                    ).toString()
                )
        } else _setAmount0('')
    }

    useEffect(() => {
        const checkAmounts = async () => {
            if (Number(amount0) > 0 && Number(amount1) > 0) {
                const allowance = await checkAllowance(
                    token0,
                    formatFromDecimals(Number(amount0), decimals0),
                    wallet.signer!,
                    poolAddress!
                )
                if (allowance) {
                    setCurrentSwapState(SWAP_STATE.APPROVED)
                } else {
                    setCurrentSwapState(SWAP_STATE.APPROVE)
                }
            } else {
                setCurrentSwapState(SWAP_STATE.INITIAL)
            }
        }
        if (
            wallet.ready &&
            currentSwapState !== SWAP_STATE.INSUFFICIENTLIQUIDITY
        )
            checkAmounts()
    }, [
        amount0,
        amount1,
        currentSwapState,
        decimals0,
        poolAddress,
        token0,
        token1,
        wallet.ready,
        wallet.signer,
    ])

    return {
        amount0,
        setAmount0,
        amount1,
        setAmount1,
        currentSwapState,
        onApprove,
        onSwap,
        getButtonValue,
    }
}
