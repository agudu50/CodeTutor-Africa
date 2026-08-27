import React, { useState, useEffect } from 'react'
import { gameStoreService } from '@/services/games/game-store.service'
import { GameLanguage, GameId } from '@/features/games/types/games.types'
import { GameChallengeEditorModal, EditableChallengeType } from './GameChallengeEditorModal'
import { Button } from '@/components/ui'
import {
  Zap,
  Bug,
  HelpCircle,
  Shuffle,
  Plus,
  X,
  RotateCcw,
  Search,
  CheckCircle2,
  Gamepad2,
  Clock,
  Settings,
} from 'lucide-react'

interface GameStudioViewProps {
  onUpdated?: () => void
}

export const GameStudioView: React.FC<GameStudioViewProps> = ({ onUpdated }) => {
  const [selectedTab, setSelectedTab] = useState<GameId | 'all'>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<EditableChallengeType | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const [speedrun, setSpeedrun] = useState(() => gameStoreService.getSpeedrunSnippets())
  const [bughunt, setBughunt] = useState(() => gameStoreService.getBugHuntChallenges())
  const [predictor, setPredictor] = useState(() => gameStoreService.getOutputPredictorChallenges())
  const [shuffle, setShuffle] = useState(() => gameStoreService.getCodeShuffleChallenges())

  const reloadData = () => {
    setSpeedrun(gameStoreService.getSpeedrunSnippets())
    setBughunt(gameStoreService.getBugHuntChallenges())
    setPredictor(gameStoreService.getOutputPredictorChallenges())
    setShuffle(gameStoreService.getCodeShuffleChallenges())
    onUpdated?.()
  }

  useEffect(() => {
    const handler = () => reloadData()
    window.addEventListener('games_updated', handler)
    return () => window.removeEventListener('games_updated', handler)
  }, [])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 3000)
    return () => clearTimeout(t)
  }, [toastMsg])

  const counts = gameStoreService.getAllChallengesCount()

  const handleOpenCreate = () => {
    setEditingChallenge(null)
    setIsModalOpen(true)
  }

  const handleEdit = (type: GameId, item: any) => {
    setEditingChallenge({ type: type as any, data: item })
    setIsModalOpen(true)
  }

  const handleDelete = (type: GameId, id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    if (type === 'speedrun') gameStoreService.deleteSpeedrunSnippet(id)
    if (type === 'bughunt') gameStoreService.deleteBugHuntChallenge(id)
    if (type === 'predictor') gameStoreService.deleteOutputPredictorChallenge(id)
    if (type === 'shuffle') gameStoreService.deleteCodeShuffleChallenge(id)
    reloadData()
    setToastMsg(`Deleted challenge "${title}".`)
  }

  const handleResetDefaults = () => {
    if (window.confirm('Reset all game challenges and snippets to default curriculum?')) {
      gameStoreService.resetToDefaults()
      reloadData()
      setToastMsg('Reset games to defaults.')
    }
  }

  // Combine items for rendering
  const allItems: { type: GameId; item: any }[] = []
  if (selectedTab === 'all' || selectedTab === 'speedrun') {
    speedrun.forEach((s) => allItems.push({ type: 'speedrun', item: s }))
  }
  if (selectedTab === 'all' || selectedTab === 'bughunt') {
    bughunt.forEach((b) => allItems.push({ type: 'bughunt', item: b }))
  }
  if (selectedTab === 'all' || selectedTab === 'predictor') {
    predictor.forEach((p) => allItems.push({ type: 'predictor', item: p }))
  }
  if (selectedTab === 'all' || selectedTab === 'shuffle') {
    shuffle.forEach((c) => allItems.push({ type: 'shuffle', item: c }))
  }

  const filteredItems = allItems.filter(({ item }) => {
    if (selectedLanguage !== 'all' && item.language !== selectedLanguage) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const titleMatch = item.title?.toLowerCase().includes(q)
      const descMatch = (item.description || item.goalDescription || '')?.toLowerCase().includes(q)
      const codeMatch = (item.code || (item.lines || []).join(' ') || '')?.toLowerCase().includes(q)
      if (!titleMatch && !descMatch && !codeMatch) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-18 right-4 sm:right-8 z-50 animate-in slide-in-from-top-3 fade-in">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-emerald-500 shadow-2xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* High Level Game Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-3xs">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block">Total Drills</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{counts.total}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-3xs">
          <span className="text-[10px] text-amber-500 font-sans font-bold uppercase block">⚡ Speedrun</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{counts.speedrun}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-3xs">
          <span className="text-[10px] text-rose-500 font-sans font-bold uppercase block">🐛 Bug Hunt</span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400">{counts.bughunt}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-3xs">
          <span className="text-[10px] text-indigo-500 font-sans font-bold uppercase block">❓ Predictor</span>
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{counts.predictor}</span>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-3xs">
          <span className="text-[10px] text-emerald-500 font-sans font-bold uppercase block">🔀 Shuffle</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{counts.shuffle}</span>
        </div>
      </div>

      {/* Filter & Action Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Search & Language Dropdown */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges by title, code..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as GameLanguage)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="all">All Languages</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="typescript">TypeScript</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="h-8 text-xs font-semibold"
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            Reset Defaults
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenCreate()}
            className="h-8 font-bold bg-[#005F02] hover:bg-[#004e02] text-white shadow-xs px-3.5"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Challenge
          </Button>
        </div>
      </div>

      {/* Game Mode Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'all', label: `All Modes (${counts.total})`, icon: Gamepad2 },
          { id: 'speedrun', label: `Speedrun (${counts.speedrun})`, icon: Zap },
          { id: 'bughunt', label: `Bug Hunt (${counts.bughunt})`, icon: Bug },
          { id: 'predictor', label: `Predictor (${counts.predictor})`, icon: HelpCircle },
          { id: 'shuffle', label: `Code Shuffle (${counts.shuffle})`, icon: Shuffle },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = selectedTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap shadow-3xs ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-[#005F02] dark:text-emerald-400 border-emerald-500 font-extrabold shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Challenges List Cards */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No game challenges match your current filter. Click "Add Challenge" to create one!
          </div>
        ) : (
          filteredItems.map(({ type, item }, idx) => {
            const isSpeedrun = type === 'speedrun'
            const isBughunt = type === 'bughunt'
            const isPredictor = type === 'predictor'

            const badgeColor = isSpeedrun
              ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
              : isBughunt
              ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
              : isPredictor
              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'

            const iconMap = {
              speedrun: Zap,
              bughunt: Bug,
              predictor: HelpCircle,
              shuffle: Shuffle,
            }
            const Icon = iconMap[type]

            return (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-3xs hover:border-emerald-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                {/* Left details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                      <Icon className="w-3 h-3" />
                      <span>{type}</span>
                    </span>

                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.language}
                    </span>

                    {item.courseTitle && (
                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">
                        {item.courseTitle}
                      </span>
                    )}

                    {item.lessonTitle && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        • {item.lessonTitle}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                    {item.description || item.goalDescription || item.explanation || 'No description'}
                  </p>
                </div>

                {/* Right metadata and buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {item.timeLimitSecs && (
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.timeLimitSecs}s</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEdit(type, item)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Edit challenge"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(type, item.id, item.title)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                      title="Delete challenge"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Editor Modal */}
      <GameChallengeEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={selectedTab === 'all' ? 'speedrun' : selectedTab}
        editingChallenge={editingChallenge}
        onSaved={(msg) => {
          reloadData()
          setToastMsg(msg)
        }}
      />
    </div>
  )
}
