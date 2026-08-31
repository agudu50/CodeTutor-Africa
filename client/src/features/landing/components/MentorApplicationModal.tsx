import React, { useState, useEffect } from 'react'
import { Button, Input } from '@/components/ui'
import { mentorApplicationService } from '@/services/mentor/mentor-application.service'
import { WEST_AFRICAN_COUNTRIES } from '@/features/leaderboard/data/mockLeaderboardData'
import {
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Globe,
  Shield,
  User,
  Mail,
  Laptop,
  Clock,
  X,
} from 'lucide-react'

const AVAILABLE_TRACKS = [
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'SQL & Database',
  'Algorithms & Math',
  'Systems & Architecture',
  'Web Development',
]

const EXPERIENCE_OPTIONS = [
  '1 - 2 years teaching/coding',
  '3 - 5 years industry/teaching',
  '5 - 10 years senior engineer/educator',
  '10+ years professor/staff lead',
]

interface MentorApplicationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MentorApplicationModal: React.FC<MentorApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [institutionOrCompany, setInstitutionOrCompany] = useState('')
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [yearsOfExperience, setYearsOfExperience] = useState(EXPERIENCE_OPTIONS[1])
  const [bio, setBio] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    setCountryCode(code)
    const found = WEST_AFRICAN_COUNTRIES.find((c) => c.code === code)
    if (found) setCountry(found.name)
  }

  const toggleTrack = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter((t) => t !== trackId))
    } else {
      setSelectedTracks([...selectedTracks, trackId])
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!fullName.trim() || !email.trim() || !institutionOrCompany.trim() || selectedTracks.length === 0) {
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))

    mentorApplicationService.submitApplication({
      fullName: fullName.trim(),
      email: email.trim(),
      country,
      countryCode,
      institutionOrCompany: institutionOrCompany.trim(),
      programmingTracks: selectedTracks,
      yearsOfExperience,
      bio: bio.trim() || 'Experienced engineer and educator passionate about mentoring African developers.',
      githubUrl: githubUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
    })

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleClose = () => {
    setIsSuccess(false)
    setFullName('')
    setEmail('')
    setInstitutionOrCompany('')
    setCountry('')
    setCountryCode('')
    setSelectedTracks([])
    setBio('')
    setGithubUrl('')
    setLinkedinUrl('')
    setPortfolioUrl('')
    onClose()
  }

  if (!isOpen) return null

  const isFormValid = fullName.trim() && email.trim() && countryCode && institutionOrCompany.trim() && selectedTracks.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog with Fixed Max Height */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Banner (Fixed & Non-scrolling) */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-800 shrink-0 flex items-start justify-between gap-3 relative">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#005F02] text-white flex items-center justify-center shrink-0 shadow-md">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>VERIFIED EDUCATOR NETWORK</span>
              </div>
              <h2 className="text-base sm:text-xl font-bold tracking-tight text-white">
                Apply to Become a CodeTutor Mentor
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-lg">
                Join our verified educator network to author offline course tracks, mentor African tech students, and publish solution notes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body Container (Vertical Scrolling) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6 scrollbar-thin">
          {isSuccess ? (
            <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Thank you, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. Your application has been logged in the Admin Review Queue.
                </p>
              </div>

              {/* Applicant Card Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-left max-w-lg mx-auto space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-mono text-[11px] text-slate-500 font-bold uppercase tracking-wider">Application Summary</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20">
                    Pending Admin Review
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Institution / Hub:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{institutionOrCompany} ({countryCode})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Contact Email:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px]">{email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block mb-1">Assigned Tracks:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTracks.map((tr) => (
                      <span key={tr} className="px-2 py-0.5 rounded-md bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-[10px] font-bold border border-[#005F02]/20">
                        {tr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-left font-mono">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                  <span>Next Steps & Review Process:</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                  <li>Platform administrators will review your profile and experience level.</li>
                  <li>Once approved, your account role will be promoted to <strong className="text-slate-900 dark:text-white">Mentor / Instructor</strong> with full authoring rights in the Mentor Hub.</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={handleClose}
                  className="bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs px-8 py-2.5 rounded-xl shadow-sm cursor-pointer"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* SECTION 1: Personal & Academic Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Applicant Profile &amp; Affiliation
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Full Name <span className="text-rose-500">*</span></span>
                    </label>
                    <Input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Emmanuel Quaye"
                      className="text-xs py-2"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Academic / Professional Email <span className="text-rose-500">*</span></span>
                    </label>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. e.quaye@knust.edu.gh"
                      className="text-xs py-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Nation / Country <span className="text-rose-500">*</span></span>
                    </label>
                    <select
                      value={countryCode}
                      onChange={handleCountryChange}
                      className={`w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#005F02] cursor-pointer shadow-3xs ${
                        countryCode ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <option value="" disabled>
                        Select your country...
                      </option>
                      {WEST_AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      <span>University or Organization <span className="text-rose-500">*</span></span>
                    </label>
                    <Input
                      required
                      value={institutionOrCompany}
                      onChange={(e) => setInstitutionOrCompany(e.target.value)}
                      placeholder="e.g. KNUST / Lagos Tech Hub"
                      className="text-xs py-2"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Programming Languages & Expertise */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Programming Languages &amp; Tracks to Mentor <span className="text-rose-500">*</span>
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#005F02] dark:text-emerald-400 font-bold">
                    {selectedTracks.length} Selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-0.5">
                  {AVAILABLE_TRACKS.map((track) => {
                    const isSelected = selectedTracks.includes(track)
                    return (
                      <button
                        key={track}
                        type="button"
                        onClick={() => toggleTrack(track)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#005F02] text-white border-[#005F02] shadow-2xs font-bold'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                          {isSelected ? '✓' : '+'}
                        </span>
                        <span>{track}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* SECTION 3: Teaching Background & Mentorship Statement (Prominent, High-Contrast & Spacious) */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Teaching Background &amp; Mentorship Statement
                  </h4>
                </div>

                {/* Experience Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                      <span>Teaching &amp; Professional Experience Level <span className="text-rose-500">*</span></span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-normal">
                      Career Tier
                    </span>
                  </label>
                  <select
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#005F02] focus:border-transparent cursor-pointer shadow-2xs transition-colors"
                  >
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mentorship Statement */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                      <span>Mentorship Statement &amp; Background</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-normal">
                      Teaching Vision &amp; Goals
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your teaching background, courses you have taught, tech community involvement, and how you plan to guide African students in mastering coding..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#005F02] focus:border-transparent transition-all shadow-2xs resize-y leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    This summary helps curriculum leads and students understand your teaching philosophy and core areas of focus.
                  </p>
                </div>
              </div>

              {/* SECTION 4: Professional Links */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-[#005F02]/10 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold">4</span>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Professional Profiles
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>GitHub Profile</span>
                    </label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="text-xs font-mono py-2"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>LinkedIn Profile</span>
                    </label>
                    <Input
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="text-xs font-mono py-2"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Portfolio Website</span>
                  </label>
                  <Input
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="text-xs font-mono py-2"
                  />
                </div>
              </div>

              {/* Verification & Perks Note */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-semibold">Admin Verification:</strong> All applications are reviewed by platform administrators before instructor permissions are granted. You will receive an on-platform notification upon approval.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Modal Sticky Bottom Actions Bar (Always Visible at Bottom) */}
        {!isSuccess && (
          <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="text-xs font-semibold px-4 py-2"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
              className="bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs px-5 py-2 shadow-sm cursor-pointer disabled:opacity-50"
              leftIcon={<GraduationCap className="w-3.5 h-3.5" />}
            >
              Submit Mentor Application
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorApplicationModal

