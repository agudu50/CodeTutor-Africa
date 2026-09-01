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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demote-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/30 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="demote-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Demote Mentor to Learner
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-[10px] font-mono font-bold border border-rose-200 dark:border-rose-800">
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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain scrollbar-thin">
          {/* Target Mentor Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                {mentor.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {mentor.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-[10px] font-bold">
                    <GraduationCap className="w-3 h-3" />
                    CURRENT MENTOR
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5 flex-wrap">
                  <span>@{mentor.username}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {mentor.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {mentor.countryName}
                  </span>
                </div>
              </div>
            </div>

            {mentor.activeCourseTitle && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-slate-500">Track:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {mentor.activeCourseTitle}
                </span>
              </div>
            )}
          </div>

          {/* Impact Warning Notice */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300 font-mono uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Consequences of Demotion:</span>
            </div>

            <ul className="text-xs text-rose-900/90 dark:text-rose-200/90 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Access to Mentor Hub:</strong> Once demoted, this user will be <strong>blocked from the Mentor Operations Hub (`/mentor`)</strong> and will see an access denied notice.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Course Authoring Revoked:</strong> They can no longer create offline courses, edit modules, or publish curriculum changes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Inquiry Resolution Closed:</strong> They will lose authority to resolve student help tickets or reply with educator badges.
                </span>
              </li>
            </ul>
          </div>

          {/* Demotion Reason */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
              Select Demotion Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
            >
              {DEMOTE_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {selectedReason === 'Other / Custom review' && (
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Enter specific administrative justification for audit logs..."
                rows={2}
                className="w-full mt-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
            className="h-9 px-4 text-xs font-bold text-slate-700 dark:text-slate-300"
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
