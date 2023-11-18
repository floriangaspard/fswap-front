import { ChangeEvent } from 'react'

interface PoolInputProps {
    amount: string
    setAmount: (amount: string) => void
}

export function TokenInput(props: PoolInputProps) {
    const onAmountChanged = async (event: ChangeEvent<HTMLInputElement>) => {
        props.setAmount(event.target.value)
    }

    return (
        <input
            className="bg-transparent p-5 w-4/5 focus-visible:outline-none"
            value={props.amount}
            type="number"
            placeholder=""
            onChange={onAmountChanged}
            min={0}
        />
    )
}
