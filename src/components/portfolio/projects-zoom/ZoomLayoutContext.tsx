import { createContext, useContext } from 'react'

export interface ZoomLayoutContextValue {
  isMainSqueezed: boolean
}

export const ZoomLayoutContext = createContext<ZoomLayoutContextValue>({
  isMainSqueezed: false,
})

export function useZoomLayout() {
  return useContext(ZoomLayoutContext)
}
