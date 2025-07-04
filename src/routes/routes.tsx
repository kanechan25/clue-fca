import { Routes } from '@/types'
import HomePage from '@/pages/HomePage'
import ChallengeDetailPage from '@/pages/ChallengeDetailPage'

export const routers: Routes[] = [
  {
    href: '/',
    id: 'home',
    name: 'Home',
    element: <HomePage />,
  },
  {
    id: 'challenge-detail',
    href: '/challenge/:challengeId',
    name: 'Challenge Detail',
    element: <ChallengeDetailPage />,
  },

  // Add other routes if needed
]
