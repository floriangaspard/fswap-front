interface TabProps {
    name: string
    active: boolean
    setActiveTab: () => void
}

export function SingleTab(props: TabProps) {
    return (
        <div
            className={`w-full bg-stone-100 p-4 rounded-md m-1 cursor-pointer ${
                props.active ? 'bg-gradient-to-r from-cyan-100 to-blue-100' : ''
            }`}
            onClick={() => props.setActiveTab()}
        >
            {props.name}
        </div>
    )
}
