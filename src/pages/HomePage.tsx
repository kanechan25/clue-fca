import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Trophy, Users, TrendingUp, Plus } from 'lucide-react'
import { useChallengeFiltering } from '@/hooks/headless/useChallengeFiltering'
import { useModal } from '@/hooks/headless/useModal'
import { useChallenge } from '@/providers/ChallengeProvider'
import { useAuth } from '@/providers/AuthProvider'
import { useNotification } from '@/providers/NotificationProvider'
import { withAuth, withLoading, withToast } from '@/hocs'
import { ChallengeCard } from '@/components/ChallengeCard'
import { UserSettings } from '@/components/UserSettings'
import { CreateChallengeModal } from '@/components/CreateChallengeModal'
import { Modal } from '@/components/Compound/Modal'
import Dropdown from '@/components/Common/Dropdown'
import { formatProgressWithUnit } from '@/utils/format'
import { Challenge, ChallengeType } from '@/types'
import { filterOptions } from '@/constants/mock'

const HomePage = () => {
  const { challenges, userProgress, loadMockData, addChallenge } = useChallenge()
  const { user } = useAuth()

  const {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    sortBy,
    setSortBy,
    filteredChallenges,
    joinedChallenges,
    totalParticipants,
  } = useChallengeFiltering(challenges, userProgress)

  const createModalState = useModal()
  const { showSuccess } = useNotification()
  useEffect(() => {
    if (challenges.length === 0) {
      loadMockData()
    }
  }, [challenges.length, loadMockData])

  const formattedProgress = formatProgressWithUnit(userProgress, challenges)
  const handleCreateChallenge = (challengeData: Challenge) => {
    addChallenge(challengeData)
    createModalState.close()
    showSuccess('Challenge created successfully! 🎉')
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
                <UserSettings user={user} />
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
            <div className='flex items-start'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <TrendingUp className='w-6 h-6 text-green-600' />
              </div>
              <div className='ml-4 flex-1'>
                <p className='text-sm font-medium text-gray-600'>Total Progress</p>
                <div className='mt-1'>
                  {formattedProgress.map((progressItem, index) => (
                    <div key={index} className='text-md font-sm text-gray-900'>
                      {progressItem}
                    </div>
                  ))}
                  {formattedProgress.length === 0 && (
                    <p className='text-md font-sm text-gray-900'>No active challenges</p>
                  )}
                </div>
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
                <p className='text-2xl font-bold text-gray-900'>{totalParticipants.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='col-span-1 lg:col-span-3'>
            {/* Search and Filters*/}
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
                  <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10' />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as ChallengeType | 'all' | 'actives')}
                    className='appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-10 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer'
                  >
                    {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Dropdown />
                </div>

                {/* Sort */}
                <div className='relative'>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'participants' | 'recent')}
                    className='appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer'
                  >
                    <option value='recent'>Most Recent</option>
                    <option value='participants'>Most Popular</option>
                    <option value='name'>A-Z</option>
                  </select>
                  <Dropdown />
                </div>

                {/* Create Challenge Button */}
                <button
                  onClick={createModalState.open}
                  className='flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 whitespace-nowrap'
                >
                  <Plus className='w-4 h-4' />
                  <span>Create Challenge</span>
                </button>
              </div>
            </div>

            {/* Challenge Grid */}
            <div className='space-y-6'>
              {filteredChallenges?.length > 0 ? (
                filteredChallenges?.map((challenge, index) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
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
        </div>
      </div>

      <Modal isOpen={createModalState.isOpen} onClose={createModalState.close}>
        <Modal.Content>
          <Modal.Header>
            <h2 className='text-xl font-semibold'>Create New Challenge</h2>
          </Modal.Header>
          <Modal.Body>
            <CreateChallengeModal
              isOpen={createModalState.isOpen}
              onClose={createModalState.close}
              onCreateChallenge={handleCreateChallenge}
              currentUser={user}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </div>
  )
}

// Apply HOCs to enhance the component with auth, loading, and toast capabilities
export default withAuth(withLoading(withToast(HomePage)))
