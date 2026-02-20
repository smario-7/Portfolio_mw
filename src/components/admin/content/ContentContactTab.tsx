import {
  Linkedin,
  Facebook,
  Instagram,
  Phone,
  Mail,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import type { ContentData, ContactLink, ContactLinkType } from '@/lib/types'
import { CONTACT_ICONS } from '@/lib/data/contact-icons'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CONTACT_ICON_COMPONENTS: Record<string, LucideIcon> = {
  Linkedin,
  Facebook,
  Instagram,
  Phone,
  Mail,
}

const LINK_TYPES: ContactLinkType[] = [
  'email',
  'phone',
  'linkedin',
  'facebook',
  'instagram',
]

function getContactIcon(type: ContactLinkType): LucideIcon {
  const name = CONTACT_ICONS[type]
  const Icon = CONTACT_ICON_COMPONENTS[name]
  return Icon ?? Mail
}

interface ContentContactTabProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
}

function updateLinks(
  content: ContentData,
  updater: (links: ContactLink[]) => ContactLink[]
): ContentData {
  const links = content.contact.links ?? []
  return {
    ...content,
    contact: { ...content.contact, links: updater(links) },
  }
}

export function ContentContactTab({
  content,
  setContent,
  setHasChanges,
}: ContentContactTabProps) {
  const links = content.contact.links ?? []

  const setLinks = (next: ContactLink[] | ((prev: ContactLink[]) => ContactLink[])) => {
    setContent((prev) =>
      updateLinks(prev, typeof next === 'function' ? next : () => next)
    )
    setHasChanges(true)
  }

  const updateLink = (index: number, patch: Partial<ContactLink>) => {
    setLinks((prev) => {
      const out = [...prev]
      out[index] = { ...out[index], ...patch }
      return out
    })
  }

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const addLink = () => {
    setLinks((prev) => [...prev, { type: 'email', label: '', value: '' }])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
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
              className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
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
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="border-t-2 border-border pt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">
              Linki kontaktowe
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={addLink}>
              Dodaj link
            </Button>
          </div>
          <div className="space-y-4">
            {links.map((link, index) => {
              const Icon = getContactIcon(link.type)
              return (
                <div
                  key={index}
                  className="flex flex-wrap items-start gap-3 rounded-lg border-2 border-border bg-background/50 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border-2 border-border text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-wrap gap-3 sm:flex-nowrap">
                    <div className="w-full sm:w-36">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Typ
                      </label>
                      <Select
                        value={link.type}
                        onValueChange={(value) =>
                          updateLink(index, {
                            type: value as ContactLinkType,
                          })
                        }
                      >
                        <SelectTrigger className="w-full rounded-lg h-9 px-3 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LINK_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Etykieta (opcjonalnie)
                      </label>
                      <input
                        type="text"
                        value={link.label ?? ''}
                        onChange={(e) =>
                          updateLink(index, { label: e.target.value })
                        }
                        placeholder="np. Email służbowy"
                        className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Wartość
                      </label>
                      <input
                        type={link.type === 'email' ? 'email' : 'text'}
                        value={link.value}
                        onChange={(e) =>
                          updateLink(index, { value: e.target.value })
                        }
                        placeholder={
                          link.type === 'phone'
                            ? '+48 123 456 789'
                            : link.type === 'email'
                              ? 'adres@example.com'
                              : 'https://...'
                        }
                        className="w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeLink(index)}
                    aria-label="Usuń link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
            {links.length === 0 && (
              <p className="rounded-lg border-2 border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                Brak linków. Kliknij „Dodaj link”, aby dodać pierwszy.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
