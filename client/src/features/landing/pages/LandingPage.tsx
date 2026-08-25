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
   HERO SLIDESHOW DATA (PLAIN ENGLISH FOR EVERYONE)
   ═══════════════════════════════════════════════════════════════════ */
const heroSlides = [
  {
    image: '/images/students_collaboration.jpg',
    tag: 'For Everyone Across Africa',
    title: 'Learn to Code at Your Own Pace',
    subtitle: 'From Accra to Nairobi, Lagos to Johannesburg — learn programming step-by-step without the obstacle of costly mobile data or unstable Wi-Fi.',
  },
  {
    image: '/images/student_focus.jpg',
    tag: 'Your Friendly 24/7 AI Mentor',
    title: 'Ask Any Question, Anytime Without Fear',
    subtitle: 'Get clear, simple explanations and gentle hints in plain English. No confusing jargon, no judgment, and zero internet needed.',
  },
  {
    image: '/images/terminal_student_offline.jpg',
    tag: 'Practice By Doing',
    title: 'Build Real Skills with Fun & Easy Lessons',
    subtitle: 'Write your first lines of code, fix mistakes with helpful guidance, and play fun coding games directly on your laptop.',
  },
]

/* ═══════════════════════════════════════════════════════════════════
   CODE SAMPLES & SYNCHRONIZED SOCRATIC DIALOGUE (BEGINNER FRIENDLY)
   ═══════════════════════════════════════════════════════════════════ */
const codeExamples = [
  {
    lang: 'python',
    filename: 'welcome.py',
    badge: 'Python • Beginner Friendly',
    code: `# Problem: Calculate total price with a friendly function
def calculate_total(price, quantity):
    # Multiply the unit price by the number of items
    return price * quantity

item_name = "Notebook"
total_cost = calculate_total(15, 3)
print("Total for 3 " + item_name + "s is $" + str(total_cost))`,
    output: `> Output:
Total for 3 Notebooks is $45
[✓ Program executed in 14ms • 100% Offline]`,
    dialogue: {
      student: 'How does the calculate_total function know what 15 and 3 mean?',
      ai: 'When you call calculate_total(15, 3), Python matches 15 to the "price" label and 3 to "quantity", then multiplies them together to give 45.',
      hint: 'What happens if you change 3 to 5 items in line 7? What will the new total cost be?',
      latency: 'Instant: 35ms',
      verified: 'Runs 100% Offline',
    },
    alternateDialogue: {
      student: 'What happens if quantity is set to 0?',
      ai: 'If quantity is 0, 15 multiplied by 0 equals 0. The program will safely print "Total for 0 Notebooks is $0" without crashing.',
      hint: 'In a real shop app, what friendly message could you show if someone adds 0 items?',
    },
  },
  {
    lang: 'javascript',
    filename: 'greeting.js',
    badge: 'JavaScript • Web Basics',
    code: `// Greet a new learner based on whether it is their first time
function getGreeting(learnerName, isNew) {
  if (isNew) {
    return "Welcome to coding, " + learnerName + "! Let's learn step-by-step.";
  }
  return "Welcome back, " + learnerName + "! Ready for today's lesson?";
}

console.log(getGreeting("Kwame", true));`,
    output: `> Output:
"Welcome to coding, Kwame! Let's learn step-by-step."
[✓ Program executed in 11ms • 100% Offline]`,
    dialogue: {
      student: 'What is the difference between "Kwame" and "true" in this code?',
      ai: '"Kwame" is a text word (a String), while "true" is a yes/no switch (a Boolean). The function checks the switch to pick the right greeting.',
      hint: 'If you change "true" to "false" on line 8, which of the two welcome messages will appear?',
      latency: 'Instant: 30ms',
      verified: 'Runs 100% Offline',
    },
    alternateDialogue: {
      student: 'What happens if we pass "false" instead of "true"?',
      ai: 'Passing "false" skips the first if-block and immediately runs the second return statement: "Welcome back, Kwame! Ready for today\'s lesson?"',
      hint: 'Notice how the computer picks only one branch based on whether the switch is true or false!',
    },
  },
  {
    lang: 'java',
    filename: 'PiggyBank.java',
    badge: 'Java • Easy Objects',
    code: `// A simple digital piggy bank to track your savings
public class PiggyBank {
    private int savings = 50;

    public void addMoney(int amount) {
        this.savings += amount;
        System.out.println("New total savings: $" + this.savings);
    }
}`,
    output: `> Output:
PiggyBank created with initial $50.
New total savings: $75
[✓ Program executed in 16ms • 100% Offline]`,
    dialogue: {
      student: 'Why do we use addMoney() instead of changing savings directly?',
      ai: 'Using addMoney() keeps your savings safe—just like putting coins through a piggy bank slot rather than breaking the bank open.',
      hint: 'If you start with 50 and call addMoney(25), what number will be printed on your screen?',
      latency: 'Instant: 32ms',
      verified: 'Runs 100% Offline',
    },
    alternateDialogue: {
      student: 'Can I add a function to withdraw money too?',
      ai: 'Yes! You can create a function called withdrawMoney(int amount) that checks if you have enough savings before subtracting.',
      hint: 'What safety check should we add so someone cannot withdraw more money than they currently have?',
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
  const [isRunning, setIsRunning] = useState(false)
  const [showOutput, setShowOutput] = useState(true)

  // Typewriter effect on activeTab change
  useEffect(() => {
    const targetCode = codeExamples[activeTab].code
    setDisplayedCode('')
    setIsRunning(true)
    let idx = 0
    const interval = setInterval(() => {
      idx += 6
      if (idx >= targetCode.length) {
        setDisplayedCode(targetCode)
        setIsRunning(false)
        clearInterval(interval)
      } else {
        setDisplayedCode(targetCode.slice(0, idx))
      }
    }, 12)
    return () => clearInterval(interval)
  }, [activeTab])

  const handleRunCode = () => {
    setIsRunning(true)
    setShowOutput(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 300)
  }

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
                  onClick={() => {
                    setActiveTab(i)
                    setShowOutput(true)
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-[#1E1E1E] text-white shadow-md border border-[#444444] border-b-2 border-b-[#005F02]'
                      : 'bg-[#2D2D2D]/70 text-slate-400 border border-transparent hover:bg-[#333333] hover:text-slate-200'
                  }`}
                >
                  <Code2 className={`w-3.5 h-3.5 ${isActive ? 'text-[#005F02]' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{ex.filename}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] inline-block animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Run Code Button & Offline Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-2.5 py-1 rounded-md bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-[10px] flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3 h-3 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#005F02]/15 border border-[#005F02]/40 text-[10px] font-mono font-bold text-[#005F02] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] animate-ping" />
            <span>100% OFFLINE</span>
          </span>
        </div>
      </div>

      {/* VS Code Editor Body */}
      <div className="p-4 overflow-x-auto flex-1 min-h-[170px] bg-[#1E1E1E] text-[#D4D4D4] leading-relaxed font-mono">
        <div className="table w-full text-xs sm:text-[13px]">
          {displayedCode.split('\n').map((line, lIdx) => renderVSCodeTokens(line, lIdx))}
        </div>
      </div>

      {/* Interactive Terminal Output Drawer */}
      {showOutput && (
        <div className="px-4 py-2.5 bg-[#181818] border-t border-[#333333] font-mono text-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-[#282828] mb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Terminal className="w-3 h-3" /> Console Output
            </span>
            <span className="text-[10px] text-slate-500">Zero Internet Used</span>
          </div>
          <div className="text-emerald-300 whitespace-pre-wrap leading-relaxed text-[11px]">
            {isRunning ? (
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Running program locally...
              </span>
            ) : (
              codeExamples[activeTab].output
            )}
          </div>
        </div>
      )}

      {/* Live AI Guidance Bar */}
      <div className="px-4 py-2 bg-[#252526] border-t border-[#333333] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-[#005F02] shrink-0" />
          <span className="text-slate-300 font-medium shrink-0">Helpful Hint:</span>
          <span className="text-slate-400 truncate">Runs locally on your laptop (0 KB internet needed)</span>
        </div>
        <span className="text-[#005F02] font-bold font-mono text-[10px] shrink-0 ml-2">Instant Speed</span>
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
  const [activeQuestionTab, setActiveQuestionTab] = useState<number>(0)
  const [isCodePaused, setIsCodePaused] = useState(false)
  const [testimonialSlide, setTestimonialSlide] = useState(0)
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  // Reset active question when code tab changes
  useEffect(() => {
    setActiveQuestionTab(0)
  }, [activeCodeTab])

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
      badge: 'Personal AI Tutor',
      title: '6 Friendly Learning Modes',
      description: 'Ask questions in plain English. Get simple explanations, gentle hints, error help, code reviews, and quick quizzes that help you truly understand.',
      link: '/tutor',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#005F02]" />,
      badge: 'Step-by-Step',
      title: 'Beginner to Pro Courses',
      description: 'Learn Python, JavaScript, and Java through structured, bite-sized lessons. Perfect for absolute beginners, students, and career changers alike.',
      link: '/learning',
    },
    {
      icon: <Code2 className="w-6 h-6 text-[#005F02]" />,
      badge: 'Try It Out',
      title: 'Interactive Code Playground',
      description: 'Practice what you learn right inside your browser. Run programs instantly on your laptop without setting up complex tools or servers.',
      link: '/practice',
    },
    {
      icon: <Bug className="w-6 h-6 text-[#005F02]" />,
      badge: 'Error Helper',
      title: 'Plain-English Bug Fixer',
      description: 'Confused by an error message? Paste your code and the AI tutor explains what went wrong and how to fix it in simple everyday language.',
      link: '/debugger',
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-[#005F02]" />,
      badge: 'Fun & Games',
      title: 'Arcade Coding Mini-Games',
      description: 'Play fun games like Syntax Speedrun and Bug Hunter to build typing speed, spot mistakes quickly, and make learning exciting.',
      link: '/games',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#005F02]" />,
      badge: 'Your Journey',
      title: 'Progress, Streaks & Badges',
      description: 'Track your daily learning habits, celebrate milestones, and earn achievement badges saved securely on your device.',
      link: '/dashboard',
    },
  ]

  const studentTestimonials = [
    {
      name: 'Amina Bello',
      role: 'Career Switcher & Accountant',
      location: 'Lagos, Nigeria',
      quote: 'I had zero technical background and was intimidated by programming. CodeTutor explained Python in simple everyday words without confusing jargon. Being able to practice offline after work saved me so much on mobile data!',
      tag: 'Zero Tech Background',
    },
    {
      name: 'Kofi Mensah',
      role: 'First-Time Learner & Student',
      location: 'Accra, Ghana',
      quote: 'Internet at home is unpredictable and expensive. Having a friendly AI tutor that works completely offline on my old laptop means I can practice coding every evening without worrying about Wi-Fi or data bundles.',
      tag: '100% Offline Learner',
    },
    {
      name: 'Emmanuel Kiprono',
      role: 'High School Teacher & Coding Club Lead',
      location: 'Nairobi, Kenya',
      quote: 'The arcade games and step-by-step hints make learning fun and accessible for everyone. You do not need expensive computers or constant internet—anyone can just open their laptop and start learning.',
      tag: 'Teaching & Community',
    },
  ]

  const faqs = [
    {
      q: 'Do I need any programming experience or a tech background?',
      a: 'Not at all! CodeTutor Africa is made for everyone—complete beginners, school students, professionals switching careers, and anyone curious about technology. Everything is explained in plain, simple English with relatable examples from daily life.',
    },
    {
      q: 'Does CodeTutor Africa really work 100% without internet?',
      a: 'Yes! Once installed, the entire AI tutor, courses, practice sandbox, and arcade games run directly on your computer. You never need an internet connection, mobile data, or Wi-Fi to learn and practice.',
    },
    {
      q: 'Will it run smoothly on my regular everyday laptop?',
      a: 'Yes! CodeTutor Africa is designed for standard laptops (such as 8 GB RAM machines with basic processors). It is extremely lightweight and will not slow down your computer or overheat your battery.',
    },
    {
      q: 'Is this platform only for university students?',
      a: 'No! CodeTutor Africa is for everyone—high school students, self-taught beginners, working professionals, non-tech people, and university students alike. If you want to learn to code, this platform is for you.',
    },
    {
      q: 'Is CodeTutor Africa completely free?',
      a: 'Yes, 100% free forever. There are no subscriptions, no monthly charges, no API keys, and no advertisements.',
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
            <div className="w-10 h-10 rounded-full bg-white dark:bg-emerald-950/60 border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-emerald-500/50 transition-colors overflow-hidden">
              <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-black">Africa</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#005F02] dark:bg-emerald-400 inline-block animate-pulse" />
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-2.5 max-w-full px-4 overflow-x-auto">
          {heroSlides.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 backdrop-blur-md shrink-0 ${
                currentSlide === idx
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-lg scale-102'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentSlide === idx ? 'bg-white' : 'bg-slate-500'}`} />
              <span className="whitespace-nowrap">{slide.tag}</span>
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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005F02]/85 border border-emerald-400/40 text-emerald-100 text-xs font-semibold shadow-lg backdrop-blur-md"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>100% Offline AI Coding Tutor</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
          >
            Learn to Code with AI.{' '}
            <span className="text-[#005F02]">Simple, Friendly &amp; 100% Offline.</span>
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
                <span>Try Live Preview</span>
              </button>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs text-slate-300 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#005F02]" /> 100% Free &amp; Private
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#005F02]" /> Works Without Wi-Fi
            </span>
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-[#005F02]" /> Runs on Everyday Laptops
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
          <span className="font-bold tracking-wider">QUICK OVERVIEW</span>
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
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">100% Offline</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Zero data costs →</div>
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
                Instant
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">Fast Responses</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Directly on your laptop →</div>
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
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">Hands-On Lessons</div>
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
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] transition-colors">Friendly Modes</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Explain, Hint &amp; Quiz →</div>
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
          <span className="font-bold tracking-wider">ALL-IN-ONE LEARNING</span>
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
            <Sparkles className="w-3.5 h-3.5 text-[#005F02]" /> Everything in One Place
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Learn to Code
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Whether you are writing your first line of code, studying for exams, or learning new skills for work, CodeTutor guides you every step of the way.
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
          <span className="font-bold tracking-wider">TRY IT OUT</span>
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
            <Terminal className="w-3.5 h-3.5 text-[#005F02]" /> Interactive Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            See How Simple &amp; Friendly It Is
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Switch between Python, JavaScript, and Java to see how our friendly AI tutor explains concepts and guides you step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Code Editor Sandbox Preview */}
          <div className="space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1 shrink-0">
              <span>1. Simple Code Runner</span>
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
              <span>2. Helpful AI Tutor Chat</span>
              <span className="font-mono text-[11px] text-[#005F02] font-bold">Mode: Friendly Hint</span>
            </div>
            
            <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col flex-1">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#005F02] flex items-center justify-center text-white font-bold">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">CodeTutor AI Mentor</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Runs 100% On Your Computer</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#005F02]/10 text-[#005F02] border border-[#005F02]/30 font-bold">
                  ZERO INTERNET NEEDED
                </span>
              </div>

              {/* Quick Interactive Question Switcher */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-500 font-medium shrink-0">Try Asking:</span>
                <button
                  type="button"
                  onClick={() => setActiveQuestionTab(0)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                    activeQuestionTab === 0
                      ? 'bg-[#005F02] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
                  }`}
                >
                  Q1: Explain Variables
                </button>
                {codeExamples[activeCodeTab].alternateDialogue && (
                  <button
                    type="button"
                    onClick={() => setActiveQuestionTab(1)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                      activeQuestionTab === 1
                        ? 'bg-[#005F02] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
                    }`}
                  >
                    Q2: What-If Scenario
                  </button>
                )}
              </div>

              {/* Conversation Box (Synchronized with Active Language & Question) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCodeTab}-${activeQuestionTab}`}
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
                        <p className="font-medium">
                          {activeQuestionTab === 0
                            ? codeExamples[activeCodeTab].dialogue.student
                            : codeExamples[activeCodeTab].alternateDialogue?.student}
                        </p>
                      </div>
                    </div>

                    {/* AI Tutor Socratic Guidance */}
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-xs px-4 py-3.5 max-w-[92%] space-y-2.5 shadow-xs">
                        <p className="leading-relaxed">
                          {activeQuestionTab === 0
                            ? codeExamples[activeCodeTab].dialogue.ai
                            : codeExamples[activeCodeTab].alternateDialogue?.ai}
                        </p>
                        
                        <div className="p-3 rounded-xl bg-[#005F02]/10 dark:bg-slate-900 border border-[#005F02]/30 text-slate-800 dark:text-slate-300 text-xs">
                          <div className="font-bold flex items-center gap-1.5 mb-1 text-[#005F02]">
                            <Lightbulb className="w-3.5 h-3.5 text-[#005F02]" />
                            <span>Helpful Hint &amp; Question:</span>
                          </div>
                          <p className="italic text-slate-700 dark:text-slate-300">
                            "{activeQuestionTab === 0
                              ? codeExamples[activeCodeTab].dialogue.hint
                              : codeExamples[activeCodeTab].alternateDialogue?.hint}"
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
          <span className="font-bold tracking-wider">LEARNER STORIES</span>
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
            <Sparkles className="w-3.5 h-3.5 text-[#005F02]" /> Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by Learners of All Backgrounds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Hear from everyday beginners, students, teachers, and career switchers learning to code with zero internet limits.
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
                    <div className="text-sm sm:text-base font-extrabold text-[#005F02]">
                      {studentTestimonials[testimonialSlide].name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {studentTestimonials[testimonialSlide].role} • <span className="font-semibold text-slate-700 dark:text-slate-300">{studentTestimonials[testimonialSlide].location}</span>
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
          <span className="font-bold tracking-wider">LIGHT ON YOUR LAPTOP</span>
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
          SECTION 6: EVERYDAY LAPTOP PERFORMANCE (PLAIN & SIMPLE)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="specs" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005F02]/10 border border-[#005F02]/30 text-[#005F02] text-xs font-semibold font-mono">
            <Cpu className="w-3.5 h-3.5 text-[#005F02]" /> Works on Regular Laptops
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Runs Smoothly on Any Everyday Laptop
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            You do not need an expensive computer. CodeTutor is built to run easily and quietly on standard laptops:
          </p>
        </div>

        {/* Interconnected Linked Hardware Strip */}
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10 text-center">
            {[
              {
                title: 'Memory Friendly',
                val: 'Super Light',
                sub: 'Won\'t Slow Down Your Laptop',
                note: 'Leaves plenty of room for your code editor and web browser to run smoothly.',
              },
              {
                title: 'Instant Speed',
                val: 'No Waiting',
                sub: 'Fast Answers in Seconds',
                note: 'Get immediate explanations and hints without waiting on slow internet.',
              },
              {
                title: 'Battery Saver',
                val: 'Cool & Quiet',
                sub: 'Low Power Use',
                note: 'Study and practice for hours without draining your laptop battery.',
              },
              {
                title: '100% Private',
                val: 'Zero Data Spent',
                sub: 'Safe & Offline',
                note: 'Your lessons, code, and progress stay completely private on your device.',
              },
            ].map((spec, idx) => (
              <div
                key={idx}
                className="p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group"
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{spec.title}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#005F02] tracking-tight">{spec.val}</div>
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
            Everything you need to know about learning with CodeTutor Africa.
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
                Ready to Start Your Coding Journey?
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Join thousands of learners across Africa building real coding skills at their own pace. No internet required, no subscriptions, and completely free forever.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/dashboard">
                <button className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-[#005F02] hover:bg-slate-100 shadow-md transition-colors flex items-center gap-2">
                  <span>Start Learning Free</span>
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
              <div className="w-10 h-10 rounded-full bg-white dark:bg-emerald-950/60 border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-black">Africa</span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Free Offline-First AI Coding Tutor for Everyone</p>
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
            <span>© 2026 CodeTutor Africa. Built with ❤️ for everyone across Africa.</span>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#005F02]" /> 100% Offline
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#005F02]" /> Local AI Engine
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#005F02]" /> Zero Internet Costs
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
