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
      iconColor: 'text-brand-600 dark:text-brand-400',
      iconBg: 'bg-brand-50 dark:bg-brand-950/70 border-brand-200 dark:border-brand-800/80',
      tag: '100% Offline',
    },
    {
      title: 'Coding Arcade',
      description: 'Play rapid-fire typing racers, bug blitz, and output predictor games',
      path: '/games',
      icon: Gamepad2,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/80',
      tag: 'Mini-Games',
    },
    {
      title: 'Debug My Code',
      description: 'Find mistakes, trace execution, and get step-by-step root cause fixes',
      path: '/debugger',
      icon: Bug,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800/80',
      tag: 'Plain English',
    },
    {
      title: 'Code Practice',
      description: 'Solve curated coding challenges and run automated test suites',
      path: '/practice',
      icon: Code2,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800/80',
      tag: '50+ Problems',
    },
  ]

  return (
    <Card className="h-full flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                <Zap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Quick Access Workspaces
              </CardTitle>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
              Instant Launch
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-700 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-150 group flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2 rounded-xl border ${action.iconBg} ${action.iconColor} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {action.tag}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
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
