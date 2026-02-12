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

export type ProjectCategory = 'Frontend' | 'Backend' | 'AI' | 'Analiza Danych'

export type ProjectFilter = 'Wszystkie' | ProjectCategory

export interface Project {
  id: number
  title: string
  description: string
  category: ProjectCategory
  stack: string[]
  image?: string
  github: string
  demo: string
  color?: string
  fullDescription?: string
}
