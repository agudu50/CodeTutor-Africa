import React from 'react'

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'Loading CodeTutor Africa...',
}) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white dark:bg-emerald-950/60 border border-emerald-500/30 p-1 flex items-center justify-center shadow-lg relative overflow-hidden">
          <img src="/logo.jpg" alt="CodeTutor Africa" className="w-full h-full object-cover rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
        {message}
      </p>
    </div>
  )
}
