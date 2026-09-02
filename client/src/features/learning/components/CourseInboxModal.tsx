import React, { useState, useEffect } from 'react'
import { issueSupportService, IssueReport, IssueStatus } from '@/services/support/issue-support.service'
import {
  X,
  Inbox,
  Info,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  User,
  Code2,
  SendHorizontal,
} from 'lucide-react'

interface CourseInboxModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseTitle: string
}

/* ─── Status helpers ─── */
const STATUS_CONFIG: Record<
  IssueStatus,
  { label: string; textClass: string; bgClass: string; borderClass: string; icon: React.FC<{ className?: string }> }
> = {
  open: {
    label: 'Open',
    textClass: 'text-sky-700 dark:text-sky-300',
    bgClass: 'bg-sky-50 dark:bg-sky-950/60',
    borderClass: 'border-sky-200 dark:border-sky-800',
    icon: Info,
  },
  in_review: {
    label: 'In Review',
    textClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-50 dark:bg-amber-950/60',
    borderClass: 'border-amber-200 dark:border-amber-800',
    icon: RefreshCw,
  },
  resolved: {
    label: 'Resolved',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  closed: {
    label: 'Closed',
    textClass: 'text-slate-600 dark:text-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800/60',
    borderClass: 'border-slate-300 dark:border-slate-700',
    icon: AlertCircle,
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  course_bug: 'Course Bug',
  practice_problem: 'Practice Problem',
  ai_tutor_feedback: 'AI Tutor Feedback',
  feature_suggestion: 'Feature Suggestion',
  other: 'Other',
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  return new Date(isoString).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/* ─── Single report card ─── */
const ReportCard: React.FC<{ report: IssueReport }> = ({ report }) => {
  const [expanded, setExpanded] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyCode, setReplyCode] = useState('')
  const [isCodeOpen, setIsCodeOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replySuccess, setReplySuccess] = useState(false)

  const cfg = STATUS_CONFIG[report.status]
  const StatusIcon = cfg.icon
  const hasReply = !!report.adminReply || !!(report.messages && report.messages.some((m) => m.senderRole === 'mentor'))

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || isSubmitting) return

    setIsSubmitting(true)
    issueSupportService.addMessage(report.id, {
      senderRole: 'learner',
      senderName: report.userName || 'Learner',
      message: replyText.trim(),
      codeSnippet: replyCode.trim() || undefined,
    })

    setReplyText('')
    setReplyCode('')
    setIsCodeOpen(false)
    setIsSubmitting(false)
    setReplySuccess(true)
    setTimeout(() => setReplySuccess(false), 3000)
  }

  return (
    <div
      className={`rounded-2xl border-2 transition-all ${
        hasReply && report.status !== 'closed'
          ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
      }`}
    >
      {/* Card Header */}
      <button
        type="button"
        className="w-full flex items-start gap-3 p-4 text-left cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Status icon */}
        <div
          className={`mt-0.5 p-1.5 rounded-lg border ${cfg.bgClass} ${cfg.borderClass} shrink-0`}
        >
          <StatusIcon className={`w-3.5 h-3.5 ${cfg.textClass}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {report.subject}
            </span>
            {hasReply && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                <MessageSquare className="w-3 h-3" />
                Mentor Replied
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${cfg.bgClass} ${cfg.borderClass} ${cfg.textClass}`}
            >
              {cfg.label}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {CATEGORY_LABELS[report.category] || report.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              <Clock className="w-3 h-3" />
              {timeAgo(report.createdAt)}
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="shrink-0 text-slate-400 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in duration-150">
          {/* Original report */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3 text-brand-500" />
              <span>Your Original Report</span>
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              {report.description}
            </p>
          </div>

          {/* Code snippet */}
          {report.codeSnippet && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3">
              <pre className="text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">
                {report.codeSnippet}
              </pre>
            </div>
          )}

          {/* Error message */}
          {report.errorMessage && (
            <div className="rounded-xl bg-red-950/40 border border-red-800/50 px-3 py-2">
              <span className="text-[10px] font-bold text-red-400 uppercase">Error</span>
              <p className="text-xs text-red-300 font-mono mt-0.5">{report.errorMessage}</p>
            </div>
          )}

          {/* ── Initial Mentor Reply (if present) ── */}
          {report.adminReply && (
            <div className="rounded-2xl border-2 border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-950/30 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-brand-100 dark:bg-brand-900 border border-brand-200 dark:border-brand-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {report.instructorName || 'Course Mentor / Lead Instructor'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {report.resolvedAt ? timeAgo(report.resolvedAt) : 'Mentor response'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line pl-9">
                {report.adminReply}
              </p>

              {/* Updated code from mentor */}
              {report.updatedCodeSnippet && (
                <div className="ml-9 rounded-xl bg-slate-950 border border-slate-800 p-3 mt-1">
                  <span className="text-[10px] font-bold text-brand-400 uppercase">Updated Code from Mentor</span>
                  <pre className="text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap mt-1">
                    {report.updatedCodeSnippet}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ── Follow-up Conversation Messages (Multi-turn Thread) ── */}
          {report.messages && report.messages.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Conversation Thread ({report.messages.length}):
              </span>
              {report.messages.map((msg) => {
                const isLearner = msg.senderRole === 'learner'
                return (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border-2 p-3.5 space-y-1.5 ${
                      isLearner
                        ? 'border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-950/40 ml-3 sm:ml-5'
                        : 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 mr-3 sm:mr-5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isLearner ? 'bg-brand-600 text-white' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {isLearner ? <User className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {msg.senderName}{' '}
                          {isLearner && <span className="text-[10px] font-normal text-slate-500">(You)</span>}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {timeAgo(msg.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line pl-8">
                      {msg.message}
                    </p>

                    {msg.codeSnippet && (
                      <div className="ml-8 rounded-xl bg-slate-950 border border-slate-800 p-2.5 mt-1">
                        <pre className="text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap">
                          {msg.codeSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {!hasReply && (!report.messages || report.messages.length === 0) && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Awaiting mentor response. You can post a follow-up or additional details below.
              </p>
            </div>
          )}

          {/* ── Interactive Reply-Back Composer ── */}
          <div className="pt-3 border-t-2 border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SendHorizontal className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Reply to Mentor / Add Details:</span>
              </span>
              {replySuccess && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Reply sent to mentor!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSendReply} className="space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response, follow-up question, or confirmation..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 focus:border-brand-500 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors resize-none"
              />

              {isCodeOpen && (
                <textarea
                  value={replyCode}
                  onChange={(e) => setReplyCode(e.target.value)}
                  placeholder="Paste revised code snippet here..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-700 focus:border-brand-500 bg-slate-950 text-xs text-emerald-300 placeholder-slate-600 font-mono focus:outline-none transition-colors resize-none"
                />
              )}

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsCodeOpen(!isCodeOpen)}
                  className="text-xs font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{isCodeOpen ? 'Remove code' : '+ Attach code'}</span>
                </button>

                <button
                  type="submit"
                  disabled={!replyText.trim() || isSubmitting}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <SendHorizontal className="w-3 h-3" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Modal ─── */
export const CourseInboxModal: React.FC<CourseInboxModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}) => {
  const [reports, setReports] = useState<IssueReport[]>([])

  useEffect(() => {
    if (!isOpen) return
    const load = () => {
      const all = issueSupportService.getAllIssues()
      setReports(all.filter((r) => r.courseId === courseId))
    }
    load()
    window.addEventListener('issues_updated', load)
    return () => window.removeEventListener('issues_updated', load)
  }, [isOpen, courseId])

  if (!isOpen) return null

  const repliedCount = reports.filter(
    (r) => r.adminReply || (r.messages && r.messages.some((m) => m.senderRole === 'mentor'))
  ).length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b-2 border-slate-100 dark:border-slate-800 shrink-0">
          <div className="space-y-0.5">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Inbox className="w-5 h-5 text-brand-500" />
              My Reports Inbox
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-brand-600 dark:text-brand-400 font-bold">{courseTitle}</span>
              {' · '}
              {reports.length} {reports.length === 1 ? 'report' : 'reports'}
              {repliedCount > 0 && (
                <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  · {repliedCount} {repliedCount === 1 ? 'reply' : 'replies'} received
                </span>
              )}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <Inbox className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No reports yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                Use the "Report Issue" button to send a question or issue to your mentor. Replies will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseInboxModal
