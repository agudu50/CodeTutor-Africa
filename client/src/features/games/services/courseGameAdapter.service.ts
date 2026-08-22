import { courseStoreService } from '@/services/learning/course-store.service'
import {
  SpeedrunSnippet,
  BugHuntChallenge,
  OutputPredictorChallenge,
  CodeShuffleChallenge,
} from '../types/games.types'
import {
  SPEEDRUN_SNIPPETS,
  BUG_HUNT_CHALLENGES,
  OUTPUT_PREDICTOR_CHALLENGES,
  CODE_SHUFFLE_CHALLENGES,
} from '../data/gameData'

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
    if (!courseId || courseId === 'all') {
      return SPEEDRUN_SNIPPETS
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = SPEEDRUN_SNIPPETS.filter((s) => {
      if (s.courseId === courseId) return true
      if (courseLang && s.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : SPEEDRUN_SNIPPETS
  }

  /**
   * Get Bug Hunt challenges based on the selected course
   */
  getBugHuntChallenges(courseId?: string): BugHuntChallenge[] {
    if (!courseId || courseId === 'all') {
      return BUG_HUNT_CHALLENGES
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = BUG_HUNT_CHALLENGES.filter((c) => {
      if (c.courseId === courseId) return true
      if (courseLang && c.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : BUG_HUNT_CHALLENGES
  }

  /**
   * Get Output Predictor challenges based on the selected course
   */
  getOutputPredictorChallenges(courseId?: string): OutputPredictorChallenge[] {
    if (!courseId || courseId === 'all') {
      return OUTPUT_PREDICTOR_CHALLENGES
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = OUTPUT_PREDICTOR_CHALLENGES.filter((c) => {
      if (c.courseId === courseId) return true
      if (courseLang && c.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : OUTPUT_PREDICTOR_CHALLENGES
  }

  /**
   * Get Code Shuffle challenges based on the selected course
   */
  getCodeShuffleChallenges(courseId?: string): CodeShuffleChallenge[] {
    if (!courseId || courseId === 'all') {
      return CODE_SHUFFLE_CHALLENGES
    }

    const course = courseStoreService.getCourseById(courseId)
    const courseLang = course?.language

    const matched = CODE_SHUFFLE_CHALLENGES.filter((c) => {
      if (c.courseId === courseId) return true
      if (courseLang && c.language === courseLang) return true
      return false
    })

    return matched.length > 0 ? matched : CODE_SHUFFLE_CHALLENGES
  }
}

export const courseGameAdapter = new CourseGameAdapterService()
