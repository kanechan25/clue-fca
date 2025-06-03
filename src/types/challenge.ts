import { User } from './user'

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
