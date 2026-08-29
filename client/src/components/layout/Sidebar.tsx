import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { NAVIGATION_ITEMS } from '@/app/config/navigation'
import { useSystemStatus } from '@/app/providers/SystemStatusProvider'
import { cn } from '@/utils/cn'
import {
  LayoutDashboard,
  Bot,
  Code2,
  Bug,
  GraduationCap,
  BarChart3,
  Settings,
  ShieldCheck,
  Gamepad2,
  HelpCircle,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Bot,
  Code2,
  Bug,
  GraduationCap,
  BarChart3,
  Settings,
  ShieldCheck,
  Gamepad2,
  HelpCircle,
  Trophy,
}

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export const Sidebar: React.FC<SidebarProps> = memo(({ collapsed, onToggleCollapse }) => {
  const { effectiveNetwork } = useSystemStatus()
  const isOffline = effectiveNetwork === 'offline'
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 select-none z-30 shrink-0 sticky top-0 h-screen',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header Bar */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-white dark:bg-emerald-950/60 border border-emerald-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
            <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-full" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1 truncate">
                CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-extrabold">Africa</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold">
                Offline AI Core
              </span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-2 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
            Navigation Menu
          </div>
        )}

        {NAVIGATION_ITEMS.map((item) => {
          const Icon = iconMap[item.iconName] || LayoutDashboard

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white border border-transparent'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-600 dark:bg-brand-500 rounded-r-md" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Offline / Online Status & Hardware Footer */}
      {!collapsed ? (
        <div
          className={cn(
            'p-3.5 mx-3 mb-3 rounded-2xl border space-y-2.5 shadow-2xs shrink-0 transition-all',
            isOffline
              ? 'border-emerald-500/30 dark:border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-transparent'
              : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-3xs',
                  isOffline
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-[#005F02] dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-700/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                )}
              >
                {isOffline ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-tight truncate">
                  {isOffline ? 'Offline Engine' : 'Cloud Sync Active'}
                </span>
              </div>
            </div>

            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 border',
                isOffline
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border-emerald-300/80 dark:border-emerald-700/80'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              )}
            >
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {isOffline ? 'Ready' : 'Online'}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {isOffline
              ? '100% offline. Curriculum, Python compiler, and AI Tutor run directly on device.'
              : 'Connected to internet. Cloud sync and backup enabled.'}
          </p>

          <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-between text-[10.5px] font-mono">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
              {isOffline ? 'Local AI Tutor' : 'Cloud Hybrid AI'}
            </span>
            <span className="font-bold text-[#005F02] dark:text-emerald-400 text-[10px] uppercase tracking-wider">
              {isOffline ? '0 Data Cost' : 'Synced'}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'p-2.5 mx-2 mb-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-[10px] font-mono shrink-0 shadow-3xs transition-all',
            isOffline
              ? 'border-emerald-300/80 dark:border-emerald-700/80 bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-400'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
          )}
          title={isOffline ? 'Offline Engine: 100% Ready' : 'Connected to Cloud'}
        >
          <ShieldCheck className="w-4 h-4 text-[#005F02] dark:text-emerald-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'
