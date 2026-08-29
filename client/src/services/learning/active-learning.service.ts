import { Course, Module, Lesson } from '@/types'
import { courseStoreService } from './course-store.service'

export interface ActiveLessonState {
  courseId: string
  courseTitle: string
  moduleTitle: string
  lessonId: string
  lessonTitle: string
  lessonNumber: number
  totalLessons: number
  completedLessons: number
  progressPercent: number
  estimatedRemainingMinutes: number
  language: string
  concepts: string[]
  nextExerciseTitle: string
  nextExerciseId: string
  lastAccessedAt: string
}

const ACTIVE_LESSON_KEY = 'codetutor_active_lesson'

export const DEFAULT_ACTIVE_LESSON: ActiveLessonState = {
  courseId: 'course-py-101',
  courseTitle: 'Python Programming & Problem Solving',
  moduleTitle: 'Module 1 • Foundations & Control Flow',
  lessonId: 'les-3',
  lessonTitle: 'Functions, Scoping, and Recursion',
  lessonNumber: 3,
  totalLessons: 18,
  completedLessons: 2,
  progressPercent: 68,
  estimatedRemainingMinutes: 20,
  language: 'python',
  concepts: ['Call Stack Memory', 'Base Conditions', 'Recursion', 'Error Prevention'],
  nextExerciseTitle: 'Recursive Palindrome Checker',
  nextExerciseId: 'practice-rec-1',
  lastAccessedAt: new Date().toISOString(),
}

class ActiveLearningService {
  getActiveLesson(): ActiveLessonState {
    try {
      const stored = localStorage.getItem(ACTIVE_LESSON_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.courseId && parsed.lessonId) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Failed to load active lesson from localStorage', e)
    }
    return DEFAULT_ACTIVE_LESSON
  }

  recordLessonAccess(course: Course, module: Module, lesson: Lesson): ActiveLessonState {
    try {
      // Calculate overall course lesson counts & index
      let allCourseLessons: { lesson: Lesson; module: Module }[] = []
      course.modules.forEach((m) => {
        m.lessons.forEach((l) => {
          allCourseLessons.push({ lesson: l, module: m })
        })
      })

      const totalLessons = allCourseLessons.length || 18
      const currentLessonIndex = allCourseLessons.findIndex(
        (item) => item.lesson.id === lesson.id || item.lesson.slug === lesson.slug
      )
      const lessonNumber = currentLessonIndex !== -1 ? currentLessonIndex + 1 : 1

      // Completed lessons estimate
      const completedLessons = Math.max(1, lessonNumber - 1)
      const progressPercent = Math.min(100, Math.round((lessonNumber / totalLessons) * 100))

      // Extract skills / concepts from lesson or generate contextual skills
      let concepts = ['Core Syntax', 'Problem Solving', 'Data Handling', 'Offline CPU Execution']
      if (lesson.title.toLowerCase().includes('function') || lesson.title.toLowerCase().includes('recursion')) {
        concepts = ['Call Stack Memory', 'Base Conditions', 'Recursion', 'Error Prevention']
      } else if (lesson.title.toLowerCase().includes('loop') || lesson.title.toLowerCase().includes('flow')) {
        concepts = ['Iteration Logic', 'Conditional Branching', 'State Control', 'Dry-Run Tracing']
      } else if (lesson.title.toLowerCase().includes('object') || lesson.title.toLowerCase().includes('class')) {
        concepts = ['Encapsulation', 'Class Inheritance', 'Polymorphism', 'Constructor Design']
      } else if (lesson.title.toLowerCase().includes('async') || lesson.title.toLowerCase().includes('promise')) {
        concepts = ['Event Loop', 'Promises & Async/Await', 'Error Propagation', 'Race Conditions']
      } else if (lesson.title.toLowerCase().includes('array') || lesson.title.toLowerCase().includes('list')) {
        concepts = ['Indexing & Slicing', 'Memory Alignment', 'Search & Filtering', 'Time Complexity']
      }

      const activeState: ActiveLessonState = {
        courseId: course.id,
        courseTitle: course.title,
        moduleTitle: module.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        lessonNumber,
        totalLessons,
        completedLessons,
        progressPercent,
        estimatedRemainingMinutes: Math.max(10, Math.min(35, lesson.durationMinutes || 20)),
        language: course.language || 'python',
        concepts,
        nextExerciseTitle: `${lesson.title} Practice Drill`,
        nextExerciseId: `practice-${lesson.id}`,
        lastAccessedAt: new Date().toISOString(),
      }

      localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify(activeState))
      window.dispatchEvent(new CustomEvent('active_lesson_updated', { detail: activeState }))
      return activeState
    } catch (e) {
      console.warn('Failed to save active lesson', e)
      return DEFAULT_ACTIVE_LESSON
    }
  }

  recordByLessonId(lessonId: string): ActiveLessonState | null {
    const courses = courseStoreService.getAllCourses()
    for (const c of courses) {
      for (const m of c.modules) {
        const l = m.lessons.find((les) => les.id === lessonId || les.slug === lessonId)
        if (l) {
          return this.recordLessonAccess(c, m, l)
        }
      }
    }
    return null
  }
}

export const activeLearningService = new ActiveLearningService()
