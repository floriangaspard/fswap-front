import { TokenSelect, TokenInput, useTokenSelector } from '@/features/tokens'
import { Wallet } from '@/features/wallet'

import { tokenList } from '../../../constants/addresses'
import { useSwap } from '../hooks/useSwap'
import { SWAP_STATE } from '../types/SwapState'

interface SwapProps {
    wallet: Wallet
}

export function Swap(props: SwapProps) {
    const { token0, setToken0, token1, setToken1 } = useTokenSelector()
    const {
        amount0,
        setAmount0,
        amount1,
        setAmount1,
        currentSwapState,
        onApprove,
        onSwap,
        getButtonValue,
    } = useSwap(props.wallet, token0, token1)

    return (
        <div>
            <div className="bg-stone-100 rounded-md mb-2 flex justify-between pr-2">
                <TokenInput amount={amount0} setAmount={setAmount0} />
                <TokenSelect
                    token={token0}
                    setToken={setToken0}
                    tokenList={tokenList}
                />
            </div>
            <div className="bg-stone-100 rounded-md mb-2 flex justify-between pr-2">
                <TokenInput amount={amount1} setAmount={setAmount1} />
                <TokenSelect
                    token={token1}
                    setToken={setToken1}
                    tokenList={tokenList}
                />
            </div>
            <button
                className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 w-full rounded-md  disabled:text-stone-300 mt-4 text-xl text-white"
                onClick={
                    currentSwapState === SWAP_STATE.APPROVE ? onApprove : onSwap
                }
                disabled={
                    currentSwapState === SWAP_STATE.INITIAL ||
                    currentSwapState === SWAP_STATE.INSUFFICIENTLIQUIDITY ||
                    !props.wallet.ready
                }
            >
                {getButtonValue()}
            </button>
        </div>
    )
}
