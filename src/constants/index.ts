import { ChallengeType } from '@/types'

export const onboardSteps = [
  { id: 1, title: 'Welcome', icon: '👋' },
  { id: 2, title: 'Profile', icon: '👤' },
  { id: 3, title: 'Goals', icon: '🎯' },
  { id: 4, title: 'Preferences', icon: '⚙️' },
]

export const challengeTypes: { type: ChallengeType; label: string; icon: string; description: string }[] = [
  { type: 'steps', label: 'Daily Steps', icon: '🚶', description: 'Track your daily walking goals' },
  { type: 'distance', label: 'Running/Walking', icon: '🏃', description: 'Monitor distance covered' },
  { type: 'calories', label: 'Calorie Burn', icon: '🔥', description: 'Track calories burned through activities' },
  { type: 'weight_loss', label: 'Weight Management', icon: '⚖️', description: 'Monitor weight loss progress' },
  { type: 'workout_time', label: 'Workout Time', icon: '💪', description: 'Track exercise duration' },
]
