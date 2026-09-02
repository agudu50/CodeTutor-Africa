import React, { useState, useEffect, useRef } from 'react'
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
  ChevronDown,
  Check,
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

/* ─── CUSTOM LANGUAGE TRACK DROPDOWN ────────────────────────────────────── */
interface CustomLanguageDropdownProps {
  value: GameLanguage | ''
  onChange: (val: GameLanguage) => void
}

const CustomLanguageDropdown: React.FC<CustomLanguageDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const tracks = LANGUAGE_TRACKS.filter((t) => t.id !== 'all')
  const selectedTrack = tracks.find((t) => t.id === value)

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-slate-900 border-2 transition-all cursor-pointer flex items-center justify-between shadow-xs ${
          isOpen
            ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        {selectedTrack ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase bg-emerald-50 text-[#005F02] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
              {selectedTrack.badge}
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate text-xs">
              {selectedTrack.title}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 font-medium text-xs">
            Select Language Track...
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-xl max-h-60 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {tracks.map((t) => {
            const isSelected = t.id === value
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange(t.id as GameLanguage)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                    {t.badge}
                  </span>
                  <span className="truncate">{t.title}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#005F02] dark:text-emerald-400 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── CUSTOM DRILL TYPE DROPDOWN ────────────────────────────────────────── */
interface CustomDrillTypeDropdownProps {
  value?: GameId | ''
  onChange: (val: GameId) => void
}

const CustomDrillTypeDropdown: React.FC<CustomDrillTypeDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const selectedOpt = DRILL_TYPE_OPTIONS.find((o) => o.id === value)

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border-2 transition-all cursor-pointer flex items-center justify-between text-xs font-bold shadow-xs ${
          isOpen
            ? 'border-[#005F02] ring-2 ring-[#005F02]/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        {selectedOpt ? (
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center shrink-0">
              <selectedOpt.icon className="w-3 h-3 text-[#005F02] dark:text-emerald-400" />
            </div>
            <span className="text-slate-900 dark:text-white truncate">{selectedOpt.label}</span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 font-medium text-xs truncate">
            Select Drill Type...
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {DRILL_TYPE_OPTIONS.map((opt) => {
            const isSelected = opt.id === value
            const OptIcon = opt.icon
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id)
                  setIsOpen(false)
                }}
                className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#005F02] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <OptIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#005F02] dark:text-emerald-400 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── CUSTOM DIFFICULTY DROPDOWN ────────────────────────────────────────── */
interface CustomDifficultyDropdownProps {
  value?: 'Beginner' | 'Intermediate' | 'Advanced' | ''
  onChange: (val: 'Beginner' | 'Intermediate' | 'Advanced') => void
}

const DIFFICULTY_CONFIG: Record<string, { label: string; pill: string; dot: string }> = {
  Beginner: {
    label: 'Beginner',
    pill: 'bg-emerald-50 text-[#005F02] dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  Intermediate: {
    label: 'Intermediate',
    pill: 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  Advanced: {
    label: 'Advanced',
    pill: 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
}

const CustomDifficultyDropdown: React.FC<CustomDifficultyDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const currentCfg = value ? DIFFICULTY_CONFIG[value] : null

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`py-1.5 px-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold shadow-xs ${
          currentCfg
            ? currentCfg.pill
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
        } ${isOpen ? 'ring-2 ring-slate-400/30' : ''}`}
      >
        {currentCfg ? (
          <>
            <span className={`w-2 h-2 rounded-full shrink-0 ${currentCfg.dot}`} />
            <span>{value}</span>
          </>
        ) : (
          <span className="font-medium text-xs">Select Difficulty...</span>
        )}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 shrink-0 ml-0.5 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-xl min-w-[150px] space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
            const isSelected = diff === value
            const cfg = DIFFICULTY_CONFIG[diff]
            return (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  onChange(diff)
                  setIsOpen(false)
                }}
                className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? `${cfg.pill} border`
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                  <span>{diff}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const GameModuleEditorModal: React.FC<GameModuleEditorModalProps> = ({
  isOpen,
  onClose,
  initialLanguage,
  editingModule,
  onSaved,
}) => {
  const [language, setLanguage] = useState<GameLanguage | ''>(
    editingModule ? editingModule.language : (initialLanguage || '')
  )
  const [moduleNumber, setModuleNumber] = useState<number>(1)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [drills, setDrills] = useState<GameDrillItem[]>([])

  useEffect(() => {
    if (editingModule) {
      setLanguage(editingModule.language || '')
      setModuleNumber(editingModule.moduleNumber || 1)
      setTitle(editingModule.title || '')
      setDescription(editingModule.description || '')
      setDrills(editingModule.drills ? [...editingModule.drills] : [])
    } else {
      setLanguage(initialLanguage || '')
      setModuleNumber(1)
      setTitle('')
      setDescription('')
      setDrills([
        { gameId: '' as any, title: '', difficulty: '' as any, estimatedMins: 2 },
        { gameId: '' as any, title: '', difficulty: '' as any, estimatedMins: 2 },
      ])
    }
  }, [editingModule, isOpen, initialLanguage])

  if (!isOpen) return null

  const handleAddDrill = () => {
    setDrills((prev) => [
      ...prev,
      {
        gameId: '' as any,
        title: '',
        difficulty: '' as any,
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
    if (!language) {
      alert('Please select a language track.')
      return
    }
    if (!title.trim()) {
      alert('Please enter a module title.')
      return
    }
    const unconfiguredDrill = drills.find((d) => !d.gameId || !d.difficulty)
    if (unconfiguredDrill) {
      alert('Please select both a drill type and difficulty for all interactive drills.')
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
              <CustomLanguageDropdown value={language} onChange={setLanguage} />
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

                    <CustomDrillTypeDropdown
                      value={drill.gameId}
                      onChange={(gameId) => handleUpdateDrill(idx, { gameId })}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 flex-1">
                      <label className="text-[10px] text-slate-500 font-bold">Difficulty:</label>
                      <CustomDifficultyDropdown
                        value={drill.difficulty}
                        onChange={(difficulty) => handleUpdateDrill(idx, { difficulty })}
                      />
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
