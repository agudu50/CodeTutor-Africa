import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Bug, Code2, Gamepad2, ArrowRight, Zap } from 'lucide-react'

export const QuickActions: React.FC = memo(() => {
  const actions = [
    {
      title: 'Ask AI Tutor',
      description: 'Socratic 1-on-1 dialogue on concepts, logic, and syntax',
      path: '/tutor',
      icon: Bot,
      iconColor: 'text-white',
      iconBg: 'bg-[#005F02]',
      tag: '100% Offline',
      tagColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    },
    {
      title: 'Coding Arcade',
      description: 'Play rapid-fire typing racers, bug blitz, and output predictor games',
      path: '/games',
      icon: Gamepad2,
      iconColor: 'text-white',
      iconBg: 'bg-amber-500',
      tag: 'Mini-Games',
      tagColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    },
    {
      title: 'Debug My Code',
      description: 'Find mistakes, trace execution, and get step-by-step root cause fixes',
      path: '/debugger',
      icon: Bug,
      iconColor: 'text-white',
      iconBg: 'bg-rose-500',
      tag: 'Plain English',
      tagColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800',
    },
    {
      title: 'Code Practice',
      description: 'Solve curated coding challenges and run automated test suites',
      path: '/practice',
      icon: Code2,
      iconColor: 'text-white',
      iconBg: 'bg-cyan-600',
      tag: '50+ Problems',
      tagColor: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 border-cyan-300 dark:border-cyan-800',
    },
  ]

  return (
    <div className="h-full flex flex-col justify-between border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1318] shadow-xs rounded-3xl p-5 sm:p-6 space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[#005F02] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-3xs">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              Quick Access Workspaces
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
              Launch interactive learning tools & drills
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700 hidden sm:inline shrink-0 shadow-3xs">
          Instant Launch
        </span>
      </div>

      {/* Grid of 4 Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              to={action.path}
              className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-[#005F02] dark:hover:border-emerald-500 bg-slate-50 dark:bg-[#161B22] hover:bg-white dark:hover:bg-[#1C232B] transition-all duration-150 group flex flex-col justify-between space-y-3 shadow-3xs cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`w-9 h-9 rounded-xl ${action.iconBg} ${action.iconColor} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-3xs`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border shadow-3xs ${action.tagColor}`}>
                    {action.tag}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005F02] dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2 font-normal">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
})

QuickActions.displayName = 'QuickActions'
