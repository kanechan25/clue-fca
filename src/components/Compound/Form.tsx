import React, { createContext, useContext, ReactNode } from 'react'

// Form context interface - only what's actually used
interface FormContextType {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  setValue: (name: string, value: any) => void
}

// Create form context
const FormContext = createContext<FormContextType | undefined>(undefined)

// Hook to use form context
function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error('Form compound components must be used within a Form component')
  }
  return context
}

// Main Form component (root)
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  values: Record<string, any>
  errors?: Record<string, string>
  touched?: Record<string, boolean>
  onValuesChange?: (values: Record<string, any>) => void
  onSubmit?: (values: Record<string, any>) => void
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

// Form field component
interface FormFieldProps {
  children: ReactNode
  name: string
  className?: string
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

// Form label component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
}

function FormLabel({ children, required, className, ...props }: FormLabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className || ''}`} {...props}>
      {children}
      {required && <span className='text-red-500 ml-1'>*</span>}
    </label>
  )
}

// Form input component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
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

// Compound component export
export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Label: FormLabel,
  Input: FormInput,
})

// Usage example:
/*
<Form values={formValues} onValuesChange={setFormValues} errors={formErrors}>
  <Form.Field name="email">
    <Form.Label htmlFor="email" required>Email</Form.Label>
    <Form.Input name="email" type="email" id="email" />
  </Form.Field>
  
  <Form.Field name="password">
    <Form.Label htmlFor="password" required>Password</Form.Label>
    <Form.Input name="password" type="password" id="password" />
  </Form.Field>
</Form>
*/
