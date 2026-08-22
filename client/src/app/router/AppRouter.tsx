import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'

const router = createBrowserRouter(routes)

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen message="Initializing CodeTutor workspace..." />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
