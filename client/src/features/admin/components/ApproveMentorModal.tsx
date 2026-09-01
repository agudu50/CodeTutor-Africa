import React, { useState } from 'react'
import { Button } from '@/components/ui'
import {
  GraduationCap,
  CheckCircle2,
  X,
  Globe,
  Laptop,
  Code2,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Mail,
} from 'lucide-react'

export interface ApproveMentorTarget {
  id: string
  fullName: string
  email: string
  country: string
  countryCode?: string
  institutionOrCompany: string
  programmingTracks: string[]
  yearsOfExperience?: string
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  portfolioUrl?: string
  isDirectUserPromotion?: boolean
}

interface ApproveMentorModalProps {
  isOpen: boolean
  target: ApproveMentorTarget | null
  onClose: () => void
  onConfirmApprove: (targetId: string, applicantName: string, assignedTrack?: string, adminNote?: string) => void
}

export const ApproveMentorModal: React.FC<ApproveMentorModalProps> = ({
  isOpen,
  target,
  onClose,
  onConfirmApprove,
}) => {
  const [selectedPrimaryTrack, setSelectedPrimaryTrack] = useState<string>('')
  const [adminNote, setAdminNote] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  React.useEffect(() => {
    if (target?.programmingTracks && target.programmingTracks.length > 0) {
      setSelectedPrimaryTrack(target.programmingTracks[0])
    } else {
      setSelectedPrimaryTrack('Java')
    }
    setAdminNote('')
  }, [target])

  if (!isOpen || !target) return null

  const handleConfirm = () => {
    setIsProcessing(true)
    setTimeout(() => {
      onConfirmApprove(target.id, target.fullName, selectedPrimaryTrack, adminNote)
      setIsProcessing(false)
      onClose()
    }, 250)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-mentor-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="approve-mentor-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Approve &amp; Appoint Course Mentor
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                  Educator Verification
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Confirm applicant credentials and grant Mentor Operations Hub access.
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
          {/* Candidate Profile Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                  {target.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {target.fullName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200">
                      <Globe className="w-2.5 h-2.5 text-brand-500" />
                      {target.country} ({target.countryCode || 'AF'})
                    </span>
                    {target.institutionOrCompany && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        <Laptop className="w-2.5 h-2.5 text-slate-500" />
                        {target.institutionOrCompany}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {target.email}
                    </span>
                    {target.yearsOfExperience && (
                      <>
                        <span>•</span>
                        <span>{target.yearsOfExperience}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mentorship Tracks */}
            {target.programmingTracks && target.programmingTracks.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-brand-600" />
                  <span>Tracks:</span>
                </span>
                {target.programmingTracks.map((trk) => (
                  <span
                    key={trk}
                    className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-mono text-[10px] font-bold"
                  >
                    {trk}
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            {target.bio && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 italic">
                &ldquo;{target.bio}&rdquo;
              </div>
            )}

            {/* Social / Portfolio Links Preview */}
            {(target.githubUrl || target.linkedinUrl || target.portfolioUrl) && (
              <div className="flex items-center gap-2 text-xs font-mono flex-wrap pt-1">
                {target.githubUrl && (
                  <a
                    href={target.githubUrl.startsWith('http') ? target.githubUrl : `https://${target.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 shadow-3xs"
                  >
                    <Code2 className="w-3 h-3 text-slate-500" />
                    <span>GitHub ↗</span>
                  </a>
                )}
                {target.linkedinUrl && (
                  <a
                    href={target.linkedinUrl.startsWith('http') ? target.linkedinUrl : `https://${target.linkedinUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 shadow-3xs"
                  >
                    <Globe className="w-3 h-3 text-indigo-500" />
                    <span>LinkedIn ↗</span>
                  </a>
                )}
                {target.portfolioUrl && (
                  <a
                    href={target.portfolioUrl.startsWith('http') ? target.portfolioUrl : `https://${target.portfolioUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 shadow-3xs"
                  >
                    <Laptop className="w-3 h-3 text-emerald-500" />
                    <span>Portfolio ↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Granted Privileges Checklist */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 font-mono uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Privileges Granted Upon Approval:</span>
            </div>

            <ul className="text-xs text-emerald-950/90 dark:text-emerald-200/90 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Mentor Hub Access:</strong> Unlocks the <strong>Mentor Operations Hub (`/mentor`)</strong> for this user with real-time active status tracking.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Curriculum Authoring:</strong> Authority to create offline course modules, author coding exercises, and publish track lessons.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Student Help Desk:</strong> Authority to resolve learner questions with official <strong>Verified Mentor</strong> credentials.
                </span>
              </li>
            </ul>
          </div>

          {/* Primary Track Assignment */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
              Assign Primary Course Track
            </label>
            <select
              value={selectedPrimaryTrack}
              onChange={(e) => setSelectedPrimaryTrack(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              {(target.programmingTracks.length > 0
                ? target.programmingTracks
                : ['Java', 'Python', 'JavaScript', 'TypeScript', 'Web Development', 'Systems & Architecture']
              ).map((t) => (
                <option key={t} value={t}>
                  {t} (Primary Track)
                </option>
              ))}
            </select>
          </div>

          {/* Admin Approval Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
              Verification &amp; Audit Note <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Verified university credentials and approved for West African Java curriculum..."
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
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
            className="h-9 px-4 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-2xs border-0"
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            {isProcessing ? 'Appointing...' : 'Confirm & Appoint Mentor'}
          </Button>
        </div>
      </div>
    </div>
  )
}
