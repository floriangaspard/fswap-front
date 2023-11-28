import { useEffect, useState } from 'react'
import { getDefaultProvider } from 'ethers'

import { Wallet } from '@/features/wallet'
import { Swap } from '@/features/swap'
import { NETWORKS } from './features/wallet/utils/networks'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Root } from './routes/root'
import { Pool } from './features/pool'

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

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root wallet={wallet} setWallet={setWallet} />,
            children: [
                { index: true, element: <Navigate to="/swap" replace /> },
                {
                    path: 'swap',
                    element: <Swap wallet={wallet} />,
                },
                {
                    path: 'pool',
                    element: <Pool wallet={wallet} />,
                },
            ],
        },
    ])

    return <RouterProvider router={router} />
}

export default App
