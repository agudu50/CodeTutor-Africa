import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Cpu,
  Zap,
  ChevronLeft,
  Terminal,
  CheckCircle2,
} from 'lucide-react'

export const SignInPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, setTheme } = useTheme()
  const [emailOrId, setEmailOrId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 600)
  }

  const handleGuestContinue = () => {
    navigate('/dashboard')
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
            src="/images/students_collaboration.jpg"
            alt="African Students Collaborating"
            className="w-full h-full object-cover object-center opacity-50 dark:opacity-45 filter saturate-110"
          />
          <div className="absolute inset-0 bg-[#090D12]/70" />
          {/* Blueprint SVG Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08] text-white" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-left-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-left-blueprint-grid)" />
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
            <span>LOCAL CPU ENGINE</span>
          </span>
        </div>

        {/* Center: Hero Statement & Value Proposition */}
        <div className="relative z-10 my-auto py-8 lg:py-0 space-y-5 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold shadow-3xs">
            <Cpu className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
            <span>Runs Locally on CPU • Zero API Costs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Master Software Engineering <br />
            <span className="text-[#005F02] dark:text-emerald-400 font-black">Without Internet Limits.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
            Zero-latency code execution, interactive Socratic diagnostics, and gamified syntax drills—bundled entirely on your everyday laptop.
          </p>

          {/* Telemetry Stats Bar - Dashboard Card System */}
          <div className="grid grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-[#0E1318] border-2 border-slate-700 space-y-1 shadow-3xs text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Inference Speed</div>
              <div className="text-xl font-mono font-black text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                <span>23.4 tok/s</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1318] border-2 border-slate-700 space-y-1 shadow-3xs text-left">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Network Usage</div>
              <div className="text-xl font-mono font-black text-[#005F02] dark:text-emerald-400">
                0 KB Required
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: African Engineering Footer Badge */}
        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-5 font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
            <span>Built for African University Curricula</span>
          </span>
          <span className="font-mono text-[#005F02] dark:text-emerald-400 font-bold">v2.4.0 Offline Engine</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT SIDE: DASHBOARD CARD SYSTEM AUTH FORM
          ═══════════════════════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 relative overflow-y-auto bg-[#FAFAFA] dark:bg-[#0C1015]">
        {/* Blueprint SVG Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-right-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-right-blueprint-grid)" />
        </svg>

        {/* Top Navigation & Theme Toggle Bar */}
        <div className="relative z-10 flex items-center justify-between w-full mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#005F02] dark:hover:border-emerald-500 shadow-3xs transition-colors group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </Link>

          {/* Mobile-Only Brand Center Badge */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#0C1015] border-2 border-slate-300 dark:border-slate-700 p-0.5 flex items-center justify-center shrink-0 shadow-3xs overflow-hidden">
              <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-md" />
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
          <div className="rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-5 text-left">
            {/* Card Header */}
            <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                  <span>OFFLINE AUTH</span>
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Access your local coding tracks and compiler diagnostics.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email or Username
                </label>
                <div className="relative rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] focus-within:bg-white dark:focus-within:bg-[#0E1318] focus-within:border-[#005F02] dark:focus-within:border-emerald-500 shadow-3xs transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="e.g. kofi@gmail.com or kofi_mensah"
                    className="w-full bg-transparent py-2.5 pr-3.5 text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 placeholder:font-normal focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Offline password reset is stored in your local settings.')
                    }}
                    className="text-[11px] font-bold text-[#005F02] dark:text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </a>
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
                    placeholder="Enter your password"
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
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-700 text-[#005F02] focus:ring-[#005F02] accent-[#005F02]"
                  />
                  <span>Remember on this offline device</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold text-xs h-11 rounded-xl bg-[#005F02] hover:bg-[#004e02] active:scale-95 text-white shadow-xs border-2 border-[#005F02] flex items-center justify-center gap-2 transition-all mt-3 cursor-pointer group disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#0E1318] px-3 text-slate-400 font-mono text-[10px] font-bold">
                  OR CONTINUE OFFLINE
                </span>
              </div>
            </div>

            {/* Guest Mode Bypass Card */}
            <button
              type="button"
              onClick={handleGuestContinue}
              className="w-full p-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[#FAFAFA] dark:bg-[#0C1015] hover:border-[#005F02] dark:hover:border-emerald-500 transition-all text-left flex items-center justify-between group cursor-pointer shadow-3xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 flex items-center justify-center font-bold shadow-3xs shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                    Continue as Offline Guest
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Instant sandbox access without sign in
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Security Indicator */}
            <div className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-mono font-medium flex items-center justify-center gap-2 shadow-3xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
              <span>Encrypted locally in offline SQLite storage</span>
            </div>
          </div>

          {/* Bottom Switch Link */}
          <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-5 font-medium">
            Don't have an offline profile yet?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#005F02] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Create an account →
            </Link>
          </p>
        </motion.div>

        {/* Right Footer */}
        <div className="relative z-10 text-center text-[11px] text-slate-400 font-mono pt-6">
          CodeTutor Africa • 100% Offline Educational Platform
        </div>
      </div>
    </div>
  )
}

export default SignInPage
