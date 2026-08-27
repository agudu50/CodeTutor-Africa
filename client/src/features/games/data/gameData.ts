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
}

export const GAME_LANGUAGES: LanguageOption[] = [
  { id: 'all', label: 'All Courses & Languages', iconBadge: 'All' },
  { id: 'python', label: 'Python (Course 101)', iconBadge: 'PY' },
  { id: 'javascript', label: 'JavaScript (Course 201)', iconBadge: 'JS' },
  { id: 'typescript', label: 'TypeScript', iconBadge: 'TS' },
  { id: 'java', label: 'Java (Course 301)', iconBadge: 'JV' },
  { id: 'sql', label: 'SQL Database', iconBadge: 'DB' },
]

export const GAMES_METADATA: GameMetadata[] = [
  {
    id: 'speedrun',
    title: 'Syntax Speedrun',
    subtitle: 'Course Lesson Typing Challenge',
    description: 'Type real code snippets directly from your enrolled course lessons to build muscle memory and speed.',
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
    subtitle: 'Curriculum Debugging Practice',
    description: 'Spot broken syntax and logical errors derived from your course problem sets before the timer runs out.',
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
    subtitle: 'Lesson Quiz Mental Execution',
    description: 'Predict exact runtime console outputs from your course lessons and tricky language edge-cases.',
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
    description: 'Reconstruct scrambled algorithm implementations from your course curriculum into working code.',
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
// 1. SPEEDRUN SNIPPETS (Directly linked to Course Lessons)
// ══════════════════════════════════════════════════════════════════════════
export const SPEEDRUN_SNIPPETS: SpeedrunSnippet[] = [
  // Python Course 101 - Lesson 1: Memory Model & Scope
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
  // Python Course 101 - Lesson 2: List Comprehensions
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
  // Python Course 101 - Lesson 3: Recursion
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
  // JavaScript Course 201 - Lesson 1: Async JS & Promises
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
  // JavaScript Course 201 - Lesson 1: Event Loop
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
  // Java Course 301 - Lesson 1: Classes & Constructors
  {
    id: 'sr-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java OOP Patterns',
    lessonTitle: 'Lesson 1: Classes & Constructors',
    language: 'java',
    title: 'Instantiate Student Object',
    description: 'Parameterized JVM constructor initialization',
    code: 'public Student(String name, int score) {\n    this.name = name;\n    this.score = score;\n}',
    timeLimitSecs: 30,
  },
  // Java Course 301 - Lesson 2: Polymorphism & Interfaces
  {
    id: 'sr-java-2',
    courseId: 'course-java-301',
    courseTitle: 'Java OOP Patterns',
    lessonTitle: 'Lesson 2: Polymorphism',
    language: 'java',
    title: 'Implement Interface Method',
    description: 'Contract method implementation with @Override',
    code: '@Override\npublic double calculateGrade() {\n    return this.score * 1.05;\n}',
    timeLimitSecs: 30,
  },
  // TypeScript & SQL
  {
    id: 'sr-ts-1',
    courseTitle: 'TypeScript Foundations',
    lessonTitle: 'Type Contracts',
    language: 'typescript',
    title: 'Typed Student Record',
    description: 'TypeScript interface and getter function',
    code: 'interface Student { id: string; name: string; score: number; }\nconst isHonorRoll = (s: Student): boolean => s.score >= 85;',
    timeLimitSecs: 30,
  },
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
]

// ══════════════════════════════════════════════════════════════════════════
// 2. BUG HUNT CHALLENGES (Directly linked to Course Lessons)
// ══════════════════════════════════════════════════════════════════════════
export const BUG_HUNT_CHALLENGES: BugHuntChallenge[] = [
  // Python Course 101 - Lesson 1: Memory Model
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
  // Python Course 101 - Lesson 2: Loop Accumulators
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
  // JavaScript Course 201 - Lesson 1: Async JS & Promises
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
  // JavaScript Course 201 - Lesson 1: Immutability
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
  // Java Course 301 - Lesson 1: Reference vs Value Semantics
  {
    id: 'bh-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java OOP Patterns',
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
]

// ══════════════════════════════════════════════════════════════════════════
// 3. OUTPUT PREDICTOR CHALLENGES (Directly linked to Course Lessons)
// ══════════════════════════════════════════════════════════════════════════
export const OUTPUT_PREDICTOR_CHALLENGES: OutputPredictorChallenge[] = [
  // Python Course 101 - Lesson 1: Memory Model
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
  // Python Course 101 - Lesson 1: Shallow Multiplications
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
  // JavaScript Course 201 - Lesson 1: Event Loop Microtasks
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
  // JavaScript Course 201 - Lesson 1: Type Coercion
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
  // Java Course 301 - Lesson 1: Primitive Types & Division
  {
    id: 'op-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java OOP Patterns',
    lessonTitle: 'Lesson 1: Primitive Types',
    language: 'java',
    title: 'Integer Division Truncation',
    code: 'int a = 7;\nint b = 2;\nSystem.out.println(a / b);',
    options: ['3', '3.5', '4', 'Compilation Error'],
    correctIndex: 0,
    explanation: 'In Java, dividing two integers performs integer division, discarding the decimal fraction to yield 3.',
    timeLimitSecs: 15,
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 4. CODE SHUFFLE CHALLENGES (Directly linked to Course Lessons)
// ══════════════════════════════════════════════════════════════════════════
export const CODE_SHUFFLE_CHALLENGES: CodeShuffleChallenge[] = [
  // Python Course 101 - Lesson 3: Recursion & Algorithms
  {
    id: 'cs-py-1',
    courseId: 'course-py-101',
    courseTitle: 'Python Programming',
    lessonTitle: 'Lesson 3: Functions & Recursion',
    language: 'python',
    title: 'Fibonacci Sequence Generator',
    goalDescription: 'Assemble the Fibonacci sequence generator taught in Lesson 3.',
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
  // JavaScript Course 201 - Lesson 1: Async Fetch Algorithm
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
  // Java Course 301 - Lesson 2: String & Palindrome Algorithm
  {
    id: 'cs-java-1',
    courseId: 'course-java-301',
    courseTitle: 'Java OOP Patterns',
    lessonTitle: 'Lesson 2: Algorithm Methods',
    language: 'java',
    title: 'Two-Pointer Palindrome Verifier',
    goalDescription: 'Assemble the two-pointer palindrome checking method from Lesson 2.',
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
]
