import type { ContactLinkType } from '@/lib/types'

export const CONTACT_LINK_TYPE_LABELS: Record<ContactLinkType, string> = {
  email: 'Email',
  phone: 'Telefon',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  telegram: 'Telegram',
}

function normalizeTelegramUrl(value: string): string {
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('t.me/')) return `https://${trimmed}`
  const username = trimmed.replace(/^@/, '')
  return `https://t.me/${username}`
}

export function getContactLinkHref(link: {
  type: ContactLinkType
  value: string
}): string {
  const value = link.value.trim()
  if (link.type === 'email') return `mailto:${value}`
  if (link.type === 'phone') return `tel:${value}`
  if (link.type === 'telegram') return normalizeTelegramUrl(value)
  return value
}

export function isExternalContactLink(type: ContactLinkType): boolean {
  return (
    type === 'linkedin' ||
    type === 'facebook' ||
    type === 'instagram' ||
    type === 'telegram'
  )
}

export function getContactLinkPlaceholder(type: ContactLinkType): string {
  switch (type) {
    case 'phone':
      return '+48 123 456 789'
    case 'email':
      return 'adres@example.com'
    case 'telegram':
      return '@username lub https://t.me/username'
    default:
      return 'https://...'
  }
}
