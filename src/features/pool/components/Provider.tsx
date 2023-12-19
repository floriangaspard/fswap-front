import { Wallet } from '@/features/wallet'
import { Contract } from 'ethers'
import { useLiquidityProvider } from '../hooks/useLiquidityProvider'

interface ProviderProps {
    wallet: Wallet
    token0: string
    token1: string
    decimals0: string
    decimals1: string
    poolContract: Contract | null
}

export const Provider = (props: ProviderProps) => {
    const { availableT0, availableT1, withdraw } = useLiquidityProvider(
        props.wallet,
        props.decimals0,
        props.decimals1,
        props.poolContract
    )

    return props.wallet.ready && availableT0 !== '0' && availableT1 !== '0' ? (
        <div className="mt-7 p-5 text-left border-t-black border-t-2 ">
            <h2 className="text-2xl mb-4 ">Your liquidity</h2>
            <div className="p-4 rounded-md m-1 shadow-md bg-cyan-50">
                <div className="mb-5 text-lg flex justify-between">
                    <span>{props.token0}</span>
                    <span>{availableT0}</span>
                </div>
                <div className="text-lg flex justify-between">
                    <span>{props.token1}</span>
                    <span>{availableT1}</span>
                </div>
            </div>
            <button
                className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 w-full rounded-md mt-4 text-xl text-white"
                onClick={withdraw}
            >
                Withdraw
            </button>
        </div>
    ) : (
        <></>
    )
}
