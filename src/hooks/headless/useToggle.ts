import { useState, useCallback } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    reset,
    setValue,
  }
}

export function useMultiToggle<T>(values: T[], initialIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const toggle = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % values.length)
  }, [values.length])

  const setIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < values.length) {
        setCurrentIndex(index)
      }
    },
    [values.length],
  )

  const setValue = useCallback(
    (value: T) => {
      const index = values.indexOf(value)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    },
    [values],
  )

  const reset = useCallback(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  return {
    value: values[currentIndex],
    index: currentIndex,
    toggle,
    setIndex,
    setValue,
    reset,
  }
}

export function usePersistentToggle(key: string, initialValue = false) {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    }
    return initialValue
  })

  const toggle = useCallback(() => {
    setValue((prev: boolean) => {
      const newValue = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
      return newValue
    })
  }, [key])

  const setTrue = useCallback(() => {
    setValue(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(true))
    }
  }, [key])

  const setFalse = useCallback(() => {
    setValue(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(false))
    }
  }, [key])

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue: (newValue: boolean) => {
      setValue(newValue)
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    },
  }
}
