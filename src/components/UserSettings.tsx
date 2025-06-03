import { useState, useRef, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, RotateCcw, ChevronDown, Settings } from 'lucide-react'
import { useFitnessStore } from '@/stores/fitnessStore'
import { useClickOutside } from '@/hooks/useClickOutside'
import type { UserSettingsProps } from '@/types'
import toast from 'react-hot-toast'

export const UserSettings = memo(({ user }: UserSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { resetStore } = useFitnessStore()

  useClickOutside({
    ref: dropdownRef,
    handler: () => {
      setIsOpen(false)
      setShowConfirmReset(false)
    },
  })

  const handleResetOnboarding = () => {
    resetStore()
    toast.success('Settings reset! You can now reconfigure your onboarding.')
    setIsOpen(false)
    setShowConfirmReset(false)
  }

  const handleLogout = () => {
    resetStore()
    toast.success('Logged out successfully!')
    setIsOpen(false)
  }

  const menuItems = [
    {
      icon: Settings,
      label: 'Edit Profile',
      action: () => {},
      className: 'text-orange-600 hover:bg-orange-50',
    },
    {
      icon: RotateCcw,
      label: 'Reset Onboarding',
      action: () => setShowConfirmReset(true),
      className: 'text-orange-600 hover:bg-orange-50',
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      action: handleLogout,
      className: 'text-red-600 hover:bg-red-50 border-t border-gray-100',
    },
  ]

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors'
      >
        <div className='w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
          {user.avatar || user.name.charAt(0)}
        </div>
        <div className='hidden md:block text-left'>
          <span className='text-sm font-medium text-gray-700'>{user.name}</span>
          <p className='text-xs text-gray-500'>{user.email}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'
          >
            {/* Menu Items */}
            <div className='py-2'>
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${item.className || 'text-gray-700'}`}
                >
                  <item.icon className='w-4 h-4' />
                  <span className='text-sm'>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Reset Confirmation */}
            {showConfirmReset && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='border-t border-gray-200 p-4 bg-orange-50'
              >
                <p className='text-sm text-orange-800 mb-3'>
                  This will reset all your settings and progress. You'll go through onboarding again. Are you sure?
                </p>
                <div className='flex space-x-2'>
                  <button
                    onClick={handleResetOnboarding}
                    className='flex-1 bg-orange-600 text-white text-sm py-2 px-3 rounded hover:bg-orange-700 transition-colors'
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className='flex-1 bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded hover:bg-gray-300 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

UserSettings.displayName = 'UserSettings'
