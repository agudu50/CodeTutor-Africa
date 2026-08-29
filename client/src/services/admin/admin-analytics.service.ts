import { AdminUserRecord, AuditLogEntry, UserStatsSummary } from '@/types/admin-analytics'

const USERS_STORAGE_KEY = 'codetutor_admin_users_v1'
const AUDIT_LOGS_STORAGE_KEY = 'codetutor_admin_audit_logs_v1'

export const INITIAL_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'usr-gh-1',
    name: 'Kofi Mensah',
    username: 'kofi_dev',
    email: 'kofi.mensah@ug.edu.gh',
    role: 'learner',
    countryCode: 'GH',
    countryName: 'Ghana',
    status: 'active_now',
    lastActive: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    registeredAt: '2026-01-10T08:30:00Z',
    totalXp: 54200,
    streakDays: 48,
    lessonsCompleted: 54,
    problemsSolved: 312,
    gamesPlayed: 145,
    favoriteLanguage: 'python',
    deviceMode: 'offline_pwa',
  },
  {
    id: 'usr-ng-2',
    name: 'Amina Bello',
    username: 'amina_codes',
    email: 'amina.b@unilag.edu.ng',
    role: 'learner',
    countryCode: 'NG',
    countryName: 'Nigeria',
    status: 'active_now',
    lastActive: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    registeredAt: '2026-01-14T09:15:00Z',
    totalXp: 51800,
    streakDays: 42,
    lessonsCompleted: 51,
    problemsSolved: 298,
    gamesPlayed: 120,
    favoriteLanguage: 'javascript',
    deviceMode: 'desktop_app',
  },
  {
    id: 'usr-sn-3',
    name: 'Ousmane Diop',
    username: 'ousmane_sn',
    email: 'ousmane.diop@ucad.edu.sn',
    role: 'learner',
    countryCode: 'SN',
    countryName: 'Senegal',
    status: 'active_today',
    lastActive: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    registeredAt: '2026-01-18T14:20:00Z',
    totalXp: 48600,
    streakDays: 39,
    lessonsCompleted: 46,
    problemsSolved: 275,
    gamesPlayed: 98,
    favoriteLanguage: 'python',
    deviceMode: 'offline_pwa',
  },
  {
    id: 'usr-ci-4',
    name: 'Fatou Traoré',
    username: 'fatou_tech',
    email: 'fatou.traore@inphb.ci',
    role: 'learner',
    countryCode: 'CI',
    countryName: "Côte d'Ivoire",
    status: 'active_today',
    lastActive: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    registeredAt: '2026-01-22T11:45:00Z',
    totalXp: 46100,
    streakDays: 35,
    lessonsCompleted: 42,
    problemsSolved: 260,
    gamesPlayed: 85,
    favoriteLanguage: 'java',
    deviceMode: 'offline_pwa',
  },
  {
    id: 'usr-gh-5',
    name: 'Kwame Osei',
    username: 'kwame_builds',
    email: 'k.osei@knust.edu.gh',
    role: 'learner',
    countryCode: 'GH',
    countryName: 'Ghana',
    status: 'active_this_week',
    lastActive: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    registeredAt: '2026-02-01T10:00:00Z',
    totalXp: 41200,
    streakDays: 28,
    lessonsCompleted: 38,
    problemsSolved: 220,
    gamesPlayed: 64,
    favoriteLanguage: 'javascript',
    deviceMode: 'web_browser',
  },
  {
    id: 'usr-lr-6',
    name: 'Bendue Tamba',
    username: 'bendue_code',
    email: 'b.tamba@ul.edu.lr',
    role: 'learner',
    countryCode: 'LR',
    countryName: 'Liberia',
    status: 'active_this_week',
    lastActive: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    registeredAt: '2026-02-05T16:30:00Z',
    totalXp: 38900,
    streakDays: 24,
    lessonsCompleted: 34,
    problemsSolved: 195,
    gamesPlayed: 52,
    favoriteLanguage: 'python',
    deviceMode: 'offline_pwa',
  },
  {
    id: 'usr-sl-7',
    name: 'Mohamed Kamara',
    username: 'kamara_m',
    email: 'm.kamara@fbc.edu.sl',
    role: 'learner',
    countryCode: 'SL',
    countryName: 'Sierra Leone',
    status: 'idle',
    lastActive: new Date(Date.now() - 10 * 86400 * 1000).toISOString(),
    registeredAt: '2026-01-20T12:00:00Z',
    totalXp: 29400,
    streakDays: 14,
    lessonsCompleted: 24,
    problemsSolved: 130,
    gamesPlayed: 32,
    favoriteLanguage: 'java',
    deviceMode: 'web_browser',
  },
  {
    id: 'usr-gm-8',
    name: 'Isatou Ceesay',
    username: 'isatou_c',
    email: 'i.ceesay@utg.edu.gm',
    role: 'learner',
    countryCode: 'GM',
    countryName: 'The Gambia',
    status: 'idle',
    lastActive: new Date(Date.now() - 14 * 86400 * 1000).toISOString(),
    registeredAt: '2026-01-25T15:10:00Z',
    totalXp: 26800,
    streakDays: 12,
    lessonsCompleted: 20,
    problemsSolved: 115,
    gamesPlayed: 25,
    favoriteLanguage: 'python',
    deviceMode: 'offline_pwa',
  },
  {
    id: 'usr-bj-9',
    name: 'Sena Dossou',
    username: 'sena_bj',
    email: 'sena.dossou@uac.bj',
    role: 'learner',
    countryCode: 'BJ',
    countryName: 'Benin',
    status: 'inactive',
    lastActive: new Date(Date.now() - 32 * 86400 * 1000).toISOString(),
    registeredAt: '2026-01-05T09:00:00Z',
    totalXp: 18400,
    streakDays: 0,
    lessonsCompleted: 14,
    problemsSolved: 70,
    gamesPlayed: 15,
    favoriteLanguage: 'javascript',
    deviceMode: 'web_browser',
  },
  {
    id: 'usr-tg-10',
    name: 'Koffi Agbeko',
    username: 'koffi_tg',
    email: 'koffi.agbeko@univ-lome.tg',
    role: 'learner',
    countryCode: 'TG',
    countryName: 'Togo',
    status: 'inactive',
    lastActive: new Date(Date.now() - 45 * 86400 * 1000).toISOString(),
    registeredAt: '2026-01-02T14:40:00Z',
    totalXp: 12200,
    streakDays: 0,
    lessonsCompleted: 8,
    problemsSolved: 42,
    gamesPlayed: 8,
    favoriteLanguage: 'python',
    deviceMode: 'web_browser',
  },
  {
    id: 'usr-admin-1',
    name: 'Lead Curriculum Director',
    username: 'admin_director',
    email: 'curriculum@codetutor.africa',
    role: 'admin',
    countryCode: 'GH',
    countryName: 'Ghana',
    status: 'active_now',
    lastActive: new Date().toISOString(),
    registeredAt: '2026-01-01T00:00:00Z',
    totalXp: 99999,
    streakDays: 60,
    lessonsCompleted: 120,
    problemsSolved: 500,
    gamesPlayed: 300,
    favoriteLanguage: 'python',
    deviceMode: 'desktop_app',
  },
]

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    actorName: 'Lead Curriculum Director (Admin)',
    actorRole: 'admin',
    action: 'COURSE_UPDATED',
    category: 'curriculum',
    target: 'course-py-101 (Python Programming & Problem Solving)',
    details: 'Verified offline module 4 loop exercises and code runner unit test specs.',
    status: 'success',
    ipAddress: '127.0.0.1',
    userAgent: 'CodeTutor Desktop/2.0 (Offline CPU Runtime)',
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    actorName: 'Kofi Mensah',
    actorRole: 'learner',
    action: 'PRACTICE_SUBMITTED',
    category: 'practice',
    target: 'practice-py-m4 (Number Sequence & Accumulator Loop)',
    details: 'All 3 automated test cases passed in 48ms offline execution.',
    status: 'success',
    ipAddress: '197.251.134.42 (Accra, GH)',
    userAgent: 'CodeTutor PWA / Chrome 124 (IndexedDB v2)',
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actorName: 'Amina Bello',
    actorRole: 'learner',
    action: 'TUTOR_SESSION_CREATED',
    category: 'tutor',
    target: 'session-2 (Async/Await & Promise Chaining)',
    details: 'Initiated Socratic dialogue on JavaScript Event Loop & Microtask queues.',
    status: 'info',
    ipAddress: '102.89.23.118 (Lagos, NG)',
    userAgent: 'CodeTutor Desktop / Electron v28',
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    actorName: 'Ousmane Diop',
    actorRole: 'learner',
    action: 'GAME_ROUND_PLAYED',
    category: 'arcade',
    target: 'Syntax Speedrun (Python Mode)',
    details: 'Completed level 5 with 98% accuracy. +120 Game XP awarded.',
    status: 'success',
    ipAddress: '154.124.78.90 (Dakar, SN)',
    userAgent: 'CodeTutor PWA / Firefox Mobile',
  },
  {
    id: 'log-105',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actorName: 'Fatou Traoré',
    actorRole: 'learner',
    action: 'LESSON_COMPLETED',
    category: 'learning',
    target: 'Java Course • Lesson 4 (Object Classes & Constructors)',
    details: 'Completed interactive reading, quiz score 100%, and code exercise.',
    status: 'success',
    ipAddress: '160.154.21.5 (Abidjan, CI)',
    userAgent: 'CodeTutor PWA / WebKit Offline Engine',
  },
  {
    id: 'log-106',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    actorName: 'System Background Worker',
    actorRole: 'system',
    action: 'OFFLINE_CACHE_VERIFIED',
    category: 'system',
    target: 'ServiceWorker v2.4 (All Course Bundles & Media)',
    details: 'Verified SHA-256 checksums for 18 lesson packs and interactive sandbox assets.',
    status: 'success',
    ipAddress: '127.0.0.1 (Local Core)',
    userAgent: 'System Background Service',
  },
  {
    id: 'log-107',
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    actorName: 'Lead Curriculum Director (Admin)',
    actorRole: 'admin',
    action: 'PRACTICE_CHALLENGE_CREATED',
    category: 'practice',
    target: 'practice-js-m6 (Array Methods & Callbacks)',
    details: 'Published new challenge with 3 automated unit test assertions.',
    status: 'success',
    ipAddress: '127.0.0.1',
    userAgent: 'CodeTutor Admin / Edge 122',
  },
  {
    id: 'log-108',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    actorName: 'Security & Auth Guard',
    actorRole: 'security',
    action: 'SECURITY_AUDIT_PASSED',
    category: 'security',
    target: 'Local Sandbox Code Isolation (WebAssembly/Pyodide Worker)',
    details: 'Passed sandboxed execution boundary check with zero network exfiltration leak.',
    status: 'success',
    ipAddress: '127.0.0.1',
    userAgent: 'CodeTutor Security Engine',
  },
  {
    id: 'log-109',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    actorName: 'Kofi Mensah',
    actorRole: 'learner',
    action: 'USER_LOGIN',
    category: 'auth',
    target: 'Learner Portal (Accra, GH)',
    details: 'Logged in via secure offline credential token. IndexedDB sync resumed.',
    status: 'success',
    ipAddress: '197.251.134.42 (Accra, GH)',
    userAgent: 'CodeTutor PWA / Chrome 124',
  },
  {
    id: 'log-110',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    actorName: 'Sena Dossou',
    actorRole: 'learner',
    action: 'ACCOUNT_CREATED',
    category: 'auth',
    target: 'New Learner Profile (Benin)',
    details: 'Created learner account with offline curriculum pack & Python track selected.',
    status: 'success',
    ipAddress: '154.68.12.88 (Cotonou, BJ)',
    userAgent: 'CodeTutor Web / Safari 17',
  },
  {
    id: 'log-111',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    actorName: 'Kwame Osei',
    actorRole: 'learner',
    action: 'USER_LOGOUT',
    category: 'auth',
    target: 'Session Termination',
    details: 'Signed out securely. Preserved offline progress and cached lesson snapshots.',
    status: 'info',
    ipAddress: '197.251.130.12 (Kumasi, GH)',
    userAgent: 'CodeTutor Web / Firefox 123',
  },
  {
    id: 'log-112',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    actorName: 'Fatou Traoré',
    actorRole: 'learner',
    action: 'PASSWORD_RESET',
    category: 'auth',
    target: 'Security Recovery Token',
    details: 'Requested password recovery OTP via registered email (inphb.ci).',
    status: 'warning',
    ipAddress: '160.154.21.5 (Abidjan, CI)',
    userAgent: 'CodeTutor Mobile / iOS PWA',
  },
]

class AdminAnalyticsService {
  private users: AdminUserRecord[] = []
  private auditLogs: AuditLogEntry[] = []

  constructor() {
    this.init()
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
      if (storedUsers) {
        this.users = JSON.parse(storedUsers)
      } else {
        this.users = [...INITIAL_ADMIN_USERS]
        this.saveUsers()
      }

      const storedLogs = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY)
      if (storedLogs) {
        this.auditLogs = JSON.parse(storedLogs)
      } else {
        this.auditLogs = [...INITIAL_AUDIT_LOGS]
        this.saveLogs()
      }
    } catch {
      this.users = [...INITIAL_ADMIN_USERS]
      this.auditLogs = [...INITIAL_AUDIT_LOGS]
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users))
      window.dispatchEvent(new CustomEvent('admin_users_updated', { detail: this.users }))
    } catch (e) {
      console.warn('Failed to persist admin users', e)
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(this.auditLogs))
      window.dispatchEvent(new CustomEvent('admin_audit_logs_updated', { detail: this.auditLogs }))
    } catch (e) {
      console.warn('Failed to persist audit logs', e)
    }
  }

  getAllUsers(): AdminUserRecord[] {
    return [...this.users]
  }

  getUserStats(): UserStatsSummary {
    const totalUsers = this.users.length
    const activeNow = this.users.filter((u) => u.status === 'active_now').length
    const activeToday = this.users.filter((u) => u.status === 'active_now' || u.status === 'active_today').length
    const activeThisWeek = this.users.filter(
      (u) => u.status === 'active_now' || u.status === 'active_today' || u.status === 'active_this_week'
    ).length
    const inactiveUsers = this.users.filter((u) => u.status === 'idle' || u.status === 'inactive').length

    const totalStreak = this.users.reduce((acc, u) => acc + u.streakDays, 0)
    const averageStreak = totalUsers > 0 ? Math.round(totalStreak / totalUsers) : 0
    const totalXpDistributed = this.users.reduce((acc, u) => acc + u.totalXp, 0)

    const offlineCount = this.users.filter((u) => u.deviceMode === 'offline_pwa' || u.deviceMode === 'desktop_app').length
    const offlinePwaUsersPercent = totalUsers > 0 ? Math.round((offlineCount / totalUsers) * 100) : 80

    return {
      totalUsers,
      activeNow,
      activeToday,
      activeThisWeek,
      inactiveUsers,
      averageStreak,
      totalXpDistributed,
      offlinePwaUsersPercent,
    }
  }

  getAllAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs]
  }

  logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    }
    this.auditLogs.unshift(newLog)
    // Keep max 200 logs
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200)
    }
    this.saveLogs()
    return newLog
  }

  toggleUserStatus(userId: string): AdminUserRecord | null {
    const user = this.users.find((u) => u.id === userId)
    if (!user) return null

    if (user.status === 'inactive' || user.status === 'idle') {
      user.status = 'active_today'
      user.lastActive = new Date().toISOString()
      this.logAction({
        actorName: 'Lead Curriculum Director (Admin)',
        actorRole: 'admin',
        action: 'USER_RE_ENGAGED',
        category: 'security',
        target: `${user.name} (${user.username})`,
        details: 'Manually reactivated learner status and dispatched offline study catch-up pack.',
        status: 'info',
        ipAddress: '127.0.0.1',
        userAgent: 'CodeTutor Admin Console',
      })
    } else {
      user.status = 'idle'
      this.logAction({
        actorName: 'Lead Curriculum Director (Admin)',
        actorRole: 'admin',
        action: 'USER_FLAGGED_IDLE',
        category: 'security',
        target: `${user.name} (${user.username})`,
        details: 'User marked as idle for follow-up study mentoring.',
        status: 'warning',
        ipAddress: '127.0.0.1',
        userAgent: 'CodeTutor Admin Console',
      })
    }
    this.saveUsers()
    return user
  }

  resetToDefaults() {
    this.users = [...INITIAL_ADMIN_USERS]
    this.auditLogs = [...INITIAL_AUDIT_LOGS]
    this.saveUsers()
    this.saveLogs()
  }

  exportAuditLogsAsJson(): string {
    return JSON.stringify(this.auditLogs, null, 2)
  }

  exportAuditLogsAsCsv(): string {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Category', 'Target', 'Status', 'IP Address', 'Details']
    const rows = this.auditLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.actorName}"`,
      `"${log.actorRole}"`,
      `"${log.action}"`,
      `"${log.category}"`,
      `"${log.target.replace(/"/g, '""')}"`,
      `"${log.status}"`,
      `"${log.ipAddress}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ])
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  }
}

export const adminAnalyticsService = new AdminAnalyticsService()
