
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ScreenQuad } from '@/lib/types'

export function useTabletScreenQuad() {
  const [screenQuad, setScreenQuad] = useState<ScreenQuad | null>(null)
  const [screenSize, setScreenSize] = useState<{ w: number; h: number } | null>(null)
  const tabletContainerRef = useRef<HTMLDivElement>(null)
  const tabletFrameRef = useRef<HTMLDivElement>(null)
  const tabletScreenRef = useRef<HTMLDivElement>(null)
  const corner1Ref = useRef<HTMLDivElement>(null)
  const corner2Ref = useRef<HTMLDivElement>(null)
  const corner3Ref = useRef<HTMLDivElement>(null)
  const corner4Ref = useRef<HTMLDivElement>(null)

  const measureScreenQuad = useCallback(() => {
    const c1 = corner1Ref.current
    const c2 = corner2Ref.current
    const c3 = corner3Ref.current
    const c4 = corner4Ref.current
    if (!c1 || !c2 || !c3 || !c4) return
    const r1 = c1.getBoundingClientRect()
    const r2 = c2.getBoundingClientRect()
    const r3 = c3.getBoundingClientRect()
    const r4 = c4.getBoundingClientRect()
    setScreenQuad({
      p1: { x: r1.left, y: r1.top },
      p2: { x: r2.left, y: r2.top },
      p3: { x: r3.left, y: r3.top },
      p4: { x: r4.left, y: r4.top },
    })
    const screenEl = tabletScreenRef.current
    if (screenEl) {
      setScreenSize({ w: screenEl.offsetWidth, h: screenEl.offsetHeight })
    }
  }, [])

  useEffect(() => {
    measureScreenQuad()
    const frameEl = tabletFrameRef.current
    const ro = frameEl ? new ResizeObserver(measureScreenQuad) : null
    if (ro && frameEl) ro.observe(frameEl)
    const onResize = () => measureScreenQuad()
    window.addEventListener('resize', onResize)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [measureScreenQuad])

  const isPointInQuad = useCallback((q: ScreenQuad, x: number, y: number) => {
    const { p1, p2, p3, p4 } = q
    const pts = [p1, p2, p3, p4]
    let inside = false
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i].x
      const yi = pts[i].y
      const xj = pts[j].x
      const yj = pts[j].y
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
    return inside
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = tabletContainerRef.current
      if (!container) return
      if (!screenQuad) return
      if (!isPointInQuad(screenQuad, e.clientX, e.clientY)) return
      e.preventDefault()
      const maxScroll = container.scrollHeight - container.clientHeight
      const scrollSpeed = 3
      container.scrollTop = Math.max(0, Math.min(container.scrollTop + e.deltaY * scrollSpeed, maxScroll))
    }
    document.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => document.removeEventListener('wheel', handleWheel, { capture: true })
  }, [screenQuad, isPointInQuad])

  return {
    tabletContainerRef,
    tabletFrameRef,
    tabletScreenRef,
    corner1Ref,
    corner2Ref,
    corner3Ref,
    corner4Ref,
    screenQuad,
    screenSize,
  }
}
