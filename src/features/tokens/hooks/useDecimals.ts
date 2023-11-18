import { useEffect, useState } from 'react'
import { Contract } from 'ethers'

import { Wallet } from '@/features/wallet'
import { getDecimals } from '@/features/tokens'

import ERC20abi from '../../../constants/ERC20.json'
import { tokenList } from '../../../constants/addresses'

export const useDecimals = (token: string, wallet: Wallet) => {
    const [decimals, setDecimals] = useState<string>('18')

    useEffect(() => {
        const awaitDecimals = async () => {
            const decimals = await getDecimals(
                token,
                new Contract(
                    tokenList[token],
                    ERC20abi,
                    wallet.browserProvider ?? wallet.defaultProvider
                )
            )

            setDecimals(decimals)
        }

        if (wallet.ready) awaitDecimals()
    }, [token, wallet.browserProvider, wallet.defaultProvider, wallet.ready])

    return decimals
}
