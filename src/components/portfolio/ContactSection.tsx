import { ContactLinkIcon } from '@/components/contact-link-icon'
import { useContent } from '@/contexts/PortfolioContext'
import {
  CONTACT_LINK_TYPE_LABELS,
  getContactLinkHref,
  isExternalContactLink,
} from '@/lib/utils/contact-link-url'
import { useContactForm } from '@/hooks/use-contact-form'
import { ContactRateLimitModal } from '@/components/portfolio/ContactRateLimitModal'
import { ProfanityWarningModal } from '@/components/portfolio/ProfanityWarningModal'
import { Textarea } from '@/components/ui/textarea'
import { CONTACT_FORM_LIMITS } from '@/lib/constants/contact-form-limits'

const DEFAULT_LABELS = CONTACT_LINK_TYPE_LABELS

function getCounterColor(count: number, max: number): string {
  if (count > max) {
    return 'text-destructive'
  }
  if (count >= max * 0.8) {
    return 'text-orange-500'
  }
  return 'text-muted-foreground'
}

export function ContactSection() {
  const { content } = useContent()
  const contact = content.contact
  const title = contact.title?.trim() || 'Skontaktuj się'
  const description = contact.description?.trim() || ''
  const links = contact.links ?? []

  const {
    name,
    email,
    message,
    isSubmitting,
    errors,
    submitSuccess,
    rateLimitModalOpen,
    setRateLimitModalOpen,
    profanityModalOpen,
    profanityFields,
    setProfanityModalOpen,
    setName,
    setEmail,
    setMessage,
    handleSubmit,
  } = useContactForm()

  return (
    <section className="space-y-8">
      <ContactRateLimitModal
        open={rateLimitModalOpen}
        onOpenChange={setRateLimitModalOpen}
      />
      <ProfanityWarningModal
        open={profanityModalOpen}
        onOpenChange={setProfanityModalOpen}
        profanityFields={profanityFields}
      />
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
                  const href = getContactLinkHref(link)
                  const label = link.label?.trim() || DEFAULT_LABELS[link.type]
                  const external = isExternalContactLink(link.type)
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
                      <ContactLinkIcon
                        type={link.type}
                        className="h-5 w-5 shrink-0 text-primary"
                      />
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
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Twoje imię"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={CONTACT_FORM_LIMITS.NAME_MAX}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex justify-between items-center">
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                  <p className={`text-sm text-right ${getCounterColor(name.length, CONTACT_FORM_LIMITS.NAME_MAX)}`}>
                    {name.length}/{CONTACT_FORM_LIMITS.NAME_MAX}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Twój email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={CONTACT_FORM_LIMITS.EMAIL_MAX}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex justify-between items-center">
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                  <p className={`text-sm text-right ${getCounterColor(email.length, CONTACT_FORM_LIMITS.EMAIL_MAX)}`}>
                    {email.length}/{CONTACT_FORM_LIMITS.EMAIL_MAX}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  spellCheck
                  placeholder="Twoja wiadomość"
                  rows={4}
                  maxLength={CONTACT_FORM_LIMITS.MESSAGE_MAX}
                  className="w-full resize-y min-h-16 rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex justify-between items-center">
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                  <p className={`text-sm text-right ${getCounterColor(message.length, CONTACT_FORM_LIMITS.MESSAGE_MAX)}`}>
                    {message.length}/{CONTACT_FORM_LIMITS.MESSAGE_MAX}
                  </p>
                </div>
              </div>
              {errors.profanity && (
                <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-3 text-sm">
                  {errors.profanity}
                </div>
              )}
              {submitSuccess && (
                <p className="text-sm text-green-500">
                  Wiadomość została wysłana!
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
