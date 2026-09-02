import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  ArrowRight,
  ChevronLeft,
  Sun,
  Moon,
  ShieldCheck,
  BookOpen,
  Code2,
  GraduationCap,
  Terminal,
  Cpu,
  Check,
} from 'lucide-react'

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, setTheme } = useTheme()
  const [step, setStep] = useState(1)
  const [institution, setInstitution] = useState('self')
  const [track, setTrack] = useState('python')
  const [pedagogyStyle, setPedagogyStyle] = useState('hint')
  const [isFinishing, setIsFinishing] = useState(false)

  const institutionList = [
    { id: 'ug', name: 'University of Ghana (Legon)', type: 'University', country: 'Ghana' },
    { id: 'knust', name: 'KNUST', type: 'Science & Tech', country: 'Ghana' },
    { id: 'unilag', name: 'University of Lagos (UNILAG)', type: 'University', country: 'Nigeria' },
    { id: 'makerere', name: 'Makerere University', type: 'University', country: 'Uganda' },
    { id: 'ashesi', name: 'Ashesi University', type: 'Engineering Hub', country: 'Ghana' },
    { id: 'uct', name: 'University of Cape Town', type: 'University', country: 'South Africa' },
    { id: 'poly', name: 'Polytechnic / Technical Institute', type: 'Technical College', country: 'Africa' },
    { id: 'club', name: 'Coding Bootcamp / Community Club', type: 'Dev Community', country: 'Pan-African' },
    { id: 'self', name: 'Self-Taught / Independent Learner', type: 'Independent', country: 'Global' },
  ]

  const languageTracks = [
    {
      id: 'python',
      name: 'Python Track',
      level: 'Foundations & Data Science',
      description: 'Ideal for beginners and engineering algorithm exams. Focus on clean syntax, recursion, and problem-solving intuition.',
      icon: <Terminal className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />,
    },
    {
      id: 'javascript',
      name: 'JavaScript Track',
      level: 'Async Concurrency & Web Engines',
      description: 'Master the event loop, microtasks, modern ES6+ paradigms, and DOM manipulation locally on your CPU.',
      icon: <Code2 className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />,
    },
    {
      id: 'html',
      name: 'HTML & CSS Track',
      level: 'Web Semantics, Flexbox & Responsive UI',
      description: 'Build responsive interfaces from scratch with semantic markup, CSS layouts, and accessible design principles.',
      icon: <BookOpen className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />,
    },
    {
      id: 'git',
      name: 'Git & GitHub Track',
      level: 'Version Control & Workflows',
      description: 'Branching, merging, rebasing, pull requests, and collaborative developer workflows.',
      icon: <ShieldCheck className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />,
    },
    {
      id: 'typescript',
      name: 'TypeScript Track',
      level: 'Type Safety & Enterprise Fullstack',
      description: 'Static typing, generics, interfaces, and strict type safety built on top of the JavaScript runtime.',
      icon: <Code2 className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />,
    },
    {
      id: 'java',
      name: 'Java OOP Track',
      level: 'Object-Oriented Design & Memory',
      description: 'Encapsulation, inheritance, polymorphism, and Java bytecode execution aligned with computer science curricula.',
      icon: <Cpu className="w-5 h-5 text-[#005F02] dark:text-emerald-400" />,
    },
  ]

  const pedagogyStyles = [
    {
      id: 'hint',
      title: 'Socratic Hints & Guidance',
      badge: 'Recommended',
      description: 'The AI never gives you copy-paste solutions directly; it asks targeted questions and points out exact line logic.',
    },
    {
      id: 'explain',
      title: 'Deep Architectural Explanations',
      badge: 'Theoretical',
      description: 'Breaks down memory state, CPU cycles, and relatable real-world analogies before diving into code.',
    },
    {
      id: 'drill',
      title: 'Fast-Paced Syntax Drills',
      badge: 'Arcade & Practical',
      description: 'Quick challenges, bug hunt blitzes, and compiler test verification to build rapid typing muscle memory.',
    },
  ]

  const handleFinish = () => {
    setIsFinishing(true)
    setTimeout(() => {
      setIsFinishing(false)
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-[#0C1015] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-200 relative">
      {/* Blueprint SVG Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="onboarding-blueprint-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#onboarding-blueprint-grid)" />
      </svg>

      {/* ═══════════════════════════════════════════════════════════════
          TOP APP HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#0E1318] border-b-2 border-slate-300 dark:border-slate-700 px-6 py-4 shadow-3xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0C1015] border-2 border-slate-300 dark:border-slate-700 p-0.5 flex items-center justify-center shrink-0 shadow-3xs group-hover:border-[#005F02] dark:group-hover:border-emerald-500 transition-colors overflow-hidden">
              <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
              CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-black">Africa</span>
            </span>
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mr-1">
              Step {step} of 3
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-lg transition-all ${
                    s === step
                      ? 'w-7 bg-[#005F02] dark:bg-emerald-400'
                      : s < step
                      ? 'w-3 bg-[#005F02]/60 dark:bg-emerald-400/60'
                      : 'w-3 bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 hover:border-[#005F02] dark:hover:border-emerald-500 transition-colors shadow-3xs cursor-pointer"
            aria-label="Toggle dark/light theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#005F02] dark:text-emerald-400" /> : <Moon className="w-4 h-4 text-[#005F02]" />}
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN ONBOARDING WIZARD
          ═══════════════════════════════════════════════════════════════ */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 my-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: INSTITUTION & LEARNING CONTEXT */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>STEP 1 OF 3 • LEARNING CONTEXT</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Where are you learning from?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  We tailor practice problem sets and exam syllabi to match your campus curriculum.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {institutionList.map((inst) => {
                  const isSelected = institution === inst.id
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => setInstitution(inst.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer shadow-xs ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#005F02] dark:border-emerald-500 ring-1 ring-[#005F02] dark:ring-emerald-500'
                          : 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                          {inst.country}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#005F02] dark:bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className={`text-xs font-black ${isSelected ? 'text-[#005F02] dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {inst.type}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs shadow-xs border-2 border-[#005F02] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <span>Continue to Language Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PRIMARY PROGRAMMING LANGUAGE TRACK */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>STEP 2 OF 3 • CURRICULUM SELECTION</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Choose your primary language
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Select where you want to start. You can explore other tracks anytime from your workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
                {languageTracks.map((lang) => {
                  const isSelected = track === lang.id
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setTrack(lang.id)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all relative flex items-start gap-4 cursor-pointer shadow-xs ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#005F02] dark:border-emerald-500 ring-1 ring-[#005F02] dark:ring-emerald-500'
                          : 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0 shadow-3xs">
                        {lang.icon}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black ${isSelected ? 'text-[#005F02] dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                              {lang.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAFAFA] dark:bg-[#0C1015] border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                              {lang.level}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#005F02] dark:bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          {lang.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between pt-4 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] hover:border-[#005F02] text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs shadow-xs border-2 border-[#005F02] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <span>Continue to Socratic Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SOCRATIC PEDAGOGY & MENTORSHIP STYLE */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-[#005F02] dark:text-emerald-400 shadow-3xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>STEP 3 OF 3 • PEDAGOGICAL AI PERSONA</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  How would you like the AI to mentor you?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Select your preferred tutoring personality. You can switch modes on any practice question.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
                {pedagogyStyles.map((p) => {
                  const isSelected = pedagogyStyle === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPedagogyStyle(p.id)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col gap-1.5 cursor-pointer shadow-xs ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-[#005F02] dark:border-emerald-500 ring-1 ring-[#005F02] dark:ring-emerald-500'
                          : 'bg-white dark:bg-[#0E1318] border-slate-300 dark:border-slate-700 hover:border-[#005F02] dark:hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${isSelected ? 'text-[#005F02] dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                            {p.title}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 shadow-3xs">
                            {p.badge}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#005F02] dark:bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {p.description}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Ready to Initialize Banner */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 shadow-xs max-w-xl mx-auto flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Configuration saved to local SQLite database
                  </span>
                </div>
                <span className="text-[10px] text-[#005F02] dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800">
                  100% OFFLINE
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] hover:border-[#005F02] text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isFinishing}
                  className="px-7 py-3 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-black text-xs shadow-xs border-2 border-[#005F02] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-75 active:scale-95"
                >
                  {isFinishing ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Launch Offline Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-4 text-center text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0E1318] relative z-10 font-bold">
        CodeTutor Africa • 100% Offline Educational Platform
      </footer>
    </div>
  )
}

export default OnboardingPage
