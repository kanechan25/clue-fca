import { ChallengeType } from '@/types'

export const getTypeIcon = (type: ChallengeType) => {
  switch (type) {
    case ChallengeType.STEPS:
      return '🚶'
    case ChallengeType.DISTANCE:
      return '🏃'
    case ChallengeType.CALORIES:
      return '🔥'
    case ChallengeType.WEIGHT_LOSS:
      return '⚖️'
    case ChallengeType.WORKOUT_TIME:
      return '💪'
    default:
      return '🎯'
  }
}

export const getTypeColor = (type: string) => {
  switch (type) {
    case ChallengeType.STEPS:
      return 'from-blue-500 to-blue-600'
    case ChallengeType.DISTANCE:
      return 'from-green-500 to-green-600'
    case ChallengeType.CALORIES:
      return 'from-red-500 to-red-600'
    case ChallengeType.WEIGHT_LOSS:
      return 'from-purple-500 to-purple-600'
    case ChallengeType.WORKOUT_TIME:
      return 'from-orange-500 to-orange-600'
    default:
      return 'from-gray-500 to-gray-600'
  }
}

export const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
    case 2:
      return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
    case 3:
      return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
    default:
      return 'bg-white border-gray-200'
  }
}
