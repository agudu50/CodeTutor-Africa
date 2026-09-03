import { BaseEntity, DifficultyLevel, ProgrammingLanguage } from './common'

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'fill_in' | 'code'
  question: string
  options?: string[]
  correctAnswer: string | number // number index for MCQ or string token for fill_in / code
  explanation: string
  codeSnippet?: string
  initialCode?: string
  testCases?: Array<{ input: string; expectedOutput: string }>
  hint?: string
}

export interface TechnicalTerm {
  term: string
  definition: string
  example?: string
}

export interface Lesson extends BaseEntity {
  courseId: string
  title: string
  slug: string
  description: string
  durationMinutes: number
  order: number
  contentMarkdown: string
  videoUrl?: string
  quizQuestions?: QuizQuestion[]
  codeSnippets?: Array<{
    language: ProgrammingLanguage
    code: string
    caption?: string
  }>
  learningObjectives?: string[]
  technicalTerms?: TechnicalTerm[]
  isCompleted?: boolean
  isLocked?: boolean
}

export interface Module extends BaseEntity {
  courseId: string
  title: string
  description: string
  order: number
  weekNumber?: number
  isLocked?: boolean
  isUnlockedByAdmin?: boolean
  progressPercentage?: number
  learningObjectives?: string[]
  technicalTerms?: TechnicalTerm[]
  lessons: Lesson[]
}

export interface CourseGameLink {
  id: string
  title: string
  type: 'bughunt' | 'speedrun' | 'matrix' | 'arcade'
  description: string
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
  estimatedWeeks?: number
  enrolledCount?: number
  progressPercentage?: number
  modules: Module[]
  isAiGenerated?: boolean
  generatedPrompt?: string
  games?: CourseGameLink[]
  mentorId?: string
  mentorName?: string
  instructorId?: string
  instructorName?: string
  isUnlockedByAdmin?: boolean
}
