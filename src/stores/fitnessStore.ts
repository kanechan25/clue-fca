import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AppState,
  Challenge,
  User,
  UserProgress,
  DailyProgress,
  ProgressInput,
  LeaderboardEntry,
  OnboardingData,
  FitnessStore,
} from '@/types'
import { mockChallenges, mockUsers } from '@/constants/mock'

const initialState: AppState = {
  user: null,
  isOnboarded: false,
  challenges: [],
  userProgress: {},
  leaderboards: {},
  notifications: [],
  isLoading: false,
  error: null,
}

export const useFitnessStore = create<FitnessStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user: User) => {
        set({ user })
      },

      completeOnboarding: (data: OnboardingData) => {
        const user: User = {
          id: crypto.randomUUID(),
          name: data.name,
          email: data.email,
          avatar: '👤',
          joinedAt: new Date(),
        }
        set({ user, isOnboarded: true })
      },

      addChallenge: (challengeData) => {
        const challenge: Challenge = {
          ...challengeData,
          id: crypto.randomUUID(),
          participants: 0,
        }
        set((state) => ({
          challenges: [...state.challenges, challenge],
        }))
      },

      joinChallenge: (challengeId: string) => {
        const { user } = get()
        if (!user) return

        set((state) => {
          const userProgress: UserProgress = {
            challengeId,
            userId: user.id,
            dailyEntries: [],
            totalProgress: 0,
            joined: new Date(),
            completed: false,
          }

          return {
            userProgress: {
              ...state.userProgress,
              [challengeId]: userProgress,
            },
            challenges: state.challenges.map((challenge) =>
              challenge.id === challengeId ? { ...challenge, participants: challenge.participants + 1 } : challenge,
            ),
          }
        })
      },

      leaveChallenge: (challengeId: string) => {
        set((state) => {
          const { [challengeId]: removed, ...restProgress } = state.userProgress
          return {
            userProgress: restProgress,
            challenges: state.challenges.map((challenge) =>
              challenge.id === challengeId
                ? { ...challenge, participants: Math.max(0, challenge.participants - 1) }
                : challenge,
            ),
          }
        })
      },

      addProgress: (input: ProgressInput) => {
        const { challengeId, date, value, notes } = input
        set((state) => {
          const currentProgress = state.userProgress[challengeId]
          if (!currentProgress) return state

          const existingEntryIndex = currentProgress.dailyEntries.findIndex((entry) => entry.date === date)

          let updatedEntries: DailyProgress[]
          if (existingEntryIndex >= 0) {
            updatedEntries = currentProgress.dailyEntries.map((entry, index) =>
              index === existingEntryIndex ? { date, value, notes } : entry,
            )
          } else {
            updatedEntries = [...currentProgress.dailyEntries, { date, value, notes }]
          }

          const totalProgress = updatedEntries.reduce((sum, entry) => sum + entry.value, 0)

          return {
            userProgress: {
              ...state.userProgress,
              [challengeId]: {
                ...currentProgress,
                dailyEntries: updatedEntries,
                totalProgress,
              },
            },
          }
        })
      },

      updateProgress: (challengeId: string, date: string, value: number, notes?: string) => {
        get().addProgress({ challengeId, date, value, notes })
      },

      generateLeaderboard: (challengeId: string) => {
        const state = get()
        const challenge = state.challenges.find((c) => c.id === challengeId)
        if (!challenge) return

        // Mock leaderboard data
        const leaderboard: LeaderboardEntry[] = mockUsers.slice(0, 5).map((user, index) => {
          const mockProgress = Math.random() * challenge.goal * challenge.duration * 0.8
          const userProgress: UserProgress = {
            challengeId,
            userId: user.id,
            dailyEntries: [],
            totalProgress: mockProgress,
            rank: index + 1,
            joined: new Date(),
            completed: false,
          }

          return {
            user,
            progress: userProgress,
            rank: index + 1,
            badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : undefined,
          }
        })

        set((state) => ({
          leaderboards: {
            ...state.leaderboards,
            [challengeId]: leaderboard,
          },
        }))
      },

      syncProgress: () => {
        // Mock sync functionality
        set({ isLoading: true })
        setTimeout(() => {
          set({ isLoading: false })
        }, 1000)
      },

      loadMockData: () => {
        set({
          challenges: mockChallenges,
        })

        // Generate leaderboards for all challenges
        mockChallenges.forEach((challenge) => {
          get().generateLeaderboard(challenge.id)
        })
      },

      resetStore: () => {
        set(initialState)
      },
    }),
    {
      name: 'fitness-challenge-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isOnboarded: state.isOnboarded,
        userProgress: state.userProgress,
        challenges: state.challenges,
      }),
    },
  ),
)
