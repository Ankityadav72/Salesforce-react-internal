import { useState } from "react"
import { TabName } from "../Home"

interface IUseTabs {
    currentTab: TabName
}

const useTabs = ({ currentTab }: IUseTabs) => {
    const [selectedTab, setSelectedTab] = useState<TabName>(currentTab)

    const handleTabChange = (value: TabName) => {
        setSelectedTab(value)
    }

    return {
        selectedTab,
        handleTabChange
    }
}

export default useTabs