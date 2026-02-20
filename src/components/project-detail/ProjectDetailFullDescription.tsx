import type { ProjectDetailBlock } from '@/lib/types'
import { BlockTextRenderer } from './BlockTextRenderer'
import { BlockScreenshotRenderer } from './BlockScreenshotRenderer'
import { BlockCodeRenderer } from './BlockCodeRenderer'

interface ProjectDetailFullDescriptionProps {
  fullDescription?: ProjectDetailBlock[]
}

function BlockSwitch({ block }: { block: ProjectDetailBlock }) {
  switch (block.type) {
    case 'text':
      return <BlockTextRenderer block={block} />
    case 'screenshot':
      return <BlockScreenshotRenderer block={block} />
    case 'code':
      return <BlockCodeRenderer block={block} />
    default:
      return null
  }
}

export function ProjectDetailFullDescription({
  fullDescription,
}: ProjectDetailFullDescriptionProps) {
  if (!fullDescription || fullDescription.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Pełny opis</h2>
      <div className="space-y-6">
        {fullDescription.map((block, index) => (
          <div key={`${block.type}-${index}`}>
            <BlockSwitch block={block} />
          </div>
        ))}
      </div>
    </div>
  )
}
