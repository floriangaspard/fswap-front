import { Contract, JsonRpcSigner } from 'ethers'

import ERC20abi from '../../../constants/ERC20.json'
import { tokenList } from '../../../constants/addresses'

export const isERC20 = (token: string) => {
    return tokenList[token] !== '0x0000000000000000000000000000000000000000'
}

export const formatFromDecimals = (amount: number, decimals: string) => {
    return BigInt(Math.round(amount * 10 ** parseInt(decimals)))
}

export const formatToDecimals = (amount: bigint, decimals: string) => {
    return Number(amount) / Number(10n ** BigInt(decimals))
}

export const getDecimals = async (token: string, contract: Contract) => {
    if (isERC20(token)) return await contract.decimals()
    return '18'
}

export const checkAllowance = async (
    token: string,
    amount: bigint,
    signer: JsonRpcSigner,
    poolAddress: string | undefined
) => {
    let allowance = true
    if (isERC20(token)) {
        const tokenContract = new Contract(tokenList[token], ERC20abi, signer)
        const tokenAllowance = await tokenContract.allowance(
            signer.address,
            poolAddress
        )
        if (BigInt(tokenAllowance) < amount) {
            allowance = false
        }
    }
    return allowance
}
