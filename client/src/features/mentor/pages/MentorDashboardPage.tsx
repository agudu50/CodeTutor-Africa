import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Course } from '@/types'
import { IssueReport, issueSupportService } from '@/services/support/issue-support.service'
import { courseStoreService } from '@/services/learning/course-store.service'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { AdminUserRecord, AuditLogEntry } from '@/types/admin-analytics'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui'
import { CourseListTable } from '@/features/admin/components/CourseListTable'
import { CourseEditorModal } from '@/features/admin/components/CourseEditorModal'
import { IssueDeskView } from '@/features/admin/components/IssueDeskView'
import { UserAnalyticsDeskView } from '@/features/admin/components/UserAnalyticsDeskView'
import { MentorApplicationModal } from '@/features/landing/components/MentorApplicationModal'
import {
  GraduationCap,
  MessageSquare,
  BookOpen,
  Users,
  RotateCcw,
  Plus,
  CheckCircle2,
  HelpCircle,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Shield,
} from 'lucide-react'

export const MentorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'courses' | 'students'>('inquiries')
  const [courses, setCourses] = useState<Course[]>([])
  const [issues, setIssues] = useState<IssueReport[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [isMentorAppModalOpen, setIsMentorAppModalOpen] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AdminUserRecord>(() =>
    adminAnalyticsService.getActiveUserSession()
  )

  const reloadData = () => {
    setCourses(courseStoreService.getAllCourses())
    setIssues(issueSupportService.getAllIssues())
    const allUsers = adminAnalyticsService.getAllUsers()
    setAdminUsers(allUsers)
    setAuditLogs(adminAnalyticsService.getAllAuditLogs())

    const active = adminAnalyticsService.getActiveUserSession()
    setCurrentUser(active)
  }

  useEffect(() => {
    reloadData()

    const handleCoursesUpdated = () => setCourses(courseStoreService.getAllCourses())
    const handleIssuesUpdated = () => setIssues(issueSupportService.getAllIssues())
    const handleUsersUpdated = () => {
      setAdminUsers(adminAnalyticsService.getAllUsers())
      setCurrentUser(adminAnalyticsService.getActiveUserSession())
    }
    const handleAuditUpdated = () => setAuditLogs(adminAnalyticsService.getAllAuditLogs())
    const handleSessionChanged = (e: any) => {
      if (e.detail) {
        setCurrentUser(e.detail)
      } else {
        setCurrentUser(adminAnalyticsService.getActiveUserSession())
      }
    }

    window.addEventListener('courses_updated', handleCoursesUpdated)
    window.addEventListener('issues_updated', handleIssuesUpdated)
    window.addEventListener('admin_users_updated', handleUsersUpdated)
    window.addEventListener('admin_audit_logs_updated', handleAuditUpdated)
    window.addEventListener('active_user_session_changed', handleSessionChanged)

    return () => {
      window.removeEventListener('courses_updated', handleCoursesUpdated)
      window.removeEventListener('issues_updated', handleIssuesUpdated)
      window.removeEventListener('admin_users_updated', handleUsersUpdated)
      window.removeEventListener('admin_audit_logs_updated', handleAuditUpdated)
      window.removeEventListener('active_user_session_changed', handleSessionChanged)
    }
  }, [])

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const handleCreateNewCourse = () => {
    setCourseToEdit(null)
    setIsEditorModalOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course)
    setIsEditorModalOpen(true)
  }

  const handleDeleteCourse = (courseId: string) => {
    courseStoreService.deleteCourse(courseId)
    setCourses(courseStoreService.getAllCourses())
    setToastMessage('Course deleted successfully.')
  }

  const handleSwitchPersona = (userId: string) => {
    const nextUser = adminAnalyticsService.setActiveUserSession(userId)
    if (nextUser) {
      setCurrentUser(nextUser)
      setToastMessage(`Switched active view to ${nextUser.name} (${nextUser.role.toUpperCase()})`)
    }
  }

  const isMentorOrAdmin = currentUser.role === 'instructor' || currentUser.role === 'admin'

  // ═══════════════════════════════════════════════════════════════
  // ACCESS DENIED GATE: FOR DEMOTED MENTORS OR STANDARD LEARNERS
  // ═══════════════════════════════════════════════════════════════
  if (!isMentorOrAdmin) {
    return (
      <PageContainer maxWidth="xl" className="space-y-6 py-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/95 dark:bg-brand-950/95 text-white border border-brand-500 shadow-2xl flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-6 text-center">
          {/* Lock Icon Banner */}
          <div className="p-8 sm:p-10 rounded-3xl border border-rose-200 dark:border-rose-900/80 bg-white dark:bg-slate-900 shadow-xl space-y-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-18 h-18 rounded-3xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400 shadow-sm">
              <Lock className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold border border-rose-200 dark:border-rose-800">
                <Shield className="w-3.5 h-3.5" />
                <span>Mentor Access Restricted</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                No Access to Mentor Hub
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                You are currently signed in as <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> with the <strong className="text-rose-600 dark:text-rose-400 font-mono">STANDARD LEARNER</strong> role.
              </p>
            </div>

            {/* Demote Explanation Notice */}
            <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 text-left text-xs text-rose-900 dark:text-rose-200 space-y-2">
              <div className="font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Educator Privileges Inactive or Revoked</span>
              </div>
              <p className="leading-relaxed">
                Mentor Hub authoring tools, curriculum management, offline lesson compilers, and student inquiry resolution desks are exclusively restricted to <strong>Verified Mentors &amp; Instructors</strong>. If your mentor privileges were recently demoted or revoked by an administrator, your access has been disabled.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/dashboard">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto font-bold bg-[#005F02] hover:bg-emerald-700 text-white shadow-md px-5"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Return to Learner Dashboard
                </Button>
              </Link>

              <Button
                variant="outline"
                size="md"
                onClick={() => setIsMentorAppModalOpen(true)}
                className="w-full sm:w-auto font-bold text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/50"
                leftIcon={<GraduationCap className="w-4 h-4" />}
              >
                Apply to Become a Mentor
              </Button>
            </div>
          </div>

          {/* Quick Demo Persona Switcher for Evaluation */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Test Role Switcher (Admin Evaluation Mode):</span>
            </div>

            <select
              value={currentUser.id}
              onChange={(e) => handleSwitchPersona(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {adminUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mentor Application Modal */}
        <MentorApplicationModal
          isOpen={isMentorAppModalOpen}
          onClose={() => setIsMentorAppModalOpen(false)}
          onApplicationSubmitted={() => {
            reloadData()
            setToastMessage('Mentor application submitted successfully!')
          }}
        />
      </PageContainer>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // AUTHORIZED MENTOR HUB VIEW (FOR ACTIVE INSTRUCTORS & ADMINS)
  // ═══════════════════════════════════════════════════════════════
  const isInstructor = currentUser.role === 'instructor'

  // If viewing as instructor / mentor, scope courses and students to ONLY their own
  const mentorCourses = isInstructor
    ? courseStoreService.getCoursesByMentor(
        currentUser.id,
        currentUser.enrolledCourseIds,
        currentUser.favoriteLanguage
      )
    : courses

  const displayCourses = isInstructor ? mentorCourses : courses

  const mentorLearners = isInstructor
    ? adminAnalyticsService.getLearnersForMentor(currentUser, mentorCourses)
    : adminUsers.filter((u) => u.role === 'learner')

  const openInquiriesCount = issues.filter((i) => i.status === 'open' || i.status === 'in_review').length
  const resolvedInquiriesCount = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length

  const totalLessons = displayCourses.reduce(
    (acc, c) => acc + (c.modules?.reduce((mAcc, m) => mAcc + (m.lessons?.length || 0), 0) || c.totalLessons || 0),
    0
  )

  const totalEnrolledStudents = isInstructor
    ? displayCourses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0) || mentorLearners.length
    : courses.reduce((acc, c) => acc + (c.enrolledCount || 420), 0)

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900/95 dark:bg-brand-950/95 text-white border border-brand-500 shadow-2xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MENTOR PORTAL HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none">
        <div className="space-y-1">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Mentor Operations &amp; Community Hub
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-[10px] font-bold border border-[#005F02]/20">
                  {isInstructor ? `${currentUser.favoriteLanguage?.toUpperCase()} VERIFIED EDUCATOR` : 'PLATFORM ADMINISTRATOR'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active session: <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> •{' '}
                {isInstructor
                  ? `Assigned to ${displayCourses.map(c => c.title).join(', ')} (${totalEnrolledStudents.toLocaleString()} enrolled students).`
                  : 'Platform Admin: Overview of all courses, students, and per-mentor track assignments.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reloadData()
              setToastMessage('Mentor desk data refreshed.')
            }}
            className="h-9 text-xs font-semibold justify-center border-slate-300 dark:border-slate-700"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          {activeTab === 'courses' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateNewCourse}
              className="h-9 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-3.5 justify-center"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Course
            </Button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HIGH-LEVEL SUMMARY METRICS (4 Equal KPI Cards)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 font-mono">
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Open Inquiries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {openInquiriesCount}
            </span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            {resolvedInquiriesCount} resolved tickets
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            {isInstructor ? 'Your Courses' : 'Curriculum Courses'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {displayCourses.length}
            </span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            {totalLessons} lessons {isInstructor ? 'authored' : 'online'}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            {isInstructor ? 'Your Enrolled Students' : 'Total Enrolled'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-[#005F02] dark:text-emerald-400">
              {totalEnrolledStudents.toLocaleString()}
            </span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            {isInstructor
              ? `Across your ${displayCourses.length} assigned track(s)`
              : `Across ${courses.length} active tracks`}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Response Status
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-sky-600 dark:text-sky-400">
              &lt; 2h
            </span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            {isInstructor ? 'Active Mentor Desk' : 'Admin synced real-time'}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SUB-NAVIGATION TABS: INQUIRIES vs COURSES vs STUDENTS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-2xs font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Student Inquiries &amp; Help Desk</span>
          {openInquiriesCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold animate-pulse">
              {openInquiriesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-2xs font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isInstructor ? 'Your Mentored Courses' : 'Curriculum & Course Builder'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {displayCourses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-2xs font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{isInstructor ? 'Your Enrolled Students' : 'Enrolled Students & Mentors'}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {isInstructor ? mentorLearners.length : adminUsers.length}
          </span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ACTIVE TAB CONTENT RENDERING
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'inquiries' && (
        <IssueDeskView issues={issues} onUpdated={reloadData} />
      )}

      {activeTab === 'courses' && (
        <div className="space-y-4">
          {isInstructor && (
            <div className="p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Showing only the {displayCourses.length} curriculum track(s) assigned to you ({currentUser.name}).
                </span>
              </div>
              <span className="font-mono font-bold text-[#005F02] dark:text-emerald-400 whitespace-nowrap">
                {totalEnrolledStudents.toLocaleString()} total learners enrolled
              </span>
            </div>
          )}

          <CourseListTable
            courses={displayCourses}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        </div>
      )}

      {activeTab === 'students' && (
        <UserAnalyticsDeskView
          users={adminUsers}
          auditLogs={auditLogs}
          onDataChanged={reloadData}
          restrictedMentorUser={isInstructor ? currentUser : null}
        />
      )}

      {/* Course Editor Modal for Mentors */}
      <CourseEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        courseToEdit={courseToEdit}
        onSaved={() => {
          reloadData()
          setIsEditorModalOpen(false)
          setToastMessage('Course curriculum saved and synced across CodeTutor platform.')
        }}
      />

      {/* Mentor Application Modal */}
      <MentorApplicationModal
        isOpen={isMentorAppModalOpen}
        onClose={() => setIsMentorAppModalOpen(false)}
        onApplicationSubmitted={() => {
          reloadData()
          setToastMessage('Mentor application submitted successfully!')
        }}
      />
    </PageContainer>
  )
}

export default MentorDashboardPage

