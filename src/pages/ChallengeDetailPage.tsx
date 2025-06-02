import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Target, TrendingUp, Award, Share2, MoreVertical } from 'lucide-react'
import { format, differenceInDays, eachDayOfInterval, startOfDay } from 'date-fns'
import { useFitnessStore } from '@/stores/fitnessStore'
import { ProgressSummary } from '@/components/ProgressSummary'
import { Leaderboard } from '@/components/Leaderboard'
import { DailyInputForm } from '@/components/DailyInputForm'
import toast from 'react-hot-toast'

export const ChallengeDetailPage = () => {
  const { challengeId } = useParams<{ challengeId: string }>()
  const navigate = useNavigate()
  const { challenges, userProgress, leaderboards, generateLeaderboard, joinChallenge, leaveChallenge } =
    useFitnessStore()

  const [activeTab, setActiveTab] = useState<'progress' | 'leaderboard' | 'calendar'>('progress')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const challenge = challenges.find((c) => c.id === challengeId)
  const progress = challengeId ? userProgress[challengeId] : null
  const leaderboard = challengeId ? leaderboards[challengeId] || [] : []
  const isJoined = !!progress

  useEffect(() => {
    if (challenge && challengeId && leaderboard.length === 0) {
      generateLeaderboard(challengeId)
    }
  }, [challenge, challengeId, leaderboard.length, generateLeaderboard])

  if (!challenge || !challengeId) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-4xl mb-4'>😕</div>
          <h2 className='text-xl font-semibold text-gray-600 mb-2'>Challenge Not Found</h2>
          <button onClick={() => navigate('/')} className='text-blue-500 hover:text-blue-600'>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const daysLeft = differenceInDays(new Date(challenge.endDate), new Date())
  const totalGoal = challenge.goal * challenge.duration
  const progressPercentage = progress ? Math.min((progress.totalProgress / totalGoal) * 100, 100) : 0

  const handleJoinLeave = () => {
    if (isJoined) {
      leaveChallenge(challengeId)
      toast.success(`Left "${challenge.name}"`)
    } else {
      joinChallenge(challengeId)
      toast.success(`Joined "${challenge.name}"! 🎉`)
      generateLeaderboard(challengeId)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: challenge.name,
        text: challenge.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  // Generate calendar days
  const calendarDays = eachDayOfInterval({
    start: new Date(challenge.startDate),
    end: new Date(challenge.endDate),
  })

  const getDayProgress = (date: Date) => {
    if (!progress) return null
    const dateStr = format(date, 'yyyy-MM-dd')
    return progress.dailyEntries.find((entry) => entry.date === dateStr)
  }

  const getDayStatus = (date: Date) => {
    const dayProgress = getDayProgress(date)
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    const isPast = date < startOfDay(new Date())

    if (!dayProgress) {
      return {
        color: isPast ? 'bg-gray-200' : isToday ? 'bg-blue-100 border-blue-300' : 'bg-gray-100',
        percentage: 0,
      }
    }

    const percentage = Math.min((dayProgress.value / challenge.goal) * 100, 100)

    if (percentage >= 100) {
      return { color: 'bg-green-500', percentage }
    } else if (percentage >= 70) {
      return { color: 'bg-yellow-500', percentage }
    } else if (percentage > 0) {
      return { color: 'bg-red-400', percentage }
    }

    return { color: 'bg-gray-200', percentage: 0 }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return (
          <div className='space-y-6'>
            {isJoined ? (
              <>
                <ProgressSummary challengeId={challengeId} />
                <DailyInputForm challengeId={challengeId} selectedDate={selectedDate || undefined} />
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
          </div>
        )

      case 'leaderboard':
        return <Leaderboard challengeId={challengeId} />

      case 'calendar':
        return (
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-6'>Progress Calendar</h3>

            {!isJoined ? (
              <div className='text-center py-8'>
                <Calendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500'>Join the challenge to see your progress calendar</p>
              </div>
            ) : (
              <div>
                <div className='grid grid-cols-7 gap-2 mb-4'>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className='text-center text-sm font-medium text-gray-500 py-2'>
                      {day}
                    </div>
                  ))}
                </div>

                <div className='grid grid-cols-7 gap-2'>
                  {calendarDays.map((date, index) => {
                    const dayStatus = getDayStatus(date)
                    const dayProgress = getDayProgress(date)
                    const dateStr = format(date, 'yyyy-MM-dd')
                    const isToday = dateStr === format(new Date(), 'yyyy-MM-dd')

                    return (
                      <motion.button
                        key={dateStr}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`
                          relative w-full aspect-square rounded-lg border-2 transition-all duration-200
                          ${dayStatus.color}
                          ${isToday ? 'border-blue-500' : 'border-transparent'}
                          ${selectedDate === dateStr ? 'ring-2 ring-blue-500' : ''}
                          hover:scale-105
                        `}
                      >
                        <span className='text-sm font-medium text-white'>{format(date, 'd')}</span>
                        {dayProgress && (
                          <div className='absolute bottom-0 left-0 right-0 text-xs text-white bg-black bg-opacity-50 rounded-b'>
                            {dayProgress.value}
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                <div className='mt-6 flex items-center justify-center space-x-6 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-4 h-4 bg-green-500 rounded'></div>
                    <span>Goal Achieved</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='w-4 h-4 bg-yellow-500 rounded'></div>
                    <span>Partial Progress</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='w-4 h-4 bg-red-400 rounded'></div>
                    <span>Some Progress</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className='w-4 h-4 bg-gray-200 rounded'></div>
                    <span>No Progress</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
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
              <span>Back to Challenges</span>
            </button>

            <div className='flex items-center space-x-2'>
              <button
                onClick={handleShare}
                className='p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <Share2 className='w-5 h-5' />
              </button>
              <button className='p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'>
                <MoreVertical className='w-5 h-5' />
              </button>
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
                  <div className='text-2xl font-bold'>{challenge.participants}</div>
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
        <div className='mb-8'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8'>
              {[
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'leaderboard', label: 'Leaderboard', icon: Award },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className='w-4 h-4' />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default ChallengeDetailPage
