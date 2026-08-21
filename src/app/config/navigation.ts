export interface NavItem {
  id: string
  label: string
  path: string
  iconName: 'LayoutDashboard' | 'Bot' | 'Code2' | 'Bug' | 'GraduationCap' | 'BarChart3' | 'Settings'
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
    id: 'learning',
    label: 'Courses',
    path: '/learning',
    iconName: 'GraduationCap',
  },
  {
    id: 'progress',
    label: 'My Progress',
    path: '/progress',
    iconName: 'BarChart3',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    iconName: 'Settings',
  },
]
