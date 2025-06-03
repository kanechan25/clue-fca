import { useState, useCallback } from 'react'

// Headless modal hook that provides state and actions without UI
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

// Enhanced modal hook with additional features
export function useEnhancedModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const open = useCallback((initialData?: any) => {
    setData(initialData)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
    setIsLoading(false)
  }, [])

  const toggle = useCallback(
    (initialData?: any) => {
      if (isOpen) {
        close()
      } else {
        open(initialData)
      }
    },
    [isOpen, open, close],
  )

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return {
    isOpen,
    isLoading,
    data,
    open,
    close,
    toggle,
    startLoading,
    stopLoading,
    setData,
  }
}

// Modal hook with validation and submission handling
export function useFormModal<T = any>(
  onSubmit?: (data: T) => Promise<void> | void,
  validate?: (data: T) => string | null,
) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback(() => {
    setIsOpen(true)
    setError(null)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setError(null)
    setIsSubmitting(false)
  }, [])

  const handleSubmit = useCallback(
    async (data: T) => {
      if (validate) {
        const validationError = validate(data)
        if (validationError) {
          setError(validationError)
          return
        }
      }

      setIsSubmitting(true)
      setError(null)

      try {
        await onSubmit?.(data)
        close()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsSubmitting(false)
      }
    },
    [validate, onSubmit, close],
  )

  return {
    isOpen,
    isSubmitting,
    error,
    open,
    close,
    handleSubmit,
    setError,
  }
}
