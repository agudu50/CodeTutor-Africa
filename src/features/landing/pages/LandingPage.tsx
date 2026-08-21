import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
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
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { isDark, setTheme } = useTheme()
  const [activeFeatureTab, setActiveFeatureTab] = useState<'tutor' | 'practice' | 'debugger' | 'curriculum'>('tutor')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  
  // Hero Background Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Terminal animated typing state
  const [terminalStep, setTerminalStep] = useState(0)

  const slides = [
    {
      image: '/images/students_collaboration.jpg',
      tag: 'University of Ghana & KNUST Campus Labs',
      caption: 'Peer study circles collaborating without internet connectivity',
    },
    {
      image: '/images/student_focus.jpg',
      tag: 'African CS Student Focus Room',
      caption: 'Deep algorithmic problem solving on standard 8 GB laptops',
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

  // Terminal animation cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalStep((prev) => (prev < 4 ? prev + 1 : 0))
    }, 2400)
    return () => clearInterval(timer)
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    { text: '$ codetutor start --offline --target=8gb-ram', type: 'cmd' },
    { text: '✓ Local runtime initialized (Memory allocation: 1.4 GB)', type: 'success' },
    { text: '✓ Quantized Gemma 2B IT neural weights mounted on CPU', type: 'success' },
    { text: '✓ Pre-cached syllabi indexed (Python 3.12, JavaScript, Java 21)', type: 'info' },
    { text: '● Offline Tutor Standby — Zero cloud packets transmitted [READY]', type: 'ready' },
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white relative overflow-x-hidden">
      {/* Navigation Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shrink-0 border border-brand-500">
            <Sparkles className="w-5 h-5 text-accent-300" />
          </div>
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
          <a href="#terminal-demo" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Offline Terminal
          </a>
          <a href="#why-offline" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Why Offline
          </a>
          <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Features
          </a>
          <a href="#architecture" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Architecture
          </a>
          <a href="#faq" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA / Auth & Theme Switch */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

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
      <main className="flex-1 relative">
        {/* Dynamic Background Code Animation on page */}
        <BackgroundCodeAnimation />

        {/* HERO SECTION WITH BACKGROUND PICTURE SLIDESHOW */}
        <section
          className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center px-4 md:px-8 overflow-hidden bg-slate-950 border-b border-slate-800"
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
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Solid Dark Overlay for high-contrast text readability (no gradient) */}
            <div className="absolute inset-0 bg-slate-950 opacity-65" />
          </div>

          {/* Slide navigation controls */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900 text-white border border-slate-700 hover:bg-slate-800 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Tag in top left of hero */}
          <div className="absolute top-6 left-6 sm:left-12 z-20 hidden sm:block">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {slides[currentSlide].tag}
            </span>
          </div>

          {/* Slide Dots Indicator */}
          <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-brand-500' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Hero Foreground Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 py-12 sm:py-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Pill Badge */}
              <motion.div
                variants={itemVariants}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="inline-block"
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-brand-500 text-brand-300 text-xs font-semibold shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  Zero Cloud Dependence • 100% On-Device AI for 8 GB Laptops
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-lg"
              >
                Master University Computer Science. Anytime. <span className="text-brand-400 font-black">Offline.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base md:text-lg text-slate-100 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md"
              >
                An intelligent, human-centered programming tutor built for African students. Learn Python, JavaScript, and Java with a private AI mentor that lives directly on your laptop—no internet connection, cloud bills, or expensive hardware required.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-3 pt-2"
              >
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="lg"
                    className="font-bold shadow-lg h-12 px-7 bg-brand-600 hover:bg-brand-500 border border-brand-400"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="font-semibold h-12 px-7 bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
                    leftIcon={<Laptop className="w-4 h-4" />}
                  >
                    Launch Workspace
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Animated Terminal Demo Section */}
        <section id="terminal-demo" className="py-16 sm:py-20 px-4 md:px-8 max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden text-left"
          >
            {/* Terminal Window Header */}
            <div className="h-11 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">
                  codetutor-africa — local-runtime-v0.1.0 — zsh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm" className="font-mono text-[10px] bg-brand-950 text-brand-300 border-brand-800">
                  OFFLINE 8GB RAM
                </Badge>
                <button
                  type="button"
                  onClick={() => setTerminalStep(0)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                  title="Re-run terminal demo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Animated Body */}
            <div className="p-6 font-mono text-xs text-slate-200 space-y-3 min-h-[220px]">
              {terminalLogs.slice(0, terminalStep + 1).map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-2"
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
                    <span className="text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      {log.text}
                    </span>
                  )}
                </motion.div>
              ))}

              {/* Blinking Cursor */}
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2.5 h-4 bg-brand-500 align-middle ml-1"
              />
            </div>

            {/* Terminal Sub-bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> No Network Required • 0.00 KB Cloud Data Sent
              </span>
              <span>Quantization: Q4_K_M • Model: Gemma 2B IT</span>
            </div>
          </motion.div>
        </section>

        {/* Human-Centered Empathy Section: Why Offline-First Matters */}
        <section id="why-offline" className="py-16 px-4 md:px-8 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                The Realities We Solve
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Built Around the Real Daily Experience of African Students
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Coding education shouldn't stop when campus Wi-Fi drops, electricity fluctuates, or monthly data bundles run out.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <WifiOff className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Erratic Campus Connectivity
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Study without anxiety. When dorm internet or library Wi-Fi drops, CodeTutor Africa continues executing code, explaining concepts, and tracking test progress with zero downtime.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Zero Mobile Data Burden
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cloud AI tutors consume heavy internet data on every prompt. CodeTutor Africa runs 100% on your laptop's CPU, saving your student budget for what matters most.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  1-on-1 Guidance in Large Classes
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  In university lecture halls with hundreds of students, asking questions can feel intimidating. Your offline tutor provides a patient, safe space to master tricky logic without fear of judgment.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Feature Workspace Section with Animated Tabs */}
        <section id="features" className="py-16 sm:py-20 px-4 md:px-8 max-w-6xl mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
              Interactive Workspace
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything You Need to Excel in University CS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Click through the modules below to see how each tool empowers your offline study sessions.
            </p>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'tutor', label: 'AI Socratic Tutor', icon: Bot },
              { id: 'practice', label: 'Offline Code Practice', icon: Code2 },
              { id: 'debugger', label: 'Root Cause Debugger', icon: Bug },
              { id: 'curriculum', label: 'University Syllabi', icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeFeatureTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Animated Tab Preview Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
            >
              {/* Sub-Header */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {featureTabs[activeFeatureTab].title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
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
                <div className="p-5 bg-slate-950 text-slate-200 space-y-2 overflow-x-auto leading-relaxed">
                  <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-800 flex items-center justify-between">
                    <span>Active Editor Context</span>
                    <span>UTF-8</span>
                  </div>
                  <pre className="whitespace-pre pt-2 font-mono text-xs text-slate-200">
                    {featureTabs[activeFeatureTab].codeSnippet}
                  </pre>
                </div>

                {/* Right: AI Tutor / Diagnostic Output */}
                <div className="p-5 bg-slate-900 text-slate-200 space-y-4 font-sans text-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-400 font-semibold font-mono text-[11px]">
                      <Bot className="w-4 h-4" />
                      <span>On-Device Intelligent Feedback:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
                      {featureTabs[activeFeatureTab].aiResponse}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {featureTabs[activeFeatureTab].stats}
                    </span>
                    <Link to="/dashboard" className="text-brand-400 hover:underline flex items-center gap-1 font-sans">
                      Try Workspace <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 8 GB RAM Architecture Specification Section */}
        <section id="architecture" className="py-16 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 relative z-10">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                Hardware Efficiency
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Optimized for Standard University Laptops
              </h2>
              <p className="text-xs text-slate-500">
                Engineered specifically to run efficiently on an 8 GB RAM laptop without thermal throttling or memory starvation.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono uppercase text-[10px]">AI Memory Footprint</span>
                    <Cpu className="w-4 h-4 text-brand-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">1.4 GB RAM</p>
                  <p className="text-slate-500 text-[11px]">4-bit quantized Gemma 2B weights leave 6.6 GB available for browser and system.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono uppercase text-[10px]">Vector Knowledge (RAG)</span>
                    <Terminal className="w-4 h-4 text-accent-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">IndexedDB</p>
                  <p className="text-slate-500 text-[11px]">Local vector index over lecture slides and textbook materials with zero cloud lookups.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono uppercase text-[10px]">Battery & Thermal</span>
                    <BatteryCharging className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">Lightweight CPU</p>
                  <p className="text-slate-500 text-[11px]">Sub-400ms inference bursts designed to preserve laptop battery life during load shedding.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section id="faq" className="py-16 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                          isOpen ? 'rotate-180 text-brand-500' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 1 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-20 px-4 md:px-8 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Join the Offline Coding Revolution Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Equip yourself with the tools to master computer science without barriers. Free, offline, and tailored for African universities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="font-bold shadow-sm h-12 px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Create Free Account
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="font-semibold h-12 px-6">
                  Explore as Guest
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 md:px-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs border border-brand-500">
              <Sparkles className="w-3.5 h-3.5 text-accent-300" />
            </div>
            <span>© 2026 CodeTutor Africa. Built for African Universities.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Student Dashboard
            </Link>
            <Link to="/learning" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Courses
            </Link>
            <Link to="/tutor" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              AI Tutor
            </Link>
            <Link to="/settings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
