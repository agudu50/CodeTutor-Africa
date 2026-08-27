import { courseStoreService } from '@/services/learning/course-store.service'
import { gameStoreService } from '@/services/games/game-store.service'
import {
  SpeedrunSnippet,
  BugHuntChallenge,
  OutputPredictorChallenge,
  CodeShuffleChallenge,
} from '../types/games.types'

export interface EnrolledCourseOption {
  id: string
  title: string
  language: string
  progressPercentage: number
  totalLessons: number
}

class CourseGameAdapterService {
  /**
   * Returns list of user's active courses for game filtering
   */
  getUserCourses(): EnrolledCourseOption[] {
    const courses = courseStoreService.getAllCourses()
    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      language: c.language,
      progressPercentage: c.progressPercentage ?? 0,
      totalLessons: c.totalLessons,
    }))
  }

  /**
   * Get Speedrun snippets based on the selected course (or all courses)
   */
  getSpeedrunSnippets(courseId?: string): SpeedrunSnippet[] {
    const all = gameStoreService.getSpeedrunSnippets()
    if (!courseId || courseId === 'all') {
      return all
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = all.filter((s) => {
      if (s.courseId === courseId) return true
      if (courseLang && s.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : all
  }

  /**
   * Get Bug Hunt challenges based on the selected course
   */
  getBugHuntChallenges(courseId?: string): BugHuntChallenge[] {
    const all = gameStoreService.getBugHuntChallenges()
    if (!courseId || courseId === 'all') {
      return all
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = all.filter((c) => {
      if (c.courseId === courseId) return true
      if (courseLang && c.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : all
  }

  /**
   * Get Output Predictor challenges based on the selected course
   */
  getOutputPredictorChallenges(courseId?: string): OutputPredictorChallenge[] {
    const all = gameStoreService.getOutputPredictorChallenges()
    if (!courseId || courseId === 'all') {
      return all
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = all.filter((c) => {
      if (c.courseId === courseId) return true
      if (courseLang && c.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : all
  }

  /**
   * Get Code Shuffle challenges based on the selected course
   */
  getCodeShuffleChallenges(courseId?: string): CodeShuffleChallenge[] {
    const all = gameStoreService.getCodeShuffleChallenges()
    if (!courseId || courseId === 'all') {
      return all
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = all.filter((c) => {
      if (c.courseId === courseId) return true
      if (courseLang && c.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : all
  }
}

export const courseGameAdapter = new CourseGameAdapterService()
