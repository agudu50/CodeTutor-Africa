import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Loading CodeTutor Africa...',
}) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 animate-pulse flex items-center justify-center text-brand-500">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
        {message}
      </p>
    </div>
  )
}
