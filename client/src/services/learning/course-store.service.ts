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
        const parsed = JSON.parse(stored)
        const hasAll18ModulesWithQuizzes = parsed.some((c: Course) =>
          c.modules?.length === 18 &&
          c.modules.every((m: Module) =>
            m.lessons.some((l: Lesson) => l.quizQuestions && l.quizQuestions.length > 0)
          )
        )
        const hasBeginnerFriendlyContent = parsed.some((c: Course) =>
          c.modules?.[0]?.lessons?.[0]?.contentMarkdown?.includes('Welcome to Coding')
        )

        const isClean0Percent = parsed.every((c: Course) =>
          c.modules?.every((m: Module) => (m.progressPercentage ?? 0) === 0)
        )
        const hasUpdatedCategories = parsed.some((c: Course) => c.category === 'Foundations')

        if (hasAll18ModulesWithQuizzes && hasBeginnerFriendlyContent && isClean0Percent && hasUpdatedCategories) {
          this.courses = parsed.map((c: Course) => {
            const matchingMock = MOCK_COURSES.find((m) => m.id === c.id || m.language === c.language)
            return {
              ...c,
              enrolledCount: c.enrolledCount || matchingMock?.enrolledCount || 350,
              mentorId: c.mentorId || matchingMock?.mentorId,
              mentorName: c.mentorName || matchingMock?.mentorName,
              instructorName: c.instructorName || matchingMock?.instructorName || c.mentorName || matchingMock?.mentorName,
            }
          })
        } else {
          this.courses = [...MOCK_COURSES]
          this.save()
        }
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
    return this.courses.find((c: Course) => c.id === id || c.slug === id)
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
    const courseToDelete = this.courses.find((c: Course) => c.id === id)
    const initialLen = this.courses.length
    this.courses = this.courses.filter((c: Course) => c.id !== id)
    if (this.courses.length !== initialLen) {
      this.save()
      window.dispatchEvent(
        new CustomEvent('course_deleted', {
          detail: { id, title: courseToDelete?.title || 'Course' },
        })
      )
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

  getCoursesByMentor(mentorIdOrName?: string, mentorCourseIds?: string[], mentorLanguage?: string): Course[] {
    if (!mentorIdOrName && (!mentorCourseIds || mentorCourseIds.length === 0)) {
      return []
    }
    const query = mentorIdOrName?.toLowerCase().trim() || ''

    return this.courses.filter((course: Course) => {
      // 1. Direct ID match
      if (course.mentorId && course.mentorId === mentorIdOrName) return true
      // 2. Mentor Name / Instructor Name match
      if (course.mentorName && query && course.mentorName.toLowerCase().includes(query)) return true
      if (course.instructorName && query && course.instructorName.toLowerCase().includes(query)) return true
      // 3. Assigned course IDs match
      if (mentorCourseIds && mentorCourseIds.includes(course.id)) return true
      // 4. Assigned language match (fallback for language mentors)
      if (mentorLanguage && course.language === mentorLanguage) return true
      return false
    })
  }

  getMentorEnrolledStudentCount(mentorIdOrName?: string, mentorCourseIds?: string[], mentorLanguage?: string): number {
    const mentorCourses = this.getCoursesByMentor(mentorIdOrName, mentorCourseIds, mentorLanguage)
    return mentorCourses.reduce((acc: number, c: Course) => acc + (c.enrolledCount || 0), 0)
  }

  assignMentorToCourse(courseId: string, mentorId: string, mentorName: string): Course | undefined {
    const idx = this.courses.findIndex((c: Course) => c.id === courseId)
    if (idx === -1) return undefined

    this.courses[idx] = {
      ...this.courses[idx],
      mentorId,
      mentorName,
      instructorName: mentorName,
    }
    this.save()
    return this.courses[idx]
  }

  resetToDefaults(): void {
    this.courses = [...MOCK_COURSES]
    this.save()
  }
}

export const courseStoreService = new CourseStoreService()
