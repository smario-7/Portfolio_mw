import { useState } from 'react'
import type { ContentData } from '@/lib/types'

interface AboutSkillsBlockProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
}

export function AboutSkillsBlock({
  content,
  setContent,
  setHasChanges,
}: AboutSkillsBlockProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSkillByCategory, setNewSkillByCategory] = useState<
    Record<string, string>
  >({})

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name || name in content.about.skills) return
    setContent({
      ...content,
      about: {
        ...content.about,
        skills: { ...content.about.skills, [name]: [] },
      },
    })
    setHasChanges(true)
    setNewCategoryName('')
  }

  const handleRemoveCategory = (category: string) => {
    const { [category]: _, ...rest } = content.about.skills
    setContent({
      ...content,
      about: { ...content.about, skills: rest },
    })
    setHasChanges(true)
    setNewSkillByCategory((prev) => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  const handleAddSkill = (category: string) => {
    const value = (newSkillByCategory[category] ?? '').trim()
    if (!value) return
    const skills = content.about.skills[category] ?? []
    if (skills.includes(value)) return
    const updated = {
      ...content.about.skills,
      [category]: [...skills, value],
    }
    setContent({
      ...content,
      about: { ...content.about, skills: updated },
    })
    setHasChanges(true)
    setNewSkillByCategory((prev) => ({ ...prev, [category]: '' }))
  }

  return (
    <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
      <h2 className="text-xl font-semibold text-foreground">Umiejętności</h2>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
          placeholder="Nazwa kategorii"
          className="rounded border-2 border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <button
          onClick={handleAddCategory}
          className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          Dodaj kategorię
        </button>
      </div>
      <div className="space-y-6">
        {Object.entries(content.about.skills).map(([category, skills]) => (
          <div
            key={category}
            className="space-y-3 rounded-lg border-2 border-border/50 bg-background p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-foreground">{category}</h3>
              <button
                onClick={() => handleRemoveCategory(category)}
                className="text-xs text-destructive transition-opacity hover:opacity-70"
              >
                Usuń kategorię
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newSkillByCategory[category] ?? ''}
                onChange={(e) =>
                  setNewSkillByCategory((prev) => ({
                    ...prev,
                    [category]: e.target.value,
                  }))
                }
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(), handleAddSkill(category))
                }
                placeholder="Nowa umiejętność"
                className="rounded border-2 border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button
                onClick={() => handleAddSkill(category)}
                className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Dodaj
              </button>
            </div>
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
  )
}
