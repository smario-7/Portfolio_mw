import { useState, useEffect } from 'react'
import { getFragmentFromPy, getFragmentFromIpynb } from '@/lib/parsers/code-fragment'
import { getCodeFileContent } from '@/lib/utils/code-fragment-cache'
import { CodeBlock } from '@/components/code-block'
import type { BlockCode } from '@/lib/types'

interface BlockCodeRendererProps {
  block: BlockCode
}

type LoadState = 'loading' | 'error' | 'ok'

export function BlockCodeRenderer({ block }: BlockCodeRendererProps) {
  const [state, setState] = useState<LoadState>('loading')
  const [fragment, setFragment] = useState('')

  useEffect(() => {
    if (!block.sourceFile) {
      setState('error')
      return
    }
    getCodeFileContent(block.sourceFile)
      .then((raw) => {
        const text =
          block.sourceType === 'py'
            ? getFragmentFromPy(raw, block.fragmentId)
            : getFragmentFromIpynb(raw, block.fragmentId)
        setFragment(text)
        setState('ok')
      })
      .catch(() => setState('error'))
  }, [block.sourceFile, block.sourceType, block.fragmentId])

  if (state === 'loading') {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-border bg-card/30 text-sm text-muted-foreground">
        Ładowanie fragmentu kodu…
      </div>
    )
  }
  if (state === 'error') {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-border bg-card/30 text-sm text-muted-foreground">
        Brak pliku
      </div>
    )
  }

  const filename = block.sourceFile.split('/').pop() ?? undefined
  return (
    <CodeBlock
      code={fragment}
      language={block.language ?? 'python'}
      filename={filename}
    />
  )
}
