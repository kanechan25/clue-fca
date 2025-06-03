import { createContext, useContext, useState, ReactNode } from 'react'

// Tab context interface
interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

// Create tabs context
const TabsContext = createContext<TabsContextType | undefined>(undefined)

// Hook to use tabs context
function useTabsContext() {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('Tabs compound components must be used within a Tabs component')
  }
  return context
}

// Main Tabs component (root)
interface TabsProps {
  children: ReactNode
  defaultTab?: string
  value?: string
  onChange?: (tab: string) => void
  className?: string
}

function TabsRoot({ children, defaultTab, value, onChange, className }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || '')

  // Use controlled or uncontrolled mode
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

// Tab list component (container for tab buttons)
interface TabListProps {
  children: ReactNode
  className?: string
}

function TabList({ children, className }: TabListProps) {
  return <div className={`flex border-b border-gray-200 ${className || ''}`}>{children}</div>
}

// Individual tab button component
interface TabProps {
  value: string
  children: ReactNode
  className?: string
  disabled?: boolean
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

// Tab panels container
interface TabPanelsProps {
  children: ReactNode
  className?: string
}

function TabPanels({ children, className }: TabPanelsProps) {
  return <div className={className}>{children}</div>
}

// Individual tab panel component
interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext()

  if (activeTab !== value) {
    return null
  }

  return <div className={className}>{children}</div>
}

// Compound component export
export const Tabs = Object.assign(TabsRoot, {
  List: TabList,
  Tab: Tab,
  Panels: TabPanels,
  Panel: TabPanel,
})

// Usage example that matches the original ChallengeDetailPage pattern:
/*
<Tabs defaultTab="progress" className="space-y-4">
  <Tabs.List>
    <Tabs.Tab value="progress">Progress</Tabs.Tab>
    <Tabs.Tab value="leaderboard">Leaderboard</Tabs.Tab>
    <Tabs.Tab value="community">Community</Tabs.Tab>
  </Tabs.List>
  
  <Tabs.Panels>
    <Tabs.Panel value="progress">
      <ProgressSummary challenge={challenge} />
    </Tabs.Panel>
    <Tabs.Panel value="leaderboard">
      <Leaderboard leaderboard={leaderboard} />
    </Tabs.Panel>
    <Tabs.Panel value="community">
      <div>Community content</div>
    </Tabs.Panel>
  </Tabs.Panels>
</Tabs>
*/
