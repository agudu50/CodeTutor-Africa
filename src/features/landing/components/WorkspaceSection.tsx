import React, { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import {
  Code2,
  Bot,
  Bug,
  BookOpen,
  Sparkles,
  Play,
  Check,
  Copy,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { LightSectionBackground } from './LightSectionBackground'
import { SectionReveal } from './SectionReveal'
import { StepConnector } from './StepConnector'

const featureTabs = {
  tutor: {
    title: 'Helpful AI Tutor',
    subtitle: 'A patient, friendly guide that helps you think step-by-step without stress',
    badge: 'Private & Socratic',
    filename: 'countdown.py',
    language: 'Python',
    codeSnippet: `# Counting down to blast off!
def countdown(n: int):
    if n <= 0:  # Base Case: stop at zero
        print("Blast off!")
        return
    print(f"Counting: {n}")
    countdown(n - 1)  # Recursive call

countdown(3)`,
    runOutput: `Counting: 3\nCounting: 2\nCounting: 1\nBlast off!`,
    studentQuery: 'How does the countdown function know when to stop calling itself?',
    aiResponse: 'Great question! Notice how each call counts down until it hits n <= 0. That condition is your Base Case — it keeps recursion safe and prevents stack overflows.',
    conceptChip: 'Key Concept: The Base Case tells the recursive call stack when to return',
    stats: 'Instant answers on your laptop (0ms delay)',
  },
  practice: {
    title: 'Hands-On Code Practice',
    subtitle: 'Write real code and get instant, encouraging feedback on your logic',
    badge: 'Zero Internet Tests',
    filename: 'array_utils.js',
    language: 'JavaScript',
    codeSnippet: `// Flatten nested lists and remove duplicates
function flattenAndUnique(arr) {
  const flattened = arr.flat(Infinity);
  return [...new Set(flattened)].sort((a, b) => a - b);
}

console.log(flattenAndUnique([1, [2, [3, 2]], [4, 1]]));`,
    runOutput: `Test 1: [1, [2, [3, 2]], [4, 1]] -> [1, 2, 3, 4] (Passed)\nTest 2: [[10, 20], 10] -> [10, 20] (Passed)\nAll 2 Test Cases Passed!`,
    studentQuery: 'Testing my nested array flattener against the automated test suite',
    aiResponse: 'All test cases passed! Your use of Set deduplication combined with Infinity flattening is clean, idiomatic JavaScript.',
    conceptChip: 'Mastery: Array flattening, Sets, and numeric sort comparisons',
    stats: 'Runs 100% without internet',
  },
  debugger: {
    title: 'Friendly Error Explainer',
    subtitle: 'No confusing jargon — just clear explanations of why code breaks and how to fix it',
    badge: 'Plain English',
    filename: 'ArraySearch.java',
    language: 'Java',
    codeSnippet: `public class ArraySearch {
    public static int search(int[] scores, int target) {
        // Bug: '<=' attempts to access scores[scores.length]
        for (int i = 0; i <= scores.length; i++) {
            if (scores[i] == target) return i;
        }
        return -1;
    }
}`,
    runOutput: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3\n\tat ArraySearch.search(ArraySearch.java:4)`,
    studentQuery: 'Why is Java throwing "ArrayIndexOutOfBoundsException: Index 3"?',
    aiResponse: 'What happened: In Java, arrays are 0-indexed. For an array of 3 scores, valid positions are 0, 1, and 2. Because the loop condition uses "<= scores.length", it asks for index 3 on the final loop.',
    conceptChip: 'Quick Fix: Change "i <= scores.length" to "i < scores.length"',
    stats: 'Explains mistakes in plain language',
  },
  curriculum: {
    title: 'Step-by-Step Lessons',
    subtitle: 'From zero-knowledge basics to building real-world software applications',
    badge: 'Multi-Language Tracks',
    filename: 'student_service.ts',
    language: 'TypeScript',
    codeSnippet: `interface Student {
  id: string;
  name: string;
  enrolledTracks: string[];
}

export function registerStudent(name: string, track: string): Student {
  return {
    id: \`std-\${Date.now()}\`,
    name,
    enrolledTracks: [track],
  };
}`,
    runOutput: `Registered: Student { id: 'std-174000000', name: 'Alex', enrolledTracks: ['Python 3', 'Modern JS', 'Java'] }`,
    studentQuery: 'Building reusable data contracts with TypeScript interfaces',
    aiResponse: 'Awesome work! Type interfaces provide compile-time safety and self-documenting APIs as your applications scale across frontend and backend systems.',
    conceptChip: 'Multi-Language Tracks: Python 3 • JavaScript • Java OOP • TypeScript',
    stats: 'Over 50 lessons included',
  },
}

const featureTabKeys: Array<'tutor' | 'practice' | 'debugger' | 'curriculum'> = ['tutor', 'practice', 'debugger', 'curriculum']

export const WorkspaceSection: React.FC = memo(() => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'tutor' | 'practice' | 'debugger' | 'curriculum'>('tutor')
  const [workspaceIsAutoPlay, setWorkspaceIsAutoPlay] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)

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

  const handleCopyCode = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <section id="features" className="py-20 sm:py-28 px-4 md:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <LightSectionBackground
        symbols={['countdown.py', 'def solve():', 'Key Concept', 'Passed ✓']}
        accentPosition="bottom-left"
      />
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

        <SectionReveal delay={0.08}>
          {/* Interactive Navigation Pills */}
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
                  <button
                    key={tab.id}
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
                  </button>
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

        <SectionReveal delay={0.12}>
          {/* Animated Tab Preview Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
            >
              {/* Top Bar */}
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

              {/* Split Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
                {/* Left 6 Columns: Interactive Code Editor */}
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

                {/* Right 6 Columns: AI Tutor Conversation Interface */}
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

                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hidden sm:inline-flex">
                        No Subscriptions
                      </span>
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
  )
})

WorkspaceSection.displayName = 'WorkspaceSection'
