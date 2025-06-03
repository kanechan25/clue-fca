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

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: (error: Error | null) => React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  errorMessage?: string
  showRetry?: boolean
}

export interface ErrorBoundaryOptions {
  fallback?: (error: Error | null) => React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  errorMessage?: string
  showRetry?: boolean
}

export interface LoadingProps {
  isLoading?: boolean
  loadingText?: string
}

export interface LoadingStateProps extends LoadingProps {
  startLoading: (text?: string) => void
  stopLoading: () => void
}

export interface ToastProps {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showLoading: (message: string) => string
  dismissToast: (toastId: string) => void
  dismissAllToasts: () => void
}

export interface AutoToastProps {
  onSuccess?: (result?: any) => void
  onError?: (error?: any) => void
  successMessage?: string
  errorMessage?: string
}
