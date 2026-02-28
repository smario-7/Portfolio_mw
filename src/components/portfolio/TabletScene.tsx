import { useMemo, type RefObject, type ReactNode } from 'react'
import { getPerspectiveMatrix3d } from '@/lib/utils'
import type { Project, ScreenQuad, ZoomPhase } from '@/lib/types'
import { ProjectsZoomView } from '@/components/portfolio/projects/ProjectsZoomView'
import { ProjectsSidebar } from '@/components/portfolio/projects/ProjectsSidebar'
import { useZoomTransition } from '@/components/portfolio/projects-zoom'

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
  onSidebarEnterComplete?: () => void
  onSidebarCloseComplete?: () => void
  children: ReactNode
  zoomSidebarProjects?: Project[]
  zoomSidebarSelectedCategory?: string
  zoomSidebarSetSelectedCategory?: (category: string) => void
  zoomSidebarSelectedProjectId?: number | null
  zoomSidebarOnSelectProject?: (id: number) => void
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
  onSidebarEnterComplete,
  onSidebarCloseComplete,
  children,
  zoomSidebarProjects,
  zoomSidebarSelectedCategory,
  zoomSidebarSetSelectedCategory,
  zoomSidebarSelectedProjectId,
  zoomSidebarOnSelectProject,
}: TabletSceneProps) {
  const { openingStyle, closingStyle } = useZoomTransition(
    zoomPhase,
    screenQuad,
    screenSize,
    { onZoomOpenComplete, onZoomCloseComplete }
  )

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

  const fullscreenStyle = useMemo(
    () => ({
      width: '100vw' as const,
      height: '100vh' as const,
      transform: 'none' as const,
      transformOrigin: '0 0' as const,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
    }),
    []
  )

  const idleMatrix = useMemo(() => {
    if (!screenQuad || !screenSize) return null
    return getPerspectiveMatrix3d(
      [
        { x: 0, y: 0 },
        { x: screenSize.w, y: 0 },
        { x: screenSize.w, y: screenSize.h },
        { x: 0, y: screenSize.h },
      ],
      [screenQuad.p1, screenQuad.p2, screenQuad.p3, screenQuad.p4]
    )
  }, [screenQuad, screenSize])

  const idleStyle = useMemo(() => {
    if (idleMatrix === null || !screenSize) return null
    return {
      width: screenSize.w,
      height: screenSize.h,
      transformOrigin: '0 0' as const,
      transform: idleMatrix,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
    }
  }, [idleMatrix, screenSize])

  if (!screenQuad || !screenSize) {
    return <>{tabletFrame}</>
  }

  let style: typeof fullscreenStyle | typeof idleStyle | null = null
  if (zoomPhase === 'closing' && closingStyle) {
    style = {
      width: closingStyle.width,
      height: closingStyle.height,
      transformOrigin: '0 0' as const,
      transform: closingStyle.transform,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
    }
  } else if (
    zoomPhase === 'open' ||
    zoomPhase === 'openWithSidebar' ||
    zoomPhase === 'closingSidebar' ||
    zoomPhase === 'closing'
  ) {
    style = fullscreenStyle
  } else if (zoomPhase === 'opening' && openingStyle) {
    style = {
      width: openingStyle.width,
      height: openingStyle.height,
      transformOrigin: '0 0' as const,
      transform: openingStyle.transform,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' as const,
    }
  } else if (idleStyle) {
    style = idleStyle
  }

  if (!style) {
    return <>{tabletFrame}</>
  }

  const isZoomFullscreen =
    zoomPhase === 'open' ||
    zoomPhase === 'openWithSidebar' ||
    zoomPhase === 'closingSidebar' ||
    zoomPhase === 'closing'

  const zoomInnerScale = isZoomFullscreen
    ? 1
    : screenOn
      ? 1
      : 0
  const zoomInnerOpacity = isZoomFullscreen ? 1 : screenOn ? 1 : 0
  const reflectionVisible =
    zoomInnerOpacity === 1 &&
    (zoomPhase === 'idle' || zoomPhase === 'closing')
  const reflectionOpacity = reflectionVisible ? 1 : 0

  const hasSidebarProps =
    Boolean(zoomSidebarProjects) &&
    zoomSidebarSelectedCategory !== undefined &&
    zoomSidebarSetSelectedCategory !== undefined &&
    zoomSidebarSelectedProjectId !== undefined &&
    zoomSidebarOnSelectProject !== undefined

  const sidebarNode =
    hasSidebarProps && isZoomFullscreen ? (
      <ProjectsSidebar
        projects={zoomSidebarProjects!}
        selectedCategory={zoomSidebarSelectedCategory!}
        onCategoryChange={zoomSidebarSetSelectedCategory!}
        selectedProjectId={zoomSidebarSelectedProjectId ?? null}
        onSelectProject={zoomSidebarOnSelectProject!}
        tabletContainerRef={tabletContainerRef}
        zoomClosing={
          zoomPhase === 'closingSidebar' || zoomPhase === 'closing'
        }
      />
    ) : null

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
            transform: `scale(${zoomInnerScale})`,
            opacity: zoomInnerOpacity,
            pointerEvents: zoomInnerOpacity === 1 ? 'auto' : 'none',
          }}
        >
          <ProjectsZoomView
            zoomPhase={zoomPhase}
            sidebar={sidebarNode}
            tabletContainerRef={tabletContainerRef}
            showSidebarLayout={isZoomFullscreen}
            onSidebarEnterComplete={onSidebarEnterComplete}
            onSidebarCloseComplete={onSidebarCloseComplete}
          >
            {children}
          </ProjectsZoomView>
        </div>
        <div
          className="tablet-screen-reflection"
          style={{ opacity: reflectionOpacity }}
          aria-hidden
        />
      </div>
      {tabletFrame}
    </>
  )
}
