import React, { useEffect } from 'react'
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
  X,
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

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full flex flex-col p-4 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4 text-accent-300" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              CodeTutor Africa
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = iconMap[item.iconName] || LayoutDashboard

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
          CodeTutor Africa • Offline Edition
        </div>
      </div>
    </div>
  )
}
