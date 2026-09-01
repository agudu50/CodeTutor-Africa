import { Course, Module, Lesson, TechnicalTerm, QuizQuestion } from '@/types'

export interface CourseModuleBlueprint {
  title: string
  description: string
  progress: number
  learningObjectives: string[]
  technicalTerms: TechnicalTerm[]
  lessons: {
    title: string
    description: string
    durationMinutes: number
    isCompleted: boolean
    videoUrl?: string
    quizQuestions: QuizQuestion[]
    learningObjectives: string[]
    technicalTerms: TechnicalTerm[]
    content: string
  }[]
}

const COMMON_18_MODULES: CourseModuleBlueprint[] = [
  // ─────────────────────────────────────────────────────────────
  // MODULE 1: Your First Lines of Code
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Your First Lines of Code',
    description: 'Write basic JavaScript statements and display results using console.log.',
    progress: 0,
    learningObjectives: [
      'Understand how computers follow instructions step-by-step',
      'Display messages and calculations on the screen using console.log()',
      'Learn what quotation marks and parentheses do',
      'Fix common beginner syntax mistakes easily',
    ],
    technicalTerms: [
      {
        term: 'console.log()',
        definition: 'A friendly command that tells the computer to print a message or number onto your screen.',
        example: 'console.log("Hello, Africa!");',
      },
      {
        term: 'Statement',
        definition: 'A single, complete sentence or instruction you give to the computer.',
        example: 'console.log(100);',
      },
      {
        term: 'Syntax',
        definition: 'The spelling and grammar rules of coding. Just like English needs periods and capital letters, code has its own punctuation rules.',
      },
      {
        term: 'String',
        definition: 'Plain human text wrapped inside quotation marks like "Hello".',
        example: '"Welcome to CodeTutor"',
      },
      {
        term: 'Execution Flow',
        definition: 'The order in which the computer reads your code—always from the very top line to the bottom, line by line.',
      },
    ],
    lessons: [
      {
        title: 'Printing to the Console and Syntax Basics',
        description: 'Write basic statements and display results using console output.',
        durationMinutes: 20,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        learningObjectives: [
          'Print your first message on the screen',
          'Learn why text needs quotes but numbers do not',
          'See how the computer reads code from top to bottom',
        ],
        technicalTerms: [
          {
            term: 'console.log()',
            definition: 'Tells the computer: "Show this message on the screen!"',
            example: 'console.log("Hello World");',
          },
          {
            term: 'Quotes (" ")',
            definition: 'Used to tell the computer: "This is human text, do not try to run it as a command."',
            example: '"Lagos"',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod1-1',
            type: 'mcq',
            question: 'What does `console.log()` do in simple terms?',
            options: [
              'It shuts down your computer',
              'It prints words or numbers onto your screen so you can see them',
              'It turns on your internet connection',
              'It deletes your files',
            ],
            correctAnswer: 1,
            explanation: '`console.log()` is your program\'s way of talking back to you by printing text onto the screen.',
            hint: 'Think about how a printer displays words on paper.',
          },
          {
            id: 'q-mod1-2',
            type: 'fill_in',
            question: 'Fill in the blank to print "Hello, Africa!": _____.log("Hello, Africa!");',
            codeSnippet: '_____.log("Hello, Africa!");',
            correctAnswer: 'console',
            explanation: 'The word `console` comes before `.log()` to tell the system where to display your message.',
            hint: 'Starts with the letter c.',
          },
          {
            id: 'q-mod1-3',
            type: 'code',
            question: 'Write a line of code that prints the number 100 to the screen.',
            initialCode: '// Write your code below\n',
            testCases: [{ input: '', expectedOutput: '100' }],
            correctAnswer: 'console.log(100);',
            explanation: '`console.log(100);` prints 100 directly without needing quotes.',
            hint: 'Use `console.log(100);`',
          },
        ],
        content: `# Welcome to Coding: Your First Lines of Code! 🚀

If you are brand new to programming, welcome! You do not need any math genius or special background to learn code. Coding is simply **giving clear step-by-step instructions to a computer**.

---

## 💡 The Big Picture: How Does Coding Work?
Think of a computer like a super-fast, very polite robot. It can do amazing calculations in milliseconds, but it **only does exactly what you tell it to do**.

When you write code, you are typing sentences (called **statements**) in a language the robot understands.

---

## 🗣️ Teaching the Computer to Speak: \`console.log()\`
The very first thing every programmer learns is how to make the computer display a message on the screen. In JavaScript, we use:

\`\`\`javascript
console.log("Hello, Africa!");
console.log("Welcome to CodeTutor!");
\`\`\`

### 🔍 Anatomy of this Line:
1. **\`console\`**: This is the screen/terminal where the computer shows output.
2. **\`.log()\`**: This is the action: *"write this down!"*
3. **Parentheses \`(\` and \`)\`**: Everything you want to print goes inside these brackets.
4. **Quotation marks \`" "\`**: These wrap your text so the computer knows it's human language.
5. **Semicolon \`;\`**: This acts like the period \`.\` at the end of a sentence.

---

## 📦 Text vs Numbers: What's the Difference?

### 1. Human Words (Strings) → Need Quotes!
Whenever you want to print words or sentences, you **must wrap them in quotation marks**:
\`\`\`javascript
console.log("Nairobi");
console.log('Kigali');
\`\`\`
> ⚠️ **Why?** Without quotes, the computer will get confused and think \`Nairobi\` is a secret coding command instead of a city name!

### 2. Numbers → Do NOT Need Quotes!
Computers understand numbers naturally. When you give it numbers without quotes, it can do math instantly:
\`\`\`javascript
console.log(2026);     // Prints: 2026
console.log(10 + 5);   // The computer calculates 10 + 5 and prints: 15!
console.log(100 * 2);  // Multiplies and prints: 200
\`\`\`

---

## ⏳ Execution Order: The Computer Reads Top to Bottom
Just like reading a book or a cooking recipe, the computer reads your code **from the first line to the last line**:

\`\`\`javascript
console.log("Step 1: Wake up");
console.log("Step 2: Brush teeth");
console.log("Step 3: Start coding!");
\`\`\`

When you run this code, \`Step 1\` always happens first, followed by \`Step 2\`, and then \`Step 3\`.

---

## ⚠️ Common Beginner Traps & Quick Fixes

| What went wrong? | Why it happened | How to fix it |
| :--- | :--- | :--- |
| \`Console.log("Hi");\` | Capital **C** instead of small **c**. Coding is case-sensitive! | Use lowercase: \`console.log("Hi");\` |
| \`console.log("Hello);\` | Forgot the closing quotation mark at the end. | Make sure quotes match: \`"Hello"\` |
| \`console.log(Hello);\` | Forgot quotes around the word \`Hello\`. | Add quotes: \`console.log("Hello");\` |

---

## 🎯 Quick Try It Out!
Scroll down to the **Interactive VS Code Sandbox**, type \`console.log("I am a coder!");\` and click **Run in Terminal** to watch your local CPU execute your first code!`,
      },
      {
        title: 'Comments and Code Formatting',
        description: 'Single-line, multi-line comments, and clean indentation standards.',
        durationMinutes: 15,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        learningObjectives: [
          'Leave notes in your code that the computer ignores',
          'Use single-line and multi-line comments',
        ],
        technicalTerms: [
          {
            term: 'Comment',
            definition: 'Sticky notes for humans inside your code file. The computer skips them completely.',
            example: '// This is a note',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod1-comm-1',
            type: 'mcq',
            question: 'Why do programmers write comments in their code?',
            options: [
              'To make the code run faster',
              'To leave helpful notes explaining what the code does for humans',
              'To show errors on the screen',
              'To encrypt passwords',
            ],
            correctAnswer: 1,
            explanation: 'Comments are notes left by programmers to explain their thoughts to teammates and their future selves.',
            hint: 'Helpful notes for humans.',
          },
        ],
        content: `# Comments: Leaving Sticky Notes in Your Code 📝

As your programs get bigger, you will want to leave notes explaining what you did so you don't forget when you look at it next week.

## What is a Comment?
A **comment** is a message written for human eyes only. When the computer runs your program, it **completely skips over comments**.

\`\`\`javascript
// This is a single-line comment. The computer ignores this!
console.log("This line will print!");

/*
  This is a multi-line comment.
  You can write as many paragraphs as you like here.
  Great for explaining big ideas!
*/
console.log("This line prints too!");
\`\`\`

> 💡 **Beginner Tip**: Use comments to describe *why* you wrote something, not just *what* you wrote!`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 2: Storing Data with Variables
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Storing Data with Variables',
    description: 'Understand memory allocations, variable assignments, naming conventions, and scopes.',
    progress: 0,
    learningObjectives: [
      'Learn why programs need to store information in memory',
      'Create labeled storage boxes using `let` and `const`',
      'Change the value inside a variable as your program runs',
    ],
    technicalTerms: [
      {
        term: 'Variable',
        definition: 'A labeled box in computer memory that holds a piece of information for later use.',
        example: 'let playerName = "Kofi";',
      },
      {
        term: 'let',
        definition: 'Creates a box whose contents CAN be changed later.',
        example: 'let score = 0;',
      },
      {
        term: 'const',
        definition: 'Creates a locked box whose contents CANNOT be changed once set.',
        example: 'const birthYear = 2004;',
      },
      {
        term: 'Assignment (=)',
        definition: 'The equals sign puts a value inside the labeled box.',
      },
    ],
    lessons: [
      {
        title: 'Declaring Variables and Memory Concepts',
        description: 'How variables reference values in RAM memory.',
        durationMinutes: 25,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Create your first variable',
          'Understand the difference between `let` and `const`',
        ],
        technicalTerms: [
          {
            term: 'let',
            definition: 'Use for values that will change (like score, time, battery level).',
          },
          {
            term: 'const',
            definition: 'Use for values that stay the same forever (like your name or birthday).',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod2-1',
            type: 'mcq',
            question: 'Imagine a video game where your score increases during play. Should you declare score with `let` or `const`?',
            options: [
              '`const`, because scores never change',
              '`let`, because the score value changes throughout the game',
              'Neither, games do not use variables',
              '`const`, to stop players from winning',
            ],
            correctAnswer: 1,
            explanation: '`let` allows you to update and reassign variables, which is perfect for changing values like scores.',
            hint: 'Does the score change?',
          },
          {
            id: 'q-mod2-2',
            type: 'code',
            question: 'Create a variable named `playerName` with the value "Amara" using `const`, then print it.',
            initialCode: '// Create playerName and print it\n',
            testCases: [{ input: '', expectedOutput: 'Amara' }],
            correctAnswer: 'const playerName = "Amara";\nconsole.log(playerName);',
            explanation: '`const playerName = "Amara";` stores the name, and `console.log(playerName);` displays it.',
            hint: 'Use `const playerName = "Amara";` followed by `console.log(playerName);`',
          },
        ],
        content: `# Storing Data: Variables are Labeled Boxes 📦

Imagine you have a bunch of storage boxes in your room. To remember what is inside each box, you write a label on the front:
- Box labeled **"shoes"** contains sneakers.
- Box labeled **"books"** contains novels.

In programming, these labeled boxes are called **Variables**!

---

## 🏷️ How to Create a Variable
In JavaScript, we create a box by writing:

\`\`\`javascript
let studentName = "Amina";
let studentAge = 19;
const country = "Kenya";

console.log(studentName); // Prints: Amina
console.log(studentAge);  // Prints: 19
\`\`\`

### 🔍 How to Read This Line:
- **\`let\`**: *"Hey computer, please give me a new storage box."*
- **\`studentName\`**: *"Write the label 'studentName' on the box."*
- **\`=\`**: *"Put the following value inside the box."*
- **\`"Amina"\`**: *"The value going into the box."*

---

## 🔒 \`let\` vs \`const\`: The Two Types of Boxes

| Keyword | What it means | Real-World Example |
| :--- | :--- | :--- |
| **\`let\`** | Can be changed and updated anytime | A phone battery level (starts at 100%, drops to 80%) |
| **\`const\`** | Locked box! Cannot be changed once set | Your date of birth or country of birth |

\`\`\`javascript
let points = 50;
points = 60; // Allowed! points is now 60.

const birthYear = 2004;
// birthYear = 2005; // ERROR! You cannot change a const.
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 3: Data Types
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Data Types: Strings, Numbers, and Booleans',
    description: 'Primitive types, type checking, numerical limits, and truth values.',
    progress: 0,
    learningObjectives: [
      'Understand the 3 main types of data: Text (String), Numbers, and True/False (Boolean)',
      'Learn how the computer knows which type a value is',
    ],
    technicalTerms: [
      {
        term: 'Data Type',
        definition: 'The classification of data telling the computer what kind of value it is.',
      },
      {
        term: 'String',
        definition: 'Text characters enclosed in quotes.',
        example: '"Nairobi"',
      },
      {
        term: 'Number',
        definition: 'Digits used for math and counts (can be integers or decimals).',
        example: '42 or 3.14',
      },
      {
        term: 'Boolean',
        definition: 'A simple yes/no switch: only ever `true` or `false`.',
        example: 'true',
      },
    ],
    lessons: [
      {
        title: 'Primitive Types (Numbers, Strings, Booleans)',
        description: 'Integer vs Float, text encoding, and Boolean true/false.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Identify strings, numbers, and booleans',
          'Use boolean true/false values to represent binary states',
        ],
        technicalTerms: [
          {
            term: 'Boolean',
            definition: 'Named after George Boole. Represents true or false like a light switch.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod3-1',
            type: 'mcq',
            question: 'Which of the following is a Boolean type?',
            options: ['"yes"', 'true', '100', '"false"'],
            correctAnswer: 1,
            explanation: '`true` (without quotes) is a boolean. If you put quotes around `"true"`, it becomes a text string!',
            hint: 'A boolean is raw true or false without quotes.',
          },
        ],
        content: `# Data Types: What Kind of Value is This? 🏷️

Just like a kitchen has different containers for liquids (juice), solids (rice), and seasonings (salt), programming languages have different **Data Types**.

---

## The 3 Big Types Every Beginner Must Know:

### 1. Strings (Text) 📝
Anything wrapped in quotation marks:
\`\`\`javascript
const greeting = "Good morning!";
const username = "tech_star_24";
\`\`\`

### 2. Numbers (Math) 🔢
Digits used for counting, prices, and calculations:
\`\`\`javascript
const price = 49.99;
const itemsCount = 3;
\`\`\`

### 3. Booleans (Yes / No Switches) 💡
A Boolean can ONLY be one of two values: **\`true\`** or **\`false\`**. Think of it like a light switch:
\`\`\`javascript
const isOnline = true;
const isMuted = false;
const hasGraduated = false;
\`\`\`

> 💡 **Pro Tip**: Booleans are the secret superpower behind all computer decisions! Every time an app checks if your password is correct, it uses a boolean.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 4: Arithmetic Operations
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Arithmetic Operations',
    description: 'Addition, subtraction, multiplication, division, modulo (%), and precedence rules.',
    progress: 0,
    learningObjectives: [
      'Do basic math in code: +, -, *, /',
      'Learn the Modulo operator (%) to find remainders',
      'Use shortcut operators like `+=` and `-=`',
    ],
    technicalTerms: [
      {
        term: 'Operator',
        definition: 'A symbol that tells the computer to perform a calculation (+, -, *, /).',
      },
      {
        term: 'Modulo (%)',
        definition: 'Calculates the remainder left after division. e.g. 10 % 3 = 1.',
        example: '7 % 2 // 1',
      },
    ],
    lessons: [
      {
        title: 'Basic Arithmetic and Modulo',
        description: 'Using mathematical operators and operator precedence (PEMDAS).',
        durationMinutes: 20,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Perform math operations in code',
          'Understand how modulo `%` is used to check even/odd numbers',
        ],
        technicalTerms: [
          {
            term: 'Modulo (%)',
            definition: 'Remainder calculator.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod4-1',
            type: 'fill_in',
            question: 'If you have 10 cookies and divide them among 3 friends equally, how many cookies are left over? (10 % 3)',
            codeSnippet: 'console.log(10 % 3);',
            correctAnswer: '1',
            explanation: '10 divided by 3 is 3 for each friend, with 1 cookie remainder.',
            hint: '3 + 3 + 3 = 9. 10 - 9 = ?',
          },
        ],
        content: `# Doing Math in Code ➕➖✖️➗

Computers were originally built as giant calculators, and they are blisteringly fast at math!

\`\`\`javascript
console.log(10 + 5);  // Addition: 15
console.log(20 - 8);  // Subtraction: 12
console.log(6 * 7);   // Multiplication (use *): 42
console.log(50 / 5);  // Division (use /): 10
\`\`\`

---

## 🍪 What on Earth is Modulo \`%\`?
The **Modulo** operator (\`%\`) gives you the **remainder** after dividing:
- Imagine you have **7 slices of pizza** shared equally between **2 friends**.
- Each friend gets 3 slices (6 slices total).
- **1 slice is left in the box!**
- In code: \`7 % 2\` gives \`1\`.

> 💡 **Real-World Trick**: If \`number % 2 === 0\`, the number is **EVEN**! If it gives \`1\`, it is **ODD**!`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 5: Working with Strings
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Working with Strings',
    description: 'String concatenation, template literals, indexing, slicing, and string utility methods.',
    progress: 0,
    learningObjectives: [
      'Combine text and variables smoothly using Template Literals',
      'Transform text to UPPERCASE or lowercase',
      'Find out how many letters are in a word using `.length`',
    ],
    technicalTerms: [
      {
        term: 'Template Literal',
        definition: 'Writing text inside backticks `` so you can plug variables directly inside using `${variable}`.',
        example: '`Hello, ${name}!`',
      },
      {
        term: 'length',
        definition: 'Tells you how many characters/letters are in a text string.',
      },
    ],
    lessons: [
      {
        title: 'String Interpolation and Templates',
        description: 'Embedding variables directly into formatted text.',
        durationMinutes: 25,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Use backtick strings to build dynamic sentences',
        ],
        technicalTerms: [
          {
            term: 'Backticks (``)',
            definition: 'The key above Tab on your keyboard (often next to 1).',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod5-1',
            type: 'code',
            question: 'Create a greeting "Hello, Fatima!" where name is "Fatima" using template literals.',
            initialCode: 'const name = "Fatima";\n// Print "Hello, Fatima!"\n',
            testCases: [{ input: '', expectedOutput: 'Hello, Fatima!' }],
            correctAnswer: 'const name = "Fatima";\nconsole.log(`Hello, ${name}!`);',
            explanation: '`${name}` injects the variable into the backtick string.',
            hint: 'Use `console.log(`Hello, ${name}!`);` with backticks.',
          },
        ],
        content: `# Working with Text & Template Literals ✍️

In the old days of coding, joining words and variables together was messy:
\`\`\`javascript
// The old, clunky way (+ signs):
const name = "Kofi";
console.log("Hello, " + name + "! Welcome to class.");
\`\`\`

## 🚀 The Modern Way: Template Literals (Backticks \`\`)
Instead of regular quotes, use **backticks** (the key to the left of the number 1: \`\`). This lets you inject any variable directly using **\`\${variableName}\`**:

\`\`\`javascript
const student = "Zainab";
const score = 98;

// Clean and readable!
console.log(\`Great job, \${student}! Your score is \${score}%.\`);
// Outputs: Great job, Zainab! Your score is 98%.
\`\`\`

---

## 🔤 Helpful Text Helpers
\`\`\`javascript
const city = "Accra";

console.log(city.length);        // 5 (number of letters)
console.log(city.toUpperCase()); // "ACCRA"
console.log(city.toLowerCase()); // "accra"
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 6: Comparison Operators
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Comparison Operators',
    description: 'Equality (== vs ===), inequality, greater than, less than, and identity vs value checks.',
    progress: 0,
    learningObjectives: [
      'Compare numbers using greater than (>) and less than (<)',
      'Check if two values are equal using strict equality (===)',
    ],
    technicalTerms: [
      {
        term: '=== (Strict Equals)',
        definition: 'Asks: "Are these two values identical in both value and data type?"',
        example: '5 === 5 // true',
      },
      {
        term: '!== (Not Equals)',
        definition: 'Asks: "Are these two values different?"',
        example: '5 !== 10 // true',
      },
    ],
    lessons: [
      {
        title: 'Equality and Relational Comparisons',
        description: 'Comparing operands to evaluate boolean results.',
        durationMinutes: 20,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Understand how comparisons produce true or false answers',
        ],
        technicalTerms: [
          {
            term: 'Comparison',
            definition: 'Asking the computer a question that only has a true or false answer.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod6-1',
            type: 'mcq',
            question: 'What is the answer to: 10 > 3',
            options: ['true', 'false', 'undefined', '10'],
            correctAnswer: 0,
            explanation: '10 is greater than 3, so the computer answers `true`.',
            hint: 'Is 10 bigger than 3?',
          },
        ],
        content: `# Asking Questions: Comparison Operators ⚖️

Every time you log into an app, the app asks questions:
- *Is this password correct?*
- *Is this user's age >= 18?*
- *Is the shopping cart total > 0?*

In code, we ask these questions using **Comparison Operators**:

\`\`\`javascript
console.log(10 > 5);    // Is 10 greater than 5? -> true
console.log(10 < 5);    // Is 10 less than 5? -> false
console.log(10 >= 10);  // Is 10 greater than or equal to 10? -> true
console.log(5 === 5);   // Is 5 strictly equal to 5? -> true
console.log(5 !== 9);   // Is 5 NOT equal to 9? -> true
\`\`\`

> 💡 **Pro Tip**: In JavaScript, always use **\`===\`** (three equals) to check equality. It is strict and prevents accidental bugs!`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 7: Making Decisions with if Statements
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Making Decisions with if Statements',
    description: 'Conditional branching, if / else if / else blocks, and decision tree logic.',
    progress: 0,
    learningObjectives: [
      'Make your programs smart using `if` and `else`',
      'Create multiple paths of action based on user input or state',
    ],
    technicalTerms: [
      {
        term: 'if Statement',
        definition: 'Tells the computer: "IF this is true, do action A. Otherwise do action B."',
      },
      {
        term: 'else',
        definition: 'The fallback action when the `if` condition is false.',
      },
    ],
    lessons: [
      {
        title: 'Conditional Branching with If and Else',
        description: 'Executing code blocks conditionally based on Boolean evaluations.',
        durationMinutes: 25,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Write simple if/else decisions',
        ],
        technicalTerms: [
          {
            term: 'Condition',
            definition: 'The question inside parentheses `(score >= 50)` that determines which branch runs.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod7-1',
            type: 'code',
            question: 'If `batteryLevel < 20`, print "Low Battery". Otherwise print "Battery OK".',
            initialCode: 'const batteryLevel = 15;\n// Write if/else decision\n',
            testCases: [{ input: '', expectedOutput: 'Low Battery' }],
            correctAnswer: 'const batteryLevel = 15;\nif (batteryLevel < 20) {\n  console.log("Low Battery");\n} else {\n  console.log("Battery OK");\n}',
            explanation: 'Because 15 < 20 is true, the `if` block executes and prints "Low Battery".',
            hint: 'Use `if (batteryLevel < 20) { console.log("Low Battery"); } else { console.log("Battery OK"); }`',
          },
        ],
        content: `# Making Decisions: Traffic Lights of Code 🚦

Think about driving a car to an intersection:
- **IF** the light is green → **Drive forward**.
- **ELSE IF** the light is yellow → **Slow down**.
- **ELSE** (it must be red) → **Stop**.

In programming, this is called an **if/else statement**:

\`\`\`javascript
const score = 85;

if (score >= 90) {
  console.log("Grade: A - Outstanding!");
} else if (score >= 70) {
  console.log("Grade: B - Great job!");
} else if (score >= 50) {
  console.log("Grade: C - You passed!");
} else {
  console.log("Keep practicing, you will get it next time!");
}
\`\`\`

> 🔍 **How it Works**: The computer checks conditions one by one from top to bottom. As soon as one is \`true\`, it runs that code and skips the rest!`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 8: Logical Operators
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Logical Operators',
    description: 'Combining conditional expressions with AND (&&), OR (||), and NOT (!).',
    progress: 0,
    learningObjectives: [
      'Combine multiple rules using AND (`&&`)',
      'Allow alternative options using OR (`||`)',
      'Flip conditions with NOT (`!`)',
    ],
    technicalTerms: [
      {
        term: 'AND (&&)',
        definition: 'Requires BOTH conditions to be true.',
        example: 'hasTicket && hasID',
      },
      {
        term: 'OR (||)',
        definition: 'Requires AT LEAST ONE condition to be true.',
        example: 'isStudent || hasDiscountCode',
      },
      {
        term: 'NOT (!)',
        definition: 'Inverts truth: !true is false, !false is true.',
      },
    ],
    lessons: [
      {
        title: 'Logical AND, OR, and NOT',
        description: 'Building multi-condition validation rules.',
        durationMinutes: 25,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Combine conditions for security rules and access gates',
        ],
        technicalTerms: [
          {
            term: '&& (AND)',
            definition: 'Both sides must say yes.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod8-1',
            type: 'fill_in',
            question: 'What is the result of: true && false',
            codeSnippet: 'console.log(true && false);',
            correctAnswer: 'false',
            explanation: 'With AND (`&&`), if either side is false, the whole thing becomes false.',
            hint: 'Both sides must be true.',
          },
        ],
        content: `# Combining Rules: AND (&&) and OR (||) 🤝

Real-world decisions often have more than one requirement:
- *To board a flight, you need a **Ticket** AND a **Passport**.*
- *To get a discount, you must be a **Student** OR a **Senior**.*

\`\`\`javascript
const hasTicket = true;
const hasPassport = true;

// AND (&&): Both must be true
if (hasTicket && hasPassport) {
  console.log("Welcome aboard!");
}

const isStudent = true;
const hasCoupon = false;

// OR (||): At least one must be true
if (isStudent || hasCoupon) {
  console.log("Discount applied: $10 off!");
}
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 9: Repeating with while Loops
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Repeating with while Loops',
    description: 'Condition-controlled loops, loop termination, accumulator variables, and infinite loop safeguards.',
    progress: 0,
    learningObjectives: [
      'Automate repetitive tasks without typing code over and over',
      'Understand how `while` loops run until a condition stops them',
      'Prevent runaway infinite loops',
    ],
    technicalTerms: [
      {
        term: 'Loop',
        definition: 'A code block that repeats multiple times automatically.',
      },
      {
        term: 'while Loop',
        definition: 'Keeps repeating code AS LONG AS a condition remains true.',
      },
      {
        term: 'Infinite Loop',
        definition: 'A loop that never stops because the condition never becomes false.',
      },
    ],
    lessons: [
      {
        title: 'While Loop Mechanics and Sentinel Values',
        description: 'Iterating while a condition holds true.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Create your first repeating loop',
        ],
        technicalTerms: [
          {
            term: 'Counter',
            definition: 'A variable like `let count = 1;` that tracks how many times you have looped.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod9-1',
            type: 'mcq',
            question: 'Why do we write `count++` inside a while loop?',
            options: [
              'To make the computer restart',
              'To increase the counter so the loop eventually finishes',
              'To change the text font',
              'To make the code look longer',
            ],
            correctAnswer: 1,
            explanation: '`count++` adds 1 on every lap so that `count <= 5` eventually turns false and the loop stops cleanly.',
            hint: 'To advance the counter.',
          },
        ],
        content: `# Loops: Letting the Computer Do the Boring Repetition 🔁

Imagine your teacher asks you to write *"I will practice coding"* 100 times on a chalkboard. In real life, your hand would hurt!

In programming, computers **love** repetition. You can write a loop in 3 lines:

\`\`\`javascript
let count = 1;

while (count <= 5) {
  console.log(\`Lap number \${count}\`);
  count = count + 1; // Or shorthand: count++
}
console.log("Race finished!");
\`\`\`

### 🔍 Step-by-Step Breakdown:
1. \`count\` starts at **1**. Is 1 <= 5? **Yes!** Print *"Lap number 1"*, add 1 to count (now 2).
2. Is 2 <= 5? **Yes!** Print *"Lap number 2"*, add 1 to count (now 3).
3. ...continues until \`count\` reaches **6**.
4. Is 6 <= 5? **No!** The loop terminates and prints *"Race finished!"*.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 10: Repeating with for Loops
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Repeating with for Loops',
    description: 'Count-controlled loops, index iteration, ranges, and nested loop patterns.',
    progress: 0,
    learningObjectives: [
      'Write compact counting loops using `for (let i = 0; i < n; i++)`',
      'Count upwards, downwards, or skip numbers by 2s or 5s',
    ],
    technicalTerms: [
      {
        term: 'for Loop',
        definition: 'The most popular loop in programming, packaging start, stop, and step count in a single line.',
        example: 'for (let i = 1; i <= 5; i++)',
      },
      {
        term: 'i (Index / Iterator)',
        definition: 'The standard variable name programmers use for counters.',
      },
    ],
    lessons: [
      {
        title: 'Standard For Loops and Ranges',
        description: 'Deterministic counting loops and sequence traversal.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
        learningObjectives: [
          'Read and write standard 3-part for loops',
        ],
        technicalTerms: [
          {
            term: 'i++',
            definition: 'Shorthand for adding 1 to i (i = i + 1).',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod10-1',
            type: 'code',
            question: 'Write a for loop that counts from 1 to 3 and prints each number.',
            initialCode: '// Write for loop\n',
            testCases: [{ input: '', expectedOutput: '1\n2\n3' }],
            correctAnswer: 'for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}',
            explanation: '`for (let i = 1; i <= 3; i++)` counts 1, 2, 3.',
            hint: 'Use `for (let i = 1; i <= 3; i++) { console.log(i); }`',
          },
        ],
        content: `# The Legendary \`for\` Loop: Counting Made Easy 🎯

The **for loop** is by far the most widely used loop in modern software. It packs the setup, check, and increment into one neat line:

\`\`\`javascript
// (1. Start at 1; 2. Stop at 5; 3. Step forward by 1)
for (let i = 1; i <= 5; i++) {
  console.log(\`Rocket countdown: \${i}\`);
}
\`\`\`

### 💡 Why Everyone Loves For Loops:
Everything is organized in one place! You cannot accidentally forget to increment \`i++\`, preventing infinite loops.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 11: Introduction to Functions
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Introduction to Functions',
    description: 'Defining reusable procedures, execution contexts, call stacks, and pure vs impure functions.',
    progress: 0,
    learningObjectives: [
      'Bundle reusable steps into a named function',
      'Call functions whenever you need that job done',
      'Follow the DRY principle: Don\'t Repeat Yourself',
    ],
    technicalTerms: [
      {
        term: 'Function',
        definition: 'A mini-recipe or machine that performs a specific task whenever you call its name.',
        example: 'function makeCoffee() { ... }',
      },
      {
        term: 'Call / Invoke',
        definition: 'Running a function by typing its name with parentheses `makeCoffee()`',
      },
    ],
    lessons: [
      {
        title: 'Defining and Calling Functions',
        description: 'Encapsulating repetitive tasks into named modular blocks.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
        learningObjectives: [
          'Create and trigger reusable functions',
        ],
        technicalTerms: [
          {
            term: 'Function Definition',
            definition: 'Writing the recipe blueprint.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod11-1',
            type: 'code',
            question: 'Define a function named `sayHello` that prints "Hello!" and then call it.',
            initialCode: '// Define sayHello and call it\n',
            testCases: [{ input: '', expectedOutput: 'Hello!' }],
            correctAnswer: 'function sayHello() {\n  console.log("Hello!");\n}\nsayHello();',
            explanation: 'Define with `function sayHello() { ... }` and run it with `sayHello();`.',
            hint: 'Remember to call `sayHello();` at the end.',
          },
        ],
        content: `# Functions: Mini-Machines in Your Code ☕

Think of a coffee maker:
- Inside it has complex wiring and heaters.
- But all you do is **press the "Brew" button**, and it makes coffee for you!

In code, a **Function** is your custom-built machine:

\`\`\`javascript
// 1. Build the machine (Function Definition)
function sendWelcomeEmail() {
  console.log("Subject: Welcome to CodeTutor Africa!");
  console.log("Body: We are thrilled to have you here.");
}

// 2. Press the button! (Function Call)
sendWelcomeEmail();
sendWelcomeEmail(); // You can reuse it 1,000 times!
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 12: Function Parameters and Arguments
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Function Parameters and Arguments',
    description: 'Passing data into functions, positional vs keyword arguments, and default parameters.',
    progress: 0,
    learningObjectives: [
      'Pass custom inputs into functions so they can personalize their work',
      'Learn the difference between parameters (slots) and arguments (actual values)',
    ],
    technicalTerms: [
      {
        term: 'Parameter',
        definition: 'The placeholder variable name inside the function definition.',
        example: 'function greet(personName)',
      },
      {
        term: 'Argument',
        definition: 'The real value you supply when calling the function.',
        example: 'greet("Musa")',
      },
    ],
    lessons: [
      {
        title: 'Parameters, Arguments, and Default Values',
        description: 'Configuring dynamic inputs and default fallbacks.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
        learningObjectives: [
          'Pass custom data into functions',
        ],
        technicalTerms: [
          {
            term: 'Parameter',
            definition: 'Input slot.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod12-1',
            type: 'code',
            question: 'Create a function `greet(name)` that prints "Hi <name>". Call it with "Amara".',
            initialCode: '// Define greet and call it with "Amara"\n',
            testCases: [{ input: '', expectedOutput: 'Hi Amara' }],
            correctAnswer: 'function greet(name) {\n  console.log(`Hi ${name}`);\n}\ngreet("Amara");',
            explanation: 'The argument "Amara" is passed into parameter `name`.',
            hint: 'Use `function greet(name) { console.log(`Hi ${name}`); } greet("Amara");`',
          },
        ],
        content: `# Passing Ingredients: Parameters & Arguments 🥣

A blender is useful, but it needs ingredients!
- If you put in **Mangoes**, you get Mango juice.
- If you put in **Pineapple**, you get Pineapple juice.

In functions, these inputs are called **Parameters**:

\`\`\`javascript
// 'name' is the input slot (Parameter)
function sayHelloTo(name) {
  console.log(\`Hello, \${name}! Welcome to the developer hub.\`);
}

// "Kofi" and "Fatima" are the real ingredients (Arguments)
sayHelloTo("Kofi");    // Prints: Hello, Kofi! Welcome to the developer hub.
sayHelloTo("Fatima");  // Prints: Hello, Fatima! Welcome to the developer hub.
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 13: Return Values from Functions
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Return Values from Functions',
    description: 'Returning data from functions, early exit guard clauses, and recursive call frames.',
    progress: 0,
    learningObjectives: [
      'Learn how functions calculate an answer and hand it back to you',
      'Use the `return` keyword to store results in variables',
    ],
    technicalTerms: [
      {
        term: 'return',
        definition: 'Hands the result of a function back to the code that asked for it.',
        example: 'return price * 1.16;',
      },
    ],
    lessons: [
      {
        title: 'The Return Statement and Output Flow',
        description: 'Producing output values from function invocations.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
        learningObjectives: [
          'Capture answers calculated by functions',
        ],
        technicalTerms: [
          {
            term: 'Return Value',
            definition: 'The calculated answer given back.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod13-1',
            type: 'code',
            question: 'Write a function `double(n)` that returns `n * 2`. Print double(7).',
            initialCode: '// Define double and print result\n',
            testCases: [{ input: '', expectedOutput: '14' }],
            correctAnswer: 'function double(n) {\n  return n * 2;\n}\nconsole.log(double(7));',
            explanation: '`return n * 2` calculates 14 and hands it back to console.log.',
            hint: 'Use `return n * 2;`',
          },
        ],
        content: `# Returning Answers: The \`return\` Keyword 📬

Think about asking a calculator: *"What is 25 times 4?"*
The calculator doesn't just display it—it hands you the answer **100** so you can use it in your budget.

In code, we use **\`return\`**:

\`\`\`javascript
function calculateTotal(price, quantity) {
  const total = price * quantity;
  return total; // Hands the answer back!
}

// Store the returned answer in a variable
const bill = calculateTotal(150, 3);
console.log(\`Your final bill is $\${bill}\`); // Your final bill is $450
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 14: Creating Arrays
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Creating Arrays',
    description: 'Ordered collections, array memory layout, zero-indexed access, and initialization.',
    progress: 0,
    learningObjectives: [
      'Store a whole list of items inside a single variable',
      'Access items by their position number (Index)',
      'Remember that programmers count starting at 0',
    ],
    technicalTerms: [
      {
        term: 'Array',
        definition: 'An ordered list of items enclosed in square brackets `[ ]`.',
        example: '["Apple", "Banana", "Orange"]',
      },
      {
        term: 'Zero-Indexed',
        definition: 'The first item in an array is at index 0, the second at index 1.',
        example: 'fruits[0] // "Apple"',
      },
    ],
    lessons: [
      {
        title: 'Array Initialization and Zero-Based Indexing',
        description: 'Creating lists/arrays and accessing elements by index.',
        durationMinutes: 25,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=7W4pQQ20nJg',
        learningObjectives: [
          'Create array lists and retrieve items with brackets `[0]`',
        ],
        technicalTerms: [
          {
            term: 'Square Brackets [ ]',
            definition: 'Used to create and look up array lists.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod14-1',
            type: 'fill_in',
            question: 'What is the first item (index 0) in: const cities = ["Nairobi", "Lagos", "Kigali"];',
            codeSnippet: 'const cities = ["Nairobi", "Lagos", "Kigali"];\nconsole.log(cities[0]);',
            correctAnswer: 'Nairobi',
            explanation: 'Index 0 is always the very first item in the list.',
            hint: 'The first city.',
          },
        ],
        content: `# Arrays: Numbered Shopping Lists 🛒

What if you have 50 student names? Creating 50 separate variables (\`student1\`, \`student2\`...) would be exhausting!

Instead, we put them all in an **Array** (a list inside square brackets \`[ ]\`):

\`\`\`javascript
const hubs = ["Nairobi", "Lagos", "Kigali", "Accra"];

// Looking up items by position (Index):
console.log(hubs[0]); // "Nairobi" (First item!)
console.log(hubs[1]); // "Lagos"   (Second item)
console.log(hubs[2]); // "Kigali"  (Third item)
\`\`\`

> 💡 **Why Zero-Indexed?** In computer memory, index 0 means *"zero steps from the start of the list"*.`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 15: Array Length and Basic Methods
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Array Length and Basic Methods',
    description: 'Push, pop, shift, unshift, slice, splice, and length properties.',
    progress: 0,
    learningObjectives: [
      'Find out how many items are in a list with `.length`',
      'Add new items to the end with `.push()`',
      'Remove items with `.pop()`',
    ],
    technicalTerms: [
      {
        term: 'push()',
        definition: 'Adds an item to the end of your list.',
        example: 'list.push("New Item");',
      },
      {
        term: 'pop()',
        definition: 'Removes the last item from your list.',
      },
    ],
    lessons: [
      {
        title: 'Mutating and Accessing Array Elements',
        description: 'Adding, removing, and slicing array elements.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=7W4pQQ20nJg',
        learningObjectives: [
          'Add and remove items from list arrays',
        ],
        technicalTerms: [
          {
            term: 'push',
            definition: 'Appends to end of array.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod15-1',
            type: 'code',
            question: 'Create `const items = ["Pen"]`. Push "Book" to it, and print items.length.',
            initialCode: '// Create items, push "Book", print length\n',
            testCases: [{ input: '', expectedOutput: '2' }],
            correctAnswer: 'const items = ["Pen"];\nitems.push("Book");\nconsole.log(items.length);',
            explanation: 'After pushing "Book", the array has 2 items.',
            hint: 'Use `items.push("Book");` then `console.log(items.length);`',
          },
        ],
        content: `# Managing Your Lists: Adding & Removing Items 📋

\`\`\`javascript
const shoppingList = ["Milk", "Bread"];

// 1. Add item to end
shoppingList.push("Eggs");
console.log(shoppingList); // ["Milk", "Bread", "Eggs"]

// 2. Count total items
console.log(shoppingList.length); // 3

// 3. Remove last item
shoppingList.pop();
console.log(shoppingList); // ["Milk", "Bread"]
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 16: Looping Over Arrays
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Looping Over Arrays',
    description: 'Iterating with for-of, forEach, map, filter, and accumulator reductions.',
    progress: 0,
    learningObjectives: [
      'Visit every item in a list one-by-one using `for...of`',
      'Process shopping carts, grade lists, or chat messages easily',
    ],
    technicalTerms: [
      {
        term: 'for...of',
        definition: 'A clean loop that steps through each item in an array automatically.',
        example: 'for (const item of list)',
      },
    ],
    lessons: [
      {
        title: 'Iterating Through Lists and Array Collections',
        description: 'Traversing every item in an array sequentially.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=7W4pQQ20nJg',
        learningObjectives: [
          'Loop through list items cleanly',
        ],
        technicalTerms: [
          {
            term: 'Iteration',
            definition: 'Visiting each item in order.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod16-1',
            type: 'code',
            question: 'Given `const nums = [5, 10]`, add them up into variable `total` and print `total`.',
            initialCode: 'const nums = [5, 10];\nlet total = 0;\n// Sum the numbers\n',
            testCases: [{ input: '', expectedOutput: '15' }],
            correctAnswer: 'const nums = [5, 10];\nlet total = 0;\nfor (const n of nums) {\n  total += n;\n}\nconsole.log(total);',
            explanation: '5 + 10 = 15.',
            hint: 'Use `for (const n of nums) total += n;`',
          },
        ],
        content: `# Processing Every Item in a List 🔁

Imagine you run an online store with 1,000 orders. How do you print shipping labels for each of them? You loop through the list!

\`\`\`javascript
const guests = ["Amina", "Chinedu", "Tariq", "Fatima"];

for (const guest of guests) {
  console.log(\`Sending VIP invite to: \${guest}\`);
}
\`\`\`

> 💡 **Read it out loud**: *"For each guest inside guests, do this action!"*`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 17: Creating Objects
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Creating Objects',
    description: 'Key-value data structures, dictionary/object literals, and property access.',
    progress: 0,
    learningObjectives: [
      'Represent real-world things (like a person, a car, or a phone) using Objects',
      'Look up information using Dot Notation (`person.name`)',
    ],
    technicalTerms: [
      {
        term: 'Object',
        definition: 'A digital profile or ID card storing key-value details inside curly braces `{ }`.',
        example: '{ name: "Kofi", age: 20 }',
      },
      {
        term: 'Property / Key',
        definition: 'The name of a detail on the card (like "age" or "email").',
      },
      {
        term: 'Dot Notation',
        definition: 'Accessing a property using a dot: `student.age`.',
      },
    ],
    lessons: [
      {
        title: 'Key-Value Dictionaries and Object Literals',
        description: 'Representing structured entities with keys and values.',
        durationMinutes: 30,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=X0ipw1k7ygU',
        learningObjectives: [
          'Create objects with keys and values',
        ],
        technicalTerms: [
          {
            term: 'Key-Value Pair',
            definition: 'The label (key) and the data (value) separated by a colon.',
            example: 'country: "Nigeria"',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod17-1',
            type: 'fill_in',
            question: 'What is the output of: const user = { name: "Ayo", age: 21 }; console.log(user.name);',
            codeSnippet: 'const user = { name: "Ayo", age: 21 };\nconsole.log(user.name);',
            correctAnswer: 'Ayo',
            explanation: '`user.name` retrieves the value "Ayo" stored under key "name".',
            hint: 'The user\'s name.',
          },
        ],
        content: `# Objects: Digital Identity Cards 📇

Think of an ID card in your wallet. It has labeled fields:
- **Full Name**: Musa Diallo
- **Age**: 22
- **City**: Dakar
- **Is Student**: true

In programming, we bundle these related details together in an **Object** using curly braces **\`{ }\`**:

\`\`\`javascript
const userProfile = {
  fullName: "Musa Diallo",
  age: 22,
  city: "Dakar",
  isStudent: true
};

// Accessing details with a dot (.):
console.log(userProfile.fullName); // "Musa Diallo"
console.log(userProfile.city);     // "Dakar"
\`\`\``,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 18: Working with Objects
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Working with Objects',
    description: 'Nested objects, object methods, iteration over keys, and reference mutability.',
    progress: 0,
    learningObjectives: [
      'Put functions inside objects (called Methods)',
      'Learn how apps like Spotify or Uber represent complex account systems',
    ],
    technicalTerms: [
      {
        term: 'Method',
        definition: 'A function that lives inside an object, giving the object actions it can do.',
        example: 'bankAccount.deposit(500);',
      },
      {
        term: 'this',
        definition: 'Points to the object currently running the method.',
      },
    ],
    lessons: [
      {
        title: 'Object Methods, Nesting, and Manipulation',
        description: 'Modifying properties and invoking object methods.',
        durationMinutes: 35,
        isCompleted: false,
        videoUrl: 'https://www.youtube.com/watch?v=X0ipw1k7ygU',
        learningObjectives: [
          'Create objects that have both data and actions',
        ],
        technicalTerms: [
          {
            term: 'Method',
            definition: 'An action built into an object.',
          },
        ],
        quizQuestions: [
          {
            id: 'q-mod18-1',
            type: 'code',
            question: 'Create an object `user = { name: "Amara", sayHi() { return "Hi " + this.name; } }`. Print user.sayHi().',
            initialCode: '// Define user with sayHi method and print result\n',
            testCases: [{ input: '', expectedOutput: 'Hi Amara' }],
            correctAnswer: 'const user = {\n  name: "Amara",\n  sayHi() {\n    return "Hi " + this.name;\n  }\n};\nconsole.log(user.sayHi());',
            explanation: '`this.name` accesses the name property inside the object.',
            hint: 'Use `this.name` inside `sayHi()`.',
          },
        ],
        content: `# Objects with Powers: Methods & Actions ⚡

Objects can hold more than just plain data—they can also hold **actions (Methods)** that change their own information!

\`\`\`javascript
const bankAccount = {
  owner: "Amara Okafor",
  balance: 1000,

  // An action (Method)
  deposit(amount) {
    this.balance = this.balance + amount;
    return \`Deposit success! New balance is $\${this.balance}\`;
  }
};

console.log(bankAccount.deposit(500));
// Outputs: Deposit success! New balance is $1500
\`\`\`

> 🎓 **Congratulations!** By understanding Variables, Types, Decisions, Loops, Functions, Arrays, and Objects, you now possess the core foundation of all modern software engineering!`,
      },
    ],
  },
]

function generateCourseModules(courseId: string, language: string): Module[] {
  return COMMON_18_MODULES.map((blueprint, idx) => {
    const moduleId = `mod-${courseId}-${idx + 1}`

    let moduleDesc = blueprint.description
    const objectives = blueprint.learningObjectives
    const terms = blueprint.technicalTerms

    if (idx === 0) {
      if (language === 'javascript') {
        moduleDesc = 'Write basic JavaScript statements and display results using console.log.'
      } else if (language === 'python') {
        moduleDesc = 'Write basic Python statements and display results using print().'
      } else if (language === 'java') {
        moduleDesc = 'Write basic Java statements and display results using System.out.println().'
      } else if (language === 'typescript') {
        moduleDesc = 'Write basic TypeScript statements and display results using console.log.'
      }
    }

    const lessons: Lesson[] = blueprint.lessons.map((les, lIdx) => {
      const isFirstLesson = idx === 0 && lIdx === 0

      let videoUrl = les.videoUrl || 'https://www.youtube.com/watch?v=W6NZfCO5SIk'
      if (isFirstLesson) {
        if (language === 'python') {
          videoUrl = 'https://www.youtube.com/watch?v=kqtD5dpn9C8'
        } else if (language === 'java') {
          videoUrl = 'https://www.youtube.com/watch?v=eIrMbAQSU34'
        } else if (language === 'typescript') {
          videoUrl = 'https://www.youtube.com/watch?v=BwuLxPH8IDs'
        }
      }

      return {
        id: `les-${courseId}-${idx + 1}-${lIdx + 1}`,
        courseId,
        title: les.title,
        slug: les.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: isFirstLesson && language === 'javascript'
          ? 'Write basic JavaScript statements and display results using console.log.'
          : les.description,
        durationMinutes: les.durationMinutes,
        order: lIdx + 1,
        isCompleted: false,
        videoUrl,
        quizQuestions: les.quizQuestions,
        learningObjectives: les.learningObjectives || objectives,
        technicalTerms: les.technicalTerms || terms,
        contentMarkdown: les.content,
        createdAt: '2026-01-10T00:00:00Z',
      }
    })

    return {
      id: moduleId,
      courseId,
      title: blueprint.title,
      description: moduleDesc,
      order: idx + 1,
      progressPercentage: 0,
      learningObjectives: objectives,
      technicalTerms: terms,
      lessons,
      createdAt: '2026-01-10T00:00:00Z',
    }
  })
}

export const MOCK_COURSES: Course[] = [
  // 1. JAVASCRIPT
  {
    id: 'course-js-201',
    title: 'Learn to code with JS',
    slug: 'learn-to-code-with-js',
    description: 'This course teaches fundamental programming concepts from scratch using JavaScript. Learners will build a solid foundation in variables, control flow, functions, and basic data structures, preparing them to tackle more advanced JavaScript or any other programming language.',
    category: 'Foundations',
    language: 'javascript',
    difficulty: 'beginner',
    totalLessons: 24,
    estimatedHours: 20,
    enrolledCount: 540,
    progressPercentage: 0,
    mentorId: 'usr-mentor-3',
    mentorName: 'Cheikh Ndiaye',
    instructorName: 'Cheikh Ndiaye',
    thumbnailUrl: '/images/courses/javascript_foundations.jpg',
    createdAt: '2026-01-15T00:00:00Z',
    modules: generateCourseModules('course-js-201', 'javascript'),
  },

  // 2. PYTHON
  {
    id: 'course-py-101',
    title: 'Learn to code with Python',
    slug: 'learn-to-code-with-python',
    description: 'This course teaches fundamental programming concepts from scratch using Python. Learners will build a solid foundation in variables, control flow, functions, and basic data structures, preparing them to tackle more advanced Python or any other programming language.',
    category: 'Core Programming',
    language: 'python',
    difficulty: 'beginner',
    totalLessons: 24,
    estimatedHours: 22,
    enrolledCount: 680,
    progressPercentage: 0,
    mentorId: 'usr-mentor-2',
    mentorName: 'Zainab Al-Hassan',
    instructorName: 'Zainab Al-Hassan',
    thumbnailUrl: '/images/courses/python_basics.jpg',
    createdAt: '2026-01-10T00:00:00Z',
    modules: generateCourseModules('course-py-101', 'python'),
  },

  // 3. JAVA
  {
    id: 'course-java-301',
    title: 'Learn to code with Java',
    slug: 'learn-to-code-with-java',
    description: 'This course teaches fundamental programming concepts from scratch using Java. Learners will build a solid foundation in variables, control flow, functions, object-oriented concepts, and basic data structures, preparing them for scalable software development.',
    category: 'Software Engineering',
    language: 'java',
    difficulty: 'beginner',
    totalLessons: 24,
    estimatedHours: 26,
    enrolledCount: 420,
    progressPercentage: 0,
    mentorId: 'usr-mentor-1',
    mentorName: 'Dr. Emmanuel Quaye',
    instructorName: 'Dr. Emmanuel Quaye',
    thumbnailUrl: '/images/courses/java_oop.jpg',
    createdAt: '2026-01-20T00:00:00Z',
    modules: generateCourseModules('course-java-301', 'java'),
  },

  // 4. TYPESCRIPT
  {
    id: 'course-ts-401',
    title: 'Learn to code with TypeScript',
    slug: 'learn-to-code-with-typescript',
    description: 'This course teaches fundamental programming and static typing concepts from scratch using TypeScript. Learners will build a solid foundation in typed variables, control flow, typed functions, interfaces, and data structures.',
    category: 'Type Systems',
    language: 'typescript',
    difficulty: 'beginner',
    totalLessons: 24,
    estimatedHours: 24,
    enrolledCount: 310,
    progressPercentage: 0,
    mentorId: 'usr-mentor-4',
    mentorName: 'Prof. Samuel Adebayo',
    instructorName: 'Prof. Samuel Adebayo',
    thumbnailUrl: '/images/courses/typescript_foundations.jpg',
    createdAt: '2026-01-25T00:00:00Z',
    modules: generateCourseModules('course-ts-401', 'typescript'),
  },
]
