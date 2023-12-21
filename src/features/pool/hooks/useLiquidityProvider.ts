import { useEffect, useState } from 'react'
import { getPoolData, getProviderData, getTotalTokens } from '@/features/pool'
import { Wallet } from '@/features/wallet'
import { Contract } from 'ethers'
import { formatToDecimals } from '@/features/tokens'

export const useLiquidityProvider = (
    wallet: Wallet,
    decimals0: string,
    decimals1: string,
    poolContract: Contract | null
) => {
    const [availableT0, setAvailableT0] = useState('0')
    const [availableT1, setAvailableT1] = useState('0')

    const withdraw = async () => {
        await poolContract!.withdraw()
        setAvailableT0('0')
        setAvailableT1('0')
    }

    useEffect(() => {
        const fetchProviderData = async () => {
            const { b0, b1 } = await getPoolData(poolContract!)
            const tokens = await getTotalTokens(poolContract!)
            const liquidityProvided = await getProviderData(
                poolContract!,
                wallet.signer?.address!
            )
            let share = 0n
            if (liquidityProvided !== 0n) share = tokens / liquidityProvided
            setAvailableT0(formatToDecimals(share * b0, decimals0).toString())
            setAvailableT1(formatToDecimals(share * b1, decimals1).toString())
        }

        if (poolContract && wallet.ready) fetchProviderData()
    }, [decimals0, decimals1, poolContract, wallet])

    return { availableT0, availableT1, withdraw }
}
