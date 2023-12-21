import { act, renderHook, waitFor } from '@testing-library/react'
import { useLiquidityProvider } from '../useLiquidityProvider'
import {
    AbstractProvider,
    BrowserProvider,
    Contract,
    JsonRpcSigner,
} from 'ethers'
import { Wallet } from '@/features/wallet'
import { NETWORKS } from '@/features/wallet/utils/networks'

let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

let wallet: Wallet = {
    defaultProvider: new AbstractProvider(),
    browserProvider: browserProvider.prototype,
    network: NETWORKS['sepolia'],
    signer: jsonRpcSigner.prototype,
    ready: true,
}

jest.mock('ethers')
jest.mock('@/features/pool', () => ({
    ...jest.requireActual('@/features/pool'),
    getPoolData: () => ({
        b0: 1000000000000000000n,
        b1: 500000000000000000n,
        liquidity: 500000000000000000000000000000000000n,
    }),
    getTotalTokens: () => 1500000000000000000n,
    getProviderData: () => 1500000000000000000n,
}))

test('available amounts values', async () => {
    const { result } = renderHook(() =>
        useLiquidityProvider(
            wallet,
            '18',
            '18',
            (Contract as jest.Mock).prototype
        )
    )

    await waitFor(() => {
        expect(result.current.availableT0).toBe('1')
    })
    expect(result.current.availableT1).toBe('0.5')
})

test('call withdraw', async () => {
    let mockPoolContract: Contract = new Contract('', '')
    ;(mockPoolContract as unknown as any).withdraw = jest.fn(() =>
        Promise.resolve()
    )

    const { result } = renderHook(() =>
        useLiquidityProvider(wallet, '18', '18', mockPoolContract)
    )

    await waitFor(() => {
        expect(result.current.availableT0).toBe('1')
    })
    expect(result.current.availableT1).toBe('0.5')

    act(() => {
        result.current.withdraw()
    })

    await waitFor(() => {
        expect(result.current.availableT0).toBe('0')
    })
    expect(result.current.availableT1).toBe('0')
})
