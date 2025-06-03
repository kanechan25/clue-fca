import React, { createContext, useContext, ReactNode } from 'react'
import { useFitnessStore } from '@/stores/fitnessStore'
import { Challenge, UserProgress, LeaderboardEntry, ProgressInput } from '@/types'

interface ChallengeContextType {
  challenges: Challenge[]
  userProgress: Record<string, UserProgress>
  leaderboards: Record<string, LeaderboardEntry[]>

  addChallenge: (challenge: Omit<Challenge, 'id' | 'participants'>) => void
  joinChallenge: (challengeId: string) => void
  leaveChallenge: (challengeId: string) => void
  addProgress: (input: ProgressInput) => void
  updateProgress: (challengeId: string, date: string, value: number, notes?: string) => void
  generateLeaderboard: (challengeId: string) => void
  loadMockData: () => void

  getChallengeById: (challengeId: string) => Challenge | undefined
  getUserProgress: (challengeId: string) => UserProgress | undefined
  getLeaderboard: (challengeId: string) => LeaderboardEntry[]
  isUserJoined: (challengeId: string) => boolean
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined)

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const {
    challenges,
    userProgress,
    leaderboards,
    addChallenge,
    joinChallenge,
    leaveChallenge,
    addProgress,
    updateProgress,
    generateLeaderboard,
    loadMockData,
  } = useFitnessStore()

  const getChallengeById = (challengeId: string): Challenge | undefined => {
    return challenges.find((c) => c.id === challengeId)
  }

  const getUserProgress = (challengeId: string): UserProgress | undefined => {
    return userProgress[challengeId]
  }

  const getLeaderboard = (challengeId: string): LeaderboardEntry[] => {
    return leaderboards[challengeId] || []
  }

  const isUserJoined = (challengeId: string): boolean => {
    return !!userProgress[challengeId]
  }

  const contextValue: ChallengeContextType = {
    challenges,
    userProgress,
    leaderboards,

    addChallenge,
    joinChallenge,
    leaveChallenge,
    addProgress,
    updateProgress,
    generateLeaderboard,
    loadMockData,

    getChallengeById,
    getUserProgress,
    getLeaderboard,
    isUserJoined,
  }

  return <ChallengeContext.Provider value={contextValue}>{children}</ChallengeContext.Provider>
}

export function useChallenge(): ChallengeContextType {
  const context = useContext(ChallengeContext)
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider')
  }
  return context
}

export function useChallengeDetails(challengeId: string) {
  const {
    getChallengeById,
    getUserProgress,
    getLeaderboard,
    isUserJoined,
    joinChallenge,
    leaveChallenge,
    addProgress,
    generateLeaderboard,
  } = useChallenge()

  const challenge = getChallengeById(challengeId)
  const progress = getUserProgress(challengeId)
  const leaderboard = getLeaderboard(challengeId)
  const isJoined = isUserJoined(challengeId)

  const handleJoin = () => {
    joinChallenge(challengeId)
  }

  const handleLeave = () => {
    leaveChallenge(challengeId)
  }

  const handleAddProgress = (input: Omit<ProgressInput, 'challengeId'>) => {
    addProgress({ ...input, challengeId })
  }

  const refreshLeaderboard = () => {
    generateLeaderboard(challengeId)
  }

  return {
    challenge,
    progress,
    leaderboard,
    isJoined,
    handleJoin,
    handleLeave,
    handleAddProgress,
    refreshLeaderboard,
  }
}

export function withChallengeProvider<P extends object>(Component: React.ComponentType<P>) {
  const ComponentWithChallengeProvider = (props: P) => {
    return (
      <ChallengeProvider>
        <Component {...props} />
      </ChallengeProvider>
    )
  }

  ComponentWithChallengeProvider.displayName = `withChallengeProvider(${Component.displayName || Component.name})`

  return ComponentWithChallengeProvider
}
