import type { ContentData } from '@/lib/types'

interface AboutIntroductionBlockProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
}

export function AboutIntroductionBlock({
  content,
  setContent,
  setHasChanges,
}: AboutIntroductionBlockProps) {
  return (
    <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
      <h2 className="text-xl font-semibold text-foreground">Wprowadzenie</h2>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Tekst wprowadzenia
        </label>
        <textarea
          value={content.about.introduction}
          onChange={(e) => {
            setContent({
              ...content,
              about: { ...content.about, introduction: e.target.value },
            })
            setHasChanges(true)
          }}
          rows={6}
          className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Edytor
          </label>
          <div className="rounded-lg border-2 border-border bg-background/50 p-4 text-sm text-muted-foreground">
            Zawartość textarea powyżej
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Podgląd
          </label>
          <div className="rounded-lg border-2 border-border bg-background/50 p-4 text-sm leading-relaxed text-foreground">
            {content.about.introduction}
          </div>
        </div>
      </div>
    </div>
  )
}
