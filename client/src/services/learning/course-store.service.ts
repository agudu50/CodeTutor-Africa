import { Course, Module, Lesson } from '@/types'
import { MOCK_COURSES } from '@/features/learning/data/mockCourseData'

const COURSES_STORAGE_KEY = 'codetutor_admin_courses'

class CourseStoreService {
  private courses: Course[] = []

  constructor() {
    this.init()
  }

  private init() {
    try {
      const stored = localStorage.getItem(COURSES_STORAGE_KEY)
      if (stored) {
        this.courses = JSON.parse(stored)
      } else {
        this.courses = [...MOCK_COURSES]
        this.save()
      }
    } catch {
      this.courses = [...MOCK_COURSES]
    }
  }

  private save() {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(this.courses))
      window.dispatchEvent(new CustomEvent('courses_updated'))
    } catch (e) {
      console.warn('Failed to persist courses to localStorage', e)
    }
  }

  getAllCourses(): Course[] {
    return [...this.courses]
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find((c: Course) => c.id === id)
  }

  createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'progressPercentage'>): Course {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      progressPercentage: 0,
    }
    this.courses.unshift(newCourse)
    this.save()
    return newCourse
  }

  updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const idx = this.courses.findIndex((c: Course) => c.id === id)
    if (idx === -1) return undefined

    this.courses[idx] = {
      ...this.courses[idx],
      ...updates,
    }
    this.save()
    return this.courses[idx]
  }

  deleteCourse(id: string): boolean {
    const initialLen = this.courses.length
    this.courses = this.courses.filter((c: Course) => c.id !== id)
    if (this.courses.length !== initialLen) {
      this.save()
      return true
    }
    return false
  }

  addModuleToCourse(courseId: string, moduleData: Omit<Module, 'id' | 'courseId' | 'createdAt'>): Module | undefined {
    const course = this.courses.find((c: Course) => c.id === courseId)
    if (!course) return undefined

    const newModule: Module = {
      ...moduleData,
      id: `mod-${Date.now()}`,
      courseId,
      createdAt: new Date().toISOString(),
    }

    course.modules.push(newModule)
    course.totalLessons = course.modules.reduce((acc: number, m: Module) => acc + m.lessons.length, 0)
    this.save()
    return newModule
  }

  addLessonToModule(courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id' | 'courseId' | 'createdAt'>): Lesson | undefined {
    const course = this.courses.find((c: Course) => c.id === courseId)
    if (!course) return undefined

    const module = course.modules.find((m: Module) => m.id === moduleId)
    if (!module) return undefined

    const newLesson: Lesson = {
      ...lessonData,
      id: `les-${Date.now()}`,
      courseId,
      createdAt: new Date().toISOString(),
    }

    module.lessons.push(newLesson)
    course.totalLessons = course.modules.reduce((acc: number, m: Module) => acc + m.lessons.length, 0)
    this.save()
    return newLesson
  }

  resetToDefaults(): void {
    this.courses = [...MOCK_COURSES]
    this.save()
  }
}

export const courseStoreService = new CourseStoreService()
