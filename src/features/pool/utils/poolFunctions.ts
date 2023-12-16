import { Contract } from 'ethers'

import { pools } from '../../../constants/addresses'

export const getAssetRatio = async (poolContract: Contract) => {
    const b0 = parseInt(await poolContract!.balance0())
    const b1 = parseInt(await poolContract!.balance1())

    let ratio = 0

    if (b0 !== 0 && b1 !== 0) {
        ratio = b0 / b1
    }

    return ratio
}

export const isFirstToken = (token0: string, token1: string) => {
    if (
        pools.find((t) => t.token0 === token0 && t.token1 === token1) !==
        undefined
    ) {
        return true
    }
    return false
}

export const getPoolBalances = async (poolContract: Contract) => {
    const b0 = BigInt(await poolContract!.balance0())
    const b1 = BigInt(await poolContract!.balance1())

    return { b0, b1 }
}

export const getPoolData = async (poolContract: Contract) => {
    const { b0, b1 } = await getPoolBalances(poolContract!)
    const liquidity = BigInt(await poolContract!.liquidity())

    return { b0, b1, liquidity }
}

export const getProviderData = async (
    poolContract: Contract,
    address: string
) => {
    return BigInt(await poolContract.providers(address))
}

export const getTotalTokens = async (poolContract: Contract) => {
    return BigInt(await poolContract.tokens())
}
