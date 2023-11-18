import { useEffect, useState } from 'react'
import { getDefaultProvider } from 'ethers'

import { Wallet, Web3Wallet } from '@/features/wallet'
import { Swap } from '@/features/swap'
import { Pool } from '@/features/pool'
import { Tab, Tabs } from '@/components/UI'
import { NETWORKS } from './features/wallet/utils/networks'

function App() {
    const defaultProvider = () => {
        return getDefaultProvider(
            'https://eth-sepolia.g.alchemy.com/v2/vPBqSx5098yfObH6Gg3hud5qg9hW8Fum'
        )
    }

    const [wallet, setWallet] = useState<Wallet>({
        defaultProvider: defaultProvider(),
        browserProvider: null,
        signer: null,
        network: 0n,
        ready: false,
    })

    const [activeTab, setActiveTab] = useState<Tab>(Tab.swap)

    useEffect(() => {
        const checkNetwork = async () => {
            if (wallet.browserProvider) {
                const chainId = (await wallet.browserProvider.getNetwork())
                    .chainId
                setWallet((w) => ({ ...w, network: chainId }))

                if (
                    wallet.browserProvider &&
                    wallet.signer &&
                    chainId === NETWORKS['sepolia']
                )
                    setWallet((w) => ({ ...w, network: chainId, ready: true }))
                else
                    setWallet((w) => ({ ...w, network: chainId, ready: false }))
            }
        }

        checkNetwork()
    }, [wallet.browserProvider, wallet.signer])

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload()
            })
        }
    })

    return (
        <div className="App flex text-center items-center flex-col h-screen justify-center bg-white">
            <div className="flex text-center flex-col bg-white p-5 rounded-md drop-shadow-lg w-[400px]">
                <Web3Wallet wallet={wallet} setWallet={setWallet} />
                <div className="w-full">
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="w-full">
                        {activeTab === Tab.swap ? (
                            <Swap wallet={wallet} />
                        ) : (
                            <Pool wallet={wallet} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
