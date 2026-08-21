import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { Bot, MessageSquare, ArrowRight } from 'lucide-react'

interface TutorSessionPreview {
  id: string
  title: string
  language: string
  lastUpdated: string
  messageCount: number
}

export const RecentTutorCard: React.FC<{ sessions: TutorSessionPreview[] }> = ({ sessions }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <CardTitle className="text-base">Recent AI Tutor Sessions</CardTitle>
          </div>
          <Link
            to="/tutor"
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
          >
            New Session <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {sessions.map((session) => (
          <Link
            key={session.id}
            to={`/tutor/session/${session.id}`}
            className="block p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 bg-slate-50/50 dark:bg-slate-950/40 transition-all hover:translate-x-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                {session.title}
              </span>
              <Badge variant="brand" size="sm">{session.language}</Badge>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> {session.messageCount} messages
              </span>
              <span>{session.lastUpdated}</span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
