import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/provider/queryProvider'
import { useFitnessStore } from '@/stores/fitnessStore'
import { Onboarding } from '@/components/Onboarding'
import { routers } from '@/routes/routes'
import './assets/css/App.css'

function App() {
  const { user, isOnboarded } = useFitnessStore()

  // Show onboarding if user hasn't completed it
  if (!isOnboarded || !user) {
    return (
      <>
        <Onboarding />
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </>
    )
  }

  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {routers.map((route) => (
            <Route key={route.id} path={route.href} element={route.element} />
          ))}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>

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
    </QueryProvider>
  )
}

export default App
