import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Sparkles,
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════════════
          LEFT SIDE: IMMERSIVE HERO BRANDING PANEL
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative lg:w-1/2 min-h-[340px] lg:min-h-screen bg-slate-950 overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Background Image with Ambient Cyber Grid & Glow */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/students_collaboration.jpg"
            alt="African Students Collaborating"
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
            <div className="w-11 h-11 rounded-2xl bg-[#005F02] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xl shadow-[#005F02]/40 group-hover:scale-105 transition-transform border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white">
                CodeTutor <span className="text-[#005F02] font-black">Africa</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider">100% OFFLINE AI MENTOR</span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#005F02]/20 border border-[#005F02]/50 text-[11px] font-mono font-bold text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#005F02] animate-ping" />
            <span>LOCAL CPU ENGINE</span>
          </span>
        </div>

        {/* Center: Hero Statement & Value Proposition */}
        <div className="relative z-10 my-auto py-8 lg:py-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-mono">
            <Cpu className="w-4 h-4 text-[#005F02]" />
            <span>Runs Locally on CPU • Zero API Costs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Master Software Engineering <br />
            <span className="text-[#005F02]">Without Internet Limits.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Zero-latency code execution, interactive Socratic diagnostics, and gamified syntax drills—bundled entirely on your laptop.
          </p>

          {/* Floating Telemetry Stats Bar */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 space-y-1 shadow-inner">
              <div className="text-xs text-slate-400 font-medium">Inference Speed</div>
              <div className="text-xl font-mono font-extrabold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#005F02]" />
                <span>23.4 tok/s</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 space-y-1 shadow-inner">
              <div className="text-xs text-slate-400 font-medium">Network Usage</div>
              <div className="text-xl font-mono font-extrabold text-[#005F02]">
                0 KB Required
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: African Engineering Footer Badge */}
        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-5">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#005F02]" />
            <span>Built for African University Curricula</span>
          </span>
          <span className="font-mono text-[#005F02] font-semibold">v2.4.0 Offline Engine</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RIGHT SIDE: LUXURY MODERN AUTH CARD WITH DEPTH
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
          <div className="relative rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] p-7 sm:p-9 space-y-6">
            {/* Card Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#005F02]/10 border border-[#005F02]/30 flex items-center justify-center text-[#005F02] shadow-xs">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F02]/15 border border-[#005F02]/30 text-[10px] font-mono font-extrabold text-[#005F02]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
                  <span>OFFLINE AUTH</span>
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Access your local coding tracks and compiler diagnostics.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email or Username
                </label>
                <div className="relative rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus-within:border-[#005F02] focus-within:ring-2 focus-within:ring-[#005F02]/20 transition-all flex items-center">
                  <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="e.g. kofi@gmail.com or kofi_mensah"
                    className="w-full bg-transparent py-3 pr-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Offline password reset is stored in your local settings.')
                    }}
                    className="text-[11px] font-bold text-[#005F02] hover:underline"
                  >
                    Forgot password?
                  </a>
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
                    placeholder="Enter your password"
                    className="w-full bg-transparent py-3 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
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
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#005F02] focus:ring-[#005F02] accent-[#005F02]"
                  />
                  <span>Remember on this offline device</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold text-sm h-12 rounded-xl bg-[#005F02] hover:bg-[#004e02] active:scale-[0.99] text-white shadow-lg shadow-[#005F02]/30 flex items-center justify-center gap-2 transition-all mt-3 cursor-pointer group disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-mono text-[10px] font-bold">
                  OR CONTINUE OFFLINE
                </span>
              </div>
            </div>

            {/* Guest Mode Bypass Card */}
            <button
              type="button"
              onClick={handleGuestContinue}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 hover:border-[#005F02] hover:bg-[#005F02]/5 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#005F02]/10 text-[#005F02] flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4 text-[#005F02]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">
                    Continue as Offline Guest
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Instant sandbox access without sign in
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#005F02] group-hover:translate-x-1 transition-all" />
            </button>

            {/* Security Indicator */}
            <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#005F02] shrink-0" />
              <span>Encrypted locally in offline SQLite storage</span>
            </div>
          </div>

          {/* Bottom Switch Link */}
          <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-5">
            Don't have an offline profile yet?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#005F02] hover:underline inline-flex items-center gap-1"
            >
              Create an account →
            </Link>
          </p>
        </motion.div>

        {/* Right Footer */}
        <div className="relative z-10 text-center text-[11px] text-slate-400 pt-6">
          CodeTutor Africa • 100% Offline Educational Platform
        </div>
      </div>
    </div>
  )
}

export default SignInPage
