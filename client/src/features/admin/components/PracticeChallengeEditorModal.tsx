import React, { useState, useEffect } from 'react'
import { PracticeQuestion, ProgrammingLanguage, DifficultyLevel, TestCase } from '@/types'
import { practiceStoreService } from '@/services/practice/practice-store.service'
import { courseStoreService } from '@/services/learning/course-store.service'
import {
  Code2,
  X,
  Plus,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Clock,
  Shield,
  ChevronDown,
} from 'lucide-react'

interface PracticeChallengeEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (msg: string) => void
  editingQuestion?: PracticeQuestion | null
}

const SUPPORTED_LANGUAGES: { value: ProgrammingLanguage; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
]

export const PracticeChallengeEditorModal: React.FC<PracticeChallengeEditorModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editingQuestion,
}) => {
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner')
  const [category, setCategory] = useState('Algorithms')
  const [courseId, setCourseId] = useState<string>('')
  const [moduleId, setModuleId] = useState<string>('')
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15)
  const [maxAttempts, setMaxAttempts] = useState<number>(3)
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [starterCode, setStarterCode] = useState('')
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 'tc-1', input: '', expectedOutput: '', passed: true },
  ])
  const [hints, setHints] = useState<string[]>([''])

  const courses = courseStoreService.getAllCourses()
  const selectedCourse = courses.find((c) => c.id === courseId)
  const courseModules = selectedCourse?.modules || []

  useEffect(() => {
    if (editingQuestion) {
      setTitle(editingQuestion.title)
      setLanguage(editingQuestion.language)
      setDifficulty(editingQuestion.difficulty)
      setCategory(editingQuestion.category || 'Algorithms')
      setCourseId(editingQuestion.courseId || '')
      setModuleId(editingQuestion.moduleId || '')
      setTimeLimitMinutes(editingQuestion.timeLimitMinutes ?? 15)
      setMaxAttempts(editingQuestion.maxAttempts ?? 3)
      setDescription(editingQuestion.description)
      setTagsInput(editingQuestion.tags.join(', '))
      setStarterCode(editingQuestion.starterCode)
      setTestCases(
        editingQuestion.testCases.length > 0
          ? editingQuestion.testCases
          : [{ id: 'tc-1', input: '', expectedOutput: '', passed: true }]
      )
      setHints(
        editingQuestion.hints && editingQuestion.hints.length > 0
          ? editingQuestion.hints
          : ['']
      )
    } else {
      setTitle('')
      setLanguage('javascript')
      setDifficulty('beginner')
      setCategory('Algorithms')
      setCourseId('')
      setModuleId('')
      setTimeLimitMinutes(15)
      setMaxAttempts(3)
      setDescription('')
      setTagsInput('JavaScript, Arrays, Algorithms')
      setStarterCode(`function solveProblem(input) {\n  // TODO: Write your solution here\n  \n}`)
      setTestCases([
        { id: 'tc-1', input: '[1, 2, 3]', expectedOutput: '[1, 2, 3]', passed: true },
      ])
      setHints(['Think about boundary cases like empty inputs.'])
    }
  }, [editingQuestion, isOpen])

  if (!isOpen) return null

  const handleCourseChange = (id: string) => {
    setCourseId(id)
    setModuleId('')
    if (id) {
      const selected = courses.find((c) => c.id === id)
      if (selected && ['javascript', 'typescript', 'python', 'java'].includes(selected.language)) {
        setLanguage(selected.language as ProgrammingLanguage)
      }
    }
  }

  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      {
        id: `tc-${Date.now()}`,
        input: '',
        expectedOutput: '',
        passed: true,
      },
    ])
  }

  const handleRemoveTestCase = (idx: number) => {
    if (testCases.length <= 1) return
    setTestCases(testCases.filter((_, i) => i !== idx))
  }

  const handleTestCaseChange = (idx: number, field: 'input' | 'expectedOutput', val: string) => {
    const updated = [...testCases]
    updated[idx] = { ...updated[idx], [field]: val }
    setTestCases(updated)
  }

  const handleAddHint = () => {
    setHints([...hints, ''])
  }

  const handleRemoveHint = (idx: number) => {
    if (hints.length <= 1) return
    setHints(hints.filter((_, i) => i !== idx))
  }

  const handleHintChange = (idx: number, val: string) => {
    const updated = [...hints]
    updated[idx] = val
    setHints(updated)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please provide a challenge title.')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const validTestCases = testCases.filter((tc) => tc.input.trim() || tc.expectedOutput.trim())
    const validHints = hints.map((h) => h.trim()).filter((h) => h.length > 0)
    const activeModule = courseModules.find((m) => m.id === moduleId)

    const questionPayload: Omit<PracticeQuestion, 'id' | 'createdAt'> = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description.trim(),
      difficulty,
      language,
      category: category.trim() || 'Core Algorithms',
      tags: tags.length > 0 ? tags : [language, 'Practice'],
      courseId: courseId || undefined,
      courseTitle: selectedCourse?.title || undefined,
      moduleId: moduleId || undefined,
      moduleTitle: activeModule?.title || undefined,
      timeLimitMinutes: timeLimitMinutes > 0 ? timeLimitMinutes : undefined,
      maxAttempts: maxAttempts > 0 ? maxAttempts : undefined,
      starterCode: starterCode.trim(),
      testCases: validTestCases.length > 0 ? validTestCases : [
        { id: 'tc-1', input: 'sample', expectedOutput: 'sample', passed: true },
      ],
      hints: validHints,
    }

    if (editingQuestion) {
      practiceStoreService.updateQuestion(editingQuestion.id, questionPayload)
      onSaved(`Practice challenge "${title}" updated successfully!`)
    } else {
      practiceStoreService.createQuestion(questionPayload)
      onSaved(`Created new practice challenge "${title}"!`)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#005F02] text-white shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {editingQuestion ? 'Edit Practice Challenge' : 'Create Practice Challenge'}
              </h2>
              <p className="text-xs text-slate-500">
                Design interactive coding problems with starter templates, hints, clock timers, and attempt limits.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Challenge Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Recursive Palindrome Checker"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Output, Variables, Loops, Recursion"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Associated Course & Module */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                <span>Associated Course</span>
              </label>
              <div className="relative">
                <select
                  value={courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full py-2.5 pl-3.5 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                >
                  <option value="">Standalone / General</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Associated Module</label>
              <div className="relative">
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  disabled={!courseId || courseModules.length === 0}
                  className="w-full py-2.5 pl-3.5 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All / General Module</option>
                  {courseModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      Module {m.order}: {m.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Language, Difficulty, Timer & Attempt Limits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Language</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                  className="w-full py-2.5 pl-3.5 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full py-2.5 pl-3.5 pr-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 appearance-none cursor-pointer"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Timer (Mins)</span>
              </label>
              <select
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="0">No Limit (Untimed)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Max Attempts</span>
              </label>
              <select
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="1">1 Attempt (Exam Mode)</option>
                <option value="3">3 Attempts</option>
                <option value="5">5 Attempts</option>
                <option value="10">10 Attempts</option>
                <option value="0">Unlimited</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Tags (Comma-Separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Python, Strings, Recursion, Module 1"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Problem Description & Instructions</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem statement, constraints, expected input format, and return value."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed resize-none"
            />
          </div>

          {/* Starter Code (Boilerplate with TODO, not full solution) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#005F02]" />
                <span>Starter Code Template (Scaffolding with TODO)</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                {language}
              </span>
            </div>
            <textarea
              rows={5}
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              placeholder="Initial function declaration or boilerplate..."
              className="w-full p-3 rounded-xl bg-[#1e1e1e] border border-slate-700 text-emerald-400 font-mono text-[11px] leading-relaxed resize-none focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>

          {/* Automated Test Cases */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Automated Test Cases ({testCases.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAddTestCase}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005F02] hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Test Case</span>
              </button>
            </div>

            <div className="space-y-2">
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      Test Case #{idx + 1}
                    </span>
                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(idx)}
                        className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">Input / Arguments</span>
                      <input
                        type="text"
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                        placeholder='e.g. "racecar" or nums = [2, 7, 11]'
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block mb-1">Expected Output</span>
                      <input
                        type="text"
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                        placeholder='e.g. True or [0, 1]'
                        className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Helpful Hints */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Interactive Hints ({hints.length})</span>
              </label>
              <button
                type="button"
                onClick={handleAddHint}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005F02] hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Hint</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {hints.map((hint, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => handleHintChange(idx, e.target.value)}
                    placeholder={`Hint #${idx + 1} to guide learners without giving away code...`}
                    className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  {hints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHint(idx)}
                      className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#005F02] hover:bg-[#004e02] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              {editingQuestion ? 'Update Challenge' : 'Save Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
