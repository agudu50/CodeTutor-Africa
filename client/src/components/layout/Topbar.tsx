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
        title: 'Admin Dashboard',
        subtitle: 'System health, feedback reports & platform controls',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
        badge: 'Admin',
      }
    }
    if (path.startsWith('/dashboard')) {
      return {
        title: 'Learning Dashboard',
        subtitle: 'Daily study goals, streaks & active coding lessons',
        icon: <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
        badge: 'Dashboard',
      }
    }
    if (path.startsWith('/tutor')) {
      return {
        title: 'AI Coding Tutor',
        subtitle: 'Step-by-step guidance, hints & code reviews • 100% Offline',
        icon: <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
        badge: 'Offline AI',
      }
    }
    if (path.startsWith('/practice')) {
      return {
        title: 'Practice & Arcade',
        subtitle: 'Hands-on coding challenges, bug hunts & typing games',
        icon: <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
        badge: 'Practice',
      }
    }
    if (path.startsWith('/debugger')) {
      return {
        title: 'Code Error Helper',
        subtitle: 'Find mistakes & get step-by-step fixes in plain English',
        icon: <Bug className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
        badge: 'Debugger',
      }
    }
    if (path.startsWith('/learning/lessons')) {
      return {
        title: 'Interactive Lesson',
        subtitle: 'Step-by-step interactive coding lesson and exercises',
        icon: <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
        badge: 'Active Lesson',
      }
    }
    if (path.startsWith('/learning')) {
      return {
        title: 'Courses & Tracks',
        subtitle: 'Structured coding courses for every skill level',
        icon: <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
        badge: 'Courses',
      }
    }
    if (path.startsWith('/progress')) {
      return {
        title: 'My Progress',
        subtitle: 'Track your study hours, streaks & completed challenges',
        icon: <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
        badge: 'Progress',
      }
    }
    if (path.startsWith('/settings')) {
      return {
        title: 'Settings & Profile',
        subtitle: 'Customize your theme, study goals & offline preferences',
        icon: <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
        badge: 'Settings',
      }
    }
    return {
      title: 'CodeTutor Africa',
      subtitle: '100% Offline AI Coding Tutor for African Students',
      icon: <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Offline AI',
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
      <header className="h-14 sm:h-16 border-b-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0C1015] sticky top-0 z-20 px-3 sm:px-6 flex items-center justify-between shadow-xs select-none w-full box-border">
        {/* Left section: Mobile menu + Page context & Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-[#161B22] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border-2 border-slate-200 dark:border-slate-800 shrink-0 cursor-pointer touch-manipulation active:scale-95 shadow-3xs"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Desktop Page Route Icon & Breadcrumb Context */}
          <div className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#161B22] border-2 border-slate-200 dark:border-slate-800 shadow-3xs shrink-0">
            {pageInfo.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight truncate tracking-tight">
                {pageInfo.title}
              </h1>

              {/* Desktop Workspace Category Badge */}
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-800 shrink-0 shadow-3xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                {pageInfo.badge}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium hidden md:inline-block truncate leading-none pt-0.5">
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
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#005F02] dark:hover:border-emerald-500 bg-slate-50 dark:bg-[#161B22] hover:bg-white dark:hover:bg-[#1C232B] text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer transition-all shadow-3xs group focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            title="Search courses, lessons, and practice (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors" />
            <span className="text-slate-600 dark:text-slate-400 font-medium hidden lg:inline text-xs">
              Search courses, drills...
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300 font-mono font-bold shadow-3xs">
              <span className="text-[9px] opacity-70">Ctrl</span>
              <span>K</span>
            </span>
          </button>

          {/* Mobile Icon-Only Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-2 border-slate-200 dark:border-slate-800 shadow-3xs cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick AI Tutor Shortcut (Desktop only when not on tutor page) */}
          {!location.pathname.startsWith('/tutor') && (
            <Link
              to="/tutor"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 hover:bg-[#005F02] hover:text-white dark:hover:bg-[#005F02] dark:hover:text-white text-xs font-bold cursor-pointer transition-all shadow-3xs shrink-0"
              title="Launch Offline Socratic AI Tutor"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Tutor</span>
            </Link>
          )}

          {/* Report Issue Action Button (Desktop Only) */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 hover:text-[#005F02] dark:hover:text-emerald-400 hover:border-[#005F02] dark:hover:border-emerald-500 text-xs font-bold cursor-pointer transition-all shadow-3xs shrink-0"
            title="Report an issue or suggest a course"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>

          {/* System Online/Offline Status Indicator (Desktop/Tablet) */}
          <div className="hidden sm:block">
            <SystemStatusIndicator onOpen={() => setIsStatusModalOpen(true)} />
          </div>

          {/* Theme Toggle Button with Smooth Icon Transition */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden sm:flex p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-50 dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-2 border-slate-200 dark:border-slate-800 shadow-3xs cursor-pointer shrink-0"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>

          {/* Interactive User Profile Dropdown Button with Solid Halo */}
          <div className="relative shrink-0" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="relative flex items-center p-0.5 rounded-full ring-2 ring-amber-400 bg-amber-400 shadow-3xs hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              aria-label="User profile and streak menu"
              aria-expanded={isProfileOpen}
              title="7-Day Learning Streak • Click for profile menu"
            >
              <Avatar
                src={profile.avatarUrl || undefined}
                fallbackName={profile.fullName || 'User'}
                size="sm"
                className="bg-[#005F02] text-white font-bold w-7 h-7 sm:w-8 sm:h-8 text-xs ring-1 ring-white dark:ring-slate-900"
              />

              {/* Flame Streak Mini Pill pinned to the bottom of the avatar (Solid Amber, NO gradient) */}
              <span className="absolute -bottom-1 inset-x-0 mx-auto w-fit flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 border border-amber-300 text-slate-900 font-mono font-black text-[9px] shadow-3xs ring-1.5 ring-white dark:ring-slate-900 z-10">
                <Flame className="w-2.5 h-2.5 fill-slate-900 text-slate-900 shrink-0" />
                <span>7d</span>
              </span>

              {/* Online/Offline status indicator dot on top-right */}
              <span
                className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 z-10 ${
                  isOffline ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
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
              <div className="absolute right-0 mt-2.5 w-68 sm:w-72 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2 divide-y divide-slate-200 dark:divide-slate-800">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border-2 ${
                      isOffline
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isOffline ? (
                        <WifiOff className="w-4 h-4 text-amber-900 dark:text-amber-300 shrink-0" />
                      ) : (
                        <Wifi className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
                      )}
                      <span>{isOffline ? '100% Offline Mode' : 'Online Sync Active'}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-[#161B22] border border-current shadow-3xs">
                      {isOffline ? 'Details' : 'Active'}
                    </span>
                  </button>
                </div>

                {/* Quick Navigation Actions */}
                <div className="pt-1.5 space-y-1">
                  <Link
                    to="/admin"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#005F02] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors border-2 border-emerald-200 dark:border-emerald-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
                    <span>Admin Operations Portal</span>
                  </Link>

                  <Link
                    to="/tutor"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <Bot className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />
                    <span>AI Tutor Workspace</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Edit Profile & Photo</span>
                  </Link>

                  <Link
                    to="/progress"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Report Issue / Feedback</span>
                  </button>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>System Settings & Architecture</span>
                  </Link>

                  {/* Theme Switcher in Dropdown */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
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
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer border-2 border-rose-200 dark:border-rose-800 shadow-3xs"
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

