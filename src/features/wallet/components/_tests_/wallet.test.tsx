import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Wallet, Web3Wallet } from '../Wallet'
import {
    AbstractProvider,
    BrowserProvider,
    JsonRpcSigner,
    getDefaultProvider,
} from 'ethers'
import { useWallet } from '../../hooks/useWallet'
import { NETWORKS } from '../../utils/networks'

jest.mock('ethers')
jest.mock('../../hooks/useWallet')

let connectWallet = jest.fn()

beforeEach(() => {
    let useWalletHook = useWallet as jest.Mock
    useWalletHook.mockImplementation(() => {
        return {
            connectWallet: connectWallet,
            switchNetwork: jest.fn(),
            address: '0x',
        }
    })
})

test('wallet is not connected', () => {
    let wallet: Wallet = {
        defaultProvider: getDefaultProvider(
            'https://eth-sepolia.g.alchemy.com/v2/vPBqSx5098yfObH6Gg3hud5qg9hW8Fum'
        ),
        browserProvider: null,
        network: 1n,
        signer: null,
        ready: false,
    }

    window.ethereum = { request: jest.fn(async () => []) }

    render(<Web3Wallet wallet={wallet} setWallet={jest.fn()} />)

    expect(screen.getByRole('button', { name: 'Connect Wallet' })).toBeDefined()
})

test('connect wallet', async () => {
    let wallet: Wallet = {
        defaultProvider: new AbstractProvider(),
        browserProvider: null,
        network: 0n,
        signer: null,
        ready: false,
    }

    render(<Web3Wallet wallet={wallet} setWallet={jest.fn()} />)

    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(connectWallet).toHaveBeenCalledTimes(1))
})

test('wallet is connected and is on the wrong network', () => {
    let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
    let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

    let wallet: Wallet = {
        defaultProvider: new AbstractProvider(),
        browserProvider: browserProvider.prototype,
        network: 0n,
        signer: jsonRpcSigner.prototype,
        ready: false,
    }

    render(<Web3Wallet wallet={wallet} setWallet={jest.fn()} />)
    expect(screen.getByRole('button', { name: 'Network' })).toBeDefined()
})

test('wallet is connected and is on the right network', () => {
    let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
    let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

    let wallet: Wallet = {
        defaultProvider: new AbstractProvider(),
        browserProvider: browserProvider.prototype,
        network: NETWORKS['sepolia'],
        signer: jsonRpcSigner.prototype,
        ready: true,
    }

    render(<Web3Wallet wallet={wallet} setWallet={jest.fn()} />)
    expect(screen.getByText('Sepolia')).toBeDefined()
})
