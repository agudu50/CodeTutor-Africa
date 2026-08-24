import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'delete'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, message, type = 'info', duration = 3500 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      const newToast: ToastItem = { id, title, message, type, duration }

      setToasts((prev) => [...prev.slice(-3), newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const success = useCallback((message: string, title?: string) => {
    showToast({ type: 'success', message, title })
  }, [showToast])

  const error = useCallback((message: string, title?: string) => {
    showToast({ type: 'error', message, title })
  }, [showToast])

  const info = useCallback((message: string, title?: string) => {
    showToast({ type: 'info', message, title })
  }, [showToast])

  const warning = useCallback((message: string, title?: string) => {
    showToast({ type: 'warning', message, title })
  }, [showToast])

  // Listen to global course_deleted events so all deletions anywhere trigger a toast popup
  useEffect(() => {
    const handleCourseDeleted = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; title: string }>
      const courseTitle = customEvent.detail?.title || 'Course'
      showToast({
        type: 'delete',
        title: 'Course Deleted',
        message: `"${courseTitle}" has been removed from your local offline library.`,
        duration: 4000,
      })
    }

    const handleAppToast = (event: Event) => {
      const customEvent = event as CustomEvent<Omit<ToastItem, 'id'>>
      if (customEvent.detail) {
        showToast(customEvent.detail)
      }
    }

    window.addEventListener('course_deleted', handleCourseDeleted)
    window.addEventListener('app_toast', handleAppToast)

    return () => {
      window.removeEventListener('course_deleted', handleCourseDeleted)
      window.removeEventListener('app_toast', handleAppToast)
    }
  }, [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}

      {/* Floating Toast Notification Stack Container */}
      <div className="fixed top-5 right-4 sm:right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const isDelete = t.type === 'delete'
            const isSuccess = t.type === 'success'
            const isError = t.type === 'error'
            const isWarning = t.type === 'warning'

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`pointer-events-auto w-full rounded-2xl p-3.5 shadow-2xl border backdrop-blur-md transition-colors ${
                  isDelete || isError
                    ? 'bg-slate-900/95 dark:bg-slate-950/95 border-rose-500/40 text-slate-100'
                    : isSuccess
                    ? 'bg-slate-900/95 dark:bg-slate-950/95 border-[#005F02]/60 text-slate-100'
                    : isWarning
                    ? 'bg-slate-900/95 dark:bg-slate-950/95 border-amber-500/40 text-slate-100'
                    : 'bg-slate-900/95 dark:bg-slate-950/95 border-slate-700/60 text-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                        isDelete || isError
                          ? 'bg-rose-500/20 text-rose-400'
                          : isSuccess
                          ? 'bg-[#005F02]/25 text-[#52c256]'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {isDelete ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isError || isWarning ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <HelpCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0 pr-1 space-y-0.5">
                      {t.title && (
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {t.title}
                        </h4>
                      )}
                      <p className="text-xs text-slate-300 leading-snug break-words">
                        {t.message}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(t.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    aria-label="Dismiss toast"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
