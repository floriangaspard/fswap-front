import { SingleTab } from './SingleTab'

interface TabsProps {
    names: string[]
    activeTab: number
    setActiveTab: (arg0: number) => void
}

export function Tabs(props: TabsProps) {
    return (
        <div className="mb-8 flex text-2xl w-full">
            {props.names.map((n, idx) => (
                <SingleTab
                    active={idx === props.activeTab}
                    name={n}
                    setActiveTab={() => props.setActiveTab(idx)}
                />
            ))}
        </div>
    )
}
