import { DifficultyLevel, ProgrammingLanguage } from './common'

export interface TopicMastery {
  topic: string
  language: ProgrammingLanguage
  masteryPercentage: number
  level: DifficultyLevel
  problemsSolved: number
  totalProblems: number
}

export interface ActivityItem {
  id: string
  type: 'lesson_completed' | 'practice_solved' | 'debug_session' | 'tutor_chat'
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, string | number>
}

export interface LearningProgress {
  userId: string
  overallCompletionPercentage: number
  streakDays: number
  totalStudyHours: number
  problemsSolvedCount: number
  lessonsCompletedCount: number
  topicMasteries: TopicMastery[]
  strengths: string[]
  weakAreas: string[]
  recentActivities: ActivityItem[]
}
