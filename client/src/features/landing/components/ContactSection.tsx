import React, { useState, memo } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  CheckCircle2,
  Clock,
  GraduationCap,
  Globe,
  Sparkles,
  MessageSquare,
  BookOpen,
  Shield,
  Copy,
  Check,
} from 'lucide-react'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { WEST_AFRICAN_COUNTRIES } from '@/features/leaderboard/data/mockLeaderboardData'

function SendIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function ExternalLinkIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function UserIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ChevronDownIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function MapPinIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function BuildingIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  )
}

const INQUIRY_TYPES = [
  { id: 'general', label: 'General Inquiry & Feedback' },
  { id: 'partnership', label: 'University / Institutional Partnership' },
  { id: 'mentor', label: 'Mentor & Educator Inquiries' },
  { id: 'technical', label: 'Offline Engine & Technical Help' },
  { id: 'classroom', label: 'Coding Club / Classroom Deployment' },
]

const REGIONAL_HUBS = [
  { country: 'Ghana', cities: 'Accra & Kumasi', code: 'GH' },
  { country: 'Nigeria', cities: 'Lagos & Ibadan', code: 'NG' },
  { country: 'Senegal', cities: 'Dakar', code: 'SN' },
  { country: "Côte d'Ivoire", cities: 'Abidjan', code: 'CI' },
  { country: 'Kenya', cities: 'Nairobi', code: 'KE' },
  { country: 'Benin', cities: 'Cotonou', code: 'BJ' },
]

export const ContactSection: React.FC = memo(() => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('GH')
  const [inquiryType, setInquiryType] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleCopyEmail = (e: React.MouseEvent, emailStr: string) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(emailStr)
    setCopiedEmail(emailStr)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !message.trim()) return

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 650))

    try {
      adminAnalyticsService.addContactInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        country,
        inquiryType,
        subject: subject.trim() || 'General Inquiry',
        message: message.trim(),
      })
    } catch {
      // ignore
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setFullName('')
    setEmail('')
    setCountry('GH')
    setInquiryType('general')
    setSubject('')
    setMessage('')
    setIsSubmitted(false)
  }

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#005F02]/10 dark:bg-emerald-950/60 border border-[#005F02]/30 dark:border-emerald-500/30 text-[#005F02] dark:text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider shadow-2xs">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch • Contact Us</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          We&apos;d Love to Hear From You
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Have questions about zero-internet learning, university partnerships, educator mentoring, or offline school rollouts across Africa? Our team is here to support you.
        </p>
      </div>

      {/* Main Content Grid with Equal Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Direct Communication Channels & Regional Hubs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 text-left h-full">
          {/* Card 1: Direct Channels */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-xl flex flex-col justify-between flex-1 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                <span>Direct Communication Channels</span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80">
                Active
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm flex-1 flex flex-col justify-center">
              {/* Channel 1: Support */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 hover:border-[#005F02] dark:hover:border-emerald-500/80 transition-all group space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#005F02]/10 dark:bg-emerald-500/15 border border-[#005F02]/20 dark:border-emerald-500/30 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        General Inquiries &amp; Help Desk
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Student questions, platform support, and feedback
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                  <a
                    href="mailto:support@codetutor.africa"
                    className="font-mono text-xs font-semibold text-[#005F02] dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>support@codetutor.africa</span>
                    <ExternalLinkIcon className="w-3 h-3 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, 'support@codetutor.africa')}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Copy email address"
                  >
                    {copiedEmail === 'support@codetutor.africa' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Channel 2: Partnerships */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 hover:border-brand-500 transition-all group space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                      <BuildingIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        Universities &amp; School Partnerships
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Campus computer labs, curriculum integration, and licensing
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                  <a
                    href="mailto:partnerships@codetutor.africa"
                    className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>partnerships@codetutor.africa</span>
                    <ExternalLinkIcon className="w-3 h-3 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, 'partnerships@codetutor.africa')}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Copy email address"
                  >
                    {copiedEmail === 'partnerships@codetutor.africa' ? (
                      <Check className="w-3.5 h-3.5 text-brand-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Channel 3: Mentors */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-500 transition-all group space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        Educator &amp; Mentor Network
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Course track authoring, lecturer verification, and teaching
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                  <a
                    href="mailto:mentors@codetutor.africa"
                    className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>mentors@codetutor.africa</span>
                    <ExternalLinkIcon className="w-3 h-3 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, 'mentors@codetutor.africa')}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Copy email address"
                  >
                    {copiedEmail === 'mentors@codetutor.africa' ? (
                      <Check className="w-3.5 h-3.5 text-indigo-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Info */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span className="font-semibold">Response &lt; 24 hrs</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400">
                <Globe className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="font-semibold">Pan-African Reach</span>
              </div>
            </div>
          </div>

          {/* Card 2: Regional Campus Hubs */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3.5 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <MapPinIcon className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
              <span>Campus &amp; Community Focal Points</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Serving educators, coding club leads, and student communities across university hubs:
            </p>

            {/* Hub Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGIONAL_HUBS.map((hub) => (
                <div
                  key={hub.country}
                  className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90 shadow-3xs text-left"
                >
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {hub.country}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {hub.cities}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enhanced Contact Form Card (7 Cols) */}
        <div className="lg:col-span-7 h-full">
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl text-left relative h-full flex flex-col justify-between">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-[#005F02] dark:text-emerald-400 mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Thank you for reaching out, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. A CodeTutor Africa team member will review your inquiry and get back to you at <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{email}</span> within 24 hours.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
                  >
                    Send Another Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Form Card Header */}
                <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Send Us a Message
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Fill out the form below and we will respond to your inquiry promptly.
                  </p>
                </div>

                {/* Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Your Full Name <span className="text-[#005F02] dark:text-emerald-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 dark:focus:ring-emerald-500/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Email Address <span className="text-[#005F02] dark:text-emerald-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. kwame@university.edu"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 dark:focus:ring-emerald-500/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Country & Inquiry Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nation / Country */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Nation / Country
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 appearance-none cursor-pointer"
                      >
                        {WEST_AFRICAN_COUNTRIES.filter((c) => c.code !== 'ALL').map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                        <option value="OTHER">Other African Country</option>
                        <option value="INTERNATIONAL">International / Global</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDownIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Inquiry Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 appearance-none cursor-pointer"
                      >
                        {INQUIRY_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDownIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Subject
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Deploying CodeTutor in our University Computer Lab"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 dark:focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Your Message <span className="text-[#005F02] dark:text-emerald-400 font-bold">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {message.length} characters
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your learning goals, university lab, school club, or inquiry..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 dark:focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl text-xs font-extrabold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xl hover:shadow-[0_8px_24px_rgba(0,95,2,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    <SendIcon className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                    <Shield className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                    <span>Your privacy is protected. Inquiries are stored securely.</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

ContactSection.displayName = 'ContactSection'
