import { render, screen } from '@testing-library/react'
import { Root } from '../root'
import { AbstractProvider, BrowserProvider, JsonRpcSigner } from 'ethers'
import { Wallet } from '@/features/wallet'
import { NETWORKS } from '@/features/wallet/utils/networks'
import { BrowserRouter } from 'react-router-dom'

let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

let wallet: Wallet = {
    defaultProvider: new AbstractProvider(),
    browserProvider: browserProvider.prototype,
    network: NETWORKS['sepolia'],
    signer: jsonRpcSigner.prototype,
    ready: true,
}

test('render root', async () => {
    render(<Root wallet={wallet} setWallet={jest.fn()} />, {
        wrapper: BrowserRouter,
    })

    expect(await screen.findAllByRole('link')).toHaveLength(2)
    expect(await screen.findByText('Wallet')).toBeDefined()
    expect(await screen.findByText('Swap')).toBeDefined()
})
