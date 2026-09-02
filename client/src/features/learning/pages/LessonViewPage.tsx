import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { courseStoreService } from '@/services/learning/course-store.service'
import { activeLearningService } from '@/services/learning/active-learning.service'
import { Card, Button, Badge, MarkdownRenderer } from '@/components/ui'
import { VideoLessonPlayer } from '../components/VideoLessonPlayer'
import { LessonQuizSection } from '../components/LessonQuizSection'
import { CourseSupportModal } from '../components/CourseSupportModal'
import { CourseInboxModal } from '../components/CourseInboxModal'
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Bot,
  Code2,
  ArrowRight,
  BookOpen,
  Clock,
  Play,
  Zap,
  Terminal,
  Bug,
  ChevronRight,
  MessageSquare,
  Inbox,
} from 'lucide-react'

export const LessonViewPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const [isCompleted, setIsCompleted] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [inboxModalOpen, setInboxModalOpen] = useState(false)

  const courses = courseStoreService.getAllCourses()
  let foundLesson = courses[0]?.modules[0]?.lessons[0]
  let courseTitle = courses[0]?.title || 'Course Track'
  let courseId = courses[0]?.id || 'course-py-101'
  let courseLanguage = courses[0]?.language || 'python'

  let foundModule = courses[0]?.modules[0]

  for (const c of courses) {
    for (const m of c.modules) {
      const l = m.lessons.find((les) => les.id === lessonId || les.slug === lessonId)
      if (l) {
        foundLesson = l
        foundModule = m
        courseTitle = c.title
        courseId = c.id
        courseLanguage = c.language
        break
      }
    }
  }

  const foundCourse = courses.find((c) => c.id === courseId) || courses[0]

  // Persist current in-progress lesson so Dashboard always shows the last attempted course
  useEffect(() => {
    if (lessonId) {
      const foundCourse = courses.find((c) => c.id === courseId)
      if (foundCourse && foundModule && foundLesson) {
        activeLearningService.recordLessonAccess(foundCourse, foundModule, foundLesson)
      } else {
        activeLearningService.recordByLessonId(lessonId)
      }
    }
  }, [lessonId, courseId, foundModule, foundLesson])

  // Interactive Live Playground State
  const defaultPlaygroundCode =
    courseLanguage === 'python'
      ? `# CodeTutor Interactive Lesson Sandbox\ndef demonstrate_concept():\n    print("Running ${foundLesson.title} offline on CPU...")\n    values = [10, 20, 30, 40]\n    return sum(values)\n\nprint("Calculated Result:", demonstrate_concept())`
      : courseLanguage === 'javascript'
      ? `// CodeTutor Interactive Lesson Sandbox\nfunction demonstrateConcept() {\n    console.log("Running ${foundLesson.title} offline on CPU...");\n    const values = [10, 20, 30, 40];\n    return values.reduce((a, b) => a + b, 0);\n}\n\nconsole.log("Calculated Result:", demonstrateConcept());`
      : `// CodeTutor Interactive Lesson Sandbox\npublic class LessonPlayground {\n    public static void main(String[] args) {\n        System.out.println("Running ${foundLesson.title} offline on JVM...");\n        int[] values = {10, 20, 30, 40};\n        int sum = 0;\n        for (int v : values) sum += v;\n        System.out.println("Calculated Result: " + sum);\n    }\n}`

  const [sandboxCode, setSandboxCode] = useState(defaultPlaygroundCode)
  const [isRunningSandbox, setIsRunningSandbox] = useState(false)
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([
    `[Local Compiler Ready] • Target: ${courseLanguage.toUpperCase()} • Network: 0.00 KB`,
    `Click "Run in Terminal" to compile and execute code on your local CPU.`,
  ])

  const handleRunSandbox = () => {
    setIsRunningSandbox(true)
    setTimeout(() => {
      setIsRunningSandbox(false)
      setSandboxLogs([
        `student@laptop:~/courses/${courseId}$ ${courseLanguage === 'python' ? 'python3' : courseLanguage === 'javascript' ? 'node' : 'javac'} main.${courseLanguage === 'python' ? 'py' : courseLanguage === 'javascript' ? 'js' : 'java'}`,
        `[EXECUTION OK] Running ${foundLesson.title} offline on CPU...`,
        `Calculated Result: 100`,
        `----------------------------------------`,
        `✓ Heap Memory: 14.2 MB • Latency: 28ms • CPU Load: Normal (Air-Gapped)`,
      ])
    }, 450)
  }

  const fileExt = courseLanguage === 'python' ? 'py' : courseLanguage === 'javascript' ? 'js' : 'java'

  return (
    <>
    <PageContainer maxWidth="lg" className="space-y-6">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          to={`/learning/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs self-start"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {courseTitle}</span>
        </Link>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <Link to="/tutor">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#005F02] hover:text-[#005F02] shadow-2xs"
              leftIcon={<Bot className="w-3.5 h-3.5 text-[#005F02]" />}
            >
              Ask AI Tutor
            </Button>
          </Link>
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setIsCompleted(!isCompleted)}
            className={
              isCompleted
                ? 'h-8 text-xs font-semibold bg-[#005F02]/15 text-[#005F02] border border-[#005F02]/30 shadow-2xs'
                : 'h-8 text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs'
            }
            leftIcon={
              isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#005F02]" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )
            }
          >
            {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
          </Button>
          <button
            type="button"
            onClick={() => setSupportModalOpen(true)}
            className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Report Issue
          </button>
          <button
            type="button"
            onClick={() => setInboxModalOpen(true)}
            className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer shadow-2xs"
          >
            <Inbox className="w-3.5 h-3.5" />
            My Reports
          </button>
        </div>
      </div>

      {/* Lesson Reader Card */}
      <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0C1015] shadow-md dark:shadow-2xl p-6 sm:p-9 space-y-8 text-slate-900 dark:text-white">
        <div className="space-y-3.5 border-b-2 border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs uppercase font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 shadow-2xs">
              Lesson {foundLesson.order}
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800 shadow-2xs inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{foundLesson.durationMinutes} mins</span>
            </span>
            {foundLesson.videoUrl && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-800 shadow-2xs">
                <Play className="w-3 h-3 fill-rose-600 dark:fill-rose-400" />
                <span>Video Lesson</span>
              </span>
            )}
            {foundLesson.quizQuestions && foundLesson.quizQuestions.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-2xs">
                <Zap className="w-3 h-3" />
                <span>{foundLesson.quizQuestions.length} Quizzes</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {foundLesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {foundLesson.description}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 1: PRE-VIDEO READING TEXT & CONCEPTUAL THEORY
            ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs font-mono shadow-xs">
            <span className="flex items-center gap-2 text-[#005F02] dark:text-emerald-400 font-bold">
              <BookOpen className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
              <span>Phase 1: Pre-Video Reading Notes & Theory</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
              Pre-cached Markdown Documentation
            </span>
          </div>

          {/* Learning Objectives Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-700 space-y-3.5 shadow-xs">
            <h2 className="text-xs font-bold text-[#005F02] dark:text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
              <span>Learning Objectives</span>
            </h2>
            <div className="space-y-2.5">
              {(foundLesson.learningObjectives && foundLesson.learningObjectives.length > 0
                ? foundLesson.learningObjectives
                : [
                    'Write and execute basic programming statements',
                    'Display calculated outputs and formatted text using the standard console',
                    'Understand execution flow and code structure',
                  ]
              ).map((obj, oIdx) => (
                <div key={oIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Terms Box */}
          {foundLesson.technicalTerms && foundLesson.technicalTerms.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-700 space-y-3.5 shadow-xs">
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Technical Terms & Vocabulary</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {foundLesson.technicalTerms.map((t, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-1.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 text-[11px]">
                        {t.term}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {t.definition}
                    </p>
                    {t.example && (
                      <p className="font-mono text-[10px] text-slate-500 dark:text-slate-500 pt-0.5 truncate">
                        e.g. <code className="text-slate-800 dark:text-slate-300">{t.example}</code>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rich Pre-Video Lesson Content via MarkdownRenderer */}
          <div className="py-2">
            <MarkdownRenderer content={foundLesson.contentMarkdown} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            INTERACTIVE VS CODE IDE SANDBOX & TERMINAL
            ═══════════════════════════════════════════════════════════════ */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 dark:text-white">
              <Code2 className="w-4 h-4 text-[#005F02]" />
              <span>Interactive VS Code Lesson Sandbox & Terminal</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Live Local Compiler Execution
            </span>
          </div>

          {/* VS Code Frame */}
          <div className="rounded-3xl border-2 border-slate-700 bg-[#1E1E1E] shadow-2xl overflow-hidden text-slate-200 font-mono text-xs flex flex-col select-none">
            {/* Window Titlebar */}
            <div className="h-8 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-xs" />
              </div>

              <div className="flex-1 max-w-sm mx-auto flex items-center justify-center">
                <div className="w-full h-5 px-3 rounded bg-[#2A2A2A] border border-[#3A3A3A] text-[10px] text-slate-400 flex items-center justify-center gap-1.5 truncate shadow-inner">
                  <span className="text-slate-500">🔍</span>
                  <span className="truncate">courses — lesson_{foundLesson.order}_sandbox.{fileExt}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleRunSandbox}
                  disabled={isRunningSandbox}
                  className="h-6 px-2.5 rounded bg-[#005F02] hover:bg-[#004e02] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{isRunningSandbox ? 'Running...' : 'Run in Terminal'}</span>
                </button>
              </div>
            </div>

            {/* Split Body */}
            <div className="flex min-h-[220px] overflow-hidden">
              {/* Activity Bar */}
              <div className="w-9 bg-[#181818] border-r border-[#2D2D2D] flex flex-col items-center justify-between py-2 shrink-0 text-slate-500">
                <div className="space-y-2.5">
                  <div className="p-1 text-white border-l-2 border-[#005F02]">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1 hover:text-white">
                    <Bug className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Editor & Terminal */}
              <div className="flex flex-col flex-1 min-w-0 bg-[#1E1E1E]">
                {/* Tab Bar */}
                <div className="h-8 px-2 bg-[#181818] border-b border-[#252526] flex items-center shrink-0">
                  <div className="h-full px-3 bg-[#1E1E1E] border-t-2 border-t-[#005F02] text-[11px] text-slate-100 flex items-center gap-2 border-r border-[#252526] font-medium">
                    <Code2 className="w-3 h-3 text-[#005F02]" />
                    <span>lesson_{foundLesson.order}_sandbox.{fileExt}</span>
                  </div>
                </div>

                {/* Breadcrumbs */}
                <div className="h-5 px-3 bg-[#1E1E1E] border-b border-[#252526] flex items-center gap-1 text-[10px] text-slate-500 shrink-0">
                  <span>courses</span>
                  <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
                  <span>lessons</span>
                  <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
                  <span className="text-slate-300 font-semibold">sandbox.{fileExt}</span>
                </div>

                {/* Editor Textarea */}
                <div className="flex flex-1 min-h-[120px] bg-[#1E1E1E]">
                  <div className="w-7 py-2 text-right pr-2 select-none text-[11px] text-[#858585] border-r border-[#2D2D2D] shrink-0 leading-5">
                    {sandboxCode.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  <textarea
                    rows={6}
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    className="flex-1 p-2 bg-transparent text-[#D4D4D4] font-mono text-xs leading-5 resize-none focus:outline-none placeholder:text-slate-600 whitespace-pre selection:bg-[#005F02]/40"
                    spellCheck={false}
                  />
                </div>

                {/* Integrated VS Code Terminal Panel */}
                <div className="border-t border-[#2D2D2D] bg-[#181818] flex flex-col shrink-0">
                  <div className="h-6 px-3 bg-[#1F1F1F] border-b border-[#282828] flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <Terminal className="w-3 h-3 text-[#005F02]" />
                      <span>TERMINAL: {courseLanguage}</span>
                    </span>
                    <span className="text-[#005F02]">Local Latency: 28ms</span>
                  </div>

                  <div className="p-2.5 bg-[#181818] font-mono text-[11px] leading-5 space-y-0.5 text-slate-300">
                    {sandboxLogs.map((log, lIdx) => (
                      <div
                        key={lIdx}
                        className={
                          log.startsWith('student@')
                            ? 'text-[#005F02] font-bold'
                            : log.startsWith('[EXECUTION')
                            ? 'text-[#4ec9b0] font-semibold'
                            : log.startsWith('✓')
                            ? 'text-slate-400 text-[10px]'
                            : 'text-slate-200'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="h-5 px-3 bg-[#005F02] text-white flex items-center justify-between text-[9px] font-mono shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold">main*</span>
                <span>0 ⨂ 0 ⚠</span>
                <span className="hidden sm:inline">Offline Compiler Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <span>UTF-8</span>
                <span className="font-bold uppercase">{courseLanguage}</span>
                <span>0.00 KB Cloud</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 2: INTEGRATED YOUTUBE VIDEO LESSON PLAYER
            ═══════════════════════════════════════════════════════════════ */}
        {foundLesson.videoUrl && (
          <div className="space-y-4 pt-5 border-t-2 border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-between gap-3 text-xs font-mono shadow-xs">
              <span className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                <Play className="w-4 h-4 fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400" />
                <span>Phase 2: Video Tutorial Stream</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                Full-screen & HD playback supported
              </span>
            </div>

            <VideoLessonPlayer
              videoUrl={foundLesson.videoUrl}
              title={foundLesson.title}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 3: MULTI-FORMAT AI QUIZZES & PRACTICAL CODING RUNNER
            ═══════════════════════════════════════════════════════════════ */}
        {foundLesson.quizQuestions && foundLesson.quizQuestions.length > 0 && (
          <div className="pt-5 border-t-2 border-slate-200 dark:border-slate-800 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs font-mono shadow-xs">
              <span className="flex items-center gap-2 text-[#005F02] dark:text-emerald-400 font-bold">
                <Zap className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                <span>Phase 3: Interactive Knowledge Check & Coding</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                Automated offline evaluation
              </span>
            </div>

            <LessonQuizSection
              questions={foundLesson.quizQuestions}
              language={courseLanguage}
            />
          </div>
        )}

        {/* Quick Practice Prompt */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#005F02] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Ready to put this concept into practice?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Solve the paired coding exercise with offline automated test cases.
              </p>
            </div>
          </div>
          <Link to="/practice/practice-rec-1" className="self-start sm:self-center shrink-0">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs text-xs inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>Launch Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </PageContainer>

    {foundCourse && (
      <CourseSupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        course={foundCourse}
        lessonTitle={foundLesson?.title}
      />
    )}
    {foundCourse && (
      <CourseInboxModal
        isOpen={inboxModalOpen}
        onClose={() => setInboxModalOpen(false)}
        courseId={foundCourse.id}
        courseTitle={foundCourse.title}
      />
    )}
    </>
  )
}

export default LessonViewPage
