import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Trophy, Users, TrendingUp } from 'lucide-react'
import { useFitnessStore } from '@/stores/fitnessStore'
import { ChallengeCard } from '@/components/ChallengeCard'
import { Leaderboard } from '@/components/Leaderboard'
import type { ChallengeType } from '@/types'
import toast from 'react-hot-toast'

const filterOptions: { value: ChallengeType | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Challenges', icon: '🎯' },
  { value: 'steps', label: 'Steps', icon: '🚶' },
  { value: 'distance', label: 'Running', icon: '🏃' },
  { value: 'calories', label: 'Calories', icon: '🔥' },
  { value: 'weight_loss', label: 'Weight Loss', icon: '⚖️' },
  { value: 'workout_time', label: 'Workouts', icon: '💪' },
]

const HomePage = () => {
  const { user, challenges, userProgress, leaderboards, loadMockData, generateLeaderboard } = useFitnessStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<ChallengeType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'participants' | 'recent'>('recent')

  // Load mock data on mount
  useEffect(() => {
    if (challenges.length === 0) {
      loadMockData()
    }
  }, [challenges.length, loadMockData])

  // Filter and sort challenges
  const filteredChallenges = useMemo(() => {
    const filtered = challenges.filter((challenge) => {
      const matchesSearch =
        challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = selectedFilter === 'all' || challenge.type === selectedFilter
      return matchesSearch && matchesFilter && challenge.isActive
    })

    // Sort challenges
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'participants':
          return b.participants - a.participants
        case 'recent':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      }
    })

    return filtered
  }, [challenges, searchQuery, selectedFilter, sortBy])

  // Get joined challenges
  const joinedChallenges = challenges.filter((challenge) => userProgress[challenge.id])

  // Get popular challenge for leaderboard preview
  const popularChallenge = challenges.find((c) => c.participants > 100)

  const handleJoinChallenge = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge) {
      toast.success(`Joined "${challenge.name}"! 🎉`)
      // Generate leaderboard for newly joined challenge
      generateLeaderboard(challengeId)
    }
  }

  const handleLeaveChallenge = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge) {
      toast.success(`Left "${challenge.name}"`)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-3'>
              <div className='text-2xl'>🏆</div>
              <h1 className='text-xl font-bold text-gray-900'>Fitness Challenge</h1>
            </div>

            {user && (
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                  {user.avatar || user.name.charAt(0)}
                </div>
                <span className='text-sm font-medium text-gray-700'>{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome back, {user?.name}! 👋</h2>
          <p className='text-gray-600'>Ready to crush your fitness goals today?</p>
        </motion.div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-white rounded-lg shadow-md p-6'
          >
            <div className='flex items-center'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Trophy className='w-6 h-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Active Challenges</p>
                <p className='text-2xl font-bold text-gray-900'>{joinedChallenges.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-white rounded-lg shadow-md p-6'
          >
            <div className='flex items-center'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <TrendingUp className='w-6 h-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Progress</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {Object.values(userProgress)
                    .reduce((sum, progress) => sum + progress.totalProgress, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='bg-white rounded-lg shadow-md p-6'
          >
            <div className='flex items-center'>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Participants</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {challenges.reduce((sum, challenge) => sum + challenge.participants, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* Search and Filters */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                {/* Search */}
                <div className='flex-1 relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <input
                    type='text'
                    placeholder='Search challenges...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>

                {/* Filter */}
                <div className='relative'>
                  <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as ChallengeType | 'all')}
                    className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white'
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'participants' | 'recent')}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='recent'>Most Recent</option>
                  <option value='participants'>Most Popular</option>
                  <option value='name'>A-Z</option>
                </select>
              </div>
            </div>

            {/* Challenge Grid */}
            <div className='space-y-6'>
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge, index) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    index={index}
                    onJoin={handleJoinChallenge}
                    onLeave={handleLeaveChallenge}
                  />
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-12'>
                  <div className='text-4xl mb-4'>🔍</div>
                  <h3 className='text-lg font-semibold text-gray-600 mb-2'>No challenges found</h3>
                  <p className='text-gray-500'>Try adjusting your search or filters</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Leaderboard Preview */}
            {popularChallenge && leaderboards[popularChallenge.id] && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Leaderboard challengeId={popularChallenge.id} maxEntries={5} />
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className='bg-white rounded-lg shadow-md p-6'
            >
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
              <div className='space-y-3'>
                <button className='w-full flex items-center space-x-3 p-3 text-black cursor-pointer text-left rounded-lg hover:bg-gray-50 transition-colors'>
                  <Plus className='w-5 h-5 text-blue-500' />
                  <span className='font-medium'>Create Challenge</span>
                </button>
                <button className='w-full flex items-center space-x-3 p-3 text-black cursor-pointer text-left rounded-lg hover:bg-gray-50 transition-colors'>
                  <Users className='w-5 h-5 text-green-500' />
                  <span className='font-medium'>Invite Friends</span>
                </button>
                <button className='w-full flex items-center space-x-3 p-3 text-black cursor-pointer text-left rounded-lg hover:bg-gray-50 transition-colors'>
                  <Trophy className='w-5 h-5 text-purple-500' />
                  <span className='font-medium'>View Achievements</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
