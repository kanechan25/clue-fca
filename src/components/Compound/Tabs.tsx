import { createContext, useContext, useState } from 'react'
import { TabsContextType, TabsProps, TabListProps, TabProps, TabPanelsProps, TabPanelProps } from '@/types/components'

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('Tabs compound components must be used within a Tabs component')
  }
  return context
}

function TabsRoot({ children, defaultTab, value, onChange, className }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || '')
  const activeTab = value !== undefined ? value : internalActiveTab
  const setActiveTab = (tab: string) => {
    if (value === undefined) {
      setInternalActiveTab(tab)
    }
    onChange?.(tab)
  }
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabList({ children, className }: TabListProps) {
  return <div className={`flex border-b border-gray-200 ${className || ''}`}>{children}</div>
}

function Tab({ value, children, className, disabled }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value
  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value)
    }
  }
  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
        isActive
          ? 'text-blue-600 border-blue-600 bg-blue-50'
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className || ''}`}
    >
      {children}
    </button>
  )
}

function TabPanels({ children, className }: TabPanelsProps) {
  return <div className={className}>{children}</div>
}

function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext()
  if (activeTab !== value) {
    return null
  }
  return <div className={className}>{children}</div>
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabList,
  Tab: Tab,
  Panels: TabPanels,
  Panel: TabPanel,
})
