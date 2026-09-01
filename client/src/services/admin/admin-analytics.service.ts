import { AdminUserRecord, AuditLogEntry, UserStatsSummary, ContactInquiry } from '@/types/admin-analytics'
import { Course } from '@/types'
import { courseStoreService } from '@/services/learning/course-store.service'

const USERS_STORAGE_KEY = 'codetutor_admin_users_v1'
const AUDIT_LOGS_STORAGE_KEY = 'codetutor_admin_audit_logs_v1'
const INQUIRIES_STORAGE_KEY = 'codetutor_admin_contact_inquiries_v1'

export const INITIAL_CONTACT_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    fullName: 'Dr. Kwame Boateng',
    email: 'k.boateng@knust.edu.gh',
    country: 'GH',
    inquiryType: 'partnership',
    subject: 'Deploying CodeTutor in KNUST Computer Science Labs',
    message: 'Hello CodeTutor Africa Team, We would like to install the offline curriculum bundle across 120 desktop computers in our undergraduate laboratory for our upcoming semester.',
    submittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'new',
  },
  {
    id: 'inq-2',
    fullName: 'Amina Adeleke',
    email: 'amina.adeleke@unilag.edu.ng',
    country: 'NG',
    inquiryType: 'classroom',
    subject: 'Lagos Women Who Code Offline Bootcamps',
    message: 'We are organizing a 4-week weekend coding club for secondary school girls in Lagos with limited mobile broadband. We would love offline setup assistance.',
    submittedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    status: 'new',
  },
  {
    id: 'inq-3',
    fullName: 'Mamadou Diallo',
    email: 'm.diallo@esp.sn',
    country: 'SN',
    inquiryType: 'mentor',
    subject: 'Mentorship on French-Speaking West Africa Track',
    message: 'I am a senior Python engineer in Dakar and would like to help review exercises and mentor francophone learners.',
    submittedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    status: 'read',
  },
]

export const INITIAL_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'usr-mentor-1',
    name: 'Dr. Emmanuel Quaye',
    username: 'dr_quaye_knust',
    email: 'e.quaye@knust.edu.gh',
    role: 'instructor',
    countryCode: 'GH',
    countryName: 'Ghana',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    status: 'active_now',
    lastActive: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    registeredAt: '2026-01-02T08:00:00Z',
    totalXp: 85400,
    streakDays: 62,
    lessonsCompleted: 85,
    problemsSolved: 480,
    gamesPlayed: 190,
    favoriteLanguage: 'java',
    deviceMode: 'offline_pwa',
    enrolledCourseIds: ['course-java-301'],
    enrolledCourseTitles: ['Learn to code with Java'],
    activeCourseTitle: 'Learn to code with Java',
  },
  {
    id: 'usr-mentor-2',
    name: 'Zainab Al-Hassan',
    username: 'zainab_mentor',
    email: 'zainab.codes@unilag.edu.ng',
    role: 'instructor',
    countryCode: 'NG',
    countryName: 'Nigeria',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    status: 'active_today',
    lastActive: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    registeredAt: '2026-01-08T10:30:00Z',
    totalXp: 72100,
    streakDays: 45,
    lessonsCompleted: 68,
    problemsSolved: 390,
    gamesPlayed: 140,
    favoriteLanguage: 'python',
    deviceMode: 'desktop_app',
    enrolledCourseIds: ['course-py-101'],
    enrolledCourseTitles: ['Learn to code with Python'],
    activeCourseTitle: 'Learn to code with Python',
  },
  {
    id: 'usr-mentor-3',
    name: 'Cheikh Ndiaye',
    username: 'cheikh_mentor',
    email: 'c.ndiaye@ucad.edu.sn',
    role: 'instructor',
    countryCode: 'SN',
    countryName: 'Senegal',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    status: 'active_this_week',
    lastActive: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
    registeredAt: '2026-01-15T12:00:00Z',
    totalXp: 58000,
    streakDays: 28,
    lessonsCompleted: 52,
    problemsSolved: 310,
    gamesPlayed: 95,
    favoriteLanguage: 'javascript',
    deviceMode: 'offline_pwa',
    enrolledCourseIds: ['course-js-201'],
    enrolledCourseTitles: ['Learn to code with JS'],
    activeCourseTitle: 'Learn to code with JS',
  },
  {
    id: 'usr-mentor-4',
    name: 'Prof. Samuel Adebayo',
    username: 'prof_adebayo',
    email: 's.adebayo@oau.edu.ng',
    role: 'instructor',
    countryCode: 'NG',
    countryName: 'Nigeria',
    avatarUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&auto=format&fit=crop&q=80',
    status: 'inactive',
    lastActive: new Date(Date.now() - 26 * 86400 * 1000).toISOString(),
    registeredAt: '2025-12-10T09:00:00Z',
    totalXp: 34000,
    streakDays: 0,
    lessonsCompleted: 30,
    problemsSolved: 180,
    gamesPlayed: 40,
    favoriteLanguage: 'typescript',
    deviceMode: 'web_browser',
    enrolledCourseIds: ['course-ts-401'],
    enrolledCourseTitles: ['Learn to code with TypeScript'],
    activeCourseTitle: 'Learn to code with TypeScript',
  },
  {
    id: 'usr-gh-1',
    name: 'Kofi Mensah',
    username: 'kofi_dev',
    email: 'kofi.mensah@ug.edu.gh',
    role: 'learner',
    countryCode: 'GH',
    countryName: 'Ghana',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-py-101', 'course-java-301'],
    enrolledCourseTitles: ['Learn to code with Python', 'Learn to code with Java'],
    activeCourseTitle: 'Learn to code with Java',
  },
  {
    id: 'usr-ng-2',
    name: 'Amina Bello',
    username: 'amina_codes',
    email: 'amina.b@unilag.edu.ng',
    role: 'learner',
    countryCode: 'NG',
    countryName: 'Nigeria',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-js-201', 'course-java-301'],
    enrolledCourseTitles: ['Learn to code with JS', 'Learn to code with Java'],
    activeCourseTitle: 'Learn to code with JS',
  },
  {
    id: 'usr-sn-3',
    name: 'Ousmane Diop',
    username: 'ousmane_sn',
    email: 'ousmane.diop@ucad.edu.sn',
    role: 'learner',
    countryCode: 'SN',
    countryName: 'Senegal',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-py-101'],
    enrolledCourseTitles: ['Learn to code with Python'],
    activeCourseTitle: 'Learn to code with Python',
  },
  {
    id: 'usr-ci-4',
    name: 'Fatou Traoré',
    username: 'fatou_tech',
    email: 'fatou.traore@inphb.ci',
    role: 'learner',
    countryCode: 'CI',
    countryName: "Côte d'Ivoire",
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-java-301'],
    enrolledCourseTitles: ['Learn to code with Java'],
    activeCourseTitle: 'Learn to code with Java',
  },
  {
    id: 'usr-gh-5',
    name: 'Kwame Osei',
    username: 'kwame_builds',
    email: 'k.osei@knust.edu.gh',
    role: 'learner',
    countryCode: 'GH',
    countryName: 'Ghana',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-js-201'],
    enrolledCourseTitles: ['Learn to code with JS'],
    activeCourseTitle: 'Learn to code with JS',
  },
  {
    id: 'usr-lr-6',
    name: 'Bendue Tamba',
    username: 'bendue_code',
    email: 'b.tamba@ul.edu.lr',
    role: 'learner',
    countryCode: 'LR',
    countryName: 'Liberia',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    status: 'active_this_week',
    lastActive: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    registeredAt: '2026-02-05T16:30:00Z',
    totalXp: 38900,
    streakDays: 24,
    lessonsCompleted: 34,
    problemsSolved: 195,
    gamesPlayed: 52,
    favoriteLanguage: 'typescript',
    deviceMode: 'offline_pwa',
    enrolledCourseIds: ['course-py-101', 'course-ts-401'],
    enrolledCourseTitles: ['Learn to code with Python', 'Learn to code with TypeScript'],
    activeCourseTitle: 'Learn to code with TypeScript',
  },
  {
    id: 'usr-sl-7',
    name: 'Mohamed Kamara',
    username: 'kamara_m',
    email: 'm.kamara@fbc.edu.sl',
    role: 'learner',
    countryCode: 'SL',
    countryName: 'Sierra Leone',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-java-301'],
    enrolledCourseTitles: ['Learn to code with Java'],
    activeCourseTitle: 'Learn to code with Java',
  },
  {
    id: 'usr-gm-8',
    name: 'Isatou Ceesay',
    username: 'isatou_c',
    email: 'i.ceesay@utg.edu.gm',
    role: 'learner',
    countryCode: 'GM',
    countryName: 'The Gambia',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-py-101'],
    enrolledCourseTitles: ['Learn to code with Python'],
    activeCourseTitle: 'Learn to code with Python',
  },
  {
    id: 'usr-bj-9',
    name: 'Sena Dossou',
    username: 'sena_bj',
    email: 'sena.dossou@uac.bj',
    role: 'learner',
    countryCode: 'BJ',
    countryName: 'Benin',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-js-201'],
    enrolledCourseTitles: ['Learn to code with JS'],
    activeCourseTitle: 'Learn to code with JS',
  },
  {
    id: 'usr-tg-10',
    name: 'Koffi Agbeko',
    username: 'koffi_tg',
    email: 'koffi.agbeko@univ-lome.tg',
    role: 'learner',
    countryCode: 'TG',
    countryName: 'Togo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
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
    enrolledCourseIds: ['course-py-101'],
    enrolledCourseTitles: ['Learn to code with Python'],
    activeCourseTitle: 'Learn to code with Python',
  },
  {
    id: 'usr-admin-1',
    name: 'Lead Curriculum Director',
    username: 'admin_director',
    email: 'curriculum@codetutor.africa',
    role: 'admin',
    countryCode: 'GH',
    countryName: 'Ghana',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
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
  private inquiries: ContactInquiry[] = []

  constructor() {
    this.init()
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
      if (storedUsers) {
        const parsed: AdminUserRecord[] = JSON.parse(storedUsers)
        const existingEmails = new Set(parsed.map((u) => u.email.toLowerCase()))
        const missingMentors = INITIAL_ADMIN_USERS.filter(
          (u) => u.role === 'instructor' && !existingEmails.has(u.email.toLowerCase())
        )
        const combined = [...missingMentors, ...parsed]

        this.users = combined.map((u) => {
          const mock = INITIAL_ADMIN_USERS.find(
            (m) => m.id === u.id || m.username === u.username || m.email.toLowerCase() === u.email.toLowerCase()
          )
          const avatarUrl = u.avatarUrl || mock?.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`

          if (u.enrolledCourseTitles && u.enrolledCourseTitles.length > 0) {
            return { ...u, avatarUrl }
          }
          if (mock?.enrolledCourseTitles) {
            return {
              ...u,
              avatarUrl,
              enrolledCourseIds: mock.enrolledCourseIds,
              enrolledCourseTitles: mock.enrolledCourseTitles,
              activeCourseTitle: mock.activeCourseTitle,
            }
          }
          const favLang = (u.favoriteLanguage || 'python').toLowerCase()
          const trackName =
            favLang === 'java'
              ? 'Learn to code with Java'
              : favLang === 'javascript'
              ? 'Learn to code with JS'
              : favLang === 'typescript'
              ? 'Learn to code with TypeScript'
              : 'Learn to code with Python'
          return {
            ...u,
            avatarUrl,
            enrolledCourseIds: [`course-${favLang}-101`],
            enrolledCourseTitles: [trackName],
            activeCourseTitle: trackName,
          }
        })
        this.saveUsers()
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

      const storedInquiries = localStorage.getItem(INQUIRIES_STORAGE_KEY)
      if (storedInquiries) {
        this.inquiries = JSON.parse(storedInquiries)
      } else {
        this.inquiries = [...INITIAL_CONTACT_INQUIRIES]
        this.saveInquiries()
      }
    } catch {
      this.users = [...INITIAL_ADMIN_USERS]
      this.auditLogs = [...INITIAL_AUDIT_LOGS]
      this.inquiries = [...INITIAL_CONTACT_INQUIRIES]
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

  private saveInquiries() {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(this.inquiries))
      window.dispatchEvent(new CustomEvent('admin_inquiries_updated', { detail: this.inquiries }))
    } catch (e) {
      console.warn('Failed to persist contact inquiries', e)
    }
  }

  private computeDynamicStatus(lastActiveIso?: string): 'active_now' | 'active_today' | 'active_this_week' | 'idle' | 'inactive' {
    if (!lastActiveIso) return 'inactive'
    try {
      const lastActive = new Date(lastActiveIso).getTime()
      const now = Date.now()
      const diffMinutes = (now - lastActive) / (1000 * 60)
      const diffHours = diffMinutes / 60

      if (diffMinutes <= 45) return 'active_now'
      if (diffHours <= 24) return 'active_today'
      if (diffHours <= 168) return 'active_this_week'
      if (diffHours <= 720) return 'idle'
      return 'inactive'
    } catch {
      return 'idle'
    }
  }

  getAllUsers(): AdminUserRecord[] {
    return this.users.map((u) => {
      const computed = this.computeDynamicStatus(u.lastActive)
      if (u.status !== computed && u.status !== 'active_now') {
        return { ...u, status: computed }
      }
      return u
    })
  }

  recordUserHeartbeat(userId: string): AdminUserRecord | null {
    const idx = this.users.findIndex((u) => u.id === userId)
    if (idx === -1) return null

    this.users[idx] = {
      ...this.users[idx],
      status: 'active_now',
      lastActive: new Date().toISOString(),
    }
    this.saveUsers()
    return this.users[idx]
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

  addUser(user: AdminUserRecord): AdminUserRecord {
    this.users.unshift(user)
    this.saveUsers()
    return user
  }

  demoteMentorToLearner(userId: string, reason = 'Administrative role restructuring', actorName = 'Lead Curriculum Director (Admin)'): AdminUserRecord | null {
    const idx = this.users.findIndex((u) => u.id === userId)
    if (idx === -1) return null

    const mentor = this.users[idx]
    this.users[idx] = {
      ...mentor,
      role: 'learner',
    }
    this.saveUsers()

    this.logAction({
      actorName,
      actorRole: 'admin',
      action: 'MENTOR_DEMOTED',
      category: 'curriculum',
      target: `${mentor.name} (${mentor.email})`,
      details: `Admin demoted mentor to standard learner. Reason: "${reason}". Revoked all Mentor Hub authoring, course editing & student inquiry resolution access.`,
      status: 'warning',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })

    const activeSessionId = localStorage.getItem('codetutor_active_user_session_id')
    if (activeSessionId === userId) {
      window.dispatchEvent(new CustomEvent('active_user_session_changed', { detail: this.users[idx] }))
    }

    return this.users[idx]
  }

  getActiveUserSession(): AdminUserRecord {
    try {
      const storedId = localStorage.getItem('codetutor_active_user_session_id')
      if (storedId) {
        const found = this.users.find((u) => u.id === storedId)
        if (found) return found
      }
    } catch {
      // fallback
    }
    const defaultUser = this.users.find((u) => u.role === 'instructor') || this.users[0]
    return defaultUser
  }

  setActiveUserSession(userId: string): AdminUserRecord | null {
    const found = this.users.find((u) => u.id === userId)
    if (found) {
      try {
        localStorage.setItem('codetutor_active_user_session_id', userId)
      } catch {}
      window.dispatchEvent(new CustomEvent('active_user_session_changed', { detail: found }))
      return found
    }
    return null
  }

  isCurrentUserMentor(): boolean {
    const user = this.getActiveUserSession()
    return Boolean(user && (user.role === 'instructor' || user.role === 'admin'))
  }

  setUserRole(userId: string, newRole: 'learner' | 'instructor' | 'admin', actorName = 'Lead Curriculum Director (Admin)'): AdminUserRecord | null {
    const idx = this.users.findIndex((u) => u.id === userId)
    if (idx === -1) return null

    const oldRole = this.users[idx].role
    this.users[idx] = {
      ...this.users[idx],
      role: newRole,
    }
    this.saveUsers()

    this.logAction({
      actorName,
      actorRole: 'admin',
      action: newRole === 'instructor' ? 'USER_PROMOTED_TO_MENTOR' : newRole === 'admin' ? 'USER_PROMOTED_TO_ADMIN' : 'USER_ROLE_UPDATED',
      category: 'curriculum',
      target: `${this.users[idx].name} (${this.users[idx].email})`,
      details: `Admin changed user role from [${oldRole.toUpperCase()}] to [${newRole.toUpperCase()}]. ${newRole === 'instructor' ? 'Granted Mentor Hub course authoring & inquiry desk access.' : 'Revoked Mentor Hub authoring privileges.'}`,
      status: 'success',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })

    const activeSessionId = localStorage.getItem('codetutor_active_user_session_id')
    if (activeSessionId === userId) {
      window.dispatchEvent(new CustomEvent('active_user_session_changed', { detail: this.users[idx] }))
    }

    return this.users[idx]
  }

  setUserStatus(userId: string, newStatus: 'active_now' | 'active_today' | 'active_this_week' | 'idle' | 'inactive', actorName = 'Lead Curriculum Director (Admin)'): AdminUserRecord | null {
    const idx = this.users.findIndex((u) => u.id === userId)
    if (idx === -1) return null

    const oldStatus = this.users[idx].status
    this.users[idx] = {
      ...this.users[idx],
      status: newStatus,
      lastActive: newStatus === 'active_now' ? new Date().toISOString() : this.users[idx].lastActive,
    }
    this.saveUsers()

    this.logAction({
      actorName,
      actorRole: 'admin',
      action: 'USER_STATUS_UPDATED',
      category: 'security',
      target: `${this.users[idx].name} (${this.users[idx].email})`,
      details: `Admin changed activity status from [${oldStatus}] to [${newStatus}].`,
      status: 'info',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })

    return this.users[idx]
  }

  getContactInquiries(): ContactInquiry[] {
    return [...this.inquiries]
  }

  addContactInquiry(inquiryData: Omit<ContactInquiry, 'id' | 'submittedAt' | 'status'>): ContactInquiry {
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    this.inquiries.unshift(newInquiry)
    this.saveInquiries()

    // Automatically record an immutable audit log entry for the admin desk
    this.logAction({
      actorName: newInquiry.fullName,
      actorRole: 'learner',
      action: 'CONTACT_INQUIRY_RECEIVED',
      category: 'support',
      target: `${newInquiry.fullName} (${newInquiry.email})`,
      details: `Received [${newInquiry.inquiryType.toUpperCase()}] inquiry: "${newInquiry.subject}" from ${newInquiry.country}.`,
      status: 'info',
      ipAddress: '197.251.134.42 (Web Contact)',
      userAgent: 'CodeTutor Contact Portal',
    })

    return newInquiry
  }

  updateInquiryStatus(id: string, status: 'new' | 'read' | 'replied' | 'archived', adminNotes?: string): ContactInquiry | null {
    const idx = this.inquiries.findIndex((i) => i.id === id)
    if (idx === -1) return null

    this.inquiries[idx] = {
      ...this.inquiries[idx],
      status,
      adminNotes: adminNotes !== undefined ? adminNotes : this.inquiries[idx].adminNotes,
    }
    this.saveInquiries()

    this.logAction({
      actorName: 'Lead Curriculum Director (Admin)',
      actorRole: 'admin',
      action: 'INQUIRY_STATUS_UPDATED',
      category: 'support',
      target: `${this.inquiries[idx].fullName} (${this.inquiries[idx].email})`,
      details: `Admin marked inquiry "${this.inquiries[idx].subject}" as [${status.toUpperCase()}].`,
      status: 'info',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })

    return this.inquiries[idx]
  }

  deleteContactInquiry(id: string): boolean {
    const idx = this.inquiries.findIndex((i) => i.id === id)
    if (idx === -1) return false

    const item = this.inquiries[idx]
    this.inquiries.splice(idx, 1)
    this.saveInquiries()

    this.logAction({
      actorName: 'Lead Curriculum Director (Admin)',
      actorRole: 'admin',
      action: 'INQUIRY_DELETED',
      category: 'support',
      target: `${item.fullName} (${item.email})`,
      details: `Admin deleted inquiry "${item.subject}".`,
      status: 'warning',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })

    return true
  }

  resetToDefaults() {
    this.users = [...INITIAL_ADMIN_USERS]
    this.auditLogs = [...INITIAL_AUDIT_LOGS]
    this.inquiries = [...INITIAL_CONTACT_INQUIRIES]
    this.saveUsers()
    this.saveLogs()
    this.saveInquiries()
  }

  /**
   * Returns all student / learner user records enrolled in a specific mentor's courses.
   */
  getLearnersForMentor(mentorUserOrId: string | AdminUserRecord, customMentorCourses?: Course[]): AdminUserRecord[] {
    const mentor = typeof mentorUserOrId === 'string'
      ? this.users.find((u) => u.id === mentorUserOrId || u.username === mentorUserOrId || u.email === mentorUserOrId)
      : mentorUserOrId

    if (!mentor) return []

    const mentorCourses = customMentorCourses || courseStoreService.getCoursesByMentor(
      mentor.id,
      mentor.enrolledCourseIds,
      mentor.favoriteLanguage
    )

    const mentorCourseIds = new Set(mentorCourses.map((c) => c.id))
    const mentorCourseTitles = new Set(mentorCourses.map((c) => c.title.toLowerCase()))
    const mentorCourseLanguages = new Set(mentorCourses.map((c) => c.language))

    // Fallback: also include courses explicitly in mentor's profile
    if (mentor.enrolledCourseIds) {
      mentor.enrolledCourseIds.forEach((id) => mentorCourseIds.add(id))
    }
    if (mentor.enrolledCourseTitles) {
      mentor.enrolledCourseTitles.forEach((t) => mentorCourseTitles.add(t.toLowerCase()))
    }
    if (mentor.activeCourseTitle) {
      mentorCourseTitles.add(mentor.activeCourseTitle.toLowerCase())
    }

    return this.users.filter((user) => {
      // Exclude mentors and admins from student lists
      if (user.role !== 'learner') return false

      // Match 1: Course ID enrollment
      if (user.enrolledCourseIds && user.enrolledCourseIds.some((cid) => mentorCourseIds.has(cid))) {
        return true
      }

      // Match 2: Course Title enrollment
      if (user.enrolledCourseTitles && user.enrolledCourseTitles.some((ct) => mentorCourseTitles.has(ct.toLowerCase()))) {
        return true
      }

      // Match 3: Active course title
      if (user.activeCourseTitle && mentorCourseTitles.has(user.activeCourseTitle.toLowerCase())) {
        return true
      }

      // Match 4: Language alignment (for learners studying mentor's specialized language track)
      if (mentor.favoriteLanguage && user.favoriteLanguage === mentor.favoriteLanguage && mentorCourseLanguages.has(user.favoriteLanguage as any)) {
        return true
      }

      return false
    })
  }

  /**
   * Returns a complete breakdown for administrators of each mentor and the number of students enrolled under each of their courses.
   */
  getMentorCourseEnrollmentSummary(): Array<{
    mentor: AdminUserRecord
    courses: Array<Course & { studentCount: number; enrolledLearners: AdminUserRecord[] }>
    totalPlatformStudents: number
    totalEnrolledCount: number
    enrolledLearners: AdminUserRecord[]
  }> {
    const mentors = this.users.filter((u) => u.role === 'instructor')
    const learners = this.users.filter((u) => u.role === 'learner')

    return mentors.map((mentor) => {
      const mentorCourses = courseStoreService.getCoursesByMentor(
        mentor.id,
        mentor.enrolledCourseIds,
        mentor.favoriteLanguage
      )

      // Calculate enrolled learners for this mentor
      const mentorLearners = this.getLearnersForMentor(mentor, mentorCourses)

      const enrichedCourses = mentorCourses.map((course) => {
        const courseLearners = learners.filter((l) =>
          (l.enrolledCourseIds && l.enrolledCourseIds.includes(course.id)) ||
          (l.enrolledCourseTitles && l.enrolledCourseTitles.some((t) => t.toLowerCase() === course.title.toLowerCase())) ||
          (l.activeCourseTitle && l.activeCourseTitle.toLowerCase() === course.title.toLowerCase())
        )

        return {
          ...course,
          studentCount: course.enrolledCount || courseLearners.length || 0,
          enrolledLearners: courseLearners,
        }
      })

      const totalEnrolled = enrichedCourses.reduce((sum, c) => sum + (c.enrolledCount || c.studentCount || 0), 0)

      return {
        mentor,
        courses: enrichedCourses,
        totalPlatformStudents: learners.length,
        totalEnrolledCount: totalEnrolled,
        enrolledLearners: mentorLearners,
      }
    })
  }

  exportAuditLogsAsJson(customLogs?: AuditLogEntry[]): string {
    const list = customLogs || this.auditLogs
    return JSON.stringify(list, null, 2)
  }

  exportAuditLogsAsCsv(customLogs?: AuditLogEntry[]): string {
    const list = customLogs || this.auditLogs
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Category', 'Target', 'Status', 'IP Address', 'User Agent', 'Details']
    const rows = list.map((log) => [
      `"${log.timestamp}"`,
      `"${log.actorName}"`,
      `"${log.actorRole}"`,
      `"${log.action}"`,
      `"${log.category}"`,
      `"${log.target.replace(/"/g, '""')}"`,
      `"${log.status}"`,
      `"${log.ipAddress}"`,
      `"${log.userAgent.replace(/"/g, '""')}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ])
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  }
}

export const adminAnalyticsService = new AdminAnalyticsService()

