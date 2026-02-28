import { useState } from 'react'
import { getStorageFileUrl } from '@/lib/utils/storage-url'
import type { BlockScreenshot } from '@/lib/types'

interface BlockScreenshotRendererProps {
  block: BlockScreenshot
}

export function BlockScreenshotRenderer({ block }: BlockScreenshotRendererProps) {
  const [error, setError] = useState(false)
  const src = getStorageFileUrl(block.path)

  if (!block.path) return null
  if (error) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-border bg-card/30 text-sm text-muted-foreground">
        Brak pliku
      </div>
    )
  }

  return (
    <figure className="space-y-2">
      <img
        src={src}
        alt={block.alt ?? ''}
        className="max-h-[400px] w-full rounded-lg border border-border object-contain"
        loading="lazy"
        decoding="async"
        onError={() => setError(true)}
      />
      {block.alt && (
        <figcaption className="text-center text-sm text-muted-foreground">
          {block.alt}
        </figcaption>
      )}
    </figure>
  )
}
