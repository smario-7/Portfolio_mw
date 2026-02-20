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

const headingClasses: Record<string, string> = {
  h1: 'text-white text-3xl font-bold mt-6 mb-4',
  h2: 'text-white/90 text-2xl font-semibold mt-5 mb-3',
  h3: 'text-foreground text-xl font-medium mt-4 mb-2',
  h4: 'text-foreground text-lg font-medium mt-3 mb-2',
  h5: 'text-muted-foreground text-base font-medium mt-2 mb-1',
  h6: 'text-muted-foreground text-sm font-medium mt-2 mb-1',
}

export const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className={headingClasses.h1} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className={headingClasses.h2} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className={headingClasses.h3} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className={headingClasses.h4} {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className={headingClasses.h5} {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className={headingClasses.h6} {...props}>
      {children}
    </h6>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={normalizeMarkdownLinkHref(href)}
      className="text-blue-500 underline hover:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className={LIST_UL_CLASS} {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className={LIST_OL_CLASS} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className={LIST_LI_CLASS} {...props}>
      {children}
    </li>
  ),
  code: (props) => <MarkdownCode {...props} />,
  pre: ({ children }) => <>{children}</>,
}
