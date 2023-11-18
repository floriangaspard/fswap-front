interface TokenSelectProps {
    token: string
    setToken: (value: string) => void
    tokenList: { [key: string]: string }
}

export function TokenSelect(props: TokenSelectProps) {
    return (
        <select
            className="bg-transparent p-3 cursor-pointer focus-visible:outline-none"
            value={props.token}
            onChange={(e) => props.setToken(e.target.value)}
        >
            {Object.keys(props.tokenList).map((element) => (
                <option key={`0-${element}`} value={element}>
                    {element}
                </option>
            ))}
        </select>
    )
}
