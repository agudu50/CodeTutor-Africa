import React, { useState, memo } from 'react'
import {
  IssueReport,
  IssueStatus,
  IssueCategory,
  issueSupportService,
} from '@/services/support/issue-support.service'
import { Button, Textarea } from '@/components/ui'
import {
  CheckCircle2,
  MessageSquare,
  Check,
  Shield,
  Code2,
  X,
} from 'lucide-react'

interface IssueDeskViewProps {
  issues: IssueReport[]
  onUpdated: () => void
}

export const IssueDeskView: React.FC<IssueDeskViewProps> = memo(({ issues, onUpdated }) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(
    issues[0]?.id || null
  )
  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all')
  const [replyText, setReplyText] = useState('')
  const [isSendingReply, setIsSendingReply] = useState(false)

  const filteredIssues = issues.filter((i) => {
    if (statusFilter === 'all') return true
    return i.status === statusFilter
  })

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || filteredIssues[0]

  const handleStatusChange = (id: string, newStatus: IssueStatus) => {
    issueSupportService.updateIssueStatus(id, newStatus)
    onUpdated()
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIssue || !replyText.trim()) return

    setIsSendingReply(true)
    await new Promise((r) => setTimeout(r, 400))

    issueSupportService.updateIssueStatus(
      selectedIssue.id,
      selectedIssue.status === 'open' ? 'in_review' : selectedIssue.status,
      replyText.trim()
    )

    setReplyText('')
    setIsSendingReply(false)
    onUpdated()
  }

  const handleDeleteIssue = (id: string) => {
    if (confirm('Delete this support ticket from the registry?')) {
      issueSupportService.deleteIssue(id)
      onUpdated()
    }
  }

  const getCategoryLabel = (cat: IssueCategory) => {
    switch (cat) {
      case 'course_bug':
        return 'Course Content'
      case 'practice_problem':
        return 'Practice Bug'
      case 'ai_tutor_feedback':
        return 'AI Tutor'
      case 'offline_sync':
        return 'Offline Sync'
      case 'feature_suggestion':
        return 'Feature Suggestion'
      default:
        return 'General'
    }
  }

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Tickets ({issues.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'open'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Open ({issues.filter((i) => i.status === 'open').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in_review')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'in_review'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            In Review ({issues.filter((i) => i.status === 'in_review').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              statusFilter === 'resolved'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Resolved ({issues.filter((i) => i.status === 'resolved').length})
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Instant Offline Support Desk
        </span>
      </div>

      {/* 2-Column Support Layout: List (Left) & Ticket Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Ticket Feed */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-60" />
              <p className="text-xs font-semibold">No issues in this view.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const isSelected = selectedIssue?.id === issue.id
              const priorityBadge =
                issue.priority === 'urgent' || issue.priority === 'high'
                  ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                  : issue.priority === 'medium'
                  ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'

              const statusBadge =
                issue.status === 'resolved'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : issue.status === 'in_review'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                  : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'

              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 select-none ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-brand-500 shadow-md ring-1 ring-brand-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800">
                      {getCategoryLabel(issue.category)}
                    </span>

                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md border font-bold uppercase ${priorityBadge}`}>
                        {issue.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-bold uppercase ${statusBadge}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {issue.subject}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="truncate">{issue.userName}</span>
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Right Column: Selected Ticket Inspector */}
        <div className="lg:col-span-7">
          {selectedIssue ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4 text-slate-900 dark:text-slate-100">
              {/* Header Details */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      #{selectedIssue.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-mono text-slate-500">
                      {getCategoryLabel(selectedIssue.category)}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedIssue.subject}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteIssue(selectedIssue.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  title="Delete ticket"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Submitter Bio */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center border border-brand-200 dark:border-brand-800">
                    {selectedIssue.userName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block font-sans">
                      {selectedIssue.userName}
                    </span>
                    <span className="text-[11px] text-slate-400">{selectedIssue.userEmail}</span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <span>{new Date(selectedIssue.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase">
                  Status:
                </span>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedIssue.id, 'open')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                    selectedIssue.status === 'open'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedIssue.id, 'in_review')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                    selectedIssue.status === 'in_review'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  In Review
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedIssue.id, 'resolved')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                    selectedIssue.status === 'resolved'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Resolved
                </button>
              </div>

              {/* Description Content */}
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-slate-50/60 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <p>{selectedIssue.description}</p>
              </div>

              {/* Code snippet if present */}
              {selectedIssue.codeSnippet && (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Code2 className="w-3 h-3" /> Submitted Code / Trace
                  </span>
                  <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">
                    {selectedIssue.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Admin Reply History */}
              {selectedIssue.adminReply && (
                <div className="p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/80 space-y-1 text-xs">
                  <span className="font-mono font-bold text-[11px] text-brand-700 dark:text-brand-400 uppercase flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Admin Response / Patch Note:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                    {selectedIssue.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Send Response / Solution Note
                </label>
                <Textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an administrative answer, patch note, or resolution update..."
                  className="text-xs font-sans"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    isLoading={isSendingReply}
                    className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Post Admin Reply & Update
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">Select an issue from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

IssueDeskView.displayName = 'IssueDeskView'
