import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AdminUserRecord } from '@/types/admin-analytics'
import { courseStoreService } from '@/services/learning/course-store.service'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import {
  GraduationCap,
  Shield,
  ChevronDown,
  Check,
  Search,
  Users,
  BookOpen,
} from 'lucide-react'

interface MentorPersonaDropdownProps {
  currentUser: AdminUserRecord
  adminUsers: AdminUserRecord[]
  onSelectPersona: (userId: string) => void
  className?: string
}

export const MentorPersonaDropdown: React.FC<MentorPersonaDropdownProps> = ({
  currentUser,
  adminUsers,
  onSelectPersona,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Process mentors with exact enrolled student count and course counts
  const mentorsWithStats = useMemo(() => {
    return adminUsers
      .filter((u) => u.role === 'instructor')
      .map((mentor) => {
        const assignedCourses = courseStoreService.getCoursesByMentor(
          mentor.id,
          mentor.enrolledCourseIds,
          mentor.favoriteLanguage
        )
        const mentorLearners = adminAnalyticsService.getLearnersForMentor(mentor, assignedCourses)
        const totalEnrolled = assignedCourses.reduce(
          (sum, c) => sum + (c.enrolledCount || 0),
          0
        ) || mentorLearners.length

        return {
          user: mentor,
          courses: assignedCourses,
          courseCount: assignedCourses.length,
          studentCount: totalEnrolled,
        }
      })
  }, [adminUsers])

  const admins = useMemo(() => {
    return adminUsers.filter((u) => u.role === 'admin')
  }, [adminUsers])

  // Filter based on search query
  const filteredMentors = useMemo(() => {
    if (!searchQuery.trim()) return mentorsWithStats
    const q = searchQuery.toLowerCase().trim()
    return mentorsWithStats.filter(
      (m) =>
        m.user.name.toLowerCase().includes(q) ||
        m.user.countryName.toLowerCase().includes(q) ||
        m.user.countryCode.toLowerCase().includes(q) ||
        m.user.favoriteLanguage.toLowerCase().includes(q) ||
        m.courses.some((c) => c.title.toLowerCase().includes(q))
    )
  }, [mentorsWithStats, searchQuery])

  const filteredAdmins = useMemo(() => {
    if (!searchQuery.trim()) return admins
    const q = searchQuery.toLowerCase().trim()
    return admins.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
    )
  }, [admins, searchQuery])

  // Selected persona stats
  const currentMentorStats = useMemo(() => {
    if (currentUser.role !== 'instructor') return null
    return mentorsWithStats.find((m) => m.user.id === currentUser.id)
  }, [currentUser, mentorsWithStats])

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700/80 hover:border-purple-500 dark:hover:border-purple-500 text-xs text-slate-800 dark:text-slate-200 transition-all shadow-3xs cursor-pointer min-w-[260px] sm:min-w-[320px]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 text-left">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-3xs ${
            currentUser.role === 'instructor' ? 'bg-amber-600' : 'bg-purple-600'
          }`}>
            {currentUser.role === 'instructor' ? currentUser.name.charAt(0) : <Shield className="w-3.5 h-3.5" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white truncate text-xs">
                {currentUser.name}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                currentUser.role === 'instructor'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
              }`}>
                {currentUser.role === 'instructor' ? `${currentUser.favoriteLanguage?.toUpperCase()}` : 'ADMIN'}
              </span>
            </div>

            {currentMentorStats ? (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span>{currentMentorStats.courseCount} course(s)</span>
                <span>•</span>
                <span className="text-[#005F02] dark:text-emerald-400 font-bold">
                  {currentMentorStats.studentCount.toLocaleString()} students
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-mono text-slate-400 block">
                Platform Administrator
              </span>
            )}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
          isOpen ? 'rotate-180 text-purple-600 dark:text-purple-400' : ''
        }`} />
      </button>

      {/* Dropdown Menu Popover with custom scrollbar */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 sm:w-[400px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header & Quick Search Bar */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 font-bold px-0.5">
              <span>Select Active Persona / Mentor</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">
                {mentorsWithStats.length} Mentors Listed
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors by name, language, country..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                autoFocus
              />
            </div>
          </div>

          {/* Scrollable Personas List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-1.5 space-y-1">
            {/* Administrators Group */}
            {filteredAdmins.length > 0 && (
              <div className="space-y-1 py-1">
                <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400 tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  <span>System Administrators</span>
                </div>

                {filteredAdmins.map((admin) => {
                  const isSelected = currentUser.id === admin.id
                  return (
                    <button
                      key={admin.id}
                      type="button"
                      onClick={() => {
                        onSelectPersona(admin.id)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 font-bold border border-purple-200 dark:border-purple-800/80'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-3xs">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white truncate">
                              {admin.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              ADMIN
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-slate-400 truncate">
                            Global Platform Access • All courses &amp; telemetry
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Verified Mentors Group */}
            <div className="space-y-1 py-1">
              <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>All Verified Mentors (Courses &amp; Students)</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {filteredMentors.length} mentors
                </span>
              </div>

              {filteredMentors.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 font-mono">
                  No mentors match "{searchQuery}"
                </div>
              ) : (
                filteredMentors.map(({ user: mentor, courseCount, studentCount }) => {
                  const isSelected = currentUser.id === mentor.id
                  const isLiveActive =
                    mentor.status === 'active_now' ||
                    mentor.status === 'active_today' ||
                    mentor.status === 'active_this_week'

                  return (
                    <button
                      key={mentor.id}
                      type="button"
                      onClick={() => {
                        onSelectPersona(mentor.id)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between gap-3 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800 shadow-3xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-3xs">
                            {mentor.name.charAt(0)}
                          </div>
                          {isLiveActive && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white truncate">
                              {mentor.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {mentor.favoriteLanguage}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({mentor.countryName})
                            </span>
                          </div>

                          {/* EXACT COURSE AND STUDENT COUNT ROW */}
                          <div className="flex items-center gap-2.5 text-[11px] font-mono flex-wrap">
                            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                              <BookOpen className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                              <span>{courseCount} {courseCount === 1 ? 'course' : 'courses'}</span>
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="flex items-center gap-1 text-[#005F02] dark:text-emerald-400 font-bold">
                              <Users className="w-3 h-3 text-emerald-500" />
                              <span>{studentCount.toLocaleString()} enrolled students</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Footer Helper */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-center text-[10px] font-mono text-slate-400">
            Scroll to view all mentors and their assigned student &amp; course counts
          </div>
        </div>
      )}
    </div>
  )
}
