import React, { createContext, useContext, ReactNode } from 'react'
import { useFitnessStore } from '@/stores/fitnessStore'
import { User, OnboardingData } from '@/types'

// Auth context interface
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isOnboarded: boolean
  login: (data: OnboardingData) => void
  logout: () => void
  setUser: (user: User) => void
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // Use existing Zustand store for core business logic (preserving original logic)
  const { user, isOnboarded, completeOnboarding, resetStore, setUser } = useFitnessStore()

  // Wrapper functions that preserve original business logic
  const login = (data: OnboardingData) => {
    completeOnboarding(data) // Original business logic preserved
  }

  const logout = () => {
    resetStore() // Original business logic preserved
  }

  const isAuthenticated = !!user && isOnboarded

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isOnboarded,
    login,
    logout,
    setUser, // Original function preserved
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC that provides auth context (combines Provider pattern with HOC pattern)
export function withAuthProvider<P extends object>(Component: React.ComponentType<P>) {
  const ComponentWithAuthProvider = (props: P) => {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    )
  }

  ComponentWithAuthProvider.displayName = `withAuthProvider(${Component.displayName || Component.name})`

  return ComponentWithAuthProvider
}
