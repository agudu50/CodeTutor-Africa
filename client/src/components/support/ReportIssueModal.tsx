import React, { useState, memo } from 'react'
import {
  issueSupportService,
  IssueCategory,
  IssuePriority,
} from '@/services/support/issue-support.service'
import { Dropdown } from '@/components/ui'
import {
  HelpCircle,
  X,
  Check,
  CheckCircle2,
  Shield,
  Code2,
} from 'lucide-react'

interface ReportIssueModalProps {
  isOpen: boolean
  onClose: () => void
  initialCategory?: IssueCategory
  initialContext?: string
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = memo(({
  isOpen,
  onClose,
  initialCategory = 'course_bug',
  initialContext = '',
}) => {
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<IssueCategory>(initialCategory)
  const [priority, setPriority] = useState<IssuePriority>('medium')
  const [description, setDescription] = useState(initialContext)
  const [codeSnippet, setCodeSnippet] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !userEmail.trim() || !subject.trim() || !description.trim()) return

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 450))

    issueSupportService.submitIssue({
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userRole: 'Learner / Developer',
      subject: subject.trim(),
      category,
      priority,
      description: description.trim(),
      codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleResetAndClose = () => {
    setIsSubmitted(false)
    setUserName('')
    setUserEmail('')
    setSubject('')
    setDescription('')
    setCodeSnippet('')
    onClose()
  }

  const categoryOptions = [
    { value: 'course_bug', label: 'Course Content / Lesson Issue' },
    { value: 'practice_problem', label: 'Practice Challenge / Test Case Bug' },
    { value: 'ai_tutor_feedback', label: 'AI Tutor Explanation Feedback' },
    { value: 'offline_sync', label: 'Offline Mode / Local Cache Issue' },
    { value: 'feature_suggestion', label: 'Suggest New Course or Feature' },
    { value: 'other', label: 'Other General Inquiry' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low Priority (Suggestion / Idea)' },
    { value: 'medium', label: 'Medium Priority (Normal Issue)' },
    { value: 'high', label: 'High Priority (Blocking Progress)' },
    { value: 'urgent', label: 'Urgent (Crash / Critical Error)' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[92vh] rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs flex items-center justify-center shrink-0">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-mono font-black leading-tight text-slate-900 dark:text-white">
                Submit Issue to Admin
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Report course bugs, suggest tracks, or request instructor assistance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 active:scale-95 transition-all shadow-3xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-300 dark:border-emerald-800 shadow-3xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="text-lg font-mono font-black text-slate-900 dark:text-white">
                  Issue Dispatched to Admin Desk
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Thank you, <span className="font-bold text-slate-800 dark:text-slate-200">{userName}</span>! Your report has been delivered to the administrative team and indexed in the offline ticket registry.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="h-9 px-6 rounded-xl font-mono text-xs font-black text-white bg-[#005F02] hover:bg-[#004d01] border-2 border-[#005F02] active:scale-95 shadow-3xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Kwame Mensah"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. kwame@ug.edu.gh"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                  />
                </div>
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Issue Category <span className="text-rose-500">*</span>
                  </label>
                  <Dropdown
                    options={categoryOptions}
                    value={category}
                    onChange={(val) => setCategory(val as IssueCategory)}
                    className="text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Priority Level <span className="text-rose-500">*</span>
                  </label>
                  <Dropdown
                    options={priorityOptions}
                    value={priority}
                    onChange={(val) => setPriority(val as IssuePriority)}
                    className="text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subject / Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Briefly describe what happened..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Detailed Explanation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Include steps to reproduce, expected vs actual behavior, or suggested course improvements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] p-3 text-xs text-slate-900 dark:text-slate-100 font-sans font-medium placeholder-slate-400 focus:outline-none focus:border-[#005F02] transition-colors shadow-3xs leading-relaxed resize-y"
                />
              </div>

              {/* Optional Code Snippet / Error */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Optional Code Snippet or Compiler Trace</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="# Paste relevant code or error output..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-[#0E1318] border-2 border-slate-700 rounded-xl focus:outline-none focus:border-[#005F02] text-emerald-400 placeholder-slate-500 shadow-3xs resize-y"
                  spellCheck={false}
                />
              </div>

              {/* Offline Assurance Badge */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs font-mono font-bold shadow-3xs">
                <span className="flex items-center gap-2 text-[#005F02] dark:text-emerald-400 font-mono font-black text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Saved to Local Ticket Queue</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#0E1318] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-black shadow-3xs">
                  Air-Gapped Ready
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="h-9 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#0E1318] text-slate-700 dark:text-slate-300 font-mono text-xs font-black transition-all active:scale-95 shadow-3xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-5 rounded-xl font-mono text-xs font-black text-white bg-[#005F02] hover:bg-[#004d01] border-2 border-[#005F02] active:scale-95 shadow-3xs transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit Issue to Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
})

ReportIssueModal.displayName = 'ReportIssueModal'
