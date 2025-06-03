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
  fitnessGoals: ChallengeType[]
  preferredUnits: 'metric' | 'imperial'
  notificationsEnabled: boolean
}

export interface UserSettingsProps {
  user: User
}

export enum Unit {
  STEPS = 'steps',
  MILES = 'miles',
  CALORIES = 'calories',
  POUNDS = 'lbs',
  MINUTES = 'minutes',
}
export enum ChallengeType {
  STEPS = 'steps',
  DISTANCE = 'distance',
  CALORIES = 'calories',
  WEIGHT_LOSS = 'weight_loss',
  WORKOUT_TIME = 'workout_time',
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: ChallengeType
  goal: number
  unit: Unit
  duration: number // days
  startDate: Date
  endDate: Date
  participants: string[] // Array of user IDs who participate in this challenge
  creator: string
  isActive: boolean
  imageUrl?: string
}
export interface ChallengeCardProps {
  challenge: Challenge
  index: number
  onJoin?: (challengeId: string) => void
  onLeave?: (challengeId: string) => void
}
export interface CreateChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateChallenge: (challengeData: Challenge) => void
  currentUser?: User | null
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
