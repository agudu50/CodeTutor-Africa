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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  Cpu,
  Wifi,
  WifiOff,
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
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shrink-0 border border-brand-500 shadow-2xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1 truncate">
                CodeTutor <span className="text-[#005F02] font-extrabold">Africa</span>
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
          className={`p-3 mx-3 mb-3 rounded-2xl border space-y-2 shadow-2xs shrink-0 ${
            isOffline
              ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20'
              : 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              {isOffline ? (
                <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
            </div>
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                isOffline ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            {isOffline
              ? 'All courses, coding challenges, and the AI Tutor work without internet.'
              : 'Connected to internet. Progress is automatically backed up.'}
          </p>
          <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-brand-500" />
              {isOffline ? 'Local AI Tutor' : 'Cloud AI'}
            </span>
            <span
              className={`font-bold ${
                isOffline ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isOffline ? 'No Internet Needed' : 'Connected'}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`p-2 mx-2 mb-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-[10px] font-mono shrink-0 ${
            isOffline
              ? 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/40 text-amber-600'
              : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600'
          }`}
          title={isOffline ? 'Offline Mode' : 'Online'}
        >
          {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOffline ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
        </div>
      )}
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'
