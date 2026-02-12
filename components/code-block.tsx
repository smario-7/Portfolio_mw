'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

export function CodeBlock() {
  const [copied, setCopied] = useState(false)

  const code = `import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Liczba: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Zwiększ
      </button>
    </div>
  )
}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
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
      <pre className="overflow-x-auto p-4">
        <code className="text-sm font-mono leading-relaxed">
          <span className="text-purple-400">{'import'}</span>{' '}
          <span className="text-foreground">{'{'}</span>{' '}
          <span className="text-cyan-400">{'useState'}</span>{' '}
          <span className="text-foreground">{'}'}</span>{' '}
          <span className="text-purple-400">{'from'}</span>{' '}
          <span className="text-green-400">{"'react'"}</span>
          {'\n\n'}
          <span className="text-purple-400">{'export function'}</span>{' '}
          <span className="text-yellow-300">{'Counter'}</span>
          <span className="text-foreground">{'() {'}</span>
          {'\n  '}
          <span className="text-purple-400">{'const'}</span>{' '}
          <span className="text-foreground">{'['}</span>
          <span className="text-cyan-400">{'count'}</span>
          <span className="text-foreground">{', '}</span>
          <span className="text-cyan-400">{'setCount'}</span>
          <span className="text-foreground">{']'}</span>{' '}
          <span className="text-purple-400">{'='}</span>{' '}
          <span className="text-yellow-300">{'useState'}</span>
          <span className="text-foreground">{'('}</span>
          <span className="text-orange-400">{'0'}</span>
          <span className="text-foreground">{')'}</span>
          {'\n\n  '}
          <span className="text-purple-400">{'return'}</span>{' '}
          <span className="text-foreground">{'('}</span>
          {'\n    '}
          <span className="text-gray-500">{'<'}</span>
          <span className="text-pink-400">{'div'}</span>
          <span className="text-gray-500">{'>'}</span>
          {'\n      '}
          <span className="text-gray-500">{'<'}</span>
          <span className="text-pink-400">{'p'}</span>
          <span className="text-gray-500">{'>'}</span>
          <span className="text-foreground">{'Liczba: {'}</span>
          <span className="text-cyan-400">{'count'}</span>
          <span className="text-foreground">{'}'}</span>
          <span className="text-gray-500">{'</'}</span>
          <span className="text-pink-400">{'p'}</span>
          <span className="text-gray-500">{'>'}</span>
          {'\n      '}
          <span className="text-gray-500">{'<'}</span>
          <span className="text-pink-400">{'button'}</span>{' '}
          <span className="text-cyan-400">{'onClick'}</span>
          <span className="text-purple-400">{'='}</span>
          <span className="text-foreground">{'{'}</span>
          <span className="text-purple-400">{'() =>'}</span>{' '}
          <span className="text-yellow-300">{'setCount'}</span>
          <span className="text-foreground">{'('}</span>
          <span className="text-cyan-400">{'count'}</span>
          <span className="text-foreground">{' + '}</span>
          <span className="text-orange-400">{'1'}</span>
          <span className="text-foreground">{')}'}</span>
          <span className="text-gray-500">{'>'}</span>
          {'\n        '}
          <span className="text-foreground">{'Zwiększ'}</span>
          {'\n      '}
          <span className="text-gray-500">{'</'}</span>
          <span className="text-pink-400">{'button'}</span>
          <span className="text-gray-500">{'>'}</span>
          {'\n    '}
          <span className="text-gray-500">{'</'}</span>
          <span className="text-pink-400">{'div'}</span>
          <span className="text-gray-500">{'>'}</span>
          {'\n  '}
          <span className="text-foreground">{')'}</span>
          {'\n'}
          <span className="text-foreground">{'}'}</span>
        </code>
      </pre>
    </div>
  )
}
