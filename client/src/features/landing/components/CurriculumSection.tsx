import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Code2,
  Terminal,
  Gamepad2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react'

interface CurriculumTrack {
  id: string
  name: string
  badge: string
  icon: React.ReactNode
  description: string
  level: 'Beginner' | 'Intermediate' | 'All Levels'
  totalModules: number
  totalDrills: number
  estimatedHours: string
  highlightProject: string
  actionUrl: string
  actionLabel: string
  modules: {
    title: string
    topics: string
    drills: number
    iconName: string
  }[]
}

const curriculumTracks: CurriculumTrack[] = [
  {
    id: 'python',
    name: 'Python 3 Programming',
    badge: 'Beginner Friendly',
    icon: <Terminal className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
    description: 'Master computational thinking, clean readable syntax, functions, loops, and data structures with patient 1-on-1 Socratic guidance.',
    level: 'Beginner',
    totalModules: 6,
    totalDrills: 48,
    estimatedHours: '16-20 hrs',
    highlightProject: 'ATM Cash Machine & Student Grade Book',
    actionUrl: '/learning',
    actionLabel: 'Explore Python Track',
    modules: [
      { title: 'Module 1: Getting Started with Python', topics: 'Print, Variables, Numbers, Text & String Formatting', drills: 8, iconName: '01' },
      { title: 'Module 2: Decision Making & Logic', topics: 'If, Elif, Else, Booleans & Comparison Operators', drills: 8, iconName: '02' },
      { title: 'Module 3: Loops & Iterations', topics: 'While Loops, For Loops, Range & Loop Control', drills: 8, iconName: '03' },
      { title: 'Module 4: Reusable Code with Functions', topics: 'Defining Functions, Parameters, Return Values & Scope', drills: 8, iconName: '04' },
      { title: 'Module 5: Storing Collections of Data', topics: 'Lists, Tuples, Dictionaries, Slicing & List Methods', drills: 8, iconName: '05' },
      { title: 'Module 6: Object-Oriented Foundations', topics: 'Classes, Attributes, Methods, and Real-World Modeling', drills: 8, iconName: '06' },
    ],
  },
  {
    id: 'web',
    name: 'Web Development (HTML, CSS & JS)',
    badge: 'Build Web Apps Offline',
    icon: <Code2 className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />,
    description: 'Learn how modern websites work. Structure with HTML5, style with modern CSS, and bring pages alive with interactive JavaScript.',
    level: 'Beginner',
    totalModules: 6,
    totalDrills: 52,
    estimatedHours: '20-24 hrs',
    highlightProject: 'Offline Calculator & Interactive Quiz Web App',
    actionUrl: '/learning',
    actionLabel: 'Explore Web Track',
    modules: [
      { title: 'Module 1: Semantic HTML5 Structure', topics: 'Tags, Headings, Paragraphs, Links, Images & Semantic Elements', drills: 8, iconName: '01' },
      { title: 'Module 2: Modern CSS Styling', topics: 'Colors, Box Model, Padding, Margin, Borders & Rounded Corners', drills: 8, iconName: '02' },
      { title: 'Module 3: Responsive Flexbox & Grid', topics: 'Flexbox Layouts, Grid Systems, Alignment & Mobile Viewports', drills: 8, iconName: '03' },
      { title: 'Module 4: JavaScript Programming Essentials', topics: 'Variables (let/const), Conditionals, Functions & Arrays', drills: 10, iconName: '04' },
      { title: 'Module 5: Dynamic DOM Manipulation', topics: 'querySelector, Event Listeners, Modifying HTML & CSS on Click', drills: 10, iconName: '05' },
      { title: 'Module 6: Client Storage & Offline Web Apps', topics: 'LocalStorage, JSON Parsing, State Persistence with Zero Internet', drills: 8, iconName: '06' },
    ],
  },
  {
    id: 'java',
    name: 'Java Object-Oriented Programming',
    badge: 'University Standard',
    icon: <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    description: 'Build disciplined programming skills with strongly-typed Java. Master classes, objects, encapsulation, inheritance, and clean error handling.',
    level: 'Intermediate',
    totalModules: 6,
    totalDrills: 42,
    estimatedHours: '18-22 hrs',
    highlightProject: 'PiggyBank Savings Account & Library Inventory System',
    actionUrl: '/learning',
    actionLabel: 'Explore Java Track',
    modules: [
      { title: 'Module 1: Java Syntax & Basic Types', topics: 'Main Method, Primitive Types, String Operations & Console I/O', drills: 6, iconName: '01' },
      { title: 'Module 2: Control Flow & Arrays', topics: 'If Statements, Switch Expressions, For/While Loops & Array Traversal', drills: 8, iconName: '02' },
      { title: 'Module 3: Classes & Objects', topics: 'Constructors, Instance Variables, Method Signatures & "this"', drills: 8, iconName: '03' },
      { title: 'Module 4: Encapsulation & Access Modifiers', topics: 'Private Fields, Getters, Setters, and Data Validation', drills: 6, iconName: '04' },
      { title: 'Module 5: Inheritance & Interfaces', topics: 'Extends, Super, Method Overriding & Abstract Contracts', drills: 8, iconName: '05' },
      { title: 'Module 6: Safe Exception Handling', topics: 'Try-Catch, Finally Blocks, Custom Exceptions & Array Bounds Safety', drills: 6, iconName: '06' },
    ],
  },
  {
    id: 'games',
    name: 'Arcade Coding Mini-Games',
    badge: 'Fun Skill Builders',
    icon: <Gamepad2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    description: 'Gamify your coding journey! Play interactive mini-games to build muscle memory, spot errors at lightning speed, and compete on offline leaderboards.',
    level: 'All Levels',
    totalModules: 4,
    totalDrills: 60,
    estimatedHours: 'Play Anytime',
    highlightProject: 'Offline Achievement Badges & High Score Leaderboard',
    actionUrl: '/games',
    actionLabel: 'Play Arcade Games',
    modules: [
      { title: 'Game 1: Syntax Speedrun', topics: 'Fast-paced typing drills to master keywords, brackets & operators', drills: 15, iconName: '01' },
      { title: 'Game 2: Bug Hunter', topics: 'Inspect broken code snippets and tap the exact line causing the bug', drills: 15, iconName: '02' },
      { title: 'Game 3: Code Shuffle', topics: 'Re-order scrambled lines of code into a functional working algorithm', drills: 15, iconName: '03' },
      { title: 'Game 4: Output Predictor', topics: 'Trace execution flow mentally and predict the correct console output', drills: 15, iconName: '04' },
    ],
  },
]

export const CurriculumSection: React.FC = memo(() => {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0)
  const currentTrack = curriculumTracks[activeTrackIndex]

  return (
    <section id="curriculum" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold shadow-3xs">
          <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
          <span>STRUCTURED LEARNING TRACKS</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Step-by-Step Curriculum for Every Learner
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Clear, bite-sized lessons with immediate hands-on practice. Choose a track below to explore modules, real-world projects, and offline coding drills.
        </p>
      </div>

      {/* Track Tabs - Dashboard Solid Style */}
      <div className="flex items-center justify-start sm:justify-center gap-2 pb-2 overflow-x-auto no-scrollbar max-w-full">
        {curriculumTracks.map((track, idx) => {
          const isActive = activeTrackIndex === idx
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveTrackIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-2 shrink-0 border-2 cursor-pointer shadow-3xs ${
                isActive
                  ? 'bg-[#005F02] text-white border-[#005F02] shadow-xs'
                  : 'bg-white dark:bg-[#0E1318] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#005F02] hover:text-[#005F02]'
              }`}
            >
              <span className="shrink-0">{track.icon}</span>
              <span className="whitespace-nowrap">{track.name.split(' ')[0]}</span>
              {isActive && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20 text-white font-black uppercase">
                  Active
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active Track Showcase Container - Dashboard Card Style */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTrack.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="mt-5 rounded-2xl bg-white dark:bg-[#0E1318] border-2 border-slate-300 dark:border-slate-700 p-5 sm:p-7 shadow-2xs relative text-left"
        >
          {/* Track Summary Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-8 space-y-2.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                  {currentTrack.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  Level: {currentTrack.level}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentTrack.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
                {currentTrack.description}
              </p>
            </div>

            {/* Quick Metrics & Launch CTA */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-3 bg-[#FAFAFA] dark:bg-[#0C1015] p-4 rounded-xl border border-slate-300 dark:border-slate-700">
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-lg bg-white dark:bg-[#0E1318] border border-slate-200 dark:border-slate-800">
                  <div className="text-base font-black text-slate-900 dark:text-white">{currentTrack.totalModules}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Modules</div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#0E1318] border border-slate-200 dark:border-slate-800">
                  <div className="text-base font-black text-[#005F02] dark:text-emerald-400">{currentTrack.totalDrills}+</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Drills</div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#0E1318] border border-slate-200 dark:border-slate-800">
                  <div className="text-base font-black text-slate-900 dark:text-white">{currentTrack.estimatedHours.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Hours</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />
                  <span className="font-bold">Project:</span>
                  <span className="truncate">{currentTrack.highlightProject}</span>
                </div>

                <Link to={currentTrack.actionUrl} className="block w-full">
                  <button className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                    <span>{currentTrack.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Module Grid */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                <span>Syllabus Breakdown</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                100% Offline • Self-Paced
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentTrack.modules.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#0C1015] border border-slate-300 dark:border-slate-800 hover:border-[#005F02] dark:hover:border-emerald-500 hover:shadow-2xs transition-all text-left space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 font-mono text-[11px] font-black flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                      {mod.iconName}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                      {mod.drills} Drills
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {mod.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {mod.topics}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-[#005F02] dark:text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Step-by-Step
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all">
                      Ready →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
})

CurriculumSection.displayName = 'CurriculumSection'
