import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion'
import { Button, Badge } from '@/components/ui'
import { useTheme } from '@/app/providers/ThemeProvider'
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
  Check,
  Copy,
  Play,
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Hero Background Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Terminal interactive state & scenarios
  const [terminalMode, setTerminalMode] = useState<'boot' | 'test' | 'diagnose'>('boot')
  const [terminalRunning, setTerminalRunning] = useState(false)
  const [terminalStep, setTerminalStep] = useState(-1)
  const [copiedCmd, setCopiedCmd] = useState(false)
  const terminalRef = useRef(null)
  const terminalInView = useInView(terminalRef, { once: true, margin: '-100px' })

  // Stats section
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const ramCount = useAnimatedCounter(14, 1800, statsInView) // 1.4 -> display as 14 then /10
  const lessonCount = useAnimatedCounter(52, 2000, statsInView)
  const latencyCount = useAnimatedCounter(320, 1600, statsInView)

  // Listen to scroll position for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const slides = [
    {
      image: '/images/students_collaboration.jpg',
      tag: 'Collaborative Study & Coding Clubs',
      caption: 'African learners and creators mastering code together without internet dependencies',
    },
    {
      image: '/images/student_focus.jpg',
      tag: 'Individual Deep Practice',
      caption: 'Quiet, focused problem solving at home, libraries, and workshops on standard laptops',
    },
    {
      image: '/images/terminal_student_offline.jpg',
      tag: 'Hands-On Local Development',
      caption: 'Building real-world software on 8 GB laptops with sub-400ms on-device response times',
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

  // Terminal step-by-step animation on mode switch or restart
  useEffect(() => {
    if (!terminalRunning) return
    setTerminalStep(-1)
    const timers: ReturnType<typeof setTimeout>[] = []
    const delays = [350, 950, 1800, 2750, 3900]
    delays.forEach((d, i) => {
      timers.push(setTimeout(() => setTerminalStep(i), d))
    })
    return () => timers.forEach(clearTimeout)
  }, [terminalRunning, terminalMode])

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

  const terminalScenarios = {
    boot: {
      id: 'boot',
      label: 'Cold Boot & RAM Mount',
      command: '$ codetutor start --offline --target=8gb-ram',
      badge: '1.4 GB RAM',
      logs: [
        { text: '$ codetutor start --offline --target=8gb-ram', type: 'cmd' as const },
        { text: '✓ Local runtime initialized (Memory allocation: 1.4 GB / 8.0 GB used)', type: 'success' as const },
        { text: '✓ Quantized Gemma 2B IT neural weights mounted on CPU (Q4_K_M)', type: 'success' as const },
        { text: '✓ Pre-cached syllabi indexed (Python 3.12, JavaScript, Java 21)', type: 'info' as const },
        { text: '● Offline Tutor Standby — Zero cloud packets transmitted [READY]', type: 'ready' as const },
      ],
      metrics: {
        network: '0.00 KB (Air-Gapped)',
        model: 'Gemma 2B IT • Q4_K_M',
        latency: '318ms CPU',
        ramPercent: '17.5%',
      },
    },
    test: {
      id: 'test',
      label: 'Offline Test Runner',
      command: '$ codetutor test recursive_palindrome.py',
      badge: '0 KB Lookups',
      logs: [
        { text: '$ codetutor test recursive_palindrome.py', type: 'cmd' as const },
        { text: '✓ Sandboxed Python 3.12 local execution worker spawned', type: 'info' as const },
        { text: '✓ Test 1: Base Case (len <= 1) -> Passed [0.2ms]', type: 'success' as const },
        { text: '✓ Test 2: Punctuation & Case Sanitization -> Passed [0.4ms]', type: 'success' as const },
        { text: '● All test assertions passed locally with zero network lookups [SUCCESS]', type: 'ready' as const },
      ],
      metrics: {
        network: '0.00 KB (Air-Gapped)',
        model: 'AST Test Runner',
        latency: '1.2ms Local',
        ramPercent: '14.2%',
      },
    },
    diagnose: {
      id: 'diagnose',
      label: 'On-Device Debugger',
      command: '$ codetutor debug loop_index_error.py',
      badge: 'Instant AST Fix',
      logs: [
        { text: '$ codetutor debug loop_index_error.py', type: 'cmd' as const },
        { text: '✓ Abstract Syntax Tree (AST) compiled in local memory', type: 'info' as const },
        { text: '✓ Root Cause: Loop accesses index len(arr) (off-by-one boundary error)', type: 'success' as const },
        { text: '✓ Suggested Fix: Replace `range(len(scores) + 1)` with `range(len(scores))`', type: 'success' as const },
        { text: '● Diagnosis completed on-device in 294ms via local Gemma 2B [RESOLVED]', type: 'ready' as const },
      ],
      metrics: {
        network: '0.00 KB (Air-Gapped)',
        model: 'Gemma 2B Diagnostic',
        latency: '294ms Inference',
        ramPercent: '17.8%',
      },
    },
  }

  const currentTerminal = terminalScenarios[terminalMode]

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
      q: 'Who is CodeTutor Africa built for and what courses are supported?',
      a: 'CodeTutor Africa is designed for everyone learning to code—from absolute beginners and high school coding clubs to self-taught developers, bootcampers, polytechnics, and university students. Tracks cover fundamental programming, practical algorithmic thinking, web technologies, and software engineering with Python, JavaScript, and Java.',
    },
    {
      q: 'Can I use CodeTutor Africa during power outages or in transit?',
      a: 'Yes. Since every course module, test case runner, and AI model weight is pre-stored on your local hard drive, you can study at home, in workshops, libraries, or off-grid locations seamlessly.',
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
      title: 'Structured Tracks & Lessons',
      subtitle: 'From zero-knowledge basics to real-world software engineering',
      badge: 'For All Learners',
      codeSnippet: `# Module 2 • Lesson 4: Singly Linked List Traversal
class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`,
      aiResponse: `"Complete modular tracks available for Python, JavaScript, and Java. Each lesson includes beginner-friendly notes, visual memory diagrams, and paired interactive coding challenges."`,
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
      title: 'Erratic Wi-Fi & Offline Study',
      description: 'Study without anxiety. When local internet, school Wi-Fi, or home connectivity drops, CodeTutor Africa continues executing code, explaining concepts, and tracking test progress with zero downtime.',
      stat: '0ms',
      statLabel: 'downtime on Wi-Fi loss',
      highlights: [
        'Local code execution and automated test runner',
        'Pre-cached beginner to advanced learning tracks',
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
      description: 'Cloud AI tutors consume heavy internet data on every prompt. CodeTutor Africa runs 100% on your laptop\'s CPU, saving your budget for what matters most.',
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
      title: '1-on-1 Guidance For Every Learner',
      description: 'Whether in crowded classrooms or self-learning alone at night, asking questions can feel intimidating. Your offline tutor provides a patient, safe space to master tricky logic without fear of judgment.',
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

        {/* Right CTA / Auth & Theme Switch & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          <div className="hidden sm:flex items-center gap-2">
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

          {/* Mobile Menu Hamburger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-5 shadow-2xl space-y-4 z-50 overflow-hidden"
            >
              <div className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 font-sans">
                {[
                  { href: '#terminal-demo', label: 'Offline Runtime' },
                  { href: '#why-offline', label: 'Realities We Solve' },
                  { href: '#features', label: 'Interactive Workspace' },
                  { href: '#architecture', label: 'Hardware Specs' },
                  { href: '#faq', label: 'FAQ' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full justify-center font-semibold text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full justify-center font-semibold text-xs">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                Master Programming & Coding.{' '}
                <br className="hidden sm:block" />
                Anytime. <span className="text-brand-400 font-black">Offline.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base md:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md"
              >
                An intelligent, human-centered coding tutor built for beginners, self-taught developers, clubs, and schools across Africa. Learn Python, JavaScript, and Java with a private AI mentor that lives directly on your laptop—no internet connection, cloud bills, or expensive hardware required.
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
            SECTION 1: LIVE TERMINAL BOOT — Adaptive Canvas
            ═══════════════════════════════════════════════════════════════ */}
        <section id="terminal-demo" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
          {/* Subtle dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          {/* Ambient glowing radial light */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto space-y-10 relative z-10" ref={terminalRef}>
            <SectionReveal>
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
                  <Terminal className="w-3.5 h-3.5" />
                  Real-World On-Device Verification
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Live On-Device Terminal Boot
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Engineered for everyday laptops. The AI tutor neural runtime mounts directly into memory—no internet connection, cloud server, or recurring fees.
                </p>
              </div>
            </SectionReveal>

            {/* Interactive Terminal Mode Switcher */}
            <SectionReveal delay={0.08}>
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 border border-brand-500'
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
                    </button>
                  )
                })}
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Interactive Terminal Window (7 Cols) */}
              <SectionReveal delay={0.12} className="lg:col-span-7 flex flex-col justify-between">
                <motion.div
                  whileHover={{ scale: 1.003 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden text-left flex flex-col justify-between h-full backdrop-blur-sm"
                >
                  {/* Terminal Window Header — macOS Style */}
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
                        OFFLINE 8GB RAM
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
                              initial={{ opacity: 0, x: -12, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                              transition={{ duration: 0.35, ease: 'easeOut' }}
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
                                <motion.span
                                  animate={{ opacity: [1, 0.85, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="text-amber-800 dark:text-amber-300 font-bold bg-amber-100/90 dark:bg-amber-950/80 px-2.5 py-1 rounded border border-amber-300 dark:border-amber-800 text-xs inline-block my-1"
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
                        className="inline-block w-2 h-3.5 bg-brand-600 dark:bg-brand-500 align-middle mt-1 rounded-xs"
                      />
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
                </motion.div>
              </SectionReveal>

              {/* Right Column: Human-Centered Student Voice & Study Context (5 Cols) */}
              <SectionReveal delay={0.2} className="lg:col-span-5 flex flex-col justify-between">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4 h-full flex flex-col justify-between text-left">
                  {/* Photo with Overlay Badges */}
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shrink-0 group">
                    <img
                      src="/images/terminal_student_offline.jpg"
                      alt="African learner and developer coding offline on laptop"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Floating Status Badges */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-950/90 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 text-[10px] font-mono backdrop-blur-sm shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        Real-World Tested
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-950/90 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono backdrop-blur-sm shadow-md">
                        <Cpu className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                        Target: 8 GB Laptops
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

                  {/* 3 Enhanced Micro Metrics for Real-World Realities */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-colors shadow-xs">
                      <span className="block text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">0.00</span>
                      <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">Data Cost</span>
                      <span className="block text-[8px] text-slate-400 dark:text-slate-500">$0 vs $20/mo</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition-colors shadow-xs">
                      <span className="block text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400">100%</span>
                      <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">On-Device</span>
                      <span className="block text-[8px] text-slate-400 dark:text-slate-500">Zero Cloud Logs</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors shadow-xs">
                      <span className="block text-sm sm:text-base font-bold text-amber-600 dark:text-amber-300">4+ Hrs</span>
                      <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">Battery Save</span>
                      <span className="block text-[8px] text-slate-400 dark:text-slate-500">Low CPU Drain</span>
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
                  <span className="text-brand-600 dark:text-brand-400">of African Coders & Schools</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                  Coding education shouldn't stop when internet drops, electricity fluctuates, or monthly data bundles run out.
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

            {/* School & Institution Inclusivity Banner */}
            <SectionReveal delay={0.25}>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm text-left">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    Built for All Learning Paths
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Self-Learners, High Schools, Coding Clubs, Tech Hubs & Colleges
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Learning tracks and problem sets scale from first-time coding basics to real-world software development and algorithmic problem solving.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {['Self-Taught', 'Coding Clubs', 'High Schools / SHS', 'Polytechnics', 'Universities'].map((level) => (
                    <span
                      key={level}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold"
                    >
                      {level}
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
                  Everything You Need to Master Programming & Build Software
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
                  { id: 'curriculum', label: 'Structured Tracks', icon: BookOpen },
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
                  Optimized for Everyday Laptops
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Engineered specifically to run efficiently on standard 8 GB RAM laptops without thermal throttling or memory starvation.
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
                Equip yourself with the tools to master programming and build software without barriers. Free, offline, and tailored for every African learner.
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
                <p className="text-[10px] text-slate-400 font-mono">Offline AI-Powered Coding Education</p>
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
            <span>© 2026 CodeTutor Africa. Built with ❤ for African Coders, Schools & Self-Learners.</span>
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

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 border border-brand-400 hover:bg-brand-500 transition-colors"
            aria-label="Back to top"
          >
            <ChevronDown className="w-5 h-5 rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage
