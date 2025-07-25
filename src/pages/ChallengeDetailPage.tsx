import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Target } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import { useChallenge } from '@/providers/ChallengeProvider'
import { useNotification } from '@/providers/NotificationProvider'
import { withAuth, withLoading, withToast } from '@/hocs'
import { Tabs } from '@/components/Compound/Tabs'
import { ProgressSummary } from '@/components/Common/ProgressSummary'
import { Leaderboard } from '@/components/Challenge/Leaderboard'
import { DailyInputForm } from '@/components/Challenge/DailyInputForm'
import { Sharing } from '@/components/Common/Sharing'
import { tabs } from '@/constants'
import ChallengeNotFound from './ChallengeNotFound'

const ChallengeDetailPage = () => {
  const { challengeId } = useParams<{ challengeId: string }>()
  const { challenges, userProgress, leaderboards, generateLeaderboard, joinChallenge, leaveChallenge } = useChallenge()
  const { showSuccess } = useNotification()
  const challenge = challenges.find((c) => c.id === challengeId)
  const navigate = useNavigate()

  const progress = challengeId ? userProgress[challengeId] : null
  const leaderboard = challengeId ? leaderboards[challengeId] || [] : []
  const isJoined = !!progress

  useEffect(() => {
    if (challenge && challengeId && leaderboard.length === 0) {
      generateLeaderboard(challengeId)
    }
  }, [challenge, challengeId, leaderboard.length, generateLeaderboard])

  if (!challenge || !challengeId) {
    return <ChallengeNotFound />
  }

  const daysLeft = differenceInDays(new Date(challenge.endDate), new Date())
  const totalGoal = challenge.goal * challenge.duration
  const progressPercentage = progress ? Math.min((progress.totalProgress / totalGoal) * 100, 100) : 0

  const handleJoinLeave = () => {
    if (isJoined) {
      leaveChallenge(challengeId)
      showSuccess(`Left ${challenge.name}`)
    } else {
      joinChallenge(challengeId)
      showSuccess(`Joined ${challenge.name}! 🎉`)
      generateLeaderboard(challengeId)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <button
              onClick={() => navigate('/')}
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span>Back to Home</span>
            </button>
            <div className='flex items-center space-x-2'>
              <Sharing challengeId={challengeId} />
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Challenge Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 mb-8'
        >
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='flex items-center space-x-3 mb-4'>
                <span className='text-4xl'>{challenge.imageUrl}</span>
                <div>
                  <h1 className='text-3xl font-bold'>{challenge.name}</h1>
                  <p className='text-blue-100'>by {challenge.creator}</p>
                </div>
              </div>

              <p className='text-lg text-blue-100 mb-6 max-w-2xl'>{challenge.description}</p>

              {/* Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                <div>
                  <div className='text-2xl font-bold'>{challenge.goal.toLocaleString()}</div>
                  <div className='text-blue-200 text-sm'>{challenge.unit}/day goal</div>
                </div>
                <div>
                  <div className='text-2xl font-bold'>{daysLeft}</div>
                  <div className='text-blue-200 text-sm'>days remaining</div>
                </div>
                <div>
                  <div className='text-2xl font-bold'>
                    {Array.isArray(challenge?.participants) ? challenge.participants.length : 0}
                  </div>
                  <div className='text-blue-200 text-sm'>participants</div>
                </div>
                <div>
                  <div className='text-2xl font-bold'>{Math.round(progressPercentage)}%</div>
                  <div className='text-blue-200 text-sm'>your progress</div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinLeave}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isJoined ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white text-blue-600 hover:bg-gray-50'
              }`}
            >
              {isJoined ? 'Leave Challenge' : 'Join Challenge'}
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultTab='progress' className='mb-8'>
          <Tabs.List className='border-b border-gray-200 -mb-px flex space-x-8'>
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab.id}
                value={tab.id}
                className='flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors'
              >
                <tab.icon className='w-4 h-4' />
                <span>{tab.label}</span>
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Tabs.Panels>
            {/* Progress Tab Content */}
            <Tabs.Panel value='progress'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'
              >
                {isJoined ? (
                  <>
                    <ProgressSummary challengeId={challengeId} />
                    <DailyInputForm challengeId={challengeId} />
                  </>
                ) : (
                  <div className='bg-white rounded-lg shadow-md p-8 text-center'>
                    <Target className='w-12 h-12 text-blue-500 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Join to Track Progress</h3>
                    <p className='text-gray-600 mb-6'>
                      Join this challenge to start tracking your daily progress and compete with others!
                    </p>
                    <button
                      onClick={handleJoinLeave}
                      className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200'
                    >
                      Join Challenge
                    </button>
                  </div>
                )}
              </motion.div>
            </Tabs.Panel>

            {/* Leaderboard Tab Content */}
            <Tabs.Panel value='leaderboard'>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Leaderboard challengeId={challengeId} />
              </motion.div>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>
    </div>
  )
}

export default withAuth(withLoading(withToast(ChallengeDetailPage)))
