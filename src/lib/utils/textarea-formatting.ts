export function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder?: string
): string {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = textarea.value.slice(start, end)
  const insert = selected || (placeholder ?? '')
  return (
    textarea.value.slice(0, start) + before + insert + after + textarea.value.slice(end)
  )
}

export function insertAtLineStart(textarea: HTMLTextAreaElement, prefix: string): string {
  const value = textarea.value
  const cursorPos = textarea.selectionStart
  const lineStart = cursorPos === 0 ? 0 : value.lastIndexOf('\n', cursorPos - 1) + 1
  return value.slice(0, lineStart) + prefix + value.slice(lineStart)
}

export function insertUnorderedListMarker(textarea: HTMLTextAreaElement): string {
  return insertAtLineStart(textarea, '* ')
}

export function insertOrderedListMarker(textarea: HTMLTextAreaElement): string {
  return insertAtLineStart(textarea, '1. ')
}

export function insertNewParagraph(textarea: HTMLTextAreaElement): string {
  const start = textarea.selectionStart
  return (
    textarea.value.slice(0, start) + '\n\n' + textarea.value.slice(start)
  )
}

export function wrapWithCodeBlock(
  textarea: HTMLTextAreaElement,
  language: string
): string {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = textarea.value.slice(start, end)
  const insert = selected || 'kod'
  const before = `\n\`\`\`${language}\n`
  const after = `\n\`\`\`\n`
  return textarea.value.slice(0, start) + before + insert + after + textarea.value.slice(end)
}

const LIST_ITEM = /^\s*([-*]|\d+\.)\s*(.*)$/

function getMarkerForLine(line: string): string | null {
  const m = line.match(LIST_ITEM)
  if (!m) return null
  const bullet = m[1]
  if (bullet === '-' || bullet === '*') return `${bullet} `
  if (/^\d+\.$/.test(bullet)) return `${bullet} `
  return null
}

export function handleEnterInList(
  textarea: HTMLTextAreaElement
): { handled: boolean; newValue?: string; newCursor?: number } {
  const value = textarea.value
  const cursorPos = textarea.selectionStart
  const lineStart = cursorPos === 0 ? 0 : value.lastIndexOf('\n', cursorPos - 1) + 1
  const lineEnd = value.indexOf('\n', lineStart)
  const lineEndPos = lineEnd === -1 ? value.length : lineEnd
  const line = value.slice(lineStart, lineEndPos)
  const marker = getMarkerForLine(line)
  if (!marker) return { handled: false }

  const m = line.match(LIST_ITEM)!
  const afterMarker = (m[2] ?? '').trim()
  const isEmptyItem = afterMarker === ''

  if (isEmptyItem) {
    const newValue = value.slice(0, lineStart) + '\n' + value.slice(lineEndPos)
    return { handled: true, newValue, newCursor: lineStart + 1 }
  }

  const newValue =
    value.slice(0, lineEndPos) + '\n' + marker + value.slice(lineEndPos)
  const newCursor = lineEndPos + 1 + marker.length
  return { handled: true, newValue, newCursor }
}
