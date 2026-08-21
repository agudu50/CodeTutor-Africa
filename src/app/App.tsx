import React from 'react'
import { ThemeProvider } from './providers/ThemeProvider'
import { SystemStatusProvider } from './providers/SystemStatusProvider'
import { AppRouter } from './router/AppRouter'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SystemStatusProvider>
          <AppRouter />
        </SystemStatusProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
