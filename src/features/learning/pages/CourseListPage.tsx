import React, { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MOCK_COURSES } from '../data/mockCourseData'
import { CourseCard } from '../components/CourseCard'
import { Input, Dropdown } from '@/components/ui'
import { Search, BookOpen } from 'lucide-react'

export const CourseListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLang, setSelectedLang] = useState('all')

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLang = selectedLang === 'all' || course.language === selectedLang
    return matchesSearch && matchesLang
  })

  return (
    <PageContainer maxWidth="2xl" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-500" /> Programming Course Tracks
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Structured programming courses for all skill levels—from first-time coders to advanced builders. Fully pre-cached for offline access.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search courses by topic, language, or concept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            options={[
              { value: 'all', label: 'All Languages' },
              { value: 'python', label: 'Python' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'java', label: 'Java' },
            ]}
            value={selectedLang}
            onChange={setSelectedLang}
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </PageContainer>
  )
}

export default CourseListPage
