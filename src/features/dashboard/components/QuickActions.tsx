import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Bot, Bug, Code2, GraduationCap } from 'lucide-react'

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Ask AI Tutor',
      description: 'Socratic dialogue on data structures and syntax',
      path: '/tutor',
      icon: Bot,
      color: 'bg-brand-600 text-white border border-brand-500',
    },
    {
      title: 'Debug My Code',
      description: 'Find bugs and receive step-by-step root cause analysis',
      path: '/debugger',
      icon: Bug,
      color: 'bg-red-600 text-white border border-red-500',
    },
    {
      title: 'Code Practice',
      description: 'Solve university algorithmic challenges offline',
      path: '/practice',
      icon: Code2,
      color: 'bg-accent-600 text-white border border-accent-500',
    },
    {
      title: 'Browse Courses',
      description: 'Explore full curriculum modules for Python, Java, JS',
      path: '/learning',
      icon: GraduationCap,
      color: 'bg-sky-600 text-white border border-sky-500',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Access Workspaces</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              to={action.path}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 bg-slate-50 dark:bg-slate-950/40 transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${action.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-500 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
