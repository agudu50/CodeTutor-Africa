import { lazy } from 'react'
import { RouteObject, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'

// Lazy-loaded route pages for optimal bundle splitting and 8GB laptop performance
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const TutorPage = lazy(() => import('@/features/tutor/pages/TutorPage'))
const PracticeListPage = lazy(() => import('@/features/practice/pages/PracticeListPage'))
const PracticeWorkspacePage = lazy(() => import('@/features/practice/pages/PracticeWorkspacePage'))
const DebuggerPage = lazy(() => import('@/features/debugger/pages/DebuggerPage'))
const CourseListPage = lazy(() => import('@/features/learning/pages/CourseListPage'))
const CourseDetailPage = lazy(() => import('@/features/learning/pages/CourseDetailPage'))
const LessonViewPage = lazy(() => import('@/features/learning/pages/LessonViewPage'))
const ProgressPage = lazy(() => import('@/features/progress/pages/ProgressPage'))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'tutor',
        children: [
          {
            index: true,
            element: <TutorPage />,
          },
          {
            path: 'session/:sessionId',
            element: <TutorPage />,
          },
        ],
      },
      {
        path: 'practice',
        children: [
          {
            index: true,
            element: <PracticeListPage />,
          },
          {
            path: ':practiceId',
            element: <PracticeWorkspacePage />,
          },
        ],
      },
      {
        path: 'debugger',
        element: <DebuggerPage />,
      },
      {
        path: 'learning',
        children: [
          {
            index: true,
            element: <CourseListPage />,
          },
          {
            path: 'courses',
            element: <CourseListPage />,
          },
          {
            path: 'courses/:courseId',
            element: <CourseDetailPage />,
          },
          {
            path: 'lessons/:lessonId',
            element: <LessonViewPage />,
          },
        ],
      },
      {
        path: 'progress',
        element: <ProgressPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]
