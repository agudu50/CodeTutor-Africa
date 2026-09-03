import React, { useState, useEffect } from 'react'
import { Course } from '@/types'
import { Modal } from '@/components/ui'
import { courseStoreService } from '@/services/learning/course-store.service'
import {
  Lock,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'

interface CourseModuleLockModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
  onUpdated?: () => void
}

export const CourseModuleLockModal: React.FC<CourseModuleLockModalProps> = ({
  isOpen,
  onClose,
  course,
  onUpdated,
}) => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(course)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (course) {
      const refreshed = courseStoreService.getCourseById(course.id) || course
      setCurrentCourse(refreshed)
    }
  }, [course, isOpen])

  if (!currentCourse) return null

  const allModulesUnlocked =
    currentCourse.isUnlockedByAdmin ||
    (currentCourse.modules.length > 0 &&
      currentCourse.modules.every((m) => m.isUnlockedByAdmin))

  const handleToggleUnlockAll = () => {
    const nextStatus = !allModulesUnlocked
    courseStoreService.unlockAllModulesForCourse(currentCourse.id, nextStatus)
    const refreshed = courseStoreService.getCourseById(currentCourse.id)
    if (refreshed) setCurrentCourse(refreshed)
    setFeedback(
      nextStatus
        ? '🔓 All modules unlocked for learners! Sequential restrictions bypassed.'
        : '🔒 Sequential module locking restored.'
    )
    if (onUpdated) onUpdated()
  }

  const handleToggleModule = (moduleId: string, title: string) => {
    const targetMod = currentCourse.modules.find((m) => m.id === moduleId)
    const nextStatus = !targetMod?.isUnlockedByAdmin
    courseStoreService.toggleModuleUnlock(currentCourse.id, moduleId, nextStatus)
    const refreshed = courseStoreService.getCourseById(currentCourse.id)
    if (refreshed) setCurrentCourse(refreshed)
    setFeedback(
      nextStatus
        ? `🔓 "${title}" unlocked for learners!`
        : `🔒 "${title}" sequential lock restored.`
    )
    if (onUpdated) onUpdated()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin & Mentor: Module Access & Lock Manager"
      description={`Manage module access restrictions and learner progression for ${currentCourse.title}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Feedback Alert */}
        {feedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/90 text-[#005F02] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center justify-between gap-3 shadow-md animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs opacity-75 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Global Master Override Card */}
        <div className="p-4 sm:p-5 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#12161C] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-3xs ${
              allModulesUnlocked
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800'
            }`}>
              {allModulesUnlocked ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <Lock className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Course Pacing Mode
                </h3>
                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black border uppercase shadow-3xs ${
                  allModulesUnlocked
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}>
                  {allModulesUnlocked ? 'All Modules Unlocked (Open Access)' : 'Sequential Pacing Active'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {allModulesUnlocked
                  ? 'Learners can access and complete any module without prerequisite completion locks.'
                  : 'Learners must complete prior modules 100% before unlocking subsequent weeks.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleUnlockAll}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-black border-2 cursor-pointer shadow-2xs transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2 ${
              allModulesUnlocked
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-200'
                : 'bg-[#005F02] hover:bg-emerald-700 text-white border-[#005F02]'
            }`}
          >
            {allModulesUnlocked ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Lock Sequential Pacing</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock All Modules</span>
              </>
            )}
          </button>
        </div>

        {/* Modules Breakdown List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300 px-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <BookOpen className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
              Modules in Course ({currentCourse.modules.length})
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Individual Override Controls
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {currentCourse.modules.map((mod, idx) => {
              const isFirst = idx === 0
              const isExplicitlyUnlocked = Boolean(mod.isUnlockedByAdmin || currentCourse.isUnlockedByAdmin)
              const isEffectivelyUnlocked = isFirst || isExplicitlyUnlocked
              const assignedWeek =
                mod.weekNumber ||
                Math.min(currentCourse.estimatedWeeks || 8, Math.floor(idx / 2) + 1)

              return (
                <div
                  key={mod.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isEffectivelyUnlocked
                      ? 'bg-white dark:bg-[#0E1318] border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                      : 'bg-slate-50 dark:bg-[#0A0D11] border-slate-300 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 border-2 shadow-3xs ${
                        isEffectivelyUnlocked
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          Week {assignedWeek}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {mod.lessons.length} {mod.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                        </span>
                        {isFirst ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Intro Module (Always Open)
                          </span>
                        ) : isExplicitlyUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-3xs">
                            <ShieldCheck className="w-3 h-3" /> Unlocked by Mentor/Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            <Lock className="w-2.5 h-2.5" /> Sequential Lock (Needs Mod {idx})
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {mod.title}
                      </h4>
                    </div>
                  </div>

                  {/* Action Button for Non-First Modules */}
                  {!isFirst && (
                    <button
                      type="button"
                      onClick={() => handleToggleModule(mod.id, mod.title)}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold border-2 cursor-pointer shadow-3xs transition-all active:scale-95 shrink-0 inline-flex items-center justify-center gap-1.5 self-end sm:self-auto ${
                        mod.isUnlockedByAdmin
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 dark:bg-emerald-950/80 text-[#005F02] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {mod.isUnlockedByAdmin ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Re-lock for Learners</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400" />
                          <span>Unlock for Learners</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-mono font-black bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-200 cursor-pointer shadow-3xs active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}
