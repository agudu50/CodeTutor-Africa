import {
  SpeedrunSnippet,
  BugHuntChallenge,
  OutputPredictorChallenge,
  CodeShuffleChallenge,
} from '../types/games.types'

export const CURRICULUM_SPEEDRUN_SNIPPETS: SpeedrunSnippet[] = [
  {
    "id": "speedrun-python-m1-mtczc3by-p2sm",
    "courseId": "course-python-1",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "python",
    "title": "Hello World & Print Formatting",
    "description": "Curriculum drill for Module 1: Your First Lines of Code. Practice typing clean, idiomatic python code.",
    "code": "print(\"Hello, World!\")\nname = \"Developer\"\nprint(f\"Welcome to CodeTutor Africa, {name}!\")",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m2-mtczc3by-y5ym",
    "courseId": "course-python-2",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 2: Storing Data with Variables",
    "language": "python",
    "title": "Variable Assignment & Reassignment",
    "description": "Curriculum drill for Module 2: Storing Data with Variables. Practice typing clean, idiomatic python code.",
    "code": "student_name = \"Amara\"\nscore = 92\nscore += 5\nprint(f\"{student_name} scored {score}\")",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m3-mtczc3bz-bskm",
    "courseId": "course-python-3",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 3: Data Types: Strings, Numbers, and Booleans",
    "language": "python",
    "title": "Type Conversion Speed Drill",
    "description": "Curriculum drill for Module 3: Data Types: Strings, Numbers, and Booleans. Practice typing clean, idiomatic python code.",
    "code": "age_str = \"18\"\nage = int(age_str)\nis_adult = age >= 18\nprint(f\"Adult: {is_adult}\")",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m4-mtczc3bz-434l",
    "courseId": "course-python-4",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 4: Arithmetic Operations",
    "language": "python",
    "title": "Math Expressions Blitz",
    "description": "Curriculum drill for Module 4: Arithmetic Operations. Practice typing clean, idiomatic python code.",
    "code": "base = 10\nheight = 5\narea = (base * height) // 2\nremainder = base % 3\nprint(area, remainder)",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m5-mtczc3bz-0qdp",
    "courseId": "course-python-5",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 5: Working with Strings",
    "language": "python",
    "title": "F-string Template Formatting",
    "description": "Curriculum drill for Module 5: Working with Strings. Practice typing clean, idiomatic python code.",
    "code": "greeting = \"hello world\"\nclean_name = greeting.strip().title()\nformatted = f\"Message: {clean_name}\"\nprint(formatted)",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m7-mtczc3bz-gign",
    "courseId": "course-python-7",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 7: Making Decisions with if Statements",
    "language": "python",
    "title": "Multi-branch if-elif-else",
    "description": "Curriculum drill for Module 7: Making Decisions with if Statements. Practice typing clean, idiomatic python code.",
    "code": "score = 85\nif score >= 90:\n    grade = \"A\"\nelif score >= 80:\n    grade = \"B\"\nelse:\n    grade = \"C\"",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m9-mtczc3bz-ha2j",
    "courseId": "course-python-9",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 9: Repeating with while Loops",
    "language": "python",
    "title": "Countdown Accumulator Drill",
    "description": "Curriculum drill for Module 9: Repeating with while Loops. Practice typing clean, idiomatic python code.",
    "code": "counter = 5\nwhile counter > 0:\n    print(f\"T-minus {counter}\")\n    counter -= 1\nprint(\"Blast off!\")",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m10-mtczc3bz-dljn",
    "courseId": "course-python-10",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 10: Introduction to Functions",
    "language": "python",
    "title": "Function Signatures & Invocation",
    "description": "Curriculum drill for Module 10: Introduction to Functions. Practice typing clean, idiomatic python code.",
    "code": "def calculate_total(price, tax_rate=0.15):\n    \"\"\"Compute grand total with VAT\"\"\"\n    return round(price * (1 + tax_rate), 2)",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m12-mtczc3bz-o745",
    "courseId": "course-python-12",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 12: Return Values from Functions",
    "language": "python",
    "title": "Tuple Return Unpacking",
    "description": "Curriculum drill for Module 12: Return Values from Functions. Practice typing clean, idiomatic python code.",
    "code": "def get_min_max(numbers):\n    return min(numbers), max(numbers)\n\nlow, high = get_min_max([4, 1, 9, 3])",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m13-mtczc3bz-kque",
    "courseId": "course-python-13",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 13: Creating Arrays & Lists",
    "language": "python",
    "title": "Negative Indexing Speedrun",
    "description": "Curriculum drill for Module 13: Creating Arrays & Lists. Practice typing clean, idiomatic python code.",
    "code": "languages = [\"Python\", \"JavaScript\", \"Java\", \"SQL\"]\nfirst = languages[0]\nlast = languages[-1]\nprint(first, last)",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m14-mtczc3bz-w497",
    "courseId": "course-python-14",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 14: Array Length & Basic Methods",
    "language": "python",
    "title": "Append & Pop Stack Speedrun",
    "description": "Curriculum drill for Module 14: Array Length & Basic Methods. Practice typing clean, idiomatic python code.",
    "code": "stack = []\nstack.append(\"Step 1\")\nstack.append(\"Step 2\")\nfinished = stack.pop()\nprint(len(stack))",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m15-mtczc3bz-1y05",
    "courseId": "course-python-15",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 15: Looping Over Arrays",
    "language": "python",
    "title": "Enumerate Index & Item Loop",
    "description": "Curriculum drill for Module 15: Looping Over Arrays. Practice typing clean, idiomatic python code.",
    "code": "students = [\"Kofi\", \"Fatima\", \"Abebe\"]\nfor idx, name in enumerate(students, start=1):\n    print(f\"#{idx}: {name}\")",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m16-mtczc3c0-dxk6",
    "courseId": "course-python-16",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 16: Creating Dictionaries (Objects)",
    "language": "python",
    "title": "Dictionary Lookup & Mutation",
    "description": "Curriculum drill for Module 16: Creating Dictionaries (Objects). Practice typing clean, idiomatic python code.",
    "code": "profile = {\"id\": 101, \"name\": \"Zainab\", \"points\": 450}\nprofile[\"points\"] += 50\nprint(profile.get(\"name\"))",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-python-m17-mtczc3c0-cl0i",
    "courseId": "course-python-17",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 17: Working with Objects & Classes",
    "language": "python",
    "title": "OOP Class Constructor",
    "description": "Curriculum drill for Module 17: Working with Objects & Classes. Practice typing clean, idiomatic python code.",
    "code": "class Student:\n    def __init__(self, name, track):\n        self.name = name\n        self.track = track\n        self.xp = 0",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-javascript-m1-mtczc3c0-0utn",
    "courseId": "course-javascript-1",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "javascript",
    "title": "Console Output & Interpolation",
    "description": "Curriculum drill for Module 1: Your First Lines of Code. Practice typing clean, idiomatic javascript code.",
    "code": "console.log(\"Hello, World!\");\nconst user = \"Africa\";\nconsole.log(`Welcome to CodeTutor, ${user}!`);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m2-mtczc3c0-lbk4",
    "courseId": "course-javascript-2",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 2: Storing Data with Variables",
    "language": "javascript",
    "title": "Const & Let Declarations",
    "description": "Curriculum drill for Module 2: Storing Data with Variables. Practice typing clean, idiomatic javascript code.",
    "code": "let activeScore = 80;\nconst MAX_SCORE = 100;\nactiveScore += 10;\nconsole.log(activeScore, MAX_SCORE);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m3-mtczc3c0-qov5",
    "courseId": "course-javascript-3",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 3: Data Types: Strings, Numbers, and Booleans",
    "language": "javascript",
    "title": "Template Literals Syntax",
    "description": "Curriculum drill for Module 3: Data Types: Strings, Numbers, and Booleans. Practice typing clean, idiomatic javascript code.",
    "code": "const count = \"42\";\nconst num = Number(count);\nconst isReady = Boolean(num);\nconsole.log(typeof num, isReady);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m4-mtczc3c0-4bd6",
    "courseId": "course-javascript-4",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 4: Arithmetic & Operators",
    "language": "javascript",
    "title": "Math.floor & Random Formulas",
    "description": "Curriculum drill for Module 4: Arithmetic & Operators. Practice typing clean, idiomatic javascript code.",
    "code": "const radius = 5;\nconst area = Math.PI * Math.pow(radius, 2);\nconst rounded = Math.round(area);\nconsole.log(rounded);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m5-mtczc3c0-fbxm",
    "courseId": "course-javascript-5",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 5: Working with Strings",
    "language": "javascript",
    "title": "String Method Chain",
    "description": "Curriculum drill for Module 5: Working with Strings. Practice typing clean, idiomatic javascript code.",
    "code": "const rawInput = \"  learn code  \";\nconst cleaned = rawInput.trim().toUpperCase();\nconsole.log(cleaned.includes(\"CODE\"));",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m7-mtczc3c1-gdjf",
    "courseId": "course-javascript-7",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 7: Making Decisions with if Statements",
    "language": "javascript",
    "title": "Ternary & Guard Clauses",
    "description": "Curriculum drill for Module 7: Making Decisions with if Statements. Practice typing clean, idiomatic javascript code.",
    "code": "const mark = 88;\nconst grade = mark >= 90 ? \"A\" : mark >= 80 ? \"B\" : \"C\";\nconsole.log(`Grade: ${grade}`);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m9-mtczc3c1-448u",
    "courseId": "course-javascript-9",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 9: Repeating with Loops",
    "language": "javascript",
    "title": "For...of Iterable Speedrun",
    "description": "Curriculum drill for Module 9: Repeating with Loops. Practice typing clean, idiomatic javascript code.",
    "code": "const items = [\"Speedrun\", \"Bug Hunt\", \"Predictor\"];\nfor (const item of items) {\n  console.log(`Mode: ${item}`);\n}",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m10-mtczc3c1-dzck",
    "courseId": "course-javascript-10",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 10: Introduction to Functions & Arrows",
    "language": "javascript",
    "title": "Arrow Function Expression",
    "description": "Curriculum drill for Module 10: Introduction to Functions & Arrows. Practice typing clean, idiomatic javascript code.",
    "code": "const greet = (name) => `Hello, ${name}!`;\nconst add = (a, b) => a + b;\nconsole.log(greet(\"Developer\"), add(5, 7));",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m11-mtczc3c1-3rjn",
    "courseId": "course-javascript-11",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 11: Creating & Manipulating Arrays",
    "language": "javascript",
    "title": "Array Map & Filter Pipeline",
    "description": "Curriculum drill for Module 11: Creating & Manipulating Arrays. Practice typing clean, idiomatic javascript code.",
    "code": "function createUser(name, role = \"student\", ...skills) {\n  return { name, role, skills };\n}",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-javascript-m12-mtczc3c1-e080",
    "courseId": "course-javascript-12",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 12: Objects, Keys & Destructuring",
    "language": "javascript",
    "title": "Destructure Nested User Object",
    "description": "Curriculum drill for Module 12: Objects, Keys & Destructuring. Practice typing clean, idiomatic javascript code.",
    "code": "const getCoordinates = () => ({ x: 10, y: 25 });\nconst { x, y } = getCoordinates();\nconsole.log(x, y);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m13-mtczc3c1-7igz",
    "courseId": "course-javascript-13",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 13: ES6 Classes & Prototypes",
    "language": "javascript",
    "title": "Class Constructor & Method",
    "description": "Curriculum drill for Module 13: ES6 Classes & Prototypes. Practice typing clean, idiomatic javascript code.",
    "code": "const scores = [88, 92, 79, 95];\nconst [first, ...rest] = scores;\nconsole.log(first, rest.length);",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-javascript-m14-mtczc3c1-oews",
    "courseId": "course-javascript-14",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 14: Async JavaScript & Promises",
    "language": "javascript",
    "title": "Async Fetch Student Data",
    "description": "Curriculum drill for Module 14: Async JavaScript & Promises. Practice typing clean, idiomatic javascript code.",
    "code": "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst evens = doubled.filter(n => n % 4 === 0);",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-javascript-m15-mtczc3c1-ms97",
    "courseId": "course-javascript-15",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 15: Error Handling with try / catch",
    "language": "javascript",
    "title": "Try Catch Finally Block",
    "description": "Curriculum drill for Module 15: Error Handling with try / catch. Practice typing clean, idiomatic javascript code.",
    "code": "const learners = [{ name: \"Ayo\", xp: 120 }, { name: \"Chidi\", xp: 300 }];\nconst totalXp = learners.reduce((sum, l) => sum + l.xp, 0);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-javascript-m16-mtczc3c1-g6s8",
    "courseId": "course-javascript-16",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 16: JavaScript Modules & Imports",
    "language": "javascript",
    "title": "Named vs Default Export",
    "description": "Curriculum drill for Module 16: JavaScript Modules & Imports. Practice typing clean, idiomatic javascript code.",
    "code": "const userMap = new Map();\nuserMap.set(\"u1\", { name: \"Nia\", score: 95 });\nconsole.log(userMap.get(\"u1\")?.name);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m1-mtczc3c1-1qry",
    "courseId": "course-java-1",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "java",
    "title": "Main Method Boilerplate",
    "description": "Curriculum drill for Module 1: Your First Lines of Code. Practice typing clean, idiomatic java code.",
    "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, CodeTutor Java!\");\n    }\n}",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-java-m2-mtczc3c1-7png",
    "courseId": "course-java-2",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 2: Primitive Types & Variables",
    "language": "java",
    "title": "Typed Variable Declarations",
    "description": "Curriculum drill for Module 2: Primitive Types & Variables. Practice typing clean, idiomatic java code.",
    "code": "int score = 95;\ndouble gpa = 3.85;\nchar grade = 'A';\nboolean isEnrolled = true;\nSystem.out.println(score);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m3-mtczc3c1-6v84",
    "courseId": "course-java-3",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 3: Operators & Math Expressions",
    "language": "java",
    "title": "Math Expressions in Java",
    "description": "Curriculum drill for Module 3: Operators & Math Expressions. Practice typing clean, idiomatic java code.",
    "code": "int a = 15;\nint b = 4;\nint quotient = a / b;\nint remainder = a % b;\nSystem.out.println(quotient + \" R \" + remainder);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m4-mtczc3c1-et3z",
    "courseId": "course-java-4",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 4: Strings & Value Equality",
    "language": "java",
    "title": "StringBuilder Append & Reverse",
    "description": "Curriculum drill for Module 4: Strings & Value Equality. Practice typing clean, idiomatic java code.",
    "code": "String name = \"CodeTutor\";\nString greeting = \"Hello, \" + name;\nboolean isEqual = name.equals(\"CodeTutor\");\nSystem.out.println(isEqual);",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-java-m5-mtczc3c1-9tme",
    "courseId": "course-java-5",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 5: Decision Making with if-else",
    "language": "java",
    "title": "Java Switch Statement",
    "description": "Curriculum drill for Module 5: Decision Making with if-else. Practice typing clean, idiomatic java code.",
    "code": "int score = 85;\nif (score >= 90) {\n    System.out.println(\"Grade A\");\n} else {\n    System.out.println(\"Grade B\");\n}",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m6-mtczc3c1-016y",
    "courseId": "course-java-6",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 6: Loops: while & for",
    "language": "java",
    "title": "Enhanced For-Each Loop",
    "description": "Curriculum drill for Module 6: Loops: while & for. Practice typing clean, idiomatic java code.",
    "code": "for (int i = 1; i <= 5; i++) {\n    System.out.println(\"Count: \" + i);\n}",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m7-mtczc3c1-oimc",
    "courseId": "course-java-7",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 7: Methods & Return Signatures",
    "language": "java",
    "title": "Static Utility Method Header",
    "description": "Curriculum drill for Module 7: Methods & Return Signatures. Practice typing clean, idiomatic java code.",
    "code": "public static int addNumbers(int a, int b) {\n    return a + b;\n}",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m9-mtczc3c1-vtjr",
    "courseId": "course-java-9",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 9: Fixed-Size Arrays in Java",
    "language": "java",
    "title": "Array Allocation & Traversal",
    "description": "Curriculum drill for Module 9: Fixed-Size Arrays in Java. Practice typing clean, idiomatic java code.",
    "code": "ArrayList<String> tracks = new ArrayList<>();\ntracks.add(\"Python\");\ntracks.add(\"Java\");\nSystem.out.println(tracks.size());",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m10-mtczc3c1-jo5b",
    "courseId": "course-java-10",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 10: Dynamic Lists with ArrayList",
    "language": "java",
    "title": "ArrayList Operations",
    "description": "Curriculum drill for Module 10: Dynamic Lists with ArrayList. Practice typing clean, idiomatic java code.",
    "code": "public class Student {\n    private String name;\n    public Student(String name) {\n        this.name = name;\n    }\n}",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m11-mtczc3c1-jk5t",
    "courseId": "course-java-11",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 11: Classes, Objects, and Constructors",
    "language": "java",
    "title": "Instantiate Student Object",
    "description": "Curriculum drill for Module 11: Classes, Objects, and Constructors. Practice typing clean, idiomatic java code.",
    "code": "Map<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 100);\nSystem.out.println(map.get(\"Java\"));",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-java-m12-mtczc3c1-cwbp",
    "courseId": "course-java-12",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 12: Encapsulation & Access Modifiers",
    "language": "java",
    "title": "Private Field & Getter/Setter",
    "description": "Curriculum drill for Module 12: Encapsulation & Access Modifiers. Practice typing clean, idiomatic java code.",
    "code": "Map<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 100);\nSystem.out.println(map.get(\"Java\"));",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m13-mtczc3c1-sqzy",
    "courseId": "course-java-13",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 13: Inheritance with extends",
    "language": "java",
    "title": "Subclass with Super Call",
    "description": "Curriculum drill for Module 13: Inheritance with extends. Practice typing clean, idiomatic java code.",
    "code": "Map<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 100);\nSystem.out.println(map.get(\"Java\"));",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-java-m14-mtczc3c1-y8zr",
    "courseId": "course-java-14",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 14: Polymorphism & Method Overriding",
    "language": "java",
    "title": "Implement Interface Method",
    "description": "Curriculum drill for Module 14: Polymorphism & Method Overriding. Practice typing clean, idiomatic java code.",
    "code": "Map<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 100);\nSystem.out.println(map.get(\"Java\"));",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-java-m15-mtczc3c1-ybsf",
    "courseId": "course-java-15",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 15: Interfaces & Abstract Classes",
    "language": "java",
    "title": "Declare & Implement Interface",
    "description": "Curriculum drill for Module 15: Interfaces & Abstract Classes. Practice typing clean, idiomatic java code.",
    "code": "Map<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 100);\nSystem.out.println(map.get(\"Java\"));",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-java-m16-mtczc3c1-nlxs",
    "courseId": "course-java-16",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 16: Exception Handling: try-catch-finally",
    "language": "java",
    "title": "Try-Catch Exception Handler",
    "description": "Curriculum drill for Module 16: Exception Handling: try-catch-finally. Practice typing clean, idiomatic java code.",
    "code": "Map<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 100);\nSystem.out.println(map.get(\"Java\"));",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-java-m17-mtczc3c1-huvl",
    "courseId": "course-java-17",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 17: HashMaps & Key-Value Lookups",
    "language": "java",
    "title": "HashMap Frequency Counter",
    "description": "Curriculum drill for Module 17: HashMaps & Key-Value Lookups. Practice typing clean, idiomatic java code.",
    "code": "Map<String, Integer> map = new HashMap<>();\nmap.put(\"Java\", 100);\nSystem.out.println(map.get(\"Java\"));",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-typescript-m1-mtczc3c1-1vra",
    "courseId": "course-typescript-1",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 1: TypeScript Foundations & Types",
    "language": "typescript",
    "title": "Explicit Variable Type Annotations",
    "description": "Curriculum drill for Module 1: TypeScript Foundations & Types. Practice typing clean, idiomatic typescript code.",
    "code": "const greeting: string = \"Hello, TypeScript!\";\nconst studentCount: number = 42;\nconsole.log(greeting, studentCount);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m3-mtczc3c1-dvgv",
    "courseId": "course-typescript-3",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 3: Interfaces & Object Contracts",
    "language": "typescript",
    "title": "Typed Student Record",
    "description": "Curriculum drill for Module 3: Interfaces & Object Contracts. Practice typing clean, idiomatic typescript code.",
    "code": "type Status = \"idle\" | \"loading\" | \"success\" | \"error\";\nlet currentStatus: Status = \"loading\";\ncurrentStatus = \"success\";",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m4-mtczc3c2-jpum",
    "courseId": "course-typescript-4",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 4: Type Aliases & Union Types",
    "language": "typescript",
    "title": "Union Type Parameter Declaration",
    "description": "Curriculum drill for Module 4: Type Aliases & Union Types. Practice typing clean, idiomatic typescript code.",
    "code": "function add(a: number, b: number): number {\n  return a + b;\n}\nconst sum = add(10, 20);",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m5-mtczc3c2-mzva",
    "courseId": "course-typescript-5",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 5: Literal Types & Type Narrowing",
    "language": "typescript",
    "title": "Type Guard with typeof",
    "description": "Curriculum drill for Module 5: Literal Types & Type Narrowing. Practice typing clean, idiomatic typescript code.",
    "code": "interface ApiResponse<T> {\n  status: number;\n  data: T;\n}\nconst res: ApiResponse<string[]> = { status: 200, data: [\"JS\", \"TS\"] };",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m6-mtczc3c2-xy4r",
    "courseId": "course-typescript-6",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 6: Functions with Strict Typing",
    "language": "typescript",
    "title": "Typed Arrow Function Callback",
    "description": "Curriculum drill for Module 6: Functions with Strict Typing. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m8-mtczc3c2-6vh1",
    "courseId": "course-typescript-8",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 8: Tuples & Typed Arrays",
    "language": "typescript",
    "title": "Coordinate Tuple Declaration",
    "description": "Curriculum drill for Module 8: Tuples & Typed Arrays. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m9-mtczc3c2-ggi7",
    "courseId": "course-typescript-9",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 9: Enums: Numeric & String Enums",
    "language": "typescript",
    "title": "String Enum Declaration",
    "description": "Curriculum drill for Module 9: Enums: Numeric & String Enums. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m10-mtczc3c2-08uo",
    "courseId": "course-typescript-10",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 10: Generics Fundamentals",
    "language": "typescript",
    "title": "Generic Wrapper Function",
    "description": "Curriculum drill for Module 10: Generics Fundamentals. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-typescript-m11-mtczc3c2-tsfa",
    "courseId": "course-typescript-11",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 11: Generic Interfaces & Classes",
    "language": "typescript",
    "title": "Generic Key-Value Store",
    "description": "Curriculum drill for Module 11: Generic Interfaces & Classes. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-typescript-m12-mtczc3c2-0cwh",
    "courseId": "course-typescript-12",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 12: Utility Types: Partial, Pick, Omit",
    "language": "typescript",
    "title": "Omit Sensitive Password Field",
    "description": "Curriculum drill for Module 12: Utility Types: Partial, Pick, Omit. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m13-mtczc3c2-nisq",
    "courseId": "course-typescript-13",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 13: Utility Types: Record, Exclude, Extract",
    "language": "typescript",
    "title": "Record Map of User Permissions",
    "description": "Curriculum drill for Module 13: Utility Types: Record, Exclude, Extract. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-typescript-m14-mtczc3c2-q7sv",
    "courseId": "course-typescript-14",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 14: Classes & Access Modifiers in TS",
    "language": "typescript",
    "title": "Constructor Parameter Properties",
    "description": "Curriculum drill for Module 14: Classes & Access Modifiers in TS. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-typescript-m16-mtczc3c2-lcn3",
    "courseId": "course-typescript-16",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 16: Async & Promise Typing in TypeScript",
    "language": "typescript",
    "title": "Typed Async Data Fetcher",
    "description": "Curriculum drill for Module 16: Async & Promise Typing in TypeScript. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-typescript-m17-mtczc3c2-lpjs",
    "courseId": "course-typescript-17",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 17: Type Assertions & Type Casting",
    "language": "typescript",
    "title": "Custom Type Predicate Function",
    "description": "Curriculum drill for Module 17: Type Assertions & Type Casting. Practice typing clean, idiomatic typescript code.",
    "code": "type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: \"dev\" };",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-sql-m1-mtczc3c2-ctbm",
    "courseId": "course-sql-1",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 1: Database Queries & Filtering",
    "language": "sql",
    "title": "Top Performing Students Query",
    "description": "Curriculum drill for Module 1: Database Queries & Filtering. Practice typing clean, idiomatic sql code.",
    "code": "SELECT id, name, email FROM students WHERE active = 1 ORDER BY name ASC;",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-sql-m2-mtczc3c2-gglc",
    "courseId": "course-sql-2",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 2: Aggregations: COUNT, SUM, AVG",
    "language": "sql",
    "title": "Group By Department Average",
    "description": "Curriculum drill for Module 2: Aggregations: COUNT, SUM, AVG. Practice typing clean, idiomatic sql code.",
    "code": "SELECT country, COUNT(*) as total FROM learners GROUP BY country HAVING total >= 5;",
    "timeLimitSecs": 30
  },
  {
    "id": "speedrun-sql-m3-mtczc3c2-3mia",
    "courseId": "course-sql-3",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 3: Relational JOINs & Relationships",
    "language": "sql",
    "title": "Inner Join Students with Courses",
    "description": "Curriculum drill for Module 3: Relational JOINs & Relationships. Practice typing clean, idiomatic sql code.",
    "code": "SELECT s.name, c.title, e.grade FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.id;",
    "timeLimitSecs": 45
  },
  {
    "id": "speedrun-sql-m4-mtczc3c2-u0ym",
    "courseId": "course-sql-4",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 4: Data Modification: INSERT, UPDATE, DELETE",
    "language": "sql",
    "title": "Insert New Learner Record",
    "description": "Curriculum drill for Module 4: Data Modification: INSERT, UPDATE, DELETE. Practice typing clean, idiomatic sql code.",
    "code": "SELECT name, score FROM submissions WHERE score > (SELECT AVG(score) FROM submissions);",
    "timeLimitSecs": 30
  }
];

export const CURRICULUM_BUG_HUNT_CHALLENGES: BugHuntChallenge[] = [
  {
    "id": "bughunt-python-m1-mtczc3by-08dl",
    "courseId": "course-python-1",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "python",
    "title": "Quotation & Parentheses Bugs",
    "description": "Inspect the print statements below. A string literal is missing its closing double quotation mark before the parenthesis, causing a SyntaxError. Identify the broken line and select the fix.",
    "lines": [
      "# Print message with quotation",
      "print(\"Welcome to CodeTutor Africa!)",
      "print(\"Let us begin\")"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Unterminated string literal. Missing closing double quote before parenthesis.",
    "correctOptions": [
      {
        "text": "print(\"Welcome to CodeTutor Africa!\")",
        "isCorrect": true
      },
      {
        "text": "print(Welcome to CodeTutor Africa!)",
        "isCorrect": false
      },
      {
        "text": "print \"Welcome to CodeTutor Africa!\"",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-python-m2-mtczc3bz-3pfk",
    "courseId": "course-python-2",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 2: Storing Data with Variables",
    "language": "python",
    "title": "Undefined Variable Reference Hunt",
    "description": "A variable contains a spelling typo during arithmetic addition, causing Python to raise a NameError. Find the line with the undefined identifier.",
    "lines": [
      "total_score = 100",
      "bonus = 15",
      "final_result = total_score + bonuss",
      "print(final_result)"
    ],
    "buggyLineIndex": 2,
    "bugExplanation": "NameError: typo in variable name \"bonuss\". The declared variable name is \"bonus\".",
    "correctOptions": [
      {
        "text": "final_result = total_score + bonus",
        "isCorrect": true
      },
      {
        "text": "final_result = total_score + \"bonus\"",
        "isCorrect": false
      },
      {
        "text": "final_result = total_score += bonus",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-python-m3-mtczc3bz-d30x",
    "courseId": "course-python-3",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 3: Data Types: Strings, Numbers, and Booleans",
    "language": "python",
    "title": "String Concatenation with Numbers",
    "description": "Attempting to concatenate an integer directly with a string using '+' raises a TypeError in Python. Identify the broken type conversion statement.",
    "lines": [
      "age = 20",
      "message = \"User is \" + age + \" years old\"",
      "print(message)"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: cannot concatenate str and int objects. Must convert int to str or use an f-string.",
    "correctOptions": [
      {
        "text": "message = f\"User is {age} years old\"",
        "isCorrect": true
      },
      {
        "text": "message = \"User is \" . age . \" years old\"",
        "isCorrect": false
      },
      {
        "text": "message = \"User is \" + int(age)",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-python-m5-mtczc3bz-cuw7",
    "courseId": "course-python-5",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 5: Working with Strings",
    "language": "python",
    "title": "String Immature Mutation Bug",
    "description": "Spot and squash the bug in Module 5: Working with Strings.",
    "lines": [
      "greeting = \"hello\"",
      "greeting[0] = \"H\"",
      "print(greeting)"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: 'str' object does not support item assignment because strings in Python are immutable.",
    "correctOptions": [
      {
        "text": "greeting = \"H\" + greeting[1:]",
        "isCorrect": true
      },
      {
        "text": "greeting.set(0, \"H\")",
        "isCorrect": false
      },
      {
        "text": "greeting[0].replace(\"H\")",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-python-m6-mtczc3bz-bvaj",
    "courseId": "course-python-6",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 6: Comparison Operators",
    "language": "python",
    "title": "Single Equals (=) Assignment Bug",
    "description": "Spot and squash the bug in Module 6: Comparison Operators.",
    "lines": [
      "user_input = \"python\"",
      "if user_input = \"python\":",
      "    print(\"Matched track\")"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Single \"=\" is an assignment operator. Comparisons require \"==\".",
    "correctOptions": [
      {
        "text": "if user_input == \"python\":",
        "isCorrect": true
      },
      {
        "text": "if user_input === \"python\":",
        "isCorrect": false
      },
      {
        "text": "if user_input.equals(\"python\"):",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-python-m8-mtczc3bz-qywo",
    "courseId": "course-python-8",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 8: Logical Operators",
    "language": "python",
    "title": "Inverted Logic Trap",
    "description": "Spot and squash the bug in Module 8: Logical Operators.",
    "lines": [
      "def calculate_average(scores):",
      "    total = sum(scores)",
      "    return total / len(score)",
      "print(calculate_average([80, 90]))"
    ],
    "buggyLineIndex": 2,
    "bugExplanation": "NameError: parameter name is \"scores\", but \"len(score)\" references an undefined variable.",
    "correctOptions": [
      {
        "text": "    return total / len(scores)",
        "isCorrect": true
      },
      {
        "text": "    return total / size(scores)",
        "isCorrect": false
      },
      {
        "text": "    return total // score.length",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-python-m9-mtczc3bz-qcgj",
    "courseId": "course-python-9",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 9: Repeating with while Loops",
    "language": "python",
    "title": "Infinite While Loop Trap",
    "description": "Spot and squash the bug in Module 9: Repeating with while Loops.",
    "lines": [
      "def calculate_average(scores):",
      "    total = sum(scores)",
      "    return total / len(score)",
      "print(calculate_average([80, 90]))"
    ],
    "buggyLineIndex": 2,
    "bugExplanation": "NameError: parameter name is \"scores\", but \"len(score)\" references an undefined variable.",
    "correctOptions": [
      {
        "text": "    return total / len(scores)",
        "isCorrect": true
      },
      {
        "text": "    return total / size(scores)",
        "isCorrect": false
      },
      {
        "text": "    return total // score.length",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-python-m11-mtczc3bz-viy1",
    "courseId": "course-python-11",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 11: Function Parameters and Arguments",
    "language": "python",
    "title": "Mutable Default Argument Trap",
    "description": "Spot and squash the bug in Module 11: Function Parameters and Arguments.",
    "lines": [
      "def calculate_average(scores):",
      "    total = sum(scores)",
      "    return total / len(score)",
      "print(calculate_average([80, 90]))"
    ],
    "buggyLineIndex": 2,
    "bugExplanation": "NameError: parameter name is \"scores\", but \"len(score)\" references an undefined variable.",
    "correctOptions": [
      {
        "text": "    return total / len(scores)",
        "isCorrect": true
      },
      {
        "text": "    return total / size(scores)",
        "isCorrect": false
      },
      {
        "text": "    return total // score.length",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-python-m13-mtczc3bz-utq7",
    "courseId": "course-python-13",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 13: Creating Arrays & Lists",
    "language": "python",
    "title": "IndexError Out-Of-Range Trap",
    "description": "Spot and squash the bug in Module 13: Creating Arrays & Lists.",
    "lines": [
      "def calculate_average(scores):",
      "    total = sum(scores)",
      "    return total / len(score)",
      "print(calculate_average([80, 90]))"
    ],
    "buggyLineIndex": 2,
    "bugExplanation": "NameError: parameter name is \"scores\", but \"len(score)\" references an undefined variable.",
    "correctOptions": [
      {
        "text": "    return total / len(scores)",
        "isCorrect": true
      },
      {
        "text": "    return total / size(scores)",
        "isCorrect": false
      },
      {
        "text": "    return total // score.length",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-python-m17-mtczc3c0-qbai",
    "courseId": "course-python-17",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 17: Working with Objects & Classes",
    "language": "python",
    "title": "Missing self Reference in Method",
    "description": "Spot and squash the bug in Module 17: Working with Objects & Classes.",
    "lines": [
      "def calculate_average(scores):",
      "    total = sum(scores)",
      "    return total / len(score)",
      "print(calculate_average([80, 90]))"
    ],
    "buggyLineIndex": 2,
    "bugExplanation": "NameError: parameter name is \"scores\", but \"len(score)\" references an undefined variable.",
    "correctOptions": [
      {
        "text": "    return total / len(scores)",
        "isCorrect": true
      },
      {
        "text": "    return total / size(scores)",
        "isCorrect": false
      },
      {
        "text": "    return total // score.length",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-javascript-m1-mtczc3c0-0lqu",
    "courseId": "course-javascript-1",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "javascript",
    "title": "Unmatched Parentheses Syntax Error",
    "description": "Spot and squash the bug in Module 1: Your First Lines of Code.",
    "lines": [
      "console.log(\"Welcome to JavaScript\");",
      "console.log(\"Learning to code\";",
      "console.log(\"Next step\");"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: missing closing parenthesis \")\" before the semicolon.",
    "correctOptions": [
      {
        "text": "console.log(\"Learning to code\");",
        "isCorrect": true
      },
      {
        "text": "console.log \"Learning to code\";",
        "isCorrect": false
      },
      {
        "text": "console.log(\"Learning to code\">;",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-javascript-m2-mtczc3c0-e2xn",
    "courseId": "course-javascript-2",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 2: Storing Data with Variables",
    "language": "javascript",
    "title": "Const Reassignment Error",
    "description": "Spot and squash the bug in Module 2: Storing Data with Variables.",
    "lines": [
      "const score = 85;",
      "score = 90;",
      "console.log(score);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Assignment to constant variable. Use \"let\" if reassignment is needed.",
    "correctOptions": [
      {
        "text": "let score = 85;",
        "isCorrect": true
      },
      {
        "text": "const score := 90;",
        "isCorrect": false
      },
      {
        "text": "var const score = 90;",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-javascript-m3-mtczc3c0-veq4",
    "courseId": "course-javascript-3",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 3: Data Types: Strings, Numbers, and Booleans",
    "language": "javascript",
    "title": "Typeof Null Object Bug",
    "description": "Spot and squash the bug in Module 3: Data Types: Strings, Numbers, and Booleans.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-javascript-m6-mtczc3c1-t1tk",
    "courseId": "course-javascript-6",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 6: Comparison & Equality",
    "language": "javascript",
    "title": "Loose Equality Coercion Bug",
    "description": "Spot and squash the bug in Module 6: Comparison & Equality.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-javascript-m8-mtczc3c1-flz3",
    "courseId": "course-javascript-8",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 8: Logical Operators",
    "language": "javascript",
    "title": "Optional Chaining Fallback Trap",
    "description": "Spot and squash the bug in Module 8: Logical Operators.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-javascript-m9-mtczc3c1-ttq5",
    "courseId": "course-javascript-9",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 9: Repeating with Loops",
    "language": "javascript",
    "title": "Off-By-One Array Index Bug",
    "description": "Spot and squash the bug in Module 9: Repeating with Loops.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-javascript-m11-mtczc3c1-grsi",
    "courseId": "course-javascript-11",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 11: Creating & Manipulating Arrays",
    "language": "javascript",
    "title": "Array Mutation Side Effect",
    "description": "Spot and squash the bug in Module 11: Creating & Manipulating Arrays.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-javascript-m13-mtczc3c1-dpx5",
    "courseId": "course-javascript-13",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 13: ES6 Classes & Prototypes",
    "language": "javascript",
    "title": "Super Constructor Call Missing",
    "description": "Spot and squash the bug in Module 13: ES6 Classes & Prototypes.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-javascript-m14-mtczc3c1-l2ym",
    "courseId": "course-javascript-14",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 14: Async JavaScript & Promises",
    "language": "javascript",
    "title": "Unresolved Promise Trap",
    "description": "Spot and squash the bug in Module 14: Async JavaScript & Promises.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-javascript-m15-mtczc3c1-fhl9",
    "courseId": "course-javascript-15",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 15: Error Handling with try / catch",
    "language": "javascript",
    "title": "Silent Error Swallowing Bug",
    "description": "Spot and squash the bug in Module 15: Error Handling with try / catch.",
    "lines": [
      "function getUserName(user) {",
      "  return user.profile.name;",
      "}",
      "getUserName(null);"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "TypeError: Cannot read properties of null (reading \"profile\"). Use optional chaining user?.profile?.name.",
    "correctOptions": [
      {
        "text": "  return user?.profile?.name ?? \"Guest\";",
        "isCorrect": true
      },
      {
        "text": "  return user->profile->name;",
        "isCorrect": false
      },
      {
        "text": "  return user[profile][name];",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-java-m1-mtczc3c1-bi0l",
    "courseId": "course-java-1",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "java",
    "title": "Missing Semicolon & Main Signature",
    "description": "Spot and squash the bug in Module 1: Your First Lines of Code.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-java-m2-mtczc3c1-h26c",
    "courseId": "course-java-2",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 2: Primitive Types & Variables",
    "language": "java",
    "title": "Narrowing Type Conversion Bug",
    "description": "Spot and squash the bug in Module 2: Primitive Types & Variables.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-java-m4-mtczc3c1-l26q",
    "courseId": "course-java-4",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 4: Strings & Value Equality",
    "language": "java",
    "title": "String Reference Equality (==) Bug",
    "description": "Spot and squash the bug in Module 4: Strings & Value Equality.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-java-m6-mtczc3c1-r88a",
    "courseId": "course-java-6",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 6: Loops: while & for",
    "language": "java",
    "title": "Array Index Out Of Bounds in Loop",
    "description": "Spot and squash the bug in Module 6: Loops: while & for.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-java-m10-mtczc3c1-60r2",
    "courseId": "course-java-10",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 10: Dynamic Lists with ArrayList",
    "language": "java",
    "title": "ConcurrentModificationException Trap",
    "description": "Spot and squash the bug in Module 10: Dynamic Lists with ArrayList.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-java-m12-mtczc3c1-1upl",
    "courseId": "course-java-12",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 12: Encapsulation & Access Modifiers",
    "language": "java",
    "title": "Direct Private Field Access Bug",
    "description": "Spot and squash the bug in Module 12: Encapsulation & Access Modifiers.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-java-m13-mtczc3c1-vhs2",
    "courseId": "course-java-13",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 13: Inheritance with extends",
    "language": "java",
    "title": "Missing Super Constructor Call",
    "description": "Spot and squash the bug in Module 13: Inheritance with extends.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-java-m16-mtczc3c1-hsvt",
    "courseId": "course-java-16",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 16: Exception Handling: try-catch-finally",
    "language": "java",
    "title": "Uncaught Checked Exception",
    "description": "Spot and squash the bug in Module 16: Exception Handling: try-catch-finally.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-typescript-m1-mtczc3c1-iyft",
    "courseId": "course-typescript-1",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 1: TypeScript Foundations & Types",
    "language": "typescript",
    "title": "Type Mismatch Assignment Error",
    "description": "Spot and squash the bug in Module 1: TypeScript Foundations & Types.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-typescript-m2-mtczc3c1-k2ur",
    "courseId": "course-typescript-2",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 2: Type Inference & Strict Checking",
    "language": "typescript",
    "title": "Null / Undefined Strict Check Trap",
    "description": "Spot and squash the bug in Module 2: Type Inference & Strict Checking.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-typescript-m3-mtczc3c1-ly15",
    "courseId": "course-typescript-3",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 3: Interfaces & Object Contracts",
    "language": "typescript",
    "title": "Readonly Property Mutation Bug",
    "description": "Spot and squash the bug in Module 3: Interfaces & Object Contracts.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-typescript-m6-mtczc3c2-v7vs",
    "courseId": "course-typescript-6",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 6: Functions with Strict Typing",
    "language": "typescript",
    "title": "Missing Return in Typed Function",
    "description": "Spot and squash the bug in Module 6: Functions with Strict Typing.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-typescript-m8-mtczc3c2-f6pc",
    "courseId": "course-typescript-8",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 8: Tuples & Typed Arrays",
    "language": "typescript",
    "title": "Tuple Index Overflow Error",
    "description": "Spot and squash the bug in Module 8: Tuples & Typed Arrays.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-typescript-m11-mtczc3c2-164g",
    "courseId": "course-typescript-11",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 11: Generic Interfaces & Classes",
    "language": "typescript",
    "title": "Invalid Generic Constraint Violation",
    "description": "Spot and squash the bug in Module 11: Generic Interfaces & Classes.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-typescript-m13-mtczc3c2-2grv",
    "courseId": "course-typescript-13",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 13: Utility Types: Record, Exclude, Extract",
    "language": "typescript",
    "title": "ReturnType Parameter Mistake",
    "description": "Spot and squash the bug in Module 13: Utility Types: Record, Exclude, Extract.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-typescript-m16-mtczc3c2-t9yb",
    "courseId": "course-typescript-16",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 16: Async & Promise Typing in TypeScript",
    "language": "typescript",
    "title": "Missing Promise Return Type Bug",
    "description": "Spot and squash the bug in Module 16: Async & Promise Typing in TypeScript.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 45
  },
  {
    "id": "bughunt-typescript-m17-mtczc3c2-veyd",
    "courseId": "course-typescript-17",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 17: Type Assertions & Type Casting",
    "language": "typescript",
    "title": "Dangerous Non-Null Assertion Crash",
    "description": "Spot and squash the bug in Module 17: Type Assertions & Type Casting.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-sql-m1-mtczc3c2-7o37",
    "courseId": "course-sql-1",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 1: Database Queries & Filtering",
    "language": "sql",
    "title": "Missing Quotes in SQL WHERE String",
    "description": "Spot and squash the bug in Module 1: Database Queries & Filtering.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  },
  {
    "id": "bughunt-sql-m4-mtczc3c2-hrpv",
    "courseId": "course-sql-4",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 4: Data Modification: INSERT, UPDATE, DELETE",
    "language": "sql",
    "title": "Accidental UPDATE Without WHERE Clause",
    "description": "Spot and squash the bug in Module 4: Data Modification: INSERT, UPDATE, DELETE.",
    "lines": [
      "// Check student condition",
      "if (score => 50) {",
      "    System.out.println(\"Pass\");",
      "}"
    ],
    "buggyLineIndex": 1,
    "bugExplanation": "SyntaxError: Invalid comparison operator \"=>\". The greater-than-or-equal operator is \">=\" in Java/SQL.",
    "correctOptions": [
      {
        "text": "if (score >= 50) {",
        "isCorrect": true
      },
      {
        "text": "if (score == > 50) {",
        "isCorrect": false
      },
      {
        "text": "if (score >> 50) {",
        "isCorrect": false
      }
    ],
    "timeLimitSecs": 30
  }
];

export const CURRICULUM_OUTPUT_PREDICTOR_CHALLENGES: OutputPredictorChallenge[] = [
  {
    "id": "predictor-python-m1-mtczc3by-rm4j",
    "courseId": "course-python-1",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "python",
    "title": "Print Output Sequencing",
    "code": "print(\"Code\", end=\"-\")\nprint(\"Tutor\", end=\" \")\nprint(\"Africa\")",
    "options": [
      "Code-Tutor Africa",
      "Code\\nTutor\\nAfrica",
      "Code Tutor Africa",
      "Code-Tutor-Africa"
    ],
    "correctIndex": 0,
    "explanation": "The end parameter controls what is printed at the end of the line: end=\"-\" connects Code and Tutor, end=\" \" adds space before Africa.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m3-mtczc3bz-mnpk",
    "courseId": "course-python-3",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 3: Data Types: Strings, Numbers, and Booleans",
    "language": "python",
    "title": "Type Casting & Arithmetic Evaluation",
    "code": "x = \"10\"\ny = 2\nprint(x * y)",
    "options": [
      "\"1010\"",
      "20",
      "TypeError",
      "\"20\""
    ],
    "correctIndex": 0,
    "explanation": "Multiplying a string by an integer in Python repeats the string. \"10\" * 2 results in \"1010\".",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m4-mtczc3bz-ss2t",
    "courseId": "course-python-4",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 4: Arithmetic Operations",
    "language": "python",
    "title": "Operator Precedence & Modulo",
    "code": "a = 17\nb = 5\nprint(a // b, a % b)",
    "options": [
      "3 2",
      "3.4 2",
      "3 5",
      "2 3"
    ],
    "correctIndex": 0,
    "explanation": "17 // 5 gives floor integer division 3, while 17 % 5 gives remainder 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m6-mtczc3bz-i2mt",
    "courseId": "course-python-6",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 6: Comparison Operators",
    "language": "python",
    "title": "Truthy vs Falsy Comparisons",
    "code": "print(bool(\"\"), bool(\"False\"), bool(0))",
    "options": [
      "False True False",
      "False False False",
      "True True True",
      "False True True"
    ],
    "correctIndex": 0,
    "explanation": "Empty strings and 0 are falsy in Python. Non-empty strings like \"False\" evaluate to True!",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m8-mtczc3bz-k7y3",
    "courseId": "course-python-8",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 8: Logical Operators",
    "language": "python",
    "title": "Short-Circuit Logic Predictions",
    "code": "a = True\nb = False\nprint(a or b and not a)",
    "options": [
      "True",
      "False",
      "None",
      "SyntaxError"
    ],
    "correctIndex": 0,
    "explanation": "Logical NOT and AND have higher precedence than OR. But because a is True, short-circuit evaluation immediately evaluates True.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m11-mtczc3bz-yds6",
    "courseId": "course-python-11",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 11: Function Parameters and Arguments",
    "language": "python",
    "title": "Positional vs Keyword Precedence",
    "code": "def greet(name, msg=\"Hello\"):\n    return f\"{msg}, {name}!\"\nprint(greet(\"Kofi\", msg=\"Welcome\"))",
    "options": [
      "Welcome, Kofi!",
      "Hello, Kofi!",
      "Kofi, Welcome!",
      "SyntaxError"
    ],
    "correctIndex": 0,
    "explanation": "Keyword arguments override the default parameter value for msg.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m12-mtczc3bz-8gar",
    "courseId": "course-python-12",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 12: Return Values from Functions",
    "language": "python",
    "title": "Implicit None Return Value",
    "code": "def get_data():\n    x = 10\nresult = get_data()\nprint(result)",
    "options": [
      "None",
      "10",
      "0",
      "UnboundLocalError"
    ],
    "correctIndex": 0,
    "explanation": "Functions in Python without an explicit return statement implicitly return None.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m14-mtczc3bz-ndyq",
    "courseId": "course-python-14",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 14: Array Length & Basic Methods",
    "language": "python",
    "title": "In-Place vs Returning Sort",
    "code": "nums = [1, 2, 3]\nprint([x * 2 for x in nums if x > 1])",
    "options": [
      "[4, 6]",
      "[2, 4, 6]",
      "[2, 3]",
      "[4]"
    ],
    "correctIndex": 0,
    "explanation": "List comprehension filters elements greater than 1 ([2, 3]) and multiplies each by 2 ([4, 6]).",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m16-mtczc3c0-tirj",
    "courseId": "course-python-16",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 16: Creating Dictionaries (Objects)",
    "language": "python",
    "title": "KeyError vs .get() Fallback",
    "code": "user = {\"name\": \"Fatima\"}\nprint(user.get(\"age\", 25))\nprint(\"age\" in user)",
    "options": [
      "25\\nFalse",
      "None\\nFalse",
      "25\\nTrue",
      "KeyError"
    ],
    "correctIndex": 0,
    "explanation": ".get(\"age\", 25) returns the fallback value 25 without modifying the original dictionary, so \"age\" in user remains False.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-python-m18-mtczc3c0-gvwf",
    "courseId": "course-python-18",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 18: Python Capstone & Data Processing",
    "language": "python",
    "title": "Complex Comprehension & Filter",
    "code": "nums = [1, 2, 3]\nprint([x * 2 for x in nums if x > 1])",
    "options": [
      "[4, 6]",
      "[2, 4, 6]",
      "[2, 3]",
      "[4]"
    ],
    "correctIndex": 0,
    "explanation": "List comprehension filters elements greater than 1 ([2, 3]) and multiplies each by 2 ([4, 6]).",
    "timeLimitSecs": 30
  },
  {
    "id": "predictor-javascript-m1-mtczc3c0-od35",
    "courseId": "course-javascript-1",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "javascript",
    "title": "Console Log Output Order",
    "code": "console.log(1);\nconsole.log(2);\nconsole.log(3);",
    "options": [
      "1, 2, 3 (on new lines)",
      "1 2 3 (single line)",
      "3, 2, 1",
      "NaN"
    ],
    "correctIndex": 0,
    "explanation": "console.log outputs each statement synchronously to stdout followed by a newline.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-javascript-m2-mtczc3c0-ra22",
    "courseId": "course-javascript-2",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 2: Storing Data with Variables",
    "language": "javascript",
    "title": "Block Scope Visibility Quiz",
    "code": "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
    "options": [
      "4",
      "3",
      "undefined",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": ".push() appends element 4 to the array and increases its length to 4.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-javascript-m3-mtczc3c0-7t94",
    "courseId": "course-javascript-3",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 3: Data Types: Strings, Numbers, and Booleans",
    "language": "javascript",
    "title": "Type Coercion (+ vs -)",
    "code": "console.log(\"5\" - 2, \"5\" + 2);",
    "options": [
      "3 \"52\"",
      "\"3\" \"52\"",
      "3 7",
      "NaN \"52\""
    ],
    "correctIndex": 0,
    "explanation": "Subtraction (-) coerces string \"5\" to number 5 (yielding 3), whereas addition (+) performs string concatenation (yielding \"52\").",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-javascript-m4-mtczc3c0-1kbu",
    "courseId": "course-javascript-4",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 4: Arithmetic & Operators",
    "language": "javascript",
    "title": "Implicit String Coercion",
    "code": "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
    "options": [
      "4",
      "3",
      "undefined",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": ".push() appends element 4 to the array and increases its length to 4.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-javascript-m6-mtczc3c1-r8mp",
    "courseId": "course-javascript-6",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 6: Comparison & Equality",
    "language": "javascript",
    "title": "Strict Equality Matrix",
    "code": "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
    "options": [
      "4",
      "3",
      "undefined",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": ".push() appends element 4 to the array and increases its length to 4.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-javascript-m8-mtczc3c1-n0eu",
    "courseId": "course-javascript-8",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 8: Logical Operators",
    "language": "javascript",
    "title": "Nullish Coalescing vs OR",
    "code": "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
    "options": [
      "4",
      "3",
      "undefined",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": ".push() appends element 4 to the array and increases its length to 4.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-javascript-m12-mtczc3c1-xfbe",
    "courseId": "course-javascript-12",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 12: Objects, Keys & Destructuring",
    "language": "javascript",
    "title": "Object Reference Copying Quiz",
    "code": "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
    "options": [
      "4",
      "3",
      "undefined",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": ".push() appends element 4 to the array and increases its length to 4.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-javascript-m14-mtczc3c1-enhh",
    "courseId": "course-javascript-14",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 14: Async JavaScript & Promises",
    "language": "javascript",
    "title": "Microtask Execution Order",
    "code": "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
    "options": [
      "4",
      "3",
      "undefined",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": ".push() appends element 4 to the array and increases its length to 4.",
    "timeLimitSecs": 30
  },
  {
    "id": "predictor-javascript-m17-mtczc3c1-oarh",
    "courseId": "course-javascript-17",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 17: Higher Order Functions & Closures",
    "language": "javascript",
    "title": "Closure State Retention",
    "code": "const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
    "options": [
      "4",
      "3",
      "undefined",
      "TypeError"
    ],
    "correctIndex": 0,
    "explanation": ".push() appends element 4 to the array and increases its length to 4.",
    "timeLimitSecs": 30
  },
  {
    "id": "predictor-java-m1-mtczc3c1-ror3",
    "courseId": "course-java-1",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 1: Your First Lines of Code",
    "language": "java",
    "title": "Console Print vs Println",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-java-m2-mtczc3c1-m55m",
    "courseId": "course-java-2",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 2: Primitive Types & Variables",
    "language": "java",
    "title": "Integer Division Truncation",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-java-m3-mtczc3c1-6355",
    "courseId": "course-java-3",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 3: Operators & Math Expressions",
    "language": "java",
    "title": "Post-increment vs Pre-increment",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-java-m5-mtczc3c1-y010",
    "courseId": "course-java-5",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 5: Decision Making with if-else",
    "language": "java",
    "title": "Switch Fall-Through Predictor",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-java-m7-mtczc3c1-buq1",
    "courseId": "course-java-7",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 7: Methods & Return Signatures",
    "language": "java",
    "title": "Pass-by-Value Reference Effect",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 30
  },
  {
    "id": "predictor-java-m8-mtczc3c1-wmq6",
    "courseId": "course-java-8",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 8: Method Overloading",
    "language": "java",
    "title": "Overloaded Method Resolution",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-java-m14-mtczc3c1-wtwb",
    "courseId": "course-java-14",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 14: Polymorphism & Method Overriding",
    "language": "java",
    "title": "Dynamic Method Dispatch Result",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 30
  },
  {
    "id": "predictor-java-m17-mtczc3c1-8r76",
    "courseId": "course-java-17",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 17: HashMaps & Key-Value Lookups",
    "language": "java",
    "title": "Null Key & Overwrite in Map",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m1-mtczc3c1-45jp",
    "courseId": "course-typescript-1",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 1: TypeScript Foundations & Types",
    "language": "typescript",
    "title": "Type Inference Evaluation",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m2-mtczc3c1-rrjj",
    "courseId": "course-typescript-2",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 2: Type Inference & Strict Checking",
    "language": "typescript",
    "title": "Inferred Function Return Types",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m4-mtczc3c2-3bnv",
    "courseId": "course-typescript-4",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 4: Type Aliases & Union Types",
    "language": "typescript",
    "title": "Intersection Type Member Check",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m5-mtczc3c2-k4eh",
    "courseId": "course-typescript-5",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 5: Literal Types & Type Narrowing",
    "language": "typescript",
    "title": "Control Flow Type Narrowing",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m7-mtczc3c2-547c",
    "courseId": "course-typescript-7",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 7: Function Overloading in TypeScript",
    "language": "typescript",
    "title": "Overload Signature Matching",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m9-mtczc3c2-w5s5",
    "courseId": "course-typescript-9",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 9: Enums: Numeric & String Enums",
    "language": "typescript",
    "title": "Numeric Enum Reverse Mapping",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m12-mtczc3c2-11if",
    "courseId": "course-typescript-12",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 12: Utility Types: Partial, Pick, Omit",
    "language": "typescript",
    "title": "Partial vs Required Utility Output",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-typescript-m15-mtczc3c2-a455",
    "courseId": "course-typescript-15",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 15: Discriminated Unions & Pattern Matching",
    "language": "typescript",
    "title": "Discriminated Union Exhaustiveness",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 30
  },
  {
    "id": "predictor-sql-m2-mtczc3c2-kh46",
    "courseId": "course-sql-2",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 2: Aggregations: COUNT, SUM, AVG",
    "language": "sql",
    "title": "HAVING vs WHERE Filter Outcome",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 20
  },
  {
    "id": "predictor-sql-m5-mtczc3c2-3gy0",
    "courseId": "course-sql-5",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 5: Subqueries & Nested SELECTs",
    "language": "sql",
    "title": "Subquery Evaluation Result",
    "code": "int a = 8;\nint b = 3;\nSystem.out.println(a / b);",
    "options": [
      "2",
      "2.66",
      "3",
      "CompilationError"
    ],
    "correctIndex": 0,
    "explanation": "Integer division in Java truncates any decimal fraction, resulting in 2.",
    "timeLimitSecs": 30
  }
];

export const CURRICULUM_CODE_SHUFFLE_CHALLENGES: CodeShuffleChallenge[] = [
  {
    "id": "shuffle-python-m2-mtczc3bz-6xp7",
    "courseId": "course-python-2",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 2: Storing Data with Variables",
    "language": "python",
    "title": "Swap Variables in Memory",
    "goalDescription": "Reconstruct the algorithm blocks for Swap Variables in Memory.",
    "expectedOutput": "20 10",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "temp = x",
        "indent": 0
      },
      {
        "id": "b1",
        "content": "x = 10\ny = 20",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "x = y",
        "indent": 0
      },
      {
        "id": "b4",
        "content": "y = temp",
        "indent": 0
      },
      {
        "id": "b5",
        "content": "print(x, y)",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4",
      "b5"
    ],
    "explanation": "Initialize variables -> store x in temp -> copy y into x -> restore temp into y -> print swapped values."
  },
  {
    "id": "shuffle-python-m5-mtczc3bz-jvlt",
    "courseId": "course-python-5",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 5: Working with Strings",
    "language": "python",
    "title": "Reverse String Slicing Logic",
    "goalDescription": "Reconstruct the algorithm blocks for Reverse String Slicing Logic.",
    "expectedOutput": "Total: 60",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "    total += n",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "total = 0",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "for n in [10, 20, 30]:",
        "indent": 0
      },
      {
        "id": "b4",
        "content": "print(f\"Total: {total}\")",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b3",
      "b2",
      "b4"
    ],
    "explanation": "Initialize accumulator -> loop through list -> accumulate value -> print sum."
  },
  {
    "id": "shuffle-python-m7-mtczc3bz-5nxv",
    "courseId": "course-python-7",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 7: Making Decisions with if Statements",
    "language": "python",
    "title": "Grade Classifier Block Builder",
    "goalDescription": "Reconstruct the algorithm blocks for Grade Classifier Block Builder.",
    "expectedOutput": "Result: Pass",
    "scrambledBlocks": [
      {
        "id": "b3",
        "content": "    grade = \"Pass\"",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "score = 75",
        "indent": 0
      },
      {
        "id": "b4",
        "content": "else:\n    grade = \"Fail\"",
        "indent": 0
      },
      {
        "id": "b2",
        "content": "if score >= 50:",
        "indent": 0
      },
      {
        "id": "b5",
        "content": "print(f\"Result: {grade}\")",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4",
      "b5"
    ],
    "explanation": "Declare score -> if conditional header -> indented truth branch -> else fallback -> output grade."
  },
  {
    "id": "shuffle-python-m9-mtczc3bz-hfrk",
    "courseId": "course-python-9",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 9: Repeating with while Loops",
    "language": "python",
    "title": "Two-Pointer While Loop",
    "goalDescription": "Reconstruct the algorithm blocks for Two-Pointer While Loop.",
    "expectedOutput": "3\\n2\\n1\\nGo!",
    "scrambledBlocks": [
      {
        "id": "b3",
        "content": "    print(count)",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "count = 3",
        "indent": 0
      },
      {
        "id": "b4",
        "content": "    count -= 1",
        "indent": 1
      },
      {
        "id": "b2",
        "content": "while count > 0:",
        "indent": 0
      },
      {
        "id": "b5",
        "content": "print(\"Go!\")",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4",
      "b5"
    ],
    "explanation": "Initialize counter -> while condition -> print count -> decrement counter -> print finale."
  },
  {
    "id": "shuffle-python-m10-mtczc3bz-pssl",
    "courseId": "course-python-10",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 10: Introduction to Functions",
    "language": "python",
    "title": "Assemble Helper Function",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Helper Function.",
    "expectedOutput": "Area: 20",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "    area = width * height",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "def get_area(width, height):",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "    return area",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "result = get_area(5, 4)",
        "indent": 0
      },
      {
        "id": "b5",
        "content": "print(f\"Area: {result}\")",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4",
      "b5"
    ],
    "explanation": "Function signature -> computation -> return statement -> function invocation -> output."
  },
  {
    "id": "shuffle-python-m15-mtczc3bz-bu13",
    "courseId": "course-python-15",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 15: Looping Over Arrays",
    "language": "python",
    "title": "List Comprehension Filter Assembly",
    "goalDescription": "Reconstruct the algorithm blocks for List Comprehension Filter Assembly.",
    "expectedOutput": "Total: 60",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "    total += n",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "total = 0",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "for n in [10, 20, 30]:",
        "indent": 0
      },
      {
        "id": "b4",
        "content": "print(f\"Total: {total}\")",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b3",
      "b2",
      "b4"
    ],
    "explanation": "Initialize accumulator -> loop through list -> accumulate value -> print sum."
  },
  {
    "id": "shuffle-python-m17-mtczc3c0-5r6g",
    "courseId": "course-python-17",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 17: Working with Objects & Classes",
    "language": "python",
    "title": "Assemble Student Class",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Student Class.",
    "expectedOutput": "Total: 60",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "    total += n",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "total = 0",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "for n in [10, 20, 30]:",
        "indent": 0
      },
      {
        "id": "b4",
        "content": "print(f\"Total: {total}\")",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b3",
      "b2",
      "b4"
    ],
    "explanation": "Initialize accumulator -> loop through list -> accumulate value -> print sum."
  },
  {
    "id": "shuffle-python-m18-mtczc3c0-pezh",
    "courseId": "course-python-18",
    "courseTitle": "Python Programming",
    "lessonTitle": "Module 18: Python Capstone & Data Processing",
    "language": "python",
    "title": "Assemble Full Data Pipeline",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Full Data Pipeline.",
    "expectedOutput": "Total: 60",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "    total += n",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "total = 0",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "for n in [10, 20, 30]:",
        "indent": 0
      },
      {
        "id": "b4",
        "content": "print(f\"Total: {total}\")",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b3",
      "b2",
      "b4"
    ],
    "explanation": "Initialize accumulator -> loop through list -> accumulate value -> print sum."
  },
  {
    "id": "shuffle-javascript-m5-mtczc3c0-svfi",
    "courseId": "course-javascript-5",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 5: Working with Strings",
    "language": "javascript",
    "title": "Title Case Formatter",
    "goalDescription": "Reconstruct the algorithm blocks for Title Case Formatter.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-javascript-m7-mtczc3c1-ar5t",
    "courseId": "course-javascript-7",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 7: Making Decisions with if Statements",
    "language": "javascript",
    "title": "Assemble Switch Case Dispatcher",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Switch Case Dispatcher.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-javascript-m10-mtczc3c1-x8zl",
    "courseId": "course-javascript-10",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 10: Introduction to Functions & Arrows",
    "language": "javascript",
    "title": "Callback Transform Pipeline",
    "goalDescription": "Reconstruct the algorithm blocks for Callback Transform Pipeline.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-javascript-m14-mtczc3c1-d0xf",
    "courseId": "course-javascript-14",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 14: Async JavaScript & Promises",
    "language": "javascript",
    "title": "Asynchronous API Fetch Handler",
    "goalDescription": "Reconstruct the algorithm blocks for Asynchronous API Fetch Handler.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-javascript-m17-mtczc3c1-db3m",
    "courseId": "course-javascript-17",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 17: Higher Order Functions & Closures",
    "language": "javascript",
    "title": "Assemble Counter Factory Closure",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Counter Factory Closure.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-javascript-m18-mtczc3c1-8we7",
    "courseId": "course-javascript-18",
    "courseTitle": "Modern JavaScript",
    "lessonTitle": "Module 18: Full JavaScript App Architecture",
    "language": "javascript",
    "title": "Assemble Event Emitter Store",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Event Emitter Store.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-java-m4-mtczc3c1-3o3v",
    "courseId": "course-java-4",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 4: Strings & Value Equality",
    "language": "java",
    "title": "Two-Pointer Palindrome Verifier",
    "goalDescription": "Reconstruct the algorithm blocks for Two-Pointer Palindrome Verifier.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-java-m9-mtczc3c1-d5hq",
    "courseId": "course-java-9",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 9: Fixed-Size Arrays in Java",
    "language": "java",
    "title": "Find Maximum Element in Array",
    "goalDescription": "Reconstruct the algorithm blocks for Find Maximum Element in Array.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-java-m11-mtczc3c1-iij1",
    "courseId": "course-java-11",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 11: Classes, Objects, and Constructors",
    "language": "java",
    "title": "Assemble Complete Java Class",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Complete Java Class.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-java-m15-mtczc3c1-tt7r",
    "courseId": "course-java-15",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 15: Interfaces & Abstract Classes",
    "language": "java",
    "title": "Assemble Shape Interface Hierarchy",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Shape Interface Hierarchy.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-java-m18-mtczc3c1-yvb5",
    "courseId": "course-java-18",
    "courseTitle": "Java Engineering",
    "lessonTitle": "Module 18: Java OOP Capstone",
    "language": "java",
    "title": "Assemble Student Grade Manager",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Student Grade Manager.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-typescript-m3-mtczc3c2-hetk",
    "courseId": "course-typescript-3",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 3: Interfaces & Object Contracts",
    "language": "typescript",
    "title": "Assemble User Interface Contract",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble User Interface Contract.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-typescript-m10-mtczc3c2-csfy",
    "courseId": "course-typescript-10",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 10: Generics Fundamentals",
    "language": "typescript",
    "title": "Assemble Generic API Response Handler",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Generic API Response Handler.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-typescript-m14-mtczc3c2-g2au",
    "courseId": "course-typescript-14",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 14: Classes & Access Modifiers in TS",
    "language": "typescript",
    "title": "Assemble Polymorphic Service Class",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Polymorphic Service Class.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-typescript-m15-mtczc3c2-64x8",
    "courseId": "course-typescript-15",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 15: Discriminated Unions & Pattern Matching",
    "language": "typescript",
    "title": "Assemble Reducer Action Handler",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Reducer Action Handler.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-typescript-m18-mtczc3c2-t3zn",
    "courseId": "course-typescript-18",
    "courseTitle": "TypeScript Foundations",
    "lessonTitle": "Module 18: TypeScript Enterprise Capstone",
    "language": "typescript",
    "title": "Assemble Type-Safe API Client",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Type-Safe API Client.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-sql-m3-mtczc3c2-o9xw",
    "courseId": "course-sql-3",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 3: Relational JOINs & Relationships",
    "language": "sql",
    "title": "Assemble Multi-Table Report Query",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Multi-Table Report Query.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  },
  {
    "id": "shuffle-sql-m6-mtczc3c2-kek7",
    "courseId": "course-sql-6",
    "courseTitle": "SQL & Database Systems",
    "lessonTitle": "Module 6: Database Schema & Constraints",
    "language": "sql",
    "title": "Assemble Student Table Schema",
    "goalDescription": "Reconstruct the algorithm blocks for Assemble Student Table Schema.",
    "expectedOutput": "Function Output",
    "scrambledBlocks": [
      {
        "id": "b2",
        "content": "  const result = a + b;",
        "indent": 1
      },
      {
        "id": "b1",
        "content": "function calculate(a, b) {",
        "indent": 0
      },
      {
        "id": "b3",
        "content": "  return result;",
        "indent": 1
      },
      {
        "id": "b4",
        "content": "}",
        "indent": 0
      }
    ],
    "correctOrder": [
      "b1",
      "b2",
      "b3",
      "b4"
    ],
    "explanation": "Function declaration -> calculation -> return -> close brace."
  }
];
