import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Bot, Bug, Code2, Gamepad2, ArrowRight, Zap } from 'lucide-react'

export const QuickActions: React.FC = memo(() => {
  const actions = [
    {
      title: 'Ask AI Tutor',
      description: 'Socratic 1-on-1 dialogue on concepts, logic, and syntax',
      path: '/tutor',
      icon: Bot,
      iconColor: 'text-[#005F02] dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200/80 dark:border-emerald-800/80',
      hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
      tag: '100% Offline',
      tagColor: 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80',
    },
    {
      title: 'Coding Arcade',
      description: 'Play rapid-fire typing racers, bug blitz, and output predictor games',
      path: '/games',
      icon: Gamepad2,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200/80 dark:border-amber-800/80',
      hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-600',
      tag: 'Mini-Games',
      tagColor: 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80',
    },
    {
      title: 'Debug My Code',
      description: 'Find mistakes, trace execution, and get step-by-step root cause fixes',
      path: '/debugger',
      icon: Bug,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200/80 dark:border-rose-800/80',
      hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-600',
      tag: 'Plain English',
      tagColor: 'bg-rose-100/80 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80',
    },
    {
      title: 'Code Practice',
      description: 'Solve curated coding challenges and run automated test suites',
      path: '/practice',
      icon: Code2,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200/80 dark:border-cyan-800/80',
      hoverBorder: 'hover:border-cyan-400 dark:hover:border-cyan-600',
      tag: '50+ Problems',
      tagColor: 'bg-cyan-100/80 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/80',
    },
  ]

  return (
    <Card className="h-full flex flex-col justify-between border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden">
      <div>
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#005F02] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0 shadow-3xs">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  Quick Access Workspaces
                </CardTitle>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  Launch interactive learning tools & drills
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hidden sm:inline shrink-0 shadow-3xs">
              Instant Launch
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className={`p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 ${action.hoverBorder} bg-slate-50/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-150 group flex flex-col justify-between space-y-3 shadow-3xs hover:shadow-xs`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2 rounded-xl border ${action.iconBg} ${action.iconColor} group-hover:scale-105 transition-transform shrink-0 shadow-3xs`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${action.tagColor}`}>
                        {action.tag}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all hidden xs:block" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#005F02] dark:group-hover:text-emerald-400 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {action.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  )
})

QuickActions.displayName = 'QuickActions'
