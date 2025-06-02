export type Routes = {
  href: string
  id: string
  name: string
  element: React.ReactNode
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedAt: Date
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: ChallengeType
  goal: number
  unit: string
  duration: number // days
  startDate: Date
  endDate: Date
  participants: number
  creator: string
  isActive: boolean
  imageUrl?: string
}

export type ChallengeType = 'steps' | 'distance' | 'calories' | 'weight_loss' | 'workout_time' | 'custom'

export interface DailyProgress {
  date: string // YYYY-MM-DD format
  value: number
  notes?: string
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

export interface Notification {
  id: string
  type: 'achievement' | 'challenge_invite' | 'progress_reminder' | 'social'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
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
