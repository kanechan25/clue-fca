import { motion } from 'framer-motion'
import { Calendar, Users, Target, Clock } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useFitnessStore } from '@/stores/fitnessStore'
import type { Challenge } from '@/types'
import { ProgressSummary } from '@/components/ProgressSummary'

interface ChallengeCardProps {
  challenge: Challenge
  index: number
  onJoin?: (challengeId: string) => void
  onLeave?: (challengeId: string) => void
}

export const ChallengeCard = ({ challenge, index, onJoin, onLeave }: ChallengeCardProps) => {
  const { userProgress, joinChallenge, leaveChallenge } = useFitnessStore()
  const isJoined = !!userProgress[challenge.id]
  const daysLeft = differenceInDays(new Date(challenge.endDate), new Date())

  const handleToggleJoin = () => {
    if (isJoined) {
      leaveChallenge(challenge.id)
      onLeave?.(challenge.id)
    } else {
      joinChallenge(challenge.id)
      onJoin?.(challenge.id)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'steps':
        return '🚶'
      case 'distance':
        return '🏃'
      case 'calories':
        return '🔥'
      case 'weight_loss':
        return '⚖️'
      case 'workout_time':
        return '💪'
      default:
        return '🎯'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'steps':
        return 'from-blue-500 to-blue-600'
      case 'distance':
        return 'from-green-500 to-green-600'
      case 'calories':
        return 'from-red-500 to-red-600'
      case 'weight_loss':
        return 'from-purple-500 to-purple-600'
      case 'workout_time':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden'
    >
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-r ${getTypeColor(challenge.type)} p-6 text-white`}>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-3'>
            <span className='text-3xl'>{getTypeIcon(challenge.type)}</span>
            <div>
              <h3 className='text-xl font-bold'>{challenge.name}</h3>
              <p className='text-white/80 text-sm'>by {challenge.creator}</p>
            </div>
          </div>
          <div className='text-right'>
            <div className='bg-white/20 rounded-lg px-3 py-1'>
              <span className='text-sm font-medium'>{daysLeft} days left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <p className='text-gray-600 mb-4 line-clamp-2'>{challenge.description}</p>

        {/* Challenge Stats */}
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Target className='w-4 h-4' />
            <span>
              {challenge.goal.toLocaleString()} {challenge.unit}/day
            </span>
          </div>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Clock className='w-4 h-4' />
            <span>{challenge.duration} days</span>
          </div>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Users className='w-4 h-4' />
            <span>{challenge.participants} participants</span>
          </div>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Calendar className='w-4 h-4' />
            <span>Started {format(new Date(challenge.startDate), 'MMM dd')}</span>
          </div>
        </div>

        {/* Progress Summary (if joined) */}
        {isJoined && (
          <div className='mb-6'>
            <ProgressSummary challengeId={challenge.id} compact />
          </div>
        )}

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggleJoin}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
            isJoined
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : `bg-gradient-to-r ${getTypeColor(challenge.type)} text-white hover:opacity-90`
          }`}
        >
          {isJoined ? 'Leave Challenge' : 'Join Challenge'}
        </motion.button>
      </div>
    </motion.div>
  )
}
