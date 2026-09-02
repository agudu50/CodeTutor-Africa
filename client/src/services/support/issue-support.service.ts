import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'

export type IssueCategory =
  | 'course_bug'
  | 'practice_problem'
  | 'ai_tutor_feedback'
  | 'offline_sync'
  | 'feature_suggestion'
  | 'other'

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent'

export type IssueStatus = 'open' | 'in_review' | 'resolved' | 'closed'

export interface IssueMessage {
  id: string
  senderRole: 'learner' | 'mentor' | 'admin'
  senderName: string
  message: string
  codeSnippet?: string
  createdAt: string
}

export interface IssueReport {
  id: string
  userName: string
  userEmail: string
  userRole?: string
  subject: string
  category: IssueCategory
  priority: IssuePriority
  status: IssueStatus
  description: string
  codeSnippet?: string
  updatedCodeSnippet?: string
  errorMessage?: string
  adminReply?: string
  instructorName?: string
  /** Course this report is filed against */
  courseId?: string
  courseName?: string
  /** Who submitted: learner from a course page, or admin raising a request */
  submittedByRole?: 'learner' | 'admin'
  /** Multi-turn conversation messages */
  messages?: IssueMessage[]
  createdAt: string
  resolvedAt?: string
}

const ISSUES_STORAGE_KEY = 'codetutor_admin_issues'

const INITIAL_ISSUES: IssueReport[] = [
  {
    id: 'iss-101',
    userName: 'Kofi Mensah',
    userEmail: 'kofi.m@knust.edu.gh',
    userRole: 'Student Developer (Kumasi)',
    subject: 'Practice test case 3 on Palindrome Checker fails on whitespace',
    category: 'practice_problem',
    priority: 'medium',
    status: 'open',
    description: 'When submitting the recursive palindrome checker, test case 2 with spaces like "A man a plan a canal Panama" expects whitespace trimming before testing. Could you clarify in the description?',
    codeSnippet: 'def is_palindrome(s):\n    s = s.replace(" ", "").lower()\n    if len(s) <= 1: return True\n    return s[0] == s[-1] and is_palindrome(s[1:-1])',
    createdAt: '2026-02-21T18:40:00Z',
  },
  {
    id: 'iss-102',
    userName: 'Amina Bello',
    userEmail: 'amina.b@abu.edu.ng',
    userRole: 'Computer Science Sophomore (Zaria)',
    subject: 'Request: Offline TypeScript & Next.js full-stack track',
    category: 'feature_suggestion',
    priority: 'low',
    status: 'in_review',
    description: 'Our campus coding hub would love an offline track for TypeScript and React / Next.js server components for our term projects.',
    createdAt: '2026-02-20T14:15:00Z',
    adminReply: 'Added to our Q2 offline course curriculum! Module drafts will be published in the next build.',
  },
  {
    id: 'iss-103',
    userName: 'Tariq Al-Mansoor',
    userEmail: 'tariq@asu.edu.eg',
    userRole: 'Engineering Student (Cairo)',
    subject: 'Offline AI model loaded with 0 latency on Linux laptop',
    category: 'ai_tutor_feedback',
    priority: 'low',
    status: 'resolved',
    description: 'Just wanted to share positive feedback: the local AI model runs flawlessly on my 4GB RAM ThinkPad without consuming any data.',
    createdAt: '2026-02-19T09:20:00Z',
    resolvedAt: '2026-02-19T11:00:00Z',
    adminReply: 'Thank you Tariq! We specifically optimized quantization for 4GB and 8GB everyday machines.',
  },
]

class IssueSupportService {
  private issues: IssueReport[] = []

  constructor() {
    this.init()
  }

  private init() {
    try {
      const stored = localStorage.getItem(ISSUES_STORAGE_KEY)
      if (stored) {
        this.issues = JSON.parse(stored)
      } else {
        this.issues = [...INITIAL_ISSUES]
        this.save()
      }
    } catch {
      this.issues = [...INITIAL_ISSUES]
    }
  }

  private save() {
    try {
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(this.issues))
      window.dispatchEvent(new CustomEvent('issues_updated'))
    } catch (e) {
      console.warn('Failed to persist issues to localStorage', e)
    }
  }

  getAllIssues(): IssueReport[] {
    return [...this.issues]
  }

  getOpenIssuesCount(): number {
    return this.issues.filter((i) => i.status === 'open').length
  }

  getIssueById(id: string): IssueReport | undefined {
    return this.issues.find((i) => i.id === id)
  }

  submitIssue(issueData: Omit<IssueReport, 'id' | 'createdAt' | 'status'>): IssueReport {
    const newIssue: IssueReport = {
      ...issueData,
      id: `iss-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    this.issues.unshift(newIssue)
    this.save()
    return newIssue
  }

  updateIssueStatus(
    id: string,
    status: IssueStatus,
    adminReply?: string,
    updatedCodeSnippet?: string,
    instructorName?: string
  ): IssueReport | undefined {
    const idx = this.issues.findIndex((i) => i.id === id)
    if (idx === -1) return undefined

    const isReplying = adminReply !== undefined && adminReply.trim().length > 0
    const author = instructorName || 'Course Mentor / Lead Instructor'

    let updatedMessages = this.issues[idx].messages
    if (isReplying) {
      const replyMsg: IssueMessage = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderRole: 'mentor',
        senderName: author,
        message: adminReply!.trim(),
        codeSnippet: updatedCodeSnippet,
        createdAt: new Date().toISOString(),
      }
      updatedMessages = [...(updatedMessages || []), replyMsg]
    }

    this.issues[idx] = {
      ...this.issues[idx],
      status,
      adminReply: adminReply !== undefined ? adminReply : this.issues[idx].adminReply,
      updatedCodeSnippet: updatedCodeSnippet !== undefined ? updatedCodeSnippet : this.issues[idx].updatedCodeSnippet,
      instructorName: author,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
      messages: updatedMessages,
    }
    this.save()

    // Cross-sync: Notify and log to Admin Operations Audit Trail
    try {
      if (adminAnalyticsService && typeof adminAnalyticsService.logAction === 'function') {
        adminAnalyticsService.logAction({
          actorName: author,
          actorRole: 'mentor',
          action: isReplying ? 'MENTOR_REPLIED_TO_INQUIRY' : 'MENTOR_UPDATED_TICKET_STAGE',
          category: 'support',
          target: `#${id} (${this.issues[idx].userName} - ${this.issues[idx].subject})`,
          details: isReplying
            ? `Delivered instructor solution note & resolution to student ${this.issues[idx].userName}. Stage: ${status.toUpperCase()}`
            : `Updated ticket stage to [${status.toUpperCase()}] for ${this.issues[idx].userName}.`,
          status: status === 'resolved' ? 'success' : 'info',
          ipAddress: '127.0.0.1',
          userAgent: 'CodeTutor Mentor Desk',
        })
      }
    } catch {
      // safe fallback if dynamic log happens during initialization
    }

    return this.issues[idx]
  }

  addMessage(
    id: string,
    messageData: Omit<IssueMessage, 'id' | 'createdAt'>
  ): IssueReport | undefined {
    const idx = this.issues.findIndex((i) => i.id === id)
    if (idx === -1) return undefined

    const newMsg: IssueMessage = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    }

    const currentMessages = this.issues[idx].messages || []

    // Reopen/move to in_review if learner is following up on a closed/resolved ticket
    const newStatus: IssueStatus =
      messageData.senderRole === 'learner' &&
      (this.issues[idx].status === 'resolved' || this.issues[idx].status === 'closed')
        ? 'in_review'
        : this.issues[idx].status

    this.issues[idx] = {
      ...this.issues[idx],
      status: newStatus,
      messages: [...currentMessages, newMsg],
    }
    this.save()

    // Cross-sync: Notify and log to Admin Operations Audit Trail
    try {
      if (adminAnalyticsService && typeof adminAnalyticsService.logAction === 'function') {
        adminAnalyticsService.logAction({
          actorName: messageData.senderName,
          actorRole: messageData.senderRole,
          action: 'STUDENT_REPLIED_TO_SUPPORT_TICKET',
          category: 'support',
          target: `#${id} (${this.issues[idx].subject})`,
          details: `${messageData.senderName} (${messageData.senderRole}) posted a follow-up reply: "${messageData.message.slice(0, 70)}..."`,
          status: 'info',
          ipAddress: '127.0.0.1',
          userAgent: 'CodeTutor Desk',
        })
      }
    } catch {
      // safe fallback
    }

    return this.issues[idx]
  }

  deleteIssue(id: string): boolean {
    const initialLen = this.issues.length
    this.issues = this.issues.filter((i) => i.id !== id)
    if (this.issues.length !== initialLen) {
      this.save()
      return true
    }
    return false
  }
}

export const issueSupportService = new IssueSupportService()
