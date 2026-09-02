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
        'hidden md:flex flex-col border-r-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0C1015] transition-all duration-300 select-none z-30 shrink-0 sticky top-0 h-screen',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header Bar */}
      <div className="h-16 flex items-center justify-between px-4 border-b-2 border-slate-200 dark:border-slate-800 shrink-0">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-white dark:bg-[#161B22] border-2 border-emerald-500/40 p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
            <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-full" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1 truncate">
                CodeTutor <span className="text-[#005F02] dark:text-emerald-400 font-black">Africa</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase font-bold">
                Offline AI Core
              </span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-[#161B22] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-700 shadow-3xs cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-2 pb-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer',
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-white border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 font-medium'
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
                        ? 'text-[#005F02] dark:text-emerald-400'
                        : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-1 top-2.5 bottom-2.5 w-1 bg-[#005F02] dark:bg-emerald-400 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Offline / Online Status & Hardware Footer */}
      {!collapsed ? (
        <div className="p-2.5 mx-3 mb-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161B22] shadow-2xs shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-3xs border',
                  isOffline
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                )}
              >
                {isOffline ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <Database className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight truncate">
                  {isOffline ? 'Offline Engine' : 'Cloud Sync'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate">
                  {isOffline ? '0 KB Data Cost' : 'Connected'}
                </span>
              </div>
            </div>

            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 border shadow-3xs',
                isOffline
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              )}
            >
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {isOffline ? 'Ready' : 'Online'}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'p-2.5 mx-2 mb-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-[10px] font-mono shrink-0 shadow-3xs transition-all',
            isOffline
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
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
