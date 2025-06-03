import React, { createContext, useContext } from 'react'
import { useToggle } from '@/hooks/headless/useToggle'
import { useClickOutside } from '@/hooks/useClickOutside'
import {
  DropdownContextType,
  DropdownProps,
  DropdownTriggerProps,
  DropdownContentProps,
  DropdownItemProps,
} from '@/types/components'

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

function useDropdownContext() {
  const context = useContext(DropdownContext)
  if (context === undefined) {
    throw new Error('Dropdown compound components must be used within a Dropdown component')
  }
  return context
}

function DropdownRoot({ children, value, onSelect, className }: DropdownProps) {
  const { value: isOpen, toggle, setFalse: close, setTrue: open } = useToggle(false)
  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        toggle,
        close,
        open,
        selectedValue: value,
        onSelect,
      }}
    >
      <div className={`relative ${className || ''}`}>{children}</div>
    </DropdownContext.Provider>
  )
}

function DropdownTrigger({ children, className, asChild }: DropdownTriggerProps) {
  const { toggle } = useDropdownContext()
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<any>
    return React.cloneElement(childElement, {
      onClick: toggle,
      className: `${(childElement.props as any)?.className || ''} ${className || ''}`,
    })
  }
  return (
    <button
      type='button'
      onClick={toggle}
      className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors ${className || ''}`}
    >
      {children}
      <svg className='w-4 h-4 ml-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
      </svg>
    </button>
  )
}

function DropdownContent({ children, className, align = 'left' }: DropdownContentProps) {
  const { isOpen, close } = useDropdownContext()
  const contentRef = React.useRef<HTMLDivElement>(null)
  useClickOutside({
    ref: contentRef,
    handler: close,
    enabled: isOpen,
  })
  if (!isOpen) return null
  const alignmentClasses = align === 'right' ? 'right-0' : 'left-0'
  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-full ${alignmentClasses} ${className || ''}`}
    >
      {children}
    </div>
  )
}

function DropdownItem({ children, value, onSelect, className, disabled }: DropdownItemProps) {
  const { close, onSelect: contextOnSelect } = useDropdownContext()
  const handleSelect = () => {
    if (disabled) return
    onSelect?.()
    contextOnSelect?.(value)
    close()
  }

  return (
    <button
      type='button'
      onClick={handleSelect}
      disabled={disabled}
      className={`w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors ${
        disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
      } ${className || ''}`}
    >
      {children}
    </button>
  )
}

function DropdownSeparator({ className }: { className?: string }) {
  return <div className={`border-t border-gray-200 my-1 ${className || ''}`} />
}

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Separator: DropdownSeparator,
})
