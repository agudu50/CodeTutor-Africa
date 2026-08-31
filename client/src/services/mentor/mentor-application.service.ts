import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { AdminUserRecord } from '@/types/admin-analytics'

export type MentorApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface MentorApplication {
  id: string
  fullName: string
  email: string
  country: string
  countryCode?: string
  institutionOrCompany: string
  programmingTracks: string[]
  yearsOfExperience: string
  bio: string
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  status: MentorApplicationStatus
  appliedAt: string
  reviewedAt?: string
  reviewedBy?: string
  adminNotes?: string
}

const STORAGE_KEY = 'codetutor_mentor_applications_v1'

const INITIAL_APPLICATIONS: MentorApplication[] = [
  {
    id: 'app-mentor-101',
    fullName: 'Dr. Emmanuel Quaye',
    email: 'e.quaye@knust.edu.gh',
    country: 'Ghana',
    countryCode: 'GH',
    institutionOrCompany: 'Kwame Nkrumah University of Science & Technology',
    programmingTracks: ['Java', 'Algorithms & Data Structures', 'Systems & Architecture'],
    yearsOfExperience: '7+ years',
    bio: 'Senior lecturer in Computer Science specializing in enterprise Java and algorithmic foundations. Passionate about empowering West African university students through hands-on offline coding curricula.',
    githubUrl: 'https://github.com/emmanuel-quaye',
    linkedinUrl: 'https://linkedin.com/in/emmanuel-quaye-knust',
    portfolioUrl: 'https://equaye-cs.knust.edu.gh',
    status: 'pending',
    appliedAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'app-mentor-102',
    fullName: 'Zainab Al-Hassan',
    email: 'zainab.codes@unilag.edu.ng',
    country: 'Nigeria',
    countryCode: 'NG',
    institutionOrCompany: 'Lagos Tech Hub & UNILAG CS Alum',
    programmingTracks: ['Python', 'Data Science', 'Backend APIs'],
    yearsOfExperience: '5 years',
    bio: 'Lead Python backend engineer and community organizer for Women in Tech Lagos. Eager to mentor students working through Python fundamentals and real-world project development.',
    githubUrl: 'https://github.com/zainab-codes',
    linkedinUrl: 'https://linkedin.com/in/zainab-alhassan',
    portfolioUrl: 'https://zainab-codes.dev',
    status: 'pending',
    appliedAt: '2026-02-27T09:15:00Z',
  },
  {
    id: 'app-mentor-103',
    fullName: 'Cheikh Ndiaye',
    email: 'c.ndiaye@ucad.edu.sn',
    country: 'Senegal',
    countryCode: 'SN',
    institutionOrCompany: 'Université Cheikh Anta Diop',
    programmingTracks: ['JavaScript', 'TypeScript', 'Full-Stack Web'],
    yearsOfExperience: '4 years',
    bio: 'Full-stack educator and PWA developer. Leading campus workshops in Dakar on offline-first web technologies.',
    githubUrl: 'https://github.com/cheikh-sn',
    portfolioUrl: 'https://cheikh-ndiaye.sn',
    status: 'approved',
    appliedAt: '2026-02-20T11:00:00Z',
    reviewedAt: '2026-02-21T16:00:00Z',
    reviewedBy: 'Lead Curriculum Director (Admin)',
  },
]

class MentorApplicationService {
  private applications: MentorApplication[] = []

  constructor() {
    this.init()
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: MentorApplication[] = JSON.parse(stored)
        // Ensure mock records have portfolioUrl backfilled
        this.applications = parsed.map((app) => {
          if (app.id === 'app-mentor-101' && !app.portfolioUrl) {
            return { ...app, portfolioUrl: 'https://equaye-cs.knust.edu.gh' }
          }
          if (app.id === 'app-mentor-102' && !app.portfolioUrl) {
            return { ...app, portfolioUrl: 'https://zainab-codes.dev' }
          }
          if (app.id === 'app-mentor-103' && !app.portfolioUrl) {
            return { ...app, portfolioUrl: 'https://cheikh-ndiaye.sn' }
          }
          return app
        })
        this.save()
      } else {
        this.applications = [...INITIAL_APPLICATIONS]
        this.save()
      }
    } catch {
      this.applications = [...INITIAL_APPLICATIONS]
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.applications))
      window.dispatchEvent(new CustomEvent('mentor_applications_updated', { detail: this.applications }))
    } catch (e) {
      console.warn('Failed to persist mentor applications', e)
    }
  }

  getAllApplications(): MentorApplication[] {
    return [...this.applications]
  }

  getPendingCount(): number {
    return this.applications.filter((a) => a.status === 'pending').length
  }

  submitApplication(data: Omit<MentorApplication, 'id' | 'status' | 'appliedAt'>): MentorApplication {
    const newApplication: MentorApplication = {
      ...data,
      id: `app-mentor-${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    }
    this.applications.unshift(newApplication)
    this.save()

    // Notify Admin via Audit Log
    try {
      adminAnalyticsService.logAction({
        actorName: data.fullName,
        actorRole: 'learner',
        action: 'MENTOR_APPLICATION_SUBMITTED',
        category: 'curriculum',
        target: `${data.fullName} (${data.email})`,
        details: `Submitted new mentor application for tracks: [${data.programmingTracks.join(', ')}]. Institution: ${data.institutionOrCompany}`,
        status: 'info',
        ipAddress: '127.0.0.1',
        userAgent: 'CodeTutor Landing Portal',
      })
    } catch {
      // safe fallback
    }

    return newApplication
  }

  approveApplication(applicationId: string, reviewerName = 'Lead Curriculum Director (Admin)'): MentorApplication | null {
    const idx = this.applications.findIndex((a) => a.id === applicationId)
    if (idx === -1) return null

    const app = this.applications[idx]
    this.applications[idx] = {
      ...app,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName,
    }
    this.save()

    // Check if user already exists in AdminUserRecord, else create new verified mentor record
    const allUsers = adminAnalyticsService.getAllUsers()
    const existingUser = allUsers.find((u) => u.email.toLowerCase() === app.email.toLowerCase())

    if (existingUser) {
      adminAnalyticsService.setUserRole(existingUser.id, 'instructor')
    } else {
      const newMentorUser: AdminUserRecord = {
        id: `usr-mentor-${Date.now()}`,
        name: app.fullName,
        username: app.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15) + '_mentor',
        email: app.email,
        role: 'instructor',
        countryCode: app.countryCode || 'GH',
        countryName: app.country,
        status: 'active_today',
        lastActive: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        totalXp: 50000,
        streakDays: 30,
        lessonsCompleted: 45,
        problemsSolved: 250,
        gamesPlayed: 80,
        favoriteLanguage: app.programmingTracks[0]?.toLowerCase() || 'java',
        deviceMode: 'offline_pwa',
        enrolledCourseTitles: app.programmingTracks.map((t) => `Learn to code with ${t}`),
        activeCourseTitle: `Learn to code with ${app.programmingTracks[0] || 'Java'}`,
      }
      adminAnalyticsService.addUser(newMentorUser)
    }

    // Log admin approval
    adminAnalyticsService.logAction({
      actorName: reviewerName,
      actorRole: 'admin',
      action: 'ADMIN_APPROVED_MENTOR_APPLICATION',
      category: 'curriculum',
      target: `${app.fullName} (${app.email})`,
      details: `Approved mentor application and granted full Mentor Hub curriculum authoring & student inquiry resolution access.`,
      status: 'success',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })

    return this.applications[idx]
  }

  rejectApplication(applicationId: string, reviewerName = 'Lead Curriculum Director (Admin)', reason?: string): MentorApplication | null {
    const idx = this.applications.findIndex((a) => a.id === applicationId)
    if (idx === -1) return null

    const app = this.applications[idx]
    this.applications[idx] = {
      ...app,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName,
      adminNotes: reason || 'Application declined by curriculum committee.',
    }
    this.save()

    adminAnalyticsService.logAction({
      actorName: reviewerName,
      actorRole: 'admin',
      action: 'ADMIN_REJECTED_MENTOR_APPLICATION',
      category: 'curriculum',
      target: `${app.fullName} (${app.email})`,
      details: `Declined mentor application. Note: ${reason || 'Application declined.'}`,
      status: 'warning',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })

    return this.applications[idx]
  }

  deleteApplication(id: string): boolean {
    const initialLen = this.applications.length
    this.applications = this.applications.filter((a) => a.id !== id)
    if (this.applications.length !== initialLen) {
      this.save()
      return true
    }
    return false
  }
}

export const mentorApplicationService = new MentorApplicationService()
