import { ReactNode } from 'react'
import { QueryProvider } from '@/providers/queryProvider'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'
import { NotificationProvider } from './NotificationProvider'
import { ChallengeProvider } from './ChallengeProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <QueryProvider>
          <AuthProvider>
            <ChallengeProvider>{children}</ChallengeProvider>
          </AuthProvider>
        </QueryProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export function AuthenticatedProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ChallengeProvider>{children}</ChallengeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
