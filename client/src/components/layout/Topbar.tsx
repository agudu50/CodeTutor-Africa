import React, { useState, useEffect, useRef, memo } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useUserProfile } from '@/app/providers/UserProfileProvider'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { QuickSearchModal } from './QuickSearchModal'
import { SystemStatusIndicator, SystemStatusModal } from './SystemStatusIndicator'
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
  X,
  Wifi,
  WifiOff,
  Sparkles,
  Bot,
  BookOpen,
  Code2,
  Bug,
  LayoutDashboard,
  GraduationCap,
  Zap,
} from 'lucide-react'

interface TopbarProps {
  onOpenMobileNav: () => void
}

export const Topbar: React.FC<TopbarProps> = memo(({ onOpenMobileNav }) => {
  const { theme, setTheme, isDark } = useTheme()
  const { profile } = useUserProfile()
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'

  const location = useLocation()
  const navigate = useNavigate()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Listen for global Ctrl+K / Cmd+K shortcut and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsProfileOpen(false)
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

  const getPageInfo = (path: string) => {
    if (path.startsWith('/admin')) {
      return {
        title: 'Admin Operations',
        subtitle: 'System Telemetry & Platform Governance',
        icon: <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />,
        badge: 'Admin',
      }
    }
    if (path.startsWith('/dashboard')) {
      return {
        title: 'Dashboard',
        subtitle: 'Offline Programming Workspace • All Skill Levels',
        icon: <LayoutDashboard className="w-4 h-4 text-brand-600 dark:text-brand-400" />,
        badge: 'Workspace',
      }
    }
    if (path.startsWith('/tutor')) {
      return {
        title: 'Socratic AI Tutor',
        subtitle: '6-Mode Pedagogical Engine • 100% Offline LLM',
        icon: <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
        badge: 'Qwen 1.5B',
      }
    }
    if (path.startsWith('/practice')) {
      return {
        title: 'Code Practice & Arcade',
        subtitle: 'Interactive Drills, Bug Hunts & Algorithmic Challenges',
        icon: <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
        badge: 'Sandboxed',
      }
    }
    if (path.startsWith('/debugger')) {
      return {
        title: 'Compiler Diagnostics',
        subtitle: 'AST Traceback Analyzer & Guiding Error Fixes',
        icon: <Bug className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
        badge: 'Diagnostics',
      }
    }
    if (path.startsWith('/learning/lessons')) {
      return {
        title: 'Interactive Lesson',
        subtitle: 'Embedded VS Code Sandbox & Automated Concept Checks',
        icon: <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
        badge: 'Active Lesson',
      }
    }
    if (path.startsWith('/learning')) {
      return {
        title: 'Curriculum & Courses',
        subtitle: 'Dynamic 3-Module 9-Lesson AI Synthesis',
        icon: <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
        badge: 'Roadmaps',
      }
    }
    if (path.startsWith('/progress')) {
      return {
        title: 'Analytics & Mastery',
        subtitle: 'Study Streaks, Topic Competence & Telemetry',
        icon: <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
        badge: 'Telemetry',
      }
    }
    if (path.startsWith('/settings')) {
      return {
        title: 'Settings & Runtime',
        subtitle: 'LLM Quantization, Memory Capping & Preferences',
        icon: <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
        badge: 'Config',
      }
    }
    return {
      title: 'CodeTutor Africa',
      subtitle: 'Offline-First AI Tutor for African Students',
      icon: <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />,
      badge: 'ADTC 2026',
    }
  }

  const pageInfo = getPageInfo(location.pathname)

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
      <header className="h-14 sm:h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 px-3 sm:px-6 flex items-center justify-between shadow-xs select-none w-full box-border transition-colors duration-200">
        {/* Subtle decorative top accent line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-500/40 dark:via-brand-400/30 to-transparent pointer-events-none" />

        {/* Left section: Mobile menu + Page context & Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer touch-manipulation active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Desktop Page Route Icon & Breadcrumb Context */}
          <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 shadow-2xs shrink-0">
            {pageInfo.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate tracking-tight">
                {pageInfo.title}
              </h1>

              {/* Desktop Workspace Category Badge */}
              <span className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500" />
                </span>
                {pageInfo.badge}
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:inline-block truncate leading-none pt-0.5">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right section: Global Search, Quick Action, System Pill, Streak, Theme, User */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Enhanced Desktop Command Search Pill */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs cursor-pointer hover:border-brand-400 dark:hover:border-brand-600 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 shadow-2xs group focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            title="Search courses, lessons, and practice (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden lg:inline text-xs">
              Search courses, drills...
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded-md text-slate-600 dark:text-slate-300 font-mono font-bold shadow-3xs">
              <span className="text-[9px] opacity-70">Ctrl</span>
              <span>K</span>
            </span>
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

          {/* Quick AI Tutor Shortcut (Desktop only when not on tutor page) */}
          {!location.pathname.startsWith('/tutor') && (
            <Link
              to="/tutor"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 hover:border-emerald-400 text-xs font-semibold cursor-pointer transition-all shadow-2xs shrink-0"
              title="Launch Offline Socratic AI Tutor"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Ask AI Tutor</span>
            </Link>
          )}

          {/* Report Issue Action Button (Desktop Only) */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-400 text-xs font-semibold cursor-pointer transition-all shadow-2xs shrink-0"
            title="Report an issue or suggest a course"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Support</span>
          </button>

          {/* System Online/Offline Status Indicator (Desktop/Tablet) */}
          <div className="hidden sm:block">
            <SystemStatusIndicator onOpen={() => setIsStatusModalOpen(true)} />
          </div>

          {/* Enhanced Learning Streak Counter Badge */}
          <Link
            to="/progress"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/80 dark:to-orange-950/80 border border-amber-200/90 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 text-xs font-bold font-mono shadow-2xs shrink-0 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group"
            title="Study Streak: 7 Consecutive Days Active (Click for analytics)"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">7 Days</span>
            <span className="sm:hidden text-[11px]">7d</span>
          </Link>

          {/* Theme Toggle Button with Smooth Icon Transition */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer shrink-0"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>

          {/* Interactive User Profile Dropdown Button */}
          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="relative flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-brand-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer group"
              aria-label="User profile menu"
              aria-expanded={isProfileOpen}
            >
              <Avatar
                src={profile.avatarUrl || undefined}
                fallbackName={profile.fullName || 'User'}
                size="sm"
                className="bg-[#005F02] text-white font-bold shadow-xs transition-colors w-7 h-7 sm:w-8 sm:h-8 text-xs"
              />
              {/* Online status indicator dot */}
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </button>

            {/* Backdrop overlay for reliable outside click / tap dismissal */}
            {isProfileOpen && (
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsProfileOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2.5 w-68 sm:w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
                {/* User Info Header with Close Button */}
                <div className="p-2.5 sm:p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Avatar
                        src={profile.avatarUrl || undefined}
                        fallbackName={profile.fullName || 'User'}
                        size="md"
                        className="bg-[#005F02] text-white font-bold shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-[#005F02] block truncate">
                            {profile.fullName}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          @{profile.username}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                      aria-label="Close profile menu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold truncate">
                    <Zap className="w-3 h-3 shrink-0" />
                    <span>{profile.location || 'African Student Scholar'}</span>
                  </div>
                </div>

                {/* Network & Connectivity Status */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      setIsStatusModalOpen(true)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isOffline
                        ? 'bg-amber-50/80 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                        : 'bg-emerald-50/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isOffline ? (
                        <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <span>{isOffline ? '100% Offline Mode' : 'Online Sync Active'}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-current opacity-90">
                      {isOffline ? 'Details' : 'Active'}
                    </span>
                  </button>
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
                    to="/tutor"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Bot className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>AI Tutor Workspace</span>
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
                    <span>Report Issue / Feedback</span>
                  </button>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>System Settings & LLM Runtime</span>
                  </Link>

                  {/* Theme Switcher in Dropdown */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {isDark ? (
                        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                      )}
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

      {/* System & Connection Status Modal */}
      <SystemStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} />
    </>
  )
})

Topbar.displayName = 'Topbar'

