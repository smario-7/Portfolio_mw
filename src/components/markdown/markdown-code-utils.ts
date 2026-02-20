export function extractLanguage(className: string | undefined): string | null {
  if (!className) return null
  const match = /language-(\w+)/.exec(className)
  return match ? match[1] : null
}
