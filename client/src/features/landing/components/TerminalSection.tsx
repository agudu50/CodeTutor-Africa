import React, { useState, useEffect, useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Terminal,
  Play,
  Check,
  Copy,
  RotateCcw,
  Zap,
  Cpu,
  Quote,
  CornerDownLeft,
  X,
} from 'lucide-react'
import { LightSectionBackground } from './LightSectionBackground'
import { SectionReveal } from './SectionReveal'
import { StepConnector } from './StepConnector'

interface LogEntry {
  text: string
  type: 'cmd' | 'info' | 'success' | 'ready' | 'warn' | 'dim'
}

interface Scenario {
  id: string
  label: string
  command: string
  badge: string
  logs: LogEntry[]
  metrics: {
    network: string
    model: string
    latency: string
    ramPercent: string
  }
}

const terminalScenarios: Record<string, Scenario> = {
  boot: {
    id: 'boot',
    label: 'Step 1: Start AI Mentor',
    command: 'codetutor start --offline',
    badge: 'Zero Data',
    logs: [
      { text: '$ codetutor start --offline', type: 'cmd' },
      { text: '✓ Initializing on-device Llama/Phi neural runtime (Q4 quantized)...', type: 'info' },
      { text: '✓ 3 Language tracks indexed (Python 3.12, JavaScript ES2024, Java 21)', type: 'success' },
      { text: '✓ 50+ offline coding practice exercises loaded into local cache', type: 'success' },
      { text: '● Offline AI Engine Ready — 100% Private, 0 KB Network Required [READY]', type: 'ready' },
    ],
    metrics: {
      network: '0 KB Data (Air-Gapped)',
      model: 'On-Device AI Engine',
      latency: 'Instant (<150ms)',
      ramPercent: '1.4 / 8.0 GB RAM',
    },
  },
  test: {
    id: 'test',
    label: 'Step 2: Check Your Code',
    command: 'codetutor test solution.py',
    badge: 'Instant Tests',
    logs: [
      { text: '$ codetutor test solution.py', type: 'cmd' },
      { text: '✓ Spawning local test sandbox without network...', type: 'info' },
      { text: '✓ Case 1: is_palindrome("racecar") -> True (Passed in 12ms)', type: 'success' },
      { text: '✓ Case 2: is_palindrome("A man a plan a canal Panama") -> True (Passed in 18ms)', type: 'success' },
      { text: '✓ Case 3: is_palindrome("university") -> False (Passed in 12ms)', type: 'success' },
      { text: '● All 3/3 Automated Tests Passed! Zero internet used [ACCEPTED]', type: 'ready' },
    ],
    metrics: {
      network: '0 KB Data (Air-Gapped)',
      model: 'Automated Test Runner',
      latency: '42ms Execution',
      ramPercent: '0.1 MB Overhead',
    },
  },
  diagnose: {
    id: 'diagnose',
    label: 'Step 3: Fix Any Mistakes',
    command: 'codetutor fix ArraySearch.java',
    badge: 'Plain English',
    logs: [
      { text: '$ codetutor fix ArraySearch.java', type: 'cmd' },
      { text: '✓ Parsing JVM bytecode & identifying stack trace error...', type: 'info' },
      { text: '✓ Root Cause: Loop condition "i <= scores.length" attempts out-of-bounds access at index 3', type: 'warn' },
      { text: '✓ Solution: Replace "<= scores.length" with strictly less than "< scores.length"', type: 'success' },
      { text: '● Bug explained in Plain English — Suggested patch ready to apply [SOLVED]', type: 'ready' },
    ],
    metrics: {
      network: '0 KB Data (Air-Gapped)',
      model: 'Offline Error Explainer',
      latency: 'Instant (<200ms)',
      ramPercent: 'Low CPU (3%)',
    },
  },
}

const interactiveCommands: Record<string, LogEntry[]> = {
  help: [
    { text: '$ codetutor help', type: 'cmd' },
    { text: 'Available CodeTutor CLI Commands:', type: 'info' },
    { text: '  codetutor start --offline     Initialize local AI tutor daemon', type: 'dim' },
    { text: '  codetutor test <file>         Run test suites against solutions', type: 'dim' },
    { text: '  codetutor fix <file>          Explain errors in plain English', type: 'dim' },
    { text: '  codetutor doctor              Inspect local RAM and CPU health', type: 'dim' },
    { text: '  clear                         Clear terminal canvas', type: 'dim' },
  ],
  doctor: [
    { text: '$ codetutor doctor', type: 'cmd' },
    { text: '✓ Operating System: Optimized for Windows / Linux / macOS', type: 'success' },
    { text: '✓ RAM Availability: 6.6 GB free (requires only 1.2 GB)', type: 'success' },
    { text: '✓ Offline Neural Weights: Verified SHA256 integrity', type: 'success' },
    { text: '● System status: Optimal for 100% offline study without battery drain', type: 'ready' },
  ],
}

export const TerminalSection: React.FC = memo(() => {
  const [terminalMode, setTerminalMode] = useState<string>('boot')
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>(terminalScenarios.boot.logs)
  const [terminalStep, setTerminalStep] = useState(terminalScenarios.boot.logs.length)
  const [terminalIsAutoPlay, setTerminalIsAutoPlay] = useState(true)
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [inputCommand, setInputCommand] = useState('')
  const [activeTab, setActiveTab] = useState<'bash' | 'python' | 'logs'>('bash')

  const terminalRef = useRef<HTMLDivElement>(null)
  const logsContainerRef = useRef<HTMLDivElement>(null)
  const terminalInView = useInView(terminalRef, { once: true, margin: '-60px' })

  // Auto-scroll terminal on new log
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
    }
  }, [terminalLogs, terminalStep])

  // Sequence playback when mode changes
  useEffect(() => {
    const scenario = terminalScenarios[terminalMode]
    if (scenario) {
      setTerminalLogs(scenario.logs)
      setTerminalStep(1)
      let step = 1
      const interval = setInterval(() => {
        step += 1
        setTerminalStep(step)
        if (step >= scenario.logs.length) {
          clearInterval(interval)
        }
      }, 700)
      return () => clearInterval(interval)
    }
  }, [terminalMode])

  // Auto-play mode loop
  useEffect(() => {
    if (!terminalIsAutoPlay || !terminalInView) return
    const modes = Object.keys(terminalScenarios)
    const interval = setInterval(() => {
      setTerminalMode((prev) => {
        const nextIdx = (modes.indexOf(prev) + 1) % modes.length
        return modes[nextIdx]
      })
    }, 6500)
    return () => clearInterval(interval)
  }, [terminalIsAutoPlay, terminalInView])

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopiedCmd(true)
      setTimeout(() => setCopiedCmd(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleExecuteInput = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputCommand.trim().toLowerCase()
    if (!trimmed) return

    setTerminalIsAutoPlay(false)

    if (trimmed === 'clear') {
      setTerminalLogs([])
      setTerminalStep(0)
      setInputCommand('')
      return
    }

    if (trimmed.includes('start') || trimmed.includes('boot')) {
      setTerminalMode('boot')
      setInputCommand('')
      return
    }

    if (trimmed.includes('test')) {
      setTerminalMode('test')
      setInputCommand('')
      return
    }

    if (trimmed.includes('fix') || trimmed.includes('debug')) {
      setTerminalMode('diagnose')
      setInputCommand('')
      return
    }

    if (interactiveCommands[trimmed]) {
      setTerminalLogs((prev) => [...prev, ...interactiveCommands[trimmed]])
      setTerminalStep((prev) => prev + interactiveCommands[trimmed].length)
      setInputCommand('')
      return
    }

    // Default fallback command response
    const customLogs: LogEntry[] = [
      { text: `$ ${inputCommand}`, type: 'cmd' },
      { text: `Executing "${trimmed}" locally on-device...`, type: 'info' },
      { text: `Completed successfully in 24ms with 0 KB data transfer.`, type: 'success' },
    ]
    setTerminalLogs((prev) => [...prev, ...customLogs])
    setTerminalStep((prev) => prev + customLogs.length)
    setInputCommand('')
  }

  const currentScenario = terminalScenarios[terminalMode] || terminalScenarios.boot

  return (
    <section id="terminal" ref={terminalRef} className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <LightSectionBackground
        symbols={['$ codetutor start', '0 KB Sent', 'Verified ✓', 'RAM: 1.4 GB']}
        accentPosition="top-right"
      />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Section Heading */}
        <SectionReveal>
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
              <Terminal className="w-3.5 h-3.5" />
              Interactive On-Device Terminal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              See It Work Directly On Your Laptop
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Built for everyday student laptops. Your AI tutor lives right on your computer—so you can learn, practice, and debug code without internet or data costs.
            </p>
          </div>
        </SectionReveal>

        {/* Interactive Scenario Buttons */}
        <SectionReveal delay={0.08}>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {Object.keys(terminalScenarios).map((modeKey) => {
                const sc = terminalScenarios[modeKey]
                const isActive = terminalMode === modeKey
                return (
                  <button
                    key={modeKey}
                    type="button"
                    onClick={() => {
                      setTerminalIsAutoPlay(false)
                      setTerminalMode(modeKey)
                    }}
                    className={`relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 cursor-pointer ${
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

                    {/* Progress Bar in Autoplay */}
                    {isActive && terminalIsAutoPlay && (
                      <motion.div
                        key={`${terminalMode}-progress`}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 6.5, ease: 'linear' }}
                        className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-full"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Command Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="font-bold">Try typing:</span>
              {['help', 'doctor', 'clear'].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => {
                    setInputCommand(cmd)
                  }}
                  className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
              <span className="mx-1">•</span>
              <button
                type="button"
                onClick={() => setTerminalIsAutoPlay((prev) => !prev)}
                className="underline hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
              >
                {terminalIsAutoPlay ? 'Pause Autoplay' : 'Resume Autoplay'}
              </button>
            </div>
          </div>
        </SectionReveal>

        {/* ═══════════════════════════════════════════════════════════════
            TERMINAL WINDOW & LEARNER STORY GRID
            ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Interactive Terminal Window (7 Cols) */}
          <SectionReveal delay={0.12} className="lg:col-span-7 flex flex-col justify-between">
            <div className="rounded-2xl border border-slate-700/80 bg-[#1e1e1e] shadow-2xl overflow-hidden text-left flex flex-col justify-between h-full text-slate-200">
              {/* VS Code Window Titlebar */}
              <div className="h-8 px-3 bg-[#1F1F1F] border-b border-[#2D2D2D] flex items-center justify-between gap-2 select-none shrink-0">
                {/* Traffic Dots */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 inline-block shadow-xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 inline-block shadow-xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 inline-block shadow-xs" />
                </div>

                {/* Command Title */}
                <div className="text-[11px] font-mono text-slate-400 truncate flex items-center gap-1.5">
                  <span className="text-slate-500">🔍</span>
                  <span className="truncate">codetutor-africa — Terminal: bash (Offline Local Node)</span>
                </div>

                {/* Network Pill */}
                <span className="text-[10px] font-mono font-bold text-[#005F02] bg-[#005F02]/20 px-2 py-0.2 rounded border border-[#005F02]/40">
                  0 KB AIR-GAPPED
                </span>
              </div>

              {/* Terminal Panel Tab Header Bar */}
              <div className="h-9 px-3 bg-[#252526] border-b border-[#181818] flex items-center justify-between gap-2 select-none shrink-0">
                {/* Left: Terminal Tabs */}
                <div className="flex items-center gap-3 overflow-hidden h-full text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bash')}
                    className={`h-full px-3 flex items-center gap-1.5 border-t-2 transition-colors cursor-pointer ${
                      activeTab === 'bash'
                        ? 'bg-[#1e1e1e] border-[#005F02] text-slate-100 font-bold'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3 h-3 text-[#005F02]" />
                    <span>1: codetutor-cli</span>
                  </button>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">OUTPUT</span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">DEBUG CONSOLE</span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(currentScenario.command)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#333333] hover:bg-[#3d3d3d] text-slate-300 text-[10px] font-mono transition-colors cursor-pointer"
                    title="Copy command"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="w-3 h-3 text-[#005F02]" />
                        <span className="text-[#005F02]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTerminalLogs([])
                      setTerminalStep(0)
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
                    title="Clear terminal"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sc = terminalScenarios[terminalMode] || terminalScenarios.boot
                      setTerminalLogs(sc.logs)
                      setTerminalStep(sc.logs.length)
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
                    title="Replay sequence"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Terminal Logs Canvas */}
              <div
                ref={logsContainerRef}
                className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-6 bg-[#1e1e1e] overflow-y-auto min-h-[280px] max-h-[360px] space-y-1.5 flex-1 select-text"
              >
                {terminalLogs.slice(0, terminalStep).map((log, idx) => (
                  <motion.div
                    key={`${idx}-${log.text.slice(0, 10)}`}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-start gap-2"
                  >
                    {log.type === 'cmd' ? (
                      <div className="flex items-center gap-1.5 text-[#569cd6] font-bold">
                        <span className="text-[#005F02]">student@laptop</span>
                        <span className="text-slate-500">:</span>
                        <span className="text-[#ce9178]">~/codetutor</span>
                        <span className="text-white">{log.text}</span>
                      </div>
                    ) : log.type === 'success' ? (
                      <span className="text-[#005F02] font-semibold">{log.text}</span>
                    ) : log.type === 'warn' ? (
                      <span className="text-[#ffd700] font-medium">{log.text}</span>
                    ) : log.type === 'info' ? (
                      <span className="text-[#9cdcfe]">{log.text}</span>
                    ) : log.type === 'ready' ? (
                      <span className="text-[#005F02] font-bold bg-[#005F02]/10 px-2.5 py-0.5 rounded border border-[#005F02]/30 block my-1">
                        {log.text}
                      </span>
                    ) : (
                      <span className="text-slate-400">{log.text}</span>
                    )}
                  </motion.div>
                ))}

                {/* Interactive Prompt Input Form */}
                <form onSubmit={handleExecuteInput} className="flex items-center gap-2 pt-2 text-xs sm:text-[13px]">
                  <div className="flex items-center gap-1 text-[#005F02] font-bold shrink-0">
                    <span>student@laptop</span>
                    <span className="text-slate-500">:</span>
                    <span className="text-[#ce9178]">~/codetutor</span>
                    <span className="text-white">$</span>
                  </div>
                  <input
                    type="text"
                    value={inputCommand}
                    onChange={(e) => setInputCommand(e.target.value)}
                    placeholder="Type command (e.g. help, doctor, test, clear)..."
                    className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder:text-slate-600 text-xs sm:text-[13px]"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="p-1 rounded bg-[#333333] hover:bg-[#005F02] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Press Enter to execute"
                  >
                    <CornerDownLeft className="w-3 h-3" />
                  </button>
                </form>
              </div>

              {/* Terminal Bottom Status Bar (#005F02) */}
              <div className="h-6 px-3 bg-[#005F02] text-white flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
                    <span>Air-Gapped (0.00 KB Data)</span>
                  </span>
                  <span className="hidden sm:inline text-white/80">•</span>
                  <span className="hidden sm:inline text-white/90">{currentScenario.metrics.ramPercent}</span>
                </div>

                <div className="flex items-center gap-3 text-white/90">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {currentScenario.metrics.latency}
                  </span>
                  <span className="hidden md:inline text-white/80">•</span>
                  <span className="hidden md:inline">{currentScenario.metrics.model}</span>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Right Column: Learner Voice & Local Metrics (5 Cols) */}
          <SectionReveal delay={0.2} className="lg:col-span-5 flex flex-col justify-between">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl space-y-4 h-full flex flex-col justify-between text-left">
              {/* Photo with Hardware Badges */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shrink-0 group">
                <img
                  src="/images/terminal_student_offline.jpg"
                  alt="Student coding offline on laptop"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Status Badges */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-950/90 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-md font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Tested on Everyday Laptops
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-950/90 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-md font-bold">
                    <Cpu className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                    4GB / 8GB RAM Ready
                  </span>
                </div>
              </div>

              {/* Student Quote */}
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
                        Accra • Student Developer
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 font-bold">
                    Verified Learner
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards */}
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
