const fs = require('fs');
const path = require('path');

const moduleDataRaw = fs.readFileSync(path.join(__dirname, '../src/features/games/data/gameModulesData.ts'), 'utf8');

function generateSnippetForDrill(drill, lang, moduleNum, moduleTitle) {
  const title = drill.title;
  const gameId = drill.gameId;
  const id = `${gameId}-${lang}-m${moduleNum}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const lessonTitle = `Module ${moduleNum}: ${moduleTitle}`;
  const courseTitle = lang === 'python' ? 'Python Programming' : lang === 'javascript' ? 'Modern JavaScript' : lang === 'java' ? 'Java Engineering' : lang === 'typescript' ? 'TypeScript Foundations' : 'SQL & Database Systems';
  const courseId = `course-${lang}-${moduleNum}`;

  if (gameId === 'speedrun') {
    let code = '';
    if (lang === 'python') {
      if (moduleNum === 1) code = 'print("Hello, World!")\nname = "Developer"\nprint(f"Welcome to CodeTutor Africa, {name}!")';
      else if (moduleNum === 2) code = 'student_name = "Amara"\nscore = 92\nscore += 5\nprint(f"{student_name} scored {score}")';
      else if (moduleNum === 3) code = 'age_str = "18"\nage = int(age_str)\nis_adult = age >= 18\nprint(f"Adult: {is_adult}")';
      else if (moduleNum === 4) code = 'base = 10\nheight = 5\narea = (base * height) // 2\nremainder = base % 3\nprint(area, remainder)';
      else if (moduleNum === 5) code = 'greeting = "hello world"\nclean_name = greeting.strip().title()\nformatted = f"Message: {clean_name}"\nprint(formatted)';
      else if (moduleNum === 6) code = 'user_role = "admin"\nis_valid = user_role == "admin"\nprint("Access granted" if is_valid else "Denied")';
      else if (moduleNum === 7) code = 'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"';
      else if (moduleNum === 8) code = 'is_logged_in = True\nhas_token = True\ncan_access = is_logged_in and has_token\nprint(can_access)';
      else if (moduleNum === 9) code = 'counter = 5\nwhile counter > 0:\n    print(f"T-minus {counter}")\n    counter -= 1\nprint("Blast off!")';
      else if (moduleNum === 10) code = 'def calculate_total(price, tax_rate=0.15):\n    """Compute grand total with VAT"""\n    return round(price * (1 + tax_rate), 2)';
      else if (moduleNum === 11) code = 'def create_user(username, email, role="learner"):\n    return {"user": username, "email": email, "role": role}';
      else if (moduleNum === 12) code = 'def get_min_max(numbers):\n    return min(numbers), max(numbers)\n\nlow, high = get_min_max([4, 1, 9, 3])';
      else if (moduleNum === 13) code = 'languages = ["Python", "JavaScript", "Java", "SQL"]\nfirst = languages[0]\nlast = languages[-1]\nprint(first, last)';
      else if (moduleNum === 14) code = 'stack = []\nstack.append("Step 1")\nstack.append("Step 2")\nfinished = stack.pop()\nprint(len(stack))';
      else if (moduleNum === 15) code = 'students = ["Kofi", "Fatima", "Abebe"]\nfor idx, name in enumerate(students, start=1):\n    print(f"#{idx}: {name}")';
      else if (moduleNum === 16) code = 'profile = {"id": 101, "name": "Zainab", "points": 450}\nprofile["points"] += 50\nprint(profile.get("name"))';
      else if (moduleNum === 17) code = 'class Student:\n    def __init__(self, name, track):\n        self.name = name\n        self.track = track\n        self.xp = 0';
      else code = 'def process_grades(data):\n    return [s["name"] for s in data if s["score"] >= 80]';
    } else if (lang === 'javascript') {
      if (moduleNum === 1) code = 'console.log("Hello, World!");\nconst user = "Africa";\nconsole.log(`Welcome to CodeTutor, ${user}!`);';
      else if (moduleNum === 2) code = 'let activeScore = 80;\nconst MAX_SCORE = 100;\nactiveScore += 10;\nconsole.log(activeScore, MAX_SCORE);';
      else if (moduleNum === 3) code = 'const count = "42";\nconst num = Number(count);\nconst isReady = Boolean(num);\nconsole.log(typeof num, isReady);';
      else if (moduleNum === 4) code = 'const radius = 5;\nconst area = Math.PI * Math.pow(radius, 2);\nconst rounded = Math.round(area);\nconsole.log(rounded);';
      else if (moduleNum === 5) code = 'const rawInput = "  learn code  ";\nconst cleaned = rawInput.trim().toUpperCase();\nconsole.log(cleaned.includes("CODE"));';
      else if (moduleNum === 6) code = 'const status = 200;\nconst isSuccess = status === 200;\nconsole.log(isSuccess ? "OK" : "Error");';
      else if (moduleNum === 7) code = 'const mark = 88;\nconst grade = mark >= 90 ? "A" : mark >= 80 ? "B" : "C";\nconsole.log(`Grade: ${grade}`);';
      else if (moduleNum === 8) code = 'const user = { name: "Kwame", settings: { theme: "dark" } };\nconst theme = user.settings?.theme ?? "light";\nconsole.log(theme);';
      else if (moduleNum === 9) code = 'const items = ["Speedrun", "Bug Hunt", "Predictor"];\nfor (const item of items) {\n  console.log(`Mode: ${item}`);\n}';
      else if (moduleNum === 10) code = 'const greet = (name) => `Hello, ${name}!`;\nconst add = (a, b) => a + b;\nconsole.log(greet("Developer"), add(5, 7));';
      else if (moduleNum === 11) code = 'function createUser(name, role = "student", ...skills) {\n  return { name, role, skills };\n}';
      else if (moduleNum === 12) code = 'const getCoordinates = () => ({ x: 10, y: 25 });\nconst { x, y } = getCoordinates();\nconsole.log(x, y);';
      else if (moduleNum === 13) code = 'const scores = [88, 92, 79, 95];\nconst [first, ...rest] = scores;\nconsole.log(first, rest.length);';
      else if (moduleNum === 14) code = 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst evens = doubled.filter(n => n % 4 === 0);';
      else if (moduleNum === 15) code = 'const learners = [{ name: "Ayo", xp: 120 }, { name: "Chidi", xp: 300 }];\nconst totalXp = learners.reduce((sum, l) => sum + l.xp, 0);';
      else if (moduleNum === 16) code = 'const userMap = new Map();\nuserMap.set("u1", { name: "Nia", score: 95 });\nconsole.log(userMap.get("u1")?.name);';
      else if (moduleNum === 17) code = 'class StudentProfile {\n  constructor(name, track) {\n    this.name = name;\n    this.track = track;\n  }\n}';
      else code = 'async function fetchLearner(id) {\n  const res = await fetch(`/api/students/${id}`);\n  return await res.json();\n}';
    } else if (lang === 'java') {
      if (moduleNum === 1) code = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeTutor Java!");\n    }\n}';
      else if (moduleNum === 2) code = 'int score = 95;\ndouble gpa = 3.85;\nchar grade = \'A\';\nboolean isEnrolled = true;\nSystem.out.println(score);';
      else if (moduleNum === 3) code = 'int a = 15;\nint b = 4;\nint quotient = a / b;\nint remainder = a % b;\nSystem.out.println(quotient + " R " + remainder);';
      else if (moduleNum === 4) code = 'String name = "CodeTutor";\nString greeting = "Hello, " + name;\nboolean isEqual = name.equals("CodeTutor");\nSystem.out.println(isEqual);';
      else if (moduleNum === 5) code = 'int score = 85;\nif (score >= 90) {\n    System.out.println("Grade A");\n} else {\n    System.out.println("Grade B");\n}';
      else if (moduleNum === 6) code = 'for (int i = 1; i <= 5; i++) {\n    System.out.println("Count: " + i);\n}';
      else if (moduleNum === 7) code = 'public static int addNumbers(int a, int b) {\n    return a + b;\n}';
      else if (moduleNum === 8) code = 'int[] scores = {90, 85, 92, 88};\nSystem.out.println("First: " + scores[0]);\nSystem.out.println("Length: " + scores.length);';
      else if (moduleNum === 9) code = 'ArrayList<String> tracks = new ArrayList<>();\ntracks.add("Python");\ntracks.add("Java");\nSystem.out.println(tracks.size());';
      else if (moduleNum === 10) code = 'public class Student {\n    private String name;\n    public Student(String name) {\n        this.name = name;\n    }\n}';
      else code = 'Map<String, Integer> map = new HashMap<>();\nmap.put("Java", 100);\nSystem.out.println(map.get("Java"));';
    } else if (lang === 'typescript') {
      if (moduleNum === 1) code = 'const greeting: string = "Hello, TypeScript!";\nconst studentCount: number = 42;\nconsole.log(greeting, studentCount);';
      else if (moduleNum === 2) code = 'interface Student {\n  id: string;\n  name: string;\n  score: number;\n}\nconst learner: Student = { id: "1", name: "Amara", score: 95 };';
      else if (moduleNum === 3) code = 'type Status = "idle" | "loading" | "success" | "error";\nlet currentStatus: Status = "loading";\ncurrentStatus = "success";';
      else if (moduleNum === 4) code = 'function add(a: number, b: number): number {\n  return a + b;\n}\nconst sum = add(10, 20);';
      else if (moduleNum === 5) code = 'interface ApiResponse<T> {\n  status: number;\n  data: T;\n}\nconst res: ApiResponse<string[]> = { status: 200, data: ["JS", "TS"] };';
      else code = 'type ReadonlyUser = Readonly<{ id: number; username: string }>;\nconst user: ReadonlyUser = { id: 1, username: "dev" };';
    } else {
      if (moduleNum === 1) code = 'SELECT id, name, email FROM students WHERE active = 1 ORDER BY name ASC;';
      else if (moduleNum === 2) code = 'SELECT country, COUNT(*) as total FROM learners GROUP BY country HAVING total >= 5;';
      else if (moduleNum === 3) code = 'SELECT s.name, c.title, e.grade FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.id;';
      else code = 'SELECT name, score FROM submissions WHERE score > (SELECT AVG(score) FROM submissions);';
    }

    return {
      id,
      courseId,
      courseTitle,
      lessonTitle,
      language: lang,
      title,
      description: `Curriculum drill for ${lessonTitle}. Practice typing clean, idiomatic ${lang} code.`,
      code,
      timeLimitSecs: (drill.estimatedMins || 2) * 15,
    };
  }

  if (gameId === 'bughunt') {
    let lines = [];
    let buggyLineIndex = 1;
    let bugExplanation = '';
    let correctOptions = [];

    if (lang === 'python') {
      if (moduleNum === 1) {
        lines = ['# Print message with quotation', 'print("Welcome to CodeTutor Africa!)', 'print("Let us begin")'];
        buggyLineIndex = 1;
        bugExplanation = 'SyntaxError: Unterminated string literal. Missing closing double quote before parenthesis.';
        correctOptions = [
          { text: 'print("Welcome to CodeTutor Africa!")', isCorrect: true },
          { text: 'print(Welcome to CodeTutor Africa!)', isCorrect: false },
          { text: 'print "Welcome to CodeTutor Africa!"', isCorrect: false },
        ];
      } else if (moduleNum === 2) {
        lines = ['total_score = 100', 'bonus = 15', 'final_result = total_score + bonuss', 'print(final_result)'];
        buggyLineIndex = 2;
        bugExplanation = 'NameError: typo in variable name "bonuss". The declared variable name is "bonus".';
        correctOptions = [
          { text: 'final_result = total_score + bonus', isCorrect: true },
          { text: 'final_result = total_score + "bonus"', isCorrect: false },
          { text: 'final_result = total_score += bonus', isCorrect: false },
        ];
      } else if (moduleNum === 3) {
        lines = ['age = 20', 'message = "User is " + age + " years old"', 'print(message)'];
        buggyLineIndex = 1;
        bugExplanation = 'TypeError: cannot concatenate str and int objects. Must convert int to str or use an f-string.';
        correctOptions = [
          { text: 'message = f"User is {age} years old"', isCorrect: true },
          { text: 'message = "User is " . age . " years old"', isCorrect: false },
          { text: 'message = "User is " + int(age)', isCorrect: false },
        ];
      } else if (moduleNum === 5) {
        lines = ['greeting = "hello"', 'greeting[0] = "H"', 'print(greeting)'];
        buggyLineIndex = 1;
        bugExplanation = 'TypeError: \'str\' object does not support item assignment because strings in Python are immutable.';
        correctOptions = [
          { text: 'greeting = "H" + greeting[1:]', isCorrect: true },
          { text: 'greeting.set(0, "H")', isCorrect: false },
          { text: 'greeting[0].replace("H")', isCorrect: false },
        ];
      } else if (moduleNum === 6) {
        lines = ['user_input = "python"', 'if user_input = "python":', '    print("Matched track")'];
        buggyLineIndex = 1;
        bugExplanation = 'SyntaxError: Single "=" is an assignment operator. Comparisons require "==".';
        correctOptions = [
          { text: 'if user_input == "python":', isCorrect: true },
          { text: 'if user_input === "python":', isCorrect: false },
          { text: 'if user_input.equals("python"):', isCorrect: false },
        ];
      } else {
        lines = ['def calculate_average(scores):', '    total = sum(scores)', '    return total / len(score)', 'print(calculate_average([80, 90]))'];
        buggyLineIndex = 2;
        bugExplanation = 'NameError: parameter name is "scores", but "len(score)" references an undefined variable.';
        correctOptions = [
          { text: '    return total / len(scores)', isCorrect: true },
          { text: '    return total / size(scores)', isCorrect: false },
          { text: '    return total // score.length', isCorrect: false },
        ];
      }
    } else if (lang === 'javascript') {
      if (moduleNum === 1) {
        lines = ['console.log("Welcome to JavaScript");', 'console.log("Learning to code";', 'console.log("Next step");'];
        buggyLineIndex = 1;
        bugExplanation = 'SyntaxError: missing closing parenthesis ")" before the semicolon.';
        correctOptions = [
          { text: 'console.log("Learning to code");', isCorrect: true },
          { text: 'console.log "Learning to code";', isCorrect: false },
          { text: 'console.log("Learning to code">;', isCorrect: false },
        ];
      } else if (moduleNum === 2) {
        lines = ['const score = 85;', 'score = 90;', 'console.log(score);'];
        buggyLineIndex = 1;
        bugExplanation = 'TypeError: Assignment to constant variable. Use "let" if reassignment is needed.';
        correctOptions = [
          { text: 'let score = 85;', isCorrect: true },
          { text: 'const score := 90;', isCorrect: false },
          { text: 'var const score = 90;', isCorrect: false },
        ];
      } else {
        lines = ['function getUserName(user) {', '  return user.profile.name;', '}', 'getUserName(null);'];
        buggyLineIndex = 1;
        bugExplanation = 'TypeError: Cannot read properties of null (reading "profile"). Use optional chaining user?.profile?.name.';
        correctOptions = [
          { text: '  return user?.profile?.name ?? "Guest";', isCorrect: true },
          { text: '  return user->profile->name;', isCorrect: false },
          { text: '  return user[profile][name];', isCorrect: false },
        ];
      }
    } else {
      lines = ['// Check student condition', 'if (score => 50) {', '    System.out.println("Pass");', '}'];
      buggyLineIndex = 1;
      bugExplanation = 'SyntaxError: Invalid comparison operator "=>". The greater-than-or-equal operator is ">=" in Java/SQL.';
      correctOptions = [
        { text: 'if (score >= 50) {', isCorrect: true },
        { text: 'if (score == > 50) {', isCorrect: false },
        { text: 'if (score >> 50) {', isCorrect: false },
      ];
    }

    return {
      id,
      courseId,
      courseTitle,
      lessonTitle,
      language: lang,
      title,
      description: `Spot and squash the bug in ${lessonTitle}.`,
      lines,
      buggyLineIndex,
      bugExplanation,
      correctOptions,
      timeLimitSecs: (drill.estimatedMins || 2) * 15,
    };
  }

  if (gameId === 'predictor') {
    let code = '';
    let options = [];
    let correctIndex = 0;
    let explanation = '';

    if (lang === 'python') {
      if (moduleNum === 1) {
        code = 'print("Code", end="-")\nprint("Tutor", end=" ")\nprint("Africa")';
        options = ['Code-Tutor Africa', 'Code\\nTutor\\nAfrica', 'Code Tutor Africa', 'Code-Tutor-Africa'];
        correctIndex = 0;
        explanation = 'The end parameter controls what is printed at the end of the line: end="-" connects Code and Tutor, end=" " adds space before Africa.';
      } else if (moduleNum === 3) {
        code = 'x = "10"\ny = 2\nprint(x * y)';
        options = ['"1010"', '20', 'TypeError', '"20"'];
        correctIndex = 0;
        explanation = 'Multiplying a string by an integer in Python repeats the string. "10" * 2 results in "1010".';
      } else if (moduleNum === 4) {
        code = 'a = 17\nb = 5\nprint(a // b, a % b)';
        options = ['3 2', '3.4 2', '3 5', '2 3'];
        correctIndex = 0;
        explanation = '17 // 5 gives floor integer division 3, while 17 % 5 gives remainder 2.';
      } else if (moduleNum === 6) {
        code = 'print(bool(""), bool("False"), bool(0))';
        options = ['False True False', 'False False False', 'True True True', 'False True True'];
        correctIndex = 0;
        explanation = 'Empty strings and 0 are falsy in Python. Non-empty strings like "False" evaluate to True!';
      } else if (moduleNum === 8) {
        code = 'a = True\nb = False\nprint(a or b and not a)';
        options = ['True', 'False', 'None', 'SyntaxError'];
        correctIndex = 0;
        explanation = 'Logical NOT and AND have higher precedence than OR. But because a is True, short-circuit evaluation immediately evaluates True.';
      } else if (moduleNum === 11) {
        code = 'def greet(name, msg="Hello"):\n    return f"{msg}, {name}!"\nprint(greet("Kofi", msg="Welcome"))';
        options = ['Welcome, Kofi!', 'Hello, Kofi!', 'Kofi, Welcome!', 'SyntaxError'];
        correctIndex = 0;
        explanation = 'Keyword arguments override the default parameter value for msg.';
      } else if (moduleNum === 12) {
        code = 'def get_data():\n    x = 10\nresult = get_data()\nprint(result)';
        options = ['None', '10', '0', 'UnboundLocalError'];
        correctIndex = 0;
        explanation = 'Functions in Python without an explicit return statement implicitly return None.';
      } else if (moduleNum === 16) {
        code = 'user = {"name": "Fatima"}\nprint(user.get("age", 25))\nprint("age" in user)';
        options = ['25\\nFalse', 'None\\nFalse', '25\\nTrue', 'KeyError'];
        correctIndex = 0;
        explanation = '.get("age", 25) returns the fallback value 25 without modifying the original dictionary, so "age" in user remains False.';
      } else {
        code = 'nums = [1, 2, 3]\nprint([x * 2 for x in nums if x > 1])';
        options = ['[4, 6]', '[2, 4, 6]', '[2, 3]', '[4]'];
        correctIndex = 0;
        explanation = 'List comprehension filters elements greater than 1 ([2, 3]) and multiplies each by 2 ([4, 6]).';
      }
    } else if (lang === 'javascript') {
      if (moduleNum === 1) {
        code = 'console.log(1);\nconsole.log(2);\nconsole.log(3);';
        options = ['1, 2, 3 (on new lines)', '1 2 3 (single line)', '3, 2, 1', 'NaN'];
        correctIndex = 0;
        explanation = 'console.log outputs each statement synchronously to stdout followed by a newline.';
      } else if (moduleNum === 3) {
        code = 'console.log("5" - 2, "5" + 2);';
        options = ['3 "52"', '"3" "52"', '3 7', 'NaN "52"'];
        correctIndex = 0;
        explanation = 'Subtraction (-) coerces string "5" to number 5 (yielding 3), whereas addition (+) performs string concatenation (yielding "52").';
      } else {
        code = 'const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);';
        options = ['4', '3', 'undefined', 'TypeError'];
        correctIndex = 0;
        explanation = '.push() appends element 4 to the array and increases its length to 4.';
      }
    } else {
      code = 'int a = 8;\nint b = 3;\nSystem.out.println(a / b);';
      options = ['2', '2.66', '3', 'CompilationError'];
      correctIndex = 0;
      explanation = 'Integer division in Java truncates any decimal fraction, resulting in 2.';
    }

    return {
      id,
      courseId,
      courseTitle,
      lessonTitle,
      language: lang,
      title,
      code,
      options,
      correctIndex,
      explanation,
      timeLimitSecs: (drill.estimatedMins || 2) * 10,
    };
  }

  if (gameId === 'shuffle') {
    let scrambledBlocks = [];
    let correctOrder = [];
    let goalDescription = `Reconstruct the algorithm blocks for ${title}.`;
    let expectedOutput = 'Working Program Execution';
    let explanation = `Logical block assembly for ${lessonTitle}.`;

    if (lang === 'python') {
      if (moduleNum === 2) {
        scrambledBlocks = [
          { id: 'b2', content: 'temp = x', indent: 0 },
          { id: 'b1', content: 'x = 10\ny = 20', indent: 0 },
          { id: 'b3', content: 'x = y', indent: 0 },
          { id: 'b4', content: 'y = temp', indent: 0 },
          { id: 'b5', content: 'print(x, y)', indent: 0 },
        ];
        correctOrder = ['b1', 'b2', 'b3', 'b4', 'b5'];
        expectedOutput = '20 10';
        explanation = 'Initialize variables -> store x in temp -> copy y into x -> restore temp into y -> print swapped values.';
      } else if (moduleNum === 7) {
        scrambledBlocks = [
          { id: 'b3', content: '    grade = "Pass"', indent: 1 },
          { id: 'b1', content: 'score = 75', indent: 0 },
          { id: 'b4', content: 'else:\n    grade = "Fail"', indent: 0 },
          { id: 'b2', content: 'if score >= 50:', indent: 0 },
          { id: 'b5', content: 'print(f"Result: {grade}")', indent: 0 },
        ];
        correctOrder = ['b1', 'b2', 'b3', 'b4', 'b5'];
        expectedOutput = 'Result: Pass';
        explanation = 'Declare score -> if conditional header -> indented truth branch -> else fallback -> output grade.';
      } else if (moduleNum === 9) {
        scrambledBlocks = [
          { id: 'b3', content: '    print(count)', indent: 1 },
          { id: 'b1', content: 'count = 3', indent: 0 },
          { id: 'b4', content: '    count -= 1', indent: 1 },
          { id: 'b2', content: 'while count > 0:', indent: 0 },
          { id: 'b5', content: 'print("Go!")', indent: 0 },
        ];
        correctOrder = ['b1', 'b2', 'b3', 'b4', 'b5'];
        expectedOutput = '3\\n2\\n1\\nGo!';
        explanation = 'Initialize counter -> while condition -> print count -> decrement counter -> print finale.';
      } else if (moduleNum === 10) {
        scrambledBlocks = [
          { id: 'b2', content: '    area = width * height', indent: 1 },
          { id: 'b1', content: 'def get_area(width, height):', indent: 0 },
          { id: 'b3', content: '    return area', indent: 1 },
          { id: 'b4', content: 'result = get_area(5, 4)', indent: 0 },
          { id: 'b5', content: 'print(f"Area: {result}")', indent: 0 },
        ];
        correctOrder = ['b1', 'b2', 'b3', 'b4', 'b5'];
        expectedOutput = 'Area: 20';
        explanation = 'Function signature -> computation -> return statement -> function invocation -> output.';
      } else {
        scrambledBlocks = [
          { id: 'b2', content: '    total += n', indent: 1 },
          { id: 'b1', content: 'total = 0', indent: 0 },
          { id: 'b3', content: 'for n in [10, 20, 30]:', indent: 0 },
          { id: 'b4', content: 'print(f"Total: {total}")', indent: 0 },
        ];
        correctOrder = ['b1', 'b3', 'b2', 'b4'];
        expectedOutput = 'Total: 60';
        explanation = 'Initialize accumulator -> loop through list -> accumulate value -> print sum.';
      }
    } else {
      scrambledBlocks = [
        { id: 'b2', content: '  const result = a + b;', indent: 1 },
        { id: 'b1', content: 'function calculate(a, b) {', indent: 0 },
        { id: 'b3', content: '  return result;', indent: 1 },
        { id: 'b4', content: '}', indent: 0 },
      ];
      correctOrder = ['b1', 'b2', 'b3', 'b4'];
      expectedOutput = 'Function Output';
      explanation = 'Function declaration -> calculation -> return -> close brace.';
    }

    return {
      id,
      courseId,
      courseTitle,
      lessonTitle,
      language: lang,
      title,
      goalDescription,
      expectedOutput,
      scrambledBlocks,
      correctOrder,
      explanation,
    };
  }

  return null;
}

const allSpeedrun = [];
const allBugHunt = [];
const allPredictor = [];
const allShuffle = [];

const moduleRegex = /id:\s*'([a-z]+-mod-\d+)'[\s\S]*?moduleNumber:\s*(\d+)[\s\S]*?title:\s*'([^']+)'[\s\S]*?language:\s*'([^']+)'[\s\S]*?drills:\s*\[([\s\S]*?)\],/g;

let match;
while ((match = moduleRegex.exec(moduleDataRaw)) !== null) {
  const modId = match[1];
  const modNum = parseInt(match[2], 10);
  const modTitle = match[3];
  const lang = match[4];
  const drillsBlock = match[5];

  const drillRegex = /\{\s*gameId:\s*'([^']+)',\s*title:\s*'([^']+)',\s*difficulty:\s*'([^']+)',\s*estimatedMins:\s*(\d+)\s*\}/g;
  let dMatch;
  while ((dMatch = drillRegex.exec(drillsBlock)) !== null) {
    const drill = {
      gameId: dMatch[1],
      title: dMatch[2],
      difficulty: dMatch[3],
      estimatedMins: parseInt(dMatch[4], 10),
    };

    const generated = generateSnippetForDrill(drill, lang, modNum, modTitle);
    if (drill.gameId === 'speedrun') allSpeedrun.push(generated);
    else if (drill.gameId === 'bughunt') allBugHunt.push(generated);
    else if (drill.gameId === 'predictor') allPredictor.push(generated);
    else if (drill.gameId === 'shuffle') allShuffle.push(generated);
  }
}

const tsContent = `import {
  SpeedrunSnippet,
  BugHuntChallenge,
  OutputPredictorChallenge,
  CodeShuffleChallenge,
} from '../types/games.types'

export const CURRICULUM_SPEEDRUN_SNIPPETS: SpeedrunSnippet[] = ${JSON.stringify(allSpeedrun, null, 2)};

export const CURRICULUM_BUG_HUNT_CHALLENGES: BugHuntChallenge[] = ${JSON.stringify(allBugHunt, null, 2)};

export const CURRICULUM_OUTPUT_PREDICTOR_CHALLENGES: OutputPredictorChallenge[] = ${JSON.stringify(allPredictor, null, 2)};

export const CURRICULUM_CODE_SHUFFLE_CHALLENGES: CodeShuffleChallenge[] = ${JSON.stringify(allShuffle, null, 2)};
`;

fs.writeFileSync(
  path.join(__dirname, '../src/features/games/data/curriculumChallengesData.ts'),
  tsContent,
  'utf8'
);
console.log('Saved to src/features/games/data/curriculumChallengesData.ts');
