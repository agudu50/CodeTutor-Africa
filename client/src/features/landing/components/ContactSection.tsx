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
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold shadow-3xs">
          <MessageSquare className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
          <span>DIRECT COMMUNICATION CHANNELS</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          We&apos;d Love to Hear <span className="text-[#005F02] dark:text-emerald-400">From You</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Have questions about zero-internet learning, university partnerships, educator mentoring, or offline school rollouts across Africa? Our team is here to support you.
        </p>
      </div>

      {/* Main Content Grid with Equal Heights - Dashboard Card System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Left Column: Direct Communication Channels & Regional Hubs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5 text-left h-full">
          {/* Card 1: Direct Channels */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs flex flex-col justify-between flex-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                <span>Direct Communication Channels</span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                Active
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm flex-1 flex flex-col justify-center">
              {/* Channel 1: Support */}
              <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 hover:border-[#005F02] dark:hover:border-emerald-500 transition-all space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shrink-0 shadow-3xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-tight">
                        General Inquiries &amp; Help Desk
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Student questions, platform support, and feedback
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <a
                    href="mailto:support@codetutor.africa"
                    className="font-mono text-xs font-bold text-[#005F02] dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>support@codetutor.africa</span>
                    <ExternalLinkIcon className="w-3 h-3 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, 'support@codetutor.africa')}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] text-slate-600 dark:text-slate-300 hover:text-[#005F02] shadow-3xs transition-all cursor-pointer"
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
              <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 hover:border-[#005F02] dark:hover:border-emerald-500 transition-all space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shrink-0 shadow-3xs">
                      <BuildingIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-tight">
                        Universities &amp; School Partnerships
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Campus computer labs, curriculum integration, and licensing
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <a
                    href="mailto:partnerships@codetutor.africa"
                    className="font-mono text-xs font-bold text-[#005F02] dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>partnerships@codetutor.africa</span>
                    <ExternalLinkIcon className="w-3 h-3 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, 'partnerships@codetutor.africa')}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] text-slate-600 dark:text-slate-300 hover:text-[#005F02] shadow-3xs transition-all cursor-pointer"
                    title="Copy email address"
                  >
                    {copiedEmail === 'partnerships@codetutor.africa' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Channel 3: Mentors */}
              <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 hover:border-[#005F02] dark:hover:border-emerald-500 transition-all space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shrink-0 shadow-3xs">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-tight">
                        Educator &amp; Mentor Network
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Course track authoring, lecturer verification, and teaching
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <a
                    href="mailto:mentors@codetutor.africa"
                    className="font-mono text-xs font-bold text-[#005F02] dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>mentors@codetutor.africa</span>
                    <ExternalLinkIcon className="w-3 h-3 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, 'mentors@codetutor.africa')}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] text-slate-600 dark:text-slate-300 hover:text-[#005F02] shadow-3xs transition-all cursor-pointer"
                    title="Copy email address"
                  >
                    {copiedEmail === 'mentors@codetutor.africa' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Info */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold shadow-3xs">
                <Clock className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span>Response &lt; 24h</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold shadow-3xs">
                <Globe className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                <span>Pan-African</span>
              </div>
            </div>
          </div>

          {/* Card 2: Regional Campus Hubs */}
          <div className="p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] space-y-3 shadow-xs shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#005F02] dark:text-emerald-400">
              <MapPinIcon className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
              <span>Campus &amp; Community Focal Points</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Serving educators, coding club leads, and student communities across university hubs:
            </p>

            {/* Hub Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REGIONAL_HUBS.map((hub) => (
                <div
                  key={hub.country}
                  className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 shadow-3xs text-left"
                >
                  <div className="font-black text-slate-900 dark:text-white text-xs">
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

        {/* Right Column: Contact Form Card (7 Cols) */}
        <div className="lg:col-span-7 h-full">
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs text-left relative h-full flex flex-col justify-between">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-600 flex items-center justify-center text-[#005F02] dark:text-emerald-400 mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Thank you for reaching out, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. A CodeTutor Africa team member will review your inquiry and get back to you at <span className="font-mono font-bold text-[#005F02] dark:text-emerald-400">{email}</span> within 24 hours.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white transition-all cursor-pointer shadow-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form Card Header */}
                <div className="space-y-1 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Send Us a Message
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Fill out the form below and we will respond to your inquiry promptly.
                  </p>
                </div>

                {/* Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
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
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:bg-white dark:focus:bg-[#0E1318] focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 shadow-3xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
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
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:bg-white dark:focus:bg-[#0E1318] focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 shadow-3xs transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Country & Inquiry Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Nation / Country */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Nation / Country
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] text-xs font-bold text-slate-900 dark:text-white shadow-3xs focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 appearance-none cursor-pointer"
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
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Inquiry Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full pl-10 pr-9 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] text-xs font-bold text-slate-900 dark:text-white shadow-3xs focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 appearance-none cursor-pointer"
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
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Subject
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Deploying CodeTutor in our University Computer Lab"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:bg-white dark:focus:bg-[#0E1318] focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 shadow-3xs transition-all"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
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
                    className="w-full p-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:bg-white dark:focus:bg-[#0E1318] focus:outline-none focus:border-[#005F02] dark:focus:border-emerald-500 shadow-3xs transition-all"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-xl text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs border-2 border-[#005F02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <SendIcon className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
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
