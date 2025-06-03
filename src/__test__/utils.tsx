import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { FitnessStore } from '@/types'
import { mockChallenges, mockUsers } from '@/constants/mock'
import { User, Challenge } from '@/types'

export const mockUser: User = mockUsers[0]
export const mockChallenge: Challenge = mockChallenges[0]

export const mockStore: FitnessStore = {
  user: mockUser,
  isOnboarded: true,
  challenges: mockChallenges,
  userProgress: {
    '1': {
      challengeId: '1',
      userId: 'user1',
      dailyEntries: [{ date: new Date().toISOString().split('T')[0], value: 8000, notes: 'Good start' }],
      totalProgress: 20000,
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
          totalProgress: 20000,
          rank: 1,
          joined: new Date(),
          completed: false,
        },
        rank: 1,
        badge: '🥇',
      },
    ],
  },
  notifications: [],
  isLoading: false,
  error: null,
  setUser: vi.fn(),
  completeOnboarding: vi.fn(),
  addChallenge: vi.fn(),
  joinChallenge: vi.fn(),
  leaveChallenge: vi.fn(),
  addProgress: vi.fn(),
  updateProgress: vi.fn(),
  generateLeaderboard: vi.fn(),
  loadMockData: vi.fn(),
  resetStore: vi.fn(),
}

vi.mock('@/stores/fitnessStore', () => ({
  useFitnessStore: () => mockStore,
}))

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string
  storeInitialState?: Partial<FitnessStore>
}

const customRender = (
  ui: ReactElement,
  { initialRoute = '/', storeInitialState = {}, ...renderOptions }: CustomRenderOptions = {},
) => {
  Object.assign(mockStore, storeInitialState)

  const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let wrappedChildren = children
    if (initialRoute !== '/') {
      window.history.pushState({}, '', initialRoute)
    }
    wrappedChildren = <BrowserRouter>{wrappedChildren}</BrowserRouter>

    return <>{wrappedChildren}</>
  }

  return {
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
    mockStore,
  }
}

export * from '@testing-library/react'
export { customRender as render }
