export type ContactLinkType = 'linkedin' | 'facebook' | 'instagram' | 'phone' | 'email'

export interface ContactLink {
  type: ContactLinkType
  label?: string
  value: string
}

export interface AboutTile {
  id: string
  title: string
  description: string
  icon?: string
}

export interface ToolItem {
  id: string
  name: string
  icon: string
}

export interface ContentData {
  home: {
    heroTitle: string
    heroSubtitle: string
    heroDescription: string
    button1Text: string
    button2Text: string
    projectsTitle: string
    projectsDescription: string
    skills: string[]
  }
  about: {
    introduction: string
    courses: Array<{
      courseName: string
      description: string
      completionDate: { year: number; month: number }
    }>
    skills: { [key: string]: string[] }
    tools?: string[]
  }
  contact: {
    title: string
    description: string
    email: string
    phone: string
    github: string
    linkedin: string
    links?: ContactLink[]
  }
}
