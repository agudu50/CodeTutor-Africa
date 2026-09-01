import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Course } from '@/types'
import { courseStoreService } from '@/services/learning/course-store.service'
import { issueSupportService, IssueReport } from '@/services/support/issue-support.service'
import { gameStoreService } from '@/services/games/game-store.service'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { AdminUserRecord, AuditLogEntry } from '@/types/admin-analytics'
import { CourseListTable } from '../components/CourseListTable'
import { CourseEditorModal } from '../components/CourseEditorModal'
import { IssueDeskView } from '../components/IssueDeskView'
import { GameStudioView } from '../components/GameStudioView'
import { PracticeStudioView } from '../components/PracticeStudioView'
import { UserAnalyticsDeskView } from '../components/UserAnalyticsDeskView'
import { SystemPerformanceDeskView } from '../components/SystemPerformanceDeskView'
import { MentorEnrollmentOverviewTable } from '../components/MentorEnrollmentOverviewTable'
import { Button } from '@/components/ui'
import {
  ShieldCheck,
  Plus,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  Gamepad2,
  Code2,
  Users,
  Zap,
  GraduationCap,
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'mentors' | 'practice' | 'games' | 'issues' | 'analytics' | 'performance'>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [issues, setIssues] = useState<IssueReport[]>([])
  const [practiceCount, setPracticeCount] = useState<number>(() => practiceStoreService.getAllQuestions().length)
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>(() => adminAnalyticsService.getAllUsers())
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => adminAnalyticsService.getAllAuditLogs())
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const reloadData = () => {
    setCourses(courseStoreService.getAllCourses())
    setIssues(issueSupportService.getAllIssues())
    setPracticeCount(practiceStoreService.getAllQuestions().length)
    setAdminUsers(adminAnalyticsService.getAllUsers())
    setAuditLogs(adminAnalyticsService.getAllAuditLogs())
  }

  useEffect(() => {
    reloadData()

    const handleCoursesUpdated = () => setCourses(courseStoreService.getAllCourses())
    const handleIssuesUpdated = () => setIssues(issueSupportService.getAllIssues())
    const handlePracticeUpdated = () => setPracticeCount(practiceStoreService.getAllQuestions().length)
    const handleUsersUpdated = () => setAdminUsers(adminAnalyticsService.getAllUsers())
    const handleAuditUpdated = () => setAuditLogs(adminAnalyticsService.getAllAuditLogs())

    window.addEventListener('courses_updated', handleCoursesUpdated)
    window.addEventListener('issues_updated', handleIssuesUpdated)
    window.addEventListener('practice_updated', handlePracticeUpdated)
    window.addEventListener('admin_users_updated', handleUsersUpdated)
    window.addEventListener('admin_audit_logs_updated', handleAuditUpdated)

    return () => {
      window.removeEventListener('courses_updated', handleCoursesUpdated)
      window.removeEventListener('issues_updated', handleIssuesUpdated)
      window.removeEventListener('practice_updated', handlePracticeUpdated)
      window.removeEventListener('admin_users_updated', handleUsersUpdated)
      window.removeEventListener('admin_audit_logs_updated', handleAuditUpdated)
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
    const course = courses.find((c) => c.id === courseId)
    const deleted = courseStoreService.deleteCourse(courseId)
    if (deleted) {
      adminAnalyticsService.logAction({
        actorName: 'Lead Curriculum Director (Admin)',
        actorRole: 'admin',
        action: 'COURSE_DELETED',
        category: 'curriculum',
        target: `${courseId} (${course?.title || 'Course'})`,
        details: 'Course deleted from curriculum repository by administrator.',
        status: 'warning',
        ipAddress: '127.0.0.1',
        userAgent: 'CodeTutor Admin Console',
      })
      reloadData()
      setToastMessage('Course removed from platform.')
    }
  }

  const handleCourseSaved = (savedCourse: Course) => {
    adminAnalyticsService.logAction({
      actorName: 'Lead Curriculum Director (Admin)',
      actorRole: 'admin',
      action: 'COURSE_SAVED',
      category: 'curriculum',
      target: `${savedCourse.id} (${savedCourse.title})`,
      details: `Saved course with ${savedCourse.modules?.length || 0} modules and ${savedCourse.totalLessons || 0} lessons.`,
      status: 'success',
      ipAddress: '127.0.0.1',
      userAgent: 'CodeTutor Admin Console',
    })
    reloadData()
    setToastMessage(`Course "${savedCourse.title}" saved successfully.`)
  }

  const totalLessons = courses.reduce((acc, c) => acc + (c.totalLessons || 0), 0)
  const openIssuesCount = issues.filter((i) => i.status === 'open').length
  const gameCounts = gameStoreService.getAllChallengesCount()

  return (
    <PageContainer maxWidth="full" className="max-w-[1600px] w-full min-w-0 space-y-6 overflow-x-clip px-3 sm:px-6 lg:px-8">
      {/* ═══════════════════════════════════════════════════════════════
          TOAST NOTIFICATION
          ═══════════════════════════════════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900/95 dark:bg-brand-950/95 text-white border border-brand-500 shadow-2xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ADMIN PORTAL HEADER BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none">
        <div className="space-y-1 min-w-0">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-600 text-white shadow-xs shrink-0 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  Platform Operations
                </span>
              </div>
              <h1 className="text-base sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Admin Operations &amp; Curriculum Portal
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Manage offline courses, configure practice test suites &amp; arcade games, and review student feedback tickets.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reloadData()
              setToastMessage('Platform data refreshed.')
            }}
            className="h-9 text-xs font-bold justify-center border-slate-300 dark:border-slate-700 flex-1 sm:flex-initial"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          {activeTab === 'courses' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateNewCourse}
              className="h-9 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-3.5 justify-center flex-1 sm:flex-initial"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Course
            </Button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HIGH-LEVEL SUMMARY METRICS (5 Equal KPI Cards)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-4 font-mono">
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Active Courses
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {courses.length}
            </span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate font-sans">
            {totalLessons} lessons
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Practice Drills
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-[#005F02] dark:text-emerald-400">
              {practiceCount}
            </span>
            <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate font-sans">
            Automated test suites
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Arcade Games
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-400">
              {gameCounts.total}
            </span>
            <Gamepad2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate font-sans">
            4 interactive modes
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Platform Learners
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-extrabold text-purple-700 dark:text-purple-400">
              {adminUsers.length}
            </span>
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate font-sans">
            {adminUsers.filter((u) => u.status === 'active_now' || u.status === 'active_today').length} active today
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 col-span-2 sm:col-span-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Support Tickets
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-xl sm:text-2xl font-extrabold ${openIssuesCount > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              {openIssuesCount}
            </span>
            <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate font-sans">
            {issues.length} total tickets
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PORTAL TABS: COURSES vs MENTORS vs PRACTICE vs GAMES vs USERS & AUDIT vs ISSUES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 w-full min-w-0 max-w-full">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-fit overflow-x-auto scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>Courses</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {courses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mentors'
                ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>Mentors</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-bold">
              {adminUsers.filter((u) => u.role === 'instructor').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'practice'
                ? 'bg-white dark:bg-slate-900 text-[#005F02] dark:text-emerald-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Practice</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {practiceCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Games</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
              {gameCounts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>Learners</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">
              {adminUsers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'performance'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>AI Ops</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
              98%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'issues'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Support</span>
            {openIssuesCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                {openIssuesCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Viewport */}
        <div className="w-full min-w-0 max-w-full">
          {activeTab === 'courses' ? (
            <CourseListTable
              courses={courses}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          ) : activeTab === 'mentors' ? (
            <MentorEnrollmentOverviewTable
              adminUsers={adminUsers}
              onDataChanged={reloadData}
            />
          ) : activeTab === 'practice' ? (
            <PracticeStudioView onUpdated={reloadData} />
          ) : activeTab === 'games' ? (
            <GameStudioView onUpdated={reloadData} />
          ) : activeTab === 'analytics' ? (
            <UserAnalyticsDeskView
              users={adminUsers}
              auditLogs={auditLogs}
              onDataChanged={reloadData}
            />
          ) : activeTab === 'performance' ? (
            <SystemPerformanceDeskView />
          ) : (
            <IssueDeskView issues={issues} onUpdated={reloadData} />
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          COURSE CREATOR / EDITOR MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <CourseEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        courseToEdit={courseToEdit}
        onSaved={handleCourseSaved}
      />
    </PageContainer>
  )
}

export default AdminDashboardPage
