import { Wallet } from '@/features/wallet'
import { useEffect, useState } from 'react'
import {
    getPoolData,
    getProviderData,
    getTotalTokens,
} from '../utils/poolFunctions'
import { Contract } from 'ethers'

interface ProviderProps {
    wallet: Wallet
    token0: string
    token1: string
    poolContract: Contract | null
}

export const Provider = (props: ProviderProps) => {
    const [availableT0, setAvailableT0] = useState('0')
    const [availableT1, setAvailableT1] = useState('0')

    useEffect(() => {
        const fetchProviderData = async () => {
            const { b0, b1 } = await getPoolData(props.poolContract!)
            const tokens = await getTotalTokens(props.poolContract!)
            const liquidityProvided = await getProviderData(
                props.poolContract!,
                props.wallet.signer?.address!
            )
            let share = 0n
            if (liquidityProvided !== 0n) share = tokens / liquidityProvided
            setAvailableT0((share * b0).toString())
            setAvailableT1((share * b1).toString())
        }

        if (props.poolContract && props.wallet.ready) fetchProviderData()
    }, [props.poolContract, props.wallet])

    return <div></div>
}
