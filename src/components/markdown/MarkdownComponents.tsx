import * as React from 'react'
import type { ReactNode } from 'react'
import type { Components } from 'react-markdown'
import { MarkdownCode } from './MarkdownCode'
import { LIST_UL_CLASS, LIST_OL_CLASS, LIST_LI_CLASS } from './markdown-styles'

function normalizeMarkdownLinkHref(href: string | undefined): string {
  const raw = (href ?? '').trim()
  if (!raw) return '#'
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('#')) {
    return raw
  }
  if (raw.startsWith('//')) return `https:${raw}`
  return `https://${raw}`
}

function isParagraphEmpty(children: ReactNode): boolean {
  if (children == null) return true
  if (typeof children === 'string') {
    const t = children.replace(/\u200B/g, '').trim()
    return t === ''
  }
  if (Array.isArray(children)) return children.every(isParagraphEmpty)
  return false
}

const headingClasses: Record<string, string> = {
  h1: 'text-white text-3xl font-bold mt-6 mb-4',
  h2: 'text-white/90 text-2xl font-semibold mt-5 mb-3',
  h3: 'text-foreground text-xl font-medium mt-4 mb-2',
  h4: 'text-foreground text-lg font-medium mt-3 mb-2',
  h5: 'text-muted-foreground text-base font-medium mt-2 mb-1',
  h6: 'text-muted-foreground text-sm font-medium mt-2 mb-1',
}

export const markdownComponents: Components = {
  h1: ({ children, key, ...props }) => (
    <h1 key={key} className={headingClasses.h1} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, key, ...props }) => (
    <h2 key={key} className={headingClasses.h2} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, key, ...props }) => (
    <h3 key={key} className={headingClasses.h3} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, key, ...props }) => (
    <h4 key={key} className={headingClasses.h4} {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, key, ...props }) => (
    <h5 key={key} className={headingClasses.h5} {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, key, ...props }) => (
    <h6 key={key} className={headingClasses.h6} {...props}>
      {children}
    </h6>
  ),
  a: ({ children, href, key, ...props }) => (
    <a
      key={key}
      href={normalizeMarkdownLinkHref(href)}
      className="text-blue-500 underline hover:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, key, ...props }) => (
    <ul key={key} className={LIST_UL_CLASS} {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, key, ...props }) => (
    <ol key={key} className={LIST_OL_CLASS} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, key, ...props }) => (
    <li key={key} className={LIST_LI_CLASS} {...props}>
      <span className="list-item-inner">{children}</span>
    </li>
  ),
  p: ({ children, key, ...props }) => {
    const empty = isParagraphEmpty(children)
    return (
      <p
        key={key}
        className={`my-0 ${empty ? 'empty-line' : ''}`.trim()}
        {...props}
      >
        {children}
      </p>
    )
  },
  code: (props) => {
    const { key, ...rest } = props as { key?: React.Key; [k: string]: unknown }
    return <MarkdownCode key={key} {...rest} />
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children, key, ...props }) => (
    <div key={key} className="my-4 w-full overflow-x-auto">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, key, ...props }) => (
    <thead key={key} className="border-b-2 border-border bg-muted/30" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, key, ...props }) => (
    <tbody key={key} className="divide-y divide-border" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, key, ...props }) => (
    <tr key={key} className="border-border" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, key, ...props }) => (
    <th
      key={key}
      className="px-4 py-2 text-left text-sm font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, key, ...props }) => (
    <td key={key} className="px-4 py-2 text-sm text-muted-foreground" {...props}>
      {children}
    </td>
  ),
}
