import { Wallet, Web3Wallet } from '@/features/wallet'
import { NavLink, Outlet } from 'react-router-dom'

interface RootProps {
    wallet: Wallet
    setWallet: (value: React.SetStateAction<Wallet>) => void
}

export function Root(props: RootProps) {
    return (
        <div className="App flex text-center items-center flex-col h-screen justify-center bg-white">
            <div className="flex text-center flex-col bg-white p-5 rounded-md drop-shadow-lg w-[400px]">
                <Web3Wallet wallet={props.wallet} setWallet={props.setWallet} />
                <div className="w-full">
                    <div className="mb-8 flex text-2xl w-full">
                        <NavLink
                            className={({ isActive }) =>
                                isActive
                                    ? ' w-full bg-stone-100 p-4 rounded-md m-1 cursor-pointer bg-gradient-to-r from-cyan-100 to-blue-100'
                                    : 'w-full bg-stone-100 p-4 rounded-md m-1 cursor-pointer'
                            }
                            to={'swap'}
                        >
                            Swap
                        </NavLink>
                        <NavLink
                            className={({ isActive }) =>
                                isActive
                                    ? 'w-full bg-stone-100 p-4 rounded-md m-1 cursor-pointer bg-gradient-to-r from-cyan-100 to-blue-100'
                                    : 'w-full bg-stone-100 p-4 rounded-md m-1 cursor-pointer'
                            }
                            to={'pool'}
                        >
                            Pool
                        </NavLink>
                    </div>
                    <div className="w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
