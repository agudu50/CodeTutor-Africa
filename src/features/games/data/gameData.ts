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
  { id: 'all', label: 'All Languages', iconBadge: 'Mix' },
  { id: 'python', label: 'Python', iconBadge: 'PY' },
  { id: 'javascript', label: 'JavaScript', iconBadge: 'JS' },
  { id: 'typescript', label: 'TypeScript', iconBadge: 'TS' },
  { id: 'java', label: 'Java', iconBadge: 'JV' },
  { id: 'sql', label: 'SQL', iconBadge: 'DB' },
]

export const GAMES_METADATA: GameMetadata[] = [
  {
    id: 'speedrun',
    title: 'Syntax Speedrun',
    subtitle: 'Type code snippets against the clock',
    description: 'Test your typing speed and muscle memory with real African fintech, algorithmic, and web dev snippets.',
    difficulty: 'Beginner',
    category: 'Speed & Accuracy',
    estimatedMins: 2,
    iconName: 'Zap',
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
    subtitle: 'Spot the broken line and squash the bug',
    description: 'A buggy snippet is shown. Tap the broken line within 15 seconds and pick the right fix to keep your streak!',
    difficulty: 'Intermediate',
    category: 'Debugging Skills',
    estimatedMins: 3,
    iconName: 'Bug',
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
    subtitle: 'Mental code execution challenge',
    description: 'Read the snippet and guess what prints to the console before time runs out. Great for interview prep!',
    difficulty: 'Intermediate',
    category: 'Mental Execution',
    estimatedMins: 3,
    iconName: 'HelpCircle',
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
    subtitle: 'Rearrange algorithm blocks into proper order',
    description: 'Drag and reorder scrambled code logic blocks to build working algorithms and achieve the target output.',
    difficulty: 'Advanced',
    category: 'Logic & Algorithms',
    estimatedMins: 4,
    iconName: 'Shuffle',
    color: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      accent: 'bg-emerald-500',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 1. SPEEDRUN SNIPPETS (Python, JS, TS, Java, SQL)
// ══════════════════════════════════════════════════════════════════════════
export const SPEEDRUN_SNIPPETS: SpeedrunSnippet[] = [
  // Python
  {
    id: 'sr-py-1',
    language: 'python',
    title: 'Calculate Mobile Money Fee',
    description: 'Calculate 1.5% transaction fee with max cap',
    code: 'def calc_momo_fee(amount):\n    fee = amount * 0.015\n    return min(fee, 25.0)',
    timeLimitSecs: 25,
  },
  {
    id: 'sr-py-2',
    language: 'python',
    title: 'Reverse a String',
    description: 'Classic Python slicing idiom',
    code: 'def reverse_text(text):\n    return text[::-1]',
    timeLimitSecs: 20,
  },
  // JavaScript
  {
    id: 'sr-js-1',
    language: 'javascript',
    title: 'Filter Active Solar Grids',
    description: 'Filter online clean energy nodes',
    code: 'const getActiveGrids = (grids) => grids.filter(g => g.isOnline && g.batteryLevel > 20);',
    timeLimitSecs: 30,
  },
  {
    id: 'sr-js-2',
    language: 'javascript',
    title: 'Format Currency (GHS / NGN)',
    description: 'Format monetary value into 2 decimal places',
    code: 'const formatCurrency = (val, sym = "GHS") => `${sym} ${val.toFixed(2)}`;',
    timeLimitSecs: 30,
  },
  // TypeScript
  {
    id: 'sr-ts-1',
    language: 'typescript',
    title: 'Typed Student Record',
    description: 'TypeScript interface and getter function',
    code: 'interface Student { id: string; name: string; score: number; }\nconst isHonorRoll = (s: Student): boolean => s.score >= 85;',
    timeLimitSecs: 35,
  },
  // Java
  {
    id: 'sr-java-1',
    language: 'java',
    title: 'Find Maximum in Array',
    description: 'Iterate and track peak number',
    code: 'public static int findMax(int[] arr) {\n    int max = arr[0];\n    for (int num : arr) if (num > max) max = num;\n    return max;\n}',
    timeLimitSecs: 35,
  },
  // SQL
  {
    id: 'sr-sql-1',
    language: 'sql',
    title: 'Top Performing Students',
    description: 'Query top learners by score',
    code: 'SELECT name, score FROM students WHERE score >= 80 ORDER BY score DESC LIMIT 5;',
    timeLimitSecs: 35,
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 2. BUG HUNT CHALLENGES (Python, JS, TS, Java, SQL)
// ══════════════════════════════════════════════════════════════════════════
export const BUG_HUNT_CHALLENGES: BugHuntChallenge[] = [
  // Python
  {
    id: 'bh-py-1',
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
  {
    id: 'bh-py-2',
    language: 'python',
    title: 'Mutable Default Argument',
    description: 'Adding items to a default list shares state across multiple calls.',
    lines: [
      'def add_course(title, courses=[]):',
      '    courses.append(title)',
      '    return courses',
    ],
    buggyLineIndex: 0,
    bugExplanation: 'Using a mutable list as default parameter causes unexpected shared state.',
    correctOptions: [
      { text: 'def add_course(title, courses=None):', isCorrect: true },
      { text: 'def add_course(title, courses: list):', isCorrect: false },
      { text: 'def add_course(title, courses=()):', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
  // JavaScript
  {
    id: 'bh-js-1',
    language: 'javascript',
    title: 'Array Mutation Trap',
    description: 'This function should add an item without mutating the original array.',
    lines: [
      'function addStudent(list, student) {',
      '    list.push(student)',
      '    return list',
      '}',
    ],
    buggyLineIndex: 1,
    bugExplanation: '.push() mutates the original list in-place instead of creating a fresh copy.',
    correctOptions: [
      { text: 'return [...list, student]', isCorrect: true },
      { text: 'list.concat()', isCorrect: false },
      { text: 'return list + student', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
  {
    id: 'bh-js-2',
    language: 'javascript',
    title: 'Missing Await Keyword',
    description: 'Fetching user data returns a Promise rather than the resolved object.',
    lines: [
      'async function getUser(id) {',
      '    const res = fetch(`/api/users/${id}`)',
      '    const data = await res.json()',
      '    return data',
      '}',
    ],
    buggyLineIndex: 1,
    bugExplanation: 'Missing "await" before fetch() means res is an unresolved Promise.',
    correctOptions: [
      { text: 'const res = await fetch(`/api/users/${id}`)', isCorrect: true },
      { text: 'const res = sync fetch(`/api/users/${id}`)', isCorrect: false },
      { text: 'const res = fetch.then(`/api/users/${id}`)', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
  // TypeScript
  {
    id: 'bh-ts-1',
    language: 'typescript',
    title: 'Nullable Property Access',
    description: 'Accessing property on potentially undefined user object.',
    lines: [
      'interface User { profile?: { email: string } }',
      'function getEmail(user: User): string {',
      '    return user.profile.email;',
      '}',
    ],
    buggyLineIndex: 2,
    bugExplanation: 'user.profile may be undefined, requiring optional chaining (?.) or fallback.',
    correctOptions: [
      { text: 'return user.profile?.email ?? "no-email";', isCorrect: true },
      { text: 'return user.profile!.email;', isCorrect: false },
      { text: 'return user.profile as string;', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
  // Java
  {
    id: 'bh-java-1',
    language: 'java',
    title: 'String Equality Comparison',
    description: 'Comparing string contents with == instead of .equals()',
    lines: [
      'public boolean checkPass(String input, String expected) {',
      '    if (input == expected) {',
      '        return true;',
      '    }',
      '    return false;',
      '}',
    ],
    buggyLineIndex: 1,
    bugExplanation: 'In Java, "==" compares object reference memory addresses, not string value equality.',
    correctOptions: [
      { text: 'if (input.equals(expected)) {', isCorrect: true },
      { text: 'if (input.compareTo(expected) == 1) {', isCorrect: false },
      { text: 'if (input === expected) {', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
  // SQL
  {
    id: 'bh-sql-1',
    language: 'sql',
    title: 'Missing GROUP BY in Aggregate',
    description: 'Selecting department with COUNT without grouping.',
    lines: [
      'SELECT department, COUNT(*)',
      'FROM employees',
      'WHERE salary > 50000;',
    ],
    buggyLineIndex: 0,
    bugExplanation: 'Aggregate functions mixed with non-aggregated columns require a GROUP BY clause.',
    correctOptions: [
      { text: 'SELECT department, COUNT(*) FROM employees WHERE salary > 50000 GROUP BY department;', isCorrect: true },
      { text: 'SELECT department, SUM(*) FROM employees;', isCorrect: false },
      { text: 'SELECT ALL department, COUNT(*) FROM employees;', isCorrect: false },
    ],
    timeLimitSecs: 20,
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 3. OUTPUT PREDICTOR CHALLENGES (Python, JS, TS, Java, SQL)
// ══════════════════════════════════════════════════════════════════════════
export const OUTPUT_PREDICTOR_CHALLENGES: OutputPredictorChallenge[] = [
  // JavaScript
  {
    id: 'op-js-1',
    language: 'javascript',
    title: 'Type Coercion & Addition',
    code: 'console.log(1 + "2" + 3);',
    options: ['"123"', '6', '"15"', 'NaN'],
    correctIndex: 0,
    explanation: '1 + "2" coerces 1 to string yielding "12", then "12" + 3 concatenates to produce "123".',
    timeLimitSecs: 15,
  },
  {
    id: 'op-js-2',
    language: 'javascript',
    title: 'Array Slicing vs Splice',
    code: 'const arr = [10, 20, 30, 40];\narr.slice(1, 3);\nconsole.log(arr.length);',
    options: ['4', '2', '3', 'undefined'],
    correctIndex: 0,
    explanation: 'slice() does NOT mutate the original array, so arr.length remains 4!',
    timeLimitSecs: 15,
  },
  {
    id: 'op-js-3',
    language: 'javascript',
    title: 'Truthy / Falsy in Array Filter',
    code: 'const items = [0, "Africa", "", null, 42, undefined];\nconsole.log(items.filter(Boolean).length);',
    options: ['2', '3', '4', '6'],
    correctIndex: 0,
    explanation: 'Only "Africa" and 42 are truthy values (0, "", null, and undefined are falsy). Hence, length is 2.',
    timeLimitSecs: 15,
  },
  // Python
  {
    id: 'op-py-1',
    language: 'python',
    title: 'List Multiplication Shallow Copy',
    code: 'matrix = [[0]] * 2\nmatrix[0][0] = 5\nprint(matrix[1][0])',
    options: ['5', '0', 'IndexError', 'None'],
    correctIndex: 0,
    explanation: 'Multiplying a list containing a mutable inner list copies the reference. Modifying matrix[0][0] also changes matrix[1][0].',
    timeLimitSecs: 18,
  },
  {
    id: 'op-py-2',
    language: 'python',
    title: 'Dictionary Get with Default',
    code: 'user = {"name": "Kwame", "age": 22}\nprint(user.get("city", "Accra"))',
    options: ['"Accra"', 'None', 'KeyError', '"Kwame"'],
    correctIndex: 0,
    explanation: 'The "city" key does not exist in user, so .get() returns the provided default fallback "Accra".',
    timeLimitSecs: 15,
  },
  // TypeScript
  {
    id: 'op-ts-1',
    language: 'typescript',
    title: 'Nullish Coalescing (??) vs OR (||)',
    code: 'const score = 0;\nconst display = score ?? 100;\nconsole.log(display);',
    options: ['0', '100', 'null', 'undefined'],
    correctIndex: 0,
    explanation: 'The nullish coalescing operator (??) only falls back for null or undefined, preserving the valid falsy number 0.',
    timeLimitSecs: 15,
  },
  // Java
  {
    id: 'op-java-1',
    language: 'java',
    title: 'Integer Division Truncation',
    code: 'int a = 7;\nint b = 2;\nSystem.out.println(a / b);',
    options: ['3', '3.5', '4', 'Compilation Error'],
    correctIndex: 0,
    explanation: 'In Java, dividing two integers produces an integer result, truncating 3.5 down to 3.',
    timeLimitSecs: 15,
  },
]

// ══════════════════════════════════════════════════════════════════════════
// 4. CODE SHUFFLE CHALLENGES (Python, JS, TS, Java, SQL)
// ══════════════════════════════════════════════════════════════════════════
export const CODE_SHUFFLE_CHALLENGES: CodeShuffleChallenge[] = [
  // Python
  {
    id: 'cs-py-1',
    language: 'python',
    title: 'Fibonacci Sequence Generator',
    goalDescription: 'Generate the first n numbers of the Fibonacci series.',
    expectedOutput: '[0, 1, 1, 2, 3, 5]',
    scrambledBlocks: [
      { id: 'b4', content: 'fib.append(fib[-1] + fib[-2])', indent: 2 },
      { id: 'b1', content: 'def generate_fib(n):', indent: 0 },
      { id: 'b5', content: 'return fib[:n]', indent: 1 },
      { id: 'b3', content: 'for _ in range(2, n):', indent: 1 },
      { id: 'b2', content: 'fib = [0, 1]', indent: 1 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Function declaration -> initialize base values -> loop from 2 to n -> append sum of last two items -> return sliced list.',
  },
  // JavaScript
  {
    id: 'cs-js-1',
    language: 'javascript',
    title: 'Linear Search Algorithm',
    goalDescription: 'Search for a target value in an array and return its index or -1.',
    expectedOutput: 'Index of target or -1',
    scrambledBlocks: [
      { id: 'b3', content: 'if (arr[i] === target) return i;', indent: 2 },
      { id: 'b1', content: 'function findIndex(arr, target) {', indent: 0 },
      { id: 'b4', content: 'return -1;', indent: 1 },
      { id: 'b2', content: 'for (let i = 0; i < arr.length; i++) {', indent: 1 },
      { id: 'b5', content: '}', indent: 0 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Function definition -> iterate through array -> check equality -> fallback return -1 -> close function block.',
  },
  // TypeScript
  {
    id: 'cs-ts-1',
    language: 'typescript',
    title: 'Generic Stack Push/Pop',
    goalDescription: 'Assemble a generic Stack class in TypeScript.',
    expectedOutput: 'Typed Stack Instance',
    scrambledBlocks: [
      { id: 'b2', content: 'private items: T[] = [];', indent: 1 },
      { id: 'b1', content: 'class Stack<T> {', indent: 0 },
      { id: 'b4', content: 'pop(): T | undefined { return this.items.pop(); }', indent: 1 },
      { id: 'b3', content: 'push(item: T): void { this.items.push(item); }', indent: 1 },
      { id: 'b5', content: '}', indent: 0 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Class header with generic <T> -> private storage array -> push method -> pop method -> closing brace.',
  },
  // Java
  {
    id: 'cs-java-1',
    language: 'java',
    title: 'Check Palindrome Word',
    goalDescription: 'Check if a string reads the same backwards.',
    expectedOutput: 'true / false',
    scrambledBlocks: [
      { id: 'b3', content: 'while (left < right) {', indent: 1 },
      { id: 'b1', content: 'public static boolean isPalindrome(String s) {', indent: 0 },
      { id: 'b4', content: 'if (s.charAt(left++) != s.charAt(right--)) return false;', indent: 2 },
      { id: 'b2', content: 'int left = 0, right = s.length() - 1;', indent: 1 },
      { id: 'b5', content: 'return true;\n}', indent: 1 },
    ],
    correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5'],
    explanation: 'Method header -> two pointers -> while loop -> character comparison -> return true.',
  },
]
