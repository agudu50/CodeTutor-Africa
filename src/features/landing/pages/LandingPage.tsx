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

/* ─────────────────────────────────── Section Journey Connector ──── */
const StepConnector: React.FC<{ nextLabel: string; targetId: string; stepNumber: string }> = ({ nextLabel, targetId, stepNumber }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center pt-10 pb-4"
    >
      <div className="w-px h-10 bg-gradient-to-b from-brand-500 via-brand-400/40 to-transparent dark:from-brand-400 mb-3 animate-pulse" />
      <a
        href={`#${targetId}`}
        className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
      >
        <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-bold font-mono flex items-center justify-center border border-brand-200 dark:border-brand-800">
          {stepNumber}
        </span>
        <span>{nextLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 text-brand-500 group-hover:translate-x-1 transition-transform" />
      </a>
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
  const terminalModes: Array<'boot' | 'test' | 'diagnose'> = ['boot', 'test', 'diagnose']
  const [terminalMode, setTerminalMode] = useState<'boot' | 'test' | 'diagnose'>('boot')
  const [terminalRunning, setTerminalRunning] = useState(false)
  const [terminalStep, setTerminalStep] = useState(-1)
  const [terminalIsAutoPlay, setTerminalIsAutoPlay] = useState(true)
  const [copiedCmd, setCopiedCmd] = useState(false)
  const terminalRef = useRef(null)
  const terminalInView = useInView(terminalRef, { once: true, margin: '-100px' })

  // Workspace Tabs auto-cycling
  const featureTabKeys: Array<'tutor' | 'practice' | 'debugger' | 'curriculum'> = ['tutor', 'practice', 'debugger', 'curriculum']
  const [workspaceIsAutoPlay, setWorkspaceIsAutoPlay] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)

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
      tag: 'Hands-On Coding Practice',
      caption: 'Building real-world projects on everyday laptops with fast, instant AI help',
    },
  ]

  // Auto-advance hero slideshow
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  // Auto-advance workspace features tabs
  useEffect(() => {
    if (!workspaceIsAutoPlay) return
    const interval = setInterval(() => {
      setActiveFeatureTab((prev) => {
        const nextIdx = (featureTabKeys.indexOf(prev) + 1) % featureTabKeys.length
        return featureTabKeys[nextIdx]
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [workspaceIsAutoPlay])

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

  const handleCopyCode = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
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

  const currentTerminal = terminalScenarios[terminalMode]

  const faqs = [
    {
      q: 'How does CodeTutor Africa work without internet on a normal laptop?',
      a: 'We built a compact AI model that lives directly on your computer. It reads your code and explains concepts using your laptop\'s own processor—meaning zero internet connection and zero mobile data bundles are ever needed.',
    },
    {
      q: 'Do I need to pay for subscriptions or mobile data?',
      a: 'No. CodeTutor Africa is completely free forever. There are no monthly fees, hidden subscriptions, or mobile data bundles required to practice coding, fix errors, or get help from the AI tutor.',
    },
    {
      q: 'Who can use CodeTutor Africa and what languages can I learn?',
      a: 'It is made for everyone—complete beginners, high school coding clubs, self-taught learners, polytechnic, and university students. You can learn Python, JavaScript, and Java through simple, step-by-step lessons.',
    },
    {
      q: 'Can I use it during power cuts or while traveling?',
      a: 'Yes! Because every lesson and tool is saved directly on your laptop, you can open your computer and practice anywhere—at home, on the bus, in school, or during power outages.',
    },
  ]

  const featureTabs = {
    tutor: {
      title: 'Helpful AI Tutor',
      subtitle: 'A patient, friendly guide that helps you think step-by-step without stress',
      badge: 'Private & Empathetic',
      filename: 'countdown.py',
      language: 'Python',
      codeSnippet: `# Counting down to blast off!
def countdown(n: int):
    if n <= 0:  # Stop when we reach zero
        print("Blast off! 🚀")
        return
    print(f"Counting: {n}")
    countdown(n - 1)  # Count down to next number

countdown(3)`,
      runOutput: `Counting: 3\nCounting: 2\nCounting: 1\nBlast off! 🚀`,
      studentQuery: 'How does the countdown function know when to stop?',
      aiResponse: 'Great job! Notice how each call counts down until it hits 0. What would happen if we forgot the check for n <= 0? It would keep counting backwards forever!',
      conceptChip: '💡 Key Concept: The "n <= 0" check is your Base Case — it keeps recursion safe!',
      stats: 'Instant answers on your laptop (0ms delay)',
    },
    practice: {
      title: 'Hands-On Code Practice',
      subtitle: 'Write real code and get instant, encouraging feedback on your logic',
      badge: 'Zero Internet Tests',
      filename: 'palindrome_check.py',
      language: 'Python',
      codeSnippet: `def is_palindrome(word: str) -> bool:
    clean = word.lower().replace(" ", "")
    # Check if word reads the same backward and forward
    if len(clean) <= 1:
        return True
    if clean[0] != clean[-1]:
        return False
    return is_palindrome(clean[1:-1])

print(is_palindrome("racecar"))  # True`,
      runOutput: `Test 1: "racecar" -> Passed ✓\nTest 2: "madam" -> Passed ✓\nTest 3: "hello" -> Passed ✓`,
      studentQuery: 'Testing my recursive palindrome solver against test challenges',
      aiResponse: '✓ All test cases passed! Your recursive string slicing is clean and efficient. You are ready to tackle the next practice level.',
      conceptChip: '🎯 Mastery: String indexing & recursive problem solving',
      stats: 'Runs 100% without internet',
    },
    debugger: {
      title: 'Friendly Error Explainer',
      subtitle: 'No confusing jargon — just clear explanations of why code breaks and how to fix it',
      badge: 'Plain English',
      filename: 'student_scores.py',
      language: 'Python',
      codeSnippet: `# Calculating student scores
scores = [85, 92, 78]

# Bug: loop tries to access index 3 in a 3-item list
for i in range(len(scores) + 1):
    print(f"Student {i+1}: {scores[i]}")`,
      runOutput: `Student 1: 85\nStudent 2: 92\nStudent 3: 78\nIndexError: list index out of range`,
      studentQuery: 'Why is Python saying "list index out of range"?',
      aiResponse: 'What happened: In Python, lists start counting at 0. For a list with 3 items, their positions are 0, 1, and 2. When the loop asks for index 3, Python cannot find it.',
      conceptChip: '🛠️ Quick Fix: Change range(len(scores) + 1) to range(len(scores))',
      stats: 'Explains mistakes in plain language',
    },
    curriculum: {
      title: 'Step-by-Step Lessons',
      subtitle: 'From zero-knowledge basics to building real-world software applications',
      badge: '52 Lessons Built-In',
      filename: 'lesson_01_welcome.py',
      language: 'Python',
      codeSnippet: `# Lesson 1: Your First Friendly Python Function
def welcome_coder(name: str, city: str) -> str:
    return f"Welcome {name} from {city}! Ready to build?"

message = welcome_coder("Ama", "Kumasi")
print(message)`,
      runOutput: `Welcome Ama from Kumasi! Ready to build?`,
      studentQuery: 'Starting Module 1: Python Fundamentals & Variables',
      aiResponse: 'Welcome to your coding journey! You just defined your first reusable function. Every lesson in this course is saved directly on your laptop with zero internet required.',
      conceptChip: '📚 Lesson 1 of 52 • Complete Notes & Interactive Exercises',
      stats: 'Over 50 lessons included',
    },
  }

  const realitiesData = [
    {
      icon: WifiOff,
      iconBg: 'bg-amber-50 dark:bg-amber-950/50',
      iconBorder: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      tag: 'No Internet Needed',
      title: 'No Wi-Fi? No Problem.',
      description: 'Learn without stress. When local internet or school Wi-Fi drops, CodeTutor Africa keeps running your code, explaining concepts, and saving your progress with zero interruptions.',
      stat: '0ms',
      statLabel: 'delay on Wi-Fi loss',
      highlights: [
        'Run your code and check answers completely offline',
        'All beginner to advanced lessons ready anytime',
        'Keep practicing even during power outages',
      ],
    },
    {
      icon: DollarSign,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
      iconBorder: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      tag: '100% Free Forever',
      title: 'Zero Mobile Data Costs',
      description: 'Online AI tools consume expensive internet data every time you ask a question. CodeTutor Africa runs 100% on your laptop, keeping your mobile data in your pocket.',
      stat: '0 KB',
      statLabel: 'mobile data spent',
      highlights: [
        'No mobile data bundles required',
        'No monthly subscriptions or hidden fees',
        'Completely private and runs easily on your laptop',
      ],
    },
    {
      icon: Users,
      iconBg: 'bg-brand-50 dark:bg-brand-950/50',
      iconBorder: 'border-brand-200 dark:border-brand-800',
      iconColor: 'text-brand-600 dark:text-brand-400',
      tag: 'Friendly & Patient',
      title: '1-on-1 Help For Every Student',
      description: 'In crowded classrooms or studying alone late at night, asking questions can feel intimidating. Your AI tutor provides a friendly, patient space to learn at your own pace.',
      stat: '\u221E',
      statLabel: 'questions you can ask',
      highlights: [
        'Gentle hints that guide you without just spoiling the answer',
        'Friendly explanations when you make mistakes',
        'Practice as many times as you need in private',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white relative">


      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION HEADER — Modern Human-Centered Design
          ═══════════════════════════════════════════════════════════════ */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between backdrop-blur-md transition-colors duration-300">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shrink-0 border border-brand-500 shadow-xs"
          >
            <Sparkles className="w-5 h-5 text-accent-300" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              CodeTutor <span className="text-brand-600 dark:text-brand-400 font-extrabold">Africa</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>100% Offline AI</span>
            </div>
          </div>
        </Link>

        {/* Center links on desktop — Friendly, jargon-free labels */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {[
            { href: '#terminal-demo', label: 'Live Demo' },
            { href: '#why-offline', label: 'Why Offline?' },
            { href: '#features', label: 'AI Workspace' },
            { href: '#architecture', label: 'Laptop Specs' },
            { href: '#faq', label: 'FAQ' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 text-slate-700 dark:text-slate-200 transition-all font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle + Auth Buttons + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </motion.button>

          {/* Desktop Auth CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="font-semibold text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                Sign In
              </Button>
            </Link>

            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="primary" size="sm" className="font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-3.5">
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
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
              className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-5 shadow-xl space-y-4 z-50 overflow-hidden"
            >
              <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-200 font-sans">
                {[
                  { href: '#terminal-demo', label: 'Live Demo' },
                  { href: '#why-offline', label: 'Why Offline?' },
                  { href: '#features', label: 'AI Workspace' },
                  { href: '#architecture', label: 'Laptop Specs' },
                  { href: '#faq', label: 'FAQ' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 transition-colors font-medium flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
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
                  <Button variant="primary" size="md" className="w-full justify-center font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white">
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
                  No Internet Needed • 100% Free AI Tutor for Any Laptop
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
                A friendly, patient coding tutor built for beginners, students, and self-learners across Africa. Learn Python, JavaScript, and Java with an AI mentor that lives directly on your laptop—no internet connection, mobile data bundles, or fees needed.
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
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Private & Free
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant AI Answers
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" /> Works Without Wi-Fi
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: LIVE TERMINAL BOOT — Adaptive Canvas
            ═══════════════════════════════════════════════════════════════ */}
        <section id="terminal-demo" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
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

            {/* Interactive Terminal Mode Switcher with Auto-Advancing Progress Bar */}
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

                        {/* Animated linear countdown progress bar */}
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
                        Tested on Laptops
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-950/90 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-700 text-[10px] font-mono backdrop-blur-sm shadow-md">
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

                  {/* 3 Enhanced Micro Metrics for Real-World Realities */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-colors shadow-xs">
                      <span className="block text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">0.00</span>
                      <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">Data Cost</span>
                      <span className="block text-[8px] text-slate-400 dark:text-slate-500">100% Free</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition-colors shadow-xs">
                      <span className="block text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400">100%</span>
                      <span className="block text-[9px] text-slate-600 dark:text-slate-400 uppercase font-semibold mt-0.5">Offline</span>
                      <span className="block text-[8px] text-slate-400 dark:text-slate-500">Zero Internet</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-colors shadow-xs">
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

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: THE REALITIES WE SOLVE — Human-Centered Empathy
            ═══════════════════════════════════════════════════════════════ */}
        <section id="why-offline" className="py-20 sm:py-28 px-4 md:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-16">
            <SectionReveal>
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
                  <Heart className="w-3.5 h-3.5" />
                  Step 02 • The Realities We Solve
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

            {/* Journey Connector */}
            <StepConnector nextLabel="Next Step: Explore The Interactive Workspace" targetId="features" stepNumber="03" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: INTERACTIVE WORKSPACE — Tabbed Feature Preview
            ═══════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-10">
            <SectionReveal>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
                  <Code2 className="w-3.5 h-3.5" />
                  Step 03 • Interactive Workspace
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Everything You Need to Master Programming & Build Software
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click through the modules below or let the live tour guide you through each tool.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              {/* Interactive Navigation Pills with Auto-Advancing Progress Bar */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {[
                    { id: 'tutor', label: 'Helpful AI Tutor', icon: Bot },
                    { id: 'practice', label: 'Hands-On Practice', icon: Code2 },
                    { id: 'debugger', label: 'Error Explainer', icon: Bug },
                    { id: 'curriculum', label: 'Step-by-Step Lessons', icon: BookOpen },
                  ].map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeFeatureTab === tab.id
                    return (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => {
                          setActiveFeatureTab(tab.id as any)
                          setWorkspaceIsAutoPlay(false)
                        }}
                        className={`relative overflow-hidden flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-lg scale-[1.02]'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>

                        {/* Animated linear tab progress bar */}
                        {isActive && workspaceIsAutoPlay && (
                          <motion.div
                            key={`${activeFeatureTab}-prog`}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 6, ease: 'linear' }}
                            className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-full"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Workspace Tour Status */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  <span>
                    Auto-touring workspace modules ({featureTabKeys.indexOf(activeFeatureTab) + 1} of 4)
                  </span>
                  <button
                    type="button"
                    onClick={() => setWorkspaceIsAutoPlay((prev) => !prev)}
                    className="ml-1 underline hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {workspaceIsAutoPlay ? 'Pause' : 'Resume'}
                  </button>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15}>
              {/* Modern Human-Centered Animated Tab Preview Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeatureTab}
                  initial={{ opacity: 0, y: 16, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.99 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden backdrop-blur-md"
                >
                  {/* Top Bar with Window Controls, Filename Badge, and Empathetic Tag */}
                  <div className="px-5 py-4 bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-3 h-3 rounded-full bg-red-500/90 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                      </div>
                      <div className="h-4 w-px bg-slate-300 dark:bg-slate-800 mx-1 hidden sm:block" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 shadow-xs">
                        <Code2 className="w-3.5 h-3.5 text-brand-500" />
                        <span>{featureTabs[activeFeatureTab].filename}</span>
                        <span className="text-[10px] px-1 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold">
                          {featureTabs[activeFeatureTab].language}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        {featureTabs[activeFeatureTab].badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden md:inline">
                        100% Offline • 0 KB Data
                      </span>
                    </div>
                  </div>

                  {/* Split Content: Left = Modern Code Editor, Right = Warm Human-Centered AI Tutor */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
                    {/* Left 6 Columns: Interactive Code Editor with Terminal Run Preview */}
                    <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-5 sm:p-6 space-y-4 transition-colors duration-300">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <span>workspace</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-brand-600 dark:text-brand-400 font-semibold">{featureTabs[activeFeatureTab].filename}</span>
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => handleCopyCode(featureTabs[activeFeatureTab].codeSnippet)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
                          >
                            {copiedCode ? (
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
                        </div>

                        {/* Code Display with Line Numbers */}
                        <div className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto py-1 text-slate-800 dark:text-slate-200">
                          <pre className="whitespace-pre">
                            {featureTabs[activeFeatureTab].codeSnippet}
                          </pre>
                        </div>
                      </div>

                      {/* Run Output Console Window */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 p-3.5 space-y-2 font-mono text-xs shadow-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pb-1.5 border-b border-slate-200 dark:border-slate-800">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Play className="w-3 h-3 fill-emerald-600 dark:fill-emerald-400" /> On-Device Output
                          </span>
                          <span className="text-[10px] text-slate-500">Local CPU • 0ms Delay</span>
                        </div>
                        <pre className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                          {featureTabs[activeFeatureTab].runOutput}
                        </pre>
                      </div>
                    </div>

                    {/* Right 6 Columns: Human-Centered AI Tutor Conversation Interface */}
                    <div className="lg:col-span-6 bg-slate-50/50 dark:bg-slate-900/70 p-5 sm:p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        {/* Tutor Persona Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md">
                                <Bot className="w-5 h-5" />
                              </div>
                              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>CodeTutor AI Mentor</span>
                                <span className="text-[10px] font-mono font-normal text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                                  Online
                                </span>
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Patient, private & friendly 1-on-1 guide
                              </p>
                            </div>
                          </div>

                          <Badge variant="brand" size="sm" className="font-mono text-[10px] hidden sm:inline-flex">
                            No Subscriptions
                          </Badge>
                        </div>

                        {/* Student Question Context Bubble */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            KO
                          </div>
                          <div className="p-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 shadow-xs">
                            <span className="font-semibold text-brand-600 dark:text-brand-400 block text-[10px] uppercase font-mono mb-0.5">
                              Learner Question
                            </span>
                            "{featureTabs[activeFeatureTab].studentQuery}"
                          </div>
                        </div>

                        {/* AI Tutor Supportive Response Bubble */}
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="space-y-3 flex-1">
                            <div className="p-4 rounded-2xl rounded-tl-sm bg-brand-50/70 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed shadow-xs">
                              <span className="font-bold text-brand-700 dark:text-brand-300 block text-[10px] uppercase font-mono mb-1">
                                Tutor Explanation
                              </span>
                              "{featureTabs[activeFeatureTab].aiResponse}"
                            </div>

                            {/* Human-Centered Concept Insight Chip */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium">
                              <span>{featureTabs[activeFeatureTab].conceptChip}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium font-mono text-[11px]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{featureTabs[activeFeatureTab].stats}</span>
                        </div>

                        <Link to="/dashboard">
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              variant="primary"
                              size="sm"
                              className="font-bold shadow-md bg-brand-600 hover:bg-brand-500 text-xs w-full sm:w-auto"
                              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                            >
                              Try Interactive Workspace
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </SectionReveal>

            {/* Journey Connector */}
            <StepConnector nextLabel="Next Step: Check Everyday Laptop Compatibility" targetId="architecture" stepNumber="04" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4: HARDWARE SPECS — Animated Counter Metrics
            ═══════════════════════════════════════════════════════════════ */}
        <section id="architecture" className="py-20 sm:py-28 px-4 md:px-8">
          <div className="max-w-5xl mx-auto space-y-12" ref={statsRef}>
            <SectionReveal>
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
                  <Cpu className="w-3.5 h-3.5" />
                  Step 04 • Everyday Laptops
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Built for Regular Student Laptops
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Designed to run smoothly on everyday laptops without slowing down your computer or draining your battery.
                </p>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {/* Card 1: RAM */}
              <SectionReveal delay={0} className="h-full">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="h-full p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider">Lightweight</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      {(ramCount / 10).toFixed(1)} <span className="text-lg text-slate-500 dark:text-slate-400 font-sans font-normal">GB RAM</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                      Uses very little memory, leaving plenty of room for your code editor and web browser.
                    </p>
                  </div>
                  
                  {/* Mini progress bar & footer */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={statsInView ? { width: '17.5%' } : { width: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full rounded-full bg-brand-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>1.4 / 8.0 GB used by AI</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">17.5%</span>
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>

              {/* Card 2: Lessons */}
              <SectionReveal delay={0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="h-full p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider">Offline Lessons</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">
                      50+ Lessons
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                      All course notes, exercises, and examples are saved directly on your laptop ready to learn.
                    </p>
                  </div>

                  {/* Mini progress bar & footer */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={statsInView ? { width: '100%' } : { width: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full rounded-full bg-amber-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-500" />
                        {lessonCount} lessons included
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Ready</span>
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>

              {/* Card 3: Battery */}
              <SectionReveal delay={0.2} className="h-full">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="h-full p-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BatteryCharging className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider">Fast & Cool</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      {latencyCount}<span className="text-lg text-slate-500 dark:text-slate-400 font-sans font-normal">ms Instant</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                      Answers questions fast while keeping your laptop cool and battery lasting for hours.
                    </p>
                  </div>

                  {/* Mini progress bar & footer */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={statsInView ? { width: '100%' } : { width: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-500" />
                        Battery friendly
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Low Temp</span>
                    </div>
                  </div>
                </motion.div>
              </SectionReveal>
            </div>

            {/* Journey Connector */}
            <StepConnector nextLabel="Next Step: Frequently Asked Questions" targetId="faq" stepNumber="05" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5: FAQ ACCORDION
            ═══════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto space-y-10">
            <SectionReveal>
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  Step 05 • Common Questions
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

            {/* Journey Connector */}
            <StepConnector nextLabel="Final Step: Start Learning Free Today" targetId="cta" stepNumber="06" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6: FINAL CALL TO ACTION — Clean Solid Design
            ═══════════════════════════════════════════════════════════════ */}
        <section id="cta" className="py-10 sm:py-14 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <SectionReveal>
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-6 sm:p-8 lg:p-10 text-center text-slate-900 dark:text-white space-y-6 transition-colors duration-300">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {/* Step Badge */}
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    Step 06 • Ready to Begin?
                  </span>

                  {/* Headline */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    Join the Offline Coding{' '}
                    <span className="text-brand-600 dark:text-brand-400">
                      Revolution
                    </span>{' '}
                    Today
                  </h2>

                  {/* Empathy & Value Subtitle */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Equip yourself with the tools to master programming and build real-world software without barriers. 100% free, runs completely on your laptop, and tailored for every African learner.
                  </p>

                  {/* 3 Value Cards with Clean Solid Surfaces */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>100% Free Forever</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        No subscription fees, credit cards, or hidden costs.
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                      <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold">
                        <Shield className="w-4 h-4" />
                        <span>Private & Offline</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Your code, notes, and progress stay safe on your computer.
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                        <Zap className="w-4 h-4" />
                        <span>Instant Start</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Setup in under 2 minutes and start coding right away.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link to="/signup">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="primary"
                          size="md"
                          className="font-bold shadow-md h-11 px-7 bg-brand-600 hover:bg-brand-700 text-white border border-brand-500 text-sm"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Create Free Account
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/dashboard">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          variant="outline"
                          size="md"
                          className="font-semibold h-11 px-6 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm shadow-xs"
                        >
                          Explore as Guest
                        </Button>
                      </motion.div>
                    </Link>
                  </div>

                  {/* Trust Footer Indicators */}
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 pt-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> No sign-up data leaves your device
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Setup in under 2 minutes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Made for African developers
                    </span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
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
