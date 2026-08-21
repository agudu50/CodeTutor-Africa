import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion'
import { Button, Badge } from '@/components/ui'
import { useTheme } from '@/app/providers/ThemeProvider'
import { BackgroundCodeAnimation } from '../components/BackgroundCodeAnimation'
import {
  Sparkles,
  Bot,
  Code2,
  Bug,
  GraduationCap,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  BatteryCharging,
  DollarSign,
  Users,
  Terminal,
  RotateCcw,

  Zap,
  Database,
  Clock,
  BookOpen,
  Heart,
  Globe,
  Shield,
  HardDrive,
  Quote,
} from 'lucide-react'

/* ─────────────────────────────────── Animated Counter Hook ──── */
function useAnimatedCounter(target: number, duration = 2000, inView = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, inView])
  return count
}


/* ─────────────────────────────────── Section Reveal Wrapper ──── */
const SectionReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────── Main Component ──── */
export const LandingPage: React.FC = () => {
  const { isDark, setTheme } = useTheme()
  const [activeFeatureTab, setActiveFeatureTab] = useState<'tutor' | 'practice' | 'debugger' | 'curriculum'>('tutor')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Hero Background Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Terminal animation
  const [terminalRunning, setTerminalRunning] = useState(false)
  const [terminalStep, setTerminalStep] = useState(-1)
  const terminalRef = useRef(null)
  const terminalInView = useInView(terminalRef, { once: true, margin: '-100px' })

  // Stats section
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const ramCount = useAnimatedCounter(14, 1800, statsInView) // 1.4 -> display as 14 then /10
  const lessonCount = useAnimatedCounter(52, 2000, statsInView)
  const latencyCount = useAnimatedCounter(320, 1600, statsInView)

  const slides = [
    {
      image: '/images/students_collaboration.jpg',
      tag: 'Campus Collaborative Study Group',
      caption: 'African university students mastering algorithms together without internet dependencies',
    },
    {
      image: '/images/student_focus.jpg',
      tag: 'Individual Deep Practice',
      caption: 'Quiet, focused algorithmic problem solving on standard 8 GB laptops',
    },
  ]

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  // Terminal auto-start when in view
  useEffect(() => {
    if (terminalInView && !terminalRunning) {
      setTerminalRunning(true)
      setTerminalStep(-1)
    }
  }, [terminalInView])

  // Terminal step-by-step animation
  useEffect(() => {
    if (!terminalRunning) return
    const timers: ReturnType<typeof setTimeout>[] = []
    const delays = [400, 1200, 2200, 3400, 4800]
    delays.forEach((d, i) => {
      timers.push(setTimeout(() => setTerminalStep(i), d))
    })
    return () => timers.forEach(clearTimeout)
  }, [terminalRunning])

  const restartTerminal = () => {
    setTerminalStep(-1)
    setTerminalRunning(false)
    setTimeout(() => {
      setTerminalRunning(true)
    }, 200)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const terminalLogs = [
    { text: '$ codetutor start --offline --target=8gb-ram', type: 'cmd' as const },
    { text: '✓ Local runtime initialized (Memory allocation: 1.4 GB)', type: 'success' as const },
    { text: '✓ Quantized Gemma 2B IT neural weights mounted on CPU', type: 'success' as const },
    { text: '✓ Pre-cached syllabi indexed (Python 3.12, JavaScript, Java 21)', type: 'info' as const },
    { text: '● Offline Tutor Standby — Zero cloud packets transmitted [READY]', type: 'ready' as const },
  ]

  const faqs = [
    {
      q: 'How does CodeTutor Africa run an AI model without internet on an 8 GB RAM laptop?',
      a: 'We utilize highly optimized 4-bit quantized local neural weights (such as Gemma 2B IT) which only require ~1.4 GB of system RAM. Inference executes directly on your laptop CPU or integrated GPU with zero network packets sent over the internet.',
    },
    {
      q: 'Do I need to pay for OpenAI API keys or mobile data bundles?',
      a: 'No. CodeTutor Africa is completely free and self-contained. There are no API keys, recurring subscriptions, or cloud dependencies required to practice code, debug errors, or chat with the AI tutor.',
    },
    {
      q: 'Which African university curricula are supported?',
      a: 'The syllabus is mapped directly to standard university computer science courses, including CS101 (Programming Fundamentals in Python), Data Structures & Algorithms, and Object-Oriented Software Engineering in Java/JavaScript across institutions like UG, KNUST, Makerere, UNILAG, UCT, and Ashesi.',
    },
    {
      q: 'Can I use CodeTutor Africa during power outages or in transit?',
      a: 'Yes. Since every course module, test case runner, and AI model weight is pre-stored on your local hard drive, you can study in dormitories, libraries, or off-grid locations seamlessly.',
    },
  ]

  const featureTabs = {
    tutor: {
      title: 'Socratic AI Tutor',
      subtitle: 'A patient, non-judgmental mentor that asks guiding questions',
      badge: 'Gemma 2B Local',
      codeSnippet: `# Recursive Call Stack Memory Breakdown
def countdown(n: int):
    if n <= 0:  # Base Case
        print("Blast off!")
        return
    print(f"Frame {n} added to stack")
    countdown(n - 1)  # Recurses towards base condition`,
      aiResponse: `"Notice how each call to countdown(n) pushes a new frame onto your laptop's memory stack. Why is the base case check n <= 0 necessary to prevent a RecursionError?"`,
      stats: 'Average response: 320ms on Core i5 CPU',
    },
    practice: {
      title: 'Interactive Code Sandbox',
      subtitle: 'Instant test case validation with step-by-step hint reveals',
      badge: 'Automated Test Runner',
      codeSnippet: `def is_palindrome(s: str) -> bool:
    clean = ''.join(c.lower() for c in s if c.isalnum())
    # Recursive base cases
    if len(clean) <= 1:
        return True
    if clean[0] != clean[-1]:
        return False
    return is_palindrome(clean[1:-1])`,
      aiResponse: `"✓ All 3 test cases passed! Time complexity O(N) where N is string length. Space complexity O(N) due to recursion stack depth."`,
      stats: '100% offline execution engine',
    },
    debugger: {
      title: 'Root Cause Error Debugger',
      subtitle: 'Clear, compassionate explanations of syntax & boundary errors',
      badge: 'Offline Diagnostic Engine',
      codeSnippet: `# Buggy loop with off-by-one error
for i in range(len(scores) + 1):
    total += scores[i]  # IndexError: list index out of range`,
      aiResponse: `"Root cause: In Python, lists are 0-indexed. When scores has length 3, valid indices are 0, 1, 2. The loop attempted to access index 3. Fixed code: for score in scores:"`,
      stats: 'Identifies stack trace root causes in seconds',
    },
    curriculum: {
      title: 'Structured University Syllabi',
      subtitle: 'Full CS101, Data Structures, and OOP tracks',
      badge: 'Curriculum Aligned',
      codeSnippet: `# Module 2 • Lesson 4: Singly Linked List Traversal
class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`,
      aiResponse: `"Complete modules available for Python, JavaScript, and Java. Each lesson includes reading notes, memory diagrams, and paired algorithmic exercises."`,
      stats: '52 comprehensive lessons pre-cached',
    },
  }

  const realitiesData = [
    {
      icon: WifiOff,
      iconBg: 'bg-amber-50 dark:bg-amber-950/50',
      iconBorder: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      tag: 'Offline Resilience',
      title: 'Erratic Campus Connectivity',
      description: 'Study without anxiety. When dorm internet or library Wi-Fi drops, CodeTutor Africa continues executing code, explaining concepts, and tracking test progress with zero downtime.',
      stat: '0ms',
      statLabel: 'downtime on Wi-Fi loss',
      highlights: [
        'Local code execution and automated test runner',
        'Pre-cached university syllabi & lecture notes',
        'Uninterrupted practice during power cuts',
      ],
    },
    {
      icon: DollarSign,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      iconBorder: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      tag: '100% Free Forever',
      title: 'Zero Mobile Data Burden',
      description: 'Cloud AI tutors consume heavy internet data on every prompt. CodeTutor Africa runs 100% on your laptop\'s CPU, saving your student budget for what matters most.',
      stat: '0 KB',
      statLabel: 'cloud data consumed',
      highlights: [
        'No monthly internet data bundles burned',
        'No OpenAI or third-party API subscription costs',
        'Fully private inference on your 8 GB laptop',
      ],
    },
    {
      icon: Users,
      iconBg: 'bg-brand-50 dark:bg-brand-950/50',
      iconBorder: 'border-brand-200 dark:border-brand-800',
      iconColor: 'text-brand-600 dark:text-brand-400',
      tag: 'Psychological Safety',
      title: '1-on-1 Guidance in Large Classes',
      description: 'In university lecture halls with hundreds of students, asking questions can feel intimidating. Your offline tutor provides a patient, safe space to master tricky logic without fear of judgment.',
      stat: '\u221E',
      statLabel: 'questions you can ask',
      highlights: [
        'Socratic prompts that guide without giving away answers',
        'Friendly, compassionate syntax error breakdowns',
        'Practice as many times as you need in private',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white relative">


      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shrink-0 border border-brand-500"
          >
            <Sparkles className="w-5 h-5 text-accent-300" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              CodeTutor <span className="text-brand-600 dark:text-brand-400 font-extrabold">Africa</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Offline AI Core
            </span>
          </div>
        </Link>

        {/* Center links on desktop */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {[
            { href: '#terminal-demo', label: 'Offline Runtime' },
            { href: '#why-offline', label: 'Realities We Solve' },
            { href: '#features', label: 'Workspace' },
            { href: '#architecture', label: 'Hardware Specs' },
            { href: '#faq', label: 'FAQ' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-brand-500 after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA / Auth & Theme Switch */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </motion.button>

          <Link to="/signin">
            <Button variant="ghost" size="sm" className="font-semibold text-xs">
              Sign In
            </Button>
          </Link>

          <Link to="/signup">
            <Button variant="primary" size="sm" className="font-semibold text-xs">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">

        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION — Full-Bleed Background Picture Slideshow
            ═══════════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-[540px] sm:min-h-[600px] flex items-center justify-center px-4 md:px-8 overflow-hidden bg-slate-950 border-b border-slate-800"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Animated Background Slides */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={slides[currentSlide].image}
                alt={slides[currentSlide].caption}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Solid Flat Dark Overlay (no gradient) */}
            <div className="absolute inset-0 bg-slate-950 opacity-65" />
          </div>

          {/* Slide navigation controls */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Slide Tag */}
          <div className="absolute top-6 left-6 sm:left-12 z-20 hidden sm:block">
            <motion.span
              key={slides[currentSlide].tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-mono"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {slides[currentSlide].tag}
            </motion.span>
          </div>

          {/* Slide Dots */}
          <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  currentSlide === idx ? 'w-10 bg-brand-500' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Hero Foreground Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 py-16 sm:py-20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-7"
            >
              {/* Pill Badge */}
              <motion.div
                variants={itemVariants}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="inline-block"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-brand-500 text-brand-300 text-xs font-semibold shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  Zero Cloud Dependence • 100% On-Device AI for 8 GB Laptops
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] drop-shadow-lg"
              >
                Master University Computer Science.{' '}
                <br className="hidden sm:block" />
                Anytime. <span className="text-brand-400 font-black">Offline.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md"
              >
                An intelligent, human-centered programming tutor built for African students. Learn Python, JavaScript, and Java with a private AI mentor that lives directly on your laptop—no internet connection, cloud bills, or expensive hardware required.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-4 pt-3"
              >
                <Link to="/signup">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="font-bold shadow-lg h-13 px-8 bg-brand-600 hover:bg-brand-500 border border-brand-400 text-base"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Start Learning Free
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="font-semibold h-13 px-8 bg-slate-900 text-white hover:bg-slate-800 border border-slate-600 text-base"
                      leftIcon={<Laptop className="w-4 h-4" />}
                    >
                      Launch Workspace
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-[11px] text-slate-400 font-mono"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Private & Local
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Sub-400ms Response
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" /> No Internet Required
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: LIVE TERMINAL BOOT — Dark Technical Canvas
            ═══════════════════════════════════════════════════════════════ */}
        <section id="terminal-demo" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-950 relative overflow-hidden">
          {/* Subtle dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          <div className="max-w-6xl mx-auto space-y-12 relative z-10" ref={terminalRef}>
            <SectionReveal>
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 font-mono">
                  <Terminal className="w-4 h-4" />
                  Real-World On-Device Verification
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Live On-Device Terminal Boot
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Engineered for student laptops. The AI tutor neural runtime mounts directly into memory—no internet connection, cloud server, or recurring fees.
                </p>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Interactive Terminal Window (7 Cols) */}
              <SectionReveal delay={0.1} className="lg:col-span-7 flex flex-col justify-between">
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-left flex flex-col justify-between h-full"
                >
                  {/* Terminal Window Header — macOS Style */}
                  <div className="h-12 px-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 inline-block hover:brightness-125 transition-all cursor-pointer" />
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block hover:brightness-125 transition-all cursor-pointer" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block hover:brightness-125 transition-all cursor-pointer" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 ml-1 truncate">
                        codetutor-africa — local-runtime-v0.1.0 — zsh
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="brand" size="sm" className="font-mono text-[10px] bg-brand-950 text-brand-300 border-brand-800 shrink-0">
                        OFFLINE 8GB RAM
                      </Badge>
                      <motion.button
                        whileHover={{ scale: 1.15, rotate: -90 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={restartTerminal}
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        title="Re-run terminal demo"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Terminal Animated Body */}
                  <div className="p-5 sm:p-7 font-mono text-xs sm:text-sm text-slate-200 space-y-3.5 min-h-[260px] bg-slate-950 relative flex-1">
                    {/* Line numbers gutter */}
                    <div className="absolute left-0 top-0 bottom-0 w-9 bg-slate-950 border-r border-slate-900 flex flex-col pt-5 sm:pt-7 gap-3.5 text-right pr-2 text-[10px] text-slate-700 font-mono select-none">
                      {terminalLogs.map((_, idx) => (
                        <span key={idx} className={`transition-all duration-300 ${idx <= terminalStep ? 'opacity-100' : 'opacity-0'}`}>
                          {idx + 1}
                        </span>
                      ))}
                    </div>

                    <div className="pl-5 space-y-1">
                      {terminalLogs.map((log, idx) => (
                        <AnimatePresence key={idx}>
                          {idx <= terminalStep && (
                            <motion.div
                              initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className="flex items-start gap-2 py-1"
                            >
                              {log.type === 'cmd' && (
                                <span className="text-brand-400 font-bold">{log.text}</span>
                              )}
                              {log.type === 'success' && (
                                <span className="text-emerald-400">{log.text}</span>
                              )}
                              {log.type === 'info' && (
                                <span className="text-sky-400">{log.text}</span>
                              )}
                              {log.type === 'ready' && (
                                <motion.span
                                  animate={{ opacity: [1, 0.7, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="text-amber-300 font-bold bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800"
                                >
                                  {log.text}
                                </motion.span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))}

                      {/* Blinking Cursor */}
                      <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2.5 h-4 bg-brand-500 align-middle mt-1 rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Terminal Sub-bar with live metrics */}
                  <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      No Network Required • 0.00 KB Sent
                    </span>
                    <span className="text-slate-400">Gemma 2B IT • Q4_K_M (1.4 GB RAM)</span>
                  </div>
                </motion.div>
              </SectionReveal>

              {/* Right Column: Human-Centered Student Voice & Study Context (5 Cols) */}
              <SectionReveal delay={0.2} className="lg:col-span-5 flex flex-col justify-between">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4 h-full flex flex-col justify-between text-left">
                  {/* Photo with Overlay Badge */}
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 bg-slate-950 shrink-0">
                    <img
                      src="/images/terminal_student_offline.jpg"
                      alt="African university computer science student coding offline on laptop in library"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                    />

                    {/* Floating Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/90 text-slate-200 border border-slate-700 text-[10px] font-mono backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                        Campus Study Hall Tested
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/90 text-brand-300 border border-slate-700 text-[10px] font-mono backdrop-blur-sm">
                        <Cpu className="w-3 h-3 text-brand-400" />
                        Target: 8 GB Laptops
                      </span>
                    </div>
                  </div>

                  {/* Student Lived-Experience Quote */}
                  <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800 flex-1 flex flex-col justify-between">
                    <div className="flex items-start gap-2.5 text-xs text-slate-300 italic leading-relaxed">
                      <Quote className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>
                        "I can debug recursion trees in the campus library till late at night without worrying about dead Wi-Fi or spending my mobile data."
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px]">
                      <span className="font-semibold text-white font-sans">
                        Kwame O.
                      </span>
                      <span className="text-slate-400 font-mono">
                        CS Level 200 • UG Legon
                      </span>
                    </div>
                  </div>

                  {/* 3 Micro Metrics for Student Realities */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="block text-xs font-bold text-emerald-400">0.00</span>
                      <span className="block text-[9px] text-slate-500 uppercase">Data Cost</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="block text-xs font-bold text-brand-400">100%</span>
                      <span className="block text-[9px] text-slate-500 uppercase">On-Device</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="block text-xs font-bold text-amber-300">4+ Hrs</span>
                      <span className="block text-[9px] text-slate-500 uppercase">Battery Save</span>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: THE REALITIES WE SOLVE — Human-Centered Empathy
            ═══════════════════════════════════════════════════════════════ */}
        <section id="why-offline" className="py-20 sm:py-28 px-4 md:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-16">
            <SectionReveal>
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  <Heart className="w-4 h-4" />
                  The Realities We Solve
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Built Around the Real Daily Experience{' '}
                  <span className="text-brand-600 dark:text-brand-400">of African Students</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                  Coding education shouldn't stop when campus Wi-Fi drops, electricity fluctuates, or monthly data bundles run out.
                </p>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {realitiesData.map((card, idx) => {
                const Icon = card.icon
                return (
                  <SectionReveal key={card.title} delay={idx * 0.1}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="relative p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${card.iconBg} border ${card.iconBorder} ${card.iconColor} flex items-center justify-center transition-transform duration-300`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          {/* Stat badge */}
                          <div className="text-right">
                            <span className="block text-2xl font-bold font-mono text-slate-900 dark:text-white">{card.stat}</span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono">{card.statLabel}</span>
                          </div>
                        </div>

                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
                            {card.tag}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {card.title}
                          </h3>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      {/* Bullet Highlights */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-4">
                        {card.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </SectionReveal>
                )
              })}
            </div>

            {/* University Empathy Context Banner */}
            <SectionReveal delay={0.25}>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm text-left">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    University Curriculum Alignment
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Designed for African Computer Science Departments
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Syllabi and algorithmic problem sets are mapped directly to CS101, Data Structures, and Software Engineering modules across African institutions.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {['UG Legon', 'KNUST', 'UNILAG', 'Makerere', 'UCT', 'Ashesi'].map((uni) => (
                    <span
                      key={uni}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold"
                    >
                      {uni}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: INTERACTIVE WORKSPACE — Tabbed Feature Preview
            ═══════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-10">
            <SectionReveal>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  <Code2 className="w-4 h-4" />
                  Interactive Workspace
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Everything You Need to Excel in University CS
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click through the modules below to see how each tool empowers your offline study sessions.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              {/* Interactive Navigation Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {[
                  { id: 'tutor', label: 'AI Socratic Tutor', icon: Bot },
                  { id: 'practice', label: 'Offline Code Practice', icon: Code2 },
                  { id: 'debugger', label: 'Root Cause Debugger', icon: Bug },
                  { id: 'curriculum', label: 'University Syllabi', icon: GraduationCap },
                ].map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeFeatureTab === tab.id
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setActiveFeatureTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-lg'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              {/* Animated Tab Preview Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeatureTab}
                  initial={{ opacity: 0, y: 16, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.99 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
                >
                  {/* Sub-Header */}
                  <div className="p-5 sm:p-6 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {featureTabs[activeFeatureTab].title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {featureTabs[activeFeatureTab].subtitle}
                      </p>
                    </div>
                    <Badge variant="brand" size="sm" className="font-mono text-[10px] self-start sm:self-auto">
                      {featureTabs[activeFeatureTab].badge}
                    </Badge>
                  </div>

                  {/* Code & Response Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 font-mono text-xs">
                    {/* Left: Code Pane */}
                    <div className="p-6 bg-slate-950 text-slate-200 space-y-3 overflow-x-auto leading-relaxed">
                      <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-3 h-3" /> Active Editor Context
                        </span>
                        <span className="text-slate-600">UTF-8</span>
                      </div>
                      <pre className="whitespace-pre pt-2 font-mono text-xs text-slate-200 leading-relaxed">
                        {featureTabs[activeFeatureTab].codeSnippet}
                      </pre>
                    </div>

                    {/* Right: AI Tutor / Diagnostic Output */}
                    <div className="p-6 bg-slate-900 text-slate-200 space-y-5 font-sans text-xs flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-400 font-semibold font-mono text-[11px]">
                          <Bot className="w-4 h-4" />
                          <span>On-Device Intelligent Feedback:</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed text-sm bg-slate-950 p-5 rounded-xl border border-slate-800">
                          {featureTabs[activeFeatureTab].aiResponse}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {featureTabs[activeFeatureTab].stats}
                        </span>
                        <Link to="/dashboard" className="text-brand-400 hover:text-brand-300 flex items-center gap-1 font-sans transition-colors">
                          Try Workspace <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </SectionReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4: HARDWARE SPECS — Animated Counter Metrics
            ═══════════════════════════════════════════════════════════════ */}
        <section id="architecture" className="py-20 sm:py-28 px-4 md:px-8">
          <div className="max-w-5xl mx-auto space-y-12" ref={statsRef}>
            <SectionReveal>
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  <Cpu className="w-4 h-4" />
                  Hardware Efficiency
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Optimized for Standard University Laptops
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Engineered specifically to run efficiently on an 8 GB RAM laptop without thermal throttling or memory starvation.
                </p>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1: RAM */}
              <SectionReveal delay={0}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-7 rounded-2xl border border-slate-700 bg-slate-800 space-y-4 shadow-md hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-950 border border-brand-700 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">AI Memory</span>
                  </div>
                  <p className="text-3xl font-bold text-white font-mono tabular-nums">
                    {(ramCount / 10).toFixed(1)} <span className="text-lg text-slate-400">GB RAM</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    4-bit quantized Gemma 2B weights leave 6.6 GB available for browser and system.
                  </p>
                  {/* Mini progress bar */}
                  <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={statsInView ? { width: '17.5%' } : { width: 0 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full rounded-full bg-brand-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">1.4 / 8.0 GB used by AI</span>
                </motion.div>
              </SectionReveal>

              {/* Card 2: RAG */}
              <SectionReveal delay={0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-7 rounded-2xl border border-slate-700 bg-slate-800 space-y-4 shadow-md hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-accent-950 border border-accent-700 text-accent-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Database className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Knowledge</span>
                  </div>
                  <p className="text-3xl font-bold text-white font-mono">
                    IndexedDB
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Local vector index over lecture slides and textbook materials with zero cloud lookups.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{lessonCount} lessons pre-cached</span>
                  </div>
                </motion.div>
              </SectionReveal>

              {/* Card 3: Battery */}
              <SectionReveal delay={0.2}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-7 rounded-2xl border border-slate-700 bg-slate-800 space-y-4 shadow-md hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BatteryCharging className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Latency</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">
                    {latencyCount}<span className="text-lg text-slate-400">ms</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sub-400ms inference bursts designed to preserve laptop battery life during load shedding.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <Zap className="w-3 h-3" />
                    <span>Lightweight CPU inference</span>
                  </div>
                </motion.div>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5: FAQ ACCORDION
            ═══════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto space-y-10">
            <SectionReveal>
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                  <BookOpen className="w-4 h-4" />
                  Common Questions
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>
            </SectionReveal>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <SectionReveal key={index} delay={index * 0.05}>
                    <motion.div
                      layout
                      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? 'border-brand-300 dark:border-brand-700 shadow-lg bg-white dark:bg-slate-900'
                          : 'border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {faq.q}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronDown className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-brand-500' : 'text-slate-400'}`} />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-12 sm:pl-16 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </SectionReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6: FINAL CALL TO ACTION
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 px-4 md:px-8 text-center text-white relative overflow-hidden">
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

          <SectionReveal>
            <div className="max-w-3xl mx-auto space-y-5 relative z-10">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <Sparkles className="w-10 h-10 text-brand-400 mx-auto" />
              </motion.div>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Join the Offline Coding{' '}
                <span className="text-brand-400">Revolution</span> Today
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Equip yourself with the tools to master computer science without barriers. Free, offline, and tailored for African universities.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link to="/signup">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="font-bold shadow-lg h-14 px-10 bg-brand-600 hover:bg-brand-500 border border-brand-400 text-base"
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Create Free Account
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="font-semibold h-14 px-8 bg-slate-950 text-slate-200 border-slate-700 hover:bg-slate-800 text-base"
                    >
                      Explore as Guest
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Trust footer in CTA */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> No sign-up data leaves your device
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Setup in under 2 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3" /> Free forever
                </span>
              </div>
            </div>
          </SectionReveal>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Top footer row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base border border-brand-500">
                <Sparkles className="w-5 h-5 text-accent-300" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  CodeTutor <span className="text-brand-600 dark:text-brand-400">Africa</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono">Offline AI-Powered CS Education</p>
              </div>
            </div>

            {/* Links grid */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-500">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform</span>
                <div className="flex flex-col gap-1.5">
                  <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dashboard</Link>
                  <Link to="/tutor" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">AI Tutor</Link>
                  <Link to="/practice" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Code Practice</Link>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Learn</span>
                <div className="flex flex-col gap-1.5">
                  <Link to="/learning" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Courses</Link>
                  <Link to="/debugger" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Debugger</Link>
                  <Link to="/progress" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Progress</Link>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account</span>
                <div className="flex flex-col gap-1.5">
                  <Link to="/signin" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Sign In</Link>
                  <Link to="/signup" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Create Account</Link>
                  <Link to="/settings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Settings</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-400">
            <span>© 2026 CodeTutor Africa. Built with ❤ for African Universities.</span>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" /> 100% Local
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-brand-500" /> On-Device AI
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-sky-500" /> No Cloud
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
