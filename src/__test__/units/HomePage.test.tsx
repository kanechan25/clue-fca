import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import HomePage from '@/pages/HomePage'
import { render, mockUser } from '../utils'
import { mockToast } from '../setup'
import { ChallengeType, Unit } from '@/types'
import { addDays } from 'date-fns'
import { mockChallenges } from '@/constants/mock'

const mockUseFitnessStore = vi.fn()
vi.mock('@/stores/fitnessStore', () => ({
  useFitnessStore: () => mockUseFitnessStore(),
}))

vi.mock('@/components/UserSettings', () => ({
  UserSettings: ({ user }: any) => (
    <div data-testid='user-settings'>
      <span>{user.name}</span>
      <span>{user.email}</span>
    </div>
  ),
}))

vi.mock('@/components/ChallengeCard', () => ({
  ChallengeCard: ({ challenge, onJoin, onLeave }: any) => (
    <div data-testid={`challenge-card-${challenge.id}`}>
      <h3>{challenge.name}</h3>
      <p>{challenge.description}</p>
      <span>{challenge.type}</span>
      <button onClick={() => onJoin?.(challenge.id)}>Join Challenge</button>
      <button onClick={() => onLeave?.(challenge.id)}>Leave Challenge</button>
    </div>
  ),
}))
vi.mock('@/components/CreateChallengeModal', () => ({
  CreateChallengeModal: ({ isOpen, onClose, onCreateChallenge }: any) =>
    isOpen ? (
      <div data-testid='create-challenge-modal'>
        <button onClick={onClose}>Close</button>
        <button
          data-testid='modal-create-button'
          onClick={() =>
            onCreateChallenge({
              id: 'new-challenge',
              name: 'New Test Challenge',
              description: 'Test description',
              type: ChallengeType.STEPS,
              goal: 5000,
              unit: Unit.STEPS,
              duration: 14,
              startDate: new Date(),
              endDate: addDays(new Date(), 14),
              participants: [],
              creator: 'Alex Johnson',
              isActive: true,
              imageUrl: '🚶',
            })
          }
        >
          Create Challenge
        </button>
      </div>
    ) : null,
}))

vi.mock('@/components/Common/Dropdown', () => ({
  default: () => <div data-testid='dropdown-icon' />,
}))

describe('HomePage', () => {
  const mockLoadMockData = vi.fn()
  const mockGenerateLeaderboard = vi.fn()
  const mockAddChallenge = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseFitnessStore.mockReturnValue({
      user: mockUser,
      challenges: mockChallenges,
      userProgress: {
        '1': {
          challengeId: '1',
          userId: 'user1',
          dailyEntries: [{ date: new Date().toISOString().split('T')[0], value: 20000, notes: 'Good start' }],
          totalProgress: 20000,
          rank: 1,
          joined: new Date(),
          completed: false,
        },
      },
      loadMockData: mockLoadMockData,
      generateLeaderboard: mockGenerateLeaderboard,
      addChallenge: mockAddChallenge,
    })
  })

  describe('Basic Rendering', () => {
    it('should render the main header with app title', () => {
      render(<HomePage />)
      expect(screen.getByText('🏆')).toBeInTheDocument()
      expect(screen.getByText('Fitness Challenge')).toBeInTheDocument()
    })

    it('should render welcome message with user name', () => {
      render(<HomePage />)
      expect(screen.getByText('Welcome back, Alex Johnson! 👋')).toBeInTheDocument()
      expect(screen.getByText('Ready to crush your fitness goals today?')).toBeInTheDocument()
    })

    it('should render user settings component when user is logged in', () => {
      render(<HomePage />)

      expect(screen.getByTestId('user-settings')).toBeInTheDocument()
      expect(screen.getByText(mockUser.name)).toBeInTheDocument()
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    })

    it('should not render user settings when no user is logged in', () => {
      mockUseFitnessStore.mockReturnValue({
        user: null,
        challenges: mockChallenges,
        userProgress: {},
        loadMockData: mockLoadMockData,
        generateLeaderboard: mockGenerateLeaderboard,
        addChallenge: mockAddChallenge,
      })

      render(<HomePage />)
      expect(screen.queryByTestId('user-settings')).not.toBeInTheDocument()
    })
  })

  describe('Stats Cards', () => {
    it('should display active challenges count', () => {
      render(<HomePage />)
      expect(screen.getByText('Active Challenges')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument() // One joined challenge
    })

    it('should display total progress information', () => {
      render(<HomePage />)
      expect(screen.getByText('Total Progress')).toBeInTheDocument()
    })

    it('should display total participants count', () => {
      render(<HomePage />)

      expect(screen.getByText('Total Participants')).toBeInTheDocument()
      const totalParticipants = mockChallenges.reduce(
        (sum, challenge) => sum + (Array.isArray(challenge?.participants) ? challenge.participants.length : 0),
        0,
      )
      expect(screen.getByText(totalParticipants.toLocaleString())).toBeInTheDocument()
    })

    it('should show "No active challenges" when user has no progress', () => {
      mockUseFitnessStore.mockReturnValue({
        user: mockUser,
        challenges: mockChallenges,
        userProgress: {},
        loadMockData: mockLoadMockData,
        generateLeaderboard: mockGenerateLeaderboard,
        addChallenge: mockAddChallenge,
      })

      render(<HomePage />)
      expect(screen.getByText('No active challenges')).toBeInTheDocument()
    })
  })

  describe('Search and Filters', () => {
    it('should render search input with placeholder', () => {
      render(<HomePage />)
      const searchInput = screen.getByPlaceholderText('Search challenges...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should filter challenges based on search query', async () => {
      render(<HomePage />)
      const searchInput = screen.getByPlaceholderText('Search challenges...')
      fireEvent.change(searchInput, { target: { value: '30-Day Step' } })
      await waitFor(() => {
        expect(screen.getByTestId('challenge-card-1')).toBeInTheDocument()
      })
    })

    it('should render filter dropdown with options', () => {
      render(<HomePage />)
      const filterSelect = screen.getByDisplayValue('All Challenges')
      expect(filterSelect).toBeInTheDocument()
    })

    it('should render sort dropdown with options', () => {
      render(<HomePage />)
      const sortSelect = screen.getByDisplayValue('Most Recent')
      expect(sortSelect).toBeInTheDocument()
    })

    it('should render Create Challenge button', () => {
      render(<HomePage />)
      const createButton = screen.getByRole('button', { name: /create challenge/i })
      expect(createButton).toBeInTheDocument()
    })
  })

  describe('Challenge List', () => {
    it('should render challenge cards for available challenges', () => {
      render(<HomePage />)
      expect(screen.getByTestId('challenge-card-1')).toBeInTheDocument()
      expect(screen.getByText('30-Day Step Challenge')).toBeInTheDocument()
      expect(
        screen.getByText('Walk 10,000 steps daily for 30 days. Join friends and track your progress!'),
      ).toBeInTheDocument()
    })

    it('should show "No challenges found" when no challenges match filters', () => {
      mockUseFitnessStore.mockReturnValue({
        user: mockUser,
        challenges: [],
        userProgress: {},
        loadMockData: mockLoadMockData,
        generateLeaderboard: mockGenerateLeaderboard,
        addChallenge: mockAddChallenge,
      })
      render(<HomePage />)
      expect(screen.getByText('🔍')).toBeInTheDocument()
      expect(screen.getByText('No challenges found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument()
    })

    it('should load mock data if no challenges exist', () => {
      mockUseFitnessStore.mockReturnValue({
        user: mockUser,
        challenges: [],
        userProgress: {},
        loadMockData: mockLoadMockData,
        generateLeaderboard: mockGenerateLeaderboard,
        addChallenge: mockAddChallenge,
      })
      render(<HomePage />)
      expect(mockLoadMockData).toHaveBeenCalled()
    })
  })

  describe('Challenge Interactions', () => {
    it('should handle joining a challenge', async () => {
      render(<HomePage />)
      // Get the first Join Challenge button
      const joinButtons = screen.getAllByText('Join Challenge')
      const joinButton = joinButtons[0]
      fireEvent.click(joinButton)
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Joined "30-Day Step Challenge"! 🎉')
        expect(mockGenerateLeaderboard).toHaveBeenCalledWith('1')
      })
    })

    it('should handle leaving a challenge', async () => {
      render(<HomePage />)
      // Get the first Leave Challenge button
      const leaveButtons = screen.getAllByText('Leave Challenge')
      const leaveButton = leaveButtons[0]
      fireEvent.click(leaveButton)
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Left "30-Day Step Challenge"')
      })
    })
  })

  describe('Create Challenge Modal', () => {
    it('should open create challenge modal when button is clicked', async () => {
      render(<HomePage />)
      const createButton = screen.getByRole('button', { name: /create challenge/i })
      fireEvent.click(createButton)
      await waitFor(() => {
        expect(screen.getByTestId('create-challenge-modal')).toBeInTheDocument()
      })
    })

    it('should close modal when close button is clicked', async () => {
      render(<HomePage />)
      // Open modal
      const createButton = screen.getByRole('button', { name: /create challenge/i })
      fireEvent.click(createButton)
      await waitFor(() => {
        expect(screen.getByTestId('create-challenge-modal')).toBeInTheDocument()
      })
      // Close modal
      const closeButton = screen.getByText('Close')
      fireEvent.click(closeButton)
      await waitFor(() => {
        expect(screen.queryByTestId('create-challenge-modal')).not.toBeInTheDocument()
      })
    })

    it('should handle challenge creation successfully', async () => {
      render(<HomePage />)
      // Open modal
      const createButton = screen.getByRole('button', { name: /create challenge/i })
      fireEvent.click(createButton)
      await waitFor(() => {
        expect(screen.getByTestId('create-challenge-modal')).toBeInTheDocument()
      })
      // Create challenge
      const createChallengeButton = screen.getByTestId('modal-create-button')
      fireEvent.click(createChallengeButton)
      await waitFor(() => {
        expect(mockAddChallenge).toHaveBeenCalled()
        expect(mockToast.success).toHaveBeenCalledWith('Challenge created successfully! 🎉')
        expect(screen.queryByTestId('create-challenge-modal')).not.toBeInTheDocument()
      })
    })
  })
  describe('Filter Functionality', () => {
    it('should filter challenges by type', async () => {
      render(<HomePage />)
      const filterSelect = screen.getByDisplayValue('All Challenges')
      fireEvent.change(filterSelect, { target: { value: 'steps' } })
      await waitFor(() => {
        expect(screen.getByTestId('challenge-card-1')).toBeInTheDocument()
      })
    })
    it('should filter to show only active challenges user has joined', async () => {
      render(<HomePage />)
      const filterSelect = screen.getByDisplayValue('All Challenges')
      fireEvent.change(filterSelect, { target: { value: 'actives' } })
      await waitFor(() => {
        expect(screen.getByTestId('challenge-card-1')).toBeInTheDocument()
      })
    })
  })
})
