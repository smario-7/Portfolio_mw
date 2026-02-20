import { useState, useEffect, useRef, useCallback } from 'react'
import type { RefObject } from 'react'
import type { ZoomPhase } from '@/lib/types'

export interface UseProjectsZoomOptions {
  tabletContainerRef: RefObject<HTMLDivElement | null>
}

export function useProjectsZoom(options: UseProjectsZoomOptions) {
  const { tabletContainerRef } = options
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomPhase, setZoomPhase] = useState<ZoomPhase>('idle')
  const scrollToRestoreRef = useRef<number | null>(null)
  const zoomTriggerRef = useRef<HTMLButtonElement | null>(null)
  const wasZoomOpenRef = useRef(false)

  useEffect(() => {
    if (zoomPhase !== 'idle' || zoomOpen) return
    if (scrollToRestoreRef.current !== null) {
      const top = scrollToRestoreRef.current
      scrollToRestoreRef.current = null
      if (tabletContainerRef.current) {
        tabletContainerRef.current.scrollTop = top
      }
    }
    if (wasZoomOpenRef.current) {
      wasZoomOpenRef.current = false
      zoomTriggerRef.current?.focus()
    }
  }, [zoomPhase, zoomOpen, tabletContainerRef])

  const openZoom = useCallback(() => {
    wasZoomOpenRef.current = true
    setZoomOpen(true)
    setZoomPhase('opening')
  }, [])

  const closeZoom = useCallback(() => {
    scrollToRestoreRef.current = tabletContainerRef.current?.scrollTop ?? 0
    setZoomPhase((prev) =>
      prev === 'openWithSidebar' ? 'closingSidebar' : prev === 'open' ? 'closing' : prev
    )
  }, [tabletContainerRef])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const canCloseZoom =
        zoomPhase === 'open' ||
        zoomPhase === 'openWithSidebar' ||
        zoomPhase === 'closingSidebar' ||
        zoomPhase === 'closing'
      if (!canCloseZoom) return
      e.preventDefault()
      closeZoom()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomPhase, closeZoom])

  const onZoomOpenComplete = () => {
    setZoomPhase('open')
  }

  const onZoomCloseComplete = () => {
    setZoomOpen(false)
    setZoomPhase('idle')
  }

  const onSidebarEnterComplete = () => {
    setZoomPhase('openWithSidebar')
  }

  const onSidebarCloseComplete = () => {
    setZoomPhase('closing')
  }

  return {
    zoomOpen,
    zoomPhase,
    openZoom,
    closeZoom,
    onZoomOpenComplete,
    onZoomCloseComplete,
    onSidebarEnterComplete,
    onSidebarCloseComplete,
    isZoomFullyOpen,
    scrollToRestoreRef,
    zoomTriggerRef,
  }
}

export function isZoomFullyOpen(phase: ZoomPhase): boolean {
  return phase === 'openWithSidebar'
}
