import { useEffect, useState } from 'react'
import { Contract } from 'ethers'

import { Wallet } from '@/features/wallet'

import FSwapPool from '../../../constants/FSwapPool.json'
import { pools } from '../../../constants/addresses'

export const usePoolContract = (
    wallet: Wallet,
    token0: string,
    token1: string
) => {
    const [poolContract, setPoolContract] = useState<Contract | null>(null)
    const [poolAddress, setPoolAddress] = useState<string | undefined>(
        poolFromTokens(token0, token1)
    )

    function poolFromTokens(token0: string, token1: string) {
        return (
            pools.find((p) => p.token0 === token0 && p.token1 === token1)
                ?.pool ??
            pools.find((p) => p.token0 === token1 && p.token1 === token0)?.pool
        )
    }

    useEffect(() => {
        setPoolContract(
            new Contract(
                poolAddress!,
                FSwapPool.abi,
                wallet.ready ? wallet.signer : wallet.defaultProvider
            )
        )
    }, [wallet.signer, poolAddress, wallet.defaultProvider, wallet.ready])

    useEffect(() => {
        setPoolAddress(poolFromTokens(token0, token1))
    }, [token0, token1])

    return { poolContract, poolAddress }
}
