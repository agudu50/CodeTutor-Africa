import React, { useState, useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTheme } from '@/app/providers/ThemeProvider'
import {
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
  Bot,
} from 'lucide-react'

function StarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function MapPinIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

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
    lang: 'html',
    filename: 'index.html',
    badge: 'Web Dev • HTML, CSS & JS',
    code: `<!-- Interactive Offline Web Component -->
<style>
  .btn { background: #005F02; color: white; border-radius: 8px; padding: 6px 14px; }
  .btn:hover { opacity: 0.9; cursor: pointer; }
</style>

<button class="btn" id="likeBtn">Like (0)</button>

<script>
  let count = 0;
  document.getElementById("likeBtn").onclick = () => {
    count++;
    document.getElementById("likeBtn").innerText = "Liked (" + count + ")";
  };
</script>`,
    output: `> DOM Loaded & Script Executed:
[Rendered] <button class="btn">Like (0)</button>
[Click Event] Registered on #likeBtn -> count: 1
"Liked (1)" updated on screen instantly
[✓ Web Page rendered in 8ms • 100% Offline]`,
    dialogue: {
      student: 'How do HTML, CSS, and JavaScript work together here?',
      ai: 'HTML defines the button structure, CSS paints it green with rounded corners, and JavaScript listens for clicks to increase the like count dynamically!',
      hint: 'What line of CSS would you change to make the button text bigger or bold?',
      latency: 'Instant: 28ms',
      verified: 'Runs 100% Offline',
    },
    alternateDialogue: {
      student: 'Do I need internet or a web server to build HTML websites on CodeTutor?',
      ai: 'No internet or servers needed! Browsers can read and run HTML, CSS, and JavaScript directly from your computer files.',
      hint: 'Notice how the click handler updates document.getElementById() with 0 KB data cost!',
    },
  },
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
  // Check for HTML comment <!-- ... -->
  if (lineText.trim().startsWith('<!--') || lineText.trim().endsWith('-->')) {
    return (
      <div key={lineIndex} className="table-row leading-relaxed">
        <span className="table-cell pr-3 select-none text-slate-500 text-right w-6 font-mono text-[11px]">{lineIndex + 1}</span>
        <span className="table-cell font-mono text-[#6A9955] italic">{lineText}</span>
      </div>
    )
  }

  // Check for line comments (# or //)
  const commentIdx = lineText.search(/(#|\/\/)/)
  let codePart = lineText
  let commentPart = ''
  if (commentIdx !== -1) {
    codePart = lineText.substring(0, commentIdx)
    commentPart = lineText.substring(commentIdx)
  }

  // Tokenize codePart with VS Code Dark+ color palette
  const tokenRegex = /("(?:\\.|[^"\\])*")|(<(?:\/)?[a-zA-Z0-9]+(?:\s|>|\/)|<\/?[a-zA-Z0-9]+>)|(\b(?:def|let|const|function|if|not|return|print|console|Promise|public|class|private|double|void|throw|new|this|document|getElementById|innerText|onclick)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*(?=\s*\())|(\b[A-Z]\w*\b)|([a-zA-Z_]\w*)|([^\s\w"']+|\s+)/g
  const tokens: React.ReactNode[] = []
  let match
  let k = 0

  while ((match = tokenRegex.exec(codePart)) !== null) {
    const [full, str, htmlTag, kw, num, fn, typeCls, ident, symbol] = match
    if (str) {
      tokens.push(<span key={k++} className="text-[#CE9178]">{str}</span>)
    } else if (htmlTag) {
      tokens.push(<span key={k++} className="text-[#569CD6] font-semibold">{htmlTag}</span>)
    } else if (kw) {
      const isControl = /^(if|not|return|throw|new)$/.test(kw)
      const isJsDom = /^(document|getElementById|innerText|onclick)$/.test(kw)
      tokens.push(
        <span
          key={k++}
          className={
            isControl
              ? "text-[#C586C0] font-semibold"
              : isJsDom
              ? "text-[#4EC9B0] font-medium"
              : "text-[#569CD6] font-semibold"
          }
        >
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
  onManualSelect: (tab: number) => void
  autoAdvanceProgress: number
  isAutoAdvancing: boolean
  toggleAutoAdvance: () => void
}

const TerminalLivePreview: React.FC<TerminalLivePreviewProps> = memo(({
  activeTab,
  onManualSelect,
  autoAdvanceProgress,
  isAutoAdvancing,
  toggleAutoAdvance,
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
      idx += 8
      if (idx >= targetCode.length) {
        setDisplayedCode(targetCode)
        setIsRunning(false)
        clearInterval(interval)
      } else {
        setDisplayedCode(targetCode.slice(0, idx))
      }
    }, 10)
    return () => clearInterval(interval)
  }, [activeTab])

  const handleRunCode = () => {
    setIsRunning(true)
    setShowOutput(true)
    setTimeout(() => {
      setIsRunning(false)
    }, 300)
  }

  const getLangDotColor = (lang: string) => {
    switch (lang) {
      case 'html':
        return 'bg-[#e44d26]'
      case 'python':
        return 'bg-[#387eb8]'
      case 'javascript':
        return 'bg-[#f7df1e]'
      case 'java':
        return 'bg-[#f89820]'
      default:
        return 'bg-[#005F02]'
    }
  }

  return (
    <div className="h-[520px] sm:h-[550px] flex flex-col justify-between rounded-3xl border border-slate-700/80 bg-[#18181b] shadow-2xl overflow-hidden font-mono text-xs text-left relative">
      {/* Visual Auto-Advance Progress Line */}
      {isAutoAdvancing && (
        <div className="absolute top-0 inset-x-0 h-1 bg-slate-800 z-20 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#005F02] via-emerald-400 to-[#005F02]"
            style={{ width: `${autoAdvanceProgress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      )}

      {/* Code Editor Tab Bar (Enhanced VS Code Style) */}
      <div className="flex flex-wrap items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#202023] border-b border-[#2d2d30] shrink-0 gap-2 sm:gap-3">
        {/* Left: Traffic Lights & Language Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {/* macOS Traffic Light Dots */}
          <div className="hidden sm:flex items-center gap-1.5 mr-1 shrink-0">
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
                  onClick={() => onManualSelect(i)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1.5 sm:gap-2 relative ${
                    isActive
                      ? 'bg-[#18181b] text-white shadow-md border border-[#3f3f46] border-b-2 border-b-[#005F02]'
                      : 'bg-[#27272a]/70 text-slate-400 border border-transparent hover:bg-[#323238] hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? `${getLangDotColor(ex.lang)} animate-pulse` : 'bg-slate-600'}`} />
                  <span className="whitespace-nowrap">{ex.filename}</span>
                  {isActive && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#005F02]/30 text-emerald-400 font-extrabold uppercase">
                      Live
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Controls & Offline Status */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleAutoAdvance}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-700 transition-colors"
            title={isAutoAdvancing ? 'Click to Pause Auto-Switch' : 'Click to Resume Auto-Switch'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAutoAdvancing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isAutoAdvancing ? 'Auto: ON' : 'Auto: PAUSED'}</span>
          </button>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-3 py-1 rounded-lg bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3 h-3 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* VS Code Editor Body (Fixed Scrollable Area with Zero Layout Shift) */}
      <div className="p-3.5 sm:p-5 overflow-x-auto overflow-y-auto flex-1 min-h-0 bg-[#18181b] text-[#D4D4D4] leading-relaxed font-mono">
        <div className="table w-full text-xs sm:text-[13px]">
          {displayedCode.split('\n').map((line, lIdx) => renderVSCodeTokens(line, lIdx))}
        </div>
        {isRunning && (
          <span className="inline-block w-2 h-4 bg-[#005F02] animate-pulse ml-1 align-middle" />
        )}
      </div>

      {/* Interactive Terminal Output Drawer (Fixed Height) */}
      {showOutput && (
        <div className="h-[110px] sm:h-[120px] shrink-0 flex flex-col justify-between px-3.5 sm:px-4 py-2.5 bg-[#111113] border-t border-[#27272a] font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-[#27272a] shrink-0">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Terminal className="w-3.5 h-3.5" /> Console Output
            </span>
            <span className="text-[10px] text-slate-500 font-bold">100% Offline • Zero Data</span>
          </div>
          <div className="text-emerald-300 whitespace-pre-wrap leading-relaxed text-[11px] font-mono overflow-y-auto flex-1 pt-1">
            {isRunning ? (
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Executing {codeExamples[activeTab].filename} locally...
              </span>
            ) : (
              codeExamples[activeTab].output
            )}
          </div>
        </div>
      )}

      {/* Live AI Guidance Bar (Fixed Height) */}
      <div className="h-[36px] sm:h-[38px] px-3.5 sm:px-4 py-2 bg-[#202023] border-t border-[#2d2d30] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-slate-200 font-bold shrink-0">Helpful Hint:</span>
          <span className="text-slate-400 truncate">Runs locally on your laptop (0 KB internet needed)</span>
        </div>
        <span className="text-emerald-400 font-bold font-mono text-[10px] shrink-0 ml-2">Instant Speed</span>
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
    { top: '8%', left: '12%', size: 8, duration: 7, delay: 0 },
    { top: '18%', left: '84%', size: 10, duration: 9, delay: 1 },
    { top: '32%', left: '25%', size: 7, duration: 8, delay: 2 },
    { top: '45%', left: '75%', size: 9, duration: 10, delay: 0.5 },
    { top: '58%', left: '15%', size: 8, duration: 8.5, delay: 1.5 },
    { top: '70%', left: '88%', size: 11, duration: 9.5, delay: 2.5 },
    { top: '82%', left: '35%', size: 7, duration: 7.5, delay: 3 },
    { top: '90%', left: '68%', size: 10, duration: 11, delay: 1 },
    { top: '25%', left: '50%', size: 6, duration: 8, delay: 1.8 },
    { top: '65%', left: '45%', size: 8, duration: 9, delay: 0.8 },
    { top: '40%', left: '8%', size: 7, duration: 10, delay: 2.2 },
    { top: '78%', left: '92%', size: 9, duration: 8.2, delay: 1.2 },
  ]

  const floatingBadges = [
    { text: '0 KB Internet', top: '12%', left: '6%', delay: 0 },
    { text: 'def learn_python():', top: '24%', right: '8%', delay: 1.5 },
    { text: 'RAM <= 1.4 GB', top: '42%', left: '8%', delay: 2 },
    { text: '✓ 100% Offline AI', top: '55%', right: '6%', delay: 0.8 },
    { text: 'Fast Local Neural CPU', top: '74%', left: '5%', delay: 2.5 },
    { text: 'class CodeTutor()', top: '86%', right: '9%', delay: 1.2 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Vibrant Ambient Glow Orb 1 - Top Left */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.35, 0.9, 1],
          opacity: [0.45, 0.8, 0.45],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-5 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#005F02]/30 via-emerald-500/20 to-transparent dark:from-[#005F02]/45 dark:via-emerald-400/25 dark:to-transparent blur-3xl"
      />

      {/* Vibrant Ambient Glow Orb 2 - Middle Right */}
      <motion.div
        animate={{
          x: [0, -90, 60, 0],
          y: [0, 70, -60, 0],
          scale: [1, 1.3, 0.95, 1],
          opacity: [0.4, 0.75, 0.4],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[30%] right-0 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-emerald-600/25 via-[#005F02]/25 to-transparent dark:from-emerald-400/35 dark:via-[#005F02]/35 dark:to-transparent blur-3xl"
      />

      {/* Vibrant Ambient Glow Orb 3 - Lower Left */}
      <motion.div
        animate={{
          x: [0, 70, -70, 0],
          y: [0, -70, 60, 0],
          scale: [1, 1.25, 0.9, 1],
          opacity: [0.45, 0.85, 0.45],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute top-[60%] left-0 w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-[#005F02]/35 via-emerald-600/20 to-transparent dark:from-[#005F02]/50 dark:via-emerald-500/30 dark:to-transparent blur-3xl"
      />

      {/* Vibrant Ambient Glow Orb 4 - Bottom Center */}
      <motion.div
        animate={{
          x: [0, -60, 50, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.3, 1, 1],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 4.5 }}
        className="absolute bottom-5 right-1/4 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-[#005F02]/30 via-emerald-500/20 to-transparent dark:from-[#005F02]/40 dark:via-emerald-400/25 dark:to-transparent blur-3xl"
      />

      {/* Floating Animated Code Badges */}
      {floatingBadges.map((badge, idx) => (
        <motion.div
          key={idx}
          style={{ top: badge.top, left: badge.left, right: badge.right }}
          animate={{
            y: [0, -22, 0],
            opacity: [0.3, 0.75, 0.3],
          }}
          transition={{
            duration: 7 + idx,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: badge.delay,
          }}
          className="absolute hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-[#005F02]/25 dark:border-emerald-500/30 shadow-md backdrop-blur-md text-[11px] font-mono font-bold text-[#005F02] dark:text-emerald-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
          <span>{badge.text}</span>
        </motion.div>
      ))}

      {/* Floating Glowing Particle Matrix */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{
            y: [0, -75, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.5, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
          className="absolute rounded-full bg-[#005F02] dark:bg-emerald-400 shadow-[0_0_14px_#005F02] dark:shadow-[0_0_16px_#34d399]"
        />
      ))}

      {/* Layer 1: High-Contrast Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#005f022e_1.5px,transparent_1.5px),linear-gradient(to_bottom,#005f022e_1.5px,transparent_1.5px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_85%_65%_at_50%_50%,#000_75%,transparent_100%)] opacity-90" />

      {/* Layer 2: Dot Mesh Matrix */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-45 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_65%,transparent_100%)]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,95,2,0.6) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />
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
  const [isCodeAutoActive, setIsCodeAutoActive] = useState(true)
  const [codeProgress, setCodeProgress] = useState(0)
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

  // Smooth Auto-advance for Code IDE & AI Tutor Sandbox (4s cycle with progress bar)
  useEffect(() => {
    if (!isCodeAutoActive) {
      setCodeProgress(0)
      return
    }
    const intervalMs = 40
    const totalMs = 4200
    const step = (intervalMs / totalMs) * 100

    const timer = setInterval(() => {
      setCodeProgress((prev) => {
        if (prev + step >= 100) {
          setActiveCodeTab((curr) => (curr + 1) % codeExamples.length)
          return 0
        }
        return prev + step
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [isCodeAutoActive])

  const handleManualCodeSelect = (tabIdx: number) => {
    setActiveCodeTab(tabIdx)
    setCodeProgress(0)
  }

  const toggleCodeAutoAdvance = () => {
    setIsCodeAutoActive((prev) => !prev)
  }

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
      icon: <Bot className="w-6 h-6 text-[#005F02] dark:text-emerald-400" />,
      badge: 'Personal AI Tutor',
      title: '6 Friendly Learning Modes',
      description: 'Ask questions in plain English. Get simple explanations, gentle hints, error help, code reviews, and quick quizzes that help you truly understand.',
      link: '/tutor',
      actionLabel: 'Launch AI Tutor',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#005F02] dark:text-emerald-400" />,
      badge: 'Step-by-Step',
      title: 'Beginner to Pro Courses',
      description: 'Learn Python, JavaScript, and Java through structured, bite-sized lessons. Perfect for absolute beginners, students, and career changers alike.',
      link: '/learning',
      actionLabel: 'Browse All Courses',
    },
    {
      icon: <Code2 className="w-6 h-6 text-[#005F02] dark:text-emerald-400" />,
      badge: 'Try It Out',
      title: 'Interactive Code Playground',
      description: 'Practice what you learn right inside your browser. Run programs instantly on your laptop without setting up complex tools or servers.',
      link: '/practice',
      actionLabel: 'Open Code Lab',
    },
    {
      icon: <Bug className="w-6 h-6 text-[#005F02] dark:text-emerald-400" />,
      badge: 'Error Helper',
      title: 'Plain-English Bug Fixer',
      description: 'Confused by an error message? Paste your code and the AI tutor explains what went wrong and how to fix it in simple everyday language.',
      link: '/debugger',
      actionLabel: 'Debug My Code',
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-[#005F02] dark:text-emerald-400" />,
      badge: 'Fun & Games',
      title: 'Arcade Coding Mini-Games',
      description: 'Play fun games like Syntax Speedrun and Bug Hunter to build typing speed, spot mistakes quickly, and make learning exciting.',
      link: '/games',
      actionLabel: 'Play Arcade Games',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-[#005F02] dark:text-emerald-400" />,
      badge: 'Your Journey',
      title: 'Progress, Streaks & Badges',
      description: 'Track your daily learning habits, celebrate milestones, and earn achievement badges saved securely on your device.',
      link: '/dashboard',
      actionLabel: 'View Dashboard',
    },
  ]

  const studentTestimonials = [
    {
      name: 'Amina Bello',
      role: 'Career Switcher & Accountant',
      location: 'Lagos, Nigeria',
      image: '/images/testimonials/amina.jpg',
      quote: 'I had zero technical background and was intimidated by programming. CodeTutor explained Python in simple everyday words without confusing jargon. Being able to practice offline after work saved me so much on mobile data!',
      tag: 'Zero Tech Background',
    },
    {
      name: 'Kofi Mensah',
      role: 'First-Time Learner & Student',
      location: 'Accra, Ghana',
      image: '/images/testimonials/kofi.jpg',
      quote: 'Internet at home is unpredictable and expensive. Having a friendly AI tutor that works completely offline on my old laptop means I can practice coding every evening without worrying about Wi-Fi or data bundles.',
      tag: '100% Offline Learner',
    },
    {
      name: 'Emmanuel Kiprono',
      role: 'High School Teacher & Coding Club Lead',
      location: 'Nairobi, Kenya',
      image: '/images/testimonials/emmanuel.jpg',
      quote: 'The arcade games and step-by-step hints make learning fun and accessible for everyone. You do not need expensive computers or constant internet—anyone can just open their laptop and start learning.',
      tag: 'Teaching & Community',
    },
    {
      name: 'Fatima Diop',
      role: 'Self-Taught Web Developer',
      location: 'Dakar, Senegal',
      image: '/images/testimonials/fatima.jpg',
      quote: 'Building HTML, CSS, and JavaScript projects without needing an internet connection helped me build confidence quickly. The AI tutor explains tricky bugs patiently without making me feel bad for asking questions.',
      tag: 'Aspiring Web Developer',
    },
    {
      name: 'Thabo Molefe',
      role: 'Career Changer & Logistics Lead',
      location: 'Johannesburg, South Africa',
      image: '/images/testimonials/thabo.jpg',
      quote: 'I wanted to learn Java to automate inventory tools at my workplace. The instant offline feedback and bite-sized lessons made learning possible during my commute and late nights.',
      tag: 'Hands-On Problem Solver',
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

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl px-4 py-5 space-y-3 shadow-2xl"
            >
              {/* Quick Offline Status Bar */}
              <div className="p-2.5 rounded-xl bg-[#005F02]/10 dark:bg-emerald-950/50 border border-[#005F02]/20 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#005F02] dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                  Local AI Engine
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">100% Offline</span>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-[#005F02] transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <button className="w-full py-3 rounded-xl text-xs font-extrabold bg-[#005F02] hover:bg-[#004e02] text-white shadow-md flex items-center justify-center gap-2">
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <button className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    Sign In
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
        className="relative min-h-[560px] sm:min-h-[660px] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
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
          className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-[#005F02] hover:border-[#005F02] transition-colors shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/90 text-white border border-slate-700 hover:bg-[#005F02] hover:border-[#005F02] transition-colors shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        {/* Current Slide Tag Badge */}
        <div className="absolute top-6 left-6 sm:left-12 z-20 hidden sm:block">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#005F02] text-white border border-[#005F02] text-xs font-mono shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-semibold">{heroSlides[currentSlide].tag}</span>
          </span>
        </div>

        {/* Mobile Slide Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex sm:hidden items-center gap-1.5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Interactive Linked Slide Mini-Cards at Bottom of Hero (Desktop/Tablet) */}
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
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 py-14 sm:py-20 space-y-5 sm:space-y-6">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#005F02]/85 border border-emerald-400/40 text-emerald-100 text-[11px] sm:text-xs font-semibold shadow-lg backdrop-blur-md"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Zap className="w-3.5 h-3.5 text-emerald-300" />
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
            className="text-xs sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto"
          >
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-102">
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold bg-slate-900/90 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
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
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 text-[11px] sm:text-xs text-slate-300 font-medium"
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
        <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-emerald-500/20 shadow-xl dark:shadow-[0_10px_35px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Top Subtle Ambient Border Light */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#005F02]/50 dark:via-emerald-400/50 to-transparent" />

          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-0 divide-x sm:divide-x divide-slate-200/80 dark:divide-slate-800/80 text-center">
            
            {/* Stat Card 1 -> Links to #specs */}
            <a
              href="#specs"
              className="p-6 sm:p-7 space-y-3 hover:bg-gradient-to-b hover:from-[#005F02]/[0.05] hover:to-transparent dark:hover:from-[#005F02]/[0.15] transition-all duration-300 group block focus:outline-hidden relative"
            >
              {/* Category Pill Tag */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#005F02]/10 dark:bg-emerald-500/10 text-[#005F02] dark:text-emerald-400 border border-[#005F02]/20 dark:border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                  Air-Gapped
                </span>
              </div>

              {/* Icon Tile */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#005F02]/15 to-emerald-500/10 dark:from-[#005F02]/30 dark:to-emerald-400/10 border border-[#005F02]/30 dark:border-emerald-500/30 text-[#005F02] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(0,95,2,0.3)] transition-all duration-300">
                <Shield className="w-5 h-5" />
              </div>

              {/* Stat Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                {statOffline}%
              </div>

              {/* Label & Action */}
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  100% Offline
                </div>
                <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                  <span>Zero data costs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Stat Card 2 -> Links to #specs */}
            <a
              href="#specs"
              className="p-6 sm:p-7 space-y-3 hover:bg-gradient-to-b hover:from-[#005F02]/[0.05] hover:to-transparent dark:hover:from-[#005F02]/[0.15] transition-all duration-300 group block focus:outline-hidden relative"
            >
              {/* Category Pill Tag */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#005F02]/10 dark:bg-emerald-500/10 text-[#005F02] dark:text-emerald-400 border border-[#005F02]/20 dark:border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                  Zero Latency
                </span>
              </div>

              {/* Icon Tile */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#005F02]/15 to-emerald-500/10 dark:from-[#005F02]/30 dark:to-emerald-400/10 border border-[#005F02]/30 dark:border-emerald-500/30 text-[#005F02] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(0,95,2,0.3)] transition-all duration-300">
                <Zap className="w-5 h-5" />
              </div>

              {/* Stat Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                Instant
              </div>

              {/* Label & Action */}
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Fast Responses
                </div>
                <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                  <span>Directly on your laptop</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Stat Card 3 -> Links to #features */}
            <a
              href="#features"
              className="p-6 sm:p-7 space-y-3 hover:bg-gradient-to-b hover:from-[#005F02]/[0.05] hover:to-transparent dark:hover:from-[#005F02]/[0.15] transition-all duration-300 group block focus:outline-hidden relative"
            >
              {/* Category Pill Tag */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#005F02]/10 dark:bg-emerald-500/10 text-[#005F02] dark:text-emerald-400 border border-[#005F02]/20 dark:border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                  Comprehensive
                </span>
              </div>

              {/* Icon Tile */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#005F02]/15 to-emerald-500/10 dark:from-[#005F02]/30 dark:to-emerald-400/10 border border-[#005F02]/30 dark:border-emerald-500/30 text-[#005F02] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(0,95,2,0.3)] transition-all duration-300">
                <Code2 className="w-5 h-5" />
              </div>

              {/* Stat Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                {statExercises}+
              </div>

              {/* Label & Action */}
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Hands-On Lessons
                </div>
                <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                  <span>Python, JS &amp; Java</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Stat Card 4 -> Links to #demo */}
            <a
              href="#demo"
              className="p-6 sm:p-7 space-y-3 hover:bg-gradient-to-b hover:from-[#005F02]/[0.05] hover:to-transparent dark:hover:from-[#005F02]/[0.15] transition-all duration-300 group block focus:outline-hidden relative"
            >
              {/* Category Pill Tag */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#005F02]/10 dark:bg-emerald-500/10 text-[#005F02] dark:text-emerald-400 border border-[#005F02]/20 dark:border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                  Socratic AI
                </span>
              </div>

              {/* Icon Tile */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#005F02]/15 to-emerald-500/10 dark:from-[#005F02]/30 dark:to-emerald-400/10 border border-[#005F02]/30 dark:border-emerald-500/30 text-[#005F02] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(0,95,2,0.3)] transition-all duration-300">
                <Bot className="w-5 h-5" />
              </div>

              {/* Stat Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                {statModes}
              </div>

              {/* Label & Action */}
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Friendly Modes
                </div>
                <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                  <span>Explain, Hint &amp; Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
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
            <Zap className="w-3.5 h-3.5 text-[#005F02]" /> Everything in One Place
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Learn to Code
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Whether you are writing your first line of code, studying for exams, or learning new skills for work, CodeTutor guides you every step of the way.
          </p>
        </div>

        {/* Linked Glassmorphism Features Container */}
        <div className="relative rounded-3xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/90 dark:border-emerald-500/20 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
          {/* Top Subtle Ambient Border Light */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#005F02]/40 dark:via-emerald-400/40 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                className="relative bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-[#005F02] dark:hover:border-emerald-500/60 hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,95,2,0.25)] hover:-translate-y-1 transition-all duration-300 group block overflow-hidden"
              >
                {/* Top Subtle Hover Highlight Beam */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#005F02] dark:via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Header Row: Floating 3D Icon Tile + Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#005F02]/15 via-emerald-500/10 to-transparent dark:from-[#005F02]/30 dark:via-emerald-400/15 border border-[#005F02]/30 dark:border-emerald-500/30 flex items-center justify-center text-[#005F02] dark:text-emerald-400 shadow-2xs group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(0,95,2,0.35)] transition-all duration-300">
                    {card.icon}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase px-3 py-1 rounded-full border border-[#005F02]/20 dark:border-emerald-500/25 bg-[#005F02]/10 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                    {card.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed min-h-[48px]">
                    {card.description}
                  </p>
                </div>

                {/* Card Action Link Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#005F02] dark:text-emerald-400">
                  <span>{card.actionLabel}</span>
                  <div className="w-7 h-7 rounded-xl bg-[#005F02]/10 dark:bg-emerald-500/15 flex items-center justify-center group-hover:bg-[#005F02] group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-slate-950 transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
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
            Switch between Web Development (HTML, CSS &amp; JS), Python, JavaScript, and Java to see how our friendly AI tutor explains concepts and guides you step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Code Editor Sandbox Preview */}
          <div className="space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#005F02] dark:bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white">1. Live Code Runner</span>
              </div>
              <span className="font-mono text-[11px] text-[#005F02] dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded-md bg-[#005F02]/10 dark:bg-emerald-500/10 border border-[#005F02]/20">
                {codeExamples[activeCodeTab].badge}
              </span>
            </div>
            <TerminalLivePreview
              activeTab={activeCodeTab}
              onManualSelect={handleManualCodeSelect}
              autoAdvanceProgress={codeProgress}
              isAutoAdvancing={isCodeAutoActive}
              toggleAutoAdvance={toggleCodeAutoAdvance}
            />
          </div>

          {/* Right: Socratic Dialogue Simulator */}
          <div className="space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white">2. Helpful AI Tutor Chat</span>
              </div>
              <span className="font-mono text-[11px] text-[#005F02] dark:text-emerald-400 font-bold">Mode: Socratic Hint</span>
            </div>
            
            <div className="h-[520px] sm:h-[550px] relative bg-white/95 dark:bg-slate-900/85 rounded-3xl border border-slate-200/90 dark:border-emerald-500/20 backdrop-blur-2xl shadow-xl dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col justify-between">
              {/* Top Highlight Beam */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#005F02]/50 dark:via-emerald-400/50 to-transparent" />

              {/* Chat Header */}
              <div className="flex items-center justify-between gap-2 px-3.5 sm:px-5 py-3 sm:py-3.5 bg-slate-100/90 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#005F02] to-emerald-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                    <Bot className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">CodeTutor AI Mentor</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">100% Offline • 0ms Lag</div>
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#005F02]/10 dark:bg-emerald-500/15 text-[#005F02] dark:text-emerald-300 border border-[#005F02]/30 dark:border-emerald-500/30 font-bold shrink-0 whitespace-nowrap">
                  Zero Data
                </span>
              </div>

              {/* Quick Interactive Question Switcher */}
              <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold shrink-0">Explore:</span>
                <button
                  type="button"
                  onClick={() => setActiveQuestionTab(0)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                    activeQuestionTab === 0
                      ? 'bg-[#005F02] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
                  }`}
                >
                  Q1: Explain Concept
                </button>
                {codeExamples[activeCodeTab].alternateDialogue && (
                  <button
                    type="button"
                    onClick={() => setActiveQuestionTab(1)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                      activeQuestionTab === 1
                        ? 'bg-[#005F02] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#005F02]'
                    }`}
                  >
                    Q2: What-If Deep Dive
                  </button>
                )}
              </div>

              {/* Conversation Box (Synchronized with Active Language & Question with Zero Layout Shift) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCodeTab}-${activeQuestionTab}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 space-y-3 sm:space-y-4 text-xs sm:text-sm flex-1 flex flex-col justify-between overflow-y-auto min-h-0"
                >
                  <div className="space-y-4">
                    {/* Student Question */}
                    <div className="flex justify-end">
                      <div className="bg-[#005F02] dark:bg-emerald-700 text-white rounded-3xl rounded-tr-xs px-4 sm:px-5 py-3 max-w-[88%] space-y-1 shadow-sm">
                        <div className="text-[10px] font-mono opacity-80 uppercase tracking-wider font-bold">Learner Question</div>
                        <p className="font-semibold leading-relaxed">
                          {activeQuestionTab === 0
                            ? codeExamples[activeCodeTab].dialogue.student
                            : codeExamples[activeCodeTab].alternateDialogue?.student}
                        </p>
                      </div>
                    </div>

                    {/* AI Tutor Socratic Guidance */}
                    <div className="flex justify-start">
                      <div className="bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-200 rounded-3xl rounded-tl-xs px-4 sm:px-5 py-4 max-w-[94%] space-y-3 shadow-xs">
                        <div className="text-[10px] font-mono text-[#005F02] dark:text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Mentor Guidance</span>
                        </div>
                        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                          {activeQuestionTab === 0
                            ? codeExamples[activeCodeTab].dialogue.ai
                            : codeExamples[activeCodeTab].alternateDialogue?.ai}
                        </p>
                        
                        <div className="p-3.5 rounded-2xl bg-[#005F02]/10 dark:bg-emerald-950/40 border border-[#005F02]/25 dark:border-emerald-500/30 text-slate-800 dark:text-slate-200 text-xs space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-[#005F02] dark:text-emerald-300">
                            <Lightbulb className="w-3.5 h-3.5" />
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

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2 shrink-0">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
                      <Zap className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                      <span>{codeExamples[activeCodeTab].dialogue.latency}</span>
                    </span>
                    <span className="text-[#005F02] dark:text-emerald-400 font-bold">
                      ✓ {codeExamples[activeCodeTab].dialogue.verified}
                    </span>
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
            <Quote className="w-3.5 h-3.5 text-[#005F02]" /> Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by Learners of All Backgrounds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Hear from everyday beginners, students, teachers, and career switchers learning to code with zero internet limits.
          </p>
        </div>

        {/* Featured Testimonial Slideshow Box */}
        <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-emerald-500/20 p-6 sm:p-10 shadow-xl dark:shadow-2xl overflow-hidden min-h-[340px] sm:min-h-[310px] flex flex-col justify-between">
          {/* Top Subtle Accent Beam */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#005F02]/50 dark:via-emerald-400/50 to-transparent" />

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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4 pr-16 sm:pr-24">
                {/* 5 Stars Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#005F02] dark:text-emerald-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#005F02]/30 dark:text-emerald-400/30 shrink-0" />
                </div>

                {/* Learner Quote */}
                <blockquote className="text-base sm:text-xl md:text-2xl text-slate-800 dark:text-slate-100 font-medium italic leading-relaxed">
                  "{studentTestimonials[testimonialSlide].quote}"
                </blockquote>
              </div>

              {/* Author Profile Footer */}
              <div className="pt-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={studentTestimonials[testimonialSlide].image}
                      alt={studentTestimonials[testimonialSlide].name}
                      className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl object-cover border-2 border-[#005F02]/40 dark:border-emerald-500/40 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#005F02] dark:bg-emerald-400 border-2 border-white dark:border-slate-900" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      {studentTestimonials[testimonialSlide].name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span>{studentTestimonials[testimonialSlide].role}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                        {studentTestimonials[testimonialSlide].location}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[#005F02]/10 dark:bg-emerald-500/15 text-[#005F02] dark:text-emerald-300 border border-[#005F02]/30 dark:border-emerald-500/30">
                  {studentTestimonials[testimonialSlide].tag}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Interactive Thumbnail Selector Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-6 mt-2 overflow-x-auto no-scrollbar">
            {studentTestimonials.map((student, idx) => {
              const isCurrent = testimonialSlide === idx
              return (
                <button
                  key={student.name}
                  type="button"
                  onClick={() => setTestimonialSlide(idx)}
                  className={`px-2.5 py-1.5 rounded-2xl border transition-all flex items-center gap-2 shrink-0 ${
                    isCurrent
                      ? 'bg-[#005F02] text-white border-[#005F02] shadow-md scale-102'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#005F02]/50'
                  }`}
                  aria-label={`Show testimonial from ${student.name}`}
                >
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                  <span className="text-[11px] font-bold whitespace-nowrap">{student.name.split(' ')[0]}</span>
                </button>
              )
            })}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-0 divide-x sm:divide-x divide-slate-200 dark:divide-white/10 text-center">
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
                className="p-4 sm:p-6 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group"
              >
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{spec.title}</div>
                <div className="text-xl sm:text-3xl font-extrabold text-[#005F02] tracking-tight">{spec.val}</div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">{spec.sub}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/[0.06]">{spec.note}</div>
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
          <div className="bg-[#005F02] rounded-3xl p-6 sm:p-12 text-center text-white shadow-xl space-y-6 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Start Your Coding Journey?
              </h2>
              <p className="text-xs sm:text-base text-white/90 leading-relaxed">
                Join thousands of learners across Africa building real coding skills at their own pace. No internet required, no subscriptions, and completely free forever.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
              <Link to="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-[#005F02] hover:bg-slate-100 shadow-md transition-colors flex items-center justify-center gap-2">
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold bg-[#004e02] hover:bg-[#003e02] text-white border border-white/20 transition-colors">
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
            <span>© 2026 CodeTutor Africa. Built with care for everyone across Africa.</span>
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
