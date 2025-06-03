import React, { createContext, useContext } from 'react'
import { FormContextType, FormProps, FormFieldProps, FormLabelProps, FormInputProps } from '@/types/components'

const FormContext = createContext<FormContextType | undefined>(undefined)

function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error('Form compound components must be used within a Form component')
  }
  return context
}

function FormRoot({ children, values, errors = {}, touched = {}, onValuesChange, onSubmit, ...props }: FormProps) {
  const setValue = (name: string, value: any) => {
    const newValues = { ...values, [name]: value }
    onValuesChange?.(newValues)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(values)
  }
  return (
    <FormContext.Provider value={{ values, errors, touched, setValue }}>
      <form onSubmit={handleSubmit} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

function FormField({ children, name, className }: FormFieldProps) {
  const { errors, touched } = useFormContext()
  const hasError = touched[name] && errors[name]
  return (
    <div className={`space-y-1 ${className || ''}`}>
      {children}
      {hasError && <p className='text-sm text-red-600'>{errors[name]}</p>}
    </div>
  )
}

function FormLabel({ children, required, className, ...props }: FormLabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className || ''}`} {...props}>
      {children}
      {required && <span className='text-red-500 ml-1'>*</span>}
    </label>
  )
}

function FormInput({ name, className, onChange, ...props }: FormInputProps) {
  const { values, setValue } = useFormContext()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value)
    onChange?.(e)
  }
  return (
    <input
      name={name}
      value={values[name] || ''}
      onChange={handleChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className || ''}`}
      {...props}
    />
  )
}

export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Input: FormInput,
})
