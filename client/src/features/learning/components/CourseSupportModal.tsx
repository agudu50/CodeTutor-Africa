import React, { useState, useEffect, useRef } from 'react'
import { Course } from '@/types'
import { issueSupportService, IssueCategory, IssuePriority } from '@/services/support/issue-support.service'
import {
  X,
  AlertTriangle,
  Lightbulb,
  Bug,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  SendHorizontal,
  GraduationCap,
  User,
  ShieldCheck,
} from 'lucide-react'

interface CourseSupportModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course
  /** Pass 'admin' when the modal is opened from an admin context */
  submitterRole?: 'learner' | 'admin'
  /** Pre-fill lesson context */
  lessonTitle?: string
}

const CATEGORY_OPTIONS: { id: IssueCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'course_bug', label: 'Course Bug / Error', icon: Bug },
  { id: 'practice_problem', label: 'Practice Problem', icon: AlertTriangle },
  { id: 'ai_tutor_feedback', label: 'AI Tutor Feedback', icon: MessageSquare },
  { id: 'feature_suggestion', label: 'Feature Suggestion', icon: Lightbulb },
  { id: 'other', label: 'Other / General', icon: HelpCircle },
]

const PRIORITY_OPTIONS: { id: IssuePriority; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'urgent', label: 'Urgent' },
]

/* ─── tiny custom select ─── */
function CustomSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { id: T; label: string }[]
  value: T | ''
  onChange: (v: T) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find((o) => o.id === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm font-medium transition-colors cursor-pointer ${
          open
            ? 'border-brand-500 ring-2 ring-brand-500/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-brand-400'
        } ${selected ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-[60] mt-1.5 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in duration-100">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange(opt.id)
                setOpen(false)
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>{opt.label}</span>
              {value === opt.id && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const CourseSupportModal: React.FC<CourseSupportModalProps> = ({
  isOpen,
  onClose,
  course,
  submitterRole = 'learner',
  lessonTitle,
}) => {
  const mentorLabel = course.mentorName || course.instructorName || 'Lead Mentor'

  const [subject, setSubject] = useState(lessonTitle ? `Issue with lesson: ${lessonTitle}` : '')
  const [category, setCategory] = useState<IssueCategory | ''>('')
  const [priority, setPriority] = useState<IssuePriority | ''>('')
  const [description, setDescription] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submittedByRole, setSubmittedByRole] = useState<'learner' | 'admin'>(submitterRole)
  const [userName, setUserName] = useState(submitterRole === 'admin' ? 'Lead Curriculum Director (Admin)' : '')
  const [userEmail, setUserEmail] = useState(submitterRole === 'admin' ? 'admin@codetutor.africa' : '')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setSubject(lessonTitle ? `Issue with lesson: ${lessonTitle}` : '')
      setCategory('')
      setPriority('')
      setDescription('')
      setCodeSnippet('')
      setErrorMessage('')
      setSubmitted(false)
      setErrors({})
      setSubmittedByRole(submitterRole)
      setUserName(submitterRole === 'admin' ? 'Lead Curriculum Director (Admin)' : '')
      setUserEmail(submitterRole === 'admin' ? 'admin@codetutor.africa' : '')
    }
  }, [isOpen, lessonTitle, submitterRole])

  if (!isOpen) return null

  const validate = () => {
    const e: Record<string, string> = {}
    if (!subject.trim()) e.subject = 'Subject is required'
    if (!category) e.category = 'Please select a category'
    if (!priority) e.priority = 'Please select a priority'
    if (!description.trim()) e.description = 'Description is required'
    if (!userName.trim()) e.userName = 'Your name is required'
    if (!userEmail.trim()) e.userEmail = 'Your email is required'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) {
      setErrors(v)
      return
    }

    issueSupportService.submitIssue({
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userRole: submittedByRole === 'admin' ? 'Admin — Course Supervisor' : 'Learner',
      subject: subject.trim(),
      category: category as IssueCategory,
      priority: priority as IssuePriority,
      description: description.trim(),
      codeSnippet: codeSnippet.trim() || undefined,
      errorMessage: errorMessage.trim() || undefined,
      courseId: course.id,
      courseName: course.title,
      submittedByRole,
      instructorName: mentorLabel,
    })

    setSubmitted(true)
  }

  /* ─── Success State ─── */
  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-8 flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Report Submitted</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
            Your report for{' '}
            <span className="font-bold text-slate-900 dark:text-white">{course.title}</span> has been sent to{' '}
            <span className="font-semibold text-brand-600 dark:text-brand-400">{mentorLabel}</span>. You will receive
            a response in the Issues Desk shortly.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 px-6 py-2.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-sm transition-all cursor-pointer active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  /* ─── Form ─── */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b-2 border-slate-100 dark:border-slate-800 shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Report Issue / Request Support
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Course:{' '}
              <span className="text-brand-600 dark:text-brand-400 font-bold">{course.title}</span>
              {' · '}
              Mentor:{' '}
              <span className="text-slate-700 dark:text-slate-300 font-bold">{mentorLabel}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Who is submitting */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex-wrap">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Submitting as
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => {
                  setSubmittedByRole('learner')
                  setUserName('')
                  setUserEmail('')
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                  submittedByRole === 'learner'
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-400 text-brand-700 dark:text-brand-300'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Learner
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedByRole('admin')
                  setUserName('Lead Curriculum Director (Admin)')
                  setUserEmail('admin@codetutor.africa')
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                  submittedByRole === 'admin'
                    ? 'bg-violet-50 dark:bg-violet-950/60 border-violet-400 text-violet-700 dark:text-violet-300'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Kofi Mensah"
                className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.userName
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-brand-500'
                }`}
              />
              {errors.userName && <p className="text-xs text-red-500 font-semibold">{errors.userName}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="e.g. kofi@knust.edu.gh"
                className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                  errors.userEmail
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-slate-300 dark:border-slate-700 focus:border-brand-500'
                }`}
              />
              {errors.userEmail && <p className="text-xs text-red-500 font-semibold">{errors.userEmail}</p>}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Module 3 quiz answer key is incorrect"
              className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                errors.subject
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-brand-500'
              }`}
            />
            {errors.subject && <p className="text-xs text-red-500 font-semibold">{errors.subject}</p>}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Category <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(v) => setCategory(v)}
                placeholder="-- Select category --"
              />
              {errors.category && <p className="text-xs text-red-500 font-semibold">{errors.category}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Priority <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={PRIORITY_OPTIONS}
                value={priority}
                onChange={(v) => setPriority(v)}
                placeholder="-- Select priority --"
              />
              {errors.priority && <p className="text-xs text-red-500 font-semibold">{errors.priority}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue or request in detail. Include steps to reproduce if applicable."
              rows={4}
              className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors resize-none ${
                errors.description
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-brand-500'
              }`}
            />
            {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description}</p>}
          </div>

          {/* Code Snippet (optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              Code Snippet
              <span className="text-[10px] font-normal text-slate-400 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Paste relevant code here..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-700 focus:border-brand-500 bg-slate-950 text-sm text-emerald-300 placeholder-slate-600 focus:outline-none transition-colors resize-none font-mono"
            />
          </div>

          {/* Error Message (optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              Error Message
              <span className="text-[10px] font-normal text-slate-400 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="e.g. TypeError: Cannot read property 'map' of undefined"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 focus:border-brand-500 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Mentor note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
            <GraduationCap className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This report will be reviewed by{' '}
              <span className="font-bold text-slate-800 dark:text-slate-200">{mentorLabel}</span> and tracked in the
              Admin Issues Desk. You will be notified when it is resolved.
            </p>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-sm transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <SendHorizontal className="w-4 h-4" />
            Submit Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseSupportModal
