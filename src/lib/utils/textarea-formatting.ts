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
