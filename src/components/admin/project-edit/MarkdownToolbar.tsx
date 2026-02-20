import { Bold, Italic, Link2, List, ListOrdered, Code, SquareCode, Pilcrow } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface MarkdownToolbarActions {
  wrapBold: () => void
  wrapItalic: () => void
  wrapLink: () => void
  insertParagraph: () => void
  insertList: () => void
  insertOrderedList: () => void
  wrapInlineCode: () => void
  wrapCodeBlock: (language: string) => void
}

interface MarkdownToolbarProps {
  actions: MarkdownToolbarActions
}

export function MarkdownToolbar({ actions }: MarkdownToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={actions.wrapBold}
        title="Pogrubienie"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={actions.wrapItalic}
        title="Pochylenie"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={actions.wrapLink}
        title="Link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={actions.insertParagraph}
        title="Nowy akapit"
      >
        <Pilcrow className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={actions.insertList}
        title="Wstaw marker listy na początku linii"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={actions.insertOrderedList}
        title="Lista numerowana"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={actions.wrapInlineCode}
        title="Kod inline"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => actions.wrapCodeBlock('js')}
        title="Blok kodu"
      >
        <SquareCode className="h-4 w-4" />
      </Button>
    </div>
  )
}
