import { MarkdownContent, FULL_DESCRIPTION_MARKDOWN_CLASS } from '@/components/markdown'
import type { BlockText } from '@/lib/types'

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

interface BlockTextRendererProps {
  block: BlockText
}

export function BlockTextRenderer({ block }: BlockTextRendererProps) {
  const content = normalizeLineEndings(block.content ?? '')
  return (
    <MarkdownContent
      content={content}
      className={FULL_DESCRIPTION_MARKDOWN_CLASS}
    />
  )
}
