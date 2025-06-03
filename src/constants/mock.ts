import { Challenge, ChallengeType, Unit, User } from '@/types'
import { addDays } from 'date-fns'

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: '30-Day Step Challenge',
    description: 'Walk 10,000 steps daily for 30 days. Join friends and track your progress!',
    type: ChallengeType.STEPS,
    goal: 10000,
    unit: Unit.STEPS,
    duration: 30,
    startDate: addDays(new Date(), -1),
    endDate: addDays(new Date(), 30),
    participants: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7'],
    creator: 'FitnessApp',
    isActive: true,
    imageUrl: '🚶',
  },
  {
    id: '2',
    name: 'Marathon Prep',
    description: 'Run 5 miles daily building up to marathon distance',
    type: ChallengeType.DISTANCE,
    goal: 5,
    unit: Unit.MILES,
    duration: 21,
    startDate: addDays(new Date(), -2),
    endDate: addDays(new Date(), 21),
    participants: ['user2', 'user4', 'user6', 'user8', 'user10'],
    creator: 'RunClub',
    isActive: true,
    imageUrl: '🏃',
  },
  {
    id: '3',
    name: 'Calorie Crusher',
    description: 'Burn 500 calories daily through any activity',
    type: ChallengeType.CALORIES,
    goal: 500,
    unit: Unit.CALORIES,
    duration: 14,
    startDate: new Date(),
    endDate: addDays(new Date(), 14),
    participants: ['user1', 'user3', 'user5', 'user7', 'user9', 'user10'],
    creator: 'FitnessGuru',
    isActive: true,
    imageUrl: '🔥',
  },
  {
    id: '4',
    name: 'Weight Loss Journey',
    description: 'Lose 1 pound per week in a supportive community',
    type: ChallengeType.WEIGHT_LOSS,
    goal: 1,
    unit: Unit.POUNDS,
    duration: 28,
    startDate: addDays(new Date(), -5),
    endDate: addDays(new Date(), 28),
    participants: ['user3', 'user6', 'user9'],
    creator: 'HealthCoach',
    isActive: true,
    imageUrl: '⚖️',
  },
  {
    id: '5',
    name: 'Workout Time',
    description: 'Workout for 30 minutes daily for 21 days',
    type: ChallengeType.WORKOUT_TIME,
    goal: 30,
    unit: Unit.MINUTES,
    duration: 21,
    startDate: addDays(new Date(), -10),
    endDate: addDays(new Date(), 21),
    participants: ['user1', 'user2', 'user5', 'user6', 'user8', 'user9', 'user10'],
    creator: 'FitnessApp',
    isActive: true,
    imageUrl: '💪',
  },
]

export const mockUsers: User[] = [
  { id: 'user1', name: 'Alex Johnson', email: 'alex@example.com', avatar: '👨‍💼', joinedAt: new Date() },
  { id: 'user2', name: 'Sarah Chen', email: 'sarah@example.com', avatar: '👩‍🦳', joinedAt: new Date() },
  { id: 'user3', name: 'Mike Rodriguez', email: 'mike@example.com', avatar: '👨‍🎓', joinedAt: new Date() },
  { id: 'user4', name: 'Emma Davis', email: 'emma@example.com', avatar: '👩‍💻', joinedAt: new Date() },
  { id: 'user5', name: 'David Wilson', email: 'david@example.com', avatar: '👨‍🔧', joinedAt: new Date() },
  { id: 'user6', name: 'John Doe', email: 'john@example.com', avatar: '👨‍💼', joinedAt: new Date() },
  { id: 'user7', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩‍💼', joinedAt: new Date() },
  { id: 'user8', name: 'Michael Brown', email: 'michael@example.com', avatar: '👨‍💼', joinedAt: new Date() },
  { id: 'user9', name: 'Emily Johnson', email: 'emily@example.com', avatar: '👩‍💼', joinedAt: new Date() },
  { id: 'user10', name: 'Robert Lee', email: 'robert@example.com', avatar: '👨‍💼', joinedAt: new Date() },
]

export const generateMockProgress = (challengeGoal: number, challengeDuration: number, unit: string) => {
  let baseMultiplier = 1
  switch (unit) {
    case 'steps':
      baseMultiplier = Math.random() * 0.8 + 0.5 // 50-130%
      break
    case 'miles':
      baseMultiplier = Math.random() * 0.6 + 0.4 // 40-100%
      break
    case 'calories':
      baseMultiplier = Math.random() * 0.9 + 0.3 // 30-120%
      break
    case 'lbs':
      baseMultiplier = Math.random() * 0.7 + 0.2 // 20-90%
      break
    default:
      baseMultiplier = Math.random() * 0.8 + 0.3
  }

  return challengeGoal * challengeDuration * baseMultiplier
}
export const filterOptions: { value: ChallengeType | 'all' | 'actives'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Challenges', icon: '🎯' },
  { value: 'actives', label: 'All Actives', icon: '⭐' },
  { value: ChallengeType.STEPS, label: 'Steps', icon: '🚶' },
  { value: ChallengeType.DISTANCE, label: 'Running', icon: '🏃' },
  { value: ChallengeType.CALORIES, label: 'Calories', icon: '🔥' },
  { value: ChallengeType.WEIGHT_LOSS, label: 'Weight Loss', icon: '⚖️' },
  { value: ChallengeType.WORKOUT_TIME, label: 'Workouts', icon: '💪' },
]
