
import type { ContentData } from '@/lib/types'

interface ContentHomeTabProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
  skillInput: string
  setSkillInput: (value: string) => void
  onAddSkill: () => void
  onRemoveSkill: (skill: string) => void
}

export function ContentHomeTab({
  content,
  setContent,
  setHasChanges,
  skillInput,
  setSkillInput,
  onAddSkill,
  onRemoveSkill,
}: ContentHomeTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">Sekcja Hero</h2>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Nagłówek główny
          </label>
          <input
            type="text"
            value={content.home.heroTitle}
            onChange={(e) => {
              setContent({
                ...content,
                home: { ...content.home, heroTitle: e.target.value },
              })
              setHasChanges(true)
            }}
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Podnagłówek
          </label>
          <input
            type="text"
            value={content.home.heroSubtitle}
            onChange={(e) => {
              setContent({
                ...content,
                home: { ...content.home, heroSubtitle: e.target.value },
              })
              setHasChanges(true)
            }}
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Krótki opis
          </label>
          <textarea
            value={content.home.heroDescription}
            onChange={(e) => {
              setContent({
                ...content,
                home: { ...content.home, heroDescription: e.target.value },
              })
              setHasChanges(true)
            }}
            rows={4}
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Tekst przycisku 1
            </label>
            <input
              type="text"
              value={content.home.button1Text}
              onChange={(e) => {
                setContent({
                  ...content,
                  home: { ...content.home, button1Text: e.target.value },
                })
                setHasChanges(true)
              }}
              className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Tekst przycisku 2
            </label>
            <input
              type="text"
              value={content.home.button2Text}
              onChange={(e) => {
                setContent({
                  ...content,
                  home: { ...content.home, button2Text: e.target.value },
                })
                setHasChanges(true)
              }}
              className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">
          Sekcja &quot;Wybrane projekty&quot;
        </h2>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Tytuł sekcji
          </label>
          <input
            type="text"
            value={content.home.projectsTitle}
            onChange={(e) => {
              setContent({
                ...content,
                home: { ...content.home, projectsTitle: e.target.value },
              })
              setHasChanges(true)
            }}
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Krótki opis
          </label>
          <textarea
            value={content.home.projectsDescription}
            onChange={(e) => {
              setContent({
                ...content,
                home: { ...content.home, projectsDescription: e.target.value },
              })
              setHasChanges(true)
            }}
            rows={3}
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">Umiejętności</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onAddSkill()
                e.preventDefault()
              }
            }}
            placeholder="Dodaj umiejętność..."
            className="flex-1 rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
          <button
            onClick={onAddSkill}
            className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Dodaj
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.home.skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {skill}
              <button
                onClick={() => onRemoveSkill(skill)}
                className="transition-opacity hover:opacity-70"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
