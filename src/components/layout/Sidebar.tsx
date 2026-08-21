import React from 'react'
import { NavLink } from 'react-router-dom'
import { NAVIGATION_ITEMS } from '@/app/config/navigation'
import { cn } from '@/utils/cn'
import {
  LayoutDashboard,
  Bot,
  Code2,
  Bug,
  GraduationCap,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Bot,
  Code2,
  Bug,
  GraduationCap,
  BarChart3,
  Settings,
}

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/95 transition-all duration-300 select-none z-30 shrink-0 sticky top-0 h-screen',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shrink-0 border border-brand-500">
            <Sparkles className="w-5 h-5 text-accent-300" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                CodeTutor <span className="text-brand-500 font-extrabold">Africa</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Offline AI Core
              </span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Main Features
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-500 rounded-r-md" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Offline Ready Banner */}
      {!collapsed && (
        <div className="p-3 mx-2 mb-3 rounded-xl border border-brand-500/20 bg-brand-500/5 dark:bg-brand-950/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-300">
            <BookOpenCheck className="w-4 h-4 text-brand-500 shrink-0" />
            <span>Zero Cloud Dependence</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Your university courses, exercises, and AI model run 100% offline.
          </p>
        </div>
      )}
    </aside>
  )
}
