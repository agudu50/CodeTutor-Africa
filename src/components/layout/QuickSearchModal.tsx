import React, { useState, useEffect, useRef, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, Code2, Bot, Bug, BarChart3, Settings, ArrowRight, X, Sparkles } from 'lucide-react'

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'Workspace' | 'Lesson' | 'Problem' | 'Course'
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const SEARCH_INDEX: SearchItem[] = [
  // Workspaces
  {
    id: 'ws-dashboard',
    title: 'Dashboard Overview',
    subtitle: 'Daily streak, enrolled courses, and weak areas summary',
    category: 'Workspace',
    path: '/dashboard',
    icon: BarChart3,
  },
  {
    id: 'ws-tutor',
    title: 'Ask AI Tutor',
    subtitle: 'Socratic dialogue, code reasoning, and conceptual deep-dives',
    category: 'Workspace',
    path: '/tutor',
    icon: Bot,
    badge: 'Offline AI',
  },
  {
    id: 'ws-practice',
    title: 'Code Practice & Challenges',
    subtitle: 'Solve coding problems with local automated test suites',
    category: 'Workspace',
    path: '/practice',
    icon: Code2,
  },
  {
    id: 'ws-debugger',
    title: 'Offline Code Debugger',
    subtitle: 'Analyze runtime exceptions, off-by-one errors, and syntax bugs',
    category: 'Workspace',
    path: '/debugger',
    icon: Bug,
  },
  {
    id: 'ws-learning',
    title: 'Course Catalog & Tracks',
    subtitle: 'Structured curriculum paths for Python, JavaScript, and Java',
    category: 'Workspace',
    path: '/learning',
    icon: BookOpen,
  },
  {
    id: 'ws-progress',
    title: 'Learning Analytics & Mastery',
    subtitle: 'Curriculum coverage, 7-day consistency metrics, and mastery charts',
    category: 'Workspace',
    path: '/progress',
    icon: BarChart3,
  },
  {
    id: 'ws-settings',
    title: 'System Preferences & Settings',
    subtitle: 'Visual themes, font sizing, and local neural model diagnostics',
    category: 'Workspace',
    path: '/settings',
    icon: Settings,
  },

  // Lessons
  {
    id: 'les-3',
    title: 'Functions, Scoping, and Recursion',
    subtitle: 'Python • Call stacks, stack frames, and base condition design',
    category: 'Lesson',
    path: '/learning/lessons/les-3',
    icon: BookOpen,
    badge: 'Python',
  },
  {
    id: 'les-1',
    title: 'Memory Model and Variable Scope',
    subtitle: 'Python • Stack vs Heap allocation and pointer semantics',
    category: 'Lesson',
    path: '/learning/lessons/les-1',
    icon: BookOpen,
    badge: 'Python',
  },
  {
    id: 'les-2',
    title: 'Iteration & List Comprehensions',
    subtitle: 'Python • Writing idiomatic loops, generators, and comprehension filters',
    category: 'Lesson',
    path: '/learning/lessons/les-2',
    icon: BookOpen,
    badge: 'Python',
  },

  // Practice Problems
  {
    id: 'prob-rec-1',
    title: 'Recursive Palindrome Checker',
    subtitle: 'Recursion • Determine if a string is a palindrome without slice reversal',
    category: 'Problem',
    path: '/practice/practice-rec-1',
    icon: Code2,
    badge: 'Beginner',
  },
  {
    id: 'prob-two-sum',
    title: 'Two Sum with Optimal Hash Map',
    subtitle: 'Hash Tables • O(N) linear time complement lookup',
    category: 'Problem',
    path: '/practice/practice-two-sum',
    icon: Code2,
    badge: 'Intermediate',
  },
  {
    id: 'prob-async-fetch',
    title: 'Async User Fetch & Promise Race',
    subtitle: 'JavaScript • Handle race conditions and Promise.all execution',
    category: 'Problem',
    path: '/practice/practice-async-fetch',
    icon: Code2,
    badge: 'JavaScript',
  },

  // Courses
  {
    id: 'course-py',
    title: 'Python Programming & Problem Solving',
    subtitle: 'Course Track • 18 Total Lessons, 24 Estimated Hours',
    category: 'Course',
    path: '/learning/courses/course-py-101',
    icon: BookOpen,
    badge: 'Track',
  },
  {
    id: 'course-js',
    title: 'Modern JavaScript & Async Programming',
    subtitle: 'Course Track • 14 Total Lessons, 18 Estimated Hours',
    category: 'Course',
    path: '/learning/courses/course-js-201',
    icon: BookOpen,
    badge: 'Track',
  },
  {
    id: 'course-java',
    title: 'Java Object-Oriented Software Design',
    subtitle: 'Course Track • 16 Total Lessons, 22 Estimated Hours',
    category: 'Course',
    path: '/learning/courses/course-java-301',
    icon: BookOpen,
    badge: 'Track',
  },
]

interface QuickSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = memo(({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const filteredItems = SEARCH_INDEX.filter((item) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  const handleSelect = (item: SearchItem) => {
    onClose()
    navigate(item.path)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Dialog */}
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search lessons, practice problems, workspaces, topics..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-1.5">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No matching results found
              </p>
              <p className="text-xs">Try searching for "recursion", "python", "debugger", or "two sum".</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg border shrink-0 ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-500'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-opacity ml-2 ${
                      isSelected ? 'opacity-100 text-brand-600 dark:text-brand-400' : 'opacity-0'
                    }`}
                  />
                </div>
              )
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3 h-3" /> Offline Quick Launcher
          </span>
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  )
})

QuickSearchModal.displayName = 'QuickSearchModal'
