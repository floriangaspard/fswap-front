import { Wallet } from '@/features/wallet'
import { NETWORKS } from '@/features/wallet/utils/networks'
import { act, renderHook, waitFor } from '@testing-library/react'
import {
    AbstractProvider,
    BrowserProvider,
    Contract,
    JsonRpcSigner,
} from 'ethers'
import { useSwap } from '../useSwap'
import { useDecimals } from '@/features/tokens'
import { SWAP_STATE } from '../../types/SwapState'

jest.mock('ethers')
jest.mock('@/features/tokens/hooks/useDecimals')

jest.mock('@/constants/addresses', () => ({
    tokenList: { AAA: '0x01', BBB: '0x02', CCC: '0x03' },
    pools: [
        {
            token0: 'AAA',
            token1: 'BBB',
            pool: '0x001',
        },
        {
            token0: 'BBB',
            token1: 'CCC',
            pool: '0x002',
        },
    ],
}))

jest.mock('@/features/pool', () => ({
    ...jest.requireActual('@/features/pool'),
    getPoolData: () => ({
        b0: 1000000000000000000n,
        b1: 500000000000000000n,
        liquidity: 500000000000000000000000000000000000n,
    }),
    usePoolContract: () => ({
        poolContract: {
            swap: jest.fn(() => Promise.resolve()),
        },
        poolAddress: '0x001',
    }),
}))

let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

let wallet: Wallet = {
    defaultProvider: new AbstractProvider(),
    browserProvider: browserProvider.prototype,
    network: NETWORKS['sepolia'],
    signer: jsonRpcSigner.prototype,
    ready: true,
}

beforeEach(() => {
    ;(useDecimals as jest.Mock).mockImplementation(() => '15')
})

test('initial values', () => {
    const { result } = renderHook(() => useSwap(wallet, 'AAA', 'BBB'))

    expect(result.current.amount0).toBe('')
    expect(result.current.amount1).toBe('')
    expect(result.current.currentSwapState).toBe(SWAP_STATE.INITIAL)
    expect(result.current.getButtonValue()).toBe('Swap')
})

test('set valid token0 amount', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('10000000000000000')),
        }
    })

    const { result } = renderHook(() => useSwap(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount0('10')
    })

    expect(result.current.amount0).toBe('10')

    await waitFor(() => {
        expect(result.current.amount1).toBe('4.950495049504951')
    })

    expect(result.current.currentSwapState).toBe(SWAP_STATE.APPROVED)
    expect(result.current.getButtonValue()).toBe('Swap')
})

test('set valid token1 amount', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('10000000000000000')),
        }
    })

    const { result } = renderHook(() => useSwap(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount1('4.950495049504951')
    })

    expect(result.current.amount1).toBe('4.950495049504951')

    await waitFor(() => {
        expect(result.current.amount0).toBe('10')
    })

    expect(result.current.currentSwapState).toBe(SWAP_STATE.APPROVED)
    expect(result.current.getButtonValue()).toBe('Swap')
})

test('set valid token0 amount inverse tokens', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('10000000000000000')),
        }
    })

    const { result } = renderHook(() => useSwap(wallet, 'BBB', 'AAA'))

    act(() => {
        result.current.setAmount0('10')
    })

    expect(result.current.amount0).toBe('10')

    await waitFor(() => {
        expect(result.current.amount1).toBe('19.607843137254903')
    })

    expect(result.current.currentSwapState).toBe(SWAP_STATE.APPROVED)
    expect(result.current.getButtonValue()).toBe('Swap')
})

test('set valid token1 amount inverse tokens', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('10000000000000000')),
        }
    })

    const { result } = renderHook(() => useSwap(wallet, 'BBB', 'AAA'))

    act(() => {
        result.current.setAmount1('19.607843137254903')
    })

    expect(result.current.amount1).toBe('19.607843137254903')

    await waitFor(() => {
        expect(result.current.amount0).toBe('10')
    })

    expect(result.current.currentSwapState).toBe(SWAP_STATE.APPROVED)
    expect(result.current.getButtonValue()).toBe('Swap')
})

test('set token1 amount insufficient liquidity', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('10000000000000000')),
        }
    })

    const { result } = renderHook(() => useSwap(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount1('500000000000000001')
    })

    expect(result.current.amount1).toBe('500000000000000001')

    await waitFor(() => {
        expect(result.current.currentSwapState).toBe(
            SWAP_STATE.INSUFFICIENTLIQUIDITY
        )
    })
    expect(result.current.getButtonValue()).toBe('Insufficient liquidity')
})

test('approve token', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('1000000000000000')),
            approve: jest.fn(() => Promise.resolve()),
        }
    })

    const { result } = renderHook(() => useSwap(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount0('10')
    })

    expect(result.current.amount0).toBe('10')

    await waitFor(() => {
        expect(result.current.currentSwapState).toBe(SWAP_STATE.APPROVE)
    })

    expect(result.current.getButtonValue()).toBe('Approve AAA')

    act(() => {
        result.current.onApprove()
    })
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('10000000000000000')),
        }
    })

    await waitFor(() => {
        expect(result.current.currentSwapState).toBe(SWAP_STATE.APPROVED)
    })
    expect(result.current.getButtonValue()).toBe('Swap')
})

test('swap token', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('10000000000000000')),
        }
    })

    const { result } = renderHook(() => useSwap(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount0('10')
    })

    expect(result.current.amount0).toBe('10')

    await waitFor(() => {
        expect(result.current.currentSwapState).toBe(SWAP_STATE.APPROVED)
    })

    expect(result.current.getButtonValue()).toBe('Swap')

    act(() => {
        result.current.onSwap()
    })

    await waitFor(() => {
        expect(result.current.currentSwapState).toBe(SWAP_STATE.INITIAL)
    })

    expect(result.current.getButtonValue()).toBe('Swap')
    expect(result.current.amount0).toBe('')
    expect(result.current.amount1).toBe('')
})
