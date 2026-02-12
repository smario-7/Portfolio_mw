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
    experience: Array<{ year: string; title: string; description: string }>
    skills: { [key: string]: string[] }
  }
  contact: {
    title: string
    description: string
    email: string
    phone: string
    github: string
    linkedin: string
  }
}
