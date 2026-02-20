import { MarkdownContent, FULL_DESCRIPTION_MARKDOWN_CLASS } from '@/components/markdown'
import type { BlockText } from '@/lib/types'

interface BlockTextRendererProps {
  block: BlockText
}

export function BlockTextRenderer({ block }: BlockTextRendererProps) {
  return (
    <MarkdownContent
      content={block.content}
      className={FULL_DESCRIPTION_MARKDOWN_CLASS}
    />
  )
}
