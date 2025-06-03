import { motion } from 'framer-motion'
import { useFitnessStore } from '@/stores/fitnessStore'
import { format } from 'date-fns'
import { ProgressSummaryProps } from '@/types'
import { CircularProgress } from '@/components/Common/CircularProgress'

export const ProgressSummary = ({ challengeId, compact = false }: ProgressSummaryProps) => {
  const { challenges, userProgress } = useFitnessStore()
  const challenge = challenges.find((c) => c.id === challengeId)
  const progress = userProgress[challengeId]

  if (!challenge || !progress) {
    return null
  }

  const totalGoal = challenge.goal * challenge.duration
  const progressPercentage = Math.min((progress.totalProgress / totalGoal) * 100, 100)
  const todayProgress =
    progress.dailyEntries.find((entry) => entry.date === format(new Date(), 'yyyy-MM-dd'))?.value || 0
  const todayPercentage = Math.min((todayProgress / challenge.goal) * 100, 100)

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-gray-50 rounded-lg p-4'
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-gray-600'>Your Progress</p>
            <p className='text-lg font-semibold text-gray-800'>
              {progress.totalProgress.toLocaleString()} / {totalGoal.toLocaleString()} {challenge.unit}
            </p>
          </div>
          <CircularProgress percentage={progressPercentage} size={60} strokeWidth={6} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-lg shadow-md p-6'
    >
      <h3 className='text-lg font-semibold text-gray-800 mb-6'>Your Progress</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Overall Progress */}
        <div className='text-center'>
          <p className='text-sm text-gray-600 mb-2'>Overall Progress</p>
          <CircularProgress percentage={progressPercentage} size={120} strokeWidth={10} color='#10B981' />
          <p className='text-sm text-gray-600 mt-2'>
            {progress.totalProgress.toLocaleString()} / {totalGoal.toLocaleString()} {challenge.unit}
          </p>
        </div>

        {/* Today Progress */}
        <div className='text-center'>
          <p className='text-sm text-gray-600 mb-2'>Today's Progress</p>
          <CircularProgress percentage={todayPercentage} size={120} strokeWidth={10} color='#3B82F6' />
          <p className='text-sm text-gray-600 mt-2'>
            {todayProgress.toLocaleString()} / {challenge.goal.toLocaleString()} {challenge.unit}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200'>
        <div className='text-center'>
          <p className='text-2xl font-bold text-blue-600'>{progress.dailyEntries.length}</p>
          <p className='text-sm text-gray-600'>Days Active</p>
        </div>
        <div className='text-center'>
          <p className='text-2xl font-bold text-green-600'>
            {Math.round(progress.totalProgress / Math.max(progress.dailyEntries.length, 1))}
          </p>
          <p className='text-sm text-gray-600'>Daily Avg</p>
        </div>
        <div className='text-center'>
          <p className='text-2xl font-bold text-purple-600'>{Math.round(progressPercentage)}%</p>
          <p className='text-sm text-gray-600'>Complete</p>
        </div>
      </div>
    </motion.div>
  )
}
