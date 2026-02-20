import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { BlockCode, ProjectAttachment } from '@/lib/types'
import { getStorageFileUrl } from '@/lib/utils/storage-url'
import { getFragmentFromPy, getFragmentFromIpynb } from '@/lib/parsers/code-fragment'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'

interface BlockCodeEditorProps {
  block: BlockCode
  onChange: (block: BlockCode) => void
  existingAttachments: ProjectAttachment[]
  onRemoveBlock?: () => void
}

const codeFiles = (attachments: ProjectAttachment[]) =>
  attachments.filter((a) => a.path.endsWith('.py') || a.path.endsWith('.ipynb'))

interface IpynbCell {
  cell_type?: string
  source?: string[] | string
}

function parseIpynbCells(rawJson: string): string[] {
  try {
    const data = JSON.parse(rawJson) as { cells?: IpynbCell[] }
    const cells = data.cells ?? []
    return cells.map((cell) => {
      const raw = cell.source
      if (Array.isArray(raw)) return raw.join('')
      if (typeof raw === 'string') return raw
      return ''
    })
  } catch {
    return []
  }
}

export function BlockCodeEditor({
  block,
  onChange,
  existingAttachments,
  onRemoveBlock,
}: BlockCodeEditorProps) {
  const files = codeFiles(existingAttachments)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [pyLineCount, setPyLineCount] = useState(0)
  const [ipynbCells, setIpynbCells] = useState<string[]>([])
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set())
  const [fullFileOpen, setFullFileOpen] = useState(false)

  const sourceFile = block.sourceFile?.trim()
  const isIpynb = block.sourceType === 'ipynb'

  useEffect(() => {
    if (!sourceFile) {
      setFileContent(null)
      setLoadError(false)
      setPyLineCount(0)
      setIpynbCells([])
      return
    }
    const url = getStorageFileUrl(sourceFile)
    setLoadError(false)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed')
        return res.text()
      })
      .then((raw) => {
        setFileContent(raw)
        if (sourceFile.endsWith('.ipynb')) {
          setIpynbCells(parseIpynbCells(raw))
        } else {
          setPyLineCount(raw.split(/\r?\n/).length)
        }
      })
      .catch(() => {
        setLoadError(true)
        setFileContent(null)
      })
  }, [sourceFile])

  useEffect(() => {
    if (!sourceFile) return
    if (isIpynb) {
      const parts = block.fragmentId.trim().split(',')
      const indices = new Set<number>()
      parts.forEach((p) => {
        const t = p.trim()
        const range = /^(\d+)-(\d+)$/.exec(t)
        if (range) {
          const a = parseInt(range[1], 10)
          const b = parseInt(range[2], 10)
          for (let i = a; i <= b; i++) indices.add(i)
        } else {
          const n = parseInt(t, 10)
          if (!Number.isNaN(n)) indices.add(n)
        }
      })
      setSelectedCells(indices)
    } else {
      const t = block.fragmentId.trim()
      if (!t || t.toLowerCase() === 'all') {
        setRangeFrom('')
        setRangeTo('')
      } else {
        const range = /^(\d+)-(\d+)$/.exec(t)
        if (range) {
          setRangeFrom(range[1])
          setRangeTo(range[2])
        } else {
          const single = /^\d+$/.exec(t)
          if (single) {
            setRangeFrom(single[0])
            setRangeTo(single[0])
          }
        }
      }
    }
  }, [sourceFile, block.fragmentId, isIpynb])

  const applyPyFragment = (mode: 'all' | 'range') => {
    if (mode === 'all') {
      onChange({ ...block, fragmentId: '' })
      return
    }
    const from = rangeFrom.trim()
    const to = rangeTo.trim()
    if (from && to) {
      if (from === to) {
        onChange({ ...block, fragmentId: from })
      } else {
        onChange({ ...block, fragmentId: `${from}-${to}` })
      }
    }
  }

  const toggleCell = (index: number) => {
    const next = new Set(selectedCells)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    setSelectedCells(next)
    const sorted = Array.from(next).sort((a, b) => a - b)
    const parts: string[] = []
    let i = 0
    while (i < sorted.length) {
      let j = i
      while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++
      if (j === i) parts.push(String(sorted[i]))
      else parts.push(`${sorted[i]}-${sorted[j]}`)
      i = j + 1
    }
    onChange({ ...block, fragmentId: parts.join(',') })
  }

  const previewFragment =
    fileContent && sourceFile
      ? isIpynb
        ? getFragmentFromIpynb(fileContent, block.fragmentId)
        : getFragmentFromPy(fileContent, block.fragmentId)
      : ''

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Plik źródłowy</label>
        <select
          value={block.sourceFile}
          onChange={(e) => {
            const path = e.target.value
            onChange({
              ...block,
              sourceFile: path,
              sourceType: path.endsWith('.ipynb') ? 'ipynb' : 'py',
              fragmentId: '',
            })
          }}
          className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none text-sm"
        >
          <option value="">Wybierz plik</option>
          {files.map((a) => (
            <option key={a.path} value={a.path}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {!sourceFile && (
        <p className="text-sm text-muted-foreground">Wybierz plik .py lub .ipynb z załączników.</p>
      )}

      {loadError && sourceFile && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Brak pliku</p>
          {onRemoveBlock && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
              onClick={onRemoveBlock}
            >
              Usuń ten blok z widoku
            </Button>
          )}
        </div>
      )}

      {sourceFile && fileContent !== null && !loadError && (
        <>
          {isIpynb ? (
            <div>
              <label className="mb-2 block text-xs text-muted-foreground">
                Komórki (zaznacz do wyświetlenia)
              </label>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-muted/20 p-2 space-y-1">
                {ipynbCells.map((src, idx) => {
                  const preview = src.slice(0, 80).replace(/\n/g, ' ')
                  return (
                    <label
                      key={idx}
                      className="flex items-start gap-2 cursor-pointer rounded px-2 py-1 hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCells.has(idx)}
                        onChange={() => toggleCell(idx)}
                        className="mt-1"
                      />
                      <span className="text-xs font-mono text-muted-foreground">
                        [{idx}] {preview}{preview.length >= 80 ? '…' : ''}
                      </span>
                    </label>
                  )
                })}
              </div>
              {ipynbCells.length === 0 && (
                <p className="text-sm text-muted-foreground">Brak komórek w notebooku.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Collapsible open={fullFileOpen} onOpenChange={setFullFileOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                  {fullFileOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Podgląd pełnego pliku
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono whitespace-pre-wrap break-words">
                    {fileContent}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
              <div>
                <label className="mb-2 block text-xs text-muted-foreground">
                  Fragment (linie 1–{pyLineCount})
                </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="py-mode"
                    checked={!block.fragmentId.trim() || block.fragmentId.toLowerCase() === 'all'}
                    onChange={() => applyPyFragment('all')}
                  />
                  <span className="text-sm">Cały plik</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="py-mode"
                    checked={
                      !!block.fragmentId.trim() &&
                      block.fragmentId.toLowerCase() !== 'all'
                    }
                    onChange={() => applyPyFragment('range')}
                  />
                  <span className="text-sm">Zakres</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={pyLineCount}
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  onBlur={() => applyPyFragment('range')}
                  placeholder="od"
                  className="w-16 rounded border border-border bg-background px-2 py-1 text-sm"
                />
                <span className="text-muted-foreground">–</span>
                <input
                  type="number"
                  min={1}
                  max={pyLineCount}
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  onBlur={() => applyPyFragment('range')}
                  placeholder="do"
                  className="w-16 rounded border border-border bg-background px-2 py-1 text-sm"
                />
              </div>
              </div>
            </div>
          )}

          {previewFragment && (
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Podgląd fragmentu</label>
              <pre className="max-h-40 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono whitespace-pre-wrap break-words">
                {previewFragment}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
