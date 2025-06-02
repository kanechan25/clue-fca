import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { useFitnessStore } from '@/stores/fitnessStore'
import toast from 'react-hot-toast'
import { DailyInputFormProps } from '@/types'

export const DailyInputForm = ({ challengeId, onSuccess }: DailyInputFormProps) => {
  const { challenges, userProgress, addProgress } = useFitnessStore()
  const challenge = challenges.find((c) => c.id === challengeId)
  const progress = userProgress[challengeId]
  const dateInputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!challenge || !progress) {
    return null
  }

  // Find existing entry for the selected date
  const existingEntry = progress.dailyEntries.find((entry) => entry.date === date)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!value || isNaN(Number(value)) || Number(value) < 0) {
      toast.error('Please enter a valid positive number')
      return
    }

    setIsLoading(true)

    try {
      addProgress({
        challengeId,
        date,
        value: Number(value),
        notes: notes.trim() || undefined,
      })

      toast.success(existingEntry ? 'Progress updated successfully!' : 'Progress added successfully!')

      // Reset form
      setValue('')
      setNotes('')
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to save progress')
      console.error('Error saving progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    // Pre-fill with existing data if available
    if (existingEntry) {
      setValue(existingEntry.value.toString())
      setNotes(existingEntry.notes || '')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setValue('')
    setNotes('')
  }

  const handleDateClick = () => {
    const input = dateInputRef.current
    if (input) {
      try {
        if ('showPicker' in input && typeof (input as any).showPicker === 'function') {
          ;(input as any).showPicker()
        } else {
          input.focus()
          input.click()
        }
      } catch {
        input.focus()
      }
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOpen}
        className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200'
      >
        <Plus className='w-5 h-5' />
        <span>{existingEntry ? 'Update Progress' : 'Add Progress'}</span>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className='bg-white rounded-lg shadow-lg border border-gray-200 p-6'
    >
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>{existingEntry ? 'Update Progress' : 'Add Progress'}</h3>
        <button onClick={handleClose} className='text-gray-800 hover:text-gray-600 transition-colors'>
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Date Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            <Calendar className='w-4 h-4 inline mr-1' />
            Date
          </label>
          <div className='relative flex'>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className='flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-colors'
              required
              ref={dateInputRef}
            />
            <button
              type='button'
              onClick={handleDateClick}
              className='px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              title='Open calendar'
            >
              <Calendar className='w-4 h-4 text-gray-600' />
            </button>
          </div>
          <p className='text-xs text-gray-500 mt-1'>Click the date field or calendar icon to open date picker</p>
        </div>

        {/* Value Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {challenge.unit === 'steps'
              ? 'Steps'
              : challenge.unit === 'miles'
                ? 'Distance (miles)'
                : challenge.unit === 'calories'
                  ? 'Calories'
                  : challenge.unit === 'lbs'
                    ? 'Weight Lost (lbs)'
                    : `Value (${challenge.unit})`}
          </label>
          <input
            type='number'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${challenge.unit}`}
            min='0'
            step={challenge.unit === 'lbs' ? '0.1' : '1'}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            required
          />
          <p className='text-sm text-gray-500 mt-1'>
            Goal: {challenge.goal.toLocaleString()} {challenge.unit}/day
          </p>
        </div>

        {/* Notes Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Add any notes about your progress...'
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
          />
        </div>

        {/* Submit Button */}
        <div className='flex space-x-3 pt-2'>
          <motion.button
            type='submit'
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <>
                <Save className='w-4 h-4' />
                <span>Save</span>
              </>
            )}
          </motion.button>

          <motion.button
            type='button'
            onClick={handleClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
