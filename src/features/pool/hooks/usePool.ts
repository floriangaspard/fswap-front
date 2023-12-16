import { useEffect, useState } from 'react'
import { Contract } from 'ethers'

import { Wallet } from '@/features/wallet'
import {
    checkAllowance,
    formatFromDecimals,
    isERC20,
    useDecimals,
} from '@/features/tokens'

import { DEPOSITE_STATE, DepositState } from '../types/DepositState'
import { tokenList } from '../../../constants/addresses'
import ERC20abi from '../../../constants/ERC20.json'
import { getAssetRatio, usePoolContract } from '@/features/pool'

export const usePool = (wallet: Wallet, token0: string, token1: string) => {
    const [currentDepositState, setCurrentDepositState] =
        useState<DepositState>(DEPOSITE_STATE.INITIAL)

    const decimals0 = useDecimals(token0, wallet)
    const decimals1 = useDecimals(token1, wallet)

    const [amount0, _setAmount0] = useState<string>('')
    const [amount1, _setAmount1] = useState<string>('')

    const { poolContract, poolAddress } = usePoolContract(
        wallet,
        token0,
        token1
    )

    const setAmount0 = async (amount: string) => {
        if (Number(amount) >= 0) _setAmount0(amount)
        if (Number(amount) > 0) {
            const ratio = await getAssetRatio(poolContract!)
            if (ratio !== 0) {
                _setAmount1((Number(amount) / ratio).toString())
            }
        } else _setAmount1('')
    }

    const setAmount1 = async (amount: string) => {
        if (Number(amount) >= 0) _setAmount1(amount)
        if (Number(amount) > 0) {
            const ratio = await getAssetRatio(poolContract!)
            if (ratio !== 0) {
                _setAmount0((Number(amount) * ratio).toString())
            }
        } else _setAmount0('')
    }

    const getButtonValue = () => {
        let value = 'Send to pool'
        if (
            !(currentDepositState === DEPOSITE_STATE.APPROVED) &&
            !(currentDepositState === DEPOSITE_STATE.INITIAL)
        ) {
            value = 'Approve '
            if (currentDepositState === DEPOSITE_STATE.APPROVE0)
                value = value + token0
            if (currentDepositState === DEPOSITE_STATE.APPROVE1)
                value = value + token1
        }
        return value
    }

    const onApprove = async () => {
        if (currentDepositState === DEPOSITE_STATE.APPROVE0) {
            const ERC20Contract = new Contract(
                tokenList[token0],
                ERC20abi,
                wallet.browserProvider
            )
            await ERC20Contract.Approve(poolAddress, 2n ** 256n - 1n)
        } else if (currentDepositState === DEPOSITE_STATE.APPROVE1) {
            const contract = new Contract(
                tokenList[token1],
                ERC20abi,
                wallet.signer
            )
            await contract.Approve(poolAddress, 2n ** 256n - 1n)
        }
        setCurrentDepositState((currentDepositState + 1) as DepositState)
    }

    const onSendToPool = async () => {
        let value = {}
        if (!isERC20(token0)) {
            value = {
                value: formatFromDecimals(Number(amount0), decimals0),
            }
        }
        await poolContract!.deposit(
            formatFromDecimals(Number(amount0), decimals0),
            formatFromDecimals(Number(amount1), decimals1),
            value
        )

        _setAmount0('')
        _setAmount1('')
    }

    useEffect(() => {
        const checkAmounts = async () => {
            if (Number(amount0) > 0 && Number(amount1) > 0) {
                const allowance0 = await checkAllowance(
                    token0,
                    formatFromDecimals(Number(amount0), decimals0),
                    wallet.signer!,
                    poolAddress!
                )
                const allowance1 = await checkAllowance(
                    token1,
                    formatFromDecimals(Number(amount1), decimals1),
                    wallet.signer!,
                    poolAddress!
                )
                if (allowance0 && allowance1) {
                    setCurrentDepositState(DEPOSITE_STATE.APPROVED)
                } else if (allowance0 && !allowance1) {
                    setCurrentDepositState(DEPOSITE_STATE.APPROVE1)
                } else {
                    setCurrentDepositState(DEPOSITE_STATE.APPROVE0)
                }
            } else {
                setCurrentDepositState(DEPOSITE_STATE.INITIAL)
            }
        }
        if (wallet.ready) checkAmounts()
    }, [
        amount0,
        amount1,
        decimals0,
        decimals1,
        poolAddress,
        wallet.ready,
        wallet.signer,
        token0,
        token1,
    ])

    return {
        amount0,
        setAmount0,
        amount1,
        setAmount1,
        currentDepositState,
        onApprove,
        onSendToPool,
        getButtonValue,
        poolContract,
    }
}
