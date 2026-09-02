import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sun,
  Moon,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Search,
  X,
  ChevronDown,
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

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, setTheme } = useTheme()

  // Recovery method tabs
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+233')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Steps: 1 = Request, 2 = Verify Code & Set Password, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Searchable Country Dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const countryDropdownRef = useRef<HTMLDivElement>(null)

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

  // Password strength calculation
  const passLength = newPassword.length
  const getStrength = () => {
    if (passLength === 0) return { label: '', percent: 0, color: 'bg-slate-300 dark:bg-slate-700', textColor: 'text-slate-400' }
    if (passLength < 6) return { label: 'Too short (min 6)', percent: 25, color: 'bg-rose-500', textColor: 'text-rose-500' }
    if (passLength < 8) return { label: 'Fair', percent: 60, color: 'bg-amber-500', textColor: 'text-amber-500' }
    return { label: 'Strong', percent: 100, color: 'bg-[#005F02] dark:bg-emerald-500', textColor: 'text-[#005F02] dark:text-emerald-400' }
  }
  const strength = getStrength()
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  // Handle Step 1: Request recovery
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (recoveryMethod === 'email' && !email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }
    if (recoveryMethod === 'phone' && !phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSuccessMessage(
        recoveryMethod === 'email'
          ? `A 6-digit recovery code has been sent to ${email}.`
          : `A 6-digit recovery code has been sent to ${countryCode} ${phoneNumber}.`
      )
      setStep(2)
    }, 600)
  }

  // Handle Step 2: Set new password
  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (verificationCode.trim().length < 4) {
      setErrorMessage('Please enter the verification code.')
      return
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
    }, 600)
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0C1015] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-200 relative">
      {/* ═══════════════════════════════════════════════════════════════
          LEFT SIDE: DASHBOARD BLUEPRINT BRANDING PANEL (DESKTOP)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex relative lg:w-1/2 min-h-screen bg-[#090D12] text-white overflow-hidden flex-col justify-between p-6 sm:p-10 lg:p-14 border-r-2 border-slate-300 dark:border-slate-800">
        {/* Brightened Background Image (Zero Line Grids) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/students_collaboration.jpg"
            alt="African Students Collaborating"
            className="w-full h-full object-cover object-center opacity-50 filter brightness-110 saturate-110"
          />
          <div className="absolute inset-0 bg-[#090D12]/50" />
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
            <span>ACCOUNT SECURITY</span>
          </span>
        </div>

        {/* Center: Hero Statement & Value Proposition */}
        <div className="relative z-10 my-auto py-8 lg:py-0 space-y-5 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold shadow-3xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>Local Device Recovery • Zero Cloud Dependence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Account Recovery <br />
            <span className="text-[#005F02] dark:text-emerald-400 font-black">Fast, Secure & Private.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Your offline progress, lesson streaks, and code exercises are safely stored on your laptop. Recover your password in seconds without losing any data.
          </p>

          {/* Telemetry Stats Bar - Dashboard Card System */}
          <div className="grid grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-[#0E1318] border-2 border-slate-700 space-y-1 shadow-3xs text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Data Safety</div>
              <div className="text-sm font-mono font-black text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                <span>SQLite Preserved</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1318] border-2 border-slate-700 space-y-1 shadow-3xs text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Recovery Time</div>
              <div className="text-sm font-mono font-black text-[#005F02] dark:text-emerald-400">
                &lt; 30 Seconds
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: African Engineering Footer Badge */}
        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-5 font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
            <span>Built for African Students, Campuses & Self-Learners</span>
          </span>
          <span className="font-mono text-[#005F02] dark:text-emerald-400 font-bold">v2.4.0 Offline Engine</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT SIDE: DASHBOARD CARD SYSTEM FORGOT PASSWORD FORM
          ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 relative overflow-y-auto bg-[#FAFAFA] dark:bg-[#0C1015]">
        {/* Blueprint SVG Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="forgot-right-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#forgot-right-blueprint-grid)" />
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
          <div className="rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-5 text-left">
            {/* Header / Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                <Lock className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {step === 1 && 'Reset Password'}
                  {step === 2 && 'Set New Password'}
                  {step === 3 && 'Password Reset!'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {step === 1 && 'Select your recovery method to reset your offline credentials.'}
                  {step === 2 && 'Enter verification details and choose a new password.'}
                  {step === 3 && 'Your password has been successfully updated.'}
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

            {/* Success Message Alert */}
            {successMessage && step !== 3 && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 text-xs font-bold text-[#005F02] dark:text-emerald-400 flex items-center gap-2 shadow-3xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                STEP 1: RECOVERY METHOD & REQUEST
                ══════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                {/* Method Tabs */}
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border-2 border-slate-300 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod('email')
                      setErrorMessage('')
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      recoveryMethod === 'email'
                        ? 'bg-white dark:bg-[#0E1318] text-[#005F02] dark:text-emerald-400 border border-slate-300 dark:border-slate-700 shadow-3xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Email Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod('phone')
                      setErrorMessage('')
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      recoveryMethod === 'phone'
                        ? 'bg-white dark:bg-[#0E1318] text-[#005F02] dark:text-emerald-400 border border-slate-300 dark:border-slate-700 shadow-3xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Phone Number
                  </button>
                </div>

                {/* Email Field */}
                {recoveryMethod === 'email' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Registered Email Address
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
                )}

                {/* Phone Field with Searchable Country Code */}
                {recoveryMethod === 'phone' && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Registered Phone Number
                    </label>
                    <div className="flex gap-2 relative">
                      {/* Searchable Country Code Dropdown */}
                      <div ref={countryDropdownRef} className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCountryDropdownOpen((prev) => !prev)
                            setCountrySearchQuery('')
                          }}
                          className="w-[104px] sm:w-[112px] h-[42px] px-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] hover:bg-white dark:hover:bg-[#0E1318] focus:border-[#005F02] dark:focus-within:border-emerald-500 shadow-3xs transition-all flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
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

                        {isCountryDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 w-64 sm:w-72 bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
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
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 54 123 4567"
                          className="w-full bg-transparent py-2 pr-3.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Offline Key Field */}
                {/* Submit Request Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#005F02] hover:bg-[#004d02] border-2 border-[#005F02] text-white text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ══════════════════════════════════════════════════════════
                STEP 2: CODE VERIFICATION & NEW PASSWORD
                ══════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <form onSubmit={handleSetNewPassword} className="space-y-3.5">
                {/* Verification Code */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    6-Digit Recovery Code
                  </label>
                  <div className="relative rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500 shadow-3xs transition-all flex items-center">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="e.g. 582910"
                      className="w-full bg-transparent py-2.5 px-3.5 text-center text-sm font-mono tracking-widest font-black text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal placeholder:tracking-normal focus:outline-none"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    {passLength > 0 && (
                      <span className={`text-[10px] font-mono font-bold ${strength.textColor}`}>
                        {strength.label}
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
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-transparent py-2.5 pr-10 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm New Password
                  </label>
                  <div className={`relative rounded-xl border-2 transition-all flex items-center shadow-3xs ${
                    passwordsMismatch
                      ? 'border-rose-400 dark:border-rose-600 bg-rose-50/20'
                      : passwordsMatch
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500'
                  }`}>
                    <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full bg-transparent py-2.5 pr-10 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Reset Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#005F02] hover:bg-[#004d02] border-2 border-[#005F02] text-white text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Update Password & Save</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ══════════════════════════════════════════════════════════
                STEP 3: SUCCESS STATE
                ══════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="py-4 space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-center shadow-3xs">
                  <Check className="w-7 h-7 text-[#005F02] dark:text-emerald-400 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Password Reset Complete!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Your offline account credentials have been updated securely. You can now sign in with your new password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#005F02] hover:bg-[#004d02] border-2 border-[#005F02] text-white text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bottom: Back to Sign In Link */}
            {step !== 3 && (
              <div className="pt-2 border-t-2 border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#005F02] dark:hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Remembered your password? Back to Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom Status Indicator */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 font-mono font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#005F02] dark:bg-emerald-400" />
            <span>LOCAL DATABASE ACTIVE</span>
          </span>
          <span className="text-[11px]">100% PRIVATE</span>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
