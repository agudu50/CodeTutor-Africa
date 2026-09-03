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
  Sparkles,
  ArrowRight,
  Code2,
  Check,
  Plus,
} from 'lucide-react'

const AVAILABLE_TRACKS = [
  { id: 'Python', label: 'Python', category: 'Core' },
  { id: 'JavaScript', label: 'JavaScript', category: 'Web' },
  { id: 'TypeScript', label: 'TypeScript', category: 'Web' },
  { id: 'HTML / HTML5', label: 'HTML / HTML5', category: 'Frontend' },
  { id: 'CSS / CSS3', label: 'CSS / CSS3', category: 'Frontend' },
  { id: 'Git & GitHub', label: 'Git & GitHub', category: 'DevOps' },
  { id: 'Java', label: 'Java', category: 'Enterprise' },
  { id: 'SQL & Databases', label: 'SQL & Databases', category: 'Data' },
  { id: 'C / C++', label: 'C / C++', category: 'Systems' },
  { id: 'Go / Golang', label: 'Go / Golang', category: 'Backend' },
  { id: 'Rust', label: 'Rust', category: 'Systems' },
  { id: 'Algorithms & Math', label: 'Algorithms & Math', category: 'Foundations' },
  { id: 'Web Development', label: 'Web Development', category: 'Fullstack' },
]

const EXPERIENCE_OPTIONS = [
  { id: '1-2', label: '1 - 2 years teaching or developer experience', desc: 'Junior educator or active community tutor' },
  { id: '3-5', label: '3 - 5 years industry/teaching', desc: 'Mid-level engineer or university instructor' },
  { id: '5-10', label: '5 - 10 years senior engineer/educator', desc: 'Senior software lead or faculty lecturer' },
  { id: '10+', label: '10+ years professor/staff lead', desc: 'Distinguished professor or engineering director' },
]

interface MentorApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onApplicationSubmitted?: () => void
}

export const MentorApplicationModal: React.FC<MentorApplicationModalProps> = ({
  isOpen,
  onClose,
  onApplicationSubmitted,
}) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [institutionOrCompany, setInstitutionOrCompany] = useState('')
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [yearsOfExperience, setYearsOfExperience] = useState(EXPERIENCE_OPTIONS[1].label)
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
    setSelectedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((t) => t !== trackId) : [...prev, trackId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !institutionOrCompany.trim() || selectedTracks.length === 0) {
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))

    mentorApplicationService.submitApplication({
      fullName: fullName.trim(),
      email: email.trim(),
      country: country || 'Ghana',
      countryCode: countryCode || 'GH',
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
    if (onApplicationSubmitted) {
      onApplicationSubmitted()
    }
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

  const isFormValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    countryCode.length > 0 &&
    institutionOrCompany.trim().length > 0 &&
    selectedTracks.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-3xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-2xl z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Banner */}
        <div className="bg-slate-50 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 px-6 py-5 border-b-2 border-slate-200 dark:border-slate-800 shrink-0 flex items-start justify-between gap-4 relative overflow-hidden">
          {/* Subtle Ambient Glow (Dark Mode only) */}
          <div className="hidden dark:block absolute top-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-[#005F02] text-[#005F02] dark:text-white flex items-center justify-center shrink-0 shadow-xs border-2 border-emerald-300 dark:border-emerald-400/30">
              <GraduationCap className="w-6 h-6 text-[#005F02] dark:text-emerald-300" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-[#005F02] dark:text-emerald-400 font-mono text-[10px] font-black uppercase tracking-wider">
                <Shield className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
                <span>VERIFIED EDUCATOR NETWORK</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Apply to Become a CodeTutor Mentor
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg font-medium">
                Join our verified educator network to author offline course tracks, mentor African tech students, and publish solution notes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-slate-300 dark:hover:border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-7 space-y-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Application Logged</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Thank you, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. Your profile has been sent to our administrator review queue.
                </p>
              </div>

              {/* Applicant Card Summary */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 text-xs text-left max-w-lg mx-auto space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider">
                    Application Summary
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                    Pending Admin Review
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Institution / Hub:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{institutionOrCompany} ({countryCode})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-medium">Contact Email:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px]">{email}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block mb-1.5 font-medium">Assigned Tracks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTracks.map((tr) => (
                      <span
                        key={tr}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs"
                      >
                        {tr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-900/60 text-xs text-slate-700 dark:text-slate-300 max-w-lg mx-auto text-left">
                <div className="flex items-center gap-2 text-[#005F02] dark:text-emerald-400 font-black mb-1.5">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Next Steps & Review Process:</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <li>Platform administrators will review your academic affiliation and experience credentials.</li>
                  <li>Upon approval, your account role will be promoted to <strong className="text-slate-900 dark:text-white">Mentor / Instructor</strong> with authoring access to the Mentor Hub.</li>
                </ul>
              </div>

              <div className="pt-3">
                <Button
                  variant="primary"
                  onClick={handleClose}
                  className="bg-[#005F02] hover:bg-[#004e02] text-white font-black text-xs px-8 py-2.5 rounded-xl shadow-md cursor-pointer border-2 border-[#005F02]"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: Personal & Academic Info */}
              <div className="p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#12171E] space-y-4 shadow-3xs">
                <div className="flex items-center gap-2.5 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-xl bg-[#005F02] text-white flex items-center justify-center font-mono text-xs font-black shadow-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                      Applicant Profile &amp; Affiliation
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      Provide your basic identity and institution details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="text-xs py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] focus:border-[#005F02]"
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
                      className="text-xs py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] font-mono focus:border-[#005F02]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Nation / Country <span className="text-rose-500">*</span></span>
                    </label>
                    <select
                      value={countryCode}
                      onChange={handleCountryChange}
                      required
                      className={`w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] text-xs font-bold focus:outline-none focus:border-[#005F02] cursor-pointer shadow-3xs transition-all ${
                        countryCode ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <option value="" disabled>
                        Select your country...
                      </option>
                      {WEST_AFRICAN_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-white dark:bg-[#0E1318] text-slate-900 dark:text-white">
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
                      className="text-xs py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] focus:border-[#005F02]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Programming Languages & Expertise */}
              <div className="p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#12171E] space-y-4 shadow-3xs">
                <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-xl bg-[#005F02] text-white flex items-center justify-center font-mono text-xs font-black shadow-xs">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-black font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                        Programming Languages &amp; Tracks to Mentor <span className="text-rose-500">*</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                        Select all tracks you are qualified to teach
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-xs font-black border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                    {selectedTracks.length} Selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_TRACKS.map((track) => {
                    const isSelected = selectedTracks.includes(track.id)
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => toggleTrack(track.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer shadow-3xs active:scale-95 ${
                          isSelected
                            ? 'bg-[#005F02] text-white border-[#005F02] shadow-sm ring-2 ring-emerald-500/20'
                            : 'bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{track.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* SECTION 3: Teaching Background & Mentorship Statement */}
              <div className="p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#12171E] space-y-4 shadow-3xs">
                <div className="flex items-center gap-2.5 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-xl bg-[#005F02] text-white flex items-center justify-center font-mono text-xs font-black shadow-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                      Teaching Background &amp; Mentorship Statement
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      Help curriculum leaders understand your mentorship philosophy
                    </p>
                  </div>
                </div>

                {/* Experience Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                      <span>Teaching &amp; Professional Experience Level <span className="text-rose-500">*</span></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Career Tier
                    </span>
                  </label>
                  <select
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#005F02] cursor-pointer shadow-3xs transition-all"
                  >
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.label} className="bg-white dark:bg-[#0E1318] text-slate-900 dark:text-white py-1">
                        {opt.label} — {opt.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mentorship Statement */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                      <span>Mentorship Statement &amp; Background</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                      Teaching Vision &amp; Goals
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your teaching background, courses you have taught, tech community involvement, and how you plan to guide African students in mastering coding..."
                    className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#005F02] transition-all shadow-3xs resize-y leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    This summary helps curriculum leads and students understand your teaching philosophy and core areas of focus.
                  </p>
                </div>
              </div>

              {/* SECTION 4: Professional Links */}
              <div className="p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#12171E] space-y-4 shadow-3xs">
                <div className="flex items-center gap-2.5 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-xl bg-[#005F02] text-white flex items-center justify-center font-mono text-xs font-black shadow-xs">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-black font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                      Professional Profiles
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      Share your developer portfolios and social verification links (optional)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>GitHub Profile</span>
                    </label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="text-xs font-mono py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] focus:border-[#005F02]"
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
                      className="text-xs font-mono py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] focus:border-[#005F02]"
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
                    className="text-xs font-mono py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1318] focus:border-[#005F02]"
                  />
                </div>
              </div>

              {/* Verification & Perks Note */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-900/50 text-slate-700 dark:text-slate-300 flex items-start gap-3 shadow-3xs">
                <Shield className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-bold">Admin Verification:</strong> All applications are reviewed by platform administrators before instructor permissions are granted. You will receive an on-platform notification upon approval.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Modal Sticky Bottom Actions Bar */}
        {!isSuccess && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-[#12171E] border-t-2 border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
              {isFormValid ? (
                <span className="text-[#005F02] dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to submit
                </span>
              ) : (
                <span>* Required fields must be completed</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="text-xs font-bold px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 cursor-pointer"
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
                className="bg-[#005F02] hover:bg-[#004e02] text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer border-2 border-[#005F02] disabled:opacity-50 inline-flex items-center gap-2"
                leftIcon={<GraduationCap className="w-4 h-4 text-emerald-300" />}
              >
                <span>Submit Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorApplicationModal
