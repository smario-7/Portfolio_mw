import type { ContentData } from '@/lib/types'
import { getToolsCatalog } from '@/lib/services/projects-service'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'

interface AboutToolsBlockProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
}

export function AboutToolsBlock({
  content,
  setContent,
  setHasChanges,
}: AboutToolsBlockProps) {
  const catalog = getToolsCatalog()
  const selectedToolIds = content.about.tools ?? []

  const toggleTool = (toolId: string) => {
    const isSelected = selectedToolIds.includes(toolId)
    setContent({
      ...content,
      about: {
        ...content.about,
        tools: isSelected
          ? selectedToolIds.filter((id) => id !== toolId)
          : [...selectedToolIds, toolId],
      },
    })
    setHasChanges(true)
  }

  return (
    <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
      <h2 className="text-xl font-semibold text-foreground">
        Narzędzia i technologie
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedToolIds.map((id) => {
          const tool = catalog.find((t) => t.id === id)
          const label = tool?.name ?? id
          return (
            <div
              key={id}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {label}
              <button
                onClick={() => toggleTool(id)}
                className="transition-opacity hover:opacity-70"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
      <ScrollArea className="h-[260px] rounded-lg border-2 border-border bg-background/50">
        <div className="p-2 space-y-1">
          {catalog.map((tool) => {
            const checked = selectedToolIds.includes(tool.id)
            return (
              <label
                key={tool.id}
                className="flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleTool(tool.id)}
                />
                <span className="text-sm text-foreground">{tool.name}</span>
              </label>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
