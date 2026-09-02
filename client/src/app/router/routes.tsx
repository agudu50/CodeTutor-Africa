import { RouteObject, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'

import LandingPage from '@/features/landing/pages/LandingPage'
import SignInPage from '@/features/auth/pages/SignInPage'
import SignUpPage from '@/features/auth/pages/SignUpPage'
import OnboardingPage from '@/features/auth/pages/OnboardingPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import TutorPage from '@/features/tutor/pages/TutorPage'
import PracticeListPage from '@/features/practice/pages/PracticeListPage'
import PracticeWorkspacePage from '@/features/practice/pages/PracticeWorkspacePage'
import DebuggerPage from '@/features/debugger/pages/DebuggerPage'
import GamesHubPage from '@/features/games/pages/GamesHubPage'
import CourseListPage from '@/features/learning/pages/CourseListPage'
import CourseDetailPage from '@/features/learning/pages/CourseDetailPage'
import LessonViewPage from '@/features/learning/pages/LessonViewPage'
import ProgressPage from '@/features/progress/pages/ProgressPage'
import SettingsPage from '@/features/settings/pages/SettingsPage'
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'
import MentorDashboardPage from '@/features/mentor/pages/MentorDashboardPage'
import QuizzesPage from '@/features/learning/pages/QuizzesPage'
import LeaderboardPage from '@/features/leaderboard/pages/LeaderboardPage'

export const routes: RouteObject[] = [
  // Public standalone routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  // Authenticated / App shell workspace routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
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
        path: 'games',
        element: <GamesHubPage />,
      },
      {
        path: 'debugger',
        element: <DebuggerPage />,
      },
      {
        path: 'quizzes',
        element: <QuizzesPage />,
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
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'mentor',
        element: <MentorDashboardPage />,
      },
      {
        path: 'admin',
        element: <AdminDashboardPage />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]
