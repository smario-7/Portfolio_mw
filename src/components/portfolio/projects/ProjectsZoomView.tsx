import { useEffect, useState } from 'react'
import type { RefObject, ReactNode } from 'react'
import type { ZoomPhase } from '@/lib/types'
import { ZoomLayoutContext } from '@/components/portfolio/projects-zoom'

const SIDEBAR_STAGE2_DURATION_MS = 300

interface ProjectsZoomViewProps {
  zoomPhase: ZoomPhase
  sidebar: ReactNode | null
  tabletContainerRef: RefObject<HTMLDivElement | null>
  children: ReactNode
  showSidebarLayout?: boolean
  onSidebarEnterComplete?: () => void
  onSidebarCloseComplete?: () => void
}

export function ProjectsZoomView({
  zoomPhase,
  sidebar,
  tabletContainerRef,
  children,
  showSidebarLayout = true,
  onSidebarEnterComplete,
  onSidebarCloseComplete,
}: ProjectsZoomViewProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const expanded =
    showSidebarLayout && zoomPhase !== 'closing' ? sidebarExpanded : false

  useEffect(() => {
    if (zoomPhase !== 'open' || !showSidebarLayout) return
    setSidebarExpanded(false)
    let raf2: number | null = null
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setSidebarExpanded(true)
      })
    })
    const timeoutId = setTimeout(() => {
      onSidebarEnterComplete?.()
    }, SIDEBAR_STAGE2_DURATION_MS)
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2 !== null) cancelAnimationFrame(raf2)
      clearTimeout(timeoutId)
    }
  }, [zoomPhase, showSidebarLayout, onSidebarEnterComplete])

  useEffect(() => {
    if (zoomPhase !== 'closingSidebar') return
    const rafId = requestAnimationFrame(() => {
      setSidebarExpanded(false)
    })
    const timeoutId = setTimeout(() => {
      onSidebarCloseComplete?.()
    }, SIDEBAR_STAGE2_DURATION_MS)
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
    }
  }, [zoomPhase, onSidebarCloseComplete])

  const transitionStyle = `width ${SIDEBAR_STAGE2_DURATION_MS}ms ease-out, transform ${SIDEBAR_STAGE2_DURATION_MS}ms ease-out, opacity ${SIDEBAR_STAGE2_DURATION_MS}ms ease-out`

  return (
    <div className="flex h-full w-full min-w-0 overflow-hidden">
      <div
        className="flex h-full min-h-0 min-w-0 flex-shrink-0 flex-col overflow-hidden"
        style={{
          width: expanded ? '20%' : '0',
          minWidth: expanded ? 200 : 0,
          transform: expanded ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: 'left center',
          opacity: expanded ? 1 : 0,
          transition: transitionStyle,
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      >
        {sidebar ?? null}
      </div>
      <div
        className="flex min-w-0 flex-1 flex-col overflow-hidden"
        style={{
          width: expanded ? '80%' : '100%',
          transition: transitionStyle,
        }}
      >
        <div
          ref={tabletContainerRef}
          className="tablet-container h-full flex-1 overflow-x-hidden overflow-y-auto"
          tabIndex={0}
        >
          <ZoomLayoutContext.Provider value={{ isMainSqueezed: expanded }}>
            {children}
          </ZoomLayoutContext.Provider>
        </div>
      </div>
    </div>
  )
}
