interface ScreenReflectionOverlayProps {
  visible: boolean
}

export function ScreenReflectionOverlay({ visible }: ScreenReflectionOverlayProps) {
  return (
    <div
      className="tablet-screen-reflection"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    />
  )
}
