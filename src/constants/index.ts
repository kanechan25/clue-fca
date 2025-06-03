import { ChallengeType } from '@/types'
import { TrendingUp, Award } from 'lucide-react'

export const onboardSteps = [
  { id: 1, title: 'Welcome', icon: '👋' },
  { id: 2, title: 'Profile', icon: '👤' },
  { id: 3, title: 'Goals', icon: '🎯' },
  { id: 4, title: 'Preferences', icon: '⚙️' },
]

export const challengeTypes: { type: ChallengeType; label: string; icon: string; description: string }[] = [
  { type: ChallengeType.STEPS, label: 'Daily Steps', icon: '🚶', description: 'Track your daily walking goals' },
  { type: ChallengeType.DISTANCE, label: 'Running/Walking', icon: '🏃', description: 'Monitor distance covered' },
  {
    type: ChallengeType.CALORIES,
    label: 'Calorie Burn',
    icon: '🔥',
    description: 'Track calories burned through activities',
  },
  {
    type: ChallengeType.WEIGHT_LOSS,
    label: 'Weight Management',
    icon: '⚖️',
    description: 'Monitor weight loss progress',
  },
  { type: ChallengeType.WORKOUT_TIME, label: 'Workout Time', icon: '💪', description: 'Track exercise duration' },
]
export const enum Tab {
  Progress = 'progress',
  Leaderboard = 'leaderboard',
}

export const tabs = [
  { id: Tab.Progress, label: 'Progress', icon: TrendingUp },
  { id: Tab.Leaderboard, label: 'Leaderboard', icon: Award },
]
