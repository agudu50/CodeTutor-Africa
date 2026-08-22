import React, { useState, useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Cpu,
  Shield,
  Zap,
  BookOpen,
  Code2,
  Bug,
  Gamepad2,
  Terminal,
  Play,
  GraduationCap,
  Laptop,
  BarChart3,
  Lightbulb,
  Quote,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════
   HERO SLIDESHOW DATA
   ═══════════════════════════════════════════════════════════════════ */
const heroSlides = [
  {
    image: '/images/students_collaboration.jpg',
    tag: 'University Labs & Coding Clubs',
    title: 'Empowering African Engineering Students',
    subtitle: 'From Nairobi to Accra, Lagos to Cape Town — learn software engineering without the obstacle of costly mobile data or flaky Wi-Fi.',
  },
  {
    image: '/images/student_focus.jpg',
    tag: 'Self-Paced Deep Practice',
    title: 'A Dedicated AI Mentor That Never Needs the Internet',
    subtitle: 'Ask unlimited questions, get step-by-step Socratic hints, and master core data structures in private on your own laptop.',
  },
  {
    image: '/images/terminal_student_offline.jpg',
    tag: 'Hands-On Engineering',
    title: 'Zero Latency Code Diagnostics & Compiler Guidance',
    subtitle: 'Diagnose runtime errors, explore memory models, and run automated test suites locally at 23+ tokens per second on CPU.',
  },
]

/* ═══════════════════════════════════════════════════════════════════
   CODE SAMPLES FOR LIVE PREVIEW
   ═══════════════════════════════════════════════════════════════════ */
const codeExamples = [
  {
    lang: 'python',
    filename: 'algorithms.py',
    code: `# Problem: Socratic Tutor guiding recursion
def sum_list(items):
    # Hint: What is our base case when items is empty?
    if not items:
        return 0
    # Step: Add the first element to the sum of the rest
    return items[0] + sum_list(items[1:])

print("Sum:", sum_list([10, 20, 30, 40]))  # Output: 100`,
  },
  {
    lang: 'javascript',
    filename: 'eventLoop.js',
    code: `// Understanding JavaScript Microtasks & Promises
console.log("1: Synchronous start");

Promise.resolve().then(() => {
  console.log("3: Microtask queue executed");
});

console.log("2: Synchronous end");
// Tutor: "Notice how microtasks execute before timers!"`,
  },
  {
    lang: 'java',
    filename: 'BankLedger.java',
    code: `// Java OOP: Encapsulation & Memory Safety
public class BankLedger {
    private double balance;

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException();
        this.balance += amount;
    }
}`,
  },
]

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED STATS COUNTER HOOK
   ═══════════════════════════════════════════════════════════════════ */
function useCounter(target: number, duration = 1500, inView = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let curr = 0
    const stepTime = 16
    const totalSteps = duration / stepTime
    const delta = target / totalSteps
    const timer = setInterval(() => {
      curr += delta
      if (curr >= target) {
        setVal(target)
        clearInterval(timer)
      } else {
        setVal(Math.floor(curr))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [target, duration, inView])
  return val
}

/* ═══════════════════════════════════════════════════════════════════
   TERMINAL PREVIEW COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const TerminalLivePreview: React.FC = memo(() => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [activeTab, setActiveTab] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')

  useEffect(() => {
    if (!isInView) return
    const targetCode = codeExamples[activeTab].code
    setDisplayedCode('')
    let idx = 0
    const interval = setInterval(() => {
      idx += 3
      if (idx >= targetCode.length) {
        setDisplayedCode(targetCode)
        clearInterval(interval)
      } else {
        setDisplayedCode(targetCode.slice(0, idx))
      }
    }, 15)
    return () => clearInterval(interval)
  }, [activeTab, isInView])

  return (
    <div ref={ref} className="rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs text-left">
      {/* Code Editor Tab Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
            <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
            <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
          </div>
          {codeExamples.map((ex, i) => (
            <button
              key={ex.filename}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                activeTab === i
                  ? 'bg-slate-800 text-brand-400 font-bold border border-brand-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-brand-400" />
              <span>{ex.filename}</span>
            </button>
          ))}
        </div>
        <span className="text-[10px] text-brand-400 font-bold bg-brand-950/80 border border-brand-800 px-2 py-0.5 rounded">
          ● 100% OFFLINE
        </span>
      </div>

      {/* Editor Body */}
      <div className="p-5 overflow-x-auto min-h-[220px] text-slate-200 bg-slate-950 leading-relaxed font-mono">
        <pre className="text-xs sm:text-sm whitespace-pre">
          <code>
            {displayedCode}
            <span className="inline-block w-2 h-4 bg-brand-500 animate-pulse ml-0.5 align-middle" />
          </code>
        </pre>
      </div>

      {/* Socratic Terminal Guidance Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-slate-300 font-medium">Socratic Insight:</span>
          <span className="text-slate-400 truncate">Compiler verified locally (0 KB network)</span>
        </div>
        <span className="text-brand-400 font-bold font-mono text-[10px]">23.4 tok/s</span>
      </div>
    </div>
  )
})
TerminalLivePreview.displayName = 'TerminalLivePreview'

/* ═══════════════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT (HIGH-CONTRAST ALTERNATING DARK & GRAY)
   ═══════════════════════════════════════════════════════════════════ */
export const LandingPage: React.FC = () => {
  const { isDark, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSlidePaused, setIsSlidePaused] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  // Auto-advance hero carousel (faster transition)
  useEffect(() => {
    if (isSlidePaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [isSlidePaused])

  // Scroll position listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const statOffline = useCounter(100, 1400, statsInView)
  const statTokens = useCounter(23, 1400, statsInView)
  const statExercises = useCounter(50, 1400, statsInView)
  const statModes = useCounter(6, 1400, statsInView)

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#demo', label: 'Live Sandbox' },
    { href: '#curriculum', label: 'Curriculum' },
    { href: '#testimonials', label: 'Student Voices' },
    { href: '#specs', label: 'Hardware Specs' },
    { href: '#faq', label: 'FAQ' },
  ]

  const featureCards = [
    {
      icon: <Sparkles className="w-6 h-6 text-brand-400" />,
      badge: 'Pedagogy',
      title: '6 Socratic AI Modes',
      description: 'Explain, Hint, Practice, Debug, Review, and Quiz modes that build real engineering intuition instead of copy-paste habits.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-brand-400" />,
      badge: 'Curriculum',
      title: 'Comprehensive Course Tracks',
      description: 'Structured syllabi for Python Fundamentals, Async JavaScript, and Java OOP aligned with African engineering university curricula.',
    },
    {
      icon: <Code2 className="w-6 h-6 text-brand-400" />,
      badge: 'Execution',
      title: 'Interactive Code Playground',
      description: 'Write, execute, and validate code against automated test cases locally on your CPU with zero external dependencies.',
    },
    {
      icon: <Bug className="w-6 h-6 text-brand-400" />,
      badge: 'Diagnostics',
      title: 'Compiler Root-Cause Debugger',
      description: 'Paste tricky stack traces and compiler errors. The AI breaks down memory state, edge cases, and guided fixes.',
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-brand-400" />,
      badge: 'Gamification',
      title: '3D Arcade Mini-Games',
      description: 'Syntax Speedrun, Bug Hunt Blitz, Output Predictor, and Code Shuffle turn tedious syntax drills into engaging offline challenges.',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-brand-400" />,
      badge: 'Progress',
      title: 'Skill Mastery & Streaks',
      description: 'Track daily study streaks, problem-solving velocity, and earned badges stored privately in your local storage.',
    },
  ]

  const studentTestimonials = [
    {
      name: 'Kofi Mensah',
      role: 'Computer Engineering Student',
      university: 'KNUST, Ghana',
      quote: 'Campus internet in our hostel drops frequently during exam season. Having CodeTutor completely offline on my ThinkPad allowed me to master recursion and dynamic programming without stress.',
      tag: 'Python & Algorithms',
    },
    {
      name: 'Amina Bello',
      role: 'Self-Taught Web Developer',
      university: 'Lagos, Nigeria',
      quote: 'Mobile data costs used to eat up half my monthly budget just querying cloud AI. CodeTutor runs locally on my standard laptop and the Socratic hints actually taught me how the JavaScript event loop works.',
      tag: 'JavaScript & Async',
    },
    {
      name: 'Emmanuel Kiprono',
      role: 'Software Engineering Junior',
      university: 'University of Nairobi, Kenya',
      quote: 'The 3D arcade games like Bug Hunt and Syntax Speedrun made practicing Java OOP feel like a competitive sport. My debugging speed improved noticeably within two weeks.',
      tag: 'Java OOP & Arcade',
    },
  ]

  const faqs = [
    {
      q: 'Does CodeTutor Africa require any internet connection?',
      a: 'No. CodeTutor Africa is engineered to be 100% offline-first. The AI model, courses, practice sandbox, test cases, and arcade games all execute locally on your machine with zero outbound network calls.',
    },
    {
      q: 'Will it run comfortably on a budget 8 GB RAM laptop?',
      a: 'Yes! CodeTutor Africa is optimized for standard student hardware (Intel Core i5 / AMD Ryzen 5 with 8 GB RAM and integrated graphics). Peak memory footprint is under 1.73 GB, leaving over 6 GB free for your operating system and code editor.',
    },
    {
      q: 'What programming languages are covered?',
      a: 'The platform covers Python, JavaScript/TypeScript, and Java—the primary foundational languages taught across African universities—along with practice SQL problems.',
    },
    {
      q: 'How does Socratic tutoring help me learn better?',
      a: 'Instead of handing you ready-made code that you copy-paste without understanding, CodeTutor uses pedagogical Socratic prompting to explain concepts with relatable analogies, ask guided questions, and build lasting problem-solving intuition.',
    },
    {
      q: 'Is CodeTutor Africa free to use?',
      a: 'Yes, 100% free and open. There are no subscriptions, API keys, or hidden charges required.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-300">

      {/* ═══════════════════════════════════════════════════════════════
          HEADER NAVIGATION (DARK)
          ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shadow-sm border border-brand-500 group-hover:bg-brand-700 transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                CodeTutor <span className="text-[#005F02] font-black">Africa</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#005F02] inline-block animate-pulse" />
                <span>100% Offline AI Mentor</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-lg hover:bg-slate-800 hover:text-brand-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-brand-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Auth CTAs */}
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/signin">
                <button className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="px-4 py-2 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors flex items-center gap-1.5">
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 border border-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-2"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-lg text-xs font-semibold border border-slate-700 text-slate-200">
                    Sign In
                  </button>
                </Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white">
                    Launch Workspace
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO SECTION (DARK: bg-slate-950)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[620px] sm:min-h-[680px] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
      >
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Solid Dark Tint Overlay for High Contrast */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px]" />
          
          {/* Top Brand Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-600" />
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-brand-600 hover:border-brand-500 transition-colors shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-brand-600 hover:border-brand-500 transition-colors shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Current Slide Tag Badge */}
        <div className="absolute top-6 left-6 sm:left-12 z-20 hidden sm:block">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#005F02] text-white border border-[#005F02] text-xs font-mono shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-semibold">{heroSlides[currentSlide].tag}</span>
          </span>
        </div>

        {/* Interactive Linked Slide Mini-Cards at Bottom of Hero */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-3">
          {heroSlides.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 backdrop-blur-md ${
                currentSlide === idx
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-lg scale-105'
                  : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentSlide === idx ? 'bg-white' : 'bg-slate-500'}`} />
              <span className="truncate max-w-[140px]">{slide.tag}</span>
            </button>
          ))}
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 py-16 sm:py-20 space-y-6">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005F02] border border-[#005F02] text-white text-xs font-bold shadow-md"
          >
            <Shield className="w-4 h-4 text-white" />
            <span>Africa Deep Tech Challenge 2026 • 100% Offline AI</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
          >
            Master Programming Anywhere.{' '}
            <span className="text-[#005F02]">Zero Internet Required.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-3"
          >
            <Link to="/dashboard">
              <button className="px-7 py-3.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xl flex items-center gap-2 transition-transform hover:scale-102">
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#demo">
              <button className="px-7 py-3.5 rounded-xl text-sm font-bold bg-slate-900/90 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Play className="w-4 h-4 text-brand-400" />
                <span>Try Live Sandbox</span>
              </button>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs text-slate-300 font-mono"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-400" /> 100% Private &amp; Free
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-400" /> 23.4 Tokens/Sec CPU Speed
            </span>
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-brand-400" /> 8 GB RAM Optimized
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: INTERCONNECTED LINKED GLASSMORPHISM STATS STRIP
          ═══════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-center">
            
            {/* Stat Card 1 -> Links to #specs */}
            <a
              href="#specs"
              className="p-6 space-y-2 hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/30 border border-brand-500/40 text-brand-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-400 font-mono tracking-tight">
                {statOffline}%
              </div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors">Offline Operation</div>
              <div className="text-[11px] text-slate-400">Zero cloud API costs →</div>
            </a>

            {/* Stat Card 2 -> Links to #specs */}
            <a
              href="#specs"
              className="p-6 space-y-2 hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/30 border border-brand-500/40 text-brand-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-400 font-mono tracking-tight">
                {statTokens}.4
              </div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors">Tokens Per Second</div>
              <div className="text-[11px] text-slate-400">4-Thread CPU speed →</div>
            </a>

            {/* Stat Card 3 -> Links to #features */}
            <a
              href="#features"
              className="p-6 space-y-2 hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/30 border border-brand-500/40 text-brand-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-400 font-mono tracking-tight">
                {statExercises}+
              </div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors">Practice Exercises</div>
              <div className="text-[11px] text-slate-400">Python, JS &amp; Java →</div>
            </a>

            {/* Stat Card 4 -> Links to #demo */}
            <a
              href="#demo"
              className="p-6 space-y-2 hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/30 border border-brand-500/40 text-brand-400 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-400 font-mono tracking-tight">
                {statModes}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-300 transition-colors">Pedagogical Modes</div>
              <div className="text-[11px] text-slate-400">Explain, Hint, Debug →</div>
            </a>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: FEATURES GRID (DARK: bg-slate-950)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-950">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-400 text-xs font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Complete Learning Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Academic Rigor &amp; Practical Mastery
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Every feature—from compiler diagnostics to gamified syntax drills—is bundled to run 100% locally on standard laptops.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 hover:border-brand-500 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  {card.icon}
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-brand-800 bg-brand-950 text-brand-400">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: INTERACTIVE LIVE CODE SANDBOX (VISIBLE GRAY: bg-slate-800)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="demo" className="py-20 bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-400 text-xs font-semibold font-mono">
              <Terminal className="w-3.5 h-3.5 text-brand-400" /> Interactive Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Test Driven Learning with Real Code
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Switch languages to see how CodeTutor guides you through algorithms, async concurrency, and object-oriented design.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Code Editor Sandbox Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold px-1">
                <span>1. Multi-Language Code Runner</span>
                <span className="font-mono text-[11px] text-brand-400 font-bold">Python • JS • Java</span>
              </div>
              <TerminalLivePreview />
            </div>

            {/* Right: Socratic Dialogue Simulator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold px-1">
                <span>2. Real-Time Pedagogical Dialogue</span>
                <span className="font-mono text-[11px] text-brand-400 font-bold">Mode: Socratic Hint</span>
              </div>
              
              <div className="bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">CodeTutor Mentor</div>
                      <div className="text-[10px] text-slate-400">Offline Llama.cpp Engine</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-950 text-brand-400 border border-brand-800 font-bold">
                    0 KB NETWORK
                  </span>
                </div>

                {/* Conversation Box */}
                <div className="p-5 space-y-4 text-xs sm:text-sm">
                  {/* Student Question */}
                  <div className="flex justify-end">
                    <div className="bg-brand-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 max-w-[85%] space-y-1 shadow-sm">
                      <p className="font-medium">I am getting a recursion limit exceeded error on my binary search function. What is wrong?</p>
                    </div>
                  </div>

                  {/* AI Tutor Socratic Guidance */}
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-xs px-4 py-3.5 max-w-[92%] space-y-2.5">
                      <p className="leading-relaxed">
                        A maximum recursion depth error occurs when the function keeps calling itself indefinitely without hitting a stopping condition.
                      </p>
                      
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs">
                        <div className="font-bold flex items-center gap-1.5 mb-1 text-brand-400">
                          <Lightbulb className="w-3.5 h-3.5 text-brand-400" />
                          <span>Guided Socratic Check:</span>
                        </div>
                        <p className="italic text-slate-300">
                          "Look at lines 4 and 8 in your code: when low &gt; high, is your function returning immediately or is it recalculating mid again?"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>CPU Latency: 38ms</span>
                        <span className="text-brand-400 font-bold">✓ Zero Cloud Leak</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: STUDENT VOICES & TESTIMONIALS (DARK: bg-slate-950)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-950">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-400 text-xs font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Student Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Real Realities in African Classrooms
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Hear from university students and developers building skills without internet limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 flex flex-col justify-between shadow-md hover:border-brand-500 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-brand-400">
                  <div className="flex gap-1 text-brand-400 text-sm">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <Quote className="w-5 h-5 text-slate-700" />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400">{t.university}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-brand-400 border border-slate-800">
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: HARDWARE SPECS / ADTC BENCHMARK (VISIBLE GRAY: bg-slate-800)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="specs" className="py-20 bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-400 text-xs font-semibold font-mono">
              <Cpu className="w-3.5 h-3.5 text-brand-400" /> ADTC 2026 Verification
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tested on Standard 8 GB RAM Student Laptops
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Engineered from the ground up for low-power, commodity machines with zero GPU requirements:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Peak RAM Footprint',
                val: '1.64 GB RSS',
                sub: 'Target: < 7.0 GB limit',
                note: 'Leaves >6 GB free memory for compilers and editors',
              },
              {
                title: 'Generation Speed',
                val: '23.44 Tok/s',
                sub: 'Target: ≥ 15.0 tok/s',
                note: 'CPU thread scaling maintains smooth interaction',
              },
              {
                title: 'Thermal Ceiling',
                val: '< 85°C Max',
                sub: '0 Throttling Penalties',
                note: 'Gentle core workload protects laptop battery life',
              },
              {
                title: 'Network Calls',
                val: '0 KB Outbound',
                sub: '100% Air-Gapped',
                note: 'Self-contained SQLite, model weights, and tokenizer',
              },
            ].map((spec, idx) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-2xl border border-slate-700 p-6 space-y-2 text-center shadow-md"
              >
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{spec.title}</div>
                <div className="text-2xl font-extrabold text-brand-400 font-mono">{spec.val}</div>
                <div className="text-xs font-bold text-slate-200">{spec.sub}</div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">{spec.note}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: FAQ ACCORDION SECTION (DARK: bg-slate-950)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 bg-slate-950">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Everything you need to know about setting up and running CodeTutor Africa.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-sm sm:text-base text-white hover:text-brand-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: FINAL CTA BANNER (VISIBLE GRAY: bg-slate-800)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl space-y-6 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Master Programming on Your Own Terms?
              </h2>
              <p className="text-sm sm:text-base text-brand-100 leading-relaxed">
                No internet subscription required. Start learning Python, JavaScript, and Java with an offline Socratic mentor right now.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/dashboard">
                <button className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-brand-700 hover:bg-brand-50 shadow-md transition-colors flex items-center gap-2">
                  <span>Launch Workspace Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-brand-800 hover:bg-brand-900 text-white border border-brand-500 transition-colors">
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: FOOTER (DARK: bg-slate-950)
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-800">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shadow-sm border border-brand-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base text-white">
                  CodeTutor <span className="text-[#005F02] font-black">Africa</span>
                </span>
                <p className="text-[10px] text-slate-400 font-mono">Offline-First Socratic Programming Education</p>
              </div>
            </div>

            {/* Nav Column Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-400 font-medium">
              <Link to="/dashboard" className="hover:text-brand-400 transition-colors">Dashboard</Link>
              <Link to="/tutor" className="hover:text-brand-400 transition-colors">AI Tutor</Link>
              <Link to="/learning" className="hover:text-brand-400 transition-colors">Courses</Link>
              <Link to="/practice" className="hover:text-brand-400 transition-colors">Practice</Link>
              <Link to="/games" className="hover:text-brand-400 transition-colors">Arcade Games</Link>
              <Link to="/debugger" className="hover:text-brand-400 transition-colors">Debugger</Link>
            </div>
          </div>

          {/* Bottom Copyright & Security Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>© 2026 CodeTutor Africa. Built with ❤️ for African university students &amp; self-learners.</span>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-brand-400" /> 100% Local Execution
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-brand-400" /> Qwen2.5-Coder GGUF
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-brand-400" /> Zero Cloud Dependency
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING BACK TO TOP BUTTON
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 transition-colors border border-brand-400"
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
