import React from 'react'
import { TopicMastery } from '@/types'
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from '@/components/ui'

export const TopicProgressGrid: React.FC<{ masteries: TopicMastery[] }> = ({ masteries }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Topic & Language Mastery</CardTitle>
          <span className="text-xs text-slate-400">Curriculum Standards</span>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {masteries.map((topic) => (
          <div
            key={topic.topic}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{topic.topic}</h4>
                <div className="flex items-center gap-1.5">
                  <Badge variant="brand" size="sm" className="text-[10px] uppercase font-mono">
                    {topic.language}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {topic.problemsSolved}/{topic.totalProblems} Solved
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                {topic.masteryPercentage}%
              </span>
            </div>

            <Progress value={topic.masteryPercentage} variant="brand" size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
