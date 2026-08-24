import { Course, Lesson } from '@/types'
import { MOCK_COURSES } from '@/features/learning/data/mockCourseData'

export interface ICourseService {
  getCourses(): Promise<Course[]>
  getCourseById(courseId: string): Promise<Course | undefined>
  getLessonById(lessonId: string): Promise<Lesson | undefined>
  markLessonComplete(lessonId: string): Promise<void>
}

export class MockCourseService implements ICourseService {
  async getCourses(): Promise<Course[]> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return MOCK_COURSES
  }

  async getCourseById(courseId: string): Promise<Course | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return MOCK_COURSES.find((c: Course) => c.id === courseId || c.slug === courseId)
  }

  async getLessonById(lessonId: string): Promise<Lesson | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    for (const course of MOCK_COURSES) {
      for (const module of course.modules) {
        const lesson = module.lessons.find((l: Lesson) => l.id === lessonId || l.slug === lessonId)
        if (lesson) return lesson
      }
    }
    return undefined
  }

  async markLessonComplete(lessonId: string): Promise<void> {
    // Local persistence will update state
    console.log(`Lesson ${lessonId} marked complete in local storage`)
  }
}

export const courseService: ICourseService = new MockCourseService()
