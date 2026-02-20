import { createContext, useContext } from 'react'

interface TabletModalContainerContextValue {
  container: HTMLElement | null
}

export const TabletModalContainerContext =
  createContext<TabletModalContainerContextValue>({
    container: null,
  })

export function useTabletModalContainer() {
  return useContext(TabletModalContainerContext)
}
