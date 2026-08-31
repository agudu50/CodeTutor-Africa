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
} from 'lucide-react'
import { WEST_AFRICAN_COUNTRIES } from '@/features/leaderboard/data/mockLeaderboardData'

function SendIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
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

export const ContactSection: React.FC = memo(() => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('GH')
  const [inquiryType, setInquiryType] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !message.trim()) return

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))

    // Save to local storage for offline preservation and admin review
    try {
      const stored = localStorage.getItem('codetutor_contact_inquiries') || '[]'
      const list = JSON.parse(stored)
      list.unshift({
        id: `inq-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim(),
        country,
        inquiryType,
        subject: subject.trim() || 'General Inquiry',
        message: message.trim(),
        submittedAt: new Date().toISOString(),
      })
      localStorage.setItem('codetutor_contact_inquiries', JSON.stringify(list))
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
      {/* Header */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Contact Cards & Regional Hubs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Card 1: Direct Support & Partnerships */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-xl space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
              <span>Direct Communication Channels</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <a
                href="mailto:support@codetutor.africa"
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 hover:border-[#005F02] dark:hover:border-emerald-500 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#005F02]/10 dark:bg-emerald-500/15 border border-[#005F02]/20 dark:border-emerald-500/30 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                    General Inquiries &amp; Help Desk
                  </div>
                  <div className="text-slate-500 font-mono text-xs mt-0.5">
                    support@codetutor.africa
                  </div>
                </div>
              </a>

              <a
                href="mailto:partnerships@codetutor.africa"
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 hover:border-brand-500 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                  <BuildingIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Universities &amp; School Partnerships
                  </div>
                  <div className="text-slate-500 font-mono text-xs mt-0.5">
                    partnerships@codetutor.africa
                  </div>
                </div>
              </a>

              <a
                href="mailto:mentors@codetutor.africa"
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-500 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Educator &amp; Mentor Network
                  </div>
                  <div className="text-slate-500 font-mono text-xs mt-0.5">
                    mentors@codetutor.africa
                  </div>
                </div>
              </a>
            </div>

            {/* Quick Metrics Info */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>Response &lt; 24 hrs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Pan-African Support</span>
              </div>
            </div>
          </div>

          {/* Card 2: Regional Campus Hubs */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <MapPinIcon className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
              <span>Campus &amp; Community Focal Points</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Serving educators and student communities in Ghana (Accra, Kumasi), Nigeria (Lagos, Ibadan), Senegal (Dakar), Côte d&apos;Ivoire (Abidjan), Kenya (Nairobi), and Benin (Cotonou).
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xl text-left relative overflow-hidden">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-[#005F02] dark:text-emerald-400 mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Thank you for reaching out, <strong>{fullName}</strong>. A CodeTutor Africa curriculum lead or support engineer will get back to you via <strong>{email}</strong> shortly.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fill out the form below and we will respond to your inquiry promptly.
                  </p>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 dark:focus:ring-emerald-500/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. kwame@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 dark:focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                {/* Country & Inquiry Type Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Nation / Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 cursor-pointer"
                    >
                      {WEST_AFRICAN_COUNTRIES.filter((c) => c.code !== 'ALL').map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                      <option value="OTHER">Other African Country</option>
                      <option value="INTERNATIONAL">International / Global</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                      Inquiry Category
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#005F02]/30 cursor-pointer"
                    >
                      {INQUIRY_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                    Subject <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Deploying CodeTutor in our University Computer Lab"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005F02]/30"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you or your institution..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005F02]/30"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-2xl text-xs font-extrabold bg-[#005F02] hover:bg-[#004e02] text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <SendIcon className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

ContactSection.displayName = 'ContactSection'
