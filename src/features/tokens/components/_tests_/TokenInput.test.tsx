import { render, screen } from '@testing-library/react'
import { TokenInput } from '../TokenInput'
import userEvent from '@testing-library/user-event'

test('call set function', async () => {
    const setAmount = jest.fn()
    render(<TokenInput amount="" setAmount={setAmount} />)
    userEvent.type(await screen.findByRole('spinbutton'), '1')

    expect(setAmount).toHaveBeenCalledTimes(1)
})
