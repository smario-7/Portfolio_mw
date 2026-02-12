'use client'

import type { ContentData } from '@/lib/types/content'

interface ContentAboutTabProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
  onAddExperience: () => void
  onRemoveExperience: (index: number) => void
}

export function ContentAboutTab({
  content,
  setContent,
  setHasChanges,
  onAddExperience,
  onRemoveExperience,
}: ContentAboutTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg border border-border bg-card/30 p-6">
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
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Edytor
            </label>
            <div className="rounded-lg border border-border bg-background/50 p-4 text-sm text-muted-foreground">
              Zawartość textarea powyżej
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Podgląd
            </label>
            <div className="rounded-lg border border-border bg-background/50 p-4 text-sm leading-relaxed text-foreground">
              {content.about.introduction}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-border bg-card/30 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Doświadczenie
          </h2>
          <button
            onClick={onAddExperience}
            className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Dodaj +
          </button>
        </div>
        <div className="space-y-4">
          {content.about.experience.map((exp, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-border/50 bg-background p-4"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  value={exp.year}
                  onChange={(e) => {
                    const updated = [...content.about.experience]
                    updated[index] = { ...updated[index], year: e.target.value }
                    setContent({
                      ...content,
                      about: { ...content.about, experience: updated },
                    })
                    setHasChanges(true)
                  }}
                  placeholder="Rok"
                  className="rounded border border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => {
                    const updated = [...content.about.experience]
                    updated[index] = { ...updated[index], title: e.target.value }
                    setContent({
                      ...content,
                      about: { ...content.about, experience: updated },
                    })
                    setHasChanges(true)
                  }}
                  placeholder="Tytuł"
                  className="rounded border border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => {
                  const updated = [...content.about.experience]
                  updated[index] = {
                    ...updated[index],
                    description: e.target.value,
                  }
                  setContent({
                    ...content,
                    about: { ...content.about, experience: updated },
                  })
                  setHasChanges(true)
                }}
                placeholder="Opis"
                rows={2}
                className="w-full rounded border border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button
                onClick={() => onRemoveExperience(index)}
                className="text-xs text-destructive transition-opacity hover:opacity-70"
              >
                Usuń
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">
          Umiejętności techniczne
        </h2>
        <div className="space-y-6">
          {Object.entries(content.about.skills).map(([category, skills]) => (
            <div
              key={category}
              className="space-y-3 rounded-lg border border-border/50 bg-background p-4"
            >
              <h3 className="font-medium text-foreground">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {skill}
                    <button
                      onClick={() => {
                        const updated = { ...content.about.skills }
                        updated[category] = updated[category].filter(
                          (s) => s !== skill
                        )
                        setContent({
                          ...content,
                          about: { ...content.about, skills: updated },
                        })
                        setHasChanges(true)
                      }}
                      className="transition-opacity hover:opacity-70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
