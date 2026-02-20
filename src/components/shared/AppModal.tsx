import * as React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type DialogContentProps = React.ComponentProps<typeof DialogContent>
type AppModalProps = React.ComponentProps<typeof Dialog> & {
  contentClassName?: string
  showCloseButton?: boolean
  overlayClassName?: string
  container?: HTMLElement | null
} & Omit<DialogContentProps, 'className' | 'children'>

/**
 * Wrapper łączący Dialog i DialogContent. Prop `container` pozwala renderować modal
 * w portalu (np. wewnątrz tabletu), zamiast w document.body.
 */
export function AppModal({
  open,
  onOpenChange,
  contentClassName,
  showCloseButton = true,
  overlayClassName,
  container,
  children,
  ...contentRest
}: AppModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        container={container}
        overlayClassName={overlayClassName}
        className={contentClassName}
        showCloseButton={showCloseButton}
        {...contentRest}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
