import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  debounceMs: number = 500,
): [T, (value: T | ((val: T) => T)) => void] => {
  // Get value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Debounce setValue function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          const timeoutId = setTimeout(() => {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }, debounceMs)

          return () => clearTimeout(timeoutId)
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue, debounceMs],
  )

  return [storedValue, setValue]
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingSync, setPendingSync] = useState<any[]>([])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const queueForSync = useCallback((data: any) => {
    setPendingSync((prev) => [...prev, { ...data, timestamp: Date.now() }])
  }, [])

  const syncPendingData = useCallback(() => {
    if (isOnline && pendingSync.length > 0) {
      // Mock sync operation
      setPendingSync([])
      return Promise.resolve()
    }
    return Promise.reject('No data to sync or offline')
  }, [isOnline, pendingSync])

  return {
    isOnline,
    pendingSync,
    queueForSync,
    syncPendingData,
  }
}
