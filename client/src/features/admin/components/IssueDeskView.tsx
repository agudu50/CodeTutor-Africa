import React, { useState, useEffect, memo } from 'react'
import {
  IssueReport,
  IssueStatus,
  IssueCategory,
  issueSupportService,
} from '@/services/support/issue-support.service'
import { aiService } from '@/services/ai/ai.service'
import { AnalyzeTicketResponse } from '@/services/ai/ai.types'
import { Button, Textarea, Input } from '@/components/ui'
import { CodeBlock } from '@/features/tutor/components/CodeBlock'
import {
  CheckCircle2,
  MessageSquare,
  Check,
  Shield,
  X,
  Search,
  ChevronLeft,
  Clock,
  GraduationCap,
  Zap,
  Quote,
  Bot,
  Lightbulb,
  Code2,
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
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')
  const [updatedCodeText, setUpdatedCodeText] = useState('')
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false)
  const [isAnalyzingTicket, setIsAnalyzingTicket] = useState(false)
  const [aiDiagnosis, setAiDiagnosis] = useState<AnalyzeTicketResponse | null>(null)

  const filteredIssues = issues.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        i.subject.toLowerCase().includes(q) ||
        i.userName.toLowerCase().includes(q) ||
        i.userEmail.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      )
    }
    return true
  })

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || filteredIssues[0]

  useEffect(() => {
    if (selectedIssue) {
      setUpdatedCodeText(selectedIssue.updatedCodeSnippet || '')
      if (selectedIssue.updatedCodeSnippet) {
        setIsCodeEditorOpen(true)
      }
    }
  }, [selectedIssue?.id])

  const handleSelectIssue = (id: string) => {
    setSelectedIssueId(id)
    setIsMobileDetailOpen(true)
    setAiDiagnosis(null) // Reset analysis for newly selected issue
    const target = issues.find((i) => i.id === id)
    setUpdatedCodeText(target?.updatedCodeSnippet || '')
    setIsCodeEditorOpen(Boolean(target?.updatedCodeSnippet))
  }

  const handleStatusChange = (id: string, newStatus: IssueStatus) => {
    issueSupportService.updateIssueStatus(id, newStatus)
    onUpdated()
  }

  // ══════════════════════════════════════════════════════════════════════
  // AI TICKET & ROOT CAUSE DIAGNOSIS ASSISTANT
  // ══════════════════════════════════════════════════════════════════════
  const handleAnalyzeTicketWithAI = async () => {
    if (!selectedIssue) return

    setIsAnalyzingTicket(true)
    try {
      const result = await aiService.analyzeTicketIssue({
        subject: selectedIssue.subject,
        category: selectedIssue.category,
        description: selectedIssue.description,
        codeSnippet: selectedIssue.codeSnippet,
        studentName: selectedIssue.userName,
      })
      setAiDiagnosis(result)
      if (result.updatedCode) {
        setUpdatedCodeText(result.updatedCode)
        setIsCodeEditorOpen(true)
      }
    } catch (e) {
      console.error('Failed to analyze ticket with AI', e)
    } finally {
      setIsAnalyzingTicket(false)
    }
  }

  const handleApplyAISuggestion = () => {
    if (!aiDiagnosis) return
    setReplyText(aiDiagnosis.suggestedReply)
    if (aiDiagnosis.updatedCode) {
      setUpdatedCodeText(aiDiagnosis.updatedCode)
      setIsCodeEditorOpen(true)
    }
    if (selectedIssue && aiDiagnosis.suggestedStatus) {
      issueSupportService.updateIssueStatus(
        selectedIssue.id,
        aiDiagnosis.suggestedStatus,
        aiDiagnosis.suggestedReply,
        aiDiagnosis.updatedCode || updatedCodeText.trim() || undefined
      )
      onUpdated()
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIssue || !replyText.trim()) return

    setIsSendingReply(true)
    await new Promise((r) => setTimeout(r, 400))

    issueSupportService.updateIssueStatus(
      selectedIssue.id,
      selectedIssue.status === 'open' ? 'in_review' : selectedIssue.status,
      replyText.trim(),
      updatedCodeText.trim() || undefined
    )

    setReplyText('')
    setIsSendingReply(false)
    onUpdated()
  }

  const handleDeleteIssue = (id: string) => {
    issueSupportService.deleteIssue(id)
    onUpdated()
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

  const getInstitutionBadge = (email: string) => {
    if (!email) return 'Learner'
    const domain = email.split('@')[1]?.toLowerCase() || ''
    if (domain.includes('knust')) return 'KNUST Student'
    if (domain.includes('ug.edu') || domain.includes('ug.gh')) return 'UG Legon'
    if (domain.includes('ashesi')) return 'Ashesi Univ'
    if (domain.includes('ucc')) return 'UCC'
    if (domain.includes('alx')) return 'ALX Scholar'
    return 'Active Learner'
  }

  const detectLanguage = (snippet?: string, subject?: string) => {
    const text = `${snippet || ''} ${subject || ''}`.toLowerCase()
    if (text.includes('def ') || text.includes('import ') || text.includes('python') || text.includes('is_palindrome')) return 'python'
    if (text.includes('public class') || text.includes('system.out') || text.includes('java')) return 'java'
    if (text.includes('const ') || text.includes('function') || text.includes('javascript') || text.includes('=>') || text.includes('useeffect')) return 'javascript'
    return 'python'
  }

  const QUICK_REPLIES = [
    'Thanks for pointing this out! I have clarified the whitespace trimming requirement in the problem description.',
    'Great catch! The test suite assertion boundary has been updated. Please re-run your solution.',
    'Your approach is solid! Remember that in this challenge, punctuation and casing must also be normalized.',
    'Under investigation with our curriculum team. We will push an update in the next offline sync bundle.',
  ]

  return (
    <div className="space-y-4">
      {/* Top Filter & Status Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs font-semibold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
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
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
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
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              statusFilter === 'resolved'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Resolved ({issues.filter((i) => i.status === 'resolved').length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search student, topic, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs font-sans h-8 w-full"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HUMAN-CENTERED BALANCED MASTER-DETAIL SUPPORT SHELL
          ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[750px]">
        {/* LEFT COLUMN: TICKET INBOX STREAM (lg:col-span-5) */}
        <div
          className={`lg:col-span-5 flex flex-col h-full bg-slate-50/70 dark:bg-slate-950/60 lg:border-r border-slate-200 dark:border-slate-800 ${
            isMobileDetailOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Inbox Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-100/60 dark:bg-slate-900/60">
            <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Student Inquiries ({filteredIssues.length})</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Community Desk
            </span>
          </div>

          {/* Scrollable Ticket List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-60" />
                <p className="text-xs font-semibold">No issues matching this filter.</p>
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
                    onClick={() => handleSelectIssue(issue.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 select-none ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-brand-500 shadow-sm ring-1 ring-brand-500/30'
                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800">
                          {getCategoryLabel(issue.category)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded-md border font-bold uppercase ${priorityBadge}`}>
                          {issue.priority}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-md border font-bold uppercase ${statusBadge}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {issue.subject}
                    </h5>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                        <div className="w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-[9px] flex items-center justify-center shrink-0">
                          {issue.userName.charAt(0)}
                        </div>
                        <span className="truncate">{issue.userName}</span>
                      </div>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: HUMAN-CENTERED TICKET INSPECTOR & RESPONSE DESK (lg:col-span-7) */}
        <div
          className={`lg:col-span-7 flex flex-col h-full bg-white dark:bg-slate-900 ${
            !isMobileDetailOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {selectedIssue ? (
            <>
              {/* Header Details with Mobile Back Button and AI Analyzer Action */}
              <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 shrink-0 bg-slate-50/40 dark:bg-slate-950/40">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Mobile Back Button */}
                    <button
                      type="button"
                      onClick={() => setIsMobileDetailOpen(false)}
                      className="lg:hidden px-2.5 py-1 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 mr-1 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Inbox</span>
                    </button>

                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                      #{selectedIssue.id}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">
                      {getCategoryLabel(selectedIssue.category)}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {getInstitutionBadge(selectedIssue.userEmail)}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedIssue.subject}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  {/* AI Analyze Ticket Action Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    isLoading={isAnalyzingTicket}
                    onClick={handleAnalyzeTicketWithAI}
                    className="h-8 text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50/70 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800 hover:bg-brand-100"
                    leftIcon={<Bot className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
                  >
                    {isAnalyzingTicket ? 'Analyzing...' : 'Analyze with AI'}
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleDeleteIssue(selectedIssue.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                    title="Delete ticket"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Inspector Body */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
                {/* Human Submitter Bio Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                      {selectedIssue.userName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">
                          {selectedIssue.userName}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Verified Student
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{selectedIssue.userEmail}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono shrink-0 sm:self-center">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(selectedIssue.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Status Action Switcher with Human State Explanations */}
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 uppercase">
                      Ticket Stage:
                    </span>
                    <div className="grid grid-cols-2 sm:flex items-center gap-1.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedIssue.id, 'open')}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer text-center truncate ${
                          selectedIssue.status === 'open'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        Attention
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedIssue.id, 'in_review')}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer text-center truncate ${
                          selectedIssue.status === 'in_review'
                            ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        In Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedIssue.id, 'resolved')}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer text-center truncate ${
                          selectedIssue.status === 'resolved'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        Resolved ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(selectedIssue.id, 'closed')}
                        className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer text-center truncate ${
                          selectedIssue.status === 'closed'
                            ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        Closed
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 block text-right sm:text-left">
                    {selectedIssue.status === 'resolved' || selectedIssue.status === 'closed' ? 'Archived Ticket' : 'Active Ticket'}
                  </span>
                </div>

                {/* Human Dialogue Narrative / Student Issue Summary */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs">
                  <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Student Feedback & Context:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans pl-1 leading-relaxed">
                    {selectedIssue.description}
                  </p>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    SYNTAX HIGHLIGHTED SUBMITTED CODE (VS CODE DARK THEME)
                    ═══════════════════════════════════════════════════════════ */}
                {selectedIssue.codeSnippet && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        <span>Submitted Code / Traceback</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {detectLanguage(selectedIssue.codeSnippet, selectedIssue.subject)}
                      </span>
                    </div>

                    <CodeBlock
                      code={selectedIssue.codeSnippet}
                      language={detectLanguage(selectedIssue.codeSnippet, selectedIssue.subject)}
                      caption="Student Submission Snapshot"
                    />
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    OFFLINE AI DIAGNOSTIC & SOLUTION NOTE CARD (CLEAN SOLID)
                    ═══════════════════════════════════════════════════════════ */}
                {aiDiagnosis && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
                    {/* Header Row: Title & Action Controls */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Offline AI Ticket Diagnosis & Action Plan
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={handleApplyAISuggestion}
                          className="h-7.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-3 shadow-2xs cursor-pointer"
                          leftIcon={<Zap className="w-3.5 h-3.5" />}
                        >
                          Apply AI Solution & Code
                        </Button>

                        <button
                          type="button"
                          onClick={() => setAiDiagnosis(null)}
                          className="h-7.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="Dismiss AI Diagnosis"
                          aria-label="Close AI Diagnosis"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    </div>

                    {/* Dedicated Recommended Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] uppercase text-slate-500 dark:text-slate-400">
                          Recommended Action:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {aiDiagnosis.suggestedAction}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-bold uppercase px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800">
                        AI Recommended
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 block">
                          Issue Breakdown:
                        </span>
                        <p className="font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                          {aiDiagnosis.summary}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-[10px] uppercase text-slate-500 dark:text-slate-400 block">
                          Technical & Code Diagnosis:
                        </span>
                        <p className="font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                          {aiDiagnosis.codeDiagnosis}
                        </p>
                      </div>

                      {/* AI Suggested Updated Code Preview */}
                      {aiDiagnosis.updatedCode && (
                        <div className="space-y-1 pt-1">
                          <span className="font-mono font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase block flex items-center gap-1">
                            <Code2 className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                            <span>AI Suggested Reference Code Solution:</span>
                          </span>
                          <CodeBlock
                            code={aiDiagnosis.updatedCode}
                            language={detectLanguage(aiDiagnosis.updatedCode, selectedIssue.subject)}
                            caption="AI Corrected Solution"
                          />
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-mono font-bold text-[10px] text-brand-600 dark:text-brand-400 uppercase block flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          <span>AI Drafted Response Note:</span>
                        </span>
                        <p className="font-sans italic text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                          "{aiDiagnosis.suggestedReply}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    ADMIN PUBLISHED UPDATED CODE & RESPONSE HISTORY
                    ═══════════════════════════════════════════════════════════ */}
                {selectedIssue.adminReply && (
                  <div className="p-4 rounded-2xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 space-y-2 text-xs shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-brand-700 dark:text-brand-300 uppercase flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Instructor Response & Solution Note:</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                        Delivered
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed text-xs sm:text-sm">
                      {selectedIssue.adminReply}
                    </p>

                    {/* Previously Attached Updated Code Snippet */}
                    {selectedIssue.updatedCodeSnippet && (
                      <div className="pt-2 border-t border-brand-200/60 dark:border-brand-800/60 space-y-1">
                        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                          <span>Attached Corrected Solution Code:</span>
                        </span>
                        <CodeBlock
                          code={selectedIssue.updatedCodeSnippet}
                          language={detectLanguage(selectedIssue.updatedCodeSnippet, selectedIssue.subject)}
                          caption="Delivered Reference Solution"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  PINNED BOTTOM RESOLUTION COMPOSER & UPDATED CODE SECTION
                  ═══════════════════════════════════════════════════════════ */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 shrink-0 space-y-3">
                {/* 1-Click Pedagogical Quick Reply Templates with Full Wrapping */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      1-Click Pedagogical Quick Replies:
                    </span>
                    {!aiDiagnosis && (
                      <button
                        type="button"
                        onClick={handleAnalyzeTicketWithAI}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/70 hover:bg-brand-100 dark:hover:bg-brand-900 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold transition-all shadow-2xs cursor-pointer w-fit"
                      >
                        <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        <span>Ask AI to Draft Reply & Code</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUICK_REPLIES.map((template, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => setReplyText(template)}
                        className="text-[11px] font-sans p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-left cursor-pointer shadow-2xs whitespace-normal break-words leading-relaxed"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendReply} className="space-y-3">
                  {/* Resolution Text Note */}
                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                        <span>Send Instructor Solution Note to Student</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCodeEditorOpen(!isCodeEditorOpen)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer w-fit ${
                          isCodeEditorOpen
                            ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700 shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:text-brand-600'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isCodeEditorOpen ? 'Hide Code Editor' : '+ Add Updated / Corrected Code'}</span>
                      </button>
                    </div>
                    <Textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type an empathetic explanation, patch note, or resolution update to the student..."
                      className="text-xs font-sans resize-none"
                    />
                  </div>

                  {/* ═══════════════════════════════════════════════════════════
                      UPDATED / CORRECTED CODE SNIPPET ATTACHMENT SECTION
                      ═══════════════════════════════════════════════════════════ */}
                  {isCodeEditorOpen && (
                    <div className="space-y-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                            Updated / Corrected Solution Code
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          {aiDiagnosis?.updatedCode && (
                            <button
                              type="button"
                              onClick={() => setUpdatedCodeText(aiDiagnosis.updatedCode || '')}
                              className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                            >
                              Reset to AI Suggestion
                            </button>
                          )}
                          {updatedCodeText && (
                            <button
                              type="button"
                              onClick={() => setUpdatedCodeText('')}
                              className="text-[10px] font-mono text-rose-500 hover:underline cursor-pointer"
                            >
                              Clear Code
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        rows={5}
                        value={updatedCodeText}
                        onChange={(e) => setUpdatedCodeText(e.target.value)}
                        placeholder="# Paste or edit the corrected solution code that will be delivered to the student..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed resize-y"
                        spellCheck={false}
                      />

                      {/* Live Syntax Preview if present */}
                      {updatedCodeText.trim() && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                            Live Student Code Preview:
                          </span>
                          <CodeBlock
                            code={updatedCodeText}
                            language={detectLanguage(updatedCodeText, selectedIssue.subject)}
                            caption="Updated Solution Preview"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      {updatedCodeText.trim() ? 'Code solution attached ✓' : 'Text note only'}
                    </span>

                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      isLoading={isSendingReply}
                      className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs text-xs px-4"
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                    >
                      Post Instructor Reply & Update Status
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center my-auto text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">Select an inquiry from the inbox to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

IssueDeskView.displayName = 'IssueDeskView'
