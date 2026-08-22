import React, { memo } from 'react'
import { TopicMastery } from '@/types'
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from '@/components/ui'
import { Code2 } from 'lucide-react'

export const TopicProgressGrid: React.FC<{ masteries: TopicMastery[] }> = memo(({ masteries }) => {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
              <Code2 className="w-4 h-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Topic & Language Mastery
            </CardTitle>
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            Curriculum Standards
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
        {masteries.map((topic) => (
          <div
            key={topic.topic}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3 flex flex-col justify-between shadow-2xs"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="sm" className="text-[10px] uppercase font-mono font-bold">
                  {topic.language}
                </Badge>
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                  {topic.masteryPercentage}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
                {topic.topic}
              </h4>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>Completed</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {topic.problemsSolved}/{topic.totalProblems} Solved
                </span>
              </div>
              <Progress value={topic.masteryPercentage} variant="brand" size="sm" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
})

TopicProgressGrid.displayName = 'TopicProgressGrid'
