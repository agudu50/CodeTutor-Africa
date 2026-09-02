import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Lock,
  Mail,
  User,
  Search,
  X,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  ShieldCheck,
  BookOpen,
  Code2,
  GraduationCap,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from 'lucide-react'

function PhoneIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

const COUNTRY_DIAL_CODES = [
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'SN', name: 'Senegal', dial: '+221', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225', flag: '🇨🇮' },
  { code: 'RW', name: 'Rwanda', dial: '+250', flag: '🇷🇼' },
  { code: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
  { code: 'ET', name: 'Ethiopia', dial: '+251', flag: '🇪🇹' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'CM', name: 'Cameroon', dial: '+237', flag: '🇨🇲' },
  { code: 'BJ', name: 'Benin', dial: '+229', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', dial: '+228', flag: '🇹🇬' },
  { code: 'LR', name: 'Liberia', dial: '+231', flag: '🇱🇷' },
  { code: 'SL', name: 'Sierra Leone', dial: '+232', flag: '🇸🇱' },
  { code: 'GM', name: 'The Gambia', dial: '+220', flag: '🇬🇲' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', dial: '+223', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', dial: '+227', flag: '🇳🇪' },
  { code: 'GN', name: 'Guinea', dial: '+224', flag: '🇬🇳' },
  { code: 'CV', name: 'Cabo Verde', dial: '+238', flag: '🇨🇻' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'USA / Canada', dial: '+1', flag: '🇺🇸' },
]

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, setTheme } = useTheme()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+233')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const countryDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCountry = COUNTRY_DIAL_CODES.find((c) => c.dial === countryCode) || COUNTRY_DIAL_CODES[0]

  const filteredCountries = COUNTRY_DIAL_CODES.filter((c) => {
    const q = countrySearchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q)
    )
  })

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Password length & strength calculation
  const passLength = password.length
  const getStrength = () => {
    if (passLength === 0) return { label: '', percent: 0, color: 'bg-slate-300 dark:bg-slate-700', textColor: 'text-slate-400' }
    if (passLength < 6) return { label: 'Too short (min 6)', percent: 25, color: 'bg-rose-500', textColor: 'text-rose-500' }
    if (passLength < 8) return { label: 'Fair', percent: 60, color: 'bg-amber-500', textColor: 'text-amber-500' }
    return { label: 'Strong', percent: 100, color: 'bg-[#005F02] dark:bg-emerald-500', textColor: 'text-[#005F02] dark:text-emerald-400' }
  }
  const strength = getStrength()

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Transition to onboarding wizard
      navigate('/onboarding')
    }, 500)
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0C1015] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-200 relative">
      {/* ═══════════════════════════════════════════════════════════════
          LEFT SIDE: DASHBOARD BLUEPRINT BRANDING PANEL
          ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex relative lg:w-1/2 min-h-screen bg-[#090D12] text-white overflow-hidden flex-col justify-between p-6 sm:p-10 lg:p-14 border-r-2 border-slate-300 dark:border-slate-800">
        {/* Background Image with Crisp High-Contrast Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/terminal_student_offline.jpg"
            alt="Student Learning Code Offline"
            className="w-full h-full object-cover object-center opacity-50 dark:opacity-45 filter saturate-110"
          />
          <div className="absolute inset-0 bg-[#090D12]/70" />
          {/* Blueprint SVG Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08] text-white" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="signup-left-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#signup-left-blueprint-grid)" />
          </svg>
        </div>

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-[#0E1318] border-2 border-slate-700 p-0.5 flex items-center justify-center shrink-0 shadow-3xs group-hover:border-[#005F02] transition-colors overflow-hidden">
              <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xl tracking-tight text-white">
                CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-black">Africa</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">100% OFFLINE AI MENTOR</span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs font-mono font-bold text-emerald-400 shadow-3xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ZERO CLOUD COSTS</span>
          </span>
        </div>

        {/* Center: Hero Statement & Value Proposition */}
        <div className="relative z-10 my-auto py-8 lg:py-0 space-y-5 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold shadow-3xs">
            <Code2 className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>Python • JavaScript • Java OOP</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Build Real Software Skills <br />
            <span className="text-[#005F02] dark:text-emerald-400 font-black">100% Offline on Your Laptop.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Create your local student profile to track lesson mastery, solve compiler drills, and battle in 3D syntax arcade games without internet limits.
          </p>

          {/* Feature Highlights Grid - Dashboard Card System */}
          <div className="grid grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-[#0E1318] border-2 border-slate-700 space-y-1 shadow-3xs text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Pedagogy</div>
              <div className="text-sm font-black text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                <span>6 Socratic Modes</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1318] border-2 border-slate-700 space-y-1 shadow-3xs text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Privacy</div>
              <div className="text-sm font-black text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                <span>100% Local SQLite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: University Curriculum Support Footer */}
        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-5 font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
            <span>Aligned with African University Curricula</span>
          </span>
          <span className="font-mono text-[#005F02] dark:text-emerald-400 font-bold">No Credit Card Required</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT SIDE: DASHBOARD CARD SYSTEM REGISTRATION FORM
          ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 relative overflow-y-auto bg-[#FAFAFA] dark:bg-[#0C1015]">
        {/* Blueprint SVG Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="signup-right-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#signup-right-blueprint-grid)" />
        </svg>

        {/* Top Navigation & Theme Toggle Bar */}
        <div className="relative z-10 flex items-center justify-between lg:justify-end w-full mb-4 sm:mb-6">
          {/* Mobile-Only Logo */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#0C1015] border-2 border-slate-300 dark:border-slate-700 p-0.5 flex items-center justify-center shrink-0 shadow-3xs group-hover:border-[#005F02] dark:group-hover:border-emerald-500 transition-colors overflow-hidden">
              <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-black">Africa</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-1.5 sm:p-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 hover:border-[#005F02] dark:hover:border-emerald-500 shadow-3xs transition-colors cursor-pointer"
            aria-label="Toggle dark/light theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#005F02] dark:text-emerald-400" /> : <Moon className="w-4 h-4 text-[#005F02]" />}
          </button>
        </div>

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md mx-auto my-auto"
        >
          {/* Card Outer Container - Dashboard Standard */}
          <div className="rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-4 text-left">
            
            {/* Card Header */}
            <div className="space-y-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                  <span>OFFLINE ENROLLMENT</span>
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Create Offline Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Start mastering programming locally with personalized AI guidance.
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2 shadow-3xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500 shadow-3xs transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ama Serwaa or Kofi Mensah"
                    className="w-full bg-transparent py-2.5 pr-3.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500 shadow-3xs transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ama.serwaa@gmail.com"
                    className="w-full bg-transparent py-2.5 pr-3.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Number with Searchable Country Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Optional SMS Backup</span>
                </div>
                <div className="flex gap-2 relative">
                  {/* Searchable Country Code Dropdown */}
                  <div ref={countryDropdownRef} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCountryDropdownOpen((prev) => !prev)
                        setCountrySearchQuery('')
                      }}
                      className="w-[104px] sm:w-[112px] h-[42px] px-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] hover:bg-white dark:hover:bg-[#0E1318] focus:border-[#005F02] dark:focus:border-emerald-500 shadow-3xs transition-all flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
                      aria-haspopup="listbox"
                      aria-expanded={isCountryDropdownOpen}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                        <span className="font-mono text-xs">{selectedCountry.dial}</span>
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isCountryDropdownOpen ? 'rotate-180 text-[#005F02] dark:text-emerald-400' : ''
                        }`}
                      />
                    </button>

                    {/* Popover Dropdown Menu with Search */}
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-64 sm:w-72 bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
                        {/* Search Input */}
                        <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#0C1015]">
                          <div className="relative flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] px-2 py-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
                            <input
                              type="text"
                              autoFocus
                              value={countrySearchQuery}
                              onChange={(e) => setCountrySearchQuery(e.target.value)}
                              placeholder="Search country or code..."
                              className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                            />
                            {countrySearchQuery && (
                              <button
                                type="button"
                                onClick={() => setCountrySearchQuery('')}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Country List */}
                        <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => {
                              const isSelected = selectedCountry.code === c.code
                              return (
                                <button
                                  type="button"
                                  key={c.code}
                                  onClick={() => {
                                    setCountryCode(c.dial)
                                    setIsCountryDropdownOpen(false)
                                    setCountrySearchQuery('')
                                  }}
                                  className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 font-bold'
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                                  }`}
                                >
                                  <span className="flex items-center gap-2 truncate pr-2">
                                    <span className="text-base leading-none shrink-0">{c.flag}</span>
                                    <span className="truncate">{c.name}</span>
                                  </span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                      {c.dial}
                                    </span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />}
                                  </div>
                                </button>
                              )
                            })
                          ) : (
                            <div className="px-3 py-4 text-center text-xs text-slate-400 font-mono">
                              No countries found for "{countrySearchQuery}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="relative flex-1 h-[42px] rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500 shadow-3xs transition-all flex items-center">
                    <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                      <PhoneIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 54 123 4567"
                      className="w-full bg-transparent py-2 pr-3.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input with Length / Strength Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {passLength > 0 && (
                    <span className={`text-[10px] font-mono font-bold ${strength.textColor}`}>
                      {strength.label} ({passLength} chars)
                    </span>
                  )}
                </div>
                
                <div className="relative rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500 shadow-3xs transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose password (min 6 chars)"
                    className="w-full bg-transparent py-2.5 pr-10 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Visual Password Length Indicator Bar */}
                {passLength > 0 && (
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-300 dark:border-slate-700">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password Input with Match Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  {passwordsMatch && (
                    <span className="text-[10px] font-mono font-bold text-[#005F02] dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> Passwords match
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] font-mono font-bold text-rose-500">
                      Passwords do not match
                    </span>
                  )}
                </div>

                <div className={`relative rounded-xl border-2 bg-[#FAFAFA] dark:bg-[#0C1015] shadow-3xs transition-all flex items-center ${
                  passwordsMatch
                    ? 'border-[#005F02] dark:border-emerald-500 bg-white dark:bg-[#0E1318]'
                    : passwordsMismatch
                    ? 'border-rose-500 bg-white dark:bg-[#0E1318]'
                    : 'border-slate-300 dark:border-slate-700 focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500'
                }`}>
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-transparent py-2.5 pr-10 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold text-xs h-11 rounded-xl bg-[#005F02] hover:bg-[#004e02] active:scale-95 text-white shadow-xs border-2 border-[#005F02] flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer group disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Free Offline Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Offline Guarantee Box - Dashboard Style */}
            <div className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium flex items-center gap-2 shadow-3xs">
              <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
              <span>100% Offline: No subscription or cloud fees. Compilers run locally.</span>
            </div>
          </div>

          {/* Bottom Switch Link */}
          <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-4 font-medium">
            Already have an offline profile?{' '}
            <Link
              to="/signin"
              className="font-bold text-[#005F02] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Sign in to your account →
            </Link>
          </p>
        </motion.div>

        {/* Right Footer */}
        <div className="relative z-10 text-center text-[11px] text-slate-400 font-mono pt-5">
          CodeTutor Africa • 100% Offline Educational Platform
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
