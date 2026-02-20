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

export type ZoomPhase = 'idle' | 'opening' | 'open' | 'closing'

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
