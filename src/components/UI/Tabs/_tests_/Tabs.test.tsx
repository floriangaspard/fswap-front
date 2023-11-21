import { fireEvent, render, screen } from '@testing-library/react'
import { SingleTab } from '../SingleTab'
import { Tabs } from '../Tabs'

test('display and click single tab', () => {
    const setActive = jest.fn()
    render(<SingleTab active={true} name="Tab1" setActiveTab={setActive} />)

    expect(screen.getByText('Tab1')).toBeDefined()
    fireEvent.click(screen.getByText('Tab1'))
    expect(setActive).toHaveBeenCalledTimes(1)
})

test('display multiple tabs', () => {
    const setActive = jest.fn()
    render(
        <Tabs
            names={['Tab1', 'Tab2', 'Tab3']}
            activeTab={0}
            setActiveTab={setActive}
        />
    )

    expect(screen.getByText('Tab1')).toBeDefined()
    expect(screen.getByText('Tab2')).toBeDefined()
    expect(screen.getByText('Tab3')).toBeDefined()
})
