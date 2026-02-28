import { LineAwareMarkdown } from './line-aware-markdown'

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

interface MarkdownContentProps {
  content: string
  className?: string
}

/**
 * Renderuje markdown z 1:1 odwzorowaniem \n (każdy enter = jeden łam),
 * bez dodatkowych łamów wewnątrz list.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <LineAwareMarkdown
      content={normalizeLineEndings(content)}
      className={className}
    />
  )
}
