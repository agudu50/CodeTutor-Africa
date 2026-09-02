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
          ADMIN PORTAL HEADER BANNER (2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs">
        <div className="space-y-1 min-w-0">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs shrink-0 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  Platform Operations
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Admin Operations &amp; Curriculum Portal
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 leading-relaxed">
                Manage offline courses, configure practice test suites &amp; arcade games, and review student feedback tickets.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              reloadData()
              setToastMessage('Platform data refreshed.')
            }}
            className="h-9 px-3.5 rounded-xl text-xs font-mono font-bold justify-center border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-slate-800 dark:text-slate-200 hover:border-[#005F02] transition-all cursor-pointer shadow-3xs active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          {activeTab === 'courses' && (
            <button
              type="button"
              onClick={handleCreateNewCourse}
              className="h-9 px-4 rounded-xl text-xs font-mono font-black bg-[#005F02] hover:bg-emerald-700 border-2 border-[#005F02] text-white shadow-xs justify-center transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1.5 flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HIGH-LEVEL SUMMARY METRICS (5 Equal KPI Cards with 2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 font-mono">
        <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-1.5 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
              Active Courses
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-800 flex items-center justify-center shrink-0 shadow-3xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
            {courses.length}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            {totalLessons} lessons
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-1.5 hover:border-[#005F02] dark:hover:border-emerald-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
              Practice Drills
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Code2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#005F02] dark:text-emerald-400 block">
            {practiceCount}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            Automated test suites
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-1.5 hover:border-amber-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
              Arcade Games
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 block">
            {gameCounts.total}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            4 interactive modes
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-1.5 hover:border-purple-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
              Platform Learners
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-800 flex items-center justify-center shrink-0 shadow-3xs">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-400 block">
            {adminUsers.length}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            {adminUsers.filter((u) => u.status === 'active_now' || u.status === 'active_today').length} active today
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs space-y-1.5 col-span-2 sm:col-span-1 hover:border-rose-500 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-600 dark:text-slate-400 block tracking-wider">
              Support Tickets
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-3xs">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className={`text-2xl sm:text-3xl font-black block ${openIssuesCount > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {openIssuesCount}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
            {issues.length} total tickets
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PORTAL TABS: COURSES vs MENTORS vs PRACTICE vs GAMES vs USERS & AUDIT vs ISSUES (2px borders)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 w-full min-w-0 max-w-full">
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#0E1318] p-1.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 w-full sm:w-fit overflow-x-auto scrollbar-none shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 shadow-3xs active:scale-95 ${
              activeTab === 'courses'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Courses</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {courses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 shadow-3xs active:scale-95 ${
              activeTab === 'mentors'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>Mentors</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {adminUsers.filter((u) => u.role === 'instructor').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 shadow-3xs active:scale-95 ${
              activeTab === 'practice'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 shrink-0" />
            <span>Practice</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {practiceCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 shadow-3xs active:scale-95 ${
              activeTab === 'games'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
            <span>Games</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {gameCounts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 shadow-3xs active:scale-95 ${
              activeTab === 'analytics'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Learners</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {adminUsers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 shadow-3xs active:scale-95 ${
              activeTab === 'performance'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>AI Ops</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              98%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer whitespace-nowrap border-2 shadow-3xs active:scale-95 ${
              activeTab === 'issues'
                ? 'bg-[#005F02] text-white border-[#005F02]'
                : 'text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Support</span>
            {openIssuesCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-rose-500 text-white font-black">
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
