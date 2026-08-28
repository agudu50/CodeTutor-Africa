import {
  SpeedrunSnippet,
  BugHuntChallenge,
  OutputPredictorChallenge,
  CodeShuffleChallenge,
  GameLanguage,
} from '@/features/games/types/games.types'
import {
  SPEEDRUN_SNIPPETS,
  BUG_HUNT_CHALLENGES,
  OUTPUT_PREDICTOR_CHALLENGES,
  CODE_SHUFFLE_CHALLENGES,
} from '@/features/games/data/gameData'

const SPEEDRUN_STORAGE_KEY = 'codetutor_games_speedrun'
const BUGHUNT_STORAGE_KEY = 'codetutor_games_bughunt'
const PREDICTOR_STORAGE_KEY = 'codetutor_games_predictor'
const SHUFFLE_STORAGE_KEY = 'codetutor_games_shuffle'
const MODULE_PROGRESS_STORAGE_KEY = 'codetutor_game_module_progress'

export interface ModuleGameProgress {
  [moduleId: string]: {
    completedCount: number
    totalCount: number
    percentage: number
  }
}

class GameStoreService {
  private speedrun: SpeedrunSnippet[] = []
  private bughunt: BugHuntChallenge[] = []
  private predictor: OutputPredictorChallenge[] = []
  private shuffle: CodeShuffleChallenge[] = []
  private moduleProgress: ModuleGameProgress = {}

  constructor() {
    this.init()
  }

  private init() {
    try {
      const sr = localStorage.getItem(SPEEDRUN_STORAGE_KEY)
      this.speedrun = sr ? JSON.parse(sr) : [...SPEEDRUN_SNIPPETS]

      const bh = localStorage.getItem(BUGHUNT_STORAGE_KEY)
      this.bughunt = bh ? JSON.parse(bh) : [...BUG_HUNT_CHALLENGES]

      const op = localStorage.getItem(PREDICTOR_STORAGE_KEY)
      this.predictor = op ? JSON.parse(op) : [...OUTPUT_PREDICTOR_CHALLENGES]

      const cs = localStorage.getItem(SHUFFLE_STORAGE_KEY)
      this.shuffle = cs ? JSON.parse(cs) : [...CODE_SHUFFLE_CHALLENGES]

      const mp = localStorage.getItem(MODULE_PROGRESS_STORAGE_KEY)
      this.moduleProgress = mp ? JSON.parse(mp) : {}
    } catch (e) {
      console.warn('Failed to load game store from localStorage', e)
      this.speedrun = [...SPEEDRUN_SNIPPETS]
      this.bughunt = [...BUG_HUNT_CHALLENGES]
      this.predictor = [...OUTPUT_PREDICTOR_CHALLENGES]
      this.shuffle = [...CODE_SHUFFLE_CHALLENGES]
    }
  }

  private save() {
    try {
      localStorage.setItem(SPEEDRUN_STORAGE_KEY, JSON.stringify(this.speedrun))
      localStorage.setItem(BUGHUNT_STORAGE_KEY, JSON.stringify(this.bughunt))
      localStorage.setItem(PREDICTOR_STORAGE_KEY, JSON.stringify(this.predictor))
      localStorage.setItem(SHUFFLE_STORAGE_KEY, JSON.stringify(this.shuffle))
      localStorage.setItem(MODULE_PROGRESS_STORAGE_KEY, JSON.stringify(this.moduleProgress))
      window.dispatchEvent(new CustomEvent('games_updated'))
    } catch (e) {
      console.warn('Failed to save games to localStorage', e)
    }
  }

  // ─── GETTERS ───
  getSpeedrunSnippets(language?: GameLanguage, courseId?: string, moduleId?: string): SpeedrunSnippet[] {
    return this.speedrun.filter((s) => {
      if (language && language !== 'all' && s.language !== language) return false
      if (courseId && courseId !== 'all' && s.courseId && s.courseId !== courseId) return false
      if (moduleId && s.courseId !== moduleId && s.lessonTitle !== moduleId) return true
      return true
    })
  }

  getBugHuntChallenges(language?: GameLanguage, courseId?: string): BugHuntChallenge[] {
    return this.bughunt.filter((b) => {
      if (language && language !== 'all' && b.language !== language) return false
      if (courseId && courseId !== 'all' && b.courseId && b.courseId !== courseId) return false
      return true
    })
  }

  getOutputPredictorChallenges(language?: GameLanguage, courseId?: string): OutputPredictorChallenge[] {
    return this.predictor.filter((p) => {
      if (language && language !== 'all' && p.language !== language) return false
      if (courseId && courseId !== 'all' && p.courseId && p.courseId !== courseId) return false
      return true
    })
  }

  getCodeShuffleChallenges(language?: GameLanguage, courseId?: string): CodeShuffleChallenge[] {
    return this.shuffle.filter((c) => {
      if (language && language !== 'all' && c.language !== language) return false
      if (courseId && courseId !== 'all' && c.courseId && c.courseId !== courseId) return false
      return true
    })
  }

  getAllChallengesCount(): { total: number; speedrun: number; bughunt: number; predictor: number; shuffle: number } {
    return {
      total: this.speedrun.length + this.bughunt.length + this.predictor.length + this.shuffle.length,
      speedrun: this.speedrun.length,
      bughunt: this.bughunt.length,
      predictor: this.predictor.length,
      shuffle: this.shuffle.length,
    }
  }

  // ─── ADMIN CREATION & MODIFICATION ───
  createSpeedrunSnippet(data: Omit<SpeedrunSnippet, 'id'>): SpeedrunSnippet {
    const item: SpeedrunSnippet = { ...data, id: `sr-${Date.now()}` }
    this.speedrun.unshift(item)
    this.save()
    return item
  }

  updateSpeedrunSnippet(id: string, updates: Partial<SpeedrunSnippet>): SpeedrunSnippet | undefined {
    const idx = this.speedrun.findIndex((s) => s.id === id)
    if (idx === -1) return undefined
    this.speedrun[idx] = { ...this.speedrun[idx], ...updates }
    this.save()
    return this.speedrun[idx]
  }

  deleteSpeedrunSnippet(id: string): boolean {
    const prevLen = this.speedrun.length
    this.speedrun = this.speedrun.filter((s) => s.id !== id)
    if (this.speedrun.length !== prevLen) {
      this.save()
      return true
    }
    return false
  }

  createBugHuntChallenge(data: Omit<BugHuntChallenge, 'id'>): BugHuntChallenge {
    const item: BugHuntChallenge = { ...data, id: `bh-${Date.now()}` }
    this.bughunt.unshift(item)
    this.save()
    return item
  }

  updateBugHuntChallenge(id: string, updates: Partial<BugHuntChallenge>): BugHuntChallenge | undefined {
    const idx = this.bughunt.findIndex((b) => b.id === id)
    if (idx === -1) return undefined
    this.bughunt[idx] = { ...this.bughunt[idx], ...updates }
    this.save()
    return this.bughunt[idx]
  }

  deleteBugHuntChallenge(id: string): boolean {
    const prevLen = this.bughunt.length
    this.bughunt = this.bughunt.filter((b) => b.id !== id)
    if (this.bughunt.length !== prevLen) {
      this.save()
      return true
    }
    return false
  }

  createOutputPredictorChallenge(data: Omit<OutputPredictorChallenge, 'id'>): OutputPredictorChallenge {
    const item: OutputPredictorChallenge = { ...data, id: `op-${Date.now()}` }
    this.predictor.unshift(item)
    this.save()
    return item
  }

  updateOutputPredictorChallenge(id: string, updates: Partial<OutputPredictorChallenge>): OutputPredictorChallenge | undefined {
    const idx = this.predictor.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    this.predictor[idx] = { ...this.predictor[idx], ...updates }
    this.save()
    return this.predictor[idx]
  }

  deleteOutputPredictorChallenge(id: string): boolean {
    const prevLen = this.predictor.length
    this.predictor = this.predictor.filter((p) => p.id !== id)
    if (this.predictor.length !== prevLen) {
      this.save()
      return true
    }
    return false
  }

  createCodeShuffleChallenge(data: Omit<CodeShuffleChallenge, 'id'>): CodeShuffleChallenge {
    const item: CodeShuffleChallenge = { ...data, id: `cs-${Date.now()}` }
    this.shuffle.unshift(item)
    this.save()
    return item
  }

  updateCodeShuffleChallenge(id: string, updates: Partial<CodeShuffleChallenge>): CodeShuffleChallenge | undefined {
    const idx = this.shuffle.findIndex((c) => c.id === id)
    if (idx === -1) return undefined
    this.shuffle[idx] = { ...this.shuffle[idx], ...updates }
    this.save()
    return this.shuffle[idx]
  }

  deleteCodeShuffleChallenge(id: string): boolean {
    const prevLen = this.shuffle.length
    this.shuffle = this.shuffle.filter((c) => c.id !== id)
    if (this.shuffle.length !== prevLen) {
      this.save()
      return true
    }
    return false
  }

  // ─── MODULE PROGRESS ───
  getModuleProgress(moduleId: string, defaultPercentage = 0): number {
    if (this.moduleProgress[moduleId]) {
      return this.moduleProgress[moduleId].percentage
    }
    return defaultPercentage
  }

  setModuleProgress(moduleId: string, percentage: number): void {
    this.moduleProgress[moduleId] = {
      completedCount: Math.round((percentage / 100) * 4),
      totalCount: 4,
      percentage: Math.min(100, Math.max(0, percentage)),
    }
    this.save()
  }

  resetToDefaults(): void {
    this.speedrun = [...SPEEDRUN_SNIPPETS]
    this.bughunt = [...BUG_HUNT_CHALLENGES]
    this.predictor = [...OUTPUT_PREDICTOR_CHALLENGES]
    this.shuffle = [...CODE_SHUFFLE_CHALLENGES]
    this.moduleProgress = {}
    this.save()
  }
}

export const gameStoreService = new GameStoreService()
