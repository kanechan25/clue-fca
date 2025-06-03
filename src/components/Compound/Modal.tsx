import React, { createContext, useContext, useEffect } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import {
  ModalContextType,
  ModalProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseButtonProps,
} from '@/types/components'

const ModalContext = createContext<ModalContextType | undefined>(undefined)

function useModalContext() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('Modal compound components must be used within a Modal component')
  }
  return context
}

function ModalRoot({
  children,
  isOpen,
  onClose,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <ModalContext.Provider value={{ isOpen, close: onClose }}>
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${className || ''}`}>
        {/* Backdrop */}
        <div
          className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        {children}
      </div>
    </ModalContext.Provider>
  )
}

function ModalContent({ children, className, preventClose = false }: ModalContentProps) {
  const { close } = useModalContext()
  const contentRef = React.useRef<HTMLDivElement>(null)
  useClickOutside({
    ref: contentRef,
    handler: preventClose ? () => {} : close,
    enabled: !preventClose,
  })
  return (
    <div
      ref={contentRef}
      className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden ${className || ''}`}
    >
      {children}
    </div>
  )
}

function ModalHeader({ children, className, showCloseButton = true }: ModalHeaderProps) {
  const { close } = useModalContext()

  return (
    <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${className || ''}`}>
      <div className='flex-1'>{children}</div>
      {showCloseButton && (
        <button
          onClick={close}
          className='ml-4 text-gray-400 hover:text-gray-600 transition-colors'
          aria-label='Close modal'
        >
          <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      )}
    </div>
  )
}

function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={`p-6 overflow-y-auto ${className || ''}`}>{children}</div>
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={`flex justify-end space-x-2 p-6 border-t border-gray-200 bg-gray-50 ${className || ''}`}>
      {children}
    </div>
  )
}

function ModalCloseButton({ children = 'Cancel', className, variant = 'secondary' }: ModalCloseButtonProps) {
  const { close } = useModalContext()
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    ghost: 'text-gray-500 hover:text-gray-700',
  }
  return (
    <button onClick={close} className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}>
      {children}
    </button>
  )
}

export const Modal = Object.assign(ModalRoot, {
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseButton: ModalCloseButton,
})
