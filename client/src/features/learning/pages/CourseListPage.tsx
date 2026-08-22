import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { courseStoreService } from '@/services/learning/course-store.service'
import { Course } from '@/types'
import { CourseCard } from '../components/CourseCard'
import { Input, Dropdown } from '@/components/ui'
import { Search, BookOpen, Shield } from 'lucide-react'

export const CourseListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(courseStoreService.getAllCourses())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLang, setSelectedLang] = useState('all')

  useEffect(() => {
    const handleUpdate = () => setCourses(courseStoreService.getAllCourses())
    window.addEventListener('courses_updated', handleUpdate)
    return () => window.removeEventListener('courses_updated', handleUpdate)
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLang = selectedLang === 'all' || course.language === selectedLang
    return matchesSearch && matchesLang
  })

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Programming Course Tracks
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Structured programming courses for all skill levels—from first-time coders to advanced builders. Fully pre-cached for offline access.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 shrink-0 self-start sm:self-center">
          <Shield className="w-3.5 h-3.5" /> 100% Offline Accessible
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search courses by topic, language, or concept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="bg-white dark:bg-slate-900"
          />
        </div>
        <div className="w-full sm:w-52">
          <Dropdown
            options={[
              { value: 'all', label: 'All Languages' },
              { value: 'python', label: 'Python 3.12' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'java', label: 'Java 21' },
            ]}
            value={selectedLang}
            onChange={setSelectedLang}
          />
        </div>
      </div>

      {/* Courses Grid (Equal-Height Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </PageContainer>
  )
}

export default CourseListPage
