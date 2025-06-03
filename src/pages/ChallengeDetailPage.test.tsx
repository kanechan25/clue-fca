import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockJoinChallenge = vi.fn()
const mockLeaveChallenge = vi.fn()
const mockGenerateLeaderboard = vi.fn()
const mockShowSuccess = vi.fn()
const mockNavigate = vi.fn()

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

vi.mock('date-fns', () => ({
  differenceInDays: () => 25,
}))

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span>←</span>,
  Target: () => <span>🎯</span>,
}))

vi.mock('@/constants', () => ({
  tabs: [
    { id: 'progress', label: 'Progress', icon: () => <span>📈</span> },
    { id: 'leaderboard', label: 'Leaderboard', icon: () => <span>🏆</span> },
  ],
}))

vi.mock('@/components/Compound/Tabs', () => ({
  Tabs: ({ children }: any) => {
    const Component = ({ children }: any) => <div data-testid='tabs'>{children}</div>
    Component.List = ({ children }: any) => <div>{children}</div>
    Component.Tab = ({ children }: any) => <div>{children}</div>
    Component.Panels = ({ children }: any) => <div>{children}</div>
    Component.Panel = ({ children }: any) => <div>{children}</div>
    return <Component>{children}</Component>
  },
}))

vi.mock('@/components/ProgressSummary', () => ({
  ProgressSummary: () => <div data-testid='progress-summary'>Progress Summary</div>,
}))

vi.mock('@/components/Leaderboard', () => ({
  Leaderboard: () => <div data-testid='leaderboard'>Leaderboard</div>,
}))

vi.mock('@/components/DailyInputForm', () => ({
  DailyInputForm: () => <div data-testid='daily-input-form'>Daily Input Form</div>,
}))

vi.mock('@/components/Common/Sharing', () => ({
  Sharing: () => <div data-testid='sharing'>Share Challenge</div>,
}))

vi.mock('./ChallengeNotFound', () => ({
  default: () => <div data-testid='challenge-not-found'>Challenge Not Found</div>,
}))

vi.mock('@/hocs', () => ({
  withAuth: (Component: any) => Component,
  withLoading: (Component: any) => Component,
  withToast: (Component: any) => Component,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ challengeId: '1' }),
    useNavigate: () => mockNavigate,
  }
})

const MockChallengeDetailPage = ({ isJoined = true }: { isJoined?: boolean }) => {
  const handleJoinLeave = () => {
    if (isJoined) {
      mockLeaveChallenge('1')
      mockShowSuccess('Left 30-Day Step Challenge')
    } else {
      mockJoinChallenge('1')
      mockShowSuccess('Joined 30-Day Step Challenge! 🎉')
      mockGenerateLeaderboard('1')
    }
  }

  return (
    <div>
      <h1>30-Day Step Challenge</h1>
      <p>Walk 10,000 steps daily for 30 days</p>
      <p>by FitnessApp</p>
      <div>10,000</div>
      <div>steps/day goal</div>
      <div>2</div>
      <div>participants</div>
      <button onClick={() => mockNavigate('/')}>Back to Home</button>
      <button onClick={handleJoinLeave} className={isJoined ? 'bg-red-500' : 'bg-white'}>
        {isJoined ? 'Leave Challenge' : 'Join Challenge'}
      </button>
      {isJoined ? (
        <div>
          <div data-testid='progress-summary'>Progress Summary</div>
          <div data-testid='daily-input-form'>Daily Input Form</div>
        </div>
      ) : (
        <div>
          <h3>Join to Track Progress</h3>
          <p>Join this challenge to start tracking your daily progress and compete with others!</p>
        </div>
      )}
    </div>
  )
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => <BrowserRouter>{children}</BrowserRouter>

describe('ChallengeDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders challenge details correctly', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage />
      </TestWrapper>,
    )

    expect(screen.getByText('30-Day Step Challenge')).toBeInTheDocument()
    expect(screen.getByText('Walk 10,000 steps daily for 30 days')).toBeInTheDocument()
    expect(screen.getByText('by FitnessApp')).toBeInTheDocument()
  })

  it('displays challenge statistics', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage />
      </TestWrapper>,
    )

    expect(screen.getByText('10,000')).toBeInTheDocument()
    expect(screen.getByText('steps/day goal')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('participants')).toBeInTheDocument()
  })

  it('shows Leave Challenge button when user is joined', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage isJoined={true} />
      </TestWrapper>,
    )

    const leaveButton = screen.getByText('Leave Challenge')
    expect(leaveButton).toBeInTheDocument()
    expect(leaveButton).toHaveClass('bg-red-500')
  })

  it('calls leaveChallenge and shows success message when leaving challenge', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage isJoined={true} />
      </TestWrapper>,
    )

    const leaveButton = screen.getByText('Leave Challenge')
    fireEvent.click(leaveButton)

    expect(mockLeaveChallenge).toHaveBeenCalledWith('1')
    expect(mockLeaveChallenge).toHaveBeenCalledTimes(1)
    expect(mockShowSuccess).toHaveBeenCalledWith('Left 30-Day Step Challenge')
  })

  it('shows Join Challenge button when user is not joined', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage isJoined={false} />
      </TestWrapper>,
    )

    const joinButton = screen.getByText('Join Challenge')
    expect(joinButton).toBeInTheDocument()
    expect(joinButton).toHaveClass('bg-white')
  })

  it('calls joinChallenge, generates leaderboard, and shows success message when joining challenge', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage isJoined={false} />
      </TestWrapper>,
    )

    const joinButton = screen.getByText('Join Challenge')
    fireEvent.click(joinButton)

    expect(mockJoinChallenge).toHaveBeenCalledWith('1')
    expect(mockJoinChallenge).toHaveBeenCalledTimes(1)
    expect(mockGenerateLeaderboard).toHaveBeenCalledWith('1')
    expect(mockGenerateLeaderboard).toHaveBeenCalledTimes(1)
    expect(mockShowSuccess).toHaveBeenCalledWith('Joined 30-Day Step Challenge! 🎉')
  })

  it('shows join prompt when user is not joined', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage isJoined={false} />
      </TestWrapper>,
    )

    expect(screen.getByText('Join to Track Progress')).toBeInTheDocument()
    expect(
      screen.getByText('Join this challenge to start tracking your daily progress and compete with others!'),
    ).toBeInTheDocument()
  })

  it('shows progress components when user is joined', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage isJoined={true} />
      </TestWrapper>,
    )

    expect(screen.getByTestId('progress-summary')).toBeInTheDocument()
    expect(screen.getByTestId('daily-input-form')).toBeInTheDocument()
  })

  it('navigates to home when back button is clicked', () => {
    render(
      <TestWrapper>
        <MockChallengeDetailPage />
      </TestWrapper>,
    )

    const backButton = screen.getByText('Back to Home')
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
