export interface NavItem {
  id: string
  label: string
  path: string
  iconName:
    | 'LayoutDashboard'
    | 'GraduationCap'
    | 'Bot'
    | 'Code2'
    | 'Bug'
    | 'HelpCircle'
    | 'Gamepad2'
    | 'BarChart3'
    | 'Trophy'
    | 'ShieldCheck'
    | 'Settings'
  badge?: string
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    iconName: 'LayoutDashboard',
  },
  {
    id: 'learning',
    label: 'Courses',
    path: '/learning',
    iconName: 'GraduationCap',
  },
  {
    id: 'tutor',
    label: 'AI Tutor',
    path: '/tutor',
    iconName: 'Bot',
    badge: 'Offline',
  },
  {
    id: 'practice',
    label: 'Practice',
    path: '/practice',
    iconName: 'Code2',
  },
  {
    id: 'debugger',
    label: 'Debugger',
    path: '/debugger',
    iconName: 'Bug',
  },
  {
    id: 'quizzes',
    label: 'Quizzes',
    path: '/quizzes',
    iconName: 'HelpCircle',
  },
  {
    id: 'games',
    label: 'Games',
    path: '/games',
    iconName: 'Gamepad2',
    badge: 'New',
  },
  {
    id: 'progress',
    label: 'My Progress',
    path: '/progress',
    iconName: 'BarChart3',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    path: '/leaderboard',
    iconName: 'Trophy',
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    iconName: 'ShieldCheck',
    badge: 'Staff',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    iconName: 'Settings',
  },
]

