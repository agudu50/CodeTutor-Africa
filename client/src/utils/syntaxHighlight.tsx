import React from 'react'

/**
 * VS Code Dark+ Color Palette:
 * - Background: #1e1e1e
 * - Text: #d4d4d4
 * - Comments: #6a9955 (Italic)
 * - Strings: #ce9178
 * - Numbers: #b5cea8
 * - Control Keywords (if, else, return, etc.): #c586c0
 * - Declarations (def, function, class, const, etc.): #569cd6
 * - Built-ins / Booleans (True, false, null, None): #569cd6
 * - Types (str, int, String, boolean, etc.): #4ec9b0
 * - Functions & Methods (is_palindrome, print, log): #dcdcaa
 * - Variables & Properties: #9cdcfe
 * - Punctuation / Operators: #d4d4d4
 */

export interface TokenSpan {
  text: string
  color?: string
  isItalic?: boolean
  isBold?: boolean
}

// Tokenizer regular expression for Python, JS/TS, Java
const TOKEN_REGEX = /(#[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b(?:def|function|class|interface|type|const|let|var|public|private|protected|static|final|import|export|from|package|new|extends|implements|lambda)\b|\b(?:return|if|else|elif|for|in|while|try|except|catch|finally|throw|throws|break|continue|yield|await|async|pass|raise|is|not|and|or|typeof|instanceof)\b|\b(?:True|False|None|true|false|null|undefined)\b|\b(?:str|int|float|bool|list|dict|set|tuple|String|Integer|Boolean|Double|Float|Long|Character|void|number|string|boolean|any|never|unknown|Promise|Array|Object|Set|Map|Console|System|Math)\b|[a-zA-Z_]\w*(?=\s*\()|[a-zA-Z_]\w*|[^\s\w])/g

const CONTROL_KEYWORDS = new Set([
  'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'try', 'except', 'catch',
  'finally', 'throw', 'throws', 'break', 'continue', 'yield', 'await', 'async',
  'pass', 'raise', 'is', 'not', 'and', 'or', 'typeof', 'instanceof'
])

const DECLARATION_KEYWORDS = new Set([
  'def', 'function', 'class', 'interface', 'type', 'const', 'let', 'var',
  'public', 'private', 'protected', 'static', 'final', 'import', 'export',
  'from', 'package', 'new', 'extends', 'implements', 'lambda'
])

const CONSTANTS = new Set([
  'True', 'False', 'None', 'true', 'false', 'null', 'undefined'
])

const TYPES = new Set([
  'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple',
  'String', 'Integer', 'Boolean', 'Double', 'Float', 'Long', 'Character',
  'void', 'number', 'string', 'boolean', 'any', 'never', 'unknown',
  'Promise', 'Array', 'Object', 'Set', 'Map', 'Console', 'System', 'Math'
])

export function tokenizeCodeLine(line: string): TokenSpan[] {
  if (!line) return [{ text: ' ' }]

  const tokens: TokenSpan[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  // Reset regex index
  TOKEN_REGEX.lastIndex = 0

  while ((match = TOKEN_REGEX.exec(line)) !== null) {
    // Leading unmatched text
    if (match.index > lastIndex) {
      tokens.push({ text: line.substring(lastIndex, match.index), color: '#d4d4d4' })
    }

    const val = match[0]
    lastIndex = TOKEN_REGEX.lastIndex

    // 1. Comments
    if (val.startsWith('#') || val.startsWith('//') || val.startsWith('/*')) {
      tokens.push({ text: val, color: '#6a9955', isItalic: true })
    }
    // 2. Strings
    else if (val.startsWith('"') || val.startsWith("'") || val.startsWith('`')) {
      tokens.push({ text: val, color: '#ce9178' })
    }
    // 3. Numbers
    else if (/^\d+(\.\d+)?$/.test(val)) {
      tokens.push({ text: val, color: '#b5cea8' })
    }
    // 4. Control Keywords (purple)
    else if (CONTROL_KEYWORDS.has(val)) {
      tokens.push({ text: val, color: '#c586c0', isBold: true })
    }
    // 5. Declaration Keywords (blue)
    else if (DECLARATION_KEYWORDS.has(val)) {
      tokens.push({ text: val, color: '#569cd6', isBold: true })
    }
    // 6. Constants (blue)
    else if (CONSTANTS.has(val)) {
      tokens.push({ text: val, color: '#569cd6', isBold: true })
    }
    // 7. Types & Classes (teal #4ec9b0): known types or PascalCase class/interface names
    else if (TYPES.has(val) || /^[A-Z][a-zA-Z0-9_]*$/.test(val)) {
      tokens.push({ text: val, color: '#4ec9b0', isBold: true })
    }
    // 8. Functions & Methods (yellow #dcdcaa)
    else if (line.substring(match.index + val.length).trimStart().startsWith('(')) {
      tokens.push({ text: val, color: '#dcdcaa' })
    }
    // 9. Identifiers / Variables / Fields (light blue #9cdcfe)
    else if (/^[a-zA-Z_]\w*$/.test(val)) {
      tokens.push({ text: val, color: '#9cdcfe' })
    }
    // 10. VS Code Bracket Pair Colorization
    else if (val === '{' || val === '}') {
      tokens.push({ text: val, color: '#ffd700' })
    }
    else if (val === '[' || val === ']') {
      tokens.push({ text: val, color: '#da70d6' })
    }
    else if (val === '(' || val === ')') {
      tokens.push({ text: val, color: '#ffd700' })
    }
    // 11. Operators / Punctuation
    else {
      tokens.push({ text: val, color: '#d4d4d4' })
    }
  }

  // Trailing unmatched text
  if (lastIndex < line.length) {
    tokens.push({ text: line.substring(lastIndex), color: '#d4d4d4' })
  }

  return tokens
}

export function renderVSCodeSyntax(code: string): React.ReactNode {
  const lines = code.split('\n')

  return lines.map((line, lineIdx) => {
    const tokens = tokenizeCodeLine(line)

    return (
      <div key={lineIdx} className="leading-6 min-h-[1.5rem] whitespace-pre">
        {tokens.map((token, tokenIdx) => (
          <span
            key={tokenIdx}
            style={{
              color: token.color || '#d4d4d4',
              fontStyle: token.isItalic ? 'italic' : 'normal',
              fontWeight: token.isBold ? '600' : 'normal',
            }}
          >
            {token.text}
          </span>
        ))}
      </div>
    )
  })
}

/**
 * Colorizes terminal error messages and stack traces with ANSI-like colors:
 * - Error Names & Exceptions: Bold Rose/Red
 * - Function Calls / Frames: Amber/Gold
 * - File Paths & Lines: Cyan/Teal
 * - Command Prompts: Emerald
 */
export function renderTerminalStackTrace(text: string): React.ReactNode {
  if (!text || text.trim() === '') {
    return (
      <div className="space-y-1.5 py-1 select-text">
        <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
          <span className="text-emerald-500 font-bold">●</span>
          <span className="text-slate-400 font-semibold">Terminal ready</span>
          <span className="text-slate-600">—</span>
          <span className="text-slate-500 italic">// No crash log or stack trace provided</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Click any sample bug above (JS, Java, or Python) to load a reproduction trace.
        </div>
      </div>
    )
  }
  const lines = text.split('\n')

  return lines.map((line, idx) => {
    // 1. Java Thread Exception header: Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
    const javaThreadMatch = line.match(/^(\s*Exception in thread\s+)(".*?")\s+([A-Za-z0-9_.]+(?:Exception|Error))(?::\s*(.*))?$/)
    if (javaThreadMatch) {
      return (
        <div key={idx} className="leading-5 whitespace-pre select-text">
          <span className="text-[#FF5370] font-black">{javaThreadMatch[1]}</span>
          <span className="text-[#FFD700] font-bold">{javaThreadMatch[2]}</span>
          <span className="text-white"> </span>
          <span className="text-[#FF5370] font-black underline decoration-rose-500/50">{javaThreadMatch[3]}</span>
          {javaThreadMatch[4] && (
            <>
              <span className="text-[#FF5370] font-bold">: </span>
              <span className="text-[#FCA5A5] font-semibold">{javaThreadMatch[4]}</span>
            </>
          )}
        </div>
      )
    }

    // 2. Python Traceback header
    if (line.trim().startsWith('Traceback (most recent call last):')) {
      return (
        <div key={idx} className="leading-5 whitespace-pre text-[#FF5370] font-black select-text">
          {line}
        </div>
      )
    }

    // 3. Traceback header / file line (e.g., File "main.py", line 4, in <module>)
    const fileLineMatch = line.match(/^(\s*)(File\s+"[^"]+",\s+line\s+\d+)(.*)$/)
    if (fileLineMatch) {
      return (
        <div key={idx} className="leading-5 whitespace-pre select-text">
          <span>{fileLineMatch[1]}</span>
          <span className="text-[#4EC9B0] font-bold">{fileLineMatch[2]}</span>
          <span className="text-[#FFD700] font-semibold">{fileLineMatch[3]}</span>
        </div>
      )
    }

    // 4. JS / Java Stack frame: at fetchUserData (app.js:6:14) or at ArraySearch.search(ArraySearch.java:4)
    const atMatch = line.match(/^(\s*at\s+)([\w.$<>]+\s*)(?:\(([^)]+)\)|(.*))$/)
    if (atMatch) {
      return (
        <div key={idx} className="leading-5 whitespace-pre text-slate-300 select-text">
          <span className="text-rose-400 font-bold">{atMatch[1]}</span>
          <span className="text-[#DCDCAA] font-bold">{atMatch[2]}</span>
          {atMatch[3] ? (
            <span className="text-[#4EC9B0] font-medium">({atMatch[3]})</span>
          ) : atMatch[4] ? (
            <span className="text-slate-400">{atMatch[4]}</span>
          ) : null}
        </div>
      )
    }

    // 5. Exception / Error Name at start of line (TypeError, SyntaxError, IndexError, etc.)
    const errorMatch = line.match(/^(\s*)([A-Za-z0-9_.]*(?:Error|Exception|Throwable|Failure|Fault|Warning)(?::)?)(.*)$/)
    if (errorMatch) {
      return (
        <div key={idx} className="leading-5 whitespace-pre select-text">
          <span>{errorMatch[1]}</span>
          <span className="text-[#FF5370] font-black tracking-tight underline decoration-rose-500/50">{errorMatch[2]}</span>
          <span className="text-[#FCA5A5] font-semibold">{errorMatch[3]}</span>
        </div>
      )
    }

    // 6. Command line prompts (e.g. $ node app.js or > python test.py)
    if (line.startsWith('$') || line.startsWith('>') || line.startsWith('>>>')) {
      const splitIdx = line.indexOf(' ')
      const prefix = splitIdx !== -1 ? line.slice(0, splitIdx + 1) : line
      const rest = splitIdx !== -1 ? line.slice(splitIdx + 1) : ''
      return (
        <div key={idx} className="leading-5 whitespace-pre text-emerald-400 font-bold select-text">
          <span className="text-[#22C55E] mr-1.5">{prefix}</span>
          <span className="text-slate-200">{rest}</span>
        </div>
      )
    }

    // 7. Caret pointers (e.g. ^ or ~~~)
    if (/^\s*[\^~]+\s*$/.test(line)) {
      return (
        <div key={idx} className="leading-5 whitespace-pre text-[#FFD700] font-black select-text">
          {line}
        </div>
      )
    }

    // 8. Generic terminal line with fallback error tinting
    return (
      <div key={idx} className="leading-5 whitespace-pre text-[#FCA5A5]/90 font-medium select-text">
        {line}
      </div>
    )
  })
}

