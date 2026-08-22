import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Button, Progress } from '@/components/ui'
import { AlertCircle, ArrowRight, Target } from 'lucide-react'

interface WeakArea {
  topic: string
  subject: string
  accuracy: number
  recommendedPracticeId: string
}

export const WeakAreasCard: React.FC<{ weakAreas: WeakArea[] }> = memo(({ weakAreas }) => {
  return (
    <Card className="h-full flex flex-col justify-between border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Focus Areas
              </CardTitle>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
              Personalized Insights
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-3 pt-4">
          {weakAreas.map((area) => (
            <div
              key={area.topic}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{area.topic}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{area.subject}</p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/70 shrink-0">
                  {area.accuracy}% Accuracy
                </span>
              </div>

              <Progress value={area.accuracy} variant="amber" size="sm" />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Recommended review
                </span>
                <Link to={`/practice/${area.recommendedPracticeId}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    Practice Topic
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </div>

      <div className="p-4 pt-0">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <Target className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
          <span>Practicing focus areas increases mastery by up to 2.4x.</span>
        </div>
      </div>
    </Card>
  )
})

WeakAreasCard.displayName = 'WeakAreasCard'
