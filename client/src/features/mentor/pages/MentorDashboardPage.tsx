import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'

export const MentorDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'courses' | 'students'>('inquiries')
  const [courses, setCourses] = useState<Course[]>([])
  const [issues, setIssues] = useState<IssueReport[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const reloadData = () => {
    setCourses(courseStoreService.getAllCourses())
    setIssues(issueSupportService.getAllIssues())
    setAdminUsers(adminAnalyticsService.getAllUsers())
    setAuditLogs(adminAnalyticsService.getAllAuditLogs())
  }

  useEffect(() => {
    reloadData()

    const handleCoursesUpdated = () => setCourses(courseStoreService.getAllCourses())
    const handleIssuesUpdated = () => setIssues(issueSupportService.getAllIssues())
    const handleUsersUpdated = () => setAdminUsers(adminAnalyticsService.getAllUsers())
    const handleAuditUpdated = () => setAuditLogs(adminAnalyticsService.getAllAuditLogs())

    window.addEventListener('courses_updated', handleCoursesUpdated)
    window.addEventListener('issues_updated', handleIssuesUpdated)
    window.addEventListener('admin_users_updated', handleUsersUpdated)
    window.addEventListener('admin_audit_logs_updated', handleAuditUpdated)

    return () => {
      window.removeEventListener('courses_updated', handleCoursesUpdated)
      window.removeEventListener('issues_updated', handleIssuesUpdated)
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
    courseStoreService.deleteCourse(courseId)
    setCourses(courseStoreService.getAllCourses())
    setToastMessage('Course deleted successfully.')
  }

  const openInquiriesCount = issues.filter((i) => i.status === 'open' || i.status === 'in_review').length
  const resolvedInquiriesCount = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length
  const totalLessons = courses.reduce((acc, c) => acc + (c.modules?.reduce((mAcc, m) => mAcc + (m.lessons?.length || 0), 0) || 0), 0)

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Mentor Operations & Community Hub
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review student questions, author offline curriculum tracks, and deliver instructor solution notes synced in real time.
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
            className="h-9 text-xs font-semibold justify-center"
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
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
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

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Curriculum Courses
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {courses.length}
            </span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            {totalLessons} lessons online
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Enrolled Learners
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-[#005F02] dark:text-emerald-400">
              {adminUsers.length}
            </span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            Active study cohort
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
            Admin synced real-time
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
          <span>Student Inquiries & Community Desk</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-bold">
            {issues.length}
          </span>
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
          <span>My Course Tracks & Curriculum</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {courses.length}
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
          <span>Enrolled Students & Progress</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {adminUsers.length}
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
        <CourseListTable
          courses={courses}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      )}

      {activeTab === 'students' && (
        <UserAnalyticsDeskView
          users={adminUsers}
          auditLogs={auditLogs}
          onDataChanged={reloadData}
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
    </PageContainer>
  )
}

export default MentorDashboardPage
