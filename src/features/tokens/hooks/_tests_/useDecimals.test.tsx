import { renderHook, waitFor } from '@testing-library/react'
import { useDecimals } from '../useDecimals'
import { Wallet } from '@/features/wallet'
import {
    AbstractProvider,
    BrowserProvider,
    Contract,
    JsonRpcSigner,
} from 'ethers'
import { NETWORKS } from '@/features/wallet/utils/networks'

jest.mock('ethers')

test('get ERC20 token decimals', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return { decimals: jest.fn(() => Promise.resolve('15')) }
    })

    let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
    let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

    let wallet: Wallet = {
        defaultProvider: new AbstractProvider(),
        browserProvider: browserProvider.prototype,
        network: NETWORKS['sepolia'],
        signer: jsonRpcSigner.prototype,
        ready: true,
    }

    const { result } = renderHook(() => useDecimals('FTK', wallet))

    await waitFor(() => expect(result.current).toBe('15'))
})

test('get ETH decimals', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return { decimals: jest.fn(() => Promise.resolve('15')) }
    })

    let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
    let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

    let wallet: Wallet = {
        defaultProvider: new AbstractProvider(),
        browserProvider: browserProvider.prototype,
        network: NETWORKS['sepolia'],
        signer: jsonRpcSigner.prototype,
        ready: true,
    }

    const { result } = renderHook(() => useDecimals('ETH', wallet))

    await waitFor(() => {
        expect(result.current).not.toBe('15')
    })

    expect(result.current).toBe('18')
})
