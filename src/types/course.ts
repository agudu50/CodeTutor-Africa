import { BaseEntity, DifficultyLevel, ProgrammingLanguage } from './common'

export interface Lesson extends BaseEntity {
  courseId: string
  title: string
  slug: string
  description: string
  durationMinutes: number
  order: number
  contentMarkdown: string
  videoUrl?: string
  codeSnippets?: Array<{
    language: ProgrammingLanguage
    code: string
    caption?: string
  }>
  isCompleted?: boolean
}

export interface Module extends BaseEntity {
  courseId: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export interface Course extends BaseEntity {
  title: string
  slug: string
  description: string
  category: string
  language: ProgrammingLanguage
  difficulty: DifficultyLevel
  thumbnailUrl?: string
  totalLessons: number
  estimatedHours: number
  progressPercentage?: number
  modules: Module[]
}
