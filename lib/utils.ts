import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Point, Quad } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DET_EPSILON = 1e-12

function solve8x8(A: number[][], b: number[]): number[] | null {
  const n = 8
  const aug: number[][] = A.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col++) {
    let maxRow = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row
    }
    ;[aug[col], aug[maxRow]] = [aug[maxRow], aug[col]]
    const pivot = aug[col][col]
    if (Math.abs(pivot) < DET_EPSILON) return null
    for (let c = 0; c <= n; c++) aug[col][c] /= pivot
    for (let row = 0; row < n; row++) {
      if (row === col) continue
      const f = aug[row][col]
      for (let c = 0; c <= n; c++) aug[row][c] -= f * aug[col][c]
    }
  }
  return aug.map((row) => row[n])
}

/**
 * Oblicza macierz homografii 2D (DLT) z 4 par punktów; zwraca wartość CSS
 * transform: matrix3d(...) w kolejności column-major. Przy zdegenerowanym
 * czworokącie (np. współliniowe punkty) zwraca null.
 */
export function getPerspectiveMatrix3d(srcQuad: Quad, destQuad: Quad): string | null {
  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 4; i++) {
    const x = srcQuad[i].x
    const y = srcQuad[i].y
    const xp = destQuad[i].x
    const yp = destQuad[i].y
    A.push([x, y, 1, 0, 0, 0, -xp * x, -xp * y])
    b.push(xp)
    A.push([0, 0, 0, x, y, 1, -yp * x, -yp * y])
    b.push(yp)
  }
  const h = solve8x8(A, b)
  if (!h || h.some((v) => !Number.isFinite(v))) return null
  const [h00, h01, h02, h10, h11, h12, h20, h21] = h
  const h22 = 1
  return `matrix3d(${h00}, ${h10}, 0, ${h20}, ${h01}, ${h11}, 0, ${h21}, 0, 0, 1, 0, ${h02}, ${h12}, 0, ${h22})`
}
