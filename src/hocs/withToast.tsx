import React from 'react'
import toast from 'react-hot-toast'

// HOC that provides toast notification methods
export function withToast<P extends object>(Component: React.ComponentType<P & ToastProps>) {
  const ComponentWithToast = (props: P) => {
    const showSuccess = (message: string) => {
      toast.success(message)
    }

    const showError = (message: string) => {
      toast.error(message)
    }

    const showInfo = (message: string) => {
      toast(message)
    }

    const showLoading = (message: string) => {
      return toast.loading(message)
    }

    const dismissToast = (toastId: string) => {
      toast.dismiss(toastId)
    }

    const dismissAllToasts = () => {
      toast.dismiss()
    }

    return (
      <Component
        {...props}
        showSuccess={showSuccess}
        showError={showError}
        showInfo={showInfo}
        showLoading={showLoading}
        dismissToast={dismissToast}
        dismissAllToasts={dismissAllToasts}
      />
    )
  }

  ComponentWithToast.displayName = `withToast(${Component.displayName || Component.name})`

  return ComponentWithToast
}

// HOC for automatic success/error handling
export function withAutoToast<P extends object>(Component: React.ComponentType<P>) {
  const ComponentWithAutoToast = (props: P & AutoToastProps) => {
    const { onSuccess, onError, successMessage, errorMessage, ...componentProps } = props as P & AutoToastProps

    const handleSuccess = (result?: any) => {
      if (successMessage) {
        toast.success(successMessage)
      }
      onSuccess?.(result)
    }

    const handleError = (error?: any) => {
      if (errorMessage) {
        toast.error(errorMessage)
      } else if (error?.message) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred')
      }
      onError?.(error)
    }

    return <Component {...(componentProps as P)} onSuccess={handleSuccess} onError={handleError} />
  }

  ComponentWithAutoToast.displayName = `withAutoToast(${Component.displayName || Component.name})`

  return ComponentWithAutoToast
}

// Types for toast props
export interface ToastProps {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showLoading: (message: string) => string
  dismissToast: (toastId: string) => void
  dismissAllToasts: () => void
}

export interface AutoToastProps {
  onSuccess?: (result?: any) => void
  onError?: (error?: any) => void
  successMessage?: string
  errorMessage?: string
}
