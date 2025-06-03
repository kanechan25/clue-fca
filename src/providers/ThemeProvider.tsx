import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'

// Theme types
type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  actualTheme: 'light' | 'dark' // Resolved theme (system resolved to light/dark)
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
  toggleTheme: () => void
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Get theme from localStorage or default to system
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('fitness-app-theme') as Theme) || 'system'
    }
    return 'system'
  })

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Function to resolve system theme
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Update actual theme based on theme preference
  useEffect(() => {
    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
    setActualTheme(resolvedTheme)

    // Apply theme to document
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(resolvedTheme)
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = () => {
        setActualTheme(getSystemTheme())
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)

    // Persist theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitness-app-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light')
  }

  const isDarkMode = actualTheme === 'dark'

  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    isDarkMode,
    toggleTheme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

// Custom hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// HOC that provides theme context
export function withThemeProvider<P extends object>(Component: React.ComponentType<P>) {
  const ComponentWithThemeProvider = (props: P) => {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    )
  }

  ComponentWithThemeProvider.displayName = `withThemeProvider(${Component.displayName || Component.name})`

  return ComponentWithThemeProvider
}
