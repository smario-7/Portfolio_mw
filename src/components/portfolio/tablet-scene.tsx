import { useEffect, useRef, useState } from 'react'
import type { RefObject, ReactNode } from 'react'
import { getPerspectiveMatrix3d, lerp, quadLerp } from '@/lib/utils'
import type { Quad, ScreenQuad, ZoomPhase } from '@/lib/types'

const ZOOM_OPEN_DURATION_MS = 450

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

interface TabletSceneProps {
  tabletContainerRef: RefObject<HTMLDivElement | null>
  tabletFrameRef: RefObject<HTMLDivElement | null>
  tabletScreenRef: RefObject<HTMLDivElement | null>
  corner1Ref: RefObject<HTMLDivElement | null>
  corner2Ref: RefObject<HTMLDivElement | null>
  corner3Ref: RefObject<HTMLDivElement | null>
  corner4Ref: RefObject<HTMLDivElement | null>
  screenQuad: ScreenQuad | null
  screenSize: { w: number; h: number } | null
  screenOn: boolean
  projectsZoomOpen?: boolean
  zoomPhase?: ZoomPhase
  onZoomOpenComplete?: () => void
  onZoomCloseComplete?: () => void
  children: ReactNode
}

export function TabletScene({
  tabletContainerRef,
  tabletFrameRef,
  tabletScreenRef,
  corner1Ref,
  corner2Ref,
  corner3Ref,
  corner4Ref,
  screenQuad,
  screenSize,
  screenOn,
  projectsZoomOpen = false,
  zoomPhase = 'idle',
  onZoomOpenComplete,
  onZoomCloseComplete,
  children,
}: TabletSceneProps) {
  const [openingStyle, setOpeningStyle] = useState<{
    width: number
    height: number
    transform: string
  } | null>(null)
  const [closingStyle, setClosingStyle] = useState<{
    width: number
    height: number
    transform: string
  } | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const rafIdClosingRef = useRef<number | null>(null)
  const onZoomOpenCompleteRef = useRef(onZoomOpenComplete)
  const onZoomCloseCompleteRef = useRef(onZoomCloseComplete)
  onZoomOpenCompleteRef.current = onZoomOpenComplete
  onZoomCloseCompleteRef.current = onZoomCloseComplete

  useEffect(() => {
    if (zoomPhase !== 'opening' || !screenQuad || !screenSize || !onZoomOpenCompleteRef.current) return
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
    // Celowo tylko zoomPhase – zmiana screenQuad/screenSize w trakcie animacji (np. ResizeObserver) nie może restartować animacji.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Celowo tylko zoomPhase – zmiana screenQuad/screenSize w trakcie animacji nie może restartować animacji.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomPhase])

  useEffect(() => {
    if (zoomPhase !== 'closing') setClosingStyle(null)
  }, [zoomPhase])

  const isZoomActive = projectsZoomOpen && zoomPhase !== 'idle'
  const contentScreenZIndex = isZoomActive ? 40 : 11

  const tabletFrame = (
    <div ref={tabletFrameRef} className="tablet-frame" role="presentation">
      <div ref={tabletScreenRef} className="tablet-screen">
        <div
          ref={corner1Ref}
          className="absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          aria-hidden
        />
        <div
          ref={corner2Ref}
          className="absolute right-0 top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          aria-hidden
        />
        <div
          ref={corner3Ref}
          className="absolute right-0 bottom-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          aria-hidden
        />
        <div
          ref={corner4Ref}
          className="absolute left-0 bottom-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          aria-hidden
        />
      </div>
    </div>
  )

  if (!screenQuad || !screenSize) {
    return <>{tabletFrame}</>
  }

  if (zoomPhase === 'open' || zoomPhase === 'closing') {
    const fullscreenStyle = {
      width: '100vw' as const,
      height: '100vh' as const,
      transform: 'none' as const,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
    }
    const style =
      zoomPhase === 'closing' && closingStyle
        ? {
            width: closingStyle.width,
            height: closingStyle.height,
            transformOrigin: '0 0' as const,
            transform: closingStyle.transform,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
          }
        : fullscreenStyle
    return (
      <>
        <div
          className="tablet-content-screen fixed left-0 top-0 overflow-hidden bg-[var(--background)]"
          style={{
            zIndex: contentScreenZIndex,
            ...style,
          }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (
              !target.closest(
                'a, button, [role="button"], input, [tabindex]:not([tabindex="-1"])'
              )
            ) {
              tabletContainerRef.current?.focus()
            }
          }}
        >
          <div
            className="tablet-screen-zoom h-full w-full"
            style={{
              transform: 'scale(1)',
              opacity: 1,
              pointerEvents: 'auto',
            }}
          >
            <div
              ref={tabletContainerRef}
              className="tablet-container h-full w-full overflow-x-hidden overflow-y-scroll"
              tabIndex={0}
            >
              {children}
            </div>
          </div>
        </div>
        {tabletFrame}
      </>
    )
  }

  const idleMatrix = getPerspectiveMatrix3d(
    [
      { x: 0, y: 0 },
      { x: screenSize.w, y: 0 },
      { x: screenSize.w, y: screenSize.h },
      { x: 0, y: screenSize.h },
    ],
    [screenQuad.p1, screenQuad.p2, screenQuad.p3, screenQuad.p4]
  )

  const style =
    zoomPhase === 'opening' && openingStyle
      ? {
          width: openingStyle.width,
          height: openingStyle.height,
          transformOrigin: '0 0' as const,
          transform: openingStyle.transform,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
        }
      : (zoomPhase === 'idle' || (zoomPhase === 'opening' && !openingStyle)) && idleMatrix
        ? {
            width: screenSize.w,
            height: screenSize.h,
            transformOrigin: '0 0' as const,
            transform: idleMatrix,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
          }
        : null

  if (!style) {
    return <>{tabletFrame}</>
  }

  return (
    <>
      <div
        className="tablet-content-screen fixed left-0 top-0 z-[11] overflow-hidden bg-[var(--background)]"
        style={{
          ...style,
          zIndex: zoomPhase === 'opening' ? contentScreenZIndex : 11,
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (
            !target.closest(
              'a, button, [role="button"], input, [tabindex]:not([tabindex="-1"])'
            )
          ) {
            tabletContainerRef.current?.focus()
          }
        }}
      >
        <div
          className="tablet-screen-zoom h-full w-full"
          style={{
            transform: screenOn ? 'scale(1)' : 'scale(0)',
            opacity: screenOn ? 1 : 0,
            pointerEvents: screenOn ? 'auto' : 'none',
          }}
        >
          <div
            ref={tabletContainerRef}
            className="tablet-container h-full w-full overflow-x-hidden overflow-y-scroll"
            tabIndex={0}
          >
            {children}
          </div>
        </div>
      </div>
      {tabletFrame}
    </>
  )
}
