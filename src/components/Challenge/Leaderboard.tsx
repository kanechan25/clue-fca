import { motion } from 'framer-motion'
import { Award, Medal, Trophy, Users } from 'lucide-react'
import { useFitnessStore } from '@/stores/fitnessStore'
import { getRankBg } from '@/utils'
import { formatNumberDecimal } from '@/utils/format'
import { LeaderboardEntry, LeaderboardProps } from '@/types/user'
import { Unit } from '@/types/challenge'

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className='w-5 h-5 text-yellow-500' />
    case 2:
      return <Medal className='w-5 h-5 text-gray-400' />
    case 3:
      return <Award className='w-5 h-5 text-amber-600' />
    default:
      return <span className='w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500'>#{rank}</span>
  }
}

export const Leaderboard = ({ challengeId, maxEntries = 5 }: LeaderboardProps) => {
  const { leaderboards, challenges } = useFitnessStore()
  const leaderboard = leaderboards[challengeId] || []
  const challenge = challenges.find((c) => c.id === challengeId)

  if (!challenge) {
    return null
  }

  const displayEntries = leaderboard.slice(0, maxEntries)

  const getProgressPercentage = (entry: LeaderboardEntry) => {
    const totalGoal = challenge.goal * challenge.duration
    return Math.min((entry.progress.totalProgress / totalGoal) * 100, 100)
  }

  if (displayEntries.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-md p-8 text-center'>
        <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-gray-600 mb-2'>No Rankings Yet</h3>
        <p className='text-gray-500'>Join the challenge and start tracking to appear on the leaderboard!</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-lg shadow-md overflow-hidden'
    >
      <div className='bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white'>
        <h3 className='text-xl font-bold flex items-center'>
          <Trophy className='w-6 h-6 mr-2' />
          Leaderboard
        </h3>
        <p className='text-purple-100 text-sm mt-1'>{challenge.name}</p>
      </div>

      <div className='divide-y divide-gray-200'>
        {displayEntries.map((entry, index) => (
          <motion.div
            key={entry.user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${getRankBg(entry.rank)} border-l-4`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='flex-shrink-0'>{getRankIcon(entry.rank)}</div>

                {/* User Info */}
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg'>
                    {entry.user.avatar || entry.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>{entry.user.name}</p>
                    <p className='text-sm text-gray-500'>
                      {formatNumberDecimal(entry?.progress?.totalProgress, challenge.unit === Unit.STEPS ? 0 : 1)}{' '}
                      {challenge.unit}
                    </p>
                  </div>
                </div>

                {entry.badge && <span className='text-xl'>{entry.badge}</span>}
              </div>

              {/* Progress */}
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-800'>{Math.round(getProgressPercentage(entry))}%</p>
                <div className='w-24 bg-gray-200 rounded-full h-2 mt-1'>
                  <motion.div
                    className='bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full'
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(entry)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {leaderboard.length > maxEntries && (
        <div className='p-4 bg-gray-50 text-center'>
          <p className='text-sm text-gray-500'>+{leaderboard.length - maxEntries} more participants</p>
        </div>
      )}
    </motion.div>
  )
}
