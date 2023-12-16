import { act, renderHook, waitFor } from '@testing-library/react'
import { usePool } from '../usePool'
import {
    AbstractProvider,
    BrowserProvider,
    Contract,
    JsonRpcSigner,
} from 'ethers'
import { Wallet } from '@/features/wallet'
import { NETWORKS } from '@/features/wallet/utils/networks'
import { useDecimals } from '@/features/tokens'
import { DEPOSITE_STATE } from '../../types/DepositState'

jest.mock('ethers')
jest.mock('@/features/tokens/hooks/useDecimals')

jest.mock('@/features/pool', () => ({
    ...jest.requireActual('@/features/pool'),
    getAssetRatio: () => Promise.resolve(0.5),
    usePoolContract: () => ({
        poolContract: {
            deposit: jest.fn(() => Promise.resolve()),
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
    const { result } = renderHook(() => usePool(wallet, 'AAA', 'BBB'))

    expect(result.current.amount0).toBe('')
    expect(result.current.amount1).toBe('')
    expect(result.current.currentDepositState).toBe(0)
    expect(result.current.getButtonValue()).toBe('Send to pool')
})

test('set valid token0 amount', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('4000000000000000000')),
        }
    })

    const { result } = renderHook(() => usePool(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount0('2000')
    })

    expect(result.current.amount0).toBe('2000')

    await waitFor(() => {
        expect(result.current.amount1).toBe('4000')
    })

    expect(result.current.currentDepositState).toBe(DEPOSITE_STATE.APPROVED)
})

test('set valid token1 amount', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('4000000000000000000')),
        }
    })

    const { result } = renderHook(() => usePool(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount1('4000')
    })

    expect(result.current.amount1).toBe('4000')

    await waitFor(() => {
        expect(result.current.amount0).toBe('2000')
    })

    expect(result.current.currentDepositState).toBe(DEPOSITE_STATE.APPROVED)
})

test('approve tokens', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('1000000000000000000')),
        }
    })

    const { result } = renderHook(() => usePool(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount0('2000')
    })

    expect(result.current.amount0).toBe('2000')

    await waitFor(() => {
        expect(result.current.amount1).toBe('4000')
    })

    expect(result.current.currentDepositState).toBe(DEPOSITE_STATE.APPROVE0)
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('2000000000000000000')),
            approve: jest.fn(),
        }
    })

    act(() => {
        result.current.onApprove()
    })

    await waitFor(() => {
        expect(result.current.currentDepositState).toBe(DEPOSITE_STATE.APPROVE1)
    })
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('4000000000000000000')),
            approve: jest.fn(),
        }
    })

    act(() => {
        result.current.onApprove()
    })

    await waitFor(() => {
        expect(result.current.currentDepositState).toBe(DEPOSITE_STATE.APPROVED)
    })
})

test('deposit tokens', async () => {
    ;(Contract as jest.Mock).mockImplementation(() => {
        return {
            allowance: jest.fn(() => Promise.resolve('4000000000000000000')),
        }
    })

    const { result } = renderHook(() => usePool(wallet, 'AAA', 'BBB'))

    act(() => {
        result.current.setAmount0('2000')
    })

    expect(result.current.amount0).toBe('2000')

    await waitFor(() => {
        expect(result.current.currentDepositState).toBe(DEPOSITE_STATE.APPROVED)
    })

    act(() => {
        result.current.onSendToPool()
    })

    await waitFor(() => {
        expect(result.current.currentDepositState).toBe(DEPOSITE_STATE.INITIAL)
    })

    expect(result.current.amount0).toBe('')
    expect(result.current.amount1).toBe('')
})
