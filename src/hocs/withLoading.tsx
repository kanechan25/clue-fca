import React from 'react'
import { CircularProgress } from '@/components/Common/CircularProgress'
import { LoadingProps, LoadingStateProps } from '@/types'

export function withLoading<P extends object>(Component: React.ComponentType<P>) {
  const ComponentWithLoading = (props: P & LoadingProps) => {
    const { isLoading, loadingText, ...componentProps } = props as P & LoadingProps
    if (isLoading) {
      return (
        <div className='flex flex-col items-center justify-center p-8 space-y-4'>
          <CircularProgress percentage={100} size={40} />
          {loadingText && <p className='text-sm text-gray-600 animate-pulse'>{loadingText}</p>}
        </div>
      )
    }
    return <Component {...(componentProps as P)} />
  }
  ComponentWithLoading.displayName = `withLoading(${Component.displayName || Component.name})`
  return ComponentWithLoading
}

export function withCustomLoading<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType<{ loadingText?: string }>,
) {
  const ComponentWithCustomLoading = (props: P & LoadingProps) => {
    const { isLoading, loadingText, ...componentProps } = props as P & LoadingProps
    if (isLoading) {
      return <LoadingComponent loadingText={loadingText} />
    }
    return <Component {...(componentProps as P)} />
  }
  ComponentWithCustomLoading.displayName = `withCustomLoading(${Component.displayName || Component.name})`
  return ComponentWithCustomLoading
}

export function withLoadingState<P extends object>(Component: React.ComponentType<P & LoadingStateProps>) {
  const ComponentWithLoadingState = (props: P) => {
    const [isLoading, setIsLoading] = React.useState(false)
    const [loadingText, setLoadingText] = React.useState<string>()
    const startLoading = (text?: string) => {
      setIsLoading(true)
      setLoadingText(text)
    }
    const stopLoading = () => {
      setIsLoading(false)
      setLoadingText(undefined)
    }
    return (
      <Component
        {...props}
        isLoading={isLoading}
        loadingText={loadingText}
        startLoading={startLoading}
        stopLoading={stopLoading}
      />
    )
  }

  ComponentWithLoadingState.displayName = `withLoadingState(${Component.displayName || Component.name})`
  return ComponentWithLoadingState
}
