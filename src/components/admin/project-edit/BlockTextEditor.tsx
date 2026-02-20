import { useState, useRef } from 'react'
import { MarkdownContent, FULL_DESCRIPTION_MARKDOWN_CLASS } from '@/components/markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTextareaFormatting } from '@/hooks/use-textarea-formatting'
import { MarkdownToolbar } from './MarkdownToolbar'

interface BlockTextEditorProps {
  value: string
  onChange: (content: string) => void
}

export function BlockTextEditor({ value, onChange }: BlockTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const actions = useTextareaFormatting(textareaRef, onChange, () =>
    setActiveTab('edit')
  )

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
        <TabsContent value="edit" className="mt-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            className="w-full resize-y rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none text-sm font-mono"
            placeholder="Treść w Markdown (pogrubienie: **tekst**, link: [opis](url))"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2 min-h-[120px]">
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
