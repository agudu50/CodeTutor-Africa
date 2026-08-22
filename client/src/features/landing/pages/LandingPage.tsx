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
   CODE SAMPLES & SYNCHRONIZED SOCRATIC DIALOGUE
   ═══════════════════════════════════════════════════════════════════ */
const codeExamples = [
  {
    lang: 'python',
    filename: 'algorithms.py',
    badge: 'Python • Recursion',
    code: `# Problem: Socratic Tutor guiding recursion
def sum_list(items):
    # Hint: What is our base case when items is empty?
    if not items:
        return 0
    # Step: Add the first element to the sum of the rest
    return items[0] + sum_list(items[1:])

print("Sum:", sum_list([10, 20, 30, 40]))  # Output: 100`,
    dialogue: {
      student: 'I am getting a recursion limit exceeded error on my binary search function. What is wrong?',
      ai: 'A maximum recursion depth error occurs when the function keeps calling itself indefinitely without hitting a stopping condition.',
      hint: 'Look at lines 4 and 8 in your code: when low > high, is your function returning immediately or is it recalculating mid again?',
      latency: 'CPU Latency: 38ms',
      verified: 'Python AST Verified',
    },
  },
  {
    lang: 'javascript',
    filename: 'eventLoop.js',
    badge: 'JavaScript • Microtasks',
    code: `// Understanding JavaScript Microtasks & Promises
console.log("1: Synchronous start");

Promise.resolve().then(() => {
  console.log("3: Microtask queue executed");
});

console.log("2: Synchronous end");
// Tutor: "Notice how microtasks execute before timers!"`,
    dialogue: {
      student: 'Why does the Promise microtask execute before setTimeout(..., 0) in the event loop?',
      ai: 'The JavaScript engine drains the entire microtask queue at the end of the current synchronous tick before polling the timer queue.',
      hint: 'Notice the output sequence 1 -> 2 -> 3: what runs while the main thread call stack is still synchronously active?',
      latency: 'CPU Latency: 42ms',
      verified: 'V8 Event Loop Verified',
    },
  },
  {
    lang: 'java',
    filename: 'BankLedger.java',
    badge: 'Java • Encapsulation',
    code: `// Java OOP: Encapsulation & Memory Safety
public class BankLedger {
    private double balance;

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException();
        this.balance += amount;
    }
}`,
    dialogue: {
      student: 'Why should balance be private with a method instead of making balance public?',
      ai: 'Encapsulation prevents unauthorized state mutations and allows validating invariants (like amount > 0) before modifying ledger balances.',
      hint: 'If balance were public, what would prevent external code from directly writing account.balance = -5000 and bypassing the deposit check?',
      latency: 'CPU Latency: 35ms',
      verified: 'JVM OOP Model Verified',
    },
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

/* ═══════════════════════════════════════════════════════════════
   VS CODE SYNTAX TOKENIZER & HIGHLIGHTER
   ═══════════════════════════════════════════════════════════════ */
function renderVSCodeTokens(lineText: string, lineIndex: number) {
  // Check for line comments (# or //)
  const commentIdx = lineText.search(/(#|\/\/)/)
  let codePart = lineText
  let commentPart = ''
  if (commentIdx !== -1) {
    codePart = lineText.substring(0, commentIdx)
    commentPart = lineText.substring(commentIdx)
  }

  // Tokenize codePart with VS Code Dark+ color palette
  const tokenRegex = /("(?:\\.|[^"\\])*")|(\b(?:def|if|not|return|print|console|Promise|public|class|private|double|void|throw|new|this)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*(?=\s*\())|(\b[A-Z]\w*\b)|([a-zA-Z_]\w*)|([^\s\w"']+|\s+)/g
  const tokens: React.ReactNode[] = []
  let match
  let k = 0

  while ((match = tokenRegex.exec(codePart)) !== null) {
    const [full, str, kw, num, fn, typeCls, ident, symbol] = match
    if (str) {
      tokens.push(<span key={k++} className="text-[#CE9178]">{str}</span>)
    } else if (kw) {
      const isControl = /^(if|not|return|throw|new)$/.test(kw)
      tokens.push(
        <span key={k++} className={isControl ? "text-[#C586C0] font-semibold" : "text-[#569CD6] font-semibold"}>
          {kw}
        </span>
      )
    } else if (num) {
      tokens.push(<span key={k++} className="text-[#B5CEA8]">{num}</span>)
    } else if (fn) {
      tokens.push(<span key={k++} className="text-[#DCDCAA]">{fn}</span>)
    } else if (typeCls) {
      tokens.push(<span key={k++} className="text-[#4EC9B0]">{typeCls}</span>)
    } else if (ident) {
      tokens.push(<span key={k++} className="text-[#9CDCFE]">{ident}</span>)
    } else {
      tokens.push(<span key={k++} className="text-[#D4D4D4]">{symbol || full}</span>)
    }
  }

  return (
    <div key={lineIndex} className="table-row leading-relaxed">
      <span className="table-cell pr-3 select-none text-slate-500 text-right w-6 font-mono text-[11px]">{lineIndex + 1}</span>
      <span className="table-cell font-mono">
        {tokens}
        {commentPart && <span className="text-[#6A9955] italic">{commentPart}</span>}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TERMINAL PREVIEW COMPONENT (VS CODE THEMED & SYNCHRONIZED)
   ═══════════════════════════════════════════════════════════════ */
interface TerminalLivePreviewProps {
  activeTab: number
  setActiveTab: (tab: number) => void
  onHoverChange: (isHovered: boolean) => void
}

const TerminalLivePreview: React.FC<TerminalLivePreviewProps> = memo(({
  activeTab,
  setActiveTab,
  onHoverChange,
}) => {
  const [displayedCode, setDisplayedCode] = useState(codeExamples[0].code)

  // Typewriter effect on activeTab change
  useEffect(() => {
    const targetCode = codeExamples[activeTab].code
    setDisplayedCode('')
    let idx = 0
    const interval = setInterval(() => {
      idx += 6
      if (idx >= targetCode.length) {
        setDisplayedCode(targetCode)
        clearInterval(interval)
      } else {
        setDisplayedCode(targetCode.slice(0, idx))
      }
    }, 12)
    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <div
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="flex flex-col flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 bg-[#1E1E1E] shadow-2xl overflow-hidden font-mono text-xs text-left"
    >
      {/* Code Editor Tab Bar (Enhanced VS Code Style) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#333333] shrink-0 gap-3">
        {/* Left: Window Traffic Lights & Language Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {/* macOS / VS Code Traffic Light Dots */}
          <div className="flex items-center gap-1.5 mr-1 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block shadow-xs" />
          </div>

          {/* Interactive Language Tabs */}
          <div className="flex items-center gap-1.5">
            {codeExamples.map((ex, i) => {
              const isActive = activeTab === i
              return (
                <button
                  key={ex.filename}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-[#1E1E1E] text-white shadow-md border border-[#444444] border-b-2 border-b-[#005F02]'
                      : 'bg-[#2D2D2D]/70 text-slate-400 border border-transparent hover:bg-[#333333] hover:text-slate-200'
                  }`}
                >
                  <Code2 className={`w-3.5 h-3.5 ${isActive ? 'text-[#005F02]' : 'text-slate-400'}`} />
                  <span className="truncate">{ex.filename}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] inline-block animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: High-Tech Offline Telemetry Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#005F02]/15 border border-[#005F02]/40 text-[10px] font-mono font-bold text-[#005F02] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-ping" />
            <span>100% OFFLINE</span>
          </span>
        </div>
      </div>

      {/* VS Code Editor Body */}
      <div className="p-4 overflow-x-auto flex-1 min-h-[220px] bg-[#1E1E1E] text-[#D4D4D4] leading-relaxed font-mono">
        <div className="table w-full text-xs sm:text-[13px]">
          {displayedCode.split('\n').map((line, lIdx) => renderVSCodeTokens(line, lIdx))}
        </div>
      </div>

      {/* Socratic Terminal Guidance Bar */}
      <div className="px-4 py-2.5 bg-[#252526] border-t border-[#333333] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#005F02]" />
          <span className="text-slate-300 font-medium">Socratic Insight:</span>
          <span className="text-slate-400 truncate">Compiler verified locally (0 KB network)</span>
        </div>
        <span className="text-[#005F02] font-bold font-mono text-[10px]">23.4 tok/s</span>
      </div>
    </div>
  )
})
TerminalLivePreview.displayName = 'TerminalLivePreview'

/* ═══════════════════════════════════════════════════════════════
   LIGHT AMBIENT BACKGROUND ANIMATION COMPONENT (VIBRANT & VISIBLE)
   ═══════════════════════════════════════════════════════════════ */
const AmbientLightBackground: React.FC = memo(() => {
  const particles = [
    { top: '10%', left: '15%', size: 6, duration: 8, delay: 0 },
    { top: '22%', left: '80%', size: 8, duration: 10, delay: 1 },
    { top: '35%', left: '30%', size: 5, duration: 7, delay: 2 },
    { top: '48%', left: '70%', size: 7, duration: 9, delay: 0.5 },
    { top: '60%', left: '20%', size: 6, duration: 11, delay: 1.5 },
    { top: '72%', left: '85%', size: 8, duration: 8.5, delay: 2.5 },
    { top: '85%', left: '40%', size: 5, duration: 9.5, delay: 3 },
    { top: '92%', left: '65%', size: 7, duration: 12, delay: 1 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Vibrant Ambient Glow Orb 1 - Top Left */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.3, 0.9, 1],
          opacity: [0.4, 0.75, 0.4],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-[#005F02]/25 dark:bg-[#005F02]/35 blur-3xl"
      />

      {/* Vibrant Ambient Glow Orb 2 - Middle Right */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 60, -50, 0],
          scale: [1, 1.25, 0.95, 1],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[35%] right-5 w-[550px] h-[550px] rounded-full bg-[#005F02]/25 dark:bg-[#005F02]/35 blur-3xl"
      />

      {/* Vibrant Ambient Glow Orb 3 - Lower Left */}
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-[65%] left-5 w-[520px] h-[520px] rounded-full bg-[#005F02]/30 dark:bg-[#005F02]/40 blur-3xl"
      />

      {/* Vibrant Ambient Glow Orb 4 - Bottom Center */}
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.25, 1, 1],
          opacity: [0.3, 0.65, 0.3],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 4.5 }}
        className="absolute bottom-10 right-1/4 w-[480px] h-[480px] rounded-full bg-[#005F02]/25 dark:bg-[#005F02]/35 blur-3xl"
      />

      {/* Floating Sparkle Particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{
            y: [0, -60, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
          className="absolute rounded-full bg-[#005F02] shadow-[0_0_10px_#005F02]"
        />
      ))}

      {/* High-Contrast Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#005f021f_1px,transparent_1px),linear-gradient(to_bottom,#005f021f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
    </div>
  )
})
AmbientLightBackground.displayName = 'AmbientLightBackground'

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT (FULL #005F02 CONSISTENCY)
   ═══════════════════════════════════════════════════════════════ */
export const LandingPage: React.FC = () => {
  const { isDark, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSlidePaused, setIsSlidePaused] = useState(false)
  const [activeCodeTab, setActiveCodeTab] = useState(0)
  const [isCodePaused, setIsCodePaused] = useState(false)
  const [testimonialSlide, setTestimonialSlide] = useState(0)
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  // Auto-advance hero carousel (faster 3.2s transition)
  useEffect(() => {
    if (isSlidePaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [isSlidePaused])

  // Auto-advance code IDE and Socratic dialogue synchronously (4.5s transition)
  useEffect(() => {
    if (isCodePaused) return
    const timer = setInterval(() => {
      setActiveCodeTab((prev) => (prev + 1) % codeExamples.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isCodePaused])

  // Auto-advance student testimonials slide show (4.5s transition)
  useEffect(() => {
    if (isTestimonialPaused) return
    const timer = setInterval(() => {
      setTestimonialSlide((prev) => (prev + 1) % studentTestimonials.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isTestimonialPaused])

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
      icon: <Sparkles className="w-6 h-6 text-[#005F02]" />,
      badge: 'Pedagogy',
      title: '6 Socratic AI Modes',
      description: 'Explain, Hint, Practice, Debug, Review, and Quiz modes that build real engineering intuition instead of copy-paste habits.',
      link: '/tutor',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#005F02]" />,
      badge: 'Curriculum',
      title: 'Comprehensive Course Tracks',
      description: 'Structured syllabi for Python Fundamentals, Async JavaScript, and Java OOP aligned with African engineering university curricula.',
      link: '/learning',
    },
    {
      icon: <Code2 className="w-6 h-6 text-[#005F02]" />,
      badge: 'Execution',
      title: 'Interactive Code Playground',
      description: 'Write, execute, and validate code against automated test cases locally on your CPU with zero external dependencies.',
      link: '/practice',
    },
    {
      icon: <Bug className="w-6 h-6 text-[#005F02]" />,
      badge: 'Diagnostics',
      title: 'Compiler Root-Cause Debugger',
      description: 'Paste tricky stack traces and compiler errors. The AI breaks down memory state, edge cases, and guided fixes.',
      link: '/debugger',
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-[#005F02]" />,
      badge: 'Gamification',
      title: '3D Arcade Mini-Games',
      description: 'Syntax Speedrun, Bug Hunt Blitz, Output Predictor, and Code Shuffle turn tedious syntax drills into engaging offline challenges.',
      link: '/games',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#005F02]" />,
      badge: 'Progress',
      title: 'Skill Mastery & Streaks',
      description: 'Track daily study streaks, problem-solving velocity, and earned badges stored privately in your local storage.',
      link: '/dashboard',
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#005F02] selection:text-white transition-colors duration-300">

      {/* ═══════════════════════════════════════════════════════════════
          HEADER NAVIGATION
          ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#005F02] text-white flex items-center justify-center font-bold text-base shadow-sm border border-[#005F02] group-hover:bg-[#004e02] transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                CodeTutor <span className="text-[#005F02] font-black">Africa</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#005F02] inline-block animate-pulse" />
                <span>100% Offline AI Mentor</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#005F02] transition-colors"
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
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#005F02]" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Auth CTAs */}
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/signin">
                <button className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="px-4 py-2 rounded-lg text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-sm transition-colors flex items-center gap-1.5">
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
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
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                    Sign In
                  </button>
                </Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white">
                    Launch Workspace
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO SECTION
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
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#005F02]" />
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-[#005F02] hover:border-[#005F02] transition-colors shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-[#005F02] hover:border-[#005F02] transition-colors shadow-lg"
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
              <button className="px-7 py-3.5 rounded-xl text-sm font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xl flex items-center gap-2 transition-transform hover:scale-102">
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#demo">
              <button className="px-7 py-3.5 rounded-xl text-sm font-bold bg-slate-900/90 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-2">
                <Play className="w-4 h-4 text-[#005F02]" />
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
              <Shield className="w-3.5 h-3.5 text-[#005F02]" /> 100% Private &amp; Free
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#005F02]" /> 23.4 Tokens/Sec CPU Speed
            </span>
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-[#005F02]" /> 8 GB RAM Optimized
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT WRAPPER WITH LIGHT AMBIENT BACKGROUND ANIMATION
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <AmbientLightBackground />

        {/* ═══════════════════════════════════════════════════════════════
            ANIMATED CONNECTING DATA LINE (HERO TO STATS)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="relative flex flex-col items-center justify-center -my-3 z-30 pointer-events-none">
        <div className="w-0.5 h-10 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 40] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
        
        <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#005F02] shadow-lg text-[10px] font-mono text-[#005F02] flex items-center gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-ping" />
          <span className="font-bold tracking-wider">LIVE TELEMETRY STREAM</span>
        </div>

        <div className="w-0.5 h-10 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 40] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'linear', delay: 0.8 }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: INTERCONNECTED LINKED GLASSMORPHISM STATS STRIP
          ═══════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="pb-16 pt-2 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10 text-center">
            
            {/* Stat Card 1 -> Links to #specs */}
            <a
              href="#specs"
              className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/15 dark:bg-[#005F02]/30 border border-[#005F02]/40 text-[#005F02] flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#005F02] font-mono tracking-tight">
                {statOffline}%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">Offline Operation</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Zero cloud API costs →</div>
            </a>

            {/* Stat Card 2 -> Links to #specs */}
            <a
              href="#specs"
              className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/15 dark:bg-[#005F02]/30 border border-[#005F02]/40 text-[#005F02] flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#005F02] font-mono tracking-tight">
                {statTokens}.4
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">Tokens Per Second</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">4-Thread CPU speed →</div>
            </a>

            {/* Stat Card 3 -> Links to #features */}
            <a
              href="#features"
              className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/15 dark:bg-[#005F02]/30 border border-[#005F02]/40 text-[#005F02] flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#005F02] font-mono tracking-tight">
                {statExercises}+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">Practice Exercises</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Python, JS &amp; Java →</div>
            </a>

            {/* Stat Card 4 -> Links to #demo */}
            <a
              href="#demo"
              className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group block focus:outline-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#005F02]/15 dark:bg-[#005F02]/30 border border-[#005F02]/40 text-[#005F02] flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#005F02] font-mono tracking-tight">
                {statModes}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">Pedagogical Modes</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Explain, Hint, Debug →</div>
            </a>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATED CONNECTOR: STATS TO FEATURES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center -my-4 z-30 pointer-events-none">
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
        <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#005F02] shadow-lg text-[10px] font-mono text-[#005F02] flex items-center gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
          <span className="font-bold tracking-wider">OFFLINE ARCHITECTURE</span>
        </div>
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: 0.9 }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: FEATURES GRID (INTERCONNECTED GLASSMORPHISM)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[#005F02] text-xs font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#005F02]" /> Complete Learning Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Academic Rigor &amp; Practical Mastery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Every feature—from compiler diagnostics to gamified syntax drills—is bundled to run 100% locally on standard laptops.
          </p>
        </div>

        {/* Linked Glassmorphism Features Container */}
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl dark:shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                className="bg-slate-50/80 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 space-y-3.5 hover:border-[#005F02] hover:bg-white dark:hover:bg-white/[0.06] transition-all group shadow-sm dark:shadow-inner block"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-[#005F02]/15 dark:bg-[#005F02]/30 border border-[#005F02]/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border border-[#005F02]/30 bg-[#005F02]/10 text-[#005F02]">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors flex items-center justify-between">
                  <span>{card.title}</span>
                  <span className="text-xs text-[#005F02] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATED CONNECTOR: FEATURES TO SANDBOX
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center -my-4 z-30 pointer-events-none">
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
        <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#005F02] shadow-lg text-[10px] font-mono text-[#005F02] flex items-center gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
          <span className="font-bold tracking-wider">EXECUTION ENGINE</span>
        </div>
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: 0.9 }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: INTERACTIVE LIVE CODE SANDBOX
          ═══════════════════════════════════════════════════════════════ */}
      <section id="demo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[#005F02] text-xs font-semibold font-mono">
            <Terminal className="w-3.5 h-3.5 text-[#005F02]" /> Interactive Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Test Driven Learning with Real Code
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Switch languages to see how CodeTutor guides you through algorithms, async concurrency, and object-oriented design.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Code Editor Sandbox Preview */}
          <div className="space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1 shrink-0">
              <span>1. Multi-Language Code Runner</span>
              <span className="font-mono text-[11px] text-[#005F02] font-bold">
                {codeExamples[activeCodeTab].badge}
              </span>
            </div>
            <TerminalLivePreview
              activeTab={activeCodeTab}
              setActiveTab={setActiveCodeTab}
              onHoverChange={setIsCodePaused}
            />
          </div>

          {/* Right: Socratic Dialogue Simulator */}
          <div
            className="space-y-3 flex flex-col h-full"
            onMouseEnter={() => setIsCodePaused(true)}
            onMouseLeave={() => setIsCodePaused(false)}
          >
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1 shrink-0">
              <span>2. Real-Time Pedagogical Dialogue</span>
              <span className="font-mono text-[11px] text-[#005F02] font-bold">Mode: Socratic Hint</span>
            </div>
            
            <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col flex-1">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#005F02] flex items-center justify-center text-white font-bold">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">CodeTutor Mentor</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Offline Llama.cpp Engine</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#005F02]/10 text-[#005F02] border border-[#005F02]/30 font-bold">
                  0 KB NETWORK
                </span>
              </div>

              {/* Conversation Box (Synchronized with Active Language) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCodeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 space-y-4 text-xs sm:text-sm flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Student Question */}
                    <div className="flex justify-end">
                      <div className="bg-[#005F02] text-white rounded-2xl rounded-tr-xs px-4 py-3 max-w-[85%] space-y-1 shadow-sm">
                        <p className="font-medium">{codeExamples[activeCodeTab].dialogue.student}</p>
                      </div>
                    </div>

                    {/* AI Tutor Socratic Guidance */}
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-xs px-4 py-3.5 max-w-[92%] space-y-2.5">
                        <p className="leading-relaxed">
                          {codeExamples[activeCodeTab].dialogue.ai}
                        </p>
                        
                        <div className="p-3 rounded-xl bg-[#005F02]/10 dark:bg-slate-900 border border-[#005F02]/30 text-slate-800 dark:text-slate-300 text-xs">
                          <div className="font-bold flex items-center gap-1.5 mb-1 text-[#005F02]">
                            <Lightbulb className="w-3.5 h-3.5 text-[#005F02]" />
                            <span>Guided Socratic Check:</span>
                          </div>
                          <p className="italic text-slate-700 dark:text-slate-300">
                            "{codeExamples[activeCodeTab].dialogue.hint}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 shrink-0">
                    <span>{codeExamples[activeCodeTab].dialogue.latency}</span>
                    <span className="text-[#005F02] font-bold">✓ {codeExamples[activeCodeTab].dialogue.verified}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATED CONNECTOR: SANDBOX TO TESTIMONIALS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center -my-4 z-30 pointer-events-none">
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
        <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#005F02] shadow-lg text-[10px] font-mono text-[#005F02] flex items-center gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
          <span className="font-bold tracking-wider">COMMUNITY IMPACT</span>
        </div>
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: 0.9 }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: STUDENT VOICES & TESTIMONIALS (ANIMATED SLIDESHOW)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        id="testimonials"
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative z-10"
        onMouseEnter={() => setIsTestimonialPaused(true)}
        onMouseLeave={() => setIsTestimonialPaused(false)}
      >
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[#005F02] text-xs font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#005F02]" /> Student Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Real Realities in African Classrooms
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Hear from university students and developers building skills without internet limits.
          </p>
        </div>

        {/* Featured Testimonial Slideshow Box */}
        <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-xl dark:shadow-2xl overflow-hidden min-h-[300px] flex flex-col justify-between">
          {/* Navigation Arrows */}
          <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={() => setTestimonialSlide((prev) => (prev === 0 ? studentTestimonials.length - 1 : prev - 1))}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#005F02] hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setTestimonialSlide((prev) => (prev + 1) % studentTestimonials.length)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#005F02] hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Testimonial Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pr-16 sm:pr-24">
                {/* 5 Stars Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#005F02] text-base sm:text-lg">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <Quote className="w-6 h-6 text-[#005F02]/40 shrink-0" />
                </div>

                {/* Big Quote */}
                <blockquote className="text-base sm:text-xl md:text-2xl text-slate-800 dark:text-slate-200 font-medium italic leading-relaxed">
                  "{studentTestimonials[testimonialSlide].quote}"
                </blockquote>
              </div>

              {/* Author Profile Footer */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#005F02] text-white font-bold flex items-center justify-center text-sm shadow-md border-2 border-white dark:border-slate-800">
                    {studentTestimonials[testimonialSlide].name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      {studentTestimonials[testimonialSlide].name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {studentTestimonials[testimonialSlide].role} • <span className="font-semibold text-slate-700 dark:text-slate-300">{studentTestimonials[testimonialSlide].university}</span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[#005F02]/15 dark:bg-[#005F02]/30 text-[#005F02] border border-[#005F02]/40">
                  {studentTestimonials[testimonialSlide].tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Interactive Slide Indicators */}
          <div className="flex items-center justify-center gap-2 pt-6 mt-2">
            {studentTestimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTestimonialSlide(idx)}
                className={`transition-all rounded-full flex items-center gap-1.5 ${
                  testimonialSlide === idx
                    ? 'w-8 h-2.5 bg-[#005F02]'
                    : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-[#005F02]/50'
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATED CONNECTOR: TESTIMONIALS TO SPECS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center -my-4 z-30 pointer-events-none">
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
        <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#005F02] shadow-lg text-[10px] font-mono text-[#005F02] flex items-center gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
          <span className="font-bold tracking-wider">HARDWARE BENCHMARK</span>
        </div>
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: 0.9 }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: HARDWARE SPECS / ADTC BENCHMARK (LINKED STRIP)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="specs" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[#005F02] text-xs font-semibold font-mono">
            <Cpu className="w-3.5 h-3.5 text-[#005F02]" /> ADTC 2026 Verification
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tested on Standard 8 GB RAM Student Laptops
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered from the ground up for low-power, commodity machines with zero GPU requirements:
          </p>
        </div>

        {/* Interconnected Linked Hardware Strip */}
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10 text-center">
            {[
              {
                title: 'Peak RAM Footprint',
                val: '1.64 GB RSS',
                sub: 'Target: < 7.0 GB limit',
                note: 'Leaves >6 GB free memory for IDE & compiler',
              },
              {
                title: 'Generation Speed',
                val: '23.44 Tok/s',
                sub: 'Target: ≥ 15.0 tok/s',
                note: 'CPU thread scaling maintains fluid interaction',
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
                className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group"
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{spec.title}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#005F02] font-mono tracking-tight">{spec.val}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{spec.sub}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/[0.06]">{spec.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATED CONNECTOR: SPECS TO FAQ
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center -my-4 z-30 pointer-events-none">
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
        <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#005F02] shadow-lg text-[10px] font-mono text-[#005F02] flex items-center gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
          <span className="font-bold tracking-wider">QUESTIONS &amp; ANSWERS</span>
        </div>
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: 0.9 }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: FAQ ACCORDION (GLASSMORPHISM)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Everything you need to know about setting up and running CodeTutor Africa.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all shadow-sm hover:border-[#005F02]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-[#005F02] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#005F02]' : ''
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
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-white/[0.06] pt-3">
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
          ANIMATED CONNECTOR: FAQ TO CTA
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center -my-4 z-30 pointer-events-none">
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
        <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-[#005F02] shadow-lg text-[10px] font-mono text-[#005F02] flex items-center gap-1.5 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-pulse" />
          <span className="font-bold tracking-wider">GET STARTED</span>
        </div>
        <div className="w-0.5 h-12 bg-gradient-to-b from-[#005F02] to-[#005F02] relative overflow-hidden">
          <motion.div
            animate={{ y: [-10, 48] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear', delay: 0.9 }}
            className="w-1.5 h-3 bg-[#005F02] dark:bg-white rounded-full -left-0.5 absolute shadow-[0_0_8px_#005F02]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: FINAL CTA BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#005F02] rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl space-y-6 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Master Programming on Your Own Terms?
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                No internet subscription required. Start learning Python, JavaScript, and Java with an offline Socratic mentor right now.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/dashboard">
                <button className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-[#005F02] hover:bg-slate-100 shadow-md transition-colors flex items-center gap-2">
                  <span>Launch Workspace Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-[#004e02] hover:bg-[#003e02] text-white border border-white/20 transition-colors">
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#005F02] text-white flex items-center justify-center font-bold text-base shadow-sm border border-[#005F02]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  CodeTutor <span className="text-[#005F02] font-black">Africa</span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Offline-First Socratic Programming Education</p>
              </div>
            </div>

            {/* Nav Column Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <Link to="/dashboard" className="hover:text-[#005F02] transition-colors">Dashboard</Link>
              <Link to="/tutor" className="hover:text-[#005F02] transition-colors">AI Tutor</Link>
              <Link to="/learning" className="hover:text-[#005F02] transition-colors">Courses</Link>
              <Link to="/practice" className="hover:text-[#005F02] transition-colors">Practice</Link>
              <Link to="/games" className="hover:text-[#005F02] transition-colors">Arcade Games</Link>
              <Link to="/debugger" className="hover:text-[#005F02] transition-colors">Debugger</Link>
            </div>
          </div>

          {/* Bottom Copyright & Security Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>© 2026 CodeTutor Africa. Built with ❤️ for African university students &amp; self-learners.</span>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#005F02]" /> 100% Local Execution
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#005F02]" /> Qwen2.5-Coder GGUF
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#005F02]" /> Zero Cloud Dependency
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
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#005F02] text-white shadow-xl hover:bg-[#004e02] transition-colors border border-[#005F02]"
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
