import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import ChallengeDetailPage from '@/pages/ChallengeDetailPage'
import { render, mockUser, mockChallenge } from '../utils'
import { mockToast } from '../setup'

const mockUseFitnessStore = vi.fn()
vi.mock('@/stores/fitnessStore', () => ({
  useFitnessStore: () => mockUseFitnessStore(),
}))

vi.mock('@/components/ProgressSummary', () => ({
  ProgressSummary: ({ challengeId }: any) => (
    <div data-testid={`progress-summary-${challengeId}`}>
      <h3>Your Progress</h3>
      <div>Overall Progress: 0%</div>
      <div>Today's Progress: 0%</div>
      <div>0 / 300,000 steps</div>
      <div>0 / 10,000 steps</div>
      <div>0 Days Active</div>
      <div>0 Daily Avg</div>
      <div>0% Complete</div>
    </div>
  ),
}))

vi.mock('@/components/Leaderboard', () => ({
  Leaderboard: ({ challengeId }: any) => (
    <div data-testid={`leaderboard-${challengeId}`}>
      <h3>Leaderboard</h3>
      <div>1. Alex Johnson - 20000 steps</div>
      <div>2. Other User - 15000 steps</div>
    </div>
  ),
}))

vi.mock('@/components/DailyInputForm', () => ({
  DailyInputForm: ({ challengeId }: any) => (
    <div data-testid={`daily-input-form-${challengeId}`}>
      <button className='bg-blue-500 text-white px-4 py-2 rounded'>+ Add Progress</button>
    </div>
  ),
}))

vi.mock('@/components/Common/Sharing', () => ({
  Sharing: ({ challengeId }: any) => (
    <div data-testid={`sharing-${challengeId}`}>
      <button>Share Challenge</button>
    </div>
  ),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ challengeId: '1' }),
  }
})
describe('ChallengeDetailPage', () => {
  const mockGenerateLeaderboard = vi.fn()
  const mockJoinChallenge = vi.fn()
  const mockLeaveChallenge = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })
  describe('Challenge Not Found', () => {
    it('should render challenge not found when challenge does not exist', () => {
      mockUseFitnessStore.mockReturnValue({
        challenges: [],
        userProgress: {},
        leaderboards: {},
        generateLeaderboard: mockGenerateLeaderboard,
        joinChallenge: mockJoinChallenge,
        leaveChallenge: mockLeaveChallenge,
      })

      render(<ChallengeDetailPage />)

      expect(screen.getByText('😕')).toBeInTheDocument()
      expect(screen.getByText('Challenge Not Found')).toBeInTheDocument()
      expect(screen.getByText('Back to Home')).toBeInTheDocument()
    })
  })
  describe('User NOT Joined Challenge - Image 1 State', () => {
    beforeEach(() => {
      mockUseFitnessStore.mockReturnValue({
        challenges: [mockChallenge],
        userProgress: {}, // No progress = not joined
        leaderboards: {},
        generateLeaderboard: mockGenerateLeaderboard,
        joinChallenge: mockJoinChallenge,
        leaveChallenge: mockLeaveChallenge,
      })
    })
    it('should display challenge information correctly', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByText('30-Day Step Challenge')).toBeInTheDocument()
      expect(screen.getByText('by FitnessApp')).toBeInTheDocument()
      expect(
        screen.getByText('Walk 10,000 steps daily for 30 days. Join friends and track your progress!'),
      ).toBeInTheDocument()
      expect(screen.getByText('🚶')).toBeInTheDocument()
    })

    it('should show Join Challenge button in header', () => {
      render(<ChallengeDetailPage />)
      const joinButtons = screen.getAllByText('Join Challenge')
      expect(joinButtons).toHaveLength(2)

      const headerButton = joinButtons[0]
      expect(headerButton.closest('button')).toHaveClass('bg-white', 'text-blue-600')
    })
    it('should display challenge stats with 0% progress', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByText('10,000')).toBeInTheDocument()
      expect(screen.getByText('steps/day goal')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument() // participants
      expect(screen.getByText('participants')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument() // user progress
      expect(screen.getByText('your progress')).toBeInTheDocument()
    })
    it('should show "Join to Track Progress" message in content area', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByText('Join to Track Progress')).toBeInTheDocument()
      expect(
        screen.getByText('Join this challenge to start tracking your daily progress and compete with others!'),
      ).toBeInTheDocument()

      // Should have two Join Challenge buttons (header + content)
      const joinButtons = screen.getAllByText('Join Challenge')
      expect(joinButtons).toHaveLength(2)
    })
    it('should NOT show progress tracking components when not joined', () => {
      render(<ChallengeDetailPage />)

      expect(screen.queryByTestId('progress-summary-1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('daily-input-form-1')).not.toBeInTheDocument()
      expect(screen.queryByText('Your Progress')).not.toBeInTheDocument()
      expect(screen.queryByText('+ Add Progress')).not.toBeInTheDocument()
    })
    it('should handle joining the challenge', async () => {
      render(<ChallengeDetailPage />)

      const joinButtons = screen.getAllByText('Join Challenge')
      const headerButton = joinButtons[0] // Click header button
      fireEvent.click(headerButton)
      await waitFor(() => {
        expect(mockJoinChallenge).toHaveBeenCalledWith('1')
        expect(mockToast.success).toHaveBeenCalledWith('Joined 30-Day Step Challenge! 🎉')
        expect(mockGenerateLeaderboard).toHaveBeenCalledWith('1')
      })
    })
  })

  describe('User HAS Joined Challenge - Image 2 State', () => {
    beforeEach(() => {
      // Mock store for user who HAS joined the challenge
      mockUseFitnessStore.mockReturnValue({
        challenges: [mockChallenge],
        userProgress: {
          '1': {
            challengeId: '1',
            userId: 'user1',
            dailyEntries: [{ date: new Date().toISOString().split('T')[0], value: 0, notes: '' }],
            totalProgress: 0, // 0 progress but joined
            rank: 1,
            joined: new Date(),
            completed: false,
          },
        },
        leaderboards: {
          '1': [
            {
              user: mockUser,
              progress: {
                challengeId: '1',
                userId: 'user1',
                dailyEntries: [],
                totalProgress: 0,
                rank: 1,
                joined: new Date(),
                completed: false,
              },
              rank: 1,
              badge: '🥇',
            },
          ],
        },
        generateLeaderboard: mockGenerateLeaderboard,
        joinChallenge: mockJoinChallenge,
        leaveChallenge: mockLeaveChallenge,
      })
    })

    it('should show Leave Challenge button in header', () => {
      render(<ChallengeDetailPage />)

      const leaveButton = screen.getByText('Leave Challenge')
      expect(leaveButton).toBeInTheDocument()
      expect(leaveButton.closest('button')).toHaveClass('bg-red-500', 'text-white')
    })

    it('should display challenge stats with 0% progress but joined state', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByText('10,000')).toBeInTheDocument()
      expect(screen.getByText('steps/day goal')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument() // participants
      expect(screen.getByText('participants')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument() // user progress (still 0% but joined)
      expect(screen.getByText('your progress')).toBeInTheDocument()
    })
    it('should show progress tracking components when joined', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByTestId('progress-summary-1')).toBeInTheDocument()
      expect(screen.getByTestId('daily-input-form-1')).toBeInTheDocument()
      expect(screen.getByText('Your Progress')).toBeInTheDocument()
      expect(screen.getByText('+ Add Progress')).toBeInTheDocument()
    })
    it('should show progress details matching the image', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByText('Overall Progress: 0%')).toBeInTheDocument()
      expect(screen.getByText("Today's Progress: 0%")).toBeInTheDocument()
      expect(screen.getByText('0 / 300,000 steps')).toBeInTheDocument() // 10k * 30 days
      expect(screen.getByText('0 / 10,000 steps')).toBeInTheDocument() // daily goal
      expect(screen.getByText('0 Days Active')).toBeInTheDocument()
      expect(screen.getByText('0 Daily Avg')).toBeInTheDocument()
      expect(screen.getByText('0% Complete')).toBeInTheDocument()
    })
    it('should NOT show "Join to Track Progress" message when joined', () => {
      render(<ChallengeDetailPage />)
      expect(screen.queryByText('Join to Track Progress')).not.toBeInTheDocument()
      expect(
        screen.queryByText('Join this challenge to start tracking your daily progress and compete with others!'),
      ).not.toBeInTheDocument()
    })
    it('should handle leaving the challenge', async () => {
      render(<ChallengeDetailPage />)
      const leaveButton = screen.getByText('Leave Challenge')
      fireEvent.click(leaveButton)
      await waitFor(() => {
        expect(mockLeaveChallenge).toHaveBeenCalledWith('1')
        expect(mockToast.success).toHaveBeenCalledWith('Left 30-Day Step Challenge')
      })
    })
  })
  describe('Tab Navigation', () => {
    beforeEach(() => {
      mockUseFitnessStore.mockReturnValue({
        challenges: [mockChallenge],
        userProgress: {
          '1': {
            challengeId: '1',
            userId: 'user1',
            dailyEntries: [],
            totalProgress: 0,
            rank: 1,
            joined: new Date(),
            completed: false,
          },
        },
        leaderboards: { '1': [] },
        generateLeaderboard: mockGenerateLeaderboard,
        joinChallenge: mockJoinChallenge,
        leaveChallenge: mockLeaveChallenge,
      })
    })
    it('should render progress and leaderboard tabs', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByText('Progress')).toBeInTheDocument()
      expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    })
    it('should default to progress tab', () => {
      render(<ChallengeDetailPage />)

      const progressTab = screen.getByText('Progress').closest('button')
      expect(progressTab).toHaveClass('border-blue-500', 'text-blue-600')
    })
    it('should switch to leaderboard tab when clicked', async () => {
      render(<ChallengeDetailPage />)
      const leaderboardTab = screen.getByText('Leaderboard')
      fireEvent.click(leaderboardTab)
      await waitFor(() => {
        expect(screen.getByTestId('leaderboard-1')).toBeInTheDocument()
      })
    })
  })

  describe('Basic Navigation', () => {
    beforeEach(() => {
      mockUseFitnessStore.mockReturnValue({
        challenges: [mockChallenge],
        userProgress: {},
        leaderboards: {},
        generateLeaderboard: mockGenerateLeaderboard,
        joinChallenge: mockJoinChallenge,
        leaveChallenge: mockLeaveChallenge,
      })
    })

    it('should render back to home button and sharing component', () => {
      render(<ChallengeDetailPage />)

      expect(screen.getByText('Back to Home')).toBeInTheDocument()
      expect(screen.getByTestId('sharing-1')).toBeInTheDocument()
      expect(screen.getByText('Share Challenge')).toBeInTheDocument()
    })

    it('should navigate back when back button is clicked', () => {
      render(<ChallengeDetailPage />)
      const backButton = screen.getByText('Back to Home')
      fireEvent.click(backButton)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
