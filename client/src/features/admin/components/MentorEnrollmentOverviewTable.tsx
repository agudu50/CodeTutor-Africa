import React, { useState, useMemo } from 'react'
import { AdminUserRecord } from '@/types/admin-analytics'
import { courseStoreService } from '@/services/learning/course-store.service'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { Card, CardContent, CardHeader, CardTitle, Dropdown } from '@/components/ui'
import {
  GraduationCap,
  Users,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Globe,
  Zap,
} from 'lucide-react'

interface MentorEnrollmentOverviewTableProps {
  adminUsers: AdminUserRecord[]
  onDataChanged?: () => void
}

export const MentorEnrollmentOverviewTable: React.FC<MentorEnrollmentOverviewTableProps> = ({
  adminUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL')
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'students_desc' | 'students_asc' | 'courses_desc' | 'name_asc' | 'xp_desc'>('students_desc')
  const [expandedMentorId, setExpandedMentorId] = useState<string | null>(null)

  // Compute all mentor summaries with courses, student counts, and enrolled learner lists
  const mentorsSummary = useMemo(() => {
    const mentors = adminUsers.filter((u) => u.role === 'instructor')

    return mentors.map((mentor) => {
      const assignedCourses = courseStoreService.getCoursesByMentor(
        mentor.id,
        mentor.enrolledCourseIds,
        mentor.favoriteLanguage
      )
      const mentorLearners = adminAnalyticsService.getLearnersForMentor(mentor, assignedCourses)
      const totalEnrolledCount = assignedCourses.reduce(
        (sum, c) => sum + (c.enrolledCount || 0),
        0
      ) || mentorLearners.length

      return {
        mentor,
        courses: assignedCourses,
        courseCount: assignedCourses.length,
        totalEnrolledCount,
        learners: mentorLearners,
        totalLessons: assignedCourses.reduce((acc, c) => acc + (c.totalLessons || 0), 0),
      }
    })
  }, [adminUsers])

  // Total platform students enrolled under mentors
  const totalStudentsAcrossMentors = useMemo(() => {
    return mentorsSummary.reduce((acc, m) => acc + m.totalEnrolledCount, 0)
  }, [mentorsSummary])

  const totalAssignedCourses = useMemo(() => {
    return mentorsSummary.reduce((acc, m) => acc + m.courseCount, 0)
  }, [mentorsSummary])

  const activeMentorsNowCount = useMemo(() => {
    return mentorsSummary.filter(
      (m) => m.mentor.status === 'active_now' || m.mentor.status === 'active_today'
    ).length
  }, [mentorsSummary])

  // Filtered and sorted mentors
  const filteredMentors = useMemo(() => {
    return mentorsSummary
      .filter(({ mentor, courses }) => {
        const q = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !q ||
          mentor.name.toLowerCase().includes(q) ||
          mentor.username.toLowerCase().includes(q) ||
          mentor.email.toLowerCase().includes(q) ||
          mentor.countryName.toLowerCase().includes(q) ||
          mentor.favoriteLanguage.toLowerCase().includes(q) ||
          courses.some((c) => c.title.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))

        const matchesLanguage =
          selectedLanguage === 'ALL' ||
          mentor.favoriteLanguage.toLowerCase() === selectedLanguage.toLowerCase() ||
          courses.some((c) => c.language.toLowerCase() === selectedLanguage.toLowerCase())

        const matchesCountry = selectedCountry === 'ALL' || mentor.countryCode === selectedCountry

        const matchesStatus =
          selectedStatus === 'ALL' ||
          (selectedStatus === 'active' &&
            (mentor.status === 'active_now' || mentor.status === 'active_today' || mentor.status === 'active_this_week')) ||
          (selectedStatus === 'inactive' && (mentor.status === 'idle' || mentor.status === 'inactive')) ||
          mentor.status === selectedStatus

        return matchesSearch && matchesLanguage && matchesCountry && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'students_desc') return b.totalEnrolledCount - a.totalEnrolledCount
        if (sortBy === 'students_asc') return a.totalEnrolledCount - b.totalEnrolledCount
        if (sortBy === 'courses_desc') return b.courseCount - a.courseCount
        if (sortBy === 'name_asc') return a.mentor.name.localeCompare(b.mentor.name)
        if (sortBy === 'xp_desc') return b.mentor.totalXp - a.mentor.totalXp
        return 0
      })
  }, [mentorsSummary, searchQuery, selectedLanguage, selectedCountry, selectedStatus, sortBy])

  // Available countries
  const countriesList = useMemo(() => {
    const set = new Set<string>()
    mentorsSummary.forEach((m) => {
      if (m.mentor.countryCode) set.add(m.mentor.countryCode)
    })
    return Array.from(set)
  }, [mentorsSummary])

  return (
    <div className="space-y-5">
      {/* ═══════════════════════════════════════════════════════════════
          TOP KPI METRIC CARDS: MENTOR PLATFORM STATS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Total Appointed Mentors
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {mentorsSummary.length}
            </span>
            <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 font-sans block">
            Across {countriesList.length} African countries
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Total Enrolled Students
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#005F02] dark:text-emerald-400">
              {totalStudentsAcrossMentors.toLocaleString()}
            </span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 font-sans block">
            Across all mentor curricula
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Curriculum Courses Assigned
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-brand-700 dark:text-brand-300">
              {totalAssignedCourses}
            </span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 font-sans block">
            Assigned to lead educators
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs dark:shadow-none space-y-1 hover:border-slate-400 dark:hover:border-slate-700 transition-colors">
          <span className="text-[10px] uppercase font-sans font-bold text-slate-700 dark:text-slate-300 block tracking-wider">
            Active Educators
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeMentorsNowCount} / {mentorsSummary.length}
            </span>
            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 font-sans block">
            Online today or this week
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN MENTOR ENROLLMENT TABLE CARD
          ═══════════════════════════════════════════════════════════════ */}
      <Card className="border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Mentor Directory &amp; Student Enrollment Breakdown</span>
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Overview of all appointed instructors, courses assigned to each mentor, and the exact count of students enrolled under each mentor.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {filteredMentors.length} of {mentorsSummary.length} Mentors Shown
              </span>
            </div>
          </div>

          {/* Search and Filters Toolbar */}
          {/* Search and Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors..."
                className="w-full pl-9 pr-3 text-xs font-semibold rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[34px] shadow-2xs transition-all"
              />
            </div>

            {/* Language Track Filter */}
            <Dropdown
              size="sm"
              options={[
                { value: 'ALL', label: 'All Languages' },
                { value: 'python', label: 'Python' },
                { value: 'javascript', label: 'JavaScript' },
                { value: 'java', label: 'Java' },
                { value: 'typescript', label: 'TypeScript' },
              ]}
              value={selectedLanguage}
              onChange={(val) => setSelectedLanguage(val)}
            />

            {/* Country Filter */}
            <Dropdown
              size="sm"
              options={[
                { value: 'ALL', label: 'All Nations' },
                ...countriesList.map((c) => ({ value: c, label: c })),
              ]}
              value={selectedCountry}
              onChange={(val) => setSelectedCountry(val)}
            />

            {/* Status Filter */}
            <Dropdown
              size="sm"
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'active', label: 'Active Now / Today' },
                { value: 'inactive', label: 'Idle / Offline' },
              ]}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
            />

            {/* Sort Order */}
            <Dropdown
              size="sm"
              options={[
                { value: 'students_desc', label: 'Most Enrolled (High → Low)' },
                { value: 'students_asc', label: 'Least Enrolled (Low → High)' },
                { value: 'courses_desc', label: 'Most Courses Assigned' },
                { value: 'name_asc', label: 'Mentor Name (A → Z)' },
                { value: 'xp_desc', label: 'Highest Telemetry XP' },
              ]}
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
            />
          </div>
        </CardHeader>

        {/* Table / Mobile Content */}
        <CardContent className="p-0">
          {/* ═══════════════════════════════════════════════════════════════
              MOBILE VIEW: MENTOR CARDS (md:hidden)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMentors.length === 0 ? (
              <div className="py-10 text-center text-slate-500 font-mono text-xs">
                No mentors matched your search and filter criteria.
              </div>
            ) : (
              filteredMentors.map(({ mentor, courses, courseCount, totalEnrolledCount, learners }, index) => {
                const isExpanded = expandedMentorId === mentor.id
                const enrollmentSharePercent = totalStudentsAcrossMentors > 0
                  ? Math.round((totalEnrolledCount / totalStudentsAcrossMentors) * 100)
                  : 0

                return (
                  <div key={mentor.id} className="p-4 space-y-3.5 bg-white dark:bg-slate-900">
                    {/* Header Row: Avatar, Name, Role & Status */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-3xs">
                          {mentor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {mentor.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#005F02]/10 text-[#005F02] dark:text-emerald-400 border border-[#005F02]/20">
                              #{String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block truncate">
                            {mentor.email}
                          </span>
                        </div>
                      </div>

                      {/* Live Status Pill */}
                      <div className="shrink-0">
                        {mentor.status === 'active_now' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Active Now
                          </span>
                        )}
                        {mentor.status === 'active_today' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active Today
                          </span>
                        )}
                        {mentor.status === 'active_this_week' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-[10px] font-bold border border-sky-200 dark:border-sky-800">
                            Active Week
                          </span>
                        )}
                        {(mentor.status === 'idle' || mentor.status === 'inactive') && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px] font-bold">
                            Offline
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata Badges: Specialty, Country & Enrolled Count */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[10px] uppercase text-slate-400 font-bold block">Track &amp; Country</span>
                        <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-semibold truncate">
                          <Globe className="w-3 h-3 text-brand-500 shrink-0" />
                          <span>{mentor.favoriteLanguage?.toUpperCase()} • {mentor.countryCode}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-0.5">
                        <span className="text-[10px] uppercase text-emerald-800 dark:text-emerald-400 font-bold block">Enrolled Students</span>
                        <div className="flex items-center gap-1 font-bold text-[#005F02] dark:text-emerald-400">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-sm font-extrabold">{totalEnrolledCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Courses */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                          <span>{courseCount} Assigned {courseCount === 1 ? 'Course' : 'Courses'}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {enrollmentSharePercent}% platform share
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {courses.map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-semibold"
                          >
                            {c.title} ({c.enrolledCount || 0})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expand Student Accordion Toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedMentorId(isExpanded ? null : mentor.id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                      <span>{isExpanded ? 'Hide Student Roster' : `View Student Roster (${learners.length})`}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Expanded Mobile Student List */}
                    {isExpanded && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                          Verified Students ({learners.length})
                        </span>
                        {learners.length === 0 ? (
                          <p className="text-xs text-slate-400 py-2 text-center font-mono">
                            No student user records found.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {learners.map((learner) => (
                              <div key={learner.id} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 dark:text-white truncate">
                                    {learner.name}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400 truncate">
                                    {learner.countryCode} • {learner.totalXp} XP • 🔥 {learner.streakDays}d
                                  </div>
                                </div>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                                  learner.status === 'active_now' || learner.status === 'active_today'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}>
                                  {learner.status === 'active_now' ? 'ONLINE' : 'ACTIVE'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              DESKTOP VIEW: FULL DATA TABLE (hidden md:block)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">
                  <th className="py-3 pl-4 pr-1 w-10 text-center font-semibold">#</th>
                  <th className="py-3 px-4 font-semibold min-w-[220px]">Mentor Profile</th>
                  <th className="py-3 px-4 font-semibold min-w-[130px]">Specialty &amp; Nation</th>
                  <th className="py-3 px-4 font-semibold min-w-[200px]">Assigned Courses</th>
                  <th className="py-3 px-4 font-semibold min-w-[170px] text-right">Students Enrolled</th>
                  <th className="py-3 px-4 font-semibold min-w-[130px] text-center">Live Status</th>
                  <th className="py-3 pr-4 pl-2 font-semibold text-right min-w-[130px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                {filteredMentors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500 font-mono text-xs">
                      No mentors matched your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredMentors.map(({ mentor, courses, courseCount, totalEnrolledCount, learners }, index) => {
                    const isExpanded = expandedMentorId === mentor.id
                    const enrollmentSharePercent = totalStudentsAcrossMentors > 0
                      ? Math.round((totalEnrolledCount / totalStudentsAcrossMentors) * 100)
                      : 0

                    return (
                      <React.Fragment key={mentor.id}>
                        <tr className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                          isExpanded ? 'bg-slate-50/90 dark:bg-slate-800/50' : ''
                        }`}>
                          {/* Index */}
                          <td className="py-4 pl-4 pr-1 text-center font-mono text-[11px] text-slate-400 font-bold">
                            {String(index + 1).padStart(2, '0')}
                          </td>

                          {/* Mentor Profile */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-3xs">
                                {mentor.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                                    {mentor.name}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#005F02]/10 text-[#005F02] dark:text-emerald-400 border border-[#005F02]/20 shrink-0">
                                    MENTOR
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block truncate">
                                  {mentor.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Specialty & Country */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                <Globe className="w-3 h-3 text-brand-500" />
                                {mentor.countryName} ({mentor.countryCode})
                              </span>
                              <span className="block text-[10px] font-mono text-slate-400 uppercase font-semibold">
                                {mentor.favoriteLanguage} Track
                              </span>
                            </div>
                          </td>

                          {/* Assigned Courses */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                                <span>{courseCount} {courseCount === 1 ? 'Assigned Course' : 'Assigned Courses'}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {courses.map((c) => (
                                  <span
                                    key={c.id}
                                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-semibold"
                                  >
                                    {c.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Students Enrolled (HIGHLIGHTED NUMBER) */}
                          <td className="py-4 px-4 text-right">
                            <div className="space-y-1">
                              <div className="flex items-center justify-end gap-1.5">
                                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-extrabold font-mono text-[#005F02] dark:text-emerald-400">
                                  {totalEnrolledCount.toLocaleString()}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">students</span>
                              </div>

                              {/* Visual enrollment share bar */}
                              <div className="w-28 ml-auto bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(5, enrollmentSharePercent))}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 block">
                                {enrollmentSharePercent}% of mentored learners
                              </span>
                            </div>
                          </td>

                          {/* Live Status */}
                          <td className="py-4 px-4 text-center">
                            {mentor.status === 'active_now' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                Active Now
                              </span>
                            )}
                            {mentor.status === 'active_today' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#005F02] dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active Today
                              </span>
                            )}
                            {mentor.status === 'active_this_week' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono text-[10px] font-bold border border-sky-200 dark:border-sky-800">
                                Active This Week
                              </span>
                            )}
                            {(mentor.status === 'idle' || mentor.status === 'inactive') && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px] font-bold">
                                Idle / Offline
                              </span>
                            )}
                          </td>

                          {/* Expandable Action Button */}
                          <td className="py-4 pr-4 pl-2 text-right">
                            <button
                              type="button"
                              onClick={() => setExpandedMentorId(isExpanded ? null : mentor.id)}
                              className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/80 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-3xs"
                            >
                              <span>{isExpanded ? 'Hide' : 'View Students'}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Student List Accordion */}
                        {isExpanded && (
                          <tr className="bg-slate-50/90 dark:bg-slate-950/70">
                            <td colSpan={7} className="p-4 sm:p-5">
                              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 shadow-inner">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                      Students Enrolled in {mentor.name}'s Courses ({learners.length} Verified Profile Records)
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                    <span>Courses: {courses.map((c) => `${c.title} (${c.enrolledCount || 0} enrolled)`).join(' • ')}</span>
                                  </div>
                                </div>

                                {learners.length === 0 ? (
                                  <p className="text-xs text-slate-400 py-3 text-center font-mono">
                                    No direct student user profile accounts found for this track.
                                  </p>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                      <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                                          <th className="py-2 px-3">Student Name</th>
                                          <th className="py-2 px-3">Country</th>
                                          <th className="py-2 px-3">Active Track</th>
                                          <th className="py-2 px-3">Progress Metrics</th>
                                          <th className="py-2 px-3">Telemetry Status</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                                        {learners.map((learner) => (
                                          <tr key={learner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                            <td className="py-2.5 px-3">
                                              <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
                                                  {learner.name.charAt(0)}
                                                </div>
                                                <div>
                                                  <div className="font-bold text-slate-900 dark:text-white">{learner.name}</div>
                                                  <div className="text-[10px] font-mono text-slate-400">@{learner.username} • {learner.email}</div>
                                                </div>
                                              </div>
                                            </td>

                                            <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                                              {learner.countryName} ({learner.countryCode})
                                            </td>

                                            <td className="py-2.5 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                                              {learner.activeCourseTitle || learner.enrolledCourseTitles?.[0] || mentor.activeCourseTitle}
                                            </td>

                                            <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                                              {learner.totalXp.toLocaleString()} XP • 🔥 {learner.streakDays}d streak
                                            </td>

                                            <td className="py-2.5 px-3">
                                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                                learner.status === 'active_now' || learner.status === 'active_today'
                                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                              }`}>
                                                {learner.status.replace('_', ' ').toUpperCase()}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
