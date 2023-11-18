export enum Tab {
    swap = 'Swap',
    pool = 'Pool',
}

interface TabsProps {
    activeTab: Tab
    setActiveTab: (arg0: Tab) => void
}

export function Tabs(props: TabsProps) {
    return (
        <div className="mb-8 flex text-2xl w-full">
            <SingleTab
                activeTab={props.activeTab}
                tab={Tab.swap}
                setActiveTab={props.setActiveTab}
            />
            <SingleTab
                activeTab={props.activeTab}
                tab={Tab.pool}
                setActiveTab={props.setActiveTab}
            />
        </div>
    )
}

interface TabProps extends TabsProps {
    tab: Tab
}

function SingleTab(props: TabProps) {
    return (
        <div
            className={`w-full bg-stone-100 p-4 rounded-md m-1 cursor-pointer ${
                props.activeTab === props.tab
                    ? 'bg-gradient-to-r from-cyan-100 to-blue-100'
                    : ''
            }`}
            onClick={() => props.setActiveTab(props.tab)}
        >
            {props.tab}
        </div>
    )
}
