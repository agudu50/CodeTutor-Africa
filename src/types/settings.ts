import { ProgrammingLanguage } from './common'
import { TutorMode } from './tutor'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface UserSettings {
  theme: ThemeMode
  editorFontSize: number
  editorTabSize: number
  defaultLanguage: ProgrammingLanguage
  defaultTutorMode: TutorMode
  offlineModelPath?: string
  enableSoundEffects: boolean
  reducedMotion: boolean
  maxMemoryAllocationMb: number
}
