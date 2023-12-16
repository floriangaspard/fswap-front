import { TokenSelect, TokenInput, useTokenSelector } from '@/features/tokens'
import { Wallet } from '@/features/wallet'

import { tokenList } from '../../../constants/addresses'
import { usePool } from '../hooks/usePool'
import { DEPOSITE_STATE } from '../types/DepositState'
import { Provider } from './Provider'

interface PoolProps {
    wallet: Wallet
}

export function Pool(props: PoolProps) {
    const { token0, setToken0, token1, setToken1 } = useTokenSelector()
    const {
        amount0,
        setAmount0,
        amount1,
        setAmount1,
        currentDepositState,
        onApprove,
        onSendToPool,
        getButtonValue,
        poolContract,
    } = usePool(props.wallet, token0, token1)

    return (
        <div>
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
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 w-full rounded-md disabled:text-stone-300 mt-4 text-xl text-white"
                    onClick={
                        currentDepositState === DEPOSITE_STATE.APPROVE0 ||
                        currentDepositState === DEPOSITE_STATE.APPROVE1
                            ? onApprove
                            : onSendToPool
                    }
                    disabled={
                        currentDepositState === DEPOSITE_STATE.INITIAL ||
                        !props.wallet.ready
                    }
                >
                    {getButtonValue()}
                </button>
            </div>
            <Provider
                token0={token0}
                token1={token1}
                wallet={props.wallet}
                poolContract={poolContract}
            />
        </div>
    )
}
