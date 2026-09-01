export type UserActivityStatus = 'active_now' | 'active_today' | 'active_this_week' | 'idle' | 'inactive'
export type UserRole = 'learner' | 'instructor' | 'admin'
export type AuditLogCategory = 'learning' | 'practice' | 'arcade' | 'tutor' | 'curriculum' | 'system' | 'security' | 'auth' | 'support'
export type AuditLogStatus = 'success' | 'warning' | 'info' | 'error'

export interface ContactInquiry {
  id: string
  fullName: string
  email: string
  country: string
  inquiryType: string
  subject: string
  message: string
  submittedAt: string
  status: 'new' | 'read' | 'replied' | 'archived'
  adminNotes?: string
}

export interface AdminUserRecord {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  countryCode: string
  countryName: string
  status: UserActivityStatus
  lastActive: string
  registeredAt: string
  totalXp: number
  streakDays: number
  lessonsCompleted: number
  problemsSolved: number
  gamesPlayed: number
  favoriteLanguage: 'python' | 'javascript' | 'java' | 'typescript' | string
  deviceMode: 'offline_pwa' | 'desktop_app' | 'web_browser'
  enrolledCourseIds?: string[]
  enrolledCourseTitles?: string[]
  activeCourseTitle?: string
  avatarUrl?: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  actorName: string
  actorRole: string
  action: string
  category: AuditLogCategory
  target: string
  details: string
  status: AuditLogStatus
  ipAddress: string
  userAgent: string
}

export interface UserStatsSummary {
  totalUsers: number
  activeNow: number
  activeToday: number
  activeThisWeek: number
  inactiveUsers: number
  averageStreak: number
  totalXpDistributed: number
  offlinePwaUsersPercent: number
}
