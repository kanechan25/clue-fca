import { ErrorBoundaryProps, ErrorBoundaryState, ErrorBoundaryOptions } from '@/types'
import React from 'react'

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error)
      }

      return (
        <div className='flex flex-col items-center justify-center p-8 space-y-4 bg-red-50 rounded-lg'>
          <div className='text-4xl'>⚠️</div>
          <h3 className='text-lg font-semibold text-red-800'>Something went wrong</h3>
          <p className='text-sm text-red-600 text-center max-w-md'>
            {this.props.errorMessage || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          {this.props.showRetry && (
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
            >
              Try Again
            </button>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Partial<ErrorBoundaryOptions>,
) {
  const ComponentWithErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary
        fallback={options?.fallback}
        onError={options?.onError}
        errorMessage={options?.errorMessage}
        showRetry={options?.showRetry ?? true}
      >
        <Component {...props} />
      </ErrorBoundary>
    )
  }
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return ComponentWithErrorBoundary
}

export function withCustomErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error | null; retry: () => void }>,
) {
  const ComponentWithCustomErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary
        fallback={(error) => <FallbackComponent error={error} retry={() => window.location.reload()} />}
        showRetry={false}
      >
        <Component {...props} />
      </ErrorBoundary>
    )
  }
  ComponentWithCustomErrorBoundary.displayName = `withCustomErrorBoundary(${Component.displayName || Component.name})`
  return ComponentWithCustomErrorBoundary
}
