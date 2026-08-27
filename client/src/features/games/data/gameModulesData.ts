import { GameLanguage, GameId } from '../types/games.types'

export interface GameModuleItem {
  id: string
  title: string
  language: GameLanguage
  defaultProgress: number
  description: string
  drills: {
    gameId: GameId
    title: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    estimatedMins: number
  }[]
}

export const LANGUAGE_GAME_MODULES: Record<GameLanguage, GameModuleItem[]> = {
  python: [
    {
      id: 'py-mod-1',
      title: 'Your First Lines of Code',
      language: 'python',
      defaultProgress: 50,
      description: 'Master basic print outputs, python syntax conventions, and code structure.',
      drills: [
        { gameId: 'speedrun', title: 'Hello World & Print Formatting', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Quotation & Parentheses Bugs', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Print Output Sequencing', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-2',
      title: 'Storing Data with Variables',
      language: 'python',
      defaultProgress: 67,
      description: 'Variable declaration, memory assignment references, and snake_case conventions.',
      drills: [
        { gameId: 'speedrun', title: 'Variable Assignment & Reassignment', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Undefined Variable Reference Hunt', difficulty: 'Beginner', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Swap Variables in Memory', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-3',
      title: 'Data Types: Strings, Numbers, and Booleans',
      language: 'python',
      defaultProgress: 71,
      description: 'Explore str, int, float, bool types and explicit type conversion.',
      drills: [
        { gameId: 'predictor', title: 'Type Casting & Arithmetic Evaluation', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Type Conversion Speed Drill', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'String Concatenation with Numbers', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-4',
      title: 'Arithmetic Operations',
      language: 'python',
      defaultProgress: 50,
      description: 'Addition, subtraction, floor division (//), modulo (%), and exponentiation (**).',
      drills: [
        { gameId: 'predictor', title: 'Operator Precedence & Modulo', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Math Expressions Blitz', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-5',
      title: 'Working with Strings',
      language: 'python',
      defaultProgress: 57,
      description: 'String slicing [start:end:step], f-strings, concatenation, and case manipulation.',
      drills: [
        { gameId: 'speedrun', title: 'F-string Template Formatting', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Reverse String Slicing Logic', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'String Immature Mutation Bug', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-6',
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
      title: 'Logical Operators',
      language: 'python',
      defaultProgress: 62,
      description: 'Combining booleans with and, or, not and short-circuit evaluation.',
      drills: [
        { gameId: 'predictor', title: 'Short-Circuit Logic Predictions', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'Inverted Logic Trap', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-9',
      title: 'Repeating with while Loops',
      language: 'python',
      defaultProgress: 70,
      description: 'Loop conditions, accumulator counters, break, and continue statements.',
      drills: [
        { gameId: 'bughunt', title: 'Infinite While Loop Trap', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'speedrun', title: 'Countdown Accumulator Drill', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Two-Pointer While Loop', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'py-mod-10',
      title: 'Introduction to Functions',
      language: 'python',
      defaultProgress: 60,
      description: 'Function definition (def), calling conventions, docstrings, and namespaces.',
      drills: [
        { gameId: 'speedrun', title: 'Function Signatures & Invocation', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Assemble Helper Function', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'py-mod-11',
      title: 'Function Parameters and Arguments',
      language: 'python',
      defaultProgress: 50,
      description: 'Positional arguments, keyword arguments, and mutable default arguments.',
      drills: [
        { gameId: 'bughunt', title: 'Shared Mutable Default Argument', difficulty: 'Advanced', estimatedMins: 3 },
        { gameId: 'speedrun', title: 'Keyword Arguments Call', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-12',
      title: 'Return Values from Functions',
      language: 'python',
      defaultProgress: 0,
      description: 'Returning values, returning tuples, implicit None return values, and recursion.',
      drills: [
        { gameId: 'predictor', title: 'Missing Return Output Tracing', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Recursive Factorial Assembly', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'py-mod-13',
      title: 'Creating Arrays & Lists',
      language: 'python',
      defaultProgress: 0,
      description: 'List creation, zero-based indexing, list multiplying, and list comprehensions.',
      drills: [
        { gameId: 'speedrun', title: 'List Slicing & Cloning', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'List Reference Mutation Prediction', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-14',
      title: 'Array Length and Basic Methods',
      language: 'python',
      defaultProgress: 0,
      description: 'len(), append(), pop(), insert(), remove(), and index lookups.',
      drills: [
        { gameId: 'speedrun', title: 'List Methods Fast Typing', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'bughunt', title: 'IndexError Off-By-One', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-15',
      title: 'Looping Over Arrays',
      language: 'python',
      defaultProgress: 0,
      description: 'For-in iteration, enumerate(), zip(), and filtering elements in list.',
      drills: [
        { gameId: 'shuffle', title: 'Filter & Sum List Elements', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'speedrun', title: 'Enumerate Item Index Loop', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-16',
      title: 'Creating Objects & Dictionaries',
      language: 'python',
      defaultProgress: 0,
      description: 'Dictionary key-value mappings, access by key, and dict comprehension.',
      drills: [
        { gameId: 'predictor', title: 'Dictionary Key Lookup & Mutation', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Student Record Dictionary', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'py-mod-17',
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
  ],

  javascript: [
    {
      id: 'js-mod-1',
      title: 'Your First Lines of Code',
      language: 'javascript',
      defaultProgress: 60,
      description: 'console.log(), syntax semicolon rules, and browser devtools console.',
      drills: [
        { gameId: 'speedrun', title: 'Console Output & Interpolation', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'predictor', title: 'Console Log Output Order', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-2',
      title: 'Storing Data with Variables',
      language: 'javascript',
      defaultProgress: 50,
      description: 'let vs const vs var, temporal dead zone, and block scoping.',
      drills: [
        { gameId: 'bughunt', title: 'Const Reassignment Error', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Const & Let Declarations', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-3',
      title: 'Data Types: Strings, Numbers, and Booleans',
      language: 'javascript',
      defaultProgress: 0,
      description: 'typeof operator, null vs undefined, and template literals.',
      drills: [
        { gameId: 'predictor', title: 'Type Coercion (+ vs -)', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Template Literals Syntax', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-4',
      title: 'Arithmetic & Operators',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Math operators, ++/-- increments, and Math object utilities.',
      drills: [
        { gameId: 'predictor', title: 'Implicit String Coercion', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-5',
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
      title: 'Making Decisions with if Statements',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Ternary operator (? :), switch statements, and conditional blocks.',
      drills: [
        { gameId: 'speedrun', title: 'Ternary & Guard Clauses', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-8',
      title: 'Logical Operators',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Nullish coalescing (??), logical AND (&&), and optional chaining (?.).',
      drills: [
        { gameId: 'predictor', title: 'Nullish Coalescing vs OR', difficulty: 'Intermediate', estimatedMins: 2 },
      ],
    },
    {
      id: 'js-mod-9',
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
      title: 'Introduction to Functions & Arrows',
      language: 'javascript',
      defaultProgress: 0,
      description: 'Function declarations vs arrow functions, lexical this, and callbacks.',
      drills: [
        { gameId: 'speedrun', title: 'Arrow Function Expression', difficulty: 'Beginner', estimatedMins: 2 },
        { gameId: 'shuffle', title: 'Asynchronous API Fetch Handler', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'js-mod-11',
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
      title: 'Async JavaScript & Promises',
      language: 'javascript',
      defaultProgress: 0,
      description: 'async / await, Promise.all(), fetch API, and microtask event loop.',
      drills: [
        { gameId: 'bughunt', title: 'Unresolved Promise Trap', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'predictor', title: 'Microtask Execution Order', difficulty: 'Advanced', estimatedMins: 3 },
        { gameId: 'speedrun', title: 'Async Fetch Student Data', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
  ],

  java: [
    {
      id: 'java-mod-1',
      title: 'Your First Lines of Code',
      language: 'java',
      defaultProgress: 15,
      description: 'Main method signature: public static void main(String[] args), System.out.println().',
      drills: [
        { gameId: 'speedrun', title: 'Main Method Boilerplate', difficulty: 'Beginner', estimatedMins: 3 },
        { gameId: 'bughunt', title: 'Missing Semicolon & Main Signature', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-2',
      title: 'Primitive Types & Variables',
      language: 'java',
      defaultProgress: 0,
      description: 'int, double, boolean, char, casting, and integer division truncation.',
      drills: [
        { gameId: 'predictor', title: 'Integer Division Truncation', difficulty: 'Intermediate', estimatedMins: 2 },
        { gameId: 'speedrun', title: 'Typed Variable Declarations', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
    {
      id: 'java-mod-3',
      title: 'Strings & Value Equality',
      language: 'java',
      defaultProgress: 0,
      description: 'String pool, .equals() vs ==, and StringBuilder.',
      drills: [
        { gameId: 'bughunt', title: 'String Reference Equality (==) Bug', difficulty: 'Intermediate', estimatedMins: 3 },
        { gameId: 'shuffle', title: 'Two-Pointer Palindrome Verifier', difficulty: 'Advanced', estimatedMins: 4 },
      ],
    },
    {
      id: 'java-mod-4',
      title: 'Classes, Objects, and Constructors',
      language: 'java',
      defaultProgress: 0,
      description: 'Class instantiation, fields, constructors, and this keyword in JVM.',
      drills: [
        { gameId: 'speedrun', title: 'Instantiate Student Object', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
    {
      id: 'java-mod-5',
      title: 'Inheritance, Polymorphism & Interfaces',
      language: 'java',
      defaultProgress: 0,
      description: 'implements, extends, @Override, abstract classes, and polymorphism.',
      drills: [
        { gameId: 'speedrun', title: 'Implement Interface Method', difficulty: 'Intermediate', estimatedMins: 3 },
      ],
    },
  ],

  typescript: [
    {
      id: 'ts-mod-1',
      title: 'TypeScript Foundations & Interfaces',
      language: 'typescript',
      defaultProgress: 0,
      description: 'Interfaces, type aliases, generics, and strict null checks.',
      drills: [
        { gameId: 'speedrun', title: 'Typed Student Record', difficulty: 'Beginner', estimatedMins: 2 },
      ],
    },
  ],

  sql: [
    {
      id: 'sql-mod-1',
      title: 'Database Queries & Filtering',
      language: 'sql',
      defaultProgress: 0,
      description: 'SELECT, WHERE, ORDER BY, LIMIT, JOIN, and GROUP BY.',
      drills: [
        { gameId: 'speedrun', title: 'Top Performing Students Query', difficulty: 'Beginner', estimatedMins: 2 },
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
    ]
  }
  return LANGUAGE_GAME_MODULES[lang] || LANGUAGE_GAME_MODULES.python
}
