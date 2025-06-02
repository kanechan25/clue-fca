import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, User, Target, Bell } from 'lucide-react'
import { useFitnessStore } from '@/stores/fitnessStore'
import type { OnboardingData, ChallengeType } from '@/types'
import toast from 'react-hot-toast'

const steps = [
  { id: 1, title: 'Welcome', icon: '👋' },
  { id: 2, title: 'Profile', icon: '👤' },
  { id: 3, title: 'Goals', icon: '🎯' },
  { id: 4, title: 'Preferences', icon: '⚙️' },
]

const challengeTypes: { type: ChallengeType; label: string; icon: string; description: string }[] = [
  { type: 'steps', label: 'Daily Steps', icon: '🚶', description: 'Track your daily walking goals' },
  { type: 'distance', label: 'Running/Walking', icon: '🏃', description: 'Monitor distance covered' },
  { type: 'calories', label: 'Calorie Burn', icon: '🔥', description: 'Track calories burned through activities' },
  { type: 'weight_loss', label: 'Weight Management', icon: '⚖️', description: 'Monitor weight loss progress' },
  { type: 'workout_time', label: 'Workout Time', icon: '💪', description: 'Track exercise duration' },
]

export const Onboarding = () => {
  const { completeOnboarding } = useFitnessStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    fitnessGoals: [],
    preferredUnits: 'metric',
    notificationsEnabled: true,
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGoalToggle = (type: ChallengeType) => {
    setFormData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(type)
        ? prev.fitnessGoals.filter((goal) => goal !== type)
        : [...prev.fitnessGoals, type],
    }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setFormData((prev) => ({ ...prev, name: newName }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setFormData((prev) => ({ ...prev, email: newEmail }))
  }

  const handleComplete = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.fitnessGoals.length === 0) {
      toast.error('Please select at least one fitness goal')
      return
    }

    completeOnboarding(formData)
    toast.success('Welcome to Fitness Challenge! 🎉')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 2:
        return formData.name.trim() && formData.email.trim()
      case 3:
        return formData.fitnessGoals.length > 0
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center space-y-6'>
            <div className='text-6xl mb-4'>🏆</div>
            <h2 className='text-3xl font-bold text-gray-800'>Welcome to Fitness Challenge!</h2>
            <p className='text-lg text-gray-600 max-w-md mx-auto'>
              Join challenges, track your progress, and compete with friends to achieve your fitness goals.
            </p>
            <div className='flex justify-center space-x-8 mt-8'>
              <div className='text-center'>
                <div className='text-2xl mb-2'>📊</div>
                <p className='text-sm text-gray-600'>Track Progress</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl mb-2'>👥</div>
                <p className='text-sm text-gray-600'>Compete with Friends</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl mb-2'>🎯</div>
                <p className='text-sm text-gray-600'>Achieve Goals</p>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
            <div className='text-center'>
              <User className='w-12 h-12 text-blue-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-gray-800'>Tell us about yourself</h2>
              <p className='text-gray-600'>We'll use this to personalize your experience</p>
            </div>

            <div className='space-y-4'>
              <div>
                <label htmlFor='name-input' className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name *
                </label>
                <input
                  id='name-input'
                  type='text'
                  value={formData.name}
                  onChange={handleNameChange}
                  onInput={handleNameChange}
                  placeholder='Enter your full name'
                  className='w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  required
                  autoComplete='given-name'
                />
              </div>

              <div>
                <label htmlFor='email-input' className='block text-sm font-medium text-gray-700 mb-2'>
                  Email Address *
                </label>
                <input
                  id='email-input'
                  type='email'
                  value={formData.email}
                  onChange={handleEmailChange}
                  onInput={handleEmailChange}
                  placeholder='Enter your email address'
                  className='w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  required
                  autoComplete='email'
                />
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
            <div className='text-center'>
              <Target className='w-12 h-12 text-green-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-gray-800'>What are your fitness goals?</h2>
              <p className='text-gray-600'>Select all that interest you</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {challengeTypes.map((challengeType) => (
                <motion.button
                  key={challengeType.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGoalToggle(challengeType.type)}
                  className={`p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.fitnessGoals.includes(challengeType.type)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className='flex items-start space-x-3'>
                    <span className='text-2xl'>{challengeType.icon}</span>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-800'>{challengeType.label}</h3>
                      <p className='text-sm text-gray-600'>{challengeType.description}</p>
                    </div>
                    {formData.fitnessGoals.includes(challengeType.type) && (
                      <Check className='w-5 h-5 text-blue-500 flex-shrink-0' />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
            <div className='text-center'>
              <Bell className='w-12 h-12 text-purple-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold text-gray-800'>Preferences</h2>
              <p className='text-gray-600'>Customize your experience</p>
            </div>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>Preferred Units</label>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, preferredUnits: 'metric' }))}
                    className={`p-3 text-black cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                      formData.preferredUnits === 'metric'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className='text-center'>
                      <div className='font-semibold'>Metric</div>
                      <div className='text-sm text-gray-600'>km, kg</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, preferredUnits: 'imperial' }))}
                    className={`p-3 text-black cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                      formData.preferredUnits === 'imperial'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className='text-center'>
                      <div className='font-semibold'>Imperial</div>
                      <div className='text-sm text-gray-600'>miles, lbs</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                <div>
                  <h3 className='font-semibold text-gray-800'>Enable Notifications</h3>
                  <p className='text-sm text-gray-600'>Get reminders and achievement updates</p>
                </div>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    formData.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden'>
        {/* Progress Bar */}
        <div className='bg-gray-100 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-600'>
              Step {currentStep} of {steps.length}
            </span>
            <span className='text-sm text-gray-500'>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <motion.div
              className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full'
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className='p-8'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className='p-6 bg-gray-50 flex justify-between'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className='w-4 h-4' />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={currentStep === steps.length ? handleComplete : handleNext}
            disabled={!canProceed()}
            className={`flex cursor-pointer items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === steps.length ? 'Get Started' : 'Next'}</span>
            <ChevronRight className='w-4 h-4' />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
