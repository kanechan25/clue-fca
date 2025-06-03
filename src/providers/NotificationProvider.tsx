import React, { createContext, useContext, ReactNode } from 'react'
import toast from 'react-hot-toast'

// Notification types
interface NotificationContextType {
  showSuccess: (message: string, options?: NotificationOptions) => void
  showError: (message: string, options?: NotificationOptions) => void
  showInfo: (message: string, options?: NotificationOptions) => void
  showWarning: (message: string, options?: NotificationOptions) => void
  showLoading: (message: string) => string
  dismiss: (toastId?: string) => void
  dismissAll: () => void
}

interface NotificationOptions {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  icon?: string
}

// Create notification context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Notification provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  // Preserve original toast functionality while wrapping in context
  const showSuccess = (message: string, options?: NotificationOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      icon: options?.icon || '🎉',
    })
  }

  const showError = (message: string, options?: NotificationOptions) => {
    toast.error(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      icon: options?.icon || '❌',
    })
  }

  const showInfo = (message: string, options?: NotificationOptions) => {
    toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      icon: options?.icon || 'ℹ️',
    })
  }

  const showWarning = (message: string, options?: NotificationOptions) => {
    toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      icon: options?.icon || '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
    })
  }

  const showLoading = (message: string): string => {
    return toast.loading(message) // Returns toast ID for dismissal
  }

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  }

  const dismissAll = () => {
    toast.dismiss()
  }

  const contextValue: NotificationContextType = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    dismissAll,
  }

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
}

// Custom hook to use notification context
export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

// HOC that provides notification context
export function withNotificationProvider<P extends object>(Component: React.ComponentType<P>) {
  const ComponentWithNotificationProvider = (props: P) => {
    return (
      <NotificationProvider>
        <Component {...props} />
      </NotificationProvider>
    )
  }

  ComponentWithNotificationProvider.displayName = `withNotificationProvider(${Component.displayName || Component.name})`

  return ComponentWithNotificationProvider
}

// Helper hook for common notification patterns (preserves original toast usage patterns)
export function useToastActions() {
  const notification = useNotification()

  return {
    // Preserve original toast.success, toast.error patterns
    success: notification.showSuccess,
    error: notification.showError,
    info: notification.showInfo,
    warning: notification.showWarning,
    loading: notification.showLoading,
    dismiss: notification.dismiss,
  }
}
