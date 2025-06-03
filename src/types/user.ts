import { ChallengeType } from './challenge'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedAt: Date
  fitnessGoals: ChallengeType[]
  preferredUnits: 'metric' | 'imperial'
  notificationsEnabled: boolean
}

export interface UserSettingsProps {
  user: User
}

export interface DailyProgress {
  date: string // YYYY-MM-DD format
  value: number
  notes?: string
}
export interface DailyInputFormProps {
  challengeId: string
  onSuccess?: () => void
}

export interface UserProgress {
  challengeId: string
  userId: string
  dailyEntries: DailyProgress[]
  totalProgress: number
  rank?: number
  joined: Date
  completed: boolean
}

export interface LeaderboardEntry {
  user: User
  progress: UserProgress
  rank: number
  badge?: string
}

export interface LeaderboardProps {
  challengeId: string
  maxEntries?: number
}

export interface AuthStateProps {
  user: any
  isAuthenticated: boolean
  isOnboarded: boolean
}
