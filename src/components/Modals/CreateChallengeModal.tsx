import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target, User as UserIcon } from 'lucide-react'
import { Challenge, ChallengeType, CreateChallengeModalProps, Unit } from '@/types/challenge'
import { challengeTypes } from '@/constants'
import { addDays } from 'date-fns'
import { challengeEmojis } from '@/constants/mock'
import { DatePicker } from '@/components/Common/DatePicker'

export const CreateChallengeModal = ({
  isOpen,
  onClose,
  onCreateChallenge,
  currentUser,
}: CreateChallengeModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: ChallengeType.STEPS,
    goal: 10000,
    unit: Unit.STEPS,
    duration: 30,
    startDate: new Date().toISOString().split('T')[0],
    imageUrl: '🚶',
  })

  const handleInputChange = (field: string, value: string | number | ChallengeType | Unit) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (type: ChallengeType) => {
    const challengeType = challengeTypes.find((ct) => ct.type === type)
    if (challengeType) {
      setFormData((prev) => ({
        ...prev,
        type,
        unit: challengeType.defaultUnit,
        goal: challengeType.defaultGoal,
        imageUrl: challengeType.icon,
      }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Challenge name is required')
      return false
    }
    if (!formData.description.trim()) {
      toast.error('Challenge description is required')
      return false
    }
    if (formData.goal <= 0) {
      toast.error('Goal must be greater than 0')
      return false
    }
    if (formData.duration <= 0) {
      toast.error('Duration must be greater than 0')
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const startDate = new Date(formData.startDate)
    const endDate = addDays(startDate, formData.duration)

    const challengeData: Challenge = {
      id: crypto.randomUUID(),
      participants: [],
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      goal: formData.goal,
      unit: formData.unit,
      duration: formData.duration,
      startDate,
      endDate,
      creator: currentUser?.name || 'Anonymous',
      isActive: true,
      imageUrl: formData.imageUrl,
    }

    onCreateChallenge(challengeData)
    handleReset()
  }

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      type: ChallengeType.STEPS,
      goal: 10000,
      unit: Unit.STEPS,
      duration: 30,
      startDate: new Date().toISOString().split('T')[0],
      imageUrl: '🚶',
    })
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <h2 className='text-2xl font-bold text-gray-800'>Create New Challenge</h2>
            <button onClick={handleClose} className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            {/* Basic Info */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Challenge Name *</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='Enter challenge name'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder='Describe your challenge...'
                  rows={3}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                  required
                />
              </div>
            </div>

            {/* Challenge Type */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center space-x-2'>
                <Target className='w-5 h-5' />
                <span>Challenge Type</span>
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {challengeTypes.map((challengeType) => (
                  <button
                    key={challengeType.type}
                    type='button'
                    onClick={() => handleTypeChange(challengeType.type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.type === challengeType.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className='flex items-center space-x-3'>
                      <span className='text-2xl'>{challengeType.icon}</span>
                      <div>
                        <h4 className='font-semibold text-gray-800'>{challengeType.label}</h4>
                        <p className='text-sm text-gray-600'>{challengeType.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal & Duration */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center space-x-2'>
                <Target className='w-5 h-5' />
                <span>Goal & Timeline</span>
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Daily Goal ({formData.unit}) *</label>
                  <input
                    type='number'
                    value={formData.goal}
                    onChange={(e) => handleInputChange('goal', parseInt(e.target.value) || 0)}
                    min='1'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Duration (days) *</label>
                  <input
                    type='number'
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    min='1'
                    max='365'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
              </div>

              <DatePicker
                value={formData.startDate}
                onChange={(date) => handleInputChange('startDate', date)}
                min={new Date().toISOString().split('T')[0]}
                required
                label='Start Date *'
              />
            </div>

            {/* Challenge Icon */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800'>Challenge Icon</h3>
              <div className='grid grid-cols-5 md:grid-cols-10 gap-2'>
                {challengeEmojis.map((emoji) => (
                  <button
                    key={emoji.emoji}
                    type='button'
                    onClick={() => handleInputChange('imageUrl', emoji.emoji)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                      formData.imageUrl === emoji.emoji
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    title={emoji.label}
                  >
                    <span className='text-xl'>{emoji.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <UserIcon className='w-4 h-4' />
                <span>Created by: {currentUser?.name || 'Anonymous'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3 pt-4 border-t border-gray-200'>
              <button
                type='button'
                onClick={handleClose}
                className='flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200'
              >
                Create Challenge
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
