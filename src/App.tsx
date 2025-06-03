import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProviders } from '@/providers/AppProviders'
import { useAuth } from '@/providers/AuthProvider'
import { Onboarding } from '@/components/Onboarding'
import { routers } from '@/routes/routes'
import './assets/css/App.css'

function AuthenticatedApp() {
  return (
    <BrowserRouter>
      <Routes>
        {routers.map((route) => (
          <Route key={route.id} path={route.href} element={route.element} />
        ))}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function AppContent() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Onboarding />
  }
  return <AuthenticatedApp />
}

function App() {
  return (
    <AppProviders>
      <AppContent />

      <Toaster
        position='bottom-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AppProviders>
  )
}

export default App
