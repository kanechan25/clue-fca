import { useState, useCallback } from 'react'

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setValue = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors],
  )

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const clearError = useCallback((name: keyof T) => {
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setError,
    clearError,
    setFieldTouched,
    reset,
    setValues,
    setErrors,
  }
}

export function useOnboardingForm() {
  const initialValues = {
    name: '',
    email: '',
    fitnessGoals: [] as any[],
    preferredUnits: 'metric' as 'metric' | 'imperial',
    notificationsEnabled: true,
  }
  const form = useForm(initialValues)
  const validateStep = (step: number) => {
    switch (step) {
      case 2:
        return form.values.name.trim() && form.values.email.trim()
      case 3:
        return form.values.fitnessGoals.length > 0
      default:
        return true
    }
  }

  const handleGoalToggle = (type: any) => {
    const currentGoals = form.values.fitnessGoals
    const newGoals = currentGoals.includes(type)
      ? currentGoals.filter((goal) => goal !== type)
      : [...currentGoals, type]

    form.setValue('fitnessGoals', newGoals)
  }

  return {
    ...form,
    validateStep,
    handleGoalToggle,
  }
}

export function useCreateChallengeForm() {
  const initialValues = {
    name: '',
    description: '',
    type: 'steps' as any,
    goal: 10000,
    unit: 'steps' as any,
    duration: 30,
    startDate: new Date().toISOString().split('T')[0],
    imageUrl: '🚶',
  }

  const form = useForm(initialValues)

  const validate = () => {
    const errors: any = {}

    if (!form.values.name.trim()) {
      errors.name = 'Challenge name is required'
    }

    if (!form.values.description.trim()) {
      errors.description = 'Challenge description is required'
    }

    if (form.values.goal <= 0) {
      errors.goal = 'Goal must be greater than 0'
    }

    if (form.values.duration <= 0) {
      errors.duration = 'Duration must be greater than 0'
    }

    form.setErrors(errors)
    return Object.keys(errors).length === 0
  }

  return {
    ...form,
    validate,
  }
}
