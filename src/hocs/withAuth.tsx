import React from 'react'
import { Navigate } from 'react-router-dom'
import { useFitnessStore } from '@/stores/fitnessStore'

// HOC for authentication requirement
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  const AuthenticatedComponent = (props: P) => {
    const { user, isOnboarded } = useFitnessStore()

    // Redirect to onboarding if not authenticated
    if (!user || !isOnboarded) {
      return <Navigate to='/' replace />
    }

    // Render the wrapped component with all its props
    return <Component {...props} />
  }

  // Preserve component name for debugging
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`

  return AuthenticatedComponent
}

// Alternative HOC that provides auth state as props
export function withAuthState<P extends object>(Component: React.ComponentType<P & AuthStateProps>) {
  const ComponentWithAuthState = (props: P) => {
    const { user, isOnboarded } = useFitnessStore()

    return <Component {...props} user={user} isAuthenticated={!!user && isOnboarded} isOnboarded={isOnboarded} />
  }

  ComponentWithAuthState.displayName = `withAuthState(${Component.displayName || Component.name})`

  return ComponentWithAuthState
}

// Type for auth state props
export interface AuthStateProps {
  user: any
  isAuthenticated: boolean
  isOnboarded: boolean
}
