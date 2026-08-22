import React, { useState, useEffect, useRef, memo } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useUserProfile } from '@/app/providers/UserProfileProvider'
import { QuickSearchModal } from './QuickSearchModal'
import { ReportIssueModal } from '@/components/support/ReportIssueModal'
import { Avatar } from '@/components/ui'
import {
  Menu,
  Sun,
  Moon,
  Search,
  Flame,
  Settings,
  BarChart3,
  ArrowRight,
  User,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react'

interface TopbarProps {
  onOpenMobileNav: () => void
}

export const Topbar: React.FC<TopbarProps> = memo(({ onOpenMobileNav }) => {
  const { theme, setTheme, isDark } = useTheme()
  const { profile } = useUserProfile()
  const location = useLocation()
  const navigate = useNavigate()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Listen for global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileOpen])

  const getPageTitle = (path: string) => {
    if (path.startsWith('/admin')) return 'Admin Operations'
    if (path.startsWith('/dashboard')) return 'Dashboard'
    if (path.startsWith('/tutor')) return 'AI Tutor'
    if (path.startsWith('/practice')) return 'Code Practice'
    if (path.startsWith('/debugger')) return 'Debugger'
    if (path.startsWith('/learning/lessons')) return 'Lesson'
    if (path.startsWith('/learning')) return 'Courses'
    if (path.startsWith('/progress')) return 'Analytics'
    if (path.startsWith('/settings')) return 'Settings'
    return 'CodeTutor Africa'
  }

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else setTheme('dark')
  }

  const handleSignOut = () => {
    setIsProfileOpen(false)
    navigate('/signin')
  }

  return (
    <>
      <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20 px-3 sm:px-6 flex items-center justify-between shadow-2xs select-none w-full box-border">
        {/* Left section: Mobile menu + Page context */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:inline-block truncate">
              Offline Programming Workspace • All Skill Levels
            </span>
          </div>
        </div>

        {/* Right section: Search, streak, theme toggle, user */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger (Icon on mobile, pill on desktop) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs cursor-pointer hover:border-brand-400 dark:hover:border-brand-600 transition-all shadow-2xs group focus:outline-none focus:ring-1 focus:ring-brand-500"
            title="Search courses, lessons, and practice (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden lg:inline">Search topics, lessons...</span>
            <kbd className="text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono font-bold">
              Ctrl K
            </kbd>
          </button>

          {/* Mobile Icon-Only Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Report Issue Action Button (Desktop Only) */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-400 text-xs font-semibold cursor-pointer transition-all shadow-2xs shrink-0"
            title="Report an issue or suggest a course"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Report Issue</span>
          </button>

          {/* Streak Counter (Mobile & Desktop) */}
          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 text-xs font-bold font-mono shadow-2xs shrink-0">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">7 Days</span>
            <span className="sm:hidden">7d</span>
          </div>

          {/* Theme Toggle (Tablet/Desktop Only) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer shrink-0"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Interactive User Profile Dropdown */}
          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-brand-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              aria-label="User profile menu"
              aria-expanded={isProfileOpen}
            >
              <Avatar
                src={profile.avatarUrl || undefined}
                fallbackName={profile.fullName || 'User'}
                size="sm"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xs transition-colors w-7 h-7 sm:w-8 sm:h-8 text-xs"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2.5 w-64 sm:w-68 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
                {/* User Info Header */}
                <div className="p-2.5 sm:p-3 space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={profile.avatarUrl || undefined}
                      fallbackName={profile.fullName || 'User'}
                      size="md"
                      className="bg-brand-600 text-white font-bold shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {profile.fullName}
                        </span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                          Offline
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        @{profile.username}
                      </p>
                    </div>
                  </div>
                  <div className="pt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {profile.email}
                  </div>
                  <div className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold truncate">
                    {profile.location}
                  </div>
                </div>

                {/* Quick Navigation Actions */}
                <div className="pt-1.5 space-y-0.5">
                  <Link
                    to="/admin"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50/70 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors border border-brand-200/60 dark:border-brand-800/60"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span>Admin Operations Portal</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Edit Profile & Photo</span>
                  </Link>

                  <Link
                    to="/progress"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Learning Progress & Analytics</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      setIsReportModalOpen(true)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Report Issue to Admin</span>
                  </button>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>System Settings & Preferences</span>
                  </Link>

                  {/* Theme Switcher */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {isDark ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />}
                      <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">{theme}</span>
                  </button>
                </div>

                {/* Sign Out Action */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                  >
                    <span>Sign Out</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Command Palette Modal */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Support & Issue Ticket Modal */}
      <ReportIssueModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </>
  )
})

Topbar.displayName = 'Topbar'
