import { useEffect, useState, useRef } from 'react'
import type { RefObject, ReactNode } from 'react'
import type { ZoomPhase } from '@/lib/types'

interface ProjectsZoomViewProps {
  zoomPhase: ZoomPhase
  sidebar: ReactNode
  tabletContainerRef: RefObject<HTMLDivElement | null>
  children: ReactNode
  onSidebarCloseComplete?: () => void
}

const SIDEBAR_WIDTH = 288
const SIDEBAR_ENTER_DURATION_MS = 300
const SIDEBAR_EXIT_DURATION_MS = 200

export function ProjectsZoomView({
  zoomPhase,
  sidebar,
  tabletContainerRef,
  children,
}: ProjectsZoomViewProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const sidebarWrapperRef = useRef<HTMLDivElement>(null)
  const isClosing = zoomPhase === 'closing'

  useEffect(() => {
    if (zoomPhase !== 'open') return
    const id = requestAnimationFrame(() => setSidebarVisible(true))
    return () => cancelAnimationFrame(id)
  }, [zoomPhase])

  const shouldShowSidebar = zoomPhase === 'open' && sidebarVisible && !isClosing
  const sidebarWidth = shouldShowSidebar ? SIDEBAR_WIDTH : 0
  const sidebarOpacity = shouldShowSidebar ? 1 : 0

  const duration =
    isClosing
      ? `${SIDEBAR_EXIT_DURATION_MS}ms`
      : sidebarVisible
        ? `${SIDEBAR_ENTER_DURATION_MS}ms`
        : '0s'
  const ease = isClosing ? 'ease-in' : 'ease-out'

  return (
    <div className="flex h-screen w-full min-w-0 overflow-hidden">
      <div
        ref={sidebarWrapperRef}
        className="flex h-screen min-h-0 flex-shrink-0 flex-col overflow-hidden"
        style={{
          width: sidebarWidth,
          opacity: sidebarOpacity,
          transition: `width ${duration} ${ease}, opacity ${duration} ${ease}`,
        }}
      >
        {sidebar}
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div
          ref={tabletContainerRef}
          className="tablet-container flex-1 overflow-x-hidden overflow-y-auto"
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
