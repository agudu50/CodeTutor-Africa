import { GameLanguage, GameId } from '../types/games.types'

export interface GameDrillItem {
  gameId: GameId
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedMins: number
}

export interface GameModuleItem {
  id: string
  title: string
  language: GameLanguage
  defaultProgress: number
  description: string
  moduleNumber: number
  drills: GameDrillItem[]
}

export interface LanguageTrackMeta {
  id: GameLanguage
  title: string
  badge: string
  subtitle: string
  description: string
  courseId: string
  iconColor: string
  gradient: string
  borderColor: string
  bgLight: string
  totalModules: number
}

export const LANGUAGE_TRACKS: LanguageTrackMeta[] = [
  {
    id: 'python',
    title: 'Python Programming',
    badge: 'PY',
    subtitle: 'Core Programming & Data Structures',
    description: 'Master clean indentation, dynamic typing, list comprehensions, functions, and OOP in Python.',
    courseId: 'course-py-101',
    iconColor: 'text-amber-500',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    borderColor: 'border-amber-500/30 hover:border-amber-500/60',
    bgLight: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    totalModules: 18,
  },
  {
    id: 'javascript',
    title: 'Modern JavaScript',
    badge: 'JS',
    subtitle: 'ES6+, Async JS & Web Runtime',
    description: 'Learn modern ES6+ syntax, closures, event loop microtasks, Promises, and async/await.',
    courseId: 'course-js-201',
    iconColor: 'text-yellow-500',
    gradient: 'from-yellow-500/20 via-yellow-500/5 to-transparent',
    borderColor: 'border-yellow-500/30 hover:border-yellow-500/60',
    bgLight: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    totalModules: 18,
  },
  {
    id: 'java',
    title: 'Java Engineering',
    badge: 'JV',
    subtitle: 'Strict Typing, OOP & JVM Architecture',
    description: 'Master strict typing, class blueprints, encapsulation, polymorphism, inheritance, and collections.',
    courseId: 'course-java-301',
    iconColor: 'text-rose-500',
    gradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
    borderColor: 'border-rose-500/30 hover:border-rose-500/60',
    bgLight: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    totalModules: 18,
  },
  {
    id: 'typescript',
    title: 'TypeScript Foundations',
    badge: 'TS',
    subtitle: 'Static Type Systems & Interfaces',
    description: 'Build enterprise-grade applications with static interfaces, generic types, utility types, and strict contracts.',
    courseId: 'course-ts-401',
    iconColor: 'text-blue-500',
    gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    bgLight: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    totalModules: 18,
  },
  {
    id: 'sql',
    title: 'SQL & Database Systems',
    badge: 'DB',
    subtitle: 'Relational Queries & Data Manipulation',
    description: 'Write performant SELECT queries, multi-table JOINs, aggregations, and subqueries.',
    courseId: 'course-sql-501',
    iconColor: 'text-emerald-500',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    bgLight: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    totalModules: 6,
  },
]

export const LANGUAGE_GAME_MODULES: Record<GameLanguage, GameModuleItem[]> = {
  // ═════════════════════════════════════════════════════════════════════════════
  // 1. PYTHON TRACK (18 Structured Modules)
  // ═════════════════════════════════════════════════════════════════════════════
  python: [
    {
      id: 'py-mod-1',
      moduleNumber: 1,
      title: 'Your First Lines of Code',
      language: 'python',
      defaultProgress: 0,
      description: 'Master basic print outputs, python syntax conventions, and code structure.',
      drills: [
        { gameId: 'speedrun', title: 'Hello World & Print Formatting', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Quotation & Parentheses Bugs', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Print Output Sequencing', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-2',
      moduleNumber: 2,
      title: 'Storing Data with Variables',
      language: 'python',
      defaultProgress: 0,
      description: 'Variable declaration, memory assignment references, and snake_case conventions.',
      drills: [
        { gameId: 'speedrun', title: 'Variable Assignment & Reassignment', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Undefined Variable Reference Hunt', difficulty: 'Beginner', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Swap Variables in Memory', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-3',
      moduleNumber: 3,
      title: 'Data Types: Strings, Numbers, and Booleans',
      language: 'python',
      defaultProgress: 0,
      description: 'Explore str, int, float, bool types and explicit type conversion.',
      drills: [
        { gameId: 'predictor', title: 'Type Casting & Arithmetic Evaluation', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Type Conversion Speed Drill', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'String Concatenation with Numbers', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-4',
      moduleNumber: 4,
      title: 'Arithmetic Operations',
      language: 'python',
      defaultProgress: 0,
      description: 'Addition, subtraction, floor division (//), modulo (%), and exponentiation (**).',
      drills: [
        { gameId: 'predictor', title: 'Operator Precedence & Modulo', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Math Expressions Blitz', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-5',
      moduleNumber: 5,
      title: 'Working with Strings',
      language: 'python',
      defaultProgress: 0,
      description: 'String slicing [start:end:step], f-strings, concatenation, and case manipulation.',
      drills: [
        { gameId: 'speedrun', title: 'F-string Template Formatting', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Reverse String Slicing Logic', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'String Immature Mutation Bug', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-6',
      moduleNumber: 6,
      title: 'Comparison Operators',
      language: 'python',
      defaultProgress: 0,
      description: 'Equality (==), inequality (!=), greater/less than, and value vs identity (is).',
      drills: [
        { gameId: 'predictor', title: 'Truthy vs Falsy Comparisons', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Single Equals (=) Assignment Bug', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-7',
      moduleNumber: 7,
      title: 'Making Decisions with if Statements',
      language: 'python',
      defaultProgress: 0,
      description: 'Conditional branching, if / elif / else blocks, and indentation scopes.',
      drills: [
        { gameId: 'speedrun', title: 'Multi-branch if-elif-else', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Grade Classifier Block Builder', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-8',
      moduleNumber: 8,
      title: 'Logical Operators',
      language: 'python',
      defaultProgress: 0,
      description: 'Combining booleans with and, or, not and short-circuit evaluation.',
      drills: [
        { gameId: 'predictor', title: 'Short-Circuit Logic Predictions', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Inverted Logic Trap', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-9',
      moduleNumber: 9,
      title: 'Repeating with while Loops',
      language: 'python',
      defaultProgress: 0,
      description: 'Loop conditions, accumulator counters, break, and continue statements.',
      drills: [
        { gameId: 'bughunt', title: 'Infinite While Loop Trap', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'speedrun', title: 'Countdown Accumulator Drill', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Countdown While Loop', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'py-mod-10',
      moduleNumber: 10,
      title: 'Introduction to Functions',
      language: 'python',
      defaultProgress: 0,
      description: 'Function definition (def), calling conventions, docstrings, and namespaces.',
      drills: [
        { gameId: 'speedrun', title: 'Function Signatures & Invocation', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Assemble Helper Function', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-11',
      moduleNumber: 11,
      title: 'Function Parameters and Arguments',
      language: 'python',
      defaultProgress: 0,
      description: 'Positional arguments, keyword arguments, and mutable default arguments.',
      drills: [
        { gameId: 'predictor', title: 'Positional vs Keyword Precedence', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Mutable Default Argument Trap', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-12',
      moduleNumber: 12,
      title: 'Return Values from Functions',
      language: 'python',
      defaultProgress: 0,
      description: 'The return statement, implicit None return, and multiple tuple returns.',
      drills: [
        { gameId: 'speedrun', title: 'Tuple Return Unpacking', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Implicit None Return Value', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-13',
      moduleNumber: 13,
      title: 'Creating Arrays & Lists',
      language: 'python',
      defaultProgress: 0,
      description: 'List initialization, zero-based indexing, negative indexing, and nested lists.',
      drills: [
        { gameId: 'speedrun', title: 'Negative Indexing Speedrun', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'IndexError Out-Of-Range Trap', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-14',
      moduleNumber: 14,
      title: 'Array Length & Basic Methods',
      language: 'python',
      defaultProgress: 0,
      description: 'len(), append(), pop(), insert(), remove(), and sort() list methods.',
      drills: [
        { gameId: 'speedrun', title: 'Append & Pop Stack Speedrun', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'In-Place vs Returning Sort', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-15',
      moduleNumber: 15,
      title: 'Looping Over Arrays',
      language: 'python',
      defaultProgress: 0,
      description: 'For in loops, enumerate(), zip(), and list comprehensions.',
      drills: [
        { gameId: 'speedrun', title: 'Enumerate Index & Item Loop', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'List Comprehension Filter Assembly', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-16',
      moduleNumber: 16,
      title: 'Creating Dictionaries (Objects)',
      language: 'python',
      defaultProgress: 0,
      description: 'Key-value pairs, get() default fallback, keys(), and values() methods.',
      drills: [
        { gameId: 'predictor', title: 'KeyError vs .get() Fallback', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Dictionary Lookup & Mutation', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-17',
      moduleNumber: 17,
      title: 'Working with Objects & Classes',
      language: 'python',
      defaultProgress: 0,
      description: 'Class declarations, __init__ constructor, methods, and self instance binding.',
      drills: [
        { gameId: 'speedrun', title: 'OOP Class Constructor', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Missing self Reference in Method', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Assemble Student Class', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'py-mod-18',
      moduleNumber: 18,
      title: 'Python Capstone & Data Processing',
      language: 'python',
      defaultProgress: 0,
      description: 'End-to-end data transformation pipeline combining lists, dictionaries, and functions.',
      drills: [
        { gameId: 'shuffle', title: 'Assemble Full Data Pipeline', difficulty: 'Advanced', estimatedMins: 4 },
        { gameId: 'predictor', title: 'Complex Comprehension & Filter', difficulty: 'Advanced', estimatedMins: 3 },
      ],
    },
  ],

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. JAVASCRIPT TRACK (18 Structured Modules)
  // ═════════════════════════════════════════════════════════════════════════════
  javascript: [
    {
      id: 'js-mod-1',
      moduleNumber: 1,
      title: 'Your First Lines of Code',
      language: 'javascript',
      defaultProgress: 0,
      description: 'console.log(), syntax semicolon rules, and browser devtools console.',
      drills: [
        { gameId: 'speedrun', title: 'Console Output & Interpolation', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Console Log Output Order', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Unmatched Parentheses Syntax Error', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-2',
      moduleNumber: 2,
      title: 'Storing Data with Variables',
      language: 'javascript',
      defaultProgress: 0,
      description: 'let vs const vs var, temporal dead zone, and block scoping.',
      drills: [
        { gameId: 'bughunt', title: 'Const Reassignment Error', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Const & Let Declarations', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Block Scope Visibility Quiz', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-3',
      moduleNumber: 3,
      title: 'Data Types: Strings, Numbers, and Booleans',
      language: 'javascript',
      defaultProgress: 0,
      description: 'typeof operator, null vs undefined, and template literals.',
      drills: [
        { gameId: 'predictor', title: 'Type Coercion (+ vs -)', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Template Literals Syntax', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Typeof Null Object Bug', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-4',
      moduleNumber: 4,
      title: 'Arithmetic & Operators',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Math operators, ++/-- increments, and Math object utilities.',
      drills: [
        { gameId: 'predictor', title: 'Implicit String Coercion', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Math.floor & Random Formulas', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-5',
      moduleNumber: 5,
      title: 'Working with Strings',
      language: 'javascript',
      defaultProgress: 0,
      description: 'String methods: includes(), slice(), split(), trim(), and replace().',
      drills: [
        { gameId: 'speedrun', title: 'String Method Chain', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Title Case Formatter', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'js-mod-6',
      moduleNumber: 6,
      title: 'Comparison & Equality',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Strict equality (===) vs loose equality (==), and truthy/falsy values.',
      drills: [
        { gameId: 'predictor', title: 'Strict Equality Matrix', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Loose Equality Coercion Bug', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-7',
      moduleNumber: 7,
      title: 'Making Decisions with if Statements',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Ternary operator (? :), switch statements, and conditional blocks.',
      drills: [
        { gameId: 'speedrun', title: 'Ternary & Guard Clauses', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Assemble Switch Case Dispatcher', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'js-mod-8',
      moduleNumber: 8,
      title: 'Logical Operators',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Nullish coalescing (??), logical AND (&&), and optional chaining (?.).',
      drills: [
        { gameId: 'predictor', title: 'Nullish Coalescing vs OR', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Optional Chaining Fallback Trap', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-9',
      moduleNumber: 9,
      title: 'Repeating with Loops',
      language: 'javascript',
      defaultProgress: 0,
      description: 'For loops, while loops, for...of, and for...in.',
      drills: [
        { gameId: 'speedrun', title: 'For...of Iterable Speedrun', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Off-By-One Array Index Bug', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-10',
      moduleNumber: 10,
      title: 'Introduction to Functions & Arrows',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Function declarations vs arrow functions, lexical this, and callbacks.',
      drills: [
        { gameId: 'speedrun', title: 'Arrow Function Expression', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Callback Transform Pipeline', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'js-mod-11',
      moduleNumber: 11,
      title: 'Creating & Manipulating Arrays',
      language: 'javascript',
      defaultProgress: 0,
      description: 'map(), filter(), reduce(), find(), and spread operator [...arr].',
      drills: [
        { gameId: 'bughunt', title: 'Array Mutation Side Effect', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'speedrun', title: 'Array Map & Filter Pipeline', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'js-mod-12',
      moduleNumber: 12,
      title: 'Objects, Keys & Destructuring',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Object literals, nested keys, object destructuring, and Object.entries().',
      drills: [
        { gameId: 'speedrun', title: 'Destructure Nested User Object', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Object Reference Copying Quiz', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-13',
      moduleNumber: 13,
      title: 'ES6 Classes & Prototypes',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Class syntax, constructor methods, getters/setters, and inheritance extends.',
      drills: [
        { gameId: 'speedrun', title: 'Class Constructor & Method', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Super Constructor Call Missing', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'js-mod-14',
      moduleNumber: 14,
      title: 'Async JavaScript & Promises',
      language: 'javascript',
      defaultProgress: 0,
      description: 'async / await, Promise.all(), fetch API, and microtask event loop.',
      drills: [
        { gameId: 'bughunt', title: 'Unresolved Promise Trap', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'predictor', title: 'Microtask Execution Order', difficulty: 'Advanced', estimatedMins: 3 },
        { gameId: 'speedrun', title: 'Async Fetch Student Data', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Asynchronous API Fetch Handler', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'js-mod-15',
      moduleNumber: 15,
      title: 'Error Handling with try / catch',
      language: 'javascript',
      defaultProgress: 0,
      description: 'try, catch, finally, custom Error instances, and promise rejections.',
      drills: [
        { gameId: 'speedrun', title: 'Try Catch Finally Block', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Silent Error Swallowing Bug', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'js-mod-16',
      moduleNumber: 16,
      title: 'JavaScript Modules & Imports',
      language: 'javascript',
      defaultProgress: 0,
      description: 'ES Modules: import, export, default export, named imports, and re-exporting.',
      drills: [
        { gameId: 'speedrun', title: 'Named vs Default Export', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-17',
      moduleNumber: 17,
      title: 'Higher Order Functions & Closures',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Lexical scopes, function returning function, memoization, and currying.',
      drills: [
        { gameId: 'predictor', title: 'Closure State Retention', difficulty: 'Advanced', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Assemble Counter Factory Closure', difficulty: 'Advanced', estimatedMins: 3 },
      ],
    },
    {
      id: 'js-mod-18',
      moduleNumber: 18,
      title: 'Full JavaScript App Architecture',
      language: 'javascript',
      defaultProgress: 0,
      description: 'State management, event emitter pattern, and modular asynchronous architecture.',
      drills: [
        { gameId: 'shuffle', title: 'Assemble Event Emitter Store', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
  ],

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. JAVA TRACK (18 Structured Modules)
  // ═════════════════════════════════════════════════════════════════════════════
  java: [
    {
      id: 'java-mod-1',
      moduleNumber: 1,
      title: 'Your First Lines of Code',
      language: 'java',
      defaultProgress: 0,
      description: 'Main method signature: public static void main(String[] args), System.out.println().',
      drills: [
        { gameId: 'speedrun', title: 'Main Method Boilerplate', difficulty: 'Beginner', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Missing Semicolon & Main Signature', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Console Print vs Println', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-2',
      moduleNumber: 2,
      title: 'Primitive Types & Variables',
      language: 'java',
      defaultProgress: 0,
      description: 'int, double, boolean, char, casting, and integer division truncation.',
      drills: [
        { gameId: 'predictor', title: 'Integer Division Truncation', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Typed Variable Declarations', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Narrowing Type Conversion Bug', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-3',
      moduleNumber: 3,
      title: 'Operators & Math Expressions',
      language: 'java',
      defaultProgress: 0,
      description: 'Arithmetic, compound assignments (+=, -=), pre/post increments (++i vs i++).',
      drills: [
        { gameId: 'predictor', title: 'Post-increment vs Pre-increment', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Math Expressions in Java', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-4',
      moduleNumber: 4,
      title: 'Strings & Value Equality',
      language: 'java',
      defaultProgress: 0,
      description: 'String pool, .equals() vs ==, and StringBuilder for efficient concatenation.',
      drills: [
        { gameId: 'bughunt', title: 'String Reference Equality (==) Bug', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Two-Pointer Palindrome Verifier', difficulty: 'Advanced', estimatedMins: 4 },
        { gameId: 'speedrun', title: 'StringBuilder Append & Reverse', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'java-mod-5',
      moduleNumber: 5,
      title: 'Decision Making with if-else',
      language: 'java',
      defaultProgress: 0,
      description: 'Conditionals, boolean expressions, switch statements, and ternary operators.',
      drills: [
        { gameId: 'speedrun', title: 'Java Switch Statement', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Switch Fall-Through Predictor', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-6',
      moduleNumber: 6,
      title: 'Loops: while & for',
      language: 'java',
      defaultProgress: 0,
      description: 'Counting for-loops, enhanced for-each loop, while loops, and loop control.',
      drills: [
        { gameId: 'speedrun', title: 'Enhanced For-Each Loop', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Array Index Out Of Bounds in Loop', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-7',
      moduleNumber: 7,
      title: 'Methods & Return Signatures',
      language: 'java',
      defaultProgress: 0,
      description: 'Static methods, parameter passing by value, return types, and void methods.',
      drills: [
        { gameId: 'speedrun', title: 'Static Utility Method Header', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Pass-by-Value Reference Effect', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'java-mod-8',
      moduleNumber: 8,
      title: 'Method Overloading',
      language: 'java',
      defaultProgress: 0,
      description: 'Multiple methods with the same name, distinct parameter lists, and compile-time binding.',
      drills: [
        { gameId: 'predictor', title: 'Overloaded Method Resolution', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-9',
      moduleNumber: 9,
      title: 'Fixed-Size Arrays in Java',
      language: 'java',
      defaultProgress: 0,
      description: 'Array instantiation (new int[10]), length property, and 2D matrices.',
      drills: [
        { gameId: 'speedrun', title: 'Array Allocation & Traversal', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Find Maximum Element in Array', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'java-mod-10',
      moduleNumber: 10,
      title: 'Dynamic Lists with ArrayList',
      language: 'java',
      defaultProgress: 0,
      description: 'ArrayList<T> generics, add(), get(), remove(), size(), and Collections.sort().',
      drills: [
        { gameId: 'speedrun', title: 'ArrayList Operations', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'ConcurrentModificationException Trap', difficulty: 'Advanced', estimatedMins: 3 },
      ],
    },
    {
      id: 'java-mod-11',
      moduleNumber: 11,
      title: 'Classes, Objects, and Constructors',
      language: 'java',
      defaultProgress: 0,
      description: 'Class instantiation, fields, constructors, and this keyword in JVM.',
      drills: [
        { gameId: 'speedrun', title: 'Instantiate Student Object', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Assemble Complete Java Class', difficulty: 'Intermediate', estimatedMins: 4 },
      ],
    },
    {
      id: 'java-mod-12',
      moduleNumber: 12,
      title: 'Encapsulation & Access Modifiers',
      language: 'java',
      defaultProgress: 0,
      description: 'private vs protected vs public, getters, setters, and data hiding.',
      drills: [
        { gameId: 'speedrun', title: 'Private Field & Getter/Setter', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Direct Private Field Access Bug', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-13',
      moduleNumber: 13,
      title: 'Inheritance with extends',
      language: 'java',
      defaultProgress: 0,
      description: 'Superclasses, subclasses, super() constructor calls, and code reuse.',
      drills: [
        { gameId: 'speedrun', title: 'Subclass with Super Call', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Missing Super Constructor Call', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'java-mod-14',
      moduleNumber: 14,
      title: 'Polymorphism & Method Overriding',
      language: 'java',
      defaultProgress: 0,
      description: '@Override annotation, runtime dynamic dispatch, and polymorphic references.',
      drills: [
        { gameId: 'speedrun', title: 'Implement Interface Method', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'predictor', title: 'Dynamic Method Dispatch Result', difficulty: 'Advanced', estimatedMins: 3 },
      ],
    },
    {
      id: 'java-mod-15',
      moduleNumber: 15,
      title: 'Interfaces & Abstract Classes',
      language: 'java',
      defaultProgress: 0,
      description: 'interface contracts, default methods, abstract class blueprints, and multiple interfaces.',
      drills: [
        { gameId: 'speedrun', title: 'Declare & Implement Interface', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Assemble Shape Interface Hierarchy', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'java-mod-16',
      moduleNumber: 16,
      title: 'Exception Handling: try-catch-finally',
      language: 'java',
      defaultProgress: 0,
      description: 'Checked vs unchecked exceptions, throw, throws, and try-with-resources.',
      drills: [
        { gameId: 'speedrun', title: 'Try-Catch Exception Handler', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Uncaught Checked Exception', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-17',
      moduleNumber: 17,
      title: 'HashMaps & Key-Value Lookups',
      language: 'java',
      defaultProgress: 0,
      description: 'HashMap<K, V>, put(), getOrDefault(), containsKey(), and keySet() iterations.',
      drills: [
        { gameId: 'speedrun', title: 'HashMap Frequency Counter', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'predictor', title: 'Null Key & Overwrite in Map', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-18',
      moduleNumber: 18,
      title: 'Java OOP Capstone',
      language: 'java',
      defaultProgress: 0,
      description: 'End-to-end scalable domain model using interfaces, classes, and collection algorithms.',
      drills: [
        { gameId: 'shuffle', title: 'Assemble Student Grade Manager', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
  ],

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. TYPESCRIPT TRACK (18 Structured Modules)
  // ═════════════════════════════════════════════════════════════════════════════
  typescript: [
    {
      id: 'ts-mod-1',
      moduleNumber: 1,
      title: 'TypeScript Foundations & Types',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Explicit types: string, number, boolean, any, unknown, and type annotations.',
      drills: [
        { gameId: 'speedrun', title: 'Explicit Variable Type Annotations', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Type Mismatch Assignment Error', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Type Inference Evaluation', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-2',
      moduleNumber: 2,
      title: 'Type Inference & Strict Checking',
      language: 'typescript',
      defaultProgress: 0,
      description: 'tsc compiler inference, strictNullChecks, and noImplicitAny flag.',
      drills: [
        { gameId: 'predictor', title: 'Inferred Function Return Types', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Null / Undefined Strict Check Trap', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-3',
      moduleNumber: 3,
      title: 'Interfaces & Object Contracts',
      language: 'typescript',
      defaultProgress: 0,
      description: 'interface syntax, optional properties (?), readonly fields, and structural typing.',
      drills: [
        { gameId: 'speedrun', title: 'Typed Student Record', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Readonly Property Mutation Bug', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Assemble User Interface Contract', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'ts-mod-4',
      moduleNumber: 4,
      title: 'Type Aliases & Union Types',
      language: 'typescript',
      defaultProgress: 0,
      description: 'type aliases, union types (A | B), intersection types (A & B).',
      drills: [
        { gameId: 'speedrun', title: 'Union Type Parameter Declaration', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Intersection Type Member Check', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-5',
      moduleNumber: 5,
      title: 'Literal Types & Type Narrowing',
      language: 'typescript',
      defaultProgress: 0,
      description: 'String literals, typeof guards, instanceof guards, and in operator checks.',
      drills: [
        { gameId: 'speedrun', title: 'Type Guard with typeof', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Control Flow Type Narrowing', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-6',
      moduleNumber: 6,
      title: 'Functions with Strict Typing',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Parameter types, return type annotations, optional parameters, and void return.',
      drills: [
        { gameId: 'speedrun', title: 'Typed Arrow Function Callback', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Missing Return in Typed Function', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-7',
      moduleNumber: 7,
      title: 'Function Overloading in TypeScript',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Overload signatures, single implementation signature, and return branching.',
      drills: [
        { gameId: 'predictor', title: 'Overload Signature Matching', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-8',
      moduleNumber: 8,
      title: 'Tuples & Typed Arrays',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Fixed-length tuple types [string, number], readonly arrays, and spread tuples.',
      drills: [
        { gameId: 'speedrun', title: 'Coordinate Tuple Declaration', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Tuple Index Overflow Error', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-9',
      moduleNumber: 9,
      title: 'Enums: Numeric & String Enums',
      language: 'typescript',
      defaultProgress: 0,
      description: 'enum vs const enum, string enums, and union literals comparison.',
      drills: [
        { gameId: 'speedrun', title: 'String Enum Declaration', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Numeric Enum Reverse Mapping', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-10',
      moduleNumber: 10,
      title: 'Generics Fundamentals',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Generic functions <T>, reusable identity, generic constraints (extends).',
      drills: [
        { gameId: 'speedrun', title: 'Generic Wrapper Function', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Assemble Generic API Response Handler', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'ts-mod-11',
      moduleNumber: 11,
      title: 'Generic Interfaces & Classes',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Generic interface definitions, generic class state, and multiple type parameters <T, K>.',
      drills: [
        { gameId: 'speedrun', title: 'Generic Key-Value Store', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Invalid Generic Constraint Violation', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'ts-mod-12',
      moduleNumber: 12,
      title: 'Utility Types: Partial, Pick, Omit',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Partial<T>, Required<T>, Readonly<T>, Pick<T, K>, and Omit<T, K>.',
      drills: [
        { gameId: 'speedrun', title: 'Omit Sensitive Password Field', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Partial vs Required Utility Output', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-13',
      moduleNumber: 13,
      title: 'Utility Types: Record, Exclude, Extract',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Record<K, T>, Exclude<T, U>, Extract<T, U>, NonNullable<T>, and ReturnType<T>.',
      drills: [
        { gameId: 'speedrun', title: 'Record Map of User Permissions', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'ReturnType Parameter Mistake', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'ts-mod-14',
      moduleNumber: 14,
      title: 'Classes & Access Modifiers in TS',
      language: 'typescript',
      defaultProgress: 0,
      description: 'public, private, protected, readonly parameters, and abstract classes.',
      drills: [
        { gameId: 'speedrun', title: 'Constructor Parameter Properties', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Assemble Polymorphic Service Class', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'ts-mod-15',
      moduleNumber: 15,
      title: 'Discriminated Unions & Pattern Matching',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Discriminated unions with kind tag, exhaustive switch statements with never type.',
      drills: [
        { gameId: 'predictor', title: 'Discriminated Union Exhaustiveness', difficulty: 'Advanced', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Assemble Reducer Action Handler', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'ts-mod-16',
      moduleNumber: 16,
      title: 'Async & Promise Typing in TypeScript',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Promise<T>, Awaited<T>, typed async handlers, and fetch API wrapper.',
      drills: [
        { gameId: 'speedrun', title: 'Typed Async Data Fetcher', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Missing Promise Return Type Bug', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'ts-mod-17',
      moduleNumber: 17,
      title: 'Type Assertions & Type Casting',
      language: 'typescript',
      defaultProgress: 0,
      description: 'as syntax, non-null assertion (!), type predicates (is syntax), and assertions.',
      drills: [
        { gameId: 'speedrun', title: 'Custom Type Predicate Function', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Dangerous Non-Null Assertion Crash', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'ts-mod-18',
      moduleNumber: 18,
      title: 'TypeScript Enterprise Capstone',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Build a production-grade typed API client with generics, error unions, and schema validation.',
      drills: [
        { gameId: 'shuffle', title: 'Assemble Type-Safe API Client', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
  ],

  // ═════════════════════════════════════════════════════════════════════════════
  // 5. SQL TRACK (Database Modules)
  // ═════════════════════════════════════════════════════════════════════════════
  sql: [
    {
      id: 'sql-mod-1',
      moduleNumber: 1,
      title: 'Database Queries & Filtering',
      language: 'sql',
      defaultProgress: 0,
      description: 'SELECT, WHERE, ORDER BY, LIMIT, and basic comparisons.',
      drills: [
        { gameId: 'speedrun', title: 'Top Performing Students Query', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Missing Quotes in SQL WHERE String', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'sql-mod-2',
      moduleNumber: 2,
      title: 'Aggregations: COUNT, SUM, AVG',
      language: 'sql',
      defaultProgress: 0,
      description: 'Aggregate functions, GROUP BY, and HAVING filters.',
      drills: [
        { gameId: 'speedrun', title: 'Group By Department Average', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'predictor', title: 'HAVING vs WHERE Filter Outcome', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'sql-mod-3',
      moduleNumber: 3,
      title: 'Relational JOINs & Relationships',
      language: 'sql',
      defaultProgress: 0,
      description: 'INNER JOIN, LEFT JOIN, foreign keys, and matching records.',
      drills: [
        { gameId: 'speedrun', title: 'Inner Join Students with Courses', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Assemble Multi-Table Report Query', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'sql-mod-4',
      moduleNumber: 4,
      title: 'Data Modification: INSERT, UPDATE, DELETE',
      language: 'sql',
      defaultProgress: 0,
      description: 'Inserting rows, updating with WHERE safeguard, and transactions.',
      drills: [
        { gameId: 'bughunt', title: 'Accidental UPDATE Without WHERE Clause', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Insert New Learner Record', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'sql-mod-5',
      moduleNumber: 5,
      title: 'Subqueries & Nested SELECTs',
      language: 'sql',
      defaultProgress: 0,
      description: 'Correlated subqueries, IN operator, EXISTS, and CTEs (WITH clause).',
      drills: [
        { gameId: 'predictor', title: 'Subquery Evaluation Result', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'sql-mod-6',
      moduleNumber: 6,
      title: 'Database Schema & Constraints',
      language: 'sql',
      defaultProgress: 0,
      description: 'CREATE TABLE, PRIMARY KEY, NOT NULL, UNIQUE, and FOREIGN KEY.',
      drills: [
        { gameId: 'shuffle', title: 'Assemble Student Table Schema', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
  ],

  all: [],
}

// Helper to get modules with fallback
export function getGameModulesForLanguage(lang: GameLanguage): GameModuleItem[] {
  if (lang === 'all') {
    return [
      ...LANGUAGE_GAME_MODULES.python,
      ...LANGUAGE_GAME_MODULES.javascript,
      ...LANGUAGE_GAME_MODULES.java,
      ...LANGUAGE_GAME_MODULES.typescript,
    ]
  }
  return LANGUAGE_GAME_MODULES[lang] || LANGUAGE_GAME_MODULES.python
}

export function getTrackMeta(lang: GameLanguage): LanguageTrackMeta {
  return (
    LANGUAGE_TRACKS.find((t) => t.id === lang) ||
    LANGUAGE_TRACKS[0]
  )
}
