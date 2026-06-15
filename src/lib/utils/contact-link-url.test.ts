import { describe, expect, it } from 'vitest'
import {
  getContactLinkHref,
  isExternalContactLink,
} from '@/lib/utils/contact-link-url'

describe('getContactLinkHref', () => {
  it('builds mailto for email', () => {
    expect(getContactLinkHref({ type: 'email', value: 'test@example.com' })).toBe(
      'mailto:test@example.com'
    )
  })

  it('builds tel for phone', () => {
    expect(getContactLinkHref({ type: 'phone', value: '+48123456789' })).toBe(
      'tel:+48123456789'
    )
  })

  it('normalizes telegram username', () => {
    expect(getContactLinkHref({ type: 'telegram', value: '@mariooo0' })).toBe(
      'https://t.me/mariooo0'
    )
  })

  it('normalizes telegram t.me path', () => {
    expect(getContactLinkHref({ type: 'telegram', value: 't.me/mariooo0' })).toBe(
      'https://t.me/mariooo0'
    )
  })

  it('keeps full telegram url', () => {
    expect(
      getContactLinkHref({ type: 'telegram', value: 'https://t.me/mariooo0' })
    ).toBe('https://t.me/mariooo0')
  })
})

describe('isExternalContactLink', () => {
  it('treats telegram as external', () => {
    expect(isExternalContactLink('telegram')).toBe(true)
  })

  it('treats email as internal protocol link', () => {
    expect(isExternalContactLink('email')).toBe(false)
  })
})
