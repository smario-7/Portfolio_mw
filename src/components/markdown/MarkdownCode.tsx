import type { HTMLAttributes } from 'react'
import { CodeBlock } from '@/components/shared'
import { extractLanguage } from './markdown-code-utils'

interface MarkdownCodeProps extends HTMLAttributes<HTMLElement> {
  node?: unknown
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export function MarkdownCode(props: MarkdownCodeProps) {
  const { inline, className, children, ...rest } = props
  const lang = extractLanguage(className ?? undefined)
  const isBlock = !inline && lang !== null
  const code = String(children).replace(/\n$/, '')

  if (isBlock) {
    return <CodeBlock code={code} language={lang} />
  }

  return (
    <code
      className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm"
      {...rest}
    >
      {children}
    </code>
  )
}
