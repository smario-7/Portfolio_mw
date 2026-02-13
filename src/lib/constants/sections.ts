export const VALID_SECTIONS = ['home', 'about', 'contact'] as const

export type Section = (typeof VALID_SECTIONS)[number]

export const CONTENT_SECTIONS = VALID_SECTIONS
