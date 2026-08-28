import {
  GameMetadata,
  SpeedrunSnippet,
  BugHuntChallenge,
  OutputPredictorChallenge,
  CodeShuffleChallenge,
  GameLanguage,
} from '../types/games.types'

export interface LanguageOption {
  id: GameLanguage
  label: string
  iconBadge: string
  accentColor: string
}

export const GAME_LANGUAGES: LanguageOption[] = [
  { id: 'all', label: 'All Languages', iconBadge: 'All', accentColor: 'emerald' },
  { id: 'python', label: 'Python', iconBadge: 'PY', accentColor: 'amber' },
  { id: 'javascript', label: 'JavaScript', iconBadge: 'JS', accentColor: 'yellow' },
  { id: 'java', label: 'Java', iconBadge: 'JV', accentColor: 'rose' },
  { id: 'typescript', label: 'TypeScript', iconBadge: 'TS', accentColor: 'blue' },
  { id: 'sql', label: 'SQL Database', iconBadge: 'DB', accentColor: 'emerald' },
]

export const GAMES_METADATA: GameMetadata[] = [
  {
    id: 'speedrun',
    title: 'Syntax Speedrun',
    subtitle: 'Fast-Paced Typing Challenge',
    description: 'Race against the clock to type real code snippets cleanly, building typing speed and syntax muscle memory.',
    difficulty: 'Beginner',
    category: 'Speed & Accuracy',
    estimatedMins: 2,
    iconName: 'Zap',
    image: '/images/games/syntax_speedrun.jpg',
    color: {
      bg: 'bg-amber-500/10 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/60',
      accent: 'bg-amber-500',
    },
  },
  {
    id: 'bughunt',
    title: 'Bug Hunt Blitz',
    subtitle: 'Code Error Spotter & Debugger',
    description: 'Spot broken syntax, syntax mistakes, and runtime logic errors in code blocks before the timer runs out.',
    difficulty: 'Intermediate',
    category: 'Debugging Skills',
    estimatedMins: 3,
    iconName: 'Bug',
    image: '/images/games/bug_hunt.jpg',
    color: {
      bg: 'bg-rose-500/10 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/60',
      accent: 'bg-rose-500',
    },
  },
  {
    id: 'predictor',
    title: 'Output Predictor',
    subtitle: 'Mental Code Execution Quiz',
    description: 'Analyze code snippets and predict the exact console output and return values without running the code.',
    difficulty: 'Intermediate',
    category: 'Mental Execution',
    estimatedMins: 3,
    iconName: 'HelpCircle',
    image: '/images/games/output_predictor.jpg',
    color: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-800/60',
      accent: 'bg-indigo-500',
    },
  },
  {
    id: 'shuffle',
    title: 'Code Shuffle',
    subtitle: 'Algorithm Block Assembly',
    description: 'Reconstruct scrambled algorithm code lines and logical blocks into clean, working program order.',
    difficulty: 'Advanced',
    category: 'Logic & Algorithms',
    estimatedMins: 4,
    iconName: 'Shuffle',
    image: '/images/games/code_shuffle.jpg',
    color: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      accent: 'bg-emerald-500',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 1. SPEEDRUN SNIPPETS (Organized by Language Track)
// ══════════════════════════════════════════════════════════════════════════
export const SPEEDRUN_SNIPPETS: SpeedrunSnippet[] = [
  // ── Python ──
  {
    id: 'sr-py-1',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 1: Memory Model',
    language: 'python',
    title: 'Clone List via Slicing',
    description: 'Create independent shallow copy of mutable list',
    code: 'def clone_scores(scores):\n    # Slice to prevent reference mutation\n    return scores[:]',
    timeLimitSecs: 25,
  },
  {
    id: 'sr-py-2',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 2: List Comprehensions',
    language: 'python',
    title: 'Filter Positive Numbers',
    description: 'Concise generator expression accumulator',
    code: 'def count_positives(nums):\n    return sum(1 for x in nums if x > 0)',
    timeLimitSecs: 20,
  },
  {
    id: 'sr-py-3',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 3: Recursion & Scopes',
    language: 'python',
    title: 'Recursive Factorial Base Case',
    description: 'Deconstruct activation frames',
    code: 'def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)',
    timeLimitSecs: 25,
  },
  {
    id: 'sr-py-4',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 5: OOP Classes',
    language: 'python',
    title: 'Class Constructor with Self',
    description: 'Instantiate student class with __init__',
    code: 'class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade',
    timeLimitSecs: 25,
  },

  // ── JavaScript ──
  {
    id: 'sr-js-1',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 1: Async & Promises',
    language: 'javascript',
    title: 'Async Fetch Student Data',
    description: 'Fetch and parse JSON payload with try-catch',
    code: 'async function fetchLearner(id) {\n  const res = await fetch(`/api/students/${id}`);\n  return await res.json();\n}',
    timeLimitSecs: 30,
  },
  {
    id: 'sr-js-2',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 1: Event Loop',
    language: 'javascript',
    title: 'Microtask Queue Deferral',
    description: 'Queue high-priority microtask callback',
    code: 'const deferTask = (fn) => queueMicrotask(() => fn());',
    timeLimitSecs: 25,
  },
  {
    id: 'sr-js-3',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 4: Array Pipelines',
    language: 'javascript',
    title: 'Map and Filter Pipeline',
    description: 'Transform and filter student records cleanly',
    code: 'const getPassing = (students) =>\n  students.filter(s => s.score >= 70).map(s => s.name);',
    timeLimitSecs: 25,
  },

  // ── Java ──
  {
    id: 'sr-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java Engineering',
    lessonTitle: 'Lesson 1: Classes & Constructors',
    language: 'java',
    title: 'Instantiate Student Object',
    description: 'Parameterized JVM constructor initialization',
    code: 'public Student(String name, int score) {\n    this.name = name;\n    this.score = score;\n}',
    timeLimitSecs: 30,
  },
  {
    id: 'sr-java-2',
    courseId: 'course-java-301',
    courseTitle: 'Java Engineering',
    lessonTitle: 'Lesson 2: Polymorphism',
    language: 'java',
    title: 'Implement Interface Method',
    description: 'Contract method implementation with @Override',
    code: '@Override\npublic double calculateGrade() {\n    return this.score * 1.05;\n}',
    timeLimitSecs: 30,
  },
  {
    id: 'sr-java-3',
    courseId: 'course-java-301',
    courseTitle: 'Java Engineering',
    lessonTitle: 'Lesson 6: Collections & Maps',
    language: 'java',
    title: 'HashMap Put and Get',
    description: 'Map frequency tracking with getOrDefault',
    code: 'Map<String, Integer> counts = new HashMap<>();\ncounts.put(key, counts.getOrDefault(key, 0) + 1);',
    timeLimitSecs: 28,
  },

  // ── TypeScript ──
  {
    id: 'sr-ts-1',
    courseId: 'course-ts-401',
    courseTitle: 'TypeScript Foundations',
    lessonTitle: 'Lesson 1: Interfaces & Contracts',
    language: 'typescript',
    title: 'Typed Student Record',
    description: 'TypeScript interface and getter function',
    code: 'interface Student {\n  id: string;\n  name: string;\n  score: number;\n}\nconst isHonorRoll = (s: Student): boolean => s.score >= 85;',
    timeLimitSecs: 30,
  },
  {
    id: 'sr-ts-2',
    courseId: 'course-ts-401',
    courseTitle: 'TypeScript Foundations',
    lessonTitle: 'Lesson 3: Generics',
    language: 'typescript',
    title: 'Generic API Response Wrapper',
    description: 'Reusable typed data wrapper interface',
    code: 'interface ApiResponse<T> {\n  status: number;\n  data: T;\n  error?: string;\n}',
    timeLimitSecs: 25,
  },
  {
    id: 'sr-ts-3',
    courseId: 'course-ts-401',
    courseTitle: 'TypeScript Foundations',
    lessonTitle: 'Lesson 5: Utility Types',
    language: 'typescript',
    title: 'Omit and Pick Utilities',
    description: 'Create sanitized profile type',
    code: 'type PublicUser = Omit<User, "passwordHash" | "internalId">;',
    timeLimitSecs: 25,
  },

  // ── SQL ──
  {
    id: 'sr-sql-1',
    courseTitle: 'Database & SQL',
    lessonTitle: 'Query Filters',
    language: 'sql',
    title: 'Top Performing Students',
    description: 'Query top learners by score',
    code: 'SELECT name, score FROM students WHERE score >= 80 ORDER BY score DESC LIMIT 5;',
    timeLimitSecs: 30,
  },
  {
    id: 'sr-sql-2',
    courseTitle: 'Database & SQL',
    lessonTitle: 'Multi-table Joins',
    language: 'sql',
    title: 'Inner Join Enrollments',
    description: 'Combine students with course details',
    code: 'SELECT s.name, c.title FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.id;',
    timeLimitSecs: 32,
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 2. BUG HUNT CHALLENGES (Organized by Language Track)
// ══════════════════════════════════════════════════════════════════════════
export const BUG_HUNT_CHALLENGES: BugHuntChallenge[] = [
  // ── Python ──
  {
    id: 'bh-py-1',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 1: Memory Model',
    language: 'python',
    title: 'Shared Mutable Default Argument',
    description: 'Adding courses to a default list shares state across every caller in Python.',
    lines: [
      'def add_course(title, courses=[]):',
      '    courses.append(title)',
      '    return courses',
    ],
    buggyLineIndex: 0,
    bugExplanation: 'Using a mutable list as default parameter causes unexpected shared state across all function calls.',
    correctOptions: [
      { text: 'def add_course(title, courses=None):', isCorrect: true },
      { text: 'def add_course(title, courses: list):', isCorrect: false },
      { text: 'def add_course(title, courses=()):', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
  {
    id: 'bh-py-2',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 2: Iteration & Loops',
    language: 'python',
    title: 'Loop Counter Off-By-One',
    description: 'This function should sum numbers from 1 to n inclusive.',
    lines: [
      'def sum_to_n(n):',
      '    total = 0',
      '    for i in range(1, n):',
      '        total += i',
      '    return total',
    ],
    buggyLineIndex: 2,
    bugExplanation: 'range(1, n) stops at n - 1. It must be range(1, n + 1) to include n.',
    correctOptions: [
      { text: 'for i in range(1, n + 1):', isCorrect: true },
      { text: 'for i in range(0, n):', isCorrect: false },
      { text: 'while i <= n:', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },

  // ── JavaScript ──
  {
    id: 'bh-js-1',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 1: Async & Promises',
    language: 'javascript',
    title: 'Unresolved Promise Trap',
    description: 'Fetching user data returns a Promise rather than the resolved response object.',
    lines: [
      'async function getUser(id) {',
      '    const res = fetch(`/api/users/${id}`)',
      '    const data = await res.json()',
      '    return data',
      '}',
    ],
    buggyLineIndex: 1,
    bugExplanation: 'Missing "await" before fetch() means res is an unresolved Promise rather than a Response.',
    correctOptions: [
      { text: 'const res = await fetch(`/api/users/${id}`)', isCorrect: true },
      { text: 'const res = sync fetch(`/api/users/${id}`)', isCorrect: false },
      { text: 'const res = fetch.then(`/api/users/${id}`)', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
  {
    id: 'bh-js-2',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 1: Immutability',
    language: 'javascript',
    title: 'Array Mutation Side Effect',
    description: 'This function should add a student without mutating the original input array.',
    lines: [
      'function addStudent(list, student) {',
      '    list.push(student)',
      '    return list',
      '}',
    ],
    buggyLineIndex: 1,
    bugExplanation: '.push() mutates the original list in-place. Use the spread operator [...list, student] instead.',
    correctOptions: [
      { text: 'return [...list, student]', isCorrect: true },
      { text: 'list.concat()', isCorrect: false },
      { text: 'return list + student', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },

  // ── Java ──
  {
    id: 'bh-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java Engineering',
    lessonTitle: 'Lesson 1: Reference Semantics',
    language: 'java',
    title: 'String Reference Equality Comparison',
    description: 'Comparing string values with == instead of .equals() in Java.',
    lines: [
      'public boolean checkPass(String input, String expected) {',
      '    if (input == expected) {',
      '        return true;',
      '    }',
      '    return false;',
      '}',
    ],
    buggyLineIndex: 1,
    bugExplanation: 'In Java, "==" compares JVM memory addresses. Use input.equals(expected) for character value equality.',
    correctOptions: [
      { text: 'if (input.equals(expected)) {', isCorrect: true },
      { text: 'if (input.compareTo(expected) == 1) {', isCorrect: false },
      { text: 'if (input === expected) {', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },

  // ── TypeScript ──
  {
    id: 'bh-ts-1',
    courseId: 'course-ts-401',
    courseTitle: 'TypeScript Foundations',
    lessonTitle: 'Lesson 2: Readonly Properties',
    language: 'typescript',
    title: 'Readonly Property Mutation Bug',
    description: 'Attempting to mutate an immutable readonly property.',
    lines: [
      'interface Config { readonly port: number; }',
      'function updatePort(cfg: Config, newPort: number) {',
      '    cfg.port = newPort;',
      '    return cfg;',
      '}',
    ],
    buggyLineIndex: 2,
    bugExplanation: 'Properties declared readonly cannot be reassigned. Return a new object copy instead.',
    correctOptions: [
      { text: 'return { ...cfg, port: newPort };', isCorrect: true },
      { text: 'cfg.port := newPort;', isCorrect: false },
      { text: 'cfg.setPort(newPort);', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },

  // ── SQL ──
  {
    id: 'bh-sql-1',
    courseTitle: 'Database & SQL',
    lessonTitle: 'WHERE Clause Safety',
    language: 'sql',
    title: 'Accidental UPDATE Without WHERE Clause',
    description: 'Updating table without scoping clause overwrites the entire database table.',
    lines: [
      'UPDATE students',
      'SET status = "graduated"',
      '-- Missing WHERE student_id = 42',
    ],
    buggyLineIndex: 1,
    bugExplanation: 'Running UPDATE without a WHERE filter changes every row in the database table.',
    correctOptions: [
      { text: 'SET status = "graduated" WHERE id = 42;', isCorrect: true },
      { text: 'SET status == "graduated";', isCorrect: false },
      { text: 'SET status = "graduated" LIMIT 1;', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 3. OUTPUT PREDICTOR CHALLENGES (Organized by Language Track)
// ══════════════════════════════════════════════════════════════════════════
export const OUTPUT_PREDICTOR_CHALLENGES: OutputPredictorChallenge[] = [
  // ── Python ──
  {
    id: 'op-py-1',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 1: Memory Model',
    language: 'python',
    title: 'Variable Reference Mutation',
    code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)',
    options: ['[1, 2, 3]', '[1, 2]', 'None', 'SyntaxError'],
    correctIndex: 0,
    explanation: 'In Python, assignment (b = a) copies the object reference. Mutating b also mutates a because both point to the same list!',
    timeLimitSecs: 15,
  },
  {
    id: 'op-py-2',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 1: Memory Model',
    language: 'python',
    title: 'Matrix Multiplication Shallow Copy',
    code: 'matrix = [[0]] * 2\nmatrix[0][0] = 5\nprint(matrix[1][0])',
    options: ['5', '0', 'IndexError', 'None'],
    correctIndex: 0,
    explanation: 'Multiplying a list containing a mutable inner list copies the pointer reference. Changing row 0 modifies row 1.',
    timeLimitSecs: 18,
  },

  // ── JavaScript ──
  {
    id: 'op-js-1',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 1: Event Loop & Microtasks',
    language: 'javascript',
    title: 'Microtask Execution Order',
    code: 'console.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);',
    options: ['1, 3, 2', '1, 2, 3', '2, 1, 3', '3, 2, 1'],
    correctIndex: 0,
    explanation: 'Synchronous console.log(1) and (3) run on the main thread stack first; Promise microtasks run immediately after stack clears.',
    timeLimitSecs: 18,
  },
  {
    id: 'op-js-2',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 1: Types & Coercion',
    language: 'javascript',
    title: 'String Concatenation Coercion',
    code: 'console.log(1 + "2" + 3);',
    options: ['"123"', '6', '"15"', 'NaN'],
    correctIndex: 0,
    explanation: '1 + "2" coerces number 1 to string "12", then "12" + 3 concatenates to produce "123".',
    timeLimitSecs: 15,
  },

  // ── Java ──
  {
    id: 'op-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java Engineering',
    lessonTitle: 'Lesson 1: Primitive Types',
    language: 'java',
    title: 'Integer Division Truncation',
    code: 'int a = 7;\nint b = 2;\nSystem.out.println(a / b);',
    options: ['3', '3.5', '4', 'Compilation Error'],
    correctIndex: 0,
    explanation: 'In Java, dividing two integers performs integer division, discarding the decimal fraction to yield 3.',
    timeLimitSecs: 15,
  },

  // ── TypeScript ──
  {
    id: 'op-ts-1',
    courseId: 'course-ts-401',
    courseTitle: 'TypeScript Foundations',
    lessonTitle: 'Lesson 2: Type Guards',
    language: 'typescript',
    title: 'Type Narrowing Output',
    code: 'function format(val: string | number) {\n  if (typeof val === "number") return val.toFixed(1);\n  return val.trim();\n}\nconsole.log(format(12));',
    options: ['"12.0"', '12', '"12"', 'TypeError'],
    correctIndex: 0,
    explanation: 'TypeScript narrows val to number inside the if branch, executing val.toFixed(1) to output "12.0".',
    timeLimitSecs: 15,
  },

  // ── SQL ──
  {
    id: 'op-sql-1',
    courseTitle: 'Database & SQL',
    lessonTitle: 'HAVING Clause',
    language: 'sql',
    title: 'COUNT Filter Prediction',
    code: 'SELECT dept, COUNT(*) FROM staff GROUP BY dept HAVING COUNT(*) >= 2;',
    options: [
      'Only departments with 2 or more staff members',
      'All departments regardless of count',
      'First 2 staff members in the table',
      'Syntax error',
    ],
    correctIndex: 0,
    explanation: 'HAVING filters aggregated groups after the GROUP BY calculation.',
    timeLimitSecs: 15,
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 4. CODE SHUFFLE CHALLENGES (Organized by Language Track)
// ══════════════════════════════════════════════════════════════════════════
export const CODE_SHUFFLE_CHALLENGES: CodeShuffleChallenge[] = [
  // ── Python ──
  {
    id: 'cs-py-1',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 3: Functions & Recursion',
    language: 'python',
    title: 'Fibonacci Sequence Generator',
    goalDescription: 'Assemble the Fibonacci sequence generator function in Python.',
    expectedOutput: '[0, 1, 1, 2, 3, 5]',
    scrambledBlocks: [
      { id: 'b4', content: 'fib.append(fib[-1] + fib[-2])', indent: 2 },
      { id: 'b1', content: 'def generate_fib(n):', indent: 0 },
      { id: 'b5', content: 'return fib[:n]', indent: 1 },
      { id: 'b3', content: 'for _ in range(2, n):', indent: 1 },
      { id: 'b2', content: 'fib = [0, 1]', indent: 1 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Function header -> initialize base values [0, 1] -> loop 2 to n -> append sum -> return slice.',
  },

  // ── JavaScript ──
  {
    id: 'cs-js-1',
    courseId: 'course-js-201',
    courseTitle: 'Modern JavaScript',
    lessonTitle: 'Lesson 1: Async JavaScript & Promises',
    language: 'javascript',
    title: 'Asynchronous API Fetch Handler',
    goalDescription: 'Assemble an async JSON fetch function with status checks.',
    expectedOutput: 'Parsed JSON Response',
    scrambledBlocks: [
      { id: 'b3', content: 'const data = await res.json();', indent: 1 },
      { id: 'b1', content: 'async function getStudentData(url) {', indent: 0 },
      { id: 'b4', content: 'return data;', indent: 1 },
      { id: 'b2', content: 'const res = await fetch(url);', indent: 1 },
      { id: 'b5', content: '}', indent: 0 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Async function header -> await fetch request -> await JSON parsing -> return data payload -> close brace.',
  },

  // ── Java ──
  {
    id: 'cs-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java Engineering',
    lessonTitle: 'Lesson 2: Algorithm Methods',
    language: 'java',
    title: 'Two-Pointer Palindrome Verifier',
    goalDescription: 'Assemble the two-pointer palindrome checking method in Java.',
    expectedOutput: 'true / false',
    scrambledBlocks: [
      { id: 'b3', content: 'while (left < right) {', indent: 1 },
      { id: 'b1', content: 'public static boolean isPalindrome(String s) {', indent: 0 },
      { id: 'b4', content: 'if (s.charAt(left++) != s.charAt(right--)) return false;', indent: 2 },
      { id: 'b2', content: 'int left = 0, right = s.length() - 1;', indent: 1 },
      { id: 'b5', content: 'return true;\n}', indent: 1 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Method header -> two pointers (left/right) -> while loop -> compare characters -> return true.',
  },

  // ── TypeScript ──
  {
    id: 'cs-ts-1',
    courseId: 'course-ts-401',
    courseTitle: 'TypeScript Foundations',
    lessonTitle: 'Lesson 4: Generics',
    language: 'typescript',
    title: 'Generic Stack Collection Class',
    goalDescription: 'Assemble a generic Stack<T> implementation in TypeScript.',
    expectedOutput: 'Typed Stack Instance',
    scrambledBlocks: [
      { id: 'b2', content: 'private items: T[] = [];', indent: 1 },
      { id: 'b1', content: 'class Stack<T> {', indent: 0 },
      { id: 'b4', content: 'pop(): T | undefined { return this.items.pop(); }', indent: 1 },
      { id: 'b3', content: 'push(item: T): void { this.items.push(item); }', indent: 1 },
      { id: 'b5', content: '}', indent: 0 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Class header with generic <T> -> private items array -> push method -> pop method -> close class.',
  },
]
