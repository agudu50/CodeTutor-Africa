import { Course, Module, Lesson, QuizQuestion, CourseGameLink } from '@/types'
import { courseStoreService } from './course-store.service'
import { ProgrammingLanguage, DifficultyLevel } from '@/types/common'

export interface GenerateCourseParams {
  prompt: string
  language?: ProgrammingLanguage | 'all'
  difficulty?: DifficultyLevel
  moduleCount?: number
  includeVideos?: boolean
  includeGames?: boolean
  includeExercises?: boolean
}

class AiCourseGeneratorService {
  /**
   * Synthesizes a full multi-module course curriculum from a user prompt,
   * including lesson notes, video masterclasses, quizzes, coding exercises, and games.
   */
  async generateCourse(params: GenerateCourseParams): Promise<Course> {
    const {
      prompt,
      language = 'python',
      difficulty = 'intermediate',
      moduleCount = 3,
      includeVideos = true,
      includeGames = true,
    } = params

    // Simulate real AI model processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const selectedLang: ProgrammingLanguage = (language === 'all' || !language) ? 'python' : language
    const title = this.inferTitle(prompt, selectedLang)
    const category = this.inferCategory(prompt)
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`

    const courseId = `course-ai-${Date.now()}`
    const modules = this.generateModules(courseId, prompt, selectedLang, difficulty, moduleCount, includeVideos)
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)

    const games: CourseGameLink[] = includeGames
      ? [
          {
            id: `game-bughunt-${courseId}`,
            title: `${title} Bug Hunt Blitz`,
            type: 'bughunt',
            description: `Debug tricky syntax errors, runtime exceptions, and logic traps in ${title}.`,
          },
          {
            id: `game-speedrun-${courseId}`,
            title: `${title} Syntax Speedrun`,
            type: 'speedrun',
            description: `Type and complete core ${selectedLang} language constructs against the clock.`,
          },
        ]
      : []

    const newCourseData: Omit<Course, 'id' | 'createdAt' | 'progressPercentage'> = {
      title,
      slug,
      description: `AI-Generated Curriculum: Comprehensive mastery of ${prompt.trim()}. Features ${modules.length} interactive modules, hands-on compiler exercises, offline video guides, and 3D arcade drills.`,
      category,
      language: selectedLang,
      difficulty,
      totalLessons,
      estimatedHours: totalLessons * 1.5,
      modules,
      isAiGenerated: true,
      generatedPrompt: prompt,
      games,
    }

    const createdCourse = courseStoreService.createCourse(newCourseData)
    return createdCourse
  }

  private inferTitle(prompt: string, lang: string): string {
    const clean = prompt.trim()
    if (clean.length > 5 && clean.length < 50 && !clean.includes('.')) {
      // Capitalize words
      return clean
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    }
    const langLabel = lang.charAt(0).toUpperCase() + lang.slice(1)
    if (prompt.toLowerCase().includes('algorithm') || prompt.toLowerCase().includes('dsa')) {
      return `${langLabel} Algorithms & Problem Solving`
    }
    if (prompt.toLowerCase().includes('web') || prompt.toLowerCase().includes('frontend') || prompt.toLowerCase().includes('react')) {
      return `Modern Full-Stack ${langLabel} Engineering`
    }
    if (prompt.toLowerCase().includes('backend') || prompt.toLowerCase().includes('api') || prompt.toLowerCase().includes('microservice')) {
      return `High-Performance ${langLabel} Backend Architecture`
    }
    if (prompt.toLowerCase().includes('data') || prompt.toLowerCase().includes('sql') || prompt.toLowerCase().includes('database')) {
      return `${langLabel} Data Systems & Optimization`
    }
    return `${clean.slice(0, 40)}: Masterclass in ${langLabel}`
  }

  private inferCategory(prompt: string): string {
    const p = prompt.toLowerCase()
    if (p.includes('algorithm') || p.includes('data structure') || p.includes('dsa')) return 'Algorithms & DSA'
    if (p.includes('web') || p.includes('react') || p.includes('html') || p.includes('css')) return 'Web Development'
    if (p.includes('backend') || p.includes('api') || p.includes('server') || p.includes('database') || p.includes('sql')) return 'Backend Systems'
    if (p.includes('mobile') || p.includes('flutter') || p.includes('android')) return 'Mobile Engineering'
    if (p.includes('system') || p.includes('rust') || p.includes('c++') || p.includes('memory')) return 'Systems Programming'
    return 'Applied Programming'
  }

  private generateModules(
    courseId: string,
    prompt: string,
    lang: ProgrammingLanguage,
    _difficulty: DifficultyLevel,
    count: number,
    includeVideos: boolean
  ): Module[] {
    const modules: Module[] = []
    const langName = lang.charAt(0).toUpperCase() + lang.slice(1)

    const moduleTemplates = [
      {
        title: `Module 1: Foundations & Architecture`,
        desc: `Core concepts, syntax mental models, local compiler setups, and memory allocations for ${langName}.`,
        lessonTopics: [
          { title: 'Core Principles, Execution Model & Scoping', duration: 25 },
          { title: 'Data Types, References & Memory Layout', duration: 35 },
          { title: 'Control Flow & Idiomatic Patterns', duration: 30 },
        ],
      },
      {
        title: `Module 2: Deep Dive & Practical Implementation`,
        desc: `Real-world problem solving, structural design, modular abstractions, and standard libraries.`,
        lessonTopics: [
          { title: 'Function Signatures, Recursion & Higher-Order Logic', duration: 40 },
          { title: 'Complex Data Structures & In-Memory Transformations', duration: 45 },
          { title: 'Error Handling, Invariants & Resilient Code', duration: 35 },
        ],
      },
      {
        title: `Module 3: Advanced Optimization & Local Testing`,
        desc: `Benchmarking, asynchronous execution, test case suites, and defensive system architecture.`,
        lessonTopics: [
          { title: 'Concurrency, Threading & Non-Blocking I/O', duration: 50 },
          { title: 'Performance Profiling & Big-O Optimization', duration: 45 },
          { title: 'Building the End-to-End Capstone Project', duration: 60 },
        ],
      },
      {
        title: `Module 4: Enterprise Production & Scaling`,
        desc: `Architecting for offline resilience, telemetry monitoring, and low-latency execution in African environments.`,
        lessonTopics: [
          { title: 'Local SQLite Data Persistence & Migrations', duration: 45 },
          { title: 'Network Fault Tolerance & Offline Sync Protocols', duration: 55 },
        ],
      },
    ]

    const actualCount = Math.min(count, moduleTemplates.length)

    for (let i = 0; i < actualCount; i++) {
      const template = moduleTemplates[i]
      const moduleId = `mod-ai-${Date.now()}-${i + 1}`

      const lessons: Lesson[] = template.lessonTopics.map((lt, lIdx) => {
        const lessonId = `les-ai-${Date.now()}-${i + 1}-${lIdx + 1}`
        return {
          id: lessonId,
          courseId,
          title: lt.title,
          slug: lt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `Detailed practical analysis of ${lt.title} with code explanations and compiler drills.`,
          durationMinutes: lt.duration,
          order: lIdx + 1,
          isCompleted: false,
          videoUrl: includeVideos ? 'https://www.youtube.com/watch?v=kqtD5dpn9C8' : undefined,
          createdAt: new Date().toISOString(),
          contentMarkdown: this.generateLessonContent(lt.title, lang, prompt),
          quizQuestions: this.generateQuizQuestions(lt.title, lang),
        }
      })

      modules.push({
        id: moduleId,
        courseId,
        title: template.title,
        description: template.desc,
        order: i + 1,
        createdAt: new Date().toISOString(),
        lessons,
      })
    }

    return modules
  }

  private generateLessonContent(topic: string, lang: string, prompt: string): string {
    return `# ${topic}

Welcome to this in-depth guide on **${topic}** in **${lang.toUpperCase()}**, generated specifically for your focus on *${prompt}*.

---

## 🎯 Conceptual Overview
In software engineering, understanding how code interacts with memory and processor cycles is critical for building fast, resilient applications.

\`\`\`${lang}
// Core demonstration of ${topic}
function demonstration() {
    console.log("Mastering ${topic} offline!");
    return true;
}
\`\`\`

### Key Architectural Takeaways:
1. **Zero Cloud Latency**: All logic runs locally against your CPU compiler.
2. **Determinism**: Code produces predictable output with minimal memory footprints.
3. **Robustness**: Edge cases (null references, bounds checks, recursion bases) must be handled explicitly.

---

## 💡 Practical Code Walkthrough
Inspect the structure below and practice testing it in your local compiler:

\`\`\`${lang}
# Example implementation
def solve_problem(dataset):
    """Processes input dataset in linear O(N) time complexity."""
    if not dataset:
        return []
    
    result = [item for item in dataset if item is not None]
    return sorted(result)
\`\`\`

> **Socratic Hint:** Notice how we validate inputs before running transformations. How would you modify this to handle infinite streaming generators?
`
  }

  private generateQuizQuestions(topic: string, lang: string): QuizQuestion[] {
    return [
      {
        id: `q-ai-${Date.now()}-1`,
        type: 'mcq',
        question: `When implementing ${topic} in ${lang}, what is the primary benefit of avoiding unnecessary memory allocations?`,
        options: [
          'It reduces CPU cache misses and Garbage Collection pauses',
          'It forces the operating system to increase disk write speeds',
          'It automatically enables multi-threading without mutex locks',
          'It bypasses syntax error checks at compile time',
        ],
        correctAnswer: 0,
        explanation: 'Minimizing unnecessary allocations preserves CPU cache locality and dramatically reduces garbage collection latency.',
        hint: 'Think about what happens to RAM and CPU caches when thousands of objects are allocated in a loop.',
      },
      {
        id: `q-ai-${Date.now()}-2`,
        type: 'fill_in',
        question: `Fill in the missing keyword to safely handle and catch runtime exceptions during ${topic}:`,
        codeSnippet: `try:\n    perform_operation()\n____ Exception as err:\n    handle_error(err)`,
        correctAnswer: 'except',
        explanation: 'In Python, `except` is used to catch and handle exceptions thrown inside a `try` block.',
        hint: 'Six letters starting with "ex".',
      },
      {
        id: `q-ai-${Date.now()}-3`,
        type: 'code',
        question: `Write a clean function \`filter_valid(items)\` that returns only positive integers from a list:`,
        initialCode: `def filter_valid(items: list) -> list:\n    # Return only elements where x > 0\n    pass`,
        testCases: [
          { input: '[1, -5, 10, 0, 3]', expectedOutput: '[1, 10, 3]' },
          { input: '[-1, -2, -3]', expectedOutput: '[]' },
          { input: '[100]', expectedOutput: '[100]' },
        ],
        correctAnswer: `def filter_valid(items):\n    return [x for x in items if x > 0]`,
        explanation: 'List comprehensions filter elements meeting the condition `x > 0` cleanly and idiomatically.',
        hint: 'Use list comprehension `[x for x in items if x > 0]`.',
      },
    ]
  }
}

export const aiCourseGeneratorService = new AiCourseGeneratorService()
