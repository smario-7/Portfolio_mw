import { useState, useEffect } from 'react'
import 'react-ipynb-renderer/dist/styles/monokai.css'
import { IpynbRenderer } from 'react-ipynb-renderer'
import { filterIpynbByCellIndices, type IpynbNotebook } from '@/lib/parsers/ipynb'
import { getCodeFileContent } from '@/lib/utils/code-fragment-cache'
import { CodeFragmentLoadError, reportError } from '@/lib/errors'
import { CodeBlockPlaceholder } from './CodeBlockPlaceholder'

interface IpynbBlockRendererProps {
  sourceFile: string
  fragmentId: string
}

type LoadState = 'loading' | 'error' | 'ok'

export function IpynbBlockRenderer({ sourceFile, fragmentId }: IpynbBlockRendererProps) {
  const [state, setState] = useState<LoadState>('loading')
  const [ipynbFiltered, setIpynbFiltered] = useState<IpynbNotebook | null>(null)

  useEffect(() => {
    if (!sourceFile) {
      setState('error')
      return
    }
    getCodeFileContent(sourceFile)
      .then((raw) => {
        let parsed: IpynbNotebook
        try {
          parsed = JSON.parse(raw) as IpynbNotebook
        } catch {
          reportError(new CodeFragmentLoadError(sourceFile, new Error('Invalid JSON')), {
            context: 'ipynb_block_renderer',
          })
          setState('error')
          return
        }
        setIpynbFiltered(filterIpynbByCellIndices(parsed, fragmentId))
        setState('ok')
      })
      .catch((err) => {
        reportError(new CodeFragmentLoadError(sourceFile, err), {
          context: 'ipynb_block_renderer',
        })
        setState('error')
      })
  }, [sourceFile, fragmentId])

  if (state === 'loading') return <CodeBlockPlaceholder variant="loading" />
  if (state === 'error') return <CodeBlockPlaceholder variant="error" />
  if (!ipynbFiltered) {
    return null
  }
  const cells = (ipynbFiltered.cells ?? []).map((cell) => ({
    ...cell,
    source: Array.isArray(cell.source)
      ? cell.source
      : cell.source
        ? [cell.source]
        : [],
  }))
  return <IpynbRenderer ipynb={{ ...ipynbFiltered, cells }} />
}
