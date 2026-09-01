import React, { useState, useMemo, useEffect } from 'react'
import {
  AdminUserRecord,
  AuditLogEntry,
  UserStatsSummary,
  ContactInquiry,
} from '@/types/admin-analytics'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { courseStoreService } from '@/services/learning/course-store.service'
import { mentorApplicationService, MentorApplication } from '@/services/mentor/mentor-application.service'
import { WEST_AFRICAN_COUNTRIES } from '@/features/leaderboard/data/mockLeaderboardData'
import { Card, CardHeader, CardContent, Button, Modal } from '@/components/ui'
import { DemoteMentorModal } from './DemoteMentorModal'
import { ApproveMentorModal, ApproveMentorTarget } from './ApproveMentorModal'
import {
  Users,
  User,
  AlertCircle,
  Search,
  Flame,
  Globe,
  Zap,
  CheckCircle2,
  Laptop,
  Cpu,
  HardDrive,
  Database,
  Code2,
  UserCheck,
  Terminal,
  Bot,
  BookOpen,
  Gamepad2,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Mail,
  MessageSquare,
  AlertTriangle,
  X,
} from 'lucide-react'

function getHumanRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 45) return 'Just now'
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`
    if (diffSec < 172800) return 'Yesterday'
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'Recently'
  }
}

function getHumanActionTitle(log: AuditLogEntry): { verb: string; highlightTarget: string; categoryLabel: string } {
  switch (log.action) {
    case 'ACCOUNT_CREATED':
      return { verb: 'registered new learner account', highlightTarget: log.target, categoryLabel: 'Account Registration' }
    case 'USER_LOGIN':
      return { verb: 'logged in to platform', highlightTarget: log.target, categoryLabel: 'User Authentication' }
    case 'USER_LOGOUT':
      return { verb: 'signed out securely', highlightTarget: log.target, categoryLabel: 'Session End' }
    case 'PASSWORD_RESET':
      return { verb: 'requested password recovery', highlightTarget: log.target, categoryLabel: 'Security Recovery' }
    case 'SESSION_EXPIRED':
      return { verb: 'session timed out (cached local)', highlightTarget: log.target, categoryLabel: 'Session Management' }
    case 'COURSE_UPDATED':
      return { verb: 'updated course curriculum', highlightTarget: log.target, categoryLabel: 'Course Curriculum' }
    case 'COURSE_SAVED':
      return { verb: 'saved and published course', highlightTarget: log.target, categoryLabel: 'Course Curriculum' }
    case 'COURSE_DELETED':
      return { verb: 'removed course', highlightTarget: log.target, categoryLabel: 'Curriculum Management' }
    case 'PRACTICE_SUBMITTED':
      return { verb: 'solved practice challenge', highlightTarget: log.target, categoryLabel: 'Practice Drill' }
    case 'PRACTICE_CHALLENGE_CREATED':
      return { verb: 'created new challenge', highlightTarget: log.target, categoryLabel: 'Practice Studio' }
    case 'TUTOR_SESSION_CREATED':
      return { verb: 'started AI Tutor dialogue on', highlightTarget: log.target, categoryLabel: 'AI Tutor Workspace' }
    case 'GAME_ROUND_PLAYED':
      return { verb: 'completed game round on', highlightTarget: log.target, categoryLabel: 'Coding Arcade' }
    case 'LESSON_COMPLETED':
      return { verb: 'completed lesson in', highlightTarget: log.target, categoryLabel: 'Offline Learning Track' }
    case 'OFFLINE_CACHE_VERIFIED':
      return { verb: 'verified offline cache for', highlightTarget: log.target, categoryLabel: 'Offline Sync System' }
    case 'SECURITY_AUDIT_PASSED':
      return { verb: 'verified security sandbox for', highlightTarget: log.target, categoryLabel: 'Sandbox Security' }
    case 'USER_RE_ENGAGED':
      return { verb: 'reactivated learner status for', highlightTarget: log.target, categoryLabel: 'User Management' }
    case 'USER_FLAGGED_IDLE':
      return { verb: 'flagged learner as idle', highlightTarget: log.target, categoryLabel: 'User Management' }
    case 'CONTACT_INQUIRY_RECEIVED':
      return { verb: 'sent a contact message to support desk', highlightTarget: log.target, categoryLabel: 'Help Desk' }
    default:
      return { verb: 'performed activity on', highlightTarget: log.target, categoryLabel: log.category }
  }
}

interface UserAnalyticsDeskViewProps {
  users: AdminUserRecord[]
  auditLogs: AuditLogEntry[]
  onDataChanged: () => void
  restrictedMentorUser?: AdminUserRecord | null
}

export const UserAnalyticsDeskView: React.FC<UserAnalyticsDeskViewProps> = ({
  users,
  auditLogs,
  onDataChanged,
  restrictedMentorUser = null,
}) => {
  const [subView, setSubView] = useState<'users' | 'audit' | 'regional' | 'mentors' | 'inquiries'>('users')
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'instructor' | 'learner'>('ALL')
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL')
  const [userSortBy, setUserSortBy] = useState<'default' | 'course' | 'xp' | 'streak' | 'lessons' | 'name' | 'recent'>('default')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedLogStatus, setSelectedLogStatus] = useState<string>('ALL')
  const [logSortBy, setLogSortBy] = useState<'newest' | 'oldest' | 'actor' | 'category'>('newest')

  // Mentor Operations & Applications State
  const [mentorApps, setMentorApps] = useState<MentorApplication[]>(() => mentorApplicationService.getAllApplications())
  const [selectedAppStatus, setSelectedAppStatus] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL')
  const [mentorRosterSubTab, setMentorRosterSubTab] = useState<'roster' | 'applications'>('roster')
  const [mentorActivityFilter, setMentorActivityFilter] = useState<'ALL' | 'active' | 'inactive'>('ALL')
  const [mentorToDemote, setMentorToDemote] = useState<AdminUserRecord | null>(null)
  const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false)
  const [approveModalTarget, setApproveModalTarget] = useState<ApproveMentorTarget | null>(null)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [collapsedMentorCardIds, setCollapsedMentorCardIds] = useState<Record<string, boolean>>({})

  const toggleMentorCardCollapse = (mentorId: string) => {
    setCollapsedMentorCardIds((prev) => ({
      ...prev,
      [mentorId]: !prev[mentorId],
    }))
  }

  const handleCollapseAllMentors = () => {
    const map: Record<string, boolean> = {}
    mentorUsers.forEach((m) => {
      map[m.id] = true
    })
    setCollapsedMentorCardIds(map)
  }

  const handleExpandAllMentors = () => {
    setCollapsedMentorCardIds({})
  }

  // Contact Inquiries State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => adminAnalyticsService.getContactInquiries())
  const [selectedInquiryCategory, setSelectedInquiryCategory] = useState<string>('ALL')
  const [selectedInquiryStatus, setSelectedInquiryStatus] = useState<string>('ALL')
  const [inquirySearchQuery, setInquirySearchQuery] = useState('')

  useEffect(() => {
    const handleUpdate = () => {
      setMentorApps(mentorApplicationService.getAllApplications())
    }
    window.addEventListener('mentor_applications_updated', handleUpdate)

    const handleInquiriesUpdate = (e: any) => {
      if (e.detail) {
        setInquiries([...e.detail])
      } else {
        setInquiries(adminAnalyticsService.getContactInquiries())
      }
    }
    window.addEventListener('admin_inquiries_updated', handleInquiriesUpdate)

    return () => {
      window.removeEventListener('mentor_applications_updated', handleUpdate)
      window.removeEventListener('admin_inquiries_updated', handleInquiriesUpdate)
    }
  }, [])

  const unreadInquiriesCount = useMemo(() => {
    return inquiries.filter((i) => i.status === 'new').length
  }, [inquiries])

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const q = inquirySearchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        inq.fullName.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q) ||
        inq.country.toLowerCase().includes(q)

      const matchesCategory =
        selectedInquiryCategory === 'ALL' || inq.inquiryType === selectedInquiryCategory

      const matchesStatus =
        selectedInquiryStatus === 'ALL' || inq.status === selectedInquiryStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [inquiries, inquirySearchQuery, selectedInquiryCategory, selectedInquiryStatus])

  const handleUpdateInquiryStatus = (id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    adminAnalyticsService.updateInquiryStatus(id, newStatus)
    setInquiries(adminAnalyticsService.getContactInquiries())
    onDataChanged()
    setActionSuccessMsg(`Inquiry updated to [${newStatus.toUpperCase()}].`)
    setTimeout(() => setActionSuccessMsg(null), 3000)
  }

  const handleDeleteInquiry = (id: string) => {
    adminAnalyticsService.deleteContactInquiry(id)
    setInquiries(adminAnalyticsService.getContactInquiries())
    onDataChanged()
    setActionSuccessMsg(`Inquiry deleted from support desk.`)
    setTimeout(() => setActionSuccessMsg(null), 3000)
  }

  const mentorCoursesForRestricted = useMemo(() => {
    if (restrictedMentorUser) {
      return courseStoreService.getCoursesByMentor(
        restrictedMentorUser.id,
        restrictedMentorUser.enrolledCourseIds,
        restrictedMentorUser.favoriteLanguage
      )
    }
    return []
  }, [restrictedMentorUser])

  const effectiveUsers = useMemo(() => {
    if (restrictedMentorUser) {
      return adminAnalyticsService.getLearnersForMentor(restrictedMentorUser, mentorCoursesForRestricted)
    }
    return users
  }, [users, restrictedMentorUser, mentorCoursesForRestricted])

  const mentorUsers = useMemo(() => {
    return users.filter((u) => u.role === 'instructor')
  }, [users])

  const activeMentorCount = useMemo(() => {
    return mentorUsers.filter(
      (m) => m.status === 'active_now' || m.status === 'active_today' || m.status === 'active_this_week'
    ).length
  }, [mentorUsers])

  const inactiveMentorCount = useMemo(() => {
    return mentorUsers.filter((m) => m.status === 'idle' || m.status === 'inactive').length
  }, [mentorUsers])

  const pendingMentorCount = useMemo(() => {
    return mentorApps.filter((a) => a.status === 'pending').length
  }, [mentorApps])

  const courses = useMemo(() => {
    return courseStoreService.getAllCourses()
  }, [])
  
  // Date & Time Range States
  const [dateRangePreset, setDateRangePreset] = useState<string>('ALL')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Export Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')
  const [exportModalStartDate, setExportModalStartDate] = useState<string>('')
  const [exportModalEndDate, setExportModalEndDate] = useState<string>('')
  const [exportModalCategory, setExportModalCategory] = useState<string>('ALL')

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null)

  const stats: UserStatsSummary = useMemo(() => {
    return adminAnalyticsService.getUserStats()
  }, [users])

  const handleDatePresetChange = (preset: string) => {
    setDateRangePreset(preset)
    const now = new Date()
    if (preset === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      setStartDate(start.toISOString().slice(0, 16))
      setEndDate(now.toISOString().slice(0, 16))
    } else if (preset === '24h') {
      const start = new Date(now.getTime() - 24 * 3600 * 1000)
      setStartDate(start.toISOString().slice(0, 16))
      setEndDate(now.toISOString().slice(0, 16))
    } else if (preset === '7d') {
      const start = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
      setStartDate(start.toISOString().slice(0, 16))
      setEndDate(now.toISOString().slice(0, 16))
    } else if (preset === '30d') {
      const start = new Date(now.getTime() - 30 * 24 * 3600 * 1000)
      setStartDate(start.toISOString().slice(0, 16))
      setEndDate(now.toISOString().slice(0, 16))
    } else if (preset === 'ALL') {
      setStartDate('')
      setEndDate('')
    }
  }

  const handleExportModalPresetChange = (preset: string) => {
    const now = new Date()
    if (preset === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      setExportModalStartDate(start.toISOString().slice(0, 16))
      setExportModalEndDate(now.toISOString().slice(0, 16))
    } else if (preset === '24h') {
      const start = new Date(now.getTime() - 24 * 3600 * 1000)
      setExportModalStartDate(start.toISOString().slice(0, 16))
      setExportModalEndDate(now.toISOString().slice(0, 16))
    } else if (preset === '7d') {
      const start = new Date(now.getTime() - 7 * 24 * 3600 * 1000)
      setExportModalStartDate(start.toISOString().slice(0, 16))
      setExportModalEndDate(now.toISOString().slice(0, 16))
    } else if (preset === '30d') {
      const start = new Date(now.getTime() - 30 * 24 * 3600 * 1000)
      setExportModalStartDate(start.toISOString().slice(0, 16))
      setExportModalEndDate(now.toISOString().slice(0, 16))
    } else if (preset === 'ALL') {
      setExportModalStartDate('')
      setExportModalEndDate('')
    }
  }

  const filteredUsers = useMemo(() => {
    const list = effectiveUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.activeCourseTitle && u.activeCourseTitle.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCountry = selectedCountry === 'ALL' || u.countryCode === selectedCountry

      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'active' &&
          (u.status === 'active_now' || u.status === 'active_today' || u.status === 'active_this_week')) ||
        (selectedStatus === 'inactive' && (u.status === 'idle' || u.status === 'inactive')) ||
        u.status === selectedStatus

      // Enrolled course matching
      const matchesCourse =
        selectedCourse === 'ALL' ||
        u.activeCourseTitle === selectedCourse ||
        u.enrolledCourseTitles?.includes(selectedCourse) ||
        u.enrolledCourseTitles?.some((t) => t.toLowerCase() === selectedCourse.toLowerCase()) ||
        (u.favoriteLanguage && selectedCourse.toLowerCase().includes(u.favoriteLanguage.toLowerCase())) ||
        (u.activeCourseTitle && u.activeCourseTitle.toLowerCase().includes(selectedCourse.toLowerCase())) ||
        (u.enrolledCourseTitles?.some((t) => t.toLowerCase().includes(selectedCourse.toLowerCase())))

      const matchesRole = selectedRole === 'ALL' || u.role === selectedRole

      return matchesSearch && matchesCountry && matchesStatus && matchesCourse && matchesRole
    })

    return [...list].sort((a, b) => {
      if (userSortBy === 'course') {
        const courseA = a.activeCourseTitle || a.enrolledCourseTitles?.[0] || ''
        const courseB = b.activeCourseTitle || b.enrolledCourseTitles?.[0] || ''
        return courseA.localeCompare(courseB)
      }
      if (userSortBy === 'xp') {
        return b.totalXp - a.totalXp
      }
      if (userSortBy === 'streak') {
        return b.streakDays - a.streakDays
      }
      if (userSortBy === 'lessons') {
        return b.lessonsCompleted - a.lessonsCompleted
      }
      if (userSortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (userSortBy === 'recent') {
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      }
      return 0
    })
  }, [users, searchQuery, selectedCountry, selectedStatus, selectedRole, selectedCourse, userSortBy])

  const filteredMentors = useMemo(() => {
    return mentorUsers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.activeCourseTitle && m.activeCourseTitle.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCountry = selectedCountry === 'ALL' || m.countryCode === selectedCountry

      const isLiveActive =
        m.status === 'active_now' || m.status === 'active_today' || m.status === 'active_this_week'

      if (mentorActivityFilter === 'active' && !isLiveActive) return false
      if (mentorActivityFilter === 'inactive' && isLiveActive) return false

      return matchesSearch && matchesCountry
    })
  }, [mentorUsers, searchQuery, selectedCountry, mentorActivityFilter])

  const filteredLogs = useMemo(() => {
    const list = auditLogs.filter((log) => {
      const matchesSearch =
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory
      const matchesStatus = selectedLogStatus === 'ALL' || log.status === selectedLogStatus

      // Date Range filter
      const logTime = new Date(log.timestamp).getTime()
      if (startDate) {
        const start = new Date(startDate).getTime()
        if (logTime < start) return false
      }
      if (endDate) {
        const end = new Date(endDate).getTime()
        if (logTime > end) return false
      }

      return matchesSearch && matchesCategory && matchesStatus
    })

    return list.sort((a, b) => {
      if (logSortBy === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      if (logSortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      if (logSortBy === 'actor') return a.actorName.localeCompare(b.actorName)
      if (logSortBy === 'category') return a.category.localeCompare(b.category)
      return 0
    })
  }, [auditLogs, searchQuery, selectedCategory, selectedLogStatus, logSortBy, startDate, endDate])

  // Custom modal matching entries
  const exportModalMatchingLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime()
      if (exportModalStartDate) {
        const start = new Date(exportModalStartDate).getTime()
        if (logTime < start) return false
      }
      if (exportModalEndDate) {
        const end = new Date(exportModalEndDate).getTime()
        if (logTime > end) return false
      }
      if (exportModalCategory !== 'ALL' && log.category !== exportModalCategory) {
        return false
      }
      return true
    })
  }, [auditLogs, exportModalStartDate, exportModalEndDate, exportModalCategory])

  const filteredMentorApps = useMemo(() => {
    return mentorApps.filter((app) => {
      const matchesSearch =
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.institutionOrCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.programmingTracks.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = selectedAppStatus === 'ALL' || app.status === selectedAppStatus
      return matchesSearch && matchesStatus
    })
  }, [mentorApps, searchQuery, selectedAppStatus])

  const handleOpenDemoteModal = (mentor: AdminUserRecord) => {
    setMentorToDemote(mentor)
    setIsDemoteModalOpen(true)
  }

  const handleConfirmDemoteMentor = (userId: string, reason: string) => {
    const demoted = adminAnalyticsService.demoteMentorToLearner(userId, reason)
    if (demoted) {
      mentorApplicationService.revokeOrDemoteApplication(demoted.email)
      onDataChanged()
      setActionSuccessMsg(
        `Successfully demoted ${demoted.name} to Standard Learner. Mentor Hub authoring access revoked.`
      )
      setTimeout(() => setActionSuccessMsg(null), 4500)
    }
  }

  const handleDemoteToLearner = (userId: string, userName: string) => {
    const user = users.find((u) => u.id === userId)
    if (user && user.role === 'instructor') {
      handleOpenDemoteModal(user)
    } else {
      const updated = adminAnalyticsService.setUserRole(userId, 'learner')
      if (updated) {
        onDataChanged()
        setActionSuccessMsg(`Reset ${userName} role to Standard Learner.`)
        setTimeout(() => setActionSuccessMsg(null), 3500)
      }
    }
  }

  const handleOpenApproveModalForApp = (app: MentorApplication) => {
    setApproveModalTarget({
      id: app.id,
      fullName: app.fullName,
      email: app.email,
      country: app.country,
      countryCode: app.countryCode,
      institutionOrCompany: app.institutionOrCompany,
      programmingTracks: app.programmingTracks,
      yearsOfExperience: app.yearsOfExperience,
      bio: app.bio,
      githubUrl: app.githubUrl,
      linkedinUrl: app.linkedinUrl,
      portfolioUrl: app.portfolioUrl,
      isDirectUserPromotion: false,
    })
    setIsApproveModalOpen(true)
  }

  const handleOpenApproveModalForUser = (user: AdminUserRecord) => {
    setApproveModalTarget({
      id: user.id,
      fullName: user.name,
      email: user.email,
      country: user.countryName,
      countryCode: user.countryCode,
      institutionOrCompany: 'CodeTutor Community Student',
      programmingTracks: user.enrolledCourseTitles
        ? user.enrolledCourseTitles.map((t) => t.replace('Learn to code with ', ''))
        : [user.favoriteLanguage.toUpperCase()],
      yearsOfExperience: `${user.streakDays} day streak • ${user.problemsSolved} drills completed`,
      bio: `Top-performing community learner with ${user.totalXp.toLocaleString()} XP. Recommended for direct educator verification.`,
      githubUrl: `https://github.com/${user.username}`,
      isDirectUserPromotion: true,
    })
    setIsApproveModalOpen(true)
  }

  const handleConfirmApproveMentor = (
    targetId: string,
    applicantName: string,
    _assignedTrack?: string,
    _adminNote?: string
  ) => {
    if (targetId.startsWith('app-mentor-')) {
      const updated = mentorApplicationService.approveApplication(targetId, 'Lead Curriculum Director (Admin)')
      if (updated) {
        setMentorApps(mentorApplicationService.getAllApplications())
        onDataChanged()
        setActionSuccessMsg(`Verified and appointed ${applicantName} as an Official Course Mentor.`)
        setTimeout(() => setActionSuccessMsg(null), 4500)
      }
    } else {
      const updated = adminAnalyticsService.setUserRole(targetId, 'instructor')
      if (updated) {
        onDataChanged()
        setActionSuccessMsg(`Promoted ${applicantName} to Verified Course Mentor.`)
        setTimeout(() => setActionSuccessMsg(null), 4500)
      }
    }
  }

  const handleToggleMentorRole = (user: AdminUserRecord) => {
    if (user.role === 'instructor') {
      handleOpenDemoteModal(user)
      return
    }
    handleOpenApproveModalForUser(user)
  }

  const handleApproveMentorApp = (appId: string, applicantName: string) => {
    const app = mentorApps.find((a) => a.id === appId)
    if (app) {
      handleOpenApproveModalForApp(app)
    } else {
      const updated = mentorApplicationService.approveApplication(appId)
      if (updated) {
        setMentorApps(mentorApplicationService.getAllApplications())
        onDataChanged()
        setActionSuccessMsg(`Approved mentor application for ${applicantName}. Appointed as verified educator.`)
        setTimeout(() => setActionSuccessMsg(null), 3500)
      }
    }
  }

  const handleRejectMentorApp = (appId: string, applicantName: string) => {
    const updated = mentorApplicationService.rejectApplication(appId)
    if (updated) {
      setMentorApps(mentorApplicationService.getAllApplications())
      setActionSuccessMsg(`Declined mentor application for ${applicantName}.`)
      setTimeout(() => setActionSuccessMsg(null), 3500)
    }
  }

  const handleExportCsv = (logsToExport = filteredLogs) => {
    const csv = adminAnalyticsService.exportAuditLogsAsCsv(logsToExport)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const dateTag = startDate || endDate ? `${startDate.slice(0,10)}_to_${endDate.slice(0,10)}` : new Date().toISOString().slice(0, 10)
    link.setAttribute('download', `codetutor_audit_logs_${dateTag}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setActionSuccessMsg(`Exported ${logsToExport.length} logs as CSV.`)
    setTimeout(() => setActionSuccessMsg(null), 3500)
  }

  const handleExportJson = (logsToExport = filteredLogs) => {
    const json = adminAnalyticsService.exportAuditLogsAsJson(logsToExport)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const dateTag = startDate || endDate ? `${startDate.slice(0,10)}_to_${endDate.slice(0,10)}` : new Date().toISOString().slice(0, 10)
    link.setAttribute('download', `codetutor_audit_logs_${dateTag}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setActionSuccessMsg(`Exported ${logsToExport.length} logs as JSON.`)
    setTimeout(() => setActionSuccessMsg(null), 3500)
  }

  const handleExecuteModalExport = () => {
    if (exportFormat === 'csv') {
      handleExportCsv(exportModalMatchingLogs)
    } else {
      handleExportJson(exportModalMatchingLogs)
    }
    setIsExportModalOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active_now':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-3xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            Active Now
          </span>
        )
      case 'active_today':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/50 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shadow-3xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Active Today
          </span>
        )
      case 'active_this_week':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 shadow-3xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
            Active this Week
          </span>
        )
      case 'idle':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-3xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            Idle (&gt;7d)
          </span>
        )
      case 'inactive':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-3xs whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            Inactive (&gt;30d)
          </span>
        )
    }
  }



  const getDeviceIcon = (mode: string) => {
    switch (mode) {
      case 'offline_pwa':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
            <Cpu className="w-3 h-3 text-emerald-600" />
            <span>Offline PWA</span>
          </span>
        )
      case 'desktop_app':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-brand-700 dark:text-brand-400">
            <Laptop className="w-3 h-3 text-brand-600" />
            <span>Desktop App</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-400">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>Web Browser</span>
          </span>
        )
    }
  }

  return (
    <div className="space-y-4 w-full min-w-0 max-w-full">
      {/* Action Toast Feedback */}
      {actionSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ANALYTICS KPI HIGHLIGHT ROW
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Users */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Total Learners
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {stats.totalUsers}
            </span>
            <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            {stats.offlinePwaUsersPercent}% Offline Engine ready
          </span>
        </div>

        {/* Active Now & Today */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Active Now / Today
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#005F02] dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats.activeNow}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/ {stats.activeToday}</span>
            </span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            {stats.activeThisWeek} active this week
          </span>
        </div>

        {/* Inactive / At Risk Users */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Idle / Inactive Learners
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-xl sm:text-2xl font-bold font-mono ${stats.inactiveUsers > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {stats.inactiveUsers}
            </span>
            <User className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            Requires study catch-up
          </span>
        </div>

        {/* Audit Trails Count */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-wider">
            Audit Trails Logged
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold font-mono text-brand-600 dark:text-brand-400">
              {auditLogs.length}
            </span>
            <HardDrive className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
            100% Immutable logs
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUB-VIEW CONTROLS & ACTIONS
          ═══════════════════════════════════════════════════════════════ */}
      <Card className="border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 space-y-3.5">
          {/* Row 1: Sub-tabs Navigation Bar & Contextual Actions */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
            {/* Sub-tabs pills - horizontally scrollable with sleek modern pill styling */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto scrollbar-none w-full xl:w-auto">
              <button
                type="button"
                onClick={() => setSubView('users')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  subView === 'users'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>Learner Management</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {users.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubView('audit')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  subView === 'audit'
                    ? 'bg-white dark:bg-slate-900 text-[#005F02] dark:text-emerald-400 shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Audit Logs &amp; Security</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {auditLogs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubView('regional')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  subView === 'regional'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>West Africa Regions</span>
              </button>

              <button
                type="button"
                onClick={() => setSubView('mentors')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  subView === 'mentors'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>Mentor Desk &amp; Apps</span>
                {pendingMentorCount > 0 ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold animate-pulse">
                    {pendingMentorCount} New
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {mentorApps.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSubView('inquiries')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  subView === 'inquiries'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Inquiries &amp; Help Desk</span>
                {unreadInquiriesCount > 0 ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold animate-pulse">
                    {unreadInquiriesCount} New
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {inquiries.length}
                  </span>
                )}
              </button>
            </div>

            {/* Contextual Actions Toolbar for current view */}
            {subView === 'audit' && (
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportCsv(filteredLogs)}
                  className="h-8 px-3 text-xs font-bold border-slate-200 dark:border-slate-700 justify-center whitespace-nowrap"
                  leftIcon={<Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                >
                  Export CSV ({filteredLogs.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportJson(filteredLogs)}
                  className="h-8 px-3 text-xs font-bold border-slate-200 dark:border-slate-700 justify-center whitespace-nowrap"
                  leftIcon={<Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                >
                  Export JSON ({filteredLogs.length})
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setExportModalStartDate(startDate)
                    setExportModalEndDate(endDate)
                    setExportModalCategory(selectedCategory)
                    setIsExportModalOpen(true)
                  }}
                  className="h-8 px-3.5 text-xs font-bold justify-center shadow-xs whitespace-nowrap bg-brand-600 hover:bg-brand-700 text-white"
                  leftIcon={<Clock className="w-3.5 h-3.5" />}
                >
                  Export with Date Range
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-3">
            {subView === 'users' && (
              <>
                {/* Search Input */}
                <div className="sm:col-span-3 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, email, track..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* Role Selector */}
                <div className="sm:col-span-2 relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full py-2 pl-3.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Roles ({users.length})</option>
                    <option value="instructor">Mentors ({mentorUsers.length})</option>
                    <option value="learner">Learners ({users.filter((u) => u.role === 'learner').length})</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Enrolled Course Track Selector */}
                <div className="sm:col-span-3 relative">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full py-2 pl-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Enrolled Courses ({users.length})</option>
                    {courses.map((c) => {
                      const count = users.filter(
                        (u) =>
                          u.activeCourseTitle === c.title ||
                          u.enrolledCourseTitles?.includes(c.title) ||
                          (u.favoriteLanguage && c.language && u.favoriteLanguage.toLowerCase() === c.language.toLowerCase()) ||
                          u.enrolledCourseTitles?.some(t => t.toLowerCase().includes(c.language.toLowerCase()))
                      ).length
                      return (
                        <option key={c.id} value={c.title}>
                          {c.title} ({count || (c.enrolledCount || 420)})
                        </option>
                      )
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Country Filter */}
                <div className="sm:col-span-2 relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full py-2 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    {WEST_AFRICAN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Sort By Dropdown */}
                <div className="sm:col-span-1 relative">
                  <select
                    value={userSortBy}
                    onChange={(e) => setUserSortBy(e.target.value as any)}
                    className="w-full py-2 pl-2 pr-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="default">Sort</option>
                    <option value="recent">Recent</option>
                    <option value="xp">Highest XP</option>
                    <option value="streak">Streak</option>
                    <option value="lessons">Lessons</option>
                    <option value="name">Name</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Activity Status Filter */}
                <div className="sm:col-span-1 relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full py-2 pl-2 pr-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Status</option>
                    <option value="active">Active</option>
                    <option value="active_now">Now</option>
                    <option value="active_today">Today</option>
                    <option value="active_this_week">Week</option>
                    <option value="inactive">Idle</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </>
            )}

            {subView === 'audit' && (
              <>
                <div className="sm:col-span-4 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by actor, action, target..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="sm:col-span-3 relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-2 pl-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Activities ({auditLogs.length})</option>
                    <option value="auth">Account & Auth (Login, Logout, Signup)</option>
                    <option value="learning">Lesson Activity</option>
                    <option value="practice">Practice Submissions</option>
                    <option value="tutor">AI Tutor Dialogues</option>
                    <option value="arcade">Arcade Games</option>
                    <option value="curriculum">Curriculum Changes</option>
                    <option value="security">Security Sandboxes</option>
                    <option value="system">System & Offline Sync</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="sm:col-span-3 relative">
                  <select
                    value={logSortBy}
                    onChange={(e) => setLogSortBy(e.target.value as any)}
                    className="w-full py-2 pl-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="actor">Sort: Actor Name (A-Z)</option>
                    <option value="category">Sort: By Category</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="sm:col-span-2 relative">
                  <select
                    value={selectedLogStatus}
                    onChange={(e) => setSelectedLogStatus(e.target.value)}
                    className="w-full py-2 pl-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Outcomes</option>
                    <option value="success">Success Only</option>
                    <option value="info">Info / Notice</option>
                    <option value="warning">Warnings</option>
                    <option value="error">Errors</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Date & Time Range Secondary Filter Toolbar */}
                <div className="sm:col-span-12 flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Date Range:
                    </span>
                    {['ALL', 'today', '24h', '7d', '30d'].map((preset) => {
                      const labelMap: Record<string, string> = {
                        ALL: 'All Time',
                        today: 'Today',
                        '24h': 'Past 24h',
                        '7d': 'Past 7 Days',
                        '30d': 'Past 30 Days',
                      }
                      const active = dateRangePreset === preset
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleDatePresetChange(preset)}
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            active
                              ? 'bg-brand-500 text-white shadow-3xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {labelMap[preset]}
                        </button>
                      )
                    })}
                  </div>

                  {/* Inline Date & Time Inputs */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        From:
                      </span>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value)
                          setDateRangePreset('custom')
                        }}
                        className="text-xs font-mono font-medium bg-transparent text-slate-900 dark:text-white dark:[color-scheme:dark] [color-scheme:light] focus:outline-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        To:
                      </span>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value)
                          setDateRangePreset('custom')
                        }}
                        className="text-xs font-mono font-medium bg-transparent text-slate-900 dark:text-white dark:[color-scheme:dark] [color-scheme:light] focus:outline-none cursor-pointer"
                      />
                    </div>

                    {(startDate || endDate) && (
                      <button
                        type="button"
                        onClick={() => handleDatePresetChange('ALL')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Clear date filter"
                      >
                        <X className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {subView === 'inquiries' && (
              <>
                {/* Inquiry Search */}
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search sender, email, subject, or message content..."
                    value={inquirySearchQuery}
                    onChange={(e) => setInquirySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="sm:col-span-4 relative">
                  <select
                    value={selectedInquiryCategory}
                    onChange={(e) => setSelectedInquiryCategory(e.target.value)}
                    className="w-full py-2 pl-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Categories ({inquiries.length})</option>
                    <option value="general">General Inquiries &amp; Feedback</option>
                    <option value="partnership">University / Institutional Partnerships</option>
                    <option value="mentor">Mentor &amp; Educator Network</option>
                    <option value="technical">Offline Engine &amp; Technical Help</option>
                    <option value="classroom">Coding Club &amp; Lab Deployment</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="sm:col-span-3 relative">
                  <select
                    value={selectedInquiryStatus}
                    onChange={(e) => setSelectedInquiryStatus(e.target.value)}
                    className="w-full py-2 pl-3.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                  >
                    <option value="ALL">All Statuses ({inquiries.length})</option>
                    <option value="new">New / Unread ({inquiries.filter((i) => i.status === 'new').length})</option>
                    <option value="read">Read ({inquiries.filter((i) => i.status === 'read').length})</option>
                    <option value="replied">Replied ({inquiries.filter((i) => i.status === 'replied').length})</option>
                    <option value="archived">Archived ({inquiries.filter((i) => i.status === 'archived').length})</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 1: USERS & LEARNER MANAGEMENT TABLE
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                    <th className="py-3 pl-4 pr-1 w-10 text-center font-semibold">#</th>
                    <th className="py-3 px-4 font-semibold min-w-[200px]">Learner Profile</th>
                    <th className="py-3 px-4 font-semibold min-w-[130px]">Nation / Region</th>
                    <th className="py-3 px-4 font-semibold min-w-[150px] whitespace-nowrap">Activity Status</th>
                    <th className="py-3 px-4 font-semibold min-w-[120px] whitespace-nowrap">XP &amp; Streak</th>
                    <th className="py-3 px-4 font-semibold min-w-[140px] whitespace-nowrap">Progress Metrics</th>
                    <th className="py-3 px-4 font-semibold min-w-[120px] whitespace-nowrap">Client Engine</th>
                    <th className="py-3 px-4 font-semibold text-right min-w-[145px] whitespace-nowrap">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                        No learners matched your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-950/40 transition-colors"
                      >
                        {/* Number Index */}
                        <td className="py-3.5 pl-4 pr-1 text-center font-mono text-[11px] text-slate-400 font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </td>

                        {/* Learner Name & Role */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-3xs overflow-hidden">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                user.name.charAt(0)
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white truncate">
                                  {user.name}
                                </span>
                                {user.role === 'admin' && (
                                  <span className="px-1.5 py-0.2 rounded bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-mono text-[9px] font-bold border border-brand-200 dark:border-brand-800">
                                    ADMIN
                                  </span>
                                )}
                                {user.role === 'instructor' && (
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[9px] font-bold border border-indigo-200 dark:border-indigo-800">
                                    MENTOR
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                                {user.email}
                              </span>
                              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-mono text-[10px] font-bold whitespace-nowrap shadow-3xs">
                                  <BookOpen className="w-3 h-3 text-[#005F02] dark:text-emerald-400 shrink-0" />
                                  <span>{user.activeCourseTitle || user.enrolledCourseTitles?.[0] || 'General Track'}</span>
                                </span>
                                {user.enrolledCourseTitles && user.enrolledCourseTitles.length > 1 && (
                                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                    +{user.enrolledCourseTitles.length - 1} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Country */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] whitespace-nowrap">
                            <Globe className="w-2.5 h-2.5 text-brand-500 shrink-0" />
                            {user.countryName} ({user.countryCode})
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>

                        {/* XP & Streak */}
                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {user.totalXp.toLocaleString()} XP
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                              <Flame className="w-3 h-3 fill-current" />
                              {user.streakDays}d
                            </span>
                          </div>
                        </td>

                        {/* Progress Metrics */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {user.problemsSolved}
                            </span>{' '}
                            drills •{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {user.lessonsCompleted}
                            </span>{' '}
                            lessons
                          </div>
                        </td>

                        {/* Engine Mode */}
                        <td className="py-3.5 px-4 whitespace-nowrap">{getDeviceIcon(user.deviceMode)}</td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                            {user.role !== 'admin' && (
                              <>
                                {user.role === 'instructor' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDemoteToLearner(user.id, user.name)}
                                    className="h-8 px-3.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800 transition-all whitespace-nowrap inline-flex items-center gap-1.5 shadow-3xs hover:shadow-2xs cursor-pointer"
                                    title="Revoke mentor permissions and demote to learner"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                                    <span>Demote</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenApproveModalForUser(user)}
                                    className="h-8 px-3.5 rounded-xl text-xs font-bold text-white bg-[#005F02] hover:bg-[#004e02] shadow-xs hover:shadow-sm transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer"
                                    title="Grant Mentor Hub course authoring & student inquiry access"
                                  >
                                    <GraduationCap className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                                    <span>Make Mentor</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 2: HUMAN-CENTERED ACTIVITY & AUDIT LOGS
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'audit' && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No activity logs matched your filter.
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Try adjusting the category or search keywords above.
                  </p>
                </div>
              ) : (
                filteredLogs.map((log, index) => {
                  const isExpanded = expandedLogId === log.id
                  const relativeTime = getHumanRelativeTime(log.timestamp)
                  const fullTime = `${new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
                  const humanAction = getHumanActionTitle(log)
                  const logIndexNumber = String(index + 1).padStart(2, '0')

                  const getAvatarBg = () => {
                    if (log.category === 'auth') return 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                    if (log.category === 'curriculum') return 'bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800'
                    if (log.category === 'practice') return 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    if (log.category === 'tutor') return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    if (log.category === 'arcade') return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    if (log.category === 'security') return 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }

                  const getCategoryIcon = () => {
                    if (log.category === 'auth') return <UserCheck className="w-4 h-4" />
                    if (log.category === 'curriculum') return <BookOpen className="w-4 h-4" />
                    if (log.category === 'practice') return <Code2 className="w-4 h-4" />
                    if (log.category === 'tutor') return <Bot className="w-4 h-4" />
                    if (log.category === 'arcade') return <Gamepad2 className="w-4 h-4" />
                    if (log.category === 'security') return <ShieldCheck className="w-4 h-4" />
                    return <HardDrive className="w-4 h-4" />
                  }

                  return (
                    <div
                      key={log.id}
                      className="p-3.5 sm:p-4.5 hover:bg-slate-50/80 dark:hover:bg-slate-950/50 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Left Column: Number Index + Human Avatar / Action Icon + Activity Story */}
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Numerical Index Badge */}
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700/80 shadow-3xs">
                            {logIndexNumber}
                          </span>

                          <div className={`p-2.5 rounded-2xl border ${getAvatarBg()} shrink-0 shadow-3xs mt-0.5`}>
                            {getCategoryIcon()}
                          </div>

                          <div className="space-y-1 min-w-0">
                            {/* Human Story Headline */}
                            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {log.actorName}
                              </span>{' '}
                              <span className="text-slate-600 dark:text-slate-400">
                                {humanAction.verb}
                              </span>{' '}
                              <span className="font-semibold text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-200/80 dark:border-brand-800/80 inline-block font-sans text-xs">
                                {humanAction.highlightTarget}
                              </span>
                            </div>

                            {/* Human Explanation / Result Details */}
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {log.details}
                            </p>

                            {/* Human Meta Badges */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                                <Globe className="w-2.5 h-2.5 text-slate-400" />
                                <span>{log.ipAddress}</span>
                              </span>

                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                                <span>Role:</span>
                                <span className="font-bold uppercase text-slate-800 dark:text-slate-200">{log.actorRole}</span>
                              </span>

                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/80">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                <span>Success</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Friendly Relative Time & Technical Details Toggle */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400" title={fullTime}>
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{relativeTime}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Info' : 'Technical Details'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Technical Details Dropdown */}
                      {isExpanded && (
                        <div className="p-3 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 text-[11px] font-mono space-y-2 mt-2 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400 text-[10px]">
                            <span className="flex items-center gap-1 font-bold text-emerald-400">
                              <Terminal className="w-3 h-3" />
                              Technical Audit Record
                            </span>
                            <span>Event Code: {log.action} • Log ID: {log.id}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[10px]">
                            <div>
                              <span className="text-slate-500 block">Exact Timestamp:</span>
                              <span className="text-slate-200">{fullTime} ({log.timestamp})</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Client Runtime:</span>
                              <span className="text-slate-200 break-all">{log.userAgent}</span>
                            </div>
                          </div>

                          <div className="pt-1">
                            <span className="text-slate-500 block pb-1 text-[10px]">Raw Event Metadata:</span>
                            <pre className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-[10px] overflow-x-auto max-h-32">
                              {JSON.stringify(log, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 3: WEST AFRICAN REGIONAL DISTRIBUTION
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'regional' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {WEST_AFRICAN_COUNTRIES.filter((c) => c.code !== 'ALL').map((c) => {
                  const count = users.filter((u) => u.countryCode === c.code).length
                  const activeCount = users.filter(
                    (u) =>
                      u.countryCode === c.code &&
                      (u.status === 'active_now' || u.status === 'active_today' || u.status === 'active_this_week')
                  ).length

                  return (
                    <div
                      key={c.code}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-brand-600" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {c.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {c.code}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <span className="text-slate-500">Learners:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{count} registered</span>
                      </div>

                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <span className="text-slate-500">Active Status:</span>
                        <span className="font-bold text-[#005F02] dark:text-emerald-400">
                          {activeCount} active
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 4: MENTOR OPERATIONS, ACTIVE/INACTIVE ROSTER & APPS
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'mentors' && (
            <div className="p-4 sm:p-6 space-y-5">
              {/* Top Mentor Overview Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                    <span>Total Mentors</span>
                    <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                    {mentorUsers.length}
                  </div>
                  <div className="text-[10px] text-slate-500">Verified Instructors</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                    <span>Active Mentors</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-xl font-bold text-emerald-800 dark:text-emerald-200 font-mono">
                    {activeMentorCount}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Online &amp; active this week</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
                    <span>Inactive Mentors</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {inactiveMentorCount}
                  </div>
                  <div className="text-[10px] text-slate-500">Offline &gt;7 days / idle</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-mono font-bold">
                    <span>Pending Apps</span>
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold text-amber-800 dark:text-amber-200 font-mono">
                    {pendingMentorCount}
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400">Awaiting Admin Review</div>
                </div>
              </div>

              {/* Sub-Tabs: Verified Mentors Roster vs Applications Queue */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-3xs gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMentorRosterSubTab('roster')}
                    className={`px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
                      mentorRosterSubTab === 'roster'
                        ? 'bg-brand-600 text-white shadow-xs font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      <span className="sm:hidden">Mentors</span>
                      <span className="hidden sm:inline">Appointed Mentors</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold shrink-0 ${
                        mentorRosterSubTab === 'roster'
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mentorUsers.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMentorRosterSubTab('applications')}
                    className={`px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
                      mentorRosterSubTab === 'applications'
                        ? 'bg-brand-600 text-white shadow-xs font-extrabold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      <span className="sm:hidden">Applications</span>
                      <span className="hidden sm:inline">Applications Queue</span>
                    </span>
                    {pendingMentorCount > 0 ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-500 text-white font-bold animate-pulse shrink-0">
                        {pendingMentorCount} New
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                        {mentorApps.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
                  <span>Admins can review active teaching status and promote/demote mentors.</span>
                </div>
              </div>

              {/* TAB 1: APPOINTED MENTORS ROSTER (ACTIVE & INACTIVE) */}
              {mentorRosterSubTab === 'roster' && (
                <div className="space-y-4">
                  {/* Activity Filter Chips */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                      {[
                        { id: 'ALL', label: 'All Mentors', count: mentorUsers.length },
                        { id: 'active', label: '🟢 Active Mentors', count: activeMentorCount },
                        { id: 'inactive', label: '⚪ Inactive Mentors', count: inactiveMentorCount },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => setMentorActivityFilter(btn.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 select-none shadow-3xs ${
                            mentorActivityFilter === btn.id
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
                          }`}
                        >
                          <span className="whitespace-nowrap">{btn.label}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                              mentorActivityFilter === btn.id
                                ? 'bg-white/20 dark:bg-slate-900/20'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {btn.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleCollapseAllMentors}
                          className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-3xs"
                        >
                          Collapse All
                        </button>
                        <button
                          type="button"
                          onClick={handleExpandAllMentors}
                          className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-3xs"
                        >
                          Expand All
                        </button>
                      </div>

                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Showing {filteredMentors.length} of {mentorUsers.length} mentors
                      </div>
                    </div>
                  </div>

                  {/* Mentors Grid / Cards */}
                  {filteredMentors.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        No mentors match this filter
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Try changing the activity filter or searching by another mentor name or country.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredMentors.map((mentor) => {
                        const isLiveActive =
                          mentor.status === 'active_now' ||
                          mentor.status === 'active_today' ||
                          mentor.status === 'active_this_week'

                        const associatedApp = mentorApps.find(
                          (a) => a.email.toLowerCase() === mentor.email.toLowerCase()
                        )

                        const assignedCourses = courseStoreService.getCoursesByMentor(
                          mentor.id,
                          mentor.enrolledCourseIds,
                          mentor.favoriteLanguage
                        )

                        const mentorLearners = adminAnalyticsService.getLearnersForMentor(mentor, assignedCourses)
                        const totalMentorStudentsEnrolled = assignedCourses.reduce(
                          (sum, c) => sum + (c.enrolledCount || 0),
                          0
                        ) || mentorLearners.length

                        const isExpanded = expandedMentorId === mentor.id
                        const isCardCollapsed = !!collapsedMentorCardIds[mentor.id]

                        return (
                          <div
                            key={mentor.id}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                              isLiveActive
                                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500/50 shadow-2xs'
                                : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800/80 opacity-90'
                            }`}
                          >
                            {/* Top row: Mentor Header & Live Status */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                <div className="relative shrink-0 mt-0.5 sm:mt-0">
                                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 overflow-hidden border border-slate-200 dark:border-slate-800">
                                    {mentor.avatarUrl ? (
                                      <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" />
                                    ) : (
                                      mentor.name.charAt(0)
                                    )}
                                  </div>
                                  {mentor.status === 'active_now' ? (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse shadow-3xs" />
                                  ) : isLiveActive ? (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-3xs" />
                                  ) : (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900 shadow-3xs" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                                      {mentor.name}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-[10px] font-bold border border-[#005F02]/20 shadow-3xs shrink-0">
                                      <GraduationCap className="w-3 h-3" />
                                      VERIFIED MENTOR
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-3xs shrink-0">
                                      <Globe className="w-2.5 h-2.5 text-brand-500" />
                                      {mentor.countryName} ({mentor.countryCode})
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 flex-wrap">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">@{mentor.username}</span>
                                    <span className="text-slate-300 dark:text-slate-600 hidden xs:inline">•</span>
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="break-all">{mentor.email}</span>
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                      Registered {new Date(mentor.registeredAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Live Activity Status & Action Controls */}
                              <div className="flex items-center gap-2 flex-wrap shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800/80 w-full lg:w-auto justify-between lg:justify-end">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-3xs">
                                    <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                                    <span>{totalMentorStudentsEnrolled.toLocaleString()} Enrolled</span>
                                  </div>

                                  {mentor.status === 'active_now' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold shadow-3xs whitespace-nowrap">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                      <span>Active Now</span>
                                    </span>
                                  )}
                                  {mentor.status === 'active_today' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-[#005F02] dark:text-emerald-400 font-mono text-xs font-bold shadow-3xs whitespace-nowrap">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                      <span>Active Today</span>
                                    </span>
                                  )}
                                  {mentor.status === 'active_this_week' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold shadow-3xs whitespace-nowrap">
                                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                                      <span>Active this Week</span>
                                    </span>
                                  )}
                                  {(mentor.status === 'idle' || mentor.status === 'inactive') && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold shadow-3xs whitespace-nowrap">
                                      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                                      <span>Inactive</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleMentorRole(mentor)}
                                    className="h-8 px-2.5 sm:px-3 text-xs font-bold text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-3xs cursor-pointer"
                                    leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
                                  >
                                    Demote
                                  </Button>

                                  <button
                                    type="button"
                                    onClick={() => toggleMentorCardCollapse(mentor.id)}
                                    className="h-8 px-2.5 sm:px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-3xs"
                                    title={isCardCollapsed ? "Show mentor details" : "Hide mentor details"}
                                  >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCardCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                                    <span>{isCardCollapsed ? 'Show Info' : 'Hide Info'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Collapsible Details Body */}
                            {!isCardCollapsed && (
                              <div className="space-y-4 pt-1 animate-in fade-in duration-200">

                            {/* ═══════════════════════════════════════════════════════════════
                                ADMIN PER-MENTOR COURSES & ENROLLED STUDENTS BREAKDOWN
                                ═══════════════════════════════════════════════════════════════ */}
                            <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/90">
                              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                                <span className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>Courses Under This Mentor ({assignedCourses.length}):</span>
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {totalMentorStudentsEnrolled.toLocaleString()} total learners enrolled under this mentor
                                </span>
                              </div>

                              {assignedCourses.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No specific courses assigned yet.</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {assignedCourses.map((c) => {
                                    const courseSpecificLearners = mentorLearners.filter(
                                      (l) =>
                                        (l.enrolledCourseIds && l.enrolledCourseIds.includes(c.id)) ||
                                        (l.enrolledCourseTitles && l.enrolledCourseTitles.some((t) => t.toLowerCase() === c.title.toLowerCase())) ||
                                        (l.activeCourseTitle && l.activeCourseTitle.toLowerCase() === c.title.toLowerCase()) ||
                                        (l.favoriteLanguage === c.language)
                                    )
                                    const enrolledInThisCourse = c.enrolledCount || courseSpecificLearners.length || 0

                                    return (
                                      <div
                                        key={c.id}
                                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-3xs"
                                      >
                                        <div className="min-w-0 space-y-0.5">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                              {c.title}
                                            </span>
                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                              {c.language}
                                            </span>
                                          </div>
                                          <p className="text-[10px] font-mono text-slate-400 truncate">
                                            /{c.slug} • {c.totalLessons} lessons
                                          </p>
                                        </div>

                                        <div className="text-right shrink-0">
                                          <div className="flex items-center gap-1 text-xs font-bold font-mono text-[#005F02] dark:text-emerald-400">
                                            <Users className="w-3.5 h-3.5" />
                                            <span>{enrolledInThisCourse.toLocaleString()}</span>
                                          </div>
                                          <span className="text-[9px] font-mono text-slate-400">enrolled</span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Middle row: Activity & Telemetry */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Activity &amp; Device:</span>
                                </div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Last seen: {getHumanRelativeTime(mentor.lastActive)}
                                </div>
                                <div>{getDeviceIcon(mentor.deviceMode)}</div>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase flex items-center gap-1">
                                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Contribution Telemetry:</span>
                                </div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                                  {mentor.totalXp.toLocaleString()} XP • {mentor.problemsSolved} Drills Curated
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {mentor.lessonsCompleted} Published Modules
                                </div>
                              </div>
                            </div>

                            {/* Expandable Learner List Accordion Button */}
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => setExpandedMentorId(isExpanded ? null : mentor.id)}
                                className="w-full py-2 px-3 rounded-xl bg-brand-50/80 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                                  <span>View Enrolled Learners for {mentor.name} ({mentorLearners.length} verified learners)</span>
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="mt-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden animate-in fade-in duration-200">
                                  {mentorLearners.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-3 text-center">
                                      No direct learner profile records found for this mentor.
                                    </p>
                                  ) : (
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-xs">
                                        <thead>
                                          <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                                            <th className="py-2 px-3">Student Name</th>
                                            <th className="py-2 px-3">Country</th>
                                            <th className="py-2 px-3">Active Course</th>
                                            <th className="py-2 px-3">XP &amp; Streak</th>
                                            <th className="py-2 px-3">Status</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                          {mentorLearners.map((learner) => (
                                            <tr key={learner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                              <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                                                <div className="flex items-center gap-2">
                                                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
                                                    {learner.name.charAt(0)}
                                                  </div>
                                                  <div>
                                                    <div>{learner.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono">@{learner.username}</div>
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-300">
                                                {learner.countryName} ({learner.countryCode})
                                              </td>
                                              <td className="py-2 px-3 font-mono text-brand-600 dark:text-brand-400">
                                                {learner.activeCourseTitle || learner.enrolledCourseTitles?.[0] || 'Enrolled'}
                                              </td>
                                              <td className="py-2 px-3 font-mono text-slate-700 dark:text-slate-300">
                                                {learner.totalXp.toLocaleString()} XP • 🔥 {learner.streakDays}d
                                              </td>
                                              <td className="py-2 px-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                                  learner.status === 'active_now' || learner.status === 'active_today'
                                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                }`}>
                                                  {learner.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                              {/* Bottom row: Profile Links */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                {/* Profiles Links */}
                                <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                                  {associatedApp?.githubUrl ? (
                                    <a
                                      href={associatedApp.githubUrl.startsWith('http') ? associatedApp.githubUrl : `https://${associatedApp.githubUrl}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors shadow-3xs"
                                    >
                                      <Code2 className="w-3.5 h-3.5 text-slate-500" />
                                      <span>GitHub Profile ↗</span>
                                    </a>
                                  ) : (
                                    <a
                                      href={`https://github.com/${mentor.username}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors shadow-3xs"
                                    >
                                      <Code2 className="w-3.5 h-3.5 text-slate-500" />
                                      <span>GitHub Profile ↗</span>
                                    </a>
                                  )}

                                  {associatedApp?.linkedinUrl && (
                                    <a
                                      href={associatedApp.linkedinUrl.startsWith('http') ? associatedApp.linkedinUrl : `https://${associatedApp.linkedinUrl}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold transition-colors shadow-3xs"
                                    >
                                      <Globe className="w-3.5 h-3.5 text-indigo-500" />
                                      <span>LinkedIn Profile ↗</span>
                                    </a>
                                  )}

                                  {associatedApp?.portfolioUrl && (
                                    <a
                                      href={associatedApp.portfolioUrl.startsWith('http') ? associatedApp.portfolioUrl : `https://${associatedApp.portfolioUrl}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold transition-colors shadow-3xs"
                                    >
                                      <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>Portfolio Website ↗</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MENTOR APPLICATIONS & REVIEW QUEUE */}
              {mentorRosterSubTab === 'applications' && (
                <div className="space-y-4">
                  {/* Status filter bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: 'ALL', label: 'All Applications', count: mentorApps.length },
                        { id: 'pending', label: 'Pending Review', count: mentorApps.filter((a) => a.status === 'pending').length },
                        { id: 'approved', label: 'Approved Mentors', count: mentorApps.filter((a) => a.status === 'approved').length },
                        { id: 'rejected', label: 'Declined', count: mentorApps.filter((a) => a.status === 'rejected').length },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSelectedAppStatus(tab.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedAppStatus === tab.id
                              ? 'bg-brand-600 text-white shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                              selectedAppStatus === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Applications List */}
                  {filteredMentorApps.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        No mentor applications found
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        New applicant submissions from the landing page will appear here for administrator verification and appointment.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3.5">
                      {filteredMentorApps.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                          {/* Top row: Applicant Info & Badges */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                                {app.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {app.fullName}
                                  </span>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200">
                                    <Globe className="w-2.5 h-2.5 text-brand-500" />
                                    {app.country} ({app.countryCode || 'AF'})
                                  </span>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                    <Laptop className="w-2.5 h-2.5 text-slate-500" />
                                    {app.institutionOrCompany}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    {app.email}
                                  </span>
                                  <span>•</span>
                                  <span>Applied: {getHumanRelativeTime(app.appliedAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 shrink-0">
                              {app.status === 'pending' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Pending Review
                                </span>
                              )}
                              {app.status === 'approved' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  Appointed Mentor
                                </span>
                              )}
                              {app.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold">
                                  <X className="w-3 h-3 text-slate-400" />
                                  Declined
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Mentorship Tracks & Experience */}
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono text-[11px]">
                              <Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                              <span>Tracks:</span>
                            </span>
                            {app.programmingTracks.map((track) => (
                              <span
                                key={track}
                                className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-mono text-[10px] font-bold"
                              >
                                {track}
                              </span>
                            ))}
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                              {app.yearsOfExperience}
                            </span>
                          </div>

                          {/* Bio Statement */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 font-sans italic leading-relaxed">
                            &ldquo;{app.bio}&rdquo;
                          </div>

                          {/* Bottom Footer: Links & Action Buttons */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                            {/* Links */}
                            <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                              {app.githubUrl && (
                                <a
                                  href={app.githubUrl.startsWith('http') ? app.githubUrl : `https://${app.githubUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors shadow-3xs"
                                >
                                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>GitHub Profile ↗</span>
                                </a>
                              )}
                              {app.linkedinUrl && (
                                <a
                                  href={app.linkedinUrl.startsWith('http') ? app.linkedinUrl : `https://${app.linkedinUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold transition-colors shadow-3xs"
                                >
                                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>LinkedIn Profile ↗</span>
                                </a>
                              )}
                              {app.portfolioUrl && (
                                <a
                                  href={app.portfolioUrl.startsWith('http') ? app.portfolioUrl : `https://${app.portfolioUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold transition-colors shadow-3xs"
                                >
                                  <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Portfolio Website ↗</span>
                                </a>
                              )}
                            </div>

                            {/* Admin Action Buttons */}
                            <div className="flex items-center gap-2">
                              {app.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectMentorApp(app.id, app.fullName)}
                                    className="h-7 px-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  >
                                    Decline
                                  </Button>

                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleApproveMentorApp(app.id, app.fullName)}
                                    className="h-7 px-3 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-2xs"
                                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                                  >
                                    Approve &amp; Appoint Mentor
                                  </Button>
                                </>
                              )}
                              {app.status === 'approved' && (
                                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Active Mentor • Verified by {app.reviewedBy || 'Admin'}
                                </span>
                              )}
                              {app.status === 'rejected' && (
                                <span className="text-[11px] font-mono text-slate-400">
                                  Application Declined
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              SUBVIEW 5: CONTACT INQUIRIES & HELP DESK
              ═══════════════════════════════════════════════════════════════ */}
          {subView === 'inquiries' && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No contact messages or inquiries found.
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Try adjusting the search query or category filter above.
                  </p>
                </div>
              ) : (
                filteredInquiries.map((inquiry, idx) => {
                  const inquiryNum = String(idx + 1).padStart(2, '0')
                  const relativeTime = getHumanRelativeTime(inquiry.submittedAt)
                  const isNew = inquiry.status === 'new'

                  return (
                    <div
                      key={inquiry.id}
                      className={`p-4 sm:p-6 transition-colors space-y-4 ${
                        isNew
                          ? 'bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-950/40'
                      }`}
                    >
                      {/* Top Header: Number + Sender + Category + Status */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Number Badge */}
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700/80 shadow-3xs">
                            {inquiryNum}
                          </span>

                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {inquiry.fullName}
                              </span>
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                ({inquiry.email})
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                                {inquiry.country}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono text-[10px] font-bold border border-brand-200 dark:border-brand-800">
                                {inquiry.inquiryType.toUpperCase()}
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 pt-0.5">
                              Subject: {inquiry.subject}
                            </h4>
                          </div>
                        </div>

                        {/* Right Meta Info */}
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{relativeTime}</span>
                          </div>

                          {isNew ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold animate-pulse">
                              New Message
                            </span>
                          ) : inquiry.status === 'replied' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Replied
                            </span>
                          ) : inquiry.status === 'archived' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                              Archived
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                              Read
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message Content Box */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans shadow-3xs">
                        {inquiry.message}
                      </div>

                      {/* Admin Actions Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}&body=Hello ${encodeURIComponent(inquiry.fullName)},%0D%0A%0D%0AThank you for reaching out to CodeTutor Africa regarding "${encodeURIComponent(inquiry.subject)}".%0D%0A%0D%0A`}
                            onClick={() => handleUpdateInquiryStatus(inquiry.id, 'replied')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply via Email ↗</span>
                          </a>

                          {inquiry.status === 'new' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateInquiryStatus(inquiry.id, 'read')}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Mark as Read
                            </button>
                          )}

                          {inquiry.status !== 'archived' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateInquiryStatus(inquiry.id, 'archived')}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Archive
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inquiry.id)}
                          className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold p-1 transition-colors cursor-pointer"
                        >
                          Delete Message
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          EXPORT WITH DATE & TIME RANGE MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Audit & Activity Logs"
        description="Select a custom date/time range, activity category, and export format."
        size="lg"
      >
        <div className="space-y-4 pt-2">
          {/* Format selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Export Format:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-slate-900 dark:text-white ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>CSV Spreadsheet</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Compatible with Excel, Google Sheets, Python Pandas</p>
                </div>
                {exportFormat === 'csv' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('json')}
                className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  exportFormat === 'json'
                    ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-slate-900 dark:text-white ring-1 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>JSON Document</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Full metadata payload with user-agents & IPs</p>
                </div>
                {exportFormat === 'json' && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Quick Date Range Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: 'All History' },
                { id: 'today', label: 'Today Only' },
                { id: '24h', label: 'Past 24 Hours' },
                { id: '7d', label: 'Past 7 Days' },
                { id: '30d', label: 'Past 30 Days' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleExportModalPresetChange(p.id)}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date & Time Range Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Start Date & Time:</span>
              </label>
              <input
                type="datetime-local"
                value={exportModalStartDate}
                onChange={(e) => setExportModalStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-semibold text-slate-900 dark:text-white dark:[color-scheme:dark] [color-scheme:light] shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>End Date & Time:</span>
              </label>
              <input
                type="datetime-local"
                value={exportModalEndDate}
                onChange={(e) => setExportModalEndDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-semibold text-slate-900 dark:text-white dark:[color-scheme:dark] [color-scheme:light] shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Category Scope */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Activity Category Scope:
            </label>
            <div className="relative">
              <select
                value={exportModalCategory}
                onChange={(e) => setExportModalCategory(e.target.value)}
                className="w-full py-2.5 pl-3.5 pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
              >
                <option value="ALL">All Categories & Life-cycle Events</option>
                <option value="auth">Account & Authentication (Login, Logout, Signup)</option>
                <option value="learning">Lesson Activity</option>
                <option value="practice">Practice Submissions</option>
                <option value="tutor">AI Tutor Dialogues</option>
                <option value="arcade">Coding Arcade</option>
                <option value="curriculum">Curriculum Changes</option>
                <option value="security">Security Sandboxes</option>
                <option value="system">System & Offline Sync</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Matching preview banner */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {exportModalMatchingLogs.length} matching event logs
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Format: {exportFormat.toUpperCase()}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExecuteModalExport}
              disabled={exportModalMatchingLogs.length === 0}
              leftIcon={<HardDrive className="w-3.5 h-3.5" />}
            >
              Download {exportFormat.toUpperCase()} ({exportModalMatchingLogs.length})
            </Button>
          </div>
        </div>
      </Modal>

      {/* Demote Mentor Confirmation Modal */}
      <DemoteMentorModal
        isOpen={isDemoteModalOpen}
        mentor={mentorToDemote}
        onClose={() => setIsDemoteModalOpen(false)}
        onConfirmDemote={handleConfirmDemoteMentor}
      />

      {/* Approve / Appoint Mentor Confirmation Modal */}
      <ApproveMentorModal
        isOpen={isApproveModalOpen}
        target={approveModalTarget}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirmApprove={handleConfirmApproveMentor}
      />
    </div>
  )
}
