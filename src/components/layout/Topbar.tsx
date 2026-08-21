import React, { memo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@/app/providers/ThemeProvider'
import { SystemStatusIndicator } from './SystemStatusIndicator'
import { Avatar } from '@/components/ui'
import {
  Menu,
  Sun,
  Moon,
  Search,
  Flame,
} from 'lucide-react'

interface TopbarProps {
  onOpenMobileNav: () => void
}

export const Topbar: React.FC<TopbarProps> = memo(({ onOpenMobileNav }) => {
  const { theme, setTheme, isDark } = useTheme()
  const location = useLocation()

  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Dashboard'
    if (path.startsWith('/tutor')) return 'AI Programming Tutor'
    if (path.startsWith('/practice')) return 'Interactive Code Practice'
    if (path.startsWith('/debugger')) return 'Offline Code Debugger'
    if (path.startsWith('/learning')) return 'Course Tracks & Lessons'
    if (path.startsWith('/progress')) return 'Learning Analytics'
    if (path.startsWith('/settings')) return 'System Preferences'
    return 'CodeTutor Africa'
  }

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else setTheme('dark')
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-2xs">
      {/* Left section: Mobile menu + Page context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">
            {getPageTitle(location.pathname)}
          </h1>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Offline Programming Workspace • All Skill Levels
          </span>
        </div>
      </div>

      {/* Right section: System status, streak, theme, profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search Shortcut Trigger */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs">
          <Search className="w-3.5 h-3.5" />
          <span>Search topics, lessons...</span>
          <kbd className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono font-bold">
            Ctrl K
          </kbd>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 text-xs font-bold font-mono shadow-2xs">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>7 Days</span>
        </div>

        {/* System & Model Status Pill */}
        <SystemStatusIndicator />

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <Avatar fallbackName="Kofi Mensah" size="sm" />
        </div>
      </div>
    </header>
  )
})

Topbar.displayName = 'Topbar'
