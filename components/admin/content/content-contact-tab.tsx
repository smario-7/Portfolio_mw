'use client'

import type { ContentData } from '@/lib/types/content'

interface ContentContactTabProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
}

export function ContentContactTab({
  content,
  setContent,
  setHasChanges,
}: ContentContactTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg border border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">
          Informacje kontaktowe
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Tytuł sekcji
            </label>
            <input
              type="text"
              value={content.contact.title}
              onChange={(e) => {
                setContent({
                  ...content,
                  contact: { ...content.contact, title: e.target.value },
                })
                setHasChanges(true)
              }}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) => {
                setContent({
                  ...content,
                  contact: { ...content.contact, email: e.target.value },
                })
                setHasChanges(true)
              }}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Opis
          </label>
          <textarea
            value={content.contact.description}
            onChange={(e) => {
              setContent({
                ...content,
                contact: { ...content.contact, description: e.target.value },
              })
              setHasChanges(true)
            }}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Telefon (opcjonalnie)
            </label>
            <input
              type="tel"
              value={content.contact.phone}
              onChange={(e) => {
                setContent({
                  ...content,
                  contact: { ...content.contact, phone: e.target.value },
                })
                setHasChanges(true)
              }}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Link GitHub
            </label>
            <input
              type="url"
              value={content.contact.github}
              onChange={(e) => {
                setContent({
                  ...content,
                  contact: { ...content.contact, github: e.target.value },
                })
                setHasChanges(true)
              }}
              placeholder="https://github.com/..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Link LinkedIn
            </label>
            <input
              type="url"
              value={content.contact.linkedin}
              onChange={(e) => {
                setContent({
                  ...content,
                  contact: { ...content.contact, linkedin: e.target.value },
                })
                setHasChanges(true)
              }}
              placeholder="https://linkedin.com/..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
