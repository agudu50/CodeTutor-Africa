import React, { useState } from 'react'
import { AdminUserRecord } from '@/types/admin-analytics'
import { Button } from '@/components/ui'
import {
  AlertTriangle,
  X,
  GraduationCap,
  Mail,
  Globe,
  BookOpen,
  Lock,
  MessageSquare,
  ChevronDown,
} from 'lucide-react'

interface DemoteMentorModalProps {
  isOpen: boolean
  mentor: AdminUserRecord | null
  onClose: () => void
  onConfirmDemote: (userId: string, reason: string) => void
}

const DEMOTE_REASONS = [
  'Administrative role restructuring',
  'Extended period of inactivity (>30 days)',
  'Curriculum & mentorship policy update',
  'Voluntary step-down requested by mentor',
  'Transferred to student developer track',
  'Other / Custom review',
]

export const DemoteMentorModal: React.FC<DemoteMentorModalProps> = ({
  isOpen,
  mentor,
  onClose,
  onConfirmDemote,
}) => {
  const [selectedReason, setSelectedReason] = useState(DEMOTE_REASONS[0])
  const [customNote, setCustomNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen || !mentor) return null

  const handleConfirm = () => {
    setIsProcessing(true)
    const reasonText = selectedReason === 'Other / Custom review' && customNote.trim()
      ? customNote.trim()
      : selectedReason

    setTimeout(() => {
      onConfirmDemote(mentor.id, reasonText)
      setIsProcessing(false)
      onClose()
    }, 250)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demote-modal-title"
      >
        {/* Modal Header (Solid Theme) */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="demote-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Demote Mentor to Learner
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-mono font-bold border border-rose-200 dark:border-rose-800">
                  Role Revocation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Revoke educator privileges and downgrade account to Standard Learner.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain scrollbar-thin">
          {/* Target Mentor Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="relative shrink-0">
                {mentor.avatarUrl ? (
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-3xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-base flex items-center justify-center shadow-3xs">
                    {mentor.name.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-slate-900 shadow-3xs">
                  <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {mentor.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-600 text-white font-mono text-[9px] font-bold shadow-3xs">
                    <GraduationCap className="w-3 h-3" />
                    CURRENT MENTOR
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 flex-wrap">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">@{mentor.username}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {mentor.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {mentor.countryName} ({mentor.countryCode})
                  </span>
                </div>
              </div>
            </div>

            {mentor.activeCourseTitle && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 pt-2.5 border-t border-slate-200 dark:border-slate-800/80">
                <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Assigned Track:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {mentor.activeCourseTitle}
                </span>
              </div>
            )}
          </div>

          {/* Consequences of Demotion (Solid High-Contrast Box) */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-rose-200 font-mono uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Consequences of Demotion:</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Lock className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold block">No Access to Mentor Hub</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Once demoted, this user will be blocked from the Mentor Operations Hub (<code className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">/mentor</code>) and will see an access denied notice.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <BookOpen className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold block">Course Authoring Revoked</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    They can no longer create offline courses, edit modules, or publish curriculum changes.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <MessageSquare className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold block">Inquiry Resolution Closed</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    They will lose authority to resolve student help tickets or reply with educator badges.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Demotion Reason Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
              Select Demotion Reason <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full py-2.5 pl-3.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 appearance-none cursor-pointer"
              >
                {DEMOTE_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {selectedReason === 'Other / Custom review' && (
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Enter specific administrative justification for audit logs..."
                rows={2}
                className="w-full mt-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
            className="h-9 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="h-9 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs border-0"
            leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
          >
            {isProcessing ? 'Demoting...' : 'Confirm Demote to Learner'}
          </Button>
        </div>
      </div>
    </div>
  )
}

