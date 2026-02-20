export type ProjectCategory = 'Frontend' | 'Backend' | 'AI' | 'Analiza Danych' | 'Full Stack'

export type ProjectFilter = 'Wszystkie' | ProjectCategory

export type AttachmentType = 'pdf' | 'ipynb' | 'md' | 'py'

export interface ProjectAttachment {
  label: string
  path: string
  type?: AttachmentType
}

export interface BlockText {
  type: 'text'
  content: string
}

export interface BlockScreenshot {
  type: 'screenshot'
  path: string
  alt?: string
}

export interface BlockCode {
  type: 'code'
  sourceFile: string
  sourceType: 'py' | 'ipynb'
  fragmentId: string
  language?: string
}

export type ProjectDetailBlock = BlockText | BlockScreenshot | BlockCode

export interface ProjectDownloadLinks {
  pdf?: string
  ipynb?: string
  md?: string
  image?: string
}

export interface Project {
  id: number
  title: string
  description: string
  category: ProjectCategory
  stack: string[]
  image?: string
  github: string
  demo: string
  color?: string | null
  fullDescription?: ProjectDetailBlock[]
  attachments?: ProjectAttachment[]
  downloadLinks?: ProjectDownloadLinks
  order?: number
  status?: 'draft' | 'published'
  featured?: boolean
  created_at?: string
  updated_at?: string
}
