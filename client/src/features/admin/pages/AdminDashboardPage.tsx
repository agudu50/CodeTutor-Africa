import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Course } from '@/types'
import { courseStoreService } from '@/services/learning/course-store.service'
import { issueSupportService, IssueReport } from '@/services/support/issue-support.service'
import { gameStoreService } from '@/services/games/game-store.service'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { CourseListTable } from '../components/CourseListTable'
import { CourseEditorModal } from '../components/CourseEditorModal'
import { IssueDeskView } from '../components/IssueDeskView'
import { GameStudioView } from '../components/GameStudioView'
import { PracticeStudioView } from '../components/PracticeStudioView'
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
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'practice' | 'games' | 'issues'>('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [issues, setIssues] = useState<IssueReport[]>([])
  const [practiceCount, setPracticeCount] = useState<number>(() => practiceStoreService.getAllQuestions().length)
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const reloadData = () => {
    setCourses(courseStoreService.getAllCourses())
    setIssues(issueSupportService.getAllIssues())
    setPracticeCount(practiceStoreService.getAllQuestions().length)
  }

  useEffect(() => {
    reloadData()

    const handleCoursesUpdated = () => setCourses(courseStoreService.getAllCourses())
    const handleIssuesUpdated = () => setIssues(issueSupportService.getAllIssues())
    const handlePracticeUpdated = () => setPracticeCount(practiceStoreService.getAllQuestions().length)

    window.addEventListener('courses_updated', handleCoursesUpdated)
    window.addEventListener('issues_updated', handleIssuesUpdated)
    window.addEventListener('practice_updated', handlePracticeUpdated)

    return () => {
      window.removeEventListener('courses_updated', handleCoursesUpdated)
      window.removeEventListener('issues_updated', handleIssuesUpdated)
      window.removeEventListener('practice_updated', handlePracticeUpdated)
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
  const gameCounts = gameStoreService.getAllChallengesCount()

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Admin Operations & Curriculum Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage offline courses, configure practice test suites & arcade games, and review student feedback tickets.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              courseStoreService.resetToDefaults()
              gameStoreService.resetToDefaults()
              practiceStoreService.resetToDefaults()
              reloadData()
              setToastMessage('Platform reset to default courses, practice drills, and challenges.')
            }}
            className="h-9 text-xs font-semibold justify-center"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset All
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
          HIGH-LEVEL SUMMARY METRICS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 font-mono">
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Active Courses
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {courses.length}
            </span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            {totalLessons} total lessons
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Practice Challenges
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-[#005F02] dark:text-emerald-400">
              {practiceCount}
            </span>
            <Code2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            Automated test suites
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Arcade Game Drills
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {gameCounts.total}
            </span>
            <Gamepad2 className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            4 interactive modes
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-400 block tracking-wider">
            Support Tickets
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`text-xl sm:text-2xl font-bold ${openIssuesCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              {openIssuesCount}
            </span>
            <HelpCircle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block truncate">
            {issues.length} total tickets
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PORTAL TABS: COURSES vs PRACTICE vs GAME STUDIO vs ISSUE DESK
          ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="truncate">Courses</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
              {courses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'practice'
                ? 'bg-white dark:bg-slate-900 text-[#005F02] dark:text-emerald-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Practice Studio</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold shrink-0">
              {practiceCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('games')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Game Studio</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold shrink-0">
              {gameCounts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'issues'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Support Desk</span>
            {openIssuesCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold shrink-0">
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
        ) : activeTab === 'practice' ? (
          <PracticeStudioView onUpdated={reloadData} />
        ) : activeTab === 'games' ? (
          <GameStudioView onUpdated={reloadData} />
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
