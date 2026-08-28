import React, { useState, useEffect } from 'react'
import type { GameLanguage, GameId } from '@/features/games/types/games.types'
import type { GameModuleItem, GameDrillItem } from '@/features/games/data/gameModulesData'
import { LANGUAGE_TRACKS } from '@/features/games/data/gameModulesData'
import { gameStoreService } from '@/services/games/game-store.service'
import { Button } from '@/components/ui'
import {
  X,
  BookOpen,
  Plus,
  Trash2,
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
  Clock,
  Layers,
} from 'lucide-react'

interface GameModuleEditorModalProps {
  isOpen: boolean
  onClose: () => void
  initialLanguage?: GameLanguage
  editingModule?: GameModuleItem | null
  onSaved: (msg: string) => void
}

const DRILL_TYPE_OPTIONS: { id: GameId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'speedrun', label: 'Syntax Speedrun', icon: Zap },
  { id: 'bughunt', label: 'Bug Hunt', icon: Bug },
  { id: 'predictor', label: 'Output Predictor', icon: HelpCircle },
  { id: 'shuffle', label: 'Code Shuffle', icon: Shuffle },
]

export const GameModuleEditorModal: React.FC<GameModuleEditorModalProps> = ({
  isOpen,
  onClose,
  initialLanguage = 'python',
  editingModule,
  onSaved,
}) => {
  const [language, setLanguage] = useState<GameLanguage>(initialLanguage)
  const [moduleNumber, setModuleNumber] = useState<number>(1)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [drills, setDrills] = useState<GameDrillItem[]>([])

  useEffect(() => {
    if (editingModule) {
      setLanguage(editingModule.language || initialLanguage)
      setModuleNumber(editingModule.moduleNumber || 1)
      setTitle(editingModule.title || '')
      setDescription(editingModule.description || '')
      setDrills(editingModule.drills ? [...editingModule.drills] : [])
    } else {
      setLanguage(initialLanguage === 'all' ? 'python' : initialLanguage)
      const existing = gameStoreService.getModulesForLanguage(initialLanguage)
      setModuleNumber((existing?.length || 0) + 1)
      setTitle('')
      setDescription('')
      setDrills([
        { gameId: 'speedrun', title: 'Core Syntax Drill', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Common Mistakes Fix', difficulty: 'Beginner', estimatedMins: 2 },
      ])
    }
  }, [editingModule, initialLanguage, isOpen])

  if (!isOpen) return null

  const handleAddDrill = () => {
    setDrills((prev) => [
      ...prev,
      {
        gameId: 'speedrun',
        title: `New Drill ${prev.length + 1}`,
        difficulty: 'Beginner',
        estimatedMins: 2,
      },
    ])
  }

  const handleRemoveDrill = (idx: number) => {
    setDrills((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpdateDrill = (idx: number, updates: Partial<GameDrillItem>) => {
    setDrills((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], ...updates }
      return copy
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter a module title.')
      return
    }

    const payload: Omit<GameModuleItem, 'id'> = {
      moduleNumber,
      title: title.trim(),
      language,
      description: description.trim(),
      drills,
      defaultProgress: editingModule?.defaultProgress || 0,
    }

    if (editingModule && editingModule.id) {
      gameStoreService.updateModule(editingModule.language, editingModule.id, payload)
      onSaved(`Updated Module ${moduleNumber}: "${title}".`)
    } else {
      gameStoreService.createModule(language, payload)
      onSaved(`Created Module ${moduleNumber}: "${title}".`)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {editingModule ? `Edit Module ${editingModule.moduleNumber}` : 'Create New Curriculum Module'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Structure lessons and associated mini-game drills under this language track.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Language & Module Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Language Track</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as GameLanguage)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              >
                {LANGUAGE_TRACKS.filter((t) => t.id !== 'all').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.badge} - {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Module Order Number</label>
              <input
                type="number"
                value={moduleNumber}
                onChange={(e) => setModuleNumber(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Module Title */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Module Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Your First Lines of Code or Decision Making with if-else"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Module Summary & Key Concepts
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Main method signature, print statements, variables, and type casting."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Drills Section */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Interactive Mini-Game Drills ({drills.length})</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDrill}
                className="h-7 text-[11px] font-bold"
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add Drill
              </Button>
            </div>

            <div className="space-y-2">
              {drills.map((drill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[10px] text-slate-400">
                      Drill #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDrill(idx)}
                      className="text-rose-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={drill.title}
                        onChange={(e) => handleUpdateDrill(idx, { title: e.target.value })}
                        placeholder="Drill Title (e.g. Variable Declarations)"
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs"
                      />
                    </div>

                    <div>
                      <select
                        value={drill.gameId}
                        onChange={(e) => handleUpdateDrill(idx, { gameId: e.target.value as GameId })}
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs"
                      >
                        {DRILL_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 flex-1">
                      <label className="text-[10px] text-slate-500">Difficulty:</label>
                      <select
                        value={drill.difficulty}
                        onChange={(e) =>
                          handleUpdateDrill(idx, {
                            difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced',
                          })
                        }
                        className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-900 dark:text-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        value={drill.estimatedMins}
                        onChange={(e) => handleUpdateDrill(idx, { estimatedMins: Number(e.target.value) })}
                        min={1}
                        max={15}
                        className="w-14 p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-900 dark:text-white text-center"
                      />
                      <span className="text-[10px] text-slate-400">mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="bg-[#005F02] hover:bg-[#004e02] text-white font-bold px-4"
            >
              {editingModule ? 'Save Changes' : 'Create Module'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
