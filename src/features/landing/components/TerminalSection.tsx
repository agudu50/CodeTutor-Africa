import React, { useState, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Badge } from '@/components/ui'
import {
  Terminal,
  Play,
  Check,
  Copy,
  RotateCcw,
  HardDrive,
  Zap,
  Cpu,
  Quote,
} from 'lucide-react'
import { LightSectionBackground } from './LightSectionBackground'
import { SectionReveal } from './SectionReveal'
import { StepConnector } from './StepConnector'

const terminalScenarios = {
  boot: {
    id: 'boot',
    label: 'Step 1: Start AI Mentor',
    command: '$ codetutor start --offline',
    badge: 'Zero Data',
    logs: [
      { text: '$ codetutor start --offline', type: 'cmd' as const },
      { text: '✓ AI coding mentor loaded and ready on your laptop', type: 'info' as const },
      { text: '✓ Course lessons ready to learn (Python, JavaScript, Java)', type: 'success' as const },
      { text: '✓ 50+ practice exercises ready to practice without internet', type: 'success' as const },
      { text: '● AI Tutor Ready — 100% offline and free to use [READY]', type: 'ready' as const },
    ],
    metrics: {
      network: '0 KB Data (No Internet)',
      model: 'Smart AI Mentor',
      latency: 'Fast Response',
      ramPercent: 'Lightweight',
    },
  },
  test: {
    id: 'test',
    label: 'Step 2: Check Your Code',
    command: '$ codetutor test my_solution.py',
    badge: 'Instant Tests',
    logs: [
      { text: '$ codetutor test my_solution.py', type: 'cmd' as const },
      { text: '✓ Checking your code against test challenges', type: 'info' as const },
      { text: '✓ Test 1: Basic check -> Passed!', type: 'success' as const },
      { text: '✓ Test 2: Edge cases -> Passed!', type: 'success' as const },
      { text: '● Great job! All tests passed with zero internet [SUCCESS]', type: 'ready' as const },
    ],
    metrics: {
      network: '0 KB Data (No Internet)',
      model: 'Code Checker',
      latency: 'Instant (<1s)',
      ramPercent: 'Low Memory',
    },
  },
  diagnose: {
    id: 'diagnose',
    label: 'Step 3: Fix Any Mistakes',
    command: '$ codetutor fix loop_error.py',
    badge: 'Plain English',
    logs: [
      { text: '$ codetutor fix loop_error.py', type: 'cmd' as const },
      { text: '✓ Reading your code to find the mistake', type: 'info' as const },
      { text: '✓ Found the issue: The loop counts one item too far', type: 'success' as const },
      { text: '✓ Simple fix: Change range(len(items) + 1) to range(len(items))', type: 'success' as const },
      { text: '● Problem explained clearly in plain English [SOLVED]', type: 'ready' as const },
    ],
    metrics: {
      network: '0 KB Data (No Internet)',
      model: 'Friendly Helper',
      latency: 'Instant (<1s)',
      ramPercent: 'Low Memory',
    },
  },
}

const terminalModes: Array<'boot' | 'test' | 'diagnose'> = ['boot', 'test', 'diagnose']

export const TerminalSection: React.FC = memo(() => {
  const [terminalMode, setTerminalMode] = useState<'boot' | 'test' | 'diagnose'>('boot')
  const [terminalRunning, setTerminalRunning] = useState(false)
  const [terminalStep, setTerminalStep] = useState(-1)
  const [terminalIsAutoPlay, setTerminalIsAutoPlay] = useState(true)
  const [copiedCmd, setCopiedCmd] = useState(false)

  const terminalRef = useRef(null)
  const terminalInView = useInView(terminalRef, { once: true, margin: '-60px' })

  // Terminal auto-start when in view
  useEffect(() => {
    if (terminalInView && !terminalRunning) {
      setTerminalRunning(true)
      setTerminalStep(-1)
    }
  }, [terminalInView, terminalRunning])

  // Terminal step-by-step animation and automatic sequence flow
  useEffect(() => {
    if (!terminalRunning) return
    setTerminalStep(-1)
    const timers: ReturnType<typeof setTimeout>[] = []
    const delays = [300, 800, 1500, 2200, 3000]
    delays.forEach((d, i) => {
      timers.push(setTimeout(() => setTerminalStep(i), d))
    })

    // Advance to next step automatically in 5.8s if auto-play is enabled
    if (terminalIsAutoPlay) {
      timers.push(
        setTimeout(() => {
          setTerminalMode((prev) => {
            const nextIdx = (terminalModes.indexOf(prev) + 1) % terminalModes.length
            return terminalModes[nextIdx]
          })
        }, 5800)
      )
    }

    return () => timers.forEach(clearTimeout)
  }, [terminalRunning, terminalMode, terminalIsAutoPlay])

  const restartTerminal = () => {
    setTerminalStep(-1)
    setTerminalRunning(false)
    setTimeout(() => {
      setTerminalRunning(true)
    }, 150)
  }

  const handleCopyCommand = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  const currentTerminal = terminalScenarios[terminalMode]

  return (
    <section id="terminal-demo" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <LightSectionBackground
        symbols={['$ codetutor start', '✓ 100% offline', '0.00 KB sent', '● Ready']}
        accentPosition="top-left"
      />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10" ref={terminalRef}>
        <SectionReveal>
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
              <Terminal className="w-3.5 h-3.5" />
              Step 01 • Live On-Device Demo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              See It Work Directly On Your Laptop
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Built for everyday student laptops. Your AI tutor lives right on your computer—so you can learn, practice, and get help anytime without internet, data costs, or subscriptions.
            </p>
          </div>
        </SectionReveal>

        {/* Interactive Terminal Mode Switcher */}
        <SectionReveal delay={0.08}>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {(Object.keys(terminalScenarios) as Array<keyof typeof terminalScenarios>).map((modeKey) => {
                const sc = terminalScenarios[modeKey]
                const isActive = terminalMode === modeKey
                return (
                  <button
                    key={modeKey}
                    type="button"
                    onClick={() => {
                      setTerminalMode(modeKey)
                      setTerminalStep(-1)
                    }}
                    className={`relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 border border-brand-500 scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                    }`}
                  >
                    <Play className={`w-3 h-3 ${isActive ? 'fill-white' : ''}`} />
                    <span>{sc.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-brand-700 text-brand-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {sc.badge}
                    </span>

                    {/* Linear countdown progress bar */}
                    {isActive && terminalIsAutoPlay && (
                      <motion.div
                        key={`${terminalMode}-progress`}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5.8, ease: 'linear' }}
                        className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-full"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Auto-Play status pill */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Auto-playing live workflow (Step {terminalModes.indexOf(terminalMode) + 1} of 3)
              </span>
              <button
                type="button"
                onClick={() => setTerminalIsAutoPlay((prev) => !prev)}
                className="ml-1 underline hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                {terminalIsAutoPlay ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Terminal Window (7 Cols) */}
          <SectionReveal delay={0.12} className="lg:col-span-7 flex flex-col justify-between">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden text-left flex flex-col justify-between h-full">
              {/* Terminal Window Header */}
              <div className="h-12 px-4 sm:px-5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-red-500/90 inline-block hover:brightness-125 transition-all cursor-pointer" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block hover:brightness-125 transition-all cursor-pointer" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block hover:brightness-125 transition-all cursor-pointer" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                    codetutor-africa — local-runtime-v0.1.0 — zsh
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Copy Command Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleCopyCommand(currentTerminal.command)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono transition-colors shadow-xs"
                    title="Copy command to clipboard"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>

                  <Badge variant="brand" size="sm" className="font-mono text-[10px] bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800 shrink-0">
                    OFFLINE • NO DATA
                  </Badge>
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: -90 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={restartTerminal}
                    className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Replay command animation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>

              {/* Terminal Animated Body */}
              <div className="p-5 sm:p-6 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-3 min-h-[270px] bg-slate-50/50 dark:bg-slate-950 relative flex-1">
                {/* Line numbers gutter */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-9 bg-slate-100/70 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col pt-5 sm:pt-6 gap-3 text-right pr-2 text-[10px] text-slate-400 dark:text-slate-700 font-mono select-none">
                  {currentTerminal.logs.map((_, idx) => (
                    <span key={idx} className={`transition-all duration-300 ${idx <= terminalStep ? 'opacity-100' : 'opacity-0'}`}>
                      {idx + 1}
                    </span>
                  ))}
                </div>

                <div className="pl-6 space-y-1.5">
                  {currentTerminal.logs.map((log, idx) => (
                    <AnimatePresence key={`${terminalMode}-${idx}`}>
                      {idx <= terminalStep && (
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="flex items-start gap-2 py-0.5"
                        >
                          {log.type === 'cmd' && (
                            <span className="text-brand-600 dark:text-brand-400 font-bold tracking-tight">{log.text}</span>
                          )}
                          {log.type === 'success' && (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-start gap-1 font-medium">{log.text}</span>
                          )}
                          {log.type === 'info' && (
                            <span className="text-sky-600 dark:text-sky-300 font-medium">{log.text}</span>
                          )}
                          {log.type === 'ready' && (
                            <span className="text-amber-800 dark:text-amber-300 font-bold bg-amber-100/90 dark:bg-amber-950/80 px-2.5 py-1 rounded border border-amber-300 dark:border-amber-800 text-xs inline-block my-1">
                              {log.text}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}

                  {/* Blinking Cursor */}
                  <span className="inline-block w-2 h-3.5 bg-brand-600 dark:bg-brand-500 align-middle mt-1 rounded-xs animate-pulse" />
                </div>
              </div>

              {/* Terminal Live Hardware Telemetry Panel */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-4 font-mono">
                <div className="flex items-center gap-4">
                  {/* Air-Gapped Network Indicator */}
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Air-Gapped • 0.00 KB Sent
                  </span>

                  {/* RAM usage meter */}
                  <span className="hidden sm:inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <HardDrive className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    RAM: 1.4 / 8.0 GB ({currentTerminal.metrics.ramPercent})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                    <Zap className="w-3 h-3" /> {currentTerminal.metrics.latency}
                  </span>
                  <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-600 dark:text-slate-400 truncate">{currentTerminal.metrics.model}</span>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Right Column: Human-Centered Student Voice & Study Context (5 Cols) */}
          <SectionReveal delay={0.2} className="lg:col-span-5 flex flex-col justify-between">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl space-y-4 h-full flex flex-col justify-between text-left">
              {/* Photo with Overlay Badges */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shrink-0 group">
                <img
                  src="/images/terminal_student_offline.jpg"
                  alt="African learner and developer coding offline on laptop"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Status Badges */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-950/90 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Tested on Laptops
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-950/90 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-md">
                    <Cpu className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                    Everyday Laptops
                  </span>
                </div>
              </div>

              {/* Student / Developer Lived-Experience Quote */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-1 flex flex-col justify-between">
                <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  <Quote className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <span>
                    "I can practice logic and build projects at home till late at night without worrying about dead Wi-Fi or spending mobile data."
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-slate-900 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-[10px] flex items-center justify-center">
                      KO
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white font-sans block leading-none">
                        Kwame O.
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Accra • Coding Club Lead
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                    Verified Learner
                  </span>
                </div>
              </div>

              {/* 3 Micro Metrics */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="block text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">0.00</span>
                  <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">Data Cost</span>
                  <span className="block text-[8px] text-slate-400 dark:text-slate-500">100% Free</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="block text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400">100%</span>
                  <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">Offline</span>
                  <span className="block text-[8px] text-slate-400 dark:text-slate-500">Zero Internet</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="block text-sm sm:text-base font-bold text-amber-600 dark:text-amber-300">4+ Hrs</span>
                  <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">Battery Life</span>
                  <span className="block text-[8px] text-slate-400 dark:text-slate-500">Runs Cool</span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Journey Connector */}
        <StepConnector nextLabel="Next Step: See Why Offline-First Matters" targetId="why-offline" stepNumber="02" />
      </div>
    </section>
  )
})

TerminalSection.displayName = 'TerminalSection'
