import { useEffect, useRef, useState } from 'react'
import { getPerspectiveMatrix3d, lerp, quadLerp } from '@/lib/utils'
import type { Quad, ScreenQuad, ZoomPhase } from '@/lib/types'

const ZOOM_OPEN_DURATION_MS = 450

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

export interface ZoomTransitionStyle {
  width: number
  height: number
  transform: string
}

export interface UseZoomTransitionOptions {
  onZoomOpenComplete?: () => void
  onZoomCloseComplete?: () => void
}

export function useZoomTransition(
  zoomPhase: ZoomPhase,
  screenQuad: ScreenQuad | null,
  screenSize: { w: number; h: number } | null,
  options: UseZoomTransitionOptions = {}
) {
  const { onZoomOpenComplete, onZoomCloseComplete } = options
  const [openingStyle, setOpeningStyle] = useState<ZoomTransitionStyle | null>(null)
  const [closingStyle, setClosingStyle] = useState<ZoomTransitionStyle | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const rafIdClosingRef = useRef<number | null>(null)
  const onZoomOpenCompleteRef = useRef(onZoomOpenComplete)
  const onZoomCloseCompleteRef = useRef(onZoomCloseComplete)
  onZoomOpenCompleteRef.current = onZoomOpenComplete
  onZoomCloseCompleteRef.current = onZoomCloseComplete

  useEffect(() => {
    if (zoomPhase !== 'opening' || !screenQuad || !screenSize || !onZoomOpenCompleteRef.current)
      return
    /* Animacja otwarcia: interpolacja od prostokąta ekranu tabletu do pełnego viewportu (macierz perspektywy + easing). */
    const startQuad: Quad = [
      { x: screenQuad.p1.x, y: screenQuad.p1.y },
      { x: screenQuad.p2.x, y: screenQuad.p2.y },
      { x: screenQuad.p3.x, y: screenQuad.p3.y },
      { x: screenQuad.p4.x, y: screenQuad.p4.y },
    ]
    const startSize = { w: screenSize.w, h: screenSize.h }
    const vw = window.innerWidth
    const vh = window.innerHeight
    const viewportQuad: Quad = [
      { x: 0, y: 0 },
      { x: vw, y: 0 },
      { x: vw, y: vh },
      { x: 0, y: vh },
    ]
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / ZOOM_OPEN_DURATION_MS)
      const eased = easeOutQuad(progress)
      const interpQuad = quadLerp(startQuad, viewportQuad, eased)
      const interpW = lerp(startSize.w, vw, eased)
      const interpH = lerp(startSize.h, vh, eased)
      const srcQuad: Quad = [
        { x: 0, y: 0 },
        { x: interpW, y: 0 },
        { x: interpW, y: interpH },
        { x: 0, y: interpH },
      ]
      const matrix = getPerspectiveMatrix3d(srcQuad, interpQuad)
      if (matrix) {
        setOpeningStyle({
          width: interpW,
          height: interpH,
          transform: matrix,
        })
      }
      if (progress >= 1) {
        onZoomOpenCompleteRef.current?.()
        rafIdRef.current = null
        return
      }
      rafIdRef.current = requestAnimationFrame(tick)
    }
    rafIdRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [zoomPhase])

  useEffect(() => {
    if (zoomPhase !== 'opening') setOpeningStyle(null)
  }, [zoomPhase])

  useEffect(() => {
    if (zoomPhase !== 'closing' || !screenQuad || !screenSize) return
    const endQuad: Quad = [
      { x: screenQuad.p1.x, y: screenQuad.p1.y },
      { x: screenQuad.p2.x, y: screenQuad.p2.y },
      { x: screenQuad.p3.x, y: screenQuad.p3.y },
      { x: screenQuad.p4.x, y: screenQuad.p4.y },
    ]
    const endSize = { w: screenSize.w, h: screenSize.h }
    const vw = window.innerWidth
    const vh = window.innerHeight
    const viewportQuad: Quad = [
      { x: 0, y: 0 },
      { x: vw, y: 0 },
      { x: vw, y: vh },
      { x: 0, y: vh },
    ]
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / ZOOM_OPEN_DURATION_MS)
      const eased = easeOutQuad(progress)
      const interpQuad = quadLerp(viewportQuad, endQuad, eased)
      const interpW = lerp(vw, endSize.w, eased)
      const interpH = lerp(vh, endSize.h, eased)
      const srcQuad: Quad = [
        { x: 0, y: 0 },
        { x: interpW, y: 0 },
        { x: interpW, y: interpH },
        { x: 0, y: interpH },
      ]
      const matrix = getPerspectiveMatrix3d(srcQuad, interpQuad)
      if (matrix) {
        setClosingStyle({
          width: interpW,
          height: interpH,
          transform: matrix,
        })
      }
      if (progress >= 1) {
        onZoomCloseCompleteRef.current?.()
        rafIdClosingRef.current = null
        return
      }
      rafIdClosingRef.current = requestAnimationFrame(tick)
    }
    rafIdClosingRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafIdClosingRef.current != null) {
        cancelAnimationFrame(rafIdClosingRef.current)
        rafIdClosingRef.current = null
      }
    }
  }, [zoomPhase])

  useEffect(() => {
    if (zoomPhase !== 'closing') setClosingStyle(null)
  }, [zoomPhase])

  return { openingStyle, closingStyle }
}
