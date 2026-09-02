import React, { useState, useRef, useEffect } from 'react'
import { AdminUserRecord } from '@/types/admin-analytics'
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
  Check,
  AlertCircle,
} from 'lucide-react'

interface DemoteMentorModalProps {
  isOpen: boolean
  mentor: AdminUserRecord | null
  onClose: () => void
  onConfirmDemote: (userId: string, reason: string) => void
}

const DEMOTE_REASONS: { title: string; desc: string }[] = [
  {
    title: 'Administrative role restructuring',
    desc: 'Reallocation of regional educator seats across academic tracks',
  },
  {
    title: 'Extended period of inactivity (>30 days)',
    desc: 'No active curriculum moderation or student mentorship logged in the past 30 days',
  },
  {
    title: 'Curriculum & mentorship policy update',
    desc: 'Account credentials transitioned to comply with updated mentor standards',
  },
  {
    title: 'Voluntary step-down requested by mentor',
    desc: 'Educator formally submitted request to revert to standard learner profile',
  },
  {
    title: 'Transferred to student developer track',
    desc: 'Mentor transitioning to participate directly in student hackathons & cohorts',
  },
  {
    title: 'Other / Custom review',
    desc: 'Provide custom administrative notes and justification for audit logs',
  },
]

export const DemoteMentorModal: React.FC<DemoteMentorModalProps> = ({
  isOpen,
  mentor,
  onClose,
  onConfirmDemote,
}) => {
  const [selectedReason, setSelectedReason] = useState(DEMOTE_REASONS[0].title)
  const [customNote, setCustomNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isOpen || !mentor) return null

  const currentOption = DEMOTE_REASONS.find((r) => r.title === selectedReason) || DEMOTE_REASONS[0]

  const handleConfirm = () => {
    setIsProcessing(true)
    const reasonText =
      selectedReason === 'Other / Custom review' && customNote.trim()
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
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-rose-300 dark:border-rose-900/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 font-mono"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demote-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-center shrink-0 shadow-3xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="demote-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Demote Mentor to Learner
                </h3>
                <span className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-[10px] font-mono font-black border-2 border-rose-300 dark:border-rose-800 shadow-3xs">
                  Role Revocation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                Revoke educator privileges and downgrade account to Standard Learner.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-[#161B22] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 active:scale-95 shadow-3xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain scrollbar-thin">
          {/* Target Mentor Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 space-y-3 shadow-3xs">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="relative shrink-0">
                {mentor.avatarUrl ? (
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-300 dark:border-slate-700 shadow-3xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#005F02] text-white font-black text-base flex items-center justify-center shadow-3xs border-2 border-[#005F02]">
                    {mentor.name.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-[#161B22] shadow-3xs">
                  <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {mentor.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[9px] font-black border-2 border-indigo-300 dark:border-indigo-800 shadow-3xs">
                    <GraduationCap className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    CURRENT MENTOR
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 flex-wrap">
                  <span className="font-bold text-slate-700 dark:text-slate-300">@{mentor.username}</span>
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
              <div className="flex items-center gap-2 text-xs font-mono pt-2.5 border-t-2 border-slate-200 dark:border-slate-800">
                <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span className="text-slate-500 dark:text-slate-400 font-bold">Assigned Track:</span>
                <span className="font-black text-slate-900 dark:text-white truncate">
                  {mentor.activeCourseTitle}
                </span>
              </div>
            )}
          </div>

          {/* Consequences of Demotion */}
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 space-y-2.5 shadow-3xs">
            <div className="flex items-center gap-2 text-xs font-black text-rose-900 dark:text-rose-300 font-mono uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Consequences of Demotion:</span>
            </div>

            <div className="space-y-2 font-sans">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border-2 border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <strong className="text-slate-900 dark:text-white font-bold block font-mono text-xs">
                    No Access to Mentor Hub
                  </strong>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Blocked from the Mentor Operations Hub (<code className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">/mentor</code>) and course desks.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border-2 border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <strong className="text-slate-900 dark:text-white font-bold block font-mono text-xs">
                    Course Authoring Revoked
                  </strong>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cannot create offline courses, edit modules, or publish curriculum changes.
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border-2 border-rose-200/80 dark:border-rose-900/50 flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <strong className="text-slate-900 dark:text-white font-bold block font-mono text-xs">
                    Inquiry Resolution Closed
                  </strong>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Loses authority to resolve student help tickets or reply with educator badges.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Demotion Reason Custom Dropdown */}
          <div className="space-y-2" ref={dropdownRef}>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                Select Demotion Reason <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Required for compliance audit</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`w-full p-3 rounded-2xl border-2 text-left bg-white dark:bg-[#161B22] transition-all flex items-center justify-between gap-3 shadow-3xs cursor-pointer active:scale-[0.99] ${
                  isDropdownOpen
                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-rose-400'
                }`}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-800 shrink-0 mt-0.5 shadow-3xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {currentOption.title}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate font-sans">
                      {currentOption.desc}
                    </span>
                  </div>
                </div>

                <div className={`p-1 text-slate-400 transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180 text-rose-600' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 shadow-2xl z-30 p-1.5 space-y-1 max-h-60 overflow-y-auto scrollbar-thin animate-in fade-in zoom-in-95 duration-150">
                  {DEMOTE_REASONS.map((option) => {
                    const isSelected = selectedReason === option.title

                    return (
                      <button
                        key={option.title}
                        type="button"
                        onClick={() => {
                          setSelectedReason(option.title)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 shadow-3xs'
                            : 'hover:bg-slate-100 dark:hover:bg-[#0E1318] border-2 border-transparent text-slate-800 dark:text-slate-200'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="min-w-0 flex-1">
                          <span className={`block text-xs font-bold leading-snug ${isSelected ? 'text-rose-900 dark:text-rose-300' : 'text-slate-900 dark:text-white'}`}>
                            {option.title}
                          </span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-sans">
                            {option.desc}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-3xs mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedReason === 'Other / Custom review' && (
              <div className="pt-2 animate-in fade-in duration-150">
                <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300 font-mono mb-1">
                  Custom Administrative Justification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Enter specific administrative justification and audit documentation..."
                  rows={2}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500 shadow-3xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E1318] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161B22] border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 active:scale-95 shadow-3xs cursor-pointer transition-all disabled:opacity-50 text-center justify-center flex items-center"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full sm:w-auto h-10 px-5 rounded-xl text-xs font-mono font-black bg-rose-600 hover:bg-rose-700 text-white border-2 border-rose-600 active:scale-95 shadow-xs cursor-pointer transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 text-center"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Demoting...' : 'Confirm Demote to Learner'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

