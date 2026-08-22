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
    // 7. Types (teal)
    else if (TYPES.has(val)) {
      tokens.push({ text: val, color: '#4ec9b0' })
    }
    // 8. Functions (yellow)
    else if (line.substring(match.index + val.length).trimStart().startsWith('(')) {
      tokens.push({ text: val, color: '#dcdcaa' })
    }
    // 9. Identifiers (light blue)
    else if (/^[a-zA-Z_]\w*$/.test(val)) {
      tokens.push({ text: val, color: '#9cdcfe' })
    }
    // 10. Operators / Punctuation
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
