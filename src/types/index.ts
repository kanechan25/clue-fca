import { Challenge, ChallengeType } from './challenge'
import { LeaderboardEntry, User, UserProgress } from './user'

export type Routes = {
  href: string
  id: string
  name: string
  element: React.ReactNode
}

export interface AppState {
  user: User | null
  isOnboarded: boolean
  challenges: Challenge[]
  userProgress: Record<string, UserProgress>
  leaderboards: Record<string, LeaderboardEntry[]>
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}

export interface FitnessStore extends AppState {
  setUser: (user: User) => void
  completeOnboarding: (data: OnboardingData) => void
  addChallenge: (challenge: Omit<Challenge, 'id' | 'participants'>) => void
  joinChallenge: (challengeId: string) => void
  leaveChallenge: (challengeId: string) => void
  addProgress: (input: ProgressInput) => void
  updateProgress: (challengeId: string, date: string, value: number, notes?: string) => void
  generateLeaderboard: (challengeId: string) => void
  loadMockData: () => void
  resetStore: () => void
}

export interface Notification {
  id: string
  type: 'achievement' | 'challenge_invite' | 'progress_reminder' | 'social'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface OnboardingData {
  name: string
  email: string
  fitnessGoals: ChallengeType[]
  preferredUnits: 'metric' | 'imperial'
  notificationsEnabled: boolean
}

export interface ProgressInput {
  challengeId: string
  date: string
  value: number
  notes?: string
}

export interface ProgressSummaryProps {
  challengeId: string
  compact?: boolean
}

export interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
}
