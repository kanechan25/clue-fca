import React from 'react'
import { Navigate } from 'react-router-dom'
import { useFitnessStore } from '@/stores/fitnessStore'
import { AuthStateProps } from '@/types/user'

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  const AuthenticatedComponent = (props: P) => {
    const { user, isOnboarded } = useFitnessStore()
    if (!user || !isOnboarded) {
      return <Navigate to='/' replace />
    }
    return <Component {...props} />
  }
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  return AuthenticatedComponent
}

export function withAuthState<P extends object>(Component: React.ComponentType<P & AuthStateProps>) {
  const ComponentWithAuthState = (props: P) => {
    const { user, isOnboarded } = useFitnessStore()
    return <Component {...props} user={user} isAuthenticated={!!user && isOnboarded} isOnboarded={isOnboarded} />
  }
  ComponentWithAuthState.displayName = `withAuthState(${Component.displayName || Component.name})`
  return ComponentWithAuthState
}
