'use client'

import type { RefObject, ReactNode } from 'react'
import { getPerspectiveMatrix3d } from '@/lib/utils'
import type { Quad, ScreenQuad } from '@/lib/types'

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
  children,
}: TabletSceneProps) {
  return (
    <>
      {screenQuad &&
        screenSize &&
        (() => {
          const srcQuad: Quad = [
            { x: 0, y: 0 },
            { x: screenSize.w, y: 0 },
            { x: screenSize.w, y: screenSize.h },
            { x: 0, y: screenSize.h },
          ]
          const destQuad: Quad = [
            screenQuad.p1,
            screenQuad.p2,
            screenQuad.p3,
            screenQuad.p4,
          ]
          const perspectiveMatrix = getPerspectiveMatrix3d(srcQuad, destQuad)
          if (!perspectiveMatrix) return null
          return (
            <div
              className="tablet-content-screen fixed left-0 top-0 z-[11] overflow-hidden bg-[var(--background)]"
              style={{
                width: screenSize.w,
                height: screenSize.h,
                transformOrigin: '0 0',
                transform: perspectiveMatrix,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
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
          )
        })()}

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
    </>
  )
}
