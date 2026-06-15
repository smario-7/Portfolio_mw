import {
  Linkedin,
  Facebook,
  Instagram,
  Phone,
  Mail,
} from 'lucide-react'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import type { ContactLinkType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ContactLinkIconProps {
  type: ContactLinkType
  className?: string
}

export function ContactLinkIcon({ type, className }: ContactLinkIconProps) {
  const iconClass = cn(className)

  switch (type) {
    case 'telegram':
      return <TelegramIcon className={iconClass} />
    case 'linkedin':
      return <Linkedin className={iconClass} aria-hidden="true" />
    case 'facebook':
      return <Facebook className={iconClass} aria-hidden="true" />
    case 'instagram':
      return <Instagram className={iconClass} aria-hidden="true" />
    case 'phone':
      return <Phone className={iconClass} aria-hidden="true" />
    case 'email':
      return <Mail className={iconClass} aria-hidden="true" />
    default:
      return <Mail className={iconClass} aria-hidden="true" />
  }
}
