import { ReactNode } from 'react'

// Dropdown:
export interface DropdownContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
  open: () => void
  selectedValue?: any
  onSelect?: (value: any) => void
}

export interface DropdownProps {
  children: ReactNode
  value?: any
  onSelect?: (value: any) => void
  className?: string
}

export interface DropdownTriggerProps {
  children: ReactNode
  className?: string
  asChild?: boolean
}

export interface DropdownContentProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'right'
}

export interface DropdownItemProps {
  children: ReactNode
  value?: any
  onSelect?: () => void
  className?: string
  disabled?: boolean
}

// Form:
export interface FormContextType {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  setValue: (name: string, value: any) => void
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  values: Record<string, any>
  errors?: Record<string, string>
  touched?: Record<string, boolean>
  onValuesChange?: (values: Record<string, any>) => void
  onSubmit?: (values: Record<string, any>) => void
}

export interface FormFieldProps {
  children: ReactNode
  name: string
  className?: string
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
}

// Modal:
export interface ModalContextType {
  isOpen: boolean
  close: () => void
}

export interface ModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

export interface ModalContentProps {
  children: ReactNode
  className?: string
  preventClose?: boolean
}

export interface ModalHeaderProps {
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}

export interface ModalBodyProps {
  children: ReactNode
  className?: string
}

export interface ModalFooterProps {
  children: ReactNode
  className?: string
}

export interface ModalCloseButtonProps {
  children?: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

// Tabs:
export interface TabsContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export interface TabsProps {
  children: ReactNode
  defaultTab?: string
  value?: string
  onChange?: (tab: string) => void
  className?: string
}

export interface TabListProps {
  children: ReactNode
  className?: string
}

export interface TabProps {
  value: string
  children: ReactNode
  className?: string
  disabled?: boolean
}

export interface TabPanelsProps {
  children: ReactNode
  className?: string
}

export interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}
