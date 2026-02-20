import { useState } from 'react'
import { Highlight } from 'prism-react-renderer'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-typescript'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

export interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export function CodeBlock({ code, language = 'python', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const safeLang = Prism.languages[language] ? language : 'plain'

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
          {filename && (
            <span className="ml-2 text-xs text-muted-foreground">{filename}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-2 px-2 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Skopiowano
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Kopiuj
            </>
          )}
        </Button>
      </div>
      <Highlight prism={Prism} code={code} language={safeLang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style} data-language={safeLang}>
            <code className="block overflow-x-auto p-4 text-sm font-mono leading-relaxed">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
