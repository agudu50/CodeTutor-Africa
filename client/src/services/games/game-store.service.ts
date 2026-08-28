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
import {
  GameModuleItem,
  GameDrillItem,
  LANGUAGE_GAME_MODULES,
} from '@/features/games/data/gameModulesData'

const SPEEDRUN_STORAGE_KEY = 'codetutor_games_speedrun'
const BUGHUNT_STORAGE_KEY = 'codetutor_games_bughunt'
const PREDICTOR_STORAGE_KEY = 'codetutor_games_predictor'
const SHUFFLE_STORAGE_KEY = 'codetutor_games_shuffle'
const MODULE_PROGRESS_STORAGE_KEY = 'codetutor_game_module_progress'
const MODULES_DATA_STORAGE_KEY = 'codetutor_game_modules_data'

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
  private modulesByLanguage: Record<string, GameModuleItem[]> = {}

  constructor() {
    this.init()
  }

  private init() {
    try {
      const sr = localStorage.getItem(SPEEDRUN_STORAGE_KEY)
      const bh = localStorage.getItem(BUGHUNT_STORAGE_KEY)
      const op = localStorage.getItem(PREDICTOR_STORAGE_KEY)
      const cs = localStorage.getItem(SHUFFLE_STORAGE_KEY)

      if (sr) {
        const parsed = JSON.parse(sr)
        const canonicalMap = new Map(SPEEDRUN_SNIPPETS.map((s) => [s.title?.toLowerCase(), s]))
        const refreshed = parsed.map((p: any) => {
          const canonical = canonicalMap.get(p.title?.toLowerCase())
          if (canonical && (!p.description || p.description.startsWith('Curriculum drill for Module'))) {
            return { ...p, description: canonical.description }
          }
          return p
        })
        const existingTitles = new Set(refreshed.map((p: any) => p.title?.toLowerCase()))
        const missing = SPEEDRUN_SNIPPETS.filter((s) => !existingTitles.has(s.title?.toLowerCase()))
        this.speedrun = [...refreshed, ...missing]
      } else {
        this.speedrun = [...SPEEDRUN_SNIPPETS]
      }

      if (bh) {
        const parsed = JSON.parse(bh)
        const canonicalMap = new Map(BUG_HUNT_CHALLENGES.map((b) => [b.title?.toLowerCase(), b]))
        const refreshed = parsed.map((p: any) => {
          const canonical = canonicalMap.get(p.title?.toLowerCase())
          if (canonical && (!p.description || p.description.startsWith('Spot and squash the bug in'))) {
            return { ...p, description: canonical.description, bugExplanation: canonical.bugExplanation || p.bugExplanation }
          }
          return p
        })
        const existingTitles = new Set(refreshed.map((p: any) => p.title?.toLowerCase()))
        const missing = BUG_HUNT_CHALLENGES.filter((b) => !existingTitles.has(b.title?.toLowerCase()))
        this.bughunt = [...refreshed, ...missing]
      } else {
        this.bughunt = [...BUG_HUNT_CHALLENGES]
      }

      if (op) {
        const parsed = JSON.parse(op)
        const canonicalMap = new Map(OUTPUT_PREDICTOR_CHALLENGES.map((o) => [o.title?.toLowerCase(), o]))
        const refreshed = parsed.map((p: any) => {
          const canonical = canonicalMap.get(p.title?.toLowerCase())
          if (canonical && canonical.explanation) {
            return { ...p, explanation: canonical.explanation }
          }
          return p
        })
        const existingTitles = new Set(refreshed.map((p: any) => p.title?.toLowerCase()))
        const missing = OUTPUT_PREDICTOR_CHALLENGES.filter((o) => !existingTitles.has(o.title?.toLowerCase()))
        this.predictor = [...refreshed, ...missing]
      } else {
        this.predictor = [...OUTPUT_PREDICTOR_CHALLENGES]
      }

      if (cs) {
        const parsed = JSON.parse(cs)
        const canonicalMap = new Map(CODE_SHUFFLE_CHALLENGES.map((c) => [c.id || c.title?.toLowerCase(), c]))
        const refreshed = parsed.map((p: any) => {
          // Check by ID or title (handles renamed titles like Two-Pointer -> Countdown)
          const canonical = canonicalMap.get(p.id) || canonicalMap.get(p.title?.toLowerCase())
          if (canonical) {
            return {
              ...p,
              title: canonical.title,
              goalDescription: canonical.goalDescription,
              explanation: canonical.explanation,
              expectedOutput: canonical.expectedOutput,
            }
          }
          return p
        })
        const existingTitles = new Set(refreshed.map((p: any) => p.title?.toLowerCase()))
        const missing = CODE_SHUFFLE_CHALLENGES.filter((c) => !existingTitles.has(c.title?.toLowerCase()))
        this.shuffle = [...refreshed, ...missing]
      } else {
        this.shuffle = [...CODE_SHUFFLE_CHALLENGES]
      }

      const mp = localStorage.getItem(MODULE_PROGRESS_STORAGE_KEY)
      this.moduleProgress = mp ? JSON.parse(mp) : {}

      const md = localStorage.getItem(MODULES_DATA_STORAGE_KEY)
      if (md) {
        this.modulesByLanguage = JSON.parse(md)
      } else {
        this.modulesByLanguage = {
          python: [...LANGUAGE_GAME_MODULES.python],
          javascript: [...LANGUAGE_GAME_MODULES.javascript],
          java: [...LANGUAGE_GAME_MODULES.java],
          typescript: [...LANGUAGE_GAME_MODULES.typescript],
          sql: [...LANGUAGE_GAME_MODULES.sql],
        }
      }
    } catch (e) {
      console.warn('Failed to load game store from localStorage', e)
      this.speedrun = [...SPEEDRUN_SNIPPETS]
      this.bughunt = [...BUG_HUNT_CHALLENGES]
      this.predictor = [...OUTPUT_PREDICTOR_CHALLENGES]
      this.shuffle = [...CODE_SHUFFLE_CHALLENGES]
      this.modulesByLanguage = {
        python: [...LANGUAGE_GAME_MODULES.python],
        javascript: [...LANGUAGE_GAME_MODULES.javascript],
        java: [...LANGUAGE_GAME_MODULES.java],
        typescript: [...LANGUAGE_GAME_MODULES.typescript],
        sql: [...LANGUAGE_GAME_MODULES.sql],
      }
    }
  }

  private save() {
    try {
      localStorage.setItem(SPEEDRUN_STORAGE_KEY, JSON.stringify(this.speedrun))
      localStorage.setItem(BUGHUNT_STORAGE_KEY, JSON.stringify(this.bughunt))
      localStorage.setItem(PREDICTOR_STORAGE_KEY, JSON.stringify(this.predictor))
      localStorage.setItem(SHUFFLE_STORAGE_KEY, JSON.stringify(this.shuffle))
      localStorage.setItem(MODULE_PROGRESS_STORAGE_KEY, JSON.stringify(this.moduleProgress))
      localStorage.setItem(MODULES_DATA_STORAGE_KEY, JSON.stringify(this.modulesByLanguage))
      window.dispatchEvent(new CustomEvent('games_updated'))
    } catch (e) {
      console.warn('Failed to save games to localStorage', e)
    }
  }

  // ─── CURRICULUM MODULES CRUD ───
  getModulesForLanguage(lang: GameLanguage): GameModuleItem[] {
    if (lang === 'all') {
      return [
        ...(this.modulesByLanguage.python || []),
        ...(this.modulesByLanguage.javascript || []),
        ...(this.modulesByLanguage.java || []),
        ...(this.modulesByLanguage.typescript || []),
        ...(this.modulesByLanguage.sql || []),
      ]
    }
    return this.modulesByLanguage[lang] || this.modulesByLanguage.python || []
  }

  getAllModules(): Record<string, GameModuleItem[]> {
    return this.modulesByLanguage
  }

  getModuleById(moduleId: string): { module: GameModuleItem; language: GameLanguage } | undefined {
    for (const [lang, list] of Object.entries(this.modulesByLanguage)) {
      const found = list.find((m) => m.id === moduleId)
      if (found) {
        return { module: found, language: lang as GameLanguage }
      }
    }
    return undefined
  }

  createModule(lang: GameLanguage, moduleData: Omit<GameModuleItem, 'id'>): GameModuleItem {
    const validLang = lang === 'all' ? 'python' : lang
    if (!this.modulesByLanguage[validLang]) {
      this.modulesByLanguage[validLang] = []
    }
    const id = `${validLang}-mod-${Date.now()}`
    const newModule: GameModuleItem = {
      ...moduleData,
      id,
      language: validLang,
      drills: moduleData.drills || [],
      defaultProgress: moduleData.defaultProgress || 0,
    }
    this.modulesByLanguage[validLang].push(newModule)
    this.save()
    return newModule
  }

  updateModule(lang: GameLanguage, moduleId: string, updates: Partial<GameModuleItem>): GameModuleItem | undefined {
    const validLang = lang === 'all' ? 'python' : lang
    const list = this.modulesByLanguage[validLang]
    if (!list) return undefined
    const idx = list.findIndex((m) => m.id === moduleId)
    if (idx === -1) return undefined
    list[idx] = { ...list[idx], ...updates }
    this.save()
    return list[idx]
  }

  deleteModule(lang: GameLanguage, moduleId: string): boolean {
    const validLang = lang === 'all' ? 'python' : lang
    const list = this.modulesByLanguage[validLang]
    if (!list) return false
    const prevLen = list.length
    this.modulesByLanguage[validLang] = list.filter((m) => m.id !== moduleId)
    if (this.modulesByLanguage[validLang].length !== prevLen) {
      this.save()
      return true
    }
    return false
  }

  addDrillToModule(lang: GameLanguage, moduleId: string, drill: GameDrillItem): void {
    const validLang = lang === 'all' ? 'python' : lang
    const list = this.modulesByLanguage[validLang]
    if (!list) return
    const mod = list.find((m) => m.id === moduleId)
    if (mod) {
      mod.drills = mod.drills || []
      mod.drills.push(drill)
      this.save()
    }
  }

  removeDrillFromModule(lang: GameLanguage, moduleId: string, drillIndex: number): void {
    const validLang = lang === 'all' ? 'python' : lang
    const list = this.modulesByLanguage[validLang]
    if (!list) return
    const mod = list.find((m) => m.id === moduleId)
    if (mod && mod.drills && mod.drills[drillIndex]) {
      mod.drills.splice(drillIndex, 1)
      this.save()
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

  getAllChallengesCount(): {
    total: number
    speedrun: number
    bughunt: number
    predictor: number
    shuffle: number
    totalModules: number
  } {
    let totalMods = 0
    Object.values(this.modulesByLanguage).forEach((list) => {
      totalMods += list.length
    })

    return {
      total: this.speedrun.length + this.bughunt.length + this.predictor.length + this.shuffle.length,
      speedrun: this.speedrun.length,
      bughunt: this.bughunt.length,
      predictor: this.predictor.length,
      shuffle: this.shuffle.length,
      totalModules: totalMods,
    }
  }

  // ─── ADMIN CREATION & MODIFICATION FOR DRILLS / CHALLENGES ───
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
    this.modulesByLanguage = {
      python: [...LANGUAGE_GAME_MODULES.python],
      javascript: [...LANGUAGE_GAME_MODULES.javascript],
      java: [...LANGUAGE_GAME_MODULES.java],
      typescript: [...LANGUAGE_GAME_MODULES.typescript],
      sql: [...LANGUAGE_GAME_MODULES.sql],
    }
    this.save()
  }
}

export const gameStoreService = new GameStoreService()
