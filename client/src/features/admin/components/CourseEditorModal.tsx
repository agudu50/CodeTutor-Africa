import React, { useState, useEffect, useRef, memo } from 'react'
import { Course, ProgrammingLanguage, DifficultyLevel, Module, QuizQuestion } from '@/types'
import { courseStoreService } from '@/services/learning/course-store.service'
import { adminAnalyticsService } from '@/services/admin/admin-analytics.service'
import { aiService } from '@/services/ai/ai.service'
import { Button, Input, Textarea, Dropdown } from '@/components/ui'
import {
  GraduationCap,
  X,
  Plus,
  BookOpen,
  Check,
  Clock,
  Database,
  Play,
  Zap,
  HelpCircle,
  Trash2,
} from 'lucide-react'

// Preset Curated Cover Images (SVGs and gradients that work 100% offline)
const PRESET_COVERS = [
  {
    label: 'Python Dark',
    url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'JavaScript Neon',
    url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Java Enterprise',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Algorithms & Math',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Systems & Hardware',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Cloud & Database',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
  },
]

interface CourseEditorModalProps {
  isOpen: boolean
  onClose: () => void
  courseToEdit?: Course | null
  onSaved: (savedCourse: Course) => void
}

export const CourseEditorModal: React.FC<CourseEditorModalProps> = memo(({
  isOpen,
  onClose,
  courseToEdit,
  onSaved,
}) => {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [language, setLanguage] = useState<ProgrammingLanguage>('python')
  const [isCustomLanguage, setIsCustomLanguage] = useState(false)
  const [customLanguageText, setCustomLanguageText] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner')
  const [category, setCategory] = useState('Core Programming')
  const [estimatedHours, setEstimatedHours] = useState(20)
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [mentorId, setMentorId] = useState('')
  const [mentorName, setMentorName] = useState('')
  const [generatingLessonId, setGeneratingLessonId] = useState<string | null>(null)
  const [modules, setModules] = useState<Array<{
    id: string
    title: string
    description: string
    lessons: Array<{
      id: string
      title: string
      durationMinutes: number
      contentMarkdown: string
      videoUrl?: string
      quizQuestions?: QuizQuestion[]
    }>
  }>>([])

  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (courseToEdit) {
      setTitle(courseToEdit.title)
      setSlug(courseToEdit.slug)
      const currentLang = courseToEdit.language || 'python'
      const knownLanguages = [
        'python',
        'javascript',
        'typescript',
        'html',
        'css',
        'git',
        'java',
        'sql',
        'cpp',
        'c',
        'go',
        'rust',
        'php',
        'csharp',
      ]
      if (knownLanguages.includes(currentLang.toLowerCase())) {
        setLanguage(currentLang.toLowerCase() as ProgrammingLanguage)
        setIsCustomLanguage(false)
        setCustomLanguageText('')
      } else {
        setLanguage(currentLang as ProgrammingLanguage)
        setIsCustomLanguage(true)
        setCustomLanguageText(currentLang)
      }
      setDifficulty(courseToEdit.difficulty)
      setCategory(courseToEdit.category)
      setEstimatedHours(courseToEdit.estimatedHours)
      setDescription(courseToEdit.description)
      setThumbnailUrl(courseToEdit.thumbnailUrl || '')
      setMentorId(courseToEdit.mentorId || '')
      setMentorName(courseToEdit.mentorName || courseToEdit.instructorName || '')
      setModules(
        courseToEdit.modules.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            durationMinutes: l.durationMinutes,
            contentMarkdown: l.contentMarkdown,
            videoUrl: l.videoUrl || '',
            quizQuestions: l.quizQuestions || [],
          })),
        }))
      )
    } else {
      // Default new course boilerplate
      const activeSession = adminAnalyticsService.getActiveUserSession()
      const isMentor = activeSession && activeSession.role === 'instructor'
      const defaultMentor = isMentor
        ? activeSession
        : adminAnalyticsService.getAllUsers().find((u) => u.role === 'instructor')

      setTitle('')
      setSlug('')
      setLanguage('python')
      setDifficulty('beginner')
      setCategory('Core Programming')
      setEstimatedHours(16)
      setDescription('')
      setThumbnailUrl('')
      setMentorId(defaultMentor?.id || '')
      setMentorName(defaultMentor?.name || '')
      setModules([
        {
          id: `mod-${Date.now()}-1`,
          title: 'Module 1: Getting Started & Syntax',
          description: 'Introduction to fundamentals, core syntax, and memory model.',
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: 'Lesson 1: Environment & First Steps',
              durationMinutes: 20,
              contentMarkdown: '# Welcome to the Course\n\nIn this lesson, you will learn foundational concepts...',
              videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
              quizQuestions: [],
            },
          ],
        },
      ])
    }
  }, [courseToEdit, isOpen])

  if (!isOpen) return null

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!courseToEdit) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  // Handle local image file selection (convert to base64 DataURL for 100% offline persistence)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      alert('Please select an image smaller than 4MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailUrl(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAddModule = () => {
    setModules((prev) => [
      ...prev,
      {
        id: `mod-${Date.now()}`,
        title: `Module ${prev.length + 1}: Core Concepts`,
        description: 'Module overview and learning objectives.',
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: 'New Lesson',
            durationMinutes: 25,
            contentMarkdown: '# Lesson Overview\n\nContent for this lesson...',
            videoUrl: '',
            quizQuestions: [],
          },
        ],
      },
    ])
  }

  const handleRemoveModule = (modIdx: number) => {
    const modTitle = modules[modIdx]?.title || `Module ${modIdx + 1}`
    if (window.confirm(`Are you sure you want to remove "${modTitle}" and all its lessons?`)) {
      setModules((prev) => prev.filter((_, idx) => idx !== modIdx))
    }
  }

  const handleAddLesson = (modIdx: number) => {
    setModules((prev) => {
      const copy = [...prev]
      copy[modIdx].lessons.push({
        id: `les-${Date.now()}`,
        title: `Lesson ${copy[modIdx].lessons.length + 1}`,
        durationMinutes: 30,
        contentMarkdown: '# Lesson Topic\n\nCore explanation and practical coding examples...',
        videoUrl: '',
        quizQuestions: [],
      })
      return copy
    })
  }

  const handleRemoveLesson = (modIdx: number, lesIdx: number) => {
    const lessonTitle = modules[modIdx]?.lessons[lesIdx]?.title || `Lesson ${lesIdx + 1}`
    if (window.confirm(`Are you sure you want to remove "${lessonTitle}"?`)) {
      setModules((prev) => {
        const copy = [...prev]
        copy[modIdx].lessons = copy[modIdx].lessons.filter((_, idx) => idx !== lesIdx)
        return copy
      })
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // AI CONTENT & MULTI-FORMAT ASSESSMENT GENERATOR
  // ══════════════════════════════════════════════════════════════════════
  const handleAIGenerateForLesson = async (modIdx: number, lesIdx: number) => {
    const lesson = modules[modIdx]?.lessons[lesIdx]
    if (!lesson) return

    setGeneratingLessonId(lesson.id)

    try {
      const generated = await aiService.generateLessonCurriculum({
        topic: lesson.title || 'Core Programming Fundamentals',
        language,
        difficulty,
      })

      setModules((prev) => {
        const copy = [...prev]
        const targetLesson = copy[modIdx].lessons[lesIdx]
        targetLesson.contentMarkdown = generated.contentMarkdown
        if (!targetLesson.videoUrl) {
          targetLesson.videoUrl = generated.recommendedVideoUrl
        }
        targetLesson.quizQuestions = generated.quizQuestions
        targetLesson.durationMinutes = generated.durationMinutes || targetLesson.durationMinutes
        return copy
      })
    } catch (e) {
      console.error('Failed to generate AI curriculum content', e)
    } finally {
      setGeneratingLessonId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 400))

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

    const finalModules: Module[] = modules.map((m, mIdx) => ({
      id: m.id || `mod-${Date.now()}-${mIdx}`,
      courseId: courseToEdit ? courseToEdit.id : `course-${Date.now()}`,
      title: m.title,
      description: m.description,
      order: mIdx + 1,
      createdAt: new Date().toISOString(),
      lessons: m.lessons.map((l, lIdx) => ({
        id: l.id || `les-${Date.now()}-${lIdx}`,
        courseId: courseToEdit ? courseToEdit.id : `course-${Date.now()}`,
        title: l.title,
        slug: l.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Hands-on lesson for ${l.title}`,
        durationMinutes: l.durationMinutes || 25,
        order: lIdx + 1,
        isCompleted: false,
        contentMarkdown: l.contentMarkdown,
        videoUrl: l.videoUrl?.trim() ? l.videoUrl.trim() : undefined,
        quizQuestions: l.quizQuestions || [],
        createdAt: new Date().toISOString(),
      })),
    }))

    let saved: Course
    if (courseToEdit) {
      saved = courseStoreService.updateCourse(courseToEdit.id, {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        language,
        difficulty,
        category,
        estimatedHours,
        description,
        mentorId: mentorId || undefined,
        mentorName: mentorName || undefined,
        instructorName: mentorName || undefined,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        totalLessons,
        modules: finalModules,
      }) || courseToEdit
    } else {
      saved = courseStoreService.createCourse({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        language,
        difficulty,
        category,
        estimatedHours,
        description,
        mentorId: mentorId || undefined,
        mentorName: mentorName || undefined,
        instructorName: mentorName || undefined,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        totalLessons,
        modules: finalModules,
      })
    }

    setIsSaving(false)
    onSaved(saved)
    onClose()
  }

  const languageOptions = [
    { value: 'python', label: 'Python (Data Science, AI & General Programming)' },
    { value: 'javascript', label: 'JavaScript (Frontend, Node.js & Fullstack)' },
    { value: 'typescript', label: 'TypeScript (Type-Safe Enterprise Apps)' },
    { value: 'html', label: 'HTML / HTML5 (Web Semantics & DOM Structure)' },
    { value: 'css', label: 'CSS / CSS3 (Styling, Flexbox, Grid & UI Design)' },
    { value: 'git', label: 'Git & GitHub (Version Control & Collaboration)' },
    { value: 'java', label: 'Java (OOP, Android & Cloud Backend)' },
    { value: 'sql', label: 'SQL (PostgreSQL, SQLite & Databases)' },
    { value: 'cpp', label: 'C++ (High-Performance Systems & Algorithms)' },
    { value: 'c', label: 'C (Low-Level Systems & Embedded HW)' },
    { value: 'go', label: 'Go / Golang (Cloud Native & Concurrency)' },
    { value: 'rust', label: 'Rust (Memory Safe Systems & WebAssembly)' },
    { value: 'php', label: 'PHP (Web Platforms & Server Backend)' },
    { value: 'csharp', label: 'C# / .NET (Enterprise, Desktop & Games)' },
    { value: 'custom', label: '+ Add Other / Custom Technology Track...' },
  ]

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner Level' },
    { value: 'intermediate', label: 'Intermediate Level' },
    { value: 'advanced', label: 'Advanced Level' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[94vh] sm:max-h-[92vh] rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
        {/* Header Bar */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-xs shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold leading-tight text-slate-900 dark:text-white truncate">
                {courseToEdit ? 'Edit Course Curriculum' : 'Create New Course Track'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Admin Course Creator with AI theory, video links &amp; quizzes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Course Title <span className="text-rose-500">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Data Structures & Algorithms with Java"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-xs font-medium border-slate-300 dark:border-slate-700"
              />
            </div>

            {/* Language */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Programming Language / Track
              </label>
              <Dropdown
                options={languageOptions}
                value={isCustomLanguage ? 'custom' : language}
                onChange={(val) => {
                  if (val === 'custom') {
                    setIsCustomLanguage(true)
                    setLanguage((customLanguageText.trim().toLowerCase() || 'custom') as ProgrammingLanguage)
                  } else {
                    setIsCustomLanguage(false)
                    setLanguage(val as ProgrammingLanguage)
                  }
                }}
                className="text-xs font-medium"
              />
            </div>

            {/* Custom Language Input when 'custom' is selected */}
            {isCustomLanguage && (
              <div className="space-y-1 sm:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Custom Technology / Track Name <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomLanguage(false)
                      setLanguage('python')
                    }}
                    className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline font-mono"
                  >
                    Select from standard list
                  </button>
                </div>
                <Input
                  placeholder="e.g. Kotlin, Swift, Dart, Ruby, Docker, Bash, React"
                  value={customLanguageText}
                  onChange={(e) => {
                    setCustomLanguageText(e.target.value)
                    setLanguage(e.target.value.toLowerCase().trim() as ProgrammingLanguage)
                  }}
                  className="text-xs font-medium border-slate-300 dark:border-slate-700"
                  required
                />
              </div>
            )}

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Difficulty Level
              </label>
              <Dropdown
                options={difficultyOptions}
                value={difficulty}
                onChange={(val) => setDifficulty(val as DifficultyLevel)}
                className="text-xs font-medium"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Curriculum Category
              </label>
              <Input
                placeholder="e.g. Core Programming, Web, Systems"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs border-slate-300 dark:border-slate-700"
              />
            </div>

            {/* Estimated Hours */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Estimated Hours
              </label>
              <Input
                type="number"
                min={1}
                max={200}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="text-xs border-slate-300 dark:border-slate-700 font-mono"
              />
            </div>

            {/* Assigned Mentor */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Assigned Course Mentor / Instructor</span>
              </label>
              <select
                value={mentorId}
                onChange={(e) => {
                  const selectedId = e.target.value
                  setMentorId(selectedId)
                  const found = adminAnalyticsService.getAllUsers().find((u) => u.id === selectedId)
                  setMentorName(found ? found.name : '')
                }}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans"
              >
                <option value="">-- No Mentor Assigned (Platform General) --</option>
                {adminAnalyticsService.getAllUsers().filter((u) => u.role === 'instructor').map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name} ({mentor.countryName} • @{mentor.username})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Course Description <span className="text-rose-500">*</span>
            </label>
            <Textarea
              required
              rows={3}
              placeholder="High-level overview of outcomes, audience, and practical projects..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs font-sans leading-relaxed border-slate-300 dark:border-slate-700"
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              COURSE THUMBNAIL / BANNER IMAGE BUILDER
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
            <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
              <div className="space-y-0.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  Course Cover Image / Thumbnail
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Upload an image from device or paste an image URL.
                </p>
              </div>

              {thumbnailUrl && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove the cover image?')) {
                      setThumbnailUrl('')
                    }
                  }}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Remove Image
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Image Preview & Upload Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Preview Thumbnail Container */}
              <div className="sm:col-span-4 h-24 sm:h-28 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center relative shadow-3xs">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400 space-y-0.5">
                    <BookOpen className="w-5 h-5 mx-auto opacity-50 text-brand-600 dark:text-brand-400" />
                    <span className="text-[10px] font-mono block">No cover image</span>
                  </div>
                )}
              </div>

              {/* Upload or URL Inputs */}
              <div className="sm:col-span-8 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs font-bold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Upload from Device
                  </Button>

                  <span className="text-[11px] text-slate-500 font-mono">or paste URL:</span>
                </div>

                <Input
                  type="url"
                  placeholder="https://example.com/course-banner.jpg or data:image/..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="text-xs font-mono border-slate-300 dark:border-slate-700"
                />

                {/* Preset suggestions */}
                <div className="space-y-1 pt-0.5">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">
                    Quick Preset Covers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COVERS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setThumbnailUrl(preset.url)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          thumbnailUrl === preset.url
                            ? 'bg-brand-600 text-white border-brand-600 shadow-2xs font-bold'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-brand-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              MODULE & LESSON BUILDER WITH AI QUIZ & THEORY SYNTHESIZER
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
                  Modules &amp; Lessons ({modules.length} Modules)
                </h4>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddModule}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 border-slate-300 dark:border-slate-700"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Module
              </Button>
            </div>

            {/* Module Cards */}
            <div className="space-y-3.5 sm:space-y-4">
              {modules.map((mod, modIdx) => (
                <div
                  key={mod.id}
                  className="p-3 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-3"
                >
                  {/* Module Header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const val = e.target.value
                        setModules((prev) => {
                          const copy = [...prev]
                          copy[modIdx].title = val
                          return copy
                        })
                      }}
                      placeholder="Module Title (e.g. Module 1: Core Syntax)"
                      className="font-bold text-xs sm:text-sm bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-brand-500 focus:outline-none text-slate-900 dark:text-white flex-1 py-0.5 min-w-[180px]"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddLesson(modIdx)}
                        className="h-7 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50"
                        leftIcon={<Plus className="w-3 h-3" />}
                      >
                        Add Lesson
                      </Button>

                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(modIdx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete module"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lessons list with AI generator + YouTube Video + Quiz counters */}
                  <div className="space-y-2.5 sm:space-y-3 pl-1.5 sm:pl-3 border-l-2 border-slate-200 dark:border-slate-800">
                    {mod.lessons.map((les, lesIdx) => {
                      const isGenerating = generatingLessonId === les.id
                      const quizCount = les.quizQuestions?.length || 0

                      return (
                        <div
                          key={les.id}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-2.5 shadow-2xs text-xs"
                        >
                          {/* Lesson Header Area */}
                          <div className="space-y-2">
                            {/* Top Row: Lesson Index Pill + Title Input + Delete Button */}
                            <div className="flex items-center gap-2">
                              <span className="shrink-0 px-2 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-[10px] font-mono font-bold text-brand-700 dark:text-brand-300">
                                L{lesIdx + 1}
                              </span>

                              <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-950/60 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/30 transition-all min-w-0">
                                <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                                <input
                                  type="text"
                                  value={les.title}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    setModules((prev) => {
                                      const copy = [...prev]
                                      copy[modIdx].lessons[lesIdx].title = val
                                      return copy
                                    })
                                  }}
                                  className="w-full bg-transparent text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none placeholder-slate-400"
                                  placeholder="Lesson Title (e.g. Lesson 1: Introduction)"
                                />
                              </div>

                              {mod.lessons.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLesson(modIdx, lesIdx)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                                  title="Delete lesson"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Actions Toolbar Row: AI Auto-Generate Button + Duration Pill */}
                            <div className="flex items-center justify-between gap-2 pt-0.5">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                isLoading={isGenerating}
                                onClick={() => handleAIGenerateForLesson(modIdx, lesIdx)}
                                className="h-7 px-2.5 text-[10px] sm:text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50/70 dark:bg-brand-950/70 border-brand-200 dark:border-brand-800/80 hover:bg-brand-100 dark:hover:bg-brand-900/60 shadow-3xs"
                                leftIcon={<Zap className="w-3 h-3 text-brand-600 dark:text-brand-400" />}
                              >
                                {isGenerating ? 'Synthesizing...' : 'AI Auto-Generate'}
                              </Button>

                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-semibold">
                                <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                                <input
                                  type="number"
                                  min={5}
                                  max={180}
                                  value={les.durationMinutes}
                                  onChange={(e) => {
                                    const val = Number(e.target.value)
                                    setModules((prev) => {
                                      const copy = [...prev]
                                      copy[modIdx].lessons[lesIdx].durationMinutes = val
                                      return copy
                                    })
                                  }}
                                  className="w-7 text-right bg-transparent text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-none font-bold"
                                />
                                <span className="text-slate-400 text-[10px]">min</span>
                              </div>
                            </div>
                          </div>

                          {/* YouTube Video URL Input */}
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 flex-wrap sm:flex-nowrap">
                            <div className="p-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                              <Play className="w-3 h-3 fill-rose-600 dark:fill-rose-400" />
                            </div>
                            <input
                              type="url"
                              value={les.videoUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value
                                setModules((prev) => {
                                  const copy = [...prev]
                                  copy[modIdx].lessons[lesIdx].videoUrl = val
                                  return copy
                                })
                              }}
                              placeholder="YouTube Video Link (e.g. https://www.youtube.com/watch?v=...)"
                              className="bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 flex-1 min-w-[200px]"
                            />
                            {les.videoUrl && (
                              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 shrink-0">
                                Video Attached
                              </span>
                            )}
                          </div>

                          {/* ═══════════════════════════════════════════════════════════════
                              PRE-VIDEO READING TEXT & THEORY NOTES (MARKDOWN EDITOR)
                              ═══════════════════════════════════════════════════════════════ */}
                          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <BookOpen className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                                <span>Pre-Video Theory &amp; Notes:</span>
                              </label>
                              <span className="text-[10px] font-mono text-slate-400">Markdown</span>
                            </div>

                            <textarea
                              rows={4}
                              value={les.contentMarkdown || ''}
                              onChange={(e) => {
                                const val = e.target.value
                                setModules((prev) => {
                                  const copy = [...prev]
                                  copy[modIdx].lessons[lesIdx].contentMarkdown = val
                                  return copy
                                })
                              }}
                              placeholder="# Introduction & Key Theory&#10;&#10;Explain foundational principles, syntax rules, and memory architecture before the video tutorial begins..."
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-[11px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-500 resize-y"
                            />
                          </div>

                          {/* Generated Assessments Summary Indicator */}
                          {quizCount > 0 && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono flex-wrap gap-1">
                              <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold">
                                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{quizCount} Interactive Assessment Items</span>
                              </span>
                              <span className="text-slate-400 font-sans text-[10px]">
                                Ready for student test runner
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 gap-2">
            <span className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400">
              {modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons Total
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs font-bold border-slate-300 dark:border-slate-700"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                className="font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs px-3.5 sm:px-4"
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                {courseToEdit ? 'Save Changes' : 'Publish Course'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})

CourseEditorModal.displayName = 'CourseEditorModal'
