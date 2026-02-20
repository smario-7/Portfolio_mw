/** Załączniki projektu: PDF, notebooki, Markdown, skrypty Python. */
export const ALLOWED_ATTACHMENT_EXTENSIONS = ['.pdf', '.ipynb', '.md', '.py'] as const

/** Obrazki projektu: screenshot główny i screeny w blokach pełnego opisu. */
export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'] as const

export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  'application/pdf',
  'application/json',
  'text/markdown',
  'text/x-python',
  'application/octet-stream',
] as const

export function isValidAttachmentFile(filename: string): boolean {
  const lowerFilename = filename.toLowerCase()
  return ALLOWED_ATTACHMENT_EXTENSIONS.some((ext) => lowerFilename.endsWith(ext))
}

export function isValidImageFile(filename: string): boolean {
  const lowerFilename = filename.toLowerCase()
  return ALLOWED_IMAGE_EXTENSIONS.some((ext) => lowerFilename.endsWith(ext))
}

export function getAttachmentAcceptString(): string {
  return '.pdf,.ipynb,.md,.py,application/pdf,text/x-python'
}
