import React, { useState, memo } from 'react'
import {
  issueSupportService,
  IssueCategory,
  IssuePriority,
} from '@/services/support/issue-support.service'
import { Button, Input, Textarea, Dropdown } from '@/components/ui'
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
      <div className="relative w-full max-w-xl max-h-[92vh] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-none text-slate-900 dark:text-white">
                Submit Issue to Admin
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Report course bugs, suggest tracks, or request instructor assistance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Issue Dispatched to Admin Desk
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Thank you, <span className="font-semibold text-slate-700 dark:text-slate-300">{userName}</span>! Your report has been delivered to the administrative team and indexed in the offline ticket registry.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={handleResetAndClose}
                  className="font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Kwame Mensah"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. kwame@ug.edu.gh"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Issue Category <span className="text-rose-500">*</span>
                  </label>
                  <Dropdown
                    options={categoryOptions}
                    value={category}
                    onChange={(val) => setCategory(val as IssueCategory)}
                    className="text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Priority Level <span className="text-rose-500">*</span>
                  </label>
                  <Dropdown
                    options={priorityOptions}
                    value={priority}
                    onChange={(val) => setPriority(val as IssuePriority)}
                    className="text-xs font-medium"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject / Summary <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Briefly describe what happened..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-xs"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Explanation <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Include steps to reproduce, expected vs actual behavior, or suggested course improvements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs font-sans leading-relaxed"
                />
              </div>

              {/* Optional Code Snippet / Error */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Optional Code Snippet or Compiler Trace</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="# Paste relevant code or error output..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full p-2.5 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 resize-y"
                  spellCheck={false}
                />
              </div>

              {/* Offline Assurance Badge */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Saved to Local Ticket Queue</span>
                </span>
                <span>Air-Gapped Ready</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetAndClose}
                  className="text-xs font-semibold"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-4"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Submit Issue to Admin
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
})

ReportIssueModal.displayName = 'ReportIssueModal'
