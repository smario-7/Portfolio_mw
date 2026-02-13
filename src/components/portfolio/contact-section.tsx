import {
  Linkedin,
  Facebook,
  Instagram,
  Phone,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { CONTACT_ICONS } from '@/lib/data/contact-icons'
import type { ContactLinkType } from '@/lib/types/content'

const CONTACT_ICON_COMPONENTS: Record<string, LucideIcon> = {
  Linkedin,
  Facebook,
  Instagram,
  Phone,
  Mail,
}

const DEFAULT_LABELS: Record<ContactLinkType, string> = {
  email: 'Email',
  phone: 'Telefon',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
}

function getContactIcon(type: ContactLinkType): LucideIcon {
  const name = CONTACT_ICONS[type]
  const Icon = CONTACT_ICON_COMPONENTS[name]
  return Icon ?? Mail
}

function getLinkHref(link: { type: ContactLinkType; value: string }): string {
  if (link.type === 'email') return `mailto:${link.value}`
  if (link.type === 'phone') return `tel:${link.value}`
  return link.value
}

function isExternalLink(type: ContactLinkType): boolean {
  return type === 'linkedin' || type === 'facebook' || type === 'instagram'
}

export function ContactSection() {
  const { content } = usePortfolio()
  const contact = content.contact
  const title = contact.title?.trim() || 'Skontaktuj się'
  const description = contact.description?.trim() || ''
  const links = contact.links ?? []

  return (
    <section className="space-y-8">
      <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
        {title}
      </h2>

      <div className="space-y-8">
        {description && (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        <div className="space-y-6">
          {links.length > 0 && (
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <h3 className="mb-4 text-lg font-semibold">Bezpośrednie linki</h3>
              <div className="space-y-3">
                {links.map((link, index) => {
                  const Icon = getContactIcon(link.type)
                  const href = getLinkHref(link)
                  const label = link.label?.trim() || DEFAULT_LABELS[link.type]
                  const external = isExternalLink(link.type)
                  return (
                    <a
                      key={`${link.type}-${index}`}
                      href={href}
                      className="hover-lift-sm flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all hover:border-primary/30 hover:bg-card"
                      {...(external && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <div className="font-medium">{label}</div>
                        <div className="truncate text-sm text-muted-foreground">
                          {link.value}
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card/50 p-6">
            <h3 className="mb-4 text-lg font-semibold">Forma kontaktu</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Twoje imię"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="email"
                placeholder="Twój email"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <textarea
                placeholder="Twoja wiadomość"
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                Wyślij wiadomość
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
