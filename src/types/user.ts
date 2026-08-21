import { ProgrammingLanguage } from './common'

export interface User {
  id: string
  fullName: string
  username: string
  email?: string
  avatarUrl?: string
  institution?: string
  preferredLanguage: ProgrammingLanguage
  enrolledCourseIds: string[]
  completedLessonIds: string[]
  streakDays: number
  totalStudyHours: number
}
