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
import { generateMockProgress, mockChallenges, mockUsers } from '@/constants/mock'

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
      // TODO: for edit user profile
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
          fitnessGoals: data.fitnessGoals,
          preferredUnits: data.preferredUnits,
          notificationsEnabled: data.notificationsEnabled,
        }
        set({ user, isOnboarded: true })
      },
      // TODO
      addChallenge: (challengeData) => {
        const challenge: Challenge = {
          ...challengeData,
          id: crypto.randomUUID(),
          participants: [],
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
              challenge.id === challengeId
                ? {
                    ...challenge,
                    participants: Array.isArray(challenge.participants)
                      ? [...challenge.participants, user.id]
                      : [user.id],
                  }
                : challenge,
            ),
          }
        })
      },

      leaveChallenge: (challengeId: string) => {
        const { user } = get()
        if (!user) return

        set((state) => {
          const { [challengeId]: removed, ...restProgress } = state.userProgress
          return {
            userProgress: restProgress,
            challenges: state.challenges.map((challenge) =>
              challenge.id === challengeId
                ? {
                    ...challenge,
                    participants: Array.isArray(challenge?.participants)
                      ? challenge.participants.filter((id) => id !== user.id)
                      : [],
                  }
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

        get().generateLeaderboard(challengeId)
      },
      // TODO
      updateProgress: (challengeId: string, date: string, value: number, notes?: string) => {
        get().addProgress({ challengeId, date, value, notes })
      },

      generateLeaderboard: (challengeId: string) => {
        const state = get()
        const challenge = state.challenges.find((c) => c.id === challengeId)
        if (!challenge) return

        let availableMockUsers = mockUsers
        if (Array.isArray(challenge?.participants) && challenge.participants.length > 0) {
          const participantUsers = mockUsers.filter((user) => challenge.participants.includes(user.id))
          if (participantUsers.length >= 5) {
            availableMockUsers = participantUsers
          }
        }

        // Shuffle and take exactly 5 mock users for competition
        const mockCompetitors = [...availableMockUsers].sort(() => Math.random() - 0.5).slice(0, 5)

        // Create entries for all 5 mock competitors
        const mockEntries = mockCompetitors.map((user) => {
          const mockProgress = generateMockProgress(challenge.goal, challenge.duration, challenge.unit)
          const userProgress: UserProgress = {
            challengeId,
            userId: user.id,
            dailyEntries: [],
            totalProgress: mockProgress,
            joined: new Date(),
            completed: false,
          }

          return {
            user,
            progress: userProgress,
          }
        })

        // ALWAYS include current user with their REAL progress if they have any progress at all
        const currentUser = state.user
        const currentUserProgress = state.userProgress[challengeId]

        const allCompetitors = [...mockEntries]

        // Add current user with their real progress (this is the key fix!)
        if (currentUser && currentUserProgress && currentUserProgress.totalProgress > 0) {
          allCompetitors.push({
            user: currentUser,
            progress: currentUserProgress,
          })
        }

        // Sort by total progress (highest first) - this will rank everyone properly
        allCompetitors.sort((a, b) => b.progress.totalProgress - a.progress.totalProgress)

        // Take top 5 performers and create leaderboard entries
        const leaderboard: LeaderboardEntry[] = allCompetitors.slice(0, 5).map((entry, index) => ({
          user: entry.user,
          progress: { ...entry.progress, rank: index + 1 },
          rank: index + 1,
          badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : undefined,
        }))

        set((state) => ({
          leaderboards: {
            ...state.leaderboards,
            [challengeId]: leaderboard,
          },
        }))
      },

      loadMockData: () => {
        const migratedChallenges = mockChallenges.map((challenge) => ({
          ...challenge,
          participants: Array.isArray(challenge.participants) ? challenge.participants : [],
        }))

        set({
          challenges: migratedChallenges,
        })

        migratedChallenges.forEach((challenge) => {
          get().generateLeaderboard(challenge.id)
        })
      },
      resetStore: () => {
        localStorage.removeItem('fitness-challenge-store')
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
