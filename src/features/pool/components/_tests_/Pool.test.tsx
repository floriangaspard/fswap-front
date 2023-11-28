import { Wallet } from '@/features/wallet'
import { NETWORKS } from '@/features/wallet/utils/networks'
import { AbstractProvider, BrowserProvider, JsonRpcSigner } from 'ethers'
import { usePool } from '../../hooks/usePool'
import { fireEvent, render, screen } from '@testing-library/react'
import { Pool } from '../Pool'

jest.mock('../../hooks/usePool')

let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

let wallet: Wallet = {
    defaultProvider: new AbstractProvider(),
    browserProvider: browserProvider.prototype,
    network: NETWORKS['sepolia'],
    signer: jsonRpcSigner.prototype,
    ready: true,
}

test('render deposit button disabled', async () => {
    ;(usePool as jest.Mock).mockImplementation(() => ({
        amount0: '',
        setAmount0: jest.fn(),
        amount1: '',
        setAmount1: jest.fn(),
        currentDepositState: 0,
        onApprove: jest.fn(),
        onSendToPool: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Pool wallet={wallet} />)

    expect(await screen.findAllByRole('spinbutton')).toHaveLength(2)
    expect(await screen.findAllByRole('combobox')).toHaveLength(2)
    expect(await screen.findByRole('button')).toBeDisabled()
})

test('render deposit button approve0 state', async () => {
    ;(usePool as jest.Mock).mockImplementation(() => ({
        amount0: '111',
        setAmount0: jest.fn(),
        amount1: '222',
        setAmount1: jest.fn(),
        currentDepositState: 1,
        onApprove: jest.fn(),
        onSendToPool: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Pool wallet={wallet} />)

    expect((await screen.findAllByRole('spinbutton'))[0]).toHaveValue(111)
    expect((await screen.findAllByRole('spinbutton'))[1]).toHaveValue(222)
    expect(await screen.findAllByRole('combobox')).toHaveLength(2)
    expect(await screen.findByRole('button')).not.toBeDisabled()
})

test('render deposit button approve1 state', async () => {
    ;(usePool as jest.Mock).mockImplementation(() => ({
        amount0: '111',
        setAmount0: jest.fn(),
        amount1: '222',
        setAmount1: jest.fn(),
        currentDepositState: 2,
        onApprove: jest.fn(),
        onSendToPool: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Pool wallet={wallet} />)

    expect((await screen.findAllByRole('spinbutton'))[0]).toHaveValue(111)
    expect((await screen.findAllByRole('spinbutton'))[1]).toHaveValue(222)
    expect(await screen.findAllByRole('combobox')).toHaveLength(2)
    expect(await screen.findByRole('button')).not.toBeDisabled()
})

test('render deposit button approved state', async () => {
    ;(usePool as jest.Mock).mockImplementation(() => ({
        amount0: '111',
        setAmount0: jest.fn(),
        amount1: '222',
        setAmount1: jest.fn(),
        currentDepositState: 3,
        onApprove: jest.fn(),
        onSendToPool: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Pool wallet={wallet} />)

    expect((await screen.findAllByRole('spinbutton'))[0]).toHaveValue(111)
    expect((await screen.findAllByRole('spinbutton'))[1]).toHaveValue(222)
    expect(await screen.findAllByRole('combobox')).toHaveLength(2)
    expect(await screen.findByRole('button')).not.toBeDisabled()
})

test('render deposit button value', async () => {
    ;(usePool as jest.Mock).mockImplementation(() => ({
        amount0: '111',
        setAmount0: jest.fn(),
        amount1: '222',
        setAmount1: jest.fn(),
        currentDepositState: 2,
        onApprove: jest.fn(),
        onSendToPool: jest.fn(),
        getButtonValue: () => 'button value',
    }))

    render(<Pool wallet={wallet} />)

    expect(await screen.findByRole('button')).toHaveTextContent('button value')
})

test('click approve button', async () => {
    const mockOnApprove = jest.fn()
    ;(usePool as jest.Mock).mockImplementation(() => ({
        amount0: '111',
        setAmount0: jest.fn(),
        amount1: '222',
        setAmount1: jest.fn(),
        currentDepositState: 2,
        onApprove: mockOnApprove,
        onSendToPool: jest.fn(),
        getButtonValue: () => 'button value',
    }))

    render(<Pool wallet={wallet} />)

    fireEvent.click(await screen.findByRole('button'))
    expect(mockOnApprove).toBeCalledTimes(1)
})

test('click deposit button', async () => {
    const mockOnSendToPool = jest.fn()
    ;(usePool as jest.Mock).mockImplementation(() => ({
        amount0: '111',
        setAmount0: jest.fn(),
        amount1: '222',
        setAmount1: jest.fn(),
        currentDepositState: 3,
        onApprove: jest.fn(),
        onSendToPool: mockOnSendToPool,
        getButtonValue: () => 'button value',
    }))

    render(<Pool wallet={wallet} />)

    fireEvent.click(await screen.findByRole('button'))
    expect(mockOnSendToPool).toBeCalledTimes(1)
})
