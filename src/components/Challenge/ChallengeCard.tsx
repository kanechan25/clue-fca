import { motion } from 'framer-motion'
import { Calendar, Users, Target, Clock } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useFitnessStore } from '@/stores/fitnessStore'
import { useNavigate } from 'react-router-dom'
import { getTypeIcon } from '@/utils'
import { getTypeColor } from '@/utils'
import { ChallengeCardProps } from '@/types/challenge'
import { ProgressSummary } from '@/components/Common/ProgressSummary'
import { Sharing } from '../Common/Sharing'
import { memo, useMemo, useCallback } from 'react'
import toast from 'react-hot-toast'

export const ChallengeCard = memo(({ challenge, index }: ChallengeCardProps) => {
  const navigate = useNavigate()
  const { userProgress, joinChallenge, leaveChallenge } = useFitnessStore()

  const isJoined = useMemo(() => !!userProgress[challenge.id], [userProgress, challenge.id])
  const daysLeft = useMemo(() => differenceInDays(new Date(challenge.endDate), new Date()), [challenge.endDate])
  const participantCount = useMemo(
    () => (Array.isArray(challenge?.participants) ? challenge.participants.length : 0),
    [challenge.participants],
  )
  const formattedStartDate = useMemo(() => format(new Date(challenge.startDate), 'MMM dd'), [challenge.startDate])
  const typeColor = useMemo(() => getTypeColor(challenge.type), [challenge.type])
  const typeIcon = useMemo(() => getTypeIcon(challenge.type), [challenge.type])

  const handleToggleJoin = useCallback(() => {
    if (isJoined) {
      leaveChallenge(challenge.id)
      toast.success(`Left "${challenge.name}"`)
    } else {
      joinChallenge(challenge.id)
      toast.success(`Joined "${challenge.name}"! 🎉`)
    }
  }, [isJoined, challenge.id, challenge.name, leaveChallenge, joinChallenge])

  const handleNavigate = useCallback(() => {
    navigate(`/challenge/${challenge.id}`)
  }, [navigate, challenge.id])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-16'
    >
      <div onClick={handleNavigate} className={`bg-gradient-to-r ${typeColor} p-6 text-white cursor-pointer`}>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-3'>
            <span className='text-3xl'>{typeIcon}</span>
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
        <div className='flex items-center justify-between'>
          <p className='text-gray-600 mb-4 line-clamp-2'>{challenge.description}</p>
          <Sharing challengeId={challenge.id} />
        </div>

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
            <span>{participantCount} participants</span>
          </div>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Calendar className='w-4 h-4' />
            <span>Started {formattedStartDate}</span>
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
              : `bg-gradient-to-r ${typeColor} text-white hover:opacity-90`
          }`}
        >
          {isJoined ? 'Leave Challenge' : 'Join Challenge'}
        </motion.button>
      </div>
    </motion.div>
  )
})

ChallengeCard.displayName = 'ChallengeCard'
