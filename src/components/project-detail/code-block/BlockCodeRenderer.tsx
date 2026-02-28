import * as React from 'react'
import { useState, useEffect } from 'react'
import { getFragmentFromPy } from '@/lib/parsers/code-fragment'
import { getCodeFileContent } from '@/lib/utils/code-fragment-cache'
import { CodeFragmentLoadError, reportError } from '@/lib/errors'
import { CodeBlock } from '@/components/shared'
import { CodeBlockPlaceholder } from './CodeBlockPlaceholder'
import type { BlockCode } from '@/lib/types'

const IpynbBlockRenderer = React.lazy(() =>
  import('./IpynbBlockRenderer').then((m) => ({ default: m.IpynbBlockRenderer }))
)

interface BlockCodeRendererProps {
  block: BlockCode
}

type LoadState = 'loading' | 'error' | 'ok'

export function BlockCodeRenderer({ block }: BlockCodeRendererProps) {
  const [state, setState] = useState<LoadState>('loading')
  const [fragment, setFragment] = useState('')

  useEffect(() => {
    if (block.sourceType !== 'py') return
    if (!block.sourceFile) {
      setState('error')
      return
    }
    getCodeFileContent(block.sourceFile)
      .then((raw) => {
        setFragment(getFragmentFromPy(raw, block.fragmentId))
        setState('ok')
      })
      .catch((err) => {
        reportError(new CodeFragmentLoadError(block.sourceFile ?? 'unknown', err), {
          context: 'block_code_renderer',
        })
        setState('error')
      })
  }, [block.sourceFile, block.sourceType, block.fragmentId])

  if (block.sourceType === 'ipynb') {
    return (
      <React.Suspense fallback={<CodeBlockPlaceholder variant="loading" />}>
        <IpynbBlockRenderer sourceFile={block.sourceFile} fragmentId={block.fragmentId} />
      </React.Suspense>
    )
  }

  if (state === 'loading') return <CodeBlockPlaceholder variant="loading" />
  if (state === 'error') return <CodeBlockPlaceholder variant="error" />

  const filename = block.sourceFile.split('/').pop() ?? undefined
  return (
    <CodeBlock
      code={fragment}
      language={block.language ?? 'python'}
      filename={filename}
    />
  )
}
