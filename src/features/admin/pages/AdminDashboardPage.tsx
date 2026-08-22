import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Course } from '@/types'
import { courseStoreService } from '@/services/learning/course-store.service'
import { issueSupportService, IssueReport } from '@/services/support/issue-support.service'
import { CourseListTable } from '../components/CourseListTable'
import { CourseEditorModal } from '../components/CourseEditorModal'
import { IssueDeskView } from '../components/IssueDeskView'
import { Button } from '@/components/ui'
import {
  ShieldCheck,
  Plus,
  BookOpen,
  HelpCircle,
  BarChart3,
  Database,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'issues'>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [issues, setIssues] = useState<IssueReport[]>([])
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const reloadData = () => {
    setCourses(courseStoreService.getAllCourses())
    setIssues(issueSupportService.getAllIssues())
  }

  useEffect(() => {
    reloadData()

    const handleCoursesUpdated = () => setCourses(courseStoreService.getAllCourses())
    const handleIssuesUpdated = () => setIssues(issueSupportService.getAllIssues())

    window.addEventListener('courses_updated', handleCoursesUpdated)
    window.addEventListener('issues_updated', handleIssuesUpdated)

    return () => {
      window.removeEventListener('courses_updated', handleCoursesUpdated)
      window.removeEventListener('issues_updated', handleIssuesUpdated)
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
    const deleted = courseStoreService.deleteCourse(courseId)
    if (deleted) {
      reloadData()
      setToastMessage('Course removed from platform.')
    }
  }

  const handleCourseSaved = (savedCourse: Course) => {
    reloadData()
    setToastMessage(`Course "${savedCourse.title}" saved successfully.`)
  }

  const totalLessons = courses.reduce((acc, c) => acc + (c.totalLessons || 0), 0)
  const openIssuesCount = issues.filter((i) => i.status === 'open').length

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Admin Operations & Curriculum Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage offline courses, review student tickets, and publish new learning tracks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Reset courses to official seed defaults?')) {
                courseStoreService.resetToDefaults()
                reloadData()
                setToastMessage('Courses reset to defaults.')
              }
            }}
            className="h-9 text-xs font-semibold"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Defaults
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateNewCourse}
            className="h-9 font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-3.5"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Course
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HIGH-LEVEL SUMMARY METRICS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Active Courses
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {courses.length}
            </span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Python, JS & Java tracks
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Total Lessons
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalLessons}
            </span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Available 100% offline
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Open Tickets
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${openIssuesCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {openIssuesCount}
            </span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Awaiting admin review
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Total Tickets
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {issues.length}
            </span>
            <BarChart3 className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Student inquiries & feedback
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PORTAL TABS: COURSE MANAGER vs ISSUE DESK
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Course Catalog Manager</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {courses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'issues'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>User Support & Issue Desk</span>
            {openIssuesCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                {openIssuesCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Viewport */}
        {activeTab === 'courses' ? (
          <CourseListTable
            courses={courses}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        ) : (
          <IssueDeskView issues={issues} onUpdated={reloadData} />
        )}
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
