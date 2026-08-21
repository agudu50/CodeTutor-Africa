import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Button, Progress } from '@/components/ui'
import { AlertCircle, ArrowRight } from 'lucide-react'

interface WeakArea {
  topic: string
  subject: string
  accuracy: number
  recommendedPracticeId: string
}

export const WeakAreasCard: React.FC<{ weakAreas: WeakArea[] }> = ({ weakAreas }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
            </div>
            <CardTitle className="text-base">Focus Areas</CardTitle>
          </div>
          <span className="text-[11px] text-slate-400">Personalized Insights</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        {weakAreas.map((area) => (
          <div
            key={area.topic}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{area.topic}</h4>
                <p className="text-[10px] text-slate-500">{area.subject}</p>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                {area.accuracy}% Accuracy
              </span>
            </div>

            <Progress value={area.accuracy} variant="amber" size="sm" />

            <div className="flex justify-end pt-1">
              <Link to={`/practice/${area.recommendedPracticeId}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-brand-600 dark:text-brand-400" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Practice Topic
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
