import { Routes } from '@/models/types'
import Home from '@/pages/Home'

export const routers: Routes[] = [
  {
    href: '/',
    id: 'home',
    name: 'Home',
    element: <Home />,
  },

  // Add other routes as needed
]
