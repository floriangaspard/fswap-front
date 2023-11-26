import { fireEvent, render, screen } from '@testing-library/react'
import { Swap } from '../Swap'
import { AbstractProvider, BrowserProvider, JsonRpcSigner } from 'ethers'
import { Wallet } from '@/features/wallet'
import { NETWORKS } from '@/features/wallet/utils/networks'
import { useSwap } from '../../hooks/useSwap'

jest.mock('../../hooks/useSwap')

let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

let wallet: Wallet = {
    defaultProvider: new AbstractProvider(),
    browserProvider: browserProvider.prototype,
    network: NETWORKS['sepolia'],
    signer: jsonRpcSigner.prototype,
    ready: true,
}

test('render swap button disabled', async () => {
    ;(useSwap as jest.Mock).mockImplementation(() => ({
        amount0: '',
        setAmount0: jest.fn(),
        amount1: '',
        setAmount1: jest.fn(),
        currentSwapState: 1,
        onApprove: jest.fn(),
        onSwap: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Swap wallet={wallet} />)

    expect(await screen.findAllByRole('spinbutton')).toHaveLength(2)
    expect(await screen.findAllByRole('combobox')).toHaveLength(2)
    expect(await screen.findByRole('button')).toBeDisabled()
})

test('render swap button approve state not disabled', async () => {
    ;(useSwap as jest.Mock).mockImplementation(() => ({
        amount0: '11111',
        setAmount0: jest.fn(),
        amount1: '22',
        setAmount1: jest.fn(),
        currentSwapState: 2,
        onApprove: jest.fn(),
        onSwap: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Swap wallet={wallet} />)

    expect((await screen.findAllByRole('spinbutton'))[0]).toHaveValue(11111)
    expect((await screen.findAllByRole('spinbutton'))[1]).toHaveValue(22)
    expect(await screen.findAllByRole('combobox')).toHaveLength(2)
    expect(await screen.findByRole('button')).not.toBeDisabled()
})

test('render swap button approved state not disabled', async () => {
    ;(useSwap as jest.Mock).mockImplementation(() => ({
        amount0: '11111',
        setAmount0: jest.fn(),
        amount1: '22',
        setAmount1: jest.fn(),
        currentSwapState: 3,
        onApprove: jest.fn(),
        onSwap: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Swap wallet={wallet} />)

    expect((await screen.findAllByRole('spinbutton'))[0]).toHaveValue(11111)
    expect((await screen.findAllByRole('spinbutton'))[1]).toHaveValue(22)
    expect(await screen.findAllByRole('combobox')).toHaveLength(2)
    expect(await screen.findByRole('button')).not.toBeDisabled()
})

test('render swap button value', async () => {
    ;(useSwap as jest.Mock).mockImplementation(() => ({
        amount0: '11111',
        setAmount0: jest.fn(),
        amount1: '22',
        setAmount1: jest.fn(),
        currentSwapState: 3,
        onApprove: jest.fn(),
        onSwap: jest.fn(),
        getButtonValue: jest.fn(() => 'button value'),
    }))

    render(<Swap wallet={wallet} />)

    expect(await screen.findByRole('button')).toHaveTextContent('button value')
})

test('click approve button', async () => {
    const mockOnApprove = jest.fn()
    ;(useSwap as jest.Mock).mockImplementation(() => ({
        amount0: '11111',
        setAmount0: jest.fn(),
        amount1: '22',
        setAmount1: jest.fn(),
        currentSwapState: 2,
        onApprove: mockOnApprove,
        onSwap: jest.fn(),
        getButtonValue: jest.fn(),
    }))

    render(<Swap wallet={wallet} />)

    fireEvent.click(await screen.findByRole('button'))
    expect(mockOnApprove).toHaveBeenCalledTimes(1)
})

test('click swap button', async () => {
    const mockOnSwap = jest.fn()
    ;(useSwap as jest.Mock).mockImplementation(() => ({
        amount0: '11111',
        setAmount0: jest.fn(),
        amount1: '22',
        setAmount1: jest.fn(),
        currentSwapState: 3,
        onApprove: jest.fn(),
        onSwap: mockOnSwap,
        getButtonValue: jest.fn(),
    }))

    render(<Swap wallet={wallet} />)

    fireEvent.click(await screen.findByRole('button'))
    expect(mockOnSwap).toHaveBeenCalledTimes(1)
})
