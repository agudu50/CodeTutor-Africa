import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Sparkles,
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
      level: 'Foundations & Data Structures',
      description: 'Ideal for beginners and engineering algorithm exams. Focus on clean syntax, recursion, and problem-solving intuition.',
      icon: <Terminal className="w-5 h-5 text-[#005F02]" />,
    },
    {
      id: 'javascript',
      name: 'JavaScript Track',
      level: 'Async Concurrency & Web Engines',
      description: 'Master the event loop, microtasks, modern ES6+ paradigms, and DOM manipulation locally on your CPU.',
      icon: <Code2 className="w-5 h-5 text-[#005F02]" />,
    },
    {
      id: 'java',
      name: 'Java OOP Track',
      level: 'Object-Oriented Design & Memory',
      description: 'Encapsulation, inheritance, polymorphism, and Java bytecode execution aligned with computer science curricula.',
      icon: <Cpu className="w-5 h-5 text-[#005F02]" />,
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════════════
          TOP APP HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#005F02] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md shadow-[#005F02]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              CodeTutor <span className="text-[#005F02] font-black">Africa</span>
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
                  className={`h-2 rounded-full transition-all ${
                    s === step
                      ? 'w-7 bg-[#005F02]'
                      : s < step
                      ? 'w-3 bg-[#005F02]/60'
                      : 'w-3 bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-[#005F02] transition-colors shadow-xs"
            aria-label="Toggle dark/light theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#005F02]" /> : <Moon className="w-4 h-4 text-[#005F02]" />}
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN ONBOARDING WIZARD
          ═══════════════════════════════════════════════════════════════ */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 my-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: INSTITUTION & LEARNING CONTEXT */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[10px] font-mono font-bold text-[#005F02]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#005F02]" />
                  <span>STEP 1 OF 3 • LEARNING CONTEXT</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Where are you learning from?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#005F02]/10 border-[#005F02] shadow-sm ring-1 ring-[#005F02]'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {inst.country}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#005F02] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-[#005F02]' : 'text-slate-900 dark:text-white'}`}>
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
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
                  className="px-6 py-3 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs shadow-md shadow-[#005F02]/30 flex items-center gap-2 transition-all cursor-pointer"
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[10px] font-mono font-bold text-[#005F02]">
                  <Code2 className="w-3.5 h-3.5 text-[#005F02]" />
                  <span>STEP 2 OF 3 • CURRICULUM SELECTION</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Choose your primary language
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Select where you want to start. You can explore other tracks anytime from your workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 max-w-xl mx-auto">
                {languageTracks.map((lang) => {
                  const isSelected = track === lang.id
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setTrack(lang.id)}
                      className={`p-5 rounded-2xl border text-left transition-all relative flex items-start gap-4 cursor-pointer ${
                        isSelected
                          ? 'bg-[#005F02]/10 border-[#005F02] shadow-sm ring-1 ring-[#005F02]'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                        {lang.icon}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isSelected ? 'text-[#005F02]' : 'text-slate-900 dark:text-white'}`}>
                              {lang.name}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {lang.level}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#005F02] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs shadow-md shadow-[#005F02]/30 flex items-center gap-2 transition-all cursor-pointer"
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[10px] font-mono font-bold text-[#005F02]">
                  <BookOpen className="w-3.5 h-3.5 text-[#005F02]" />
                  <span>STEP 3 OF 3 • PEDAGOGICAL AI PERSONA</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  How would you like the AI to mentor you?
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Select your preferred tutoring personality. You can switch modes on any practice question.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 max-w-xl mx-auto">
                {pedagogyStyles.map((p) => {
                  const isSelected = pedagogyStyle === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPedagogyStyle(p.id)}
                      className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#005F02]/10 border-[#005F02] shadow-sm ring-1 ring-[#005F02]'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#005F02]' : 'text-slate-900 dark:text-white'}`}>
                            {p.title}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#005F02]/15 text-[#005F02]">
                            {p.badge}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#005F02] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {p.description}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Ready to Initialize Banner */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#005F02]" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Configuration saved to local SQLite database
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#005F02] font-bold">100% OFFLINE</span>
              </div>

              <div className="flex items-center justify-between pt-4 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isFinishing}
                  className="px-7 py-3.5 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-black text-xs shadow-lg shadow-[#005F02]/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-75"
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
      <footer className="py-4 text-center text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800">
        CodeTutor Africa • 100% Offline Educational Platform
      </footer>
    </div>
  )
}

export default OnboardingPage
