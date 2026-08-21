import React from 'react'
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

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileNav }) => {
  const { theme, setTheme, isDark } = useTheme()
  const location = useLocation()

  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Dashboard'
    if (path.startsWith('/tutor')) return 'AI Programming Tutor'
    if (path.startsWith('/practice')) return 'Interactive Code Practice'
    if (path.startsWith('/debugger')) return 'Offline Code Debugger'
    if (path.startsWith('/learning')) return 'Course Catalog'
    if (path.startsWith('/progress')) return 'Learning Analytics'
    if (path.startsWith('/settings')) return 'System Preferences'
    return 'CodeTutor Africa'
  }

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else setTheme('dark')
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
      {/* Left section: Mobile menu + Page context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none">
            {getPageTitle(location.pathname)}
          </h1>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Offline Programming Workspace • All Skill Levels
          </span>
        </div>
      </div>

      {/* Right section: System status, streak, theme, profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search Shortcut Trigger Placeholder */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span>Search topics, lessons...</span>
          <kbd className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
            Ctrl K
          </kbd>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>7 Days</span>
        </div>

        {/* System & Model Status Pill */}
        <SystemStatusIndicator />

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
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
}
