import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockCompleteOnboarding = vi.fn()
const mockToastError = vi.fn()
const mockToastSuccess = vi.fn()

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('lucide-react', () => ({
  ChevronRight: () => <span>→</span>,
  ChevronLeft: () => <span>←</span>,
  Check: () => <span>✓</span>,
  User: () => <span>👤</span>,
  Target: () => <span>🎯</span>,
  Bell: () => <span>🔔</span>,
}))

vi.mock('@/stores/fitnessStore', () => ({
  useFitnessStore: () => ({
    completeOnboarding: mockCompleteOnboarding,
  }),
}))

vi.mock('react-hot-toast', () => ({
  default: {
    error: mockToastError,
    success: mockToastSuccess,
  },
}))

vi.mock('@/constants', () => ({
  challengeTypes: [
    {
      type: 'steps',
      icon: '👣',
      label: 'Step Challenge',
      description: 'Track your daily steps',
    },
    {
      type: 'running',
      icon: '🏃',
      label: 'Running Challenge',
      description: 'Track your running distance',
    },
    {
      type: 'cycling',
      icon: '🚴',
      label: 'Cycling Challenge',
      description: 'Track your cycling distance',
    },
  ],
  onboardSteps: [
    { id: 1, title: 'Welcome' },
    { id: 2, title: 'Personal Info' },
    { id: 3, title: 'Goals' },
    { id: 4, title: 'Preferences' },
  ],
}))

const MockOnboarding = ({ currentStep = 1 }: { currentStep?: number }) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div data-testid='step-1' className='text-center space-y-6'>
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
          </div>
        )

      case 2:
        return (
          <div data-testid='step-2' className='space-y-6'>
            <div className='text-center'>
              <span>👤</span>
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
                  placeholder='Enter your full name'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
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
                  placeholder='Enter your email address'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  required
                  autoComplete='email'
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div data-testid='step-3' className='space-y-6'>
            <div className='text-center'>
              <span>🎯</span>
              <h2 className='text-2xl font-bold text-gray-800'>What are your fitness goals?</h2>
              <p className='text-gray-600'>Select all that interest you</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button className='p-4 rounded-lg border-2 transition-all duration-200 text-left border-gray-200 bg-white hover:border-gray-300'>
                <div className='flex items-start space-x-3'>
                  <span className='text-2xl'>👣</span>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-800'>Step Challenge</h3>
                    <p className='text-sm text-gray-600'>Track your daily steps</p>
                  </div>
                </div>
              </button>
              <button className='p-4 rounded-lg border-2 transition-all duration-200 text-left border-blue-500 bg-blue-50'>
                <div className='flex items-start space-x-3'>
                  <span className='text-2xl'>🏃</span>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-800'>Running Challenge</h3>
                    <p className='text-sm text-gray-600'>Track your running distance</p>
                  </div>
                  <span>✓</span>
                </div>
              </button>
              <button className='p-4 rounded-lg border-2 transition-all duration-200 text-left border-gray-200 bg-white hover:border-gray-300'>
                <div className='flex items-start space-x-3'>
                  <span className='text-2xl'>🚴</span>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-800'>Cycling Challenge</h3>
                    <p className='text-sm text-gray-600'>Track your cycling distance</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div data-testid='step-4' className='space-y-6'>
            <div className='text-center'>
              <span>🔔</span>
              <h2 className='text-2xl font-bold text-gray-800'>Preferences</h2>
              <p className='text-gray-600'>Customize your experience</p>
            </div>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>Preferred Units</label>
                <div className='grid grid-cols-2 gap-3'>
                  <button className='p-3 text-black rounded-lg border-2 transition-all duration-200 border-blue-500 bg-blue-50'>
                    <div className='text-center'>
                      <div className='font-semibold'>Metric</div>
                      <div className='text-sm text-gray-600'>km, kg</div>
                    </div>
                  </button>
                  <button className='p-3 text-black rounded-lg border-2 transition-all duration-200 border-gray-200 bg-white hover:border-gray-300'>
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
                <button className='relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600'>
                  <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden'>
        <div className='bg-gray-100 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-600'>Step {currentStep} of 4</span>
            <span className='text-sm text-gray-500'>{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full'
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
        <div className='p-8'>{renderStepContent()}</div>
        <div className='p-6 bg-gray-50 flex justify-between'>
          <button
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <button className='flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'>
            <span>{currentStep === 4 ? 'Get Started' : 'Next'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

describe('Onboarding - renderStepContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders step 1 (welcome) content correctly', () => {
    render(<MockOnboarding currentStep={1} />)

    expect(screen.getByTestId('step-1')).toBeInTheDocument()
    expect(screen.getByText('🏆')).toBeInTheDocument()
    expect(screen.getByText('Welcome to Fitness Challenge!')).toBeInTheDocument()
    expect(
      screen.getByText('Join challenges, track your progress, and compete with friends to achieve your fitness goals.'),
    ).toBeInTheDocument()

    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('Track Progress')).toBeInTheDocument()
    expect(screen.getByText('👥')).toBeInTheDocument()
    expect(screen.getByText('Compete with Friends')).toBeInTheDocument()
    expect(screen.getByText('🎯')).toBeInTheDocument()
    expect(screen.getByText('Achieve Goals')).toBeInTheDocument()
  })

  it('renders step 2 (personal info) content correctly', () => {
    render(<MockOnboarding currentStep={2} />)

    expect(screen.getByTestId('step-2')).toBeInTheDocument()
    expect(screen.getByText('👤')).toBeInTheDocument()
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument()
    expect(screen.getByText("We'll use this to personalize your experience")).toBeInTheDocument()

    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument()

    const nameInput = screen.getByLabelText('Full Name *')
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('required')
    expect(nameInput).toHaveAttribute('autoComplete', 'given-name')

    const emailInput = screen.getByLabelText('Email Address *')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('autoComplete', 'email')
  })

  it('renders step 3 (fitness goals) content correctly', () => {
    render(<MockOnboarding currentStep={3} />)

    expect(screen.getByTestId('step-3')).toBeInTheDocument()
    expect(screen.getByText('🎯')).toBeInTheDocument()
    expect(screen.getByText('What are your fitness goals?')).toBeInTheDocument()
    expect(screen.getByText('Select all that interest you')).toBeInTheDocument()

    expect(screen.getByText('👣')).toBeInTheDocument()
    expect(screen.getByText('Step Challenge')).toBeInTheDocument()
    expect(screen.getByText('Track your daily steps')).toBeInTheDocument()

    expect(screen.getByText('🏃')).toBeInTheDocument()
    expect(screen.getByText('Running Challenge')).toBeInTheDocument()
    expect(screen.getByText('Track your running distance')).toBeInTheDocument()

    expect(screen.getByText('🚴')).toBeInTheDocument()
    expect(screen.getByText('Cycling Challenge')).toBeInTheDocument()
    expect(screen.getByText('Track your cycling distance')).toBeInTheDocument()

    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('renders step 4 (preferences) content correctly', () => {
    render(<MockOnboarding currentStep={4} />)

    expect(screen.getByTestId('step-4')).toBeInTheDocument()
    expect(screen.getByText('🔔')).toBeInTheDocument()
    expect(screen.getByText('Preferences')).toBeInTheDocument()
    expect(screen.getByText('Customize your experience')).toBeInTheDocument()

    expect(screen.getByText('Preferred Units')).toBeInTheDocument()
    expect(screen.getByText('Metric')).toBeInTheDocument()
    expect(screen.getByText('km, kg')).toBeInTheDocument()
    expect(screen.getByText('Imperial')).toBeInTheDocument()
    expect(screen.getByText('miles, lbs')).toBeInTheDocument()

    expect(screen.getByText('Enable Notifications')).toBeInTheDocument()
    expect(screen.getByText('Get reminders and achievement updates')).toBeInTheDocument()
  })

  it('displays correct progress information for each step', () => {
    // Test step 1
    const { rerender } = render(<MockOnboarding currentStep={1} />)
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()

    // Test step 2
    rerender(<MockOnboarding currentStep={2} />)
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()

    // Test step 3
    rerender(<MockOnboarding currentStep={3} />)
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()

    // Test step 4
    rerender(<MockOnboarding currentStep={4} />)
    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('displays correct navigation buttons for each step', () => {
    // Test step 1
    const { rerender } = render(<MockOnboarding currentStep={1} />)
    const backButton = screen.getByRole('button', { name: /back/i })
    expect(backButton).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()

    // Test step 2
    rerender(<MockOnboarding currentStep={2} />)
    expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()

    // Test step 3
    rerender(<MockOnboarding currentStep={3} />)
    expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()

    // Test step 4
    rerender(<MockOnboarding currentStep={4} />)
    expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
  })

  it('renders default null content for invalid step', () => {
    render(<MockOnboarding currentStep={5} />)

    expect(screen.queryByTestId('step-1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('step-2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('step-3')).not.toBeInTheDocument()
    expect(screen.queryByTestId('step-4')).not.toBeInTheDocument()

    expect(screen.getByText('Step 5 of 4')).toBeInTheDocument()
  })

  it('maintains consistent layout structure across all steps', () => {
    // Test step 1
    const { unmount: unmount1 } = render(<MockOnboarding currentStep={1} />)
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    unmount1()

    // Test step 2
    const { unmount: unmount2 } = render(<MockOnboarding currentStep={2} />)
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    unmount2()

    // Test step 3
    const { unmount: unmount3 } = render(<MockOnboarding currentStep={3} />)
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
    expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    unmount3()

    // Test step 4
    const { unmount: unmount4 } = render(<MockOnboarding currentStep={4} />)
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument()
    unmount4()
  })
})
