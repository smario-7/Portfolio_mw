import { useState, useRef, useEffect } from 'react'
import { MarkdownContent, FULL_DESCRIPTION_MARKDOWN_CLASS } from '@/components/markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTextareaFormatting } from '@/hooks/use-textarea-formatting'
import { handleEnterInList } from '@/lib/utils/textarea-formatting'
import { MarkdownToolbar } from './MarkdownToolbar'

const MARKDOWN_EDITOR_HEIGHT_KEY = 'portfolio-markdown-editor-height'
const DEFAULT_HEIGHT = 220
const MIN_HEIGHT = 80
const MAX_HEIGHT = 800
const RESIZE_IGNORE_SMALLER_THAN_PX = 20

function clampHeight(value: number): number {
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, value))
}

function getInitialHeight(): number {
  if (typeof window === 'undefined') return DEFAULT_HEIGHT
  try {
    const raw = localStorage.getItem(MARKDOWN_EDITOR_HEIGHT_KEY)
    if (raw == null) return DEFAULT_HEIGHT
    const n = parseInt(raw, 10)
    return Number.isFinite(n) ? clampHeight(n) : DEFAULT_HEIGHT
  } catch {
    return DEFAULT_HEIGHT
  }
}

interface BlockTextEditorProps {
  value: string
  onChange: (content: string) => void
}

export function BlockTextEditor({ value, onChange }: BlockTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [editorHeight, setEditorHeight] = useState<number>(getInitialHeight)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const actions = useTextareaFormatting(textareaRef, onChange, () =>
    setActiveTab('edit')
  )

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const h = clampHeight(entry.contentRect.height)
      setEditorHeight((prev) => {
        if (prev - h > RESIZE_IGNORE_SMALLER_THAN_PX) return prev
        try {
          localStorage.setItem(MARKDOWN_EDITOR_HEIGHT_KEY, String(h))
        } catch {
          // localStorage niedostępny (prywatny tryb, quota)
        }
        return h
      })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground">Treść bloku (Markdown)</label>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
        <div className="flex items-center justify-between gap-2">
          <MarkdownToolbar actions={actions} />
          <TabsList className="h-8">
            <TabsTrigger value="edit" className="text-xs">
              Edycja
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Podgląd
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="edit" className="mt-2 data-[state=inactive]:hidden" forceMount>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || !textareaRef.current) return
              const result = handleEnterInList(textareaRef.current)
              if (result.handled && result.newValue != null && result.newCursor != null) {
                e.preventDefault()
                onChange(result.newValue)
                setActiveTab('edit')
                requestAnimationFrame(() => {
                  textareaRef.current?.setSelectionRange(result.newCursor!, result.newCursor!)
                })
              }
            }}
            style={{ height: `${editorHeight}px` }}
            className="w-full resize-y rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none text-sm font-mono"
            placeholder="Treść w Markdown (pogrubienie: **tekst**, link: [opis](url))"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2" style={{ minHeight: `${editorHeight}px` }}>
          <div className="rounded-lg border-2 border-border bg-muted/20 p-4 text-sm">
            {value.trim() ? (
              <MarkdownContent content={value} className={FULL_DESCRIPTION_MARKDOWN_CLASS} />
            ) : (
              <span className="text-muted-foreground">Brak treści do podglądu.</span>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
