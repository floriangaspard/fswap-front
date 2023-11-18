import { useEffect, useState } from 'react'
import { BrowserProvider } from 'ethers'

import { Wallet } from '../components/Wallet'

export const useWallet = (
    wallet: Wallet,
    setWallet: (wallet: React.SetStateAction<Wallet>) => void
) => {
    const [address, setAddress] = useState<string>('')

    const connectWallet = async () => {
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        setWallet((w: Wallet) => ({
            ...w,
            browserProvider: provider,
            signer,
        }))
        let accounts = await provider.send('eth_requestAccounts', [])
        setAddress(accounts[0])
    }

    const checkConnection = async () => {
        const accounts = await window.ethereum.request({
            method: 'eth_accounts',
        })
        if (accounts.length > 0) connectWallet()
    }

    const switchNetwork = async (id: string) => {
        window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: '0xaa36a7',
                },
            ],
        })
    }

    useEffect(() => {
        if (wallet.browserProvider == null && wallet.signer === null)
            checkConnection()
    }, [])

    return { connectWallet, switchNetwork, address }
}
