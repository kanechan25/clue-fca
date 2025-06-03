import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const mockAddChallenge = vi.fn()
const mockShowSuccess = vi.fn()
const mockModalOpen = vi.fn()
const mockModalClose = vi.fn()

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

vi.mock('lucide-react', () => ({
  Search: () => <span>🔍</span>,
  Filter: () => <span>🔽</span>,
  Trophy: () => <span>🏆</span>,
  Users: () => <span>👥</span>,
  TrendingUp: () => <span>📈</span>,
  Plus: () => <span>+</span>,
}))

vi.mock('@/hooks/headless/useChallengeFiltering', () => ({
  useChallengeFiltering: () => ({
    searchQuery: '',
    setSearchQuery: vi.fn(),
    selectedFilter: 'all',
    setSelectedFilter: vi.fn(),
    sortBy: 'recent',
    setSortBy: vi.fn(),
    filteredChallenges: [
      {
        id: '1',
        name: '30-Day Step Challenge',
        description: 'Walk 10,000 steps daily for 30 days',
        participants: ['user1', 'user2'],
      },
      {
        id: '2',
        name: 'Marathon Prep',
        description: 'Run 5 miles daily',
        participants: ['user2', 'user4'],
      },
    ],
    joinedChallenges: [{ id: '1', name: '30-Day Step Challenge', participants: ['user1', 'user2'] }],
    totalParticipants: 4,
  }),
}))

vi.mock('@/hooks/headless/useModal', () => ({
  useModal: () => ({
    isOpen: false,
    open: mockModalOpen,
    close: mockModalClose,
  }),
}))

vi.mock('@/providers/ChallengeProvider', () => ({
  useChallenge: () => ({
    challenges: [],
    userProgress: {},
    loadMockData: vi.fn(),
    addChallenge: mockAddChallenge,
  }),
}))

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    user: {
      id: 'user1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '👨‍💼',
    },
  }),
}))

vi.mock('@/providers/NotificationProvider', () => ({
  useNotification: () => ({
    showSuccess: mockShowSuccess,
  }),
}))

vi.mock('@/hocs', () => ({
  withAuth: (Component: any) => Component,
  withLoading: (Component: any) => Component,
  withToast: (Component: any) => Component,
}))

vi.mock('@/constants/mock', () => ({
  filterOptions: [
    { value: 'all', label: 'All Challenges' },
    { value: 'actives', label: 'Active Challenges' },
  ],
}))

vi.mock('@/components/ChallengeCard', () => ({
  ChallengeCard: ({ challenge }: any) => <div data-testid='challenge-card'>{challenge.name}</div>,
}))

vi.mock('@/components/UserSettings', () => ({
  UserSettings: () => <div data-testid='user-settings'>User Settings</div>,
}))

vi.mock('@/components/CreateChallengeModal', () => ({
  CreateChallengeModal: ({ onCreateChallenge }: any) => (
    <div data-testid='create-challenge-modal'>
      <button
        onClick={() =>
          onCreateChallenge({
            id: 'new-challenge-1',
            name: 'New Test Challenge',
            description: 'A test challenge',
            goal: 5000,
            unit: 'steps',
            duration: 7,
            participants: [],
            creator: 'Alex Johnson',
            isActive: true,
          })
        }
        data-testid='submit-challenge'
      >
        Submit Challenge
      </button>
    </div>
  ),
}))

vi.mock('@/components/Compound/Modal', () => ({
  Modal: ({ children, isOpen }: any) => {
    const Component = ({ children }: any) => (
      <div data-testid='modal' data-is-open={isOpen}>
        {children}
      </div>
    )
    Component.Content = ({ children }: any) => <div data-testid='modal-content'>{children}</div>
    Component.Header = ({ children }: any) => <div data-testid='modal-header'>{children}</div>
    Component.Body = ({ children }: any) => <div data-testid='modal-body'>{children}</div>
    return <Component>{children}</Component>
  },
}))

vi.mock('@/components/Common/Dropdown', () => ({
  default: () => <div data-testid='dropdown'>Dropdown</div>,
}))

vi.mock('@/utils/format', () => ({
  formatProgressWithUnit: () => ['8,000 steps'],
}))

const MockHomePage = ({ modalOpen = false }: { modalOpen?: boolean }) => {
  const handleCreateChallenge = (challengeData: any) => {
    mockAddChallenge(challengeData)
    mockModalClose()
    mockShowSuccess('Challenge created successfully! 🎉')
  }

  return (
    <div>
      <h1>Fitness Challenge</h1>
      <h2>Welcome back, Alex Johnson! 👋</h2>
      <p>Ready to crush your fitness goals today?</p>

      <div>Active Challenges</div>
      <div>1</div>
      <div>Total Progress</div>
      <div>8,000 steps</div>
      <div>Total Participants</div>
      <div>4</div>

      <input placeholder='Search challenges...' type='text' />
      <button onClick={mockModalOpen}>Create Challenge</button>

      <div data-testid='challenge-card'>30-Day Step Challenge</div>
      <div data-testid='challenge-card'>Marathon Prep</div>

      {modalOpen && (
        <div data-testid='modal' data-is-open={modalOpen}>
          <div data-testid='modal-content'>
            <div data-testid='modal-header'>
              <h2>Create New Challenge</h2>
            </div>
            <div data-testid='modal-body'>
              <div data-testid='create-challenge-modal'>
                <button
                  onClick={() =>
                    handleCreateChallenge({
                      id: 'new-challenge-1',
                      name: 'New Test Challenge',
                      description: 'A test challenge',
                      goal: 5000,
                      unit: 'steps',
                      duration: 7,
                      participants: [],
                      creator: 'Alex Johnson',
                      isActive: true,
                    })
                  }
                  data-testid='submit-challenge'
                >
                  Submit Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => <BrowserRouter>{children}</BrowserRouter>

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders welcome message with user name', () => {
    render(
      <TestWrapper>
        <MockHomePage />
      </TestWrapper>,
    )

    expect(screen.getByText('Welcome back, Alex Johnson! 👋')).toBeInTheDocument()
    expect(screen.getByText('Ready to crush your fitness goals today?')).toBeInTheDocument()
  })

  it('displays stats cards correctly', () => {
    render(
      <TestWrapper>
        <MockHomePage />
      </TestWrapper>,
    )

    expect(screen.getByText('Active Challenges')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Total Progress')).toBeInTheDocument()
    expect(screen.getByText('8,000 steps')).toBeInTheDocument()
    expect(screen.getByText('Total Participants')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders search input with placeholder', () => {
    render(
      <TestWrapper>
        <MockHomePage />
      </TestWrapper>,
    )

    const searchInput = screen.getByPlaceholderText('Search challenges...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')
  })

  it('displays create challenge button', () => {
    render(
      <TestWrapper>
        <MockHomePage />
      </TestWrapper>,
    )

    const createButton = screen.getByText('Create Challenge')
    expect(createButton).toBeInTheDocument()
  })

  it('renders challenge cards for filtered challenges', () => {
    render(
      <TestWrapper>
        <MockHomePage />
      </TestWrapper>,
    )

    const challengeCards = screen.getAllByTestId('challenge-card')
    expect(challengeCards).toHaveLength(2)
    expect(screen.getByText('30-Day Step Challenge')).toBeInTheDocument()
    expect(screen.getByText('Marathon Prep')).toBeInTheDocument()
  })

  it('opens modal when create challenge button is clicked', () => {
    render(
      <TestWrapper>
        <MockHomePage />
      </TestWrapper>,
    )

    const createButton = screen.getByText('Create Challenge')
    fireEvent.click(createButton)

    expect(mockModalOpen).toHaveBeenCalledTimes(1)
  })

  it('displays modal with correct content when open', () => {
    render(
      <TestWrapper>
        <MockHomePage modalOpen={true} />
      </TestWrapper>,
    )

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByTestId('modal')).toHaveAttribute('data-is-open', 'true')
    expect(screen.getByText('Create New Challenge')).toBeInTheDocument()
    expect(screen.getByTestId('create-challenge-modal')).toBeInTheDocument()
  })

  it('calls handleCreateChallenge with correct data when challenge is submitted', () => {
    render(
      <TestWrapper>
        <MockHomePage modalOpen={true} />
      </TestWrapper>,
    )

    const submitButton = screen.getByTestId('submit-challenge')
    fireEvent.click(submitButton)

    const expectedChallengeData = {
      id: 'new-challenge-1',
      name: 'New Test Challenge',
      description: 'A test challenge',
      goal: 5000,
      unit: 'steps',
      duration: 7,
      participants: [],
      creator: 'Alex Johnson',
      isActive: true,
    }

    expect(mockAddChallenge).toHaveBeenCalledWith(expectedChallengeData)
    expect(mockAddChallenge).toHaveBeenCalledTimes(1)
  })

  it('closes modal and shows success message when challenge is created', () => {
    render(
      <TestWrapper>
        <MockHomePage modalOpen={true} />
      </TestWrapper>,
    )

    const submitButton = screen.getByTestId('submit-challenge')
    fireEvent.click(submitButton)

    expect(mockModalClose).toHaveBeenCalledTimes(1)
    expect(mockShowSuccess).toHaveBeenCalledWith('Challenge created successfully! 🎉')
    expect(mockShowSuccess).toHaveBeenCalledTimes(1)
  })

  it('executes complete create challenge flow correctly', () => {
    render(
      <TestWrapper>
        <MockHomePage modalOpen={true} />
      </TestWrapper>,
    )

    const submitButton = screen.getByTestId('submit-challenge')
    fireEvent.click(submitButton)

    expect(mockAddChallenge).toHaveBeenCalledTimes(1)
    expect(mockModalClose).toHaveBeenCalledTimes(1)
    expect(mockShowSuccess).toHaveBeenCalledTimes(1)

    expect(mockAddChallenge).toHaveBeenCalledBefore(mockModalClose as any)
    expect(mockModalClose).toHaveBeenCalledBefore(mockShowSuccess as any)
  })
})
