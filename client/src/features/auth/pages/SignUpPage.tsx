import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  ShieldCheck,
  BookOpen,
  Code2,
  ChevronLeft,
  GraduationCap,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from 'lucide-react'

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, setTheme } = useTheme()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
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
    return { label: 'Strong', percent: 100, color: 'bg-[#005F02]', textColor: 'text-[#005F02]' }
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════════════
          LEFT SIDE: IMMERSIVE HERO BRANDING PANEL
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative lg:w-1/2 min-h-[340px] lg:min-h-screen bg-slate-950 overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Background Image with Ambient Cyber Grid & Glow */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/terminal_student_offline.jpg"
            alt="Student Learning Code Offline"
            className="w-full h-full object-cover opacity-25 filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#005f0215_1px,transparent_1px),linear-gradient(to_bottom,#005f0215_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-60" />
          {/* Ambient Radial Lighting */}
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#005F02]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#005F02]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full bg-white dark:bg-emerald-950/60 border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-xl group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white">
                CodeTutor <span className="text-emerald-400 font-black">Africa</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">100% OFFLINE AI MENTOR</span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#005F02]/20 border border-[#005F02]/50 text-[11px] font-mono font-bold text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#005F02] animate-ping" />
            <span>ZERO CLOUD COSTS</span>
          </span>
        </div>

        {/* Center: Hero Statement & Value Proposition */}
        <div className="relative z-10 my-auto py-8 lg:py-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-mono">
            <Code2 className="w-4 h-4 text-[#005F02]" />
            <span>Python • JavaScript • Java OOP</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Build Real Software Skills <br />
            <span className="text-[#005F02]">100% Offline on Your Laptop.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Create your local student profile to track lesson mastery, solve compiler drills, and battle in 3D syntax arcade games without internet limits.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 space-y-1 shadow-inner">
              <div className="text-xs text-slate-400 font-medium">Pedagogy</div>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#005F02]" />
                <span>6 Socratic Modes</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 space-y-1 shadow-inner">
              <div className="text-xs text-slate-400 font-medium">Privacy</div>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#005F02]" />
                <span>100% Local SQLite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: University Curriculum Support Footer */}
        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-5">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#005F02]" />
            <span>Aligned with African University Curricula</span>
          </span>
          <span className="font-mono text-[#005F02] font-semibold">No Credit Card Required</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT SIDE: REGISTRATION CARD WITH PASSWORD VALIDATION
          ═══════════════════════════════════════════════════════════════ */}
      <div className="lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative overflow-y-auto bg-slate-100/60 dark:bg-slate-950/80 backdrop-blur-xl">
        {/* Subtle Cyber Grid in Right Panel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#005f020a_1px,transparent_1px),linear-gradient(to_bottom,#005f020a_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none" />
        
        {/* Top Radial Ambient Highlight */}
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-[#005F02]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Navigation & Theme Toggle Bar */}
        <div className="relative z-10 flex items-center justify-between w-full mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#005F02] hover:text-[#005F02] transition-all shadow-sm group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#005F02] transition-colors shadow-sm"
            aria-label="Toggle dark/light theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#005F02]" /> : <Moon className="w-4 h-4 text-[#005F02]" />}
          </button>
        </div>

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md mx-auto my-auto"
        >
          {/* Card Outer Container */}
          <div className="relative rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] p-6 sm:p-8 space-y-4">
            
            {/* Card Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#005F02]/10 border border-[#005F02]/30 flex items-center justify-center text-[#005F02] shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#005F02]/15 border border-[#005F02]/30 text-[10px] font-mono font-extrabold text-[#005F02]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
                  <span>OFFLINE ENROLLMENT</span>
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Create Offline Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Start mastering programming locally with personalized AI guidance.
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus-within:border-[#005F02] focus-within:ring-2 focus-within:ring-[#005F02]/20 transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ama Serwaa or Kofi Mensah"
                    className="w-full bg-transparent py-2.5 pr-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email Address Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus-within:border-[#005F02] focus-within:ring-2 focus-within:ring-[#005F02]/20 transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ama.serwaa@gmail.com"
                    className="w-full bg-transparent py-2.5 pr-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input with Length / Strength Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {passLength > 0 && (
                    <span className={`text-[10px] font-mono font-bold ${strength.textColor}`}>
                      {strength.label} ({passLength} chars)
                    </span>
                  )}
                </div>
                
                <div className="relative rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus-within:border-[#005F02] focus-within:ring-2 focus-within:ring-[#005F02]/20 transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose password (min 6 chars)"
                    className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Visual Password Length Indicator Bar */}
                {passLength > 0 && (
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password Input with Match Indicator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  {passwordsMatch && (
                    <span className="text-[10px] font-mono font-bold text-[#005F02] flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> Passwords match
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] font-mono font-medium text-rose-500">
                      Passwords do not match
                    </span>
                  )}
                </div>

                <div className={`relative rounded-xl border bg-slate-50 dark:bg-slate-950 transition-all flex items-center ${
                  passwordsMatch
                    ? 'border-[#005F02] ring-1 ring-[#005F02]/30'
                    : passwordsMismatch
                    ? 'border-rose-500 ring-1 ring-rose-500/30'
                    : 'border-slate-300 dark:border-slate-700 focus-within:border-[#005F02] focus-within:ring-2 focus-within:ring-[#005F02]/20'
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
                    className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                className="w-full font-bold text-sm h-11 rounded-xl bg-[#005F02] hover:bg-[#004e02] active:scale-[0.99] text-white shadow-md shadow-[#005F02]/30 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer group disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Free Offline Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Offline Guarantee Box - Slim & Compact */}
            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#005F02] shrink-0" />
              <span>100% Offline: No subscription or cloud fees. Compilers run locally.</span>
            </div>
          </div>

          {/* Bottom Switch Link */}
          <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-4">
            Already have an offline profile?{' '}
            <Link
              to="/signin"
              className="font-bold text-[#005F02] hover:underline inline-flex items-center gap-1"
            >
              Sign in to your account →
            </Link>
          </p>
        </motion.div>

        {/* Right Footer */}
        <div className="relative z-10 text-center text-[11px] text-slate-400 pt-5">
          CodeTutor Africa • 100% Offline Educational Platform
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
