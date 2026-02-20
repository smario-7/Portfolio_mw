export interface Point {
  x: number
  y: number
}

export type Quad = [Point, Point, Point, Point]

export interface ScreenQuad {
  p1: Point
  p2: Point
  p3: Point
  p4: Point
}

export type ZoomPhase =
  | 'idle'
  | 'opening'
  | 'open'
  | 'openWithSidebar'
  | 'closingSidebar'
  | 'closing'

export type {
  ProjectCategory,
  ProjectFilter,
  AttachmentType,
  ProjectAttachment,
  ProjectDownloadLinks,
  Project,
  ProjectDetailBlock,
  BlockText,
  BlockScreenshot,
  BlockCode,
} from './types/project'

export type {
  ContactMessage,
  ContactMessageInsert,
  ContactMessageUpdate,
} from './types/contact-message'

export type {
  AdminSettings,
  AdminSettingsInsert,
  AdminSettingsUpdate,
} from './types/admin-settings'

export type {
  ContactLinkType,
  ContactLink,
  AboutTile,
  ToolItem,
  Course,
  ContentData,
} from './types/content'
