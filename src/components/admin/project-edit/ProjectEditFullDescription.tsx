import { GripVertical, X, Type, Image, Code } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ProjectDetailBlock, ProjectAttachment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ADMIN_BLOCK_ROW_CLASS } from '@/lib/constants/layout'
import { Button } from '@/components/ui/button'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'
import { BlockTextEditor } from './BlockTextEditor'
import { BlockScreenshotEditor } from './BlockScreenshotEditor'
import { BlockCodeEditor } from './BlockCodeEditor'

const BLOCK_ID_PREFIX = 'block-'

function parseBlockId(id: string | number): number {
  const s = String(id)
  if (s.startsWith(BLOCK_ID_PREFIX)) {
    const n = parseInt(s.slice(BLOCK_ID_PREFIX.length), 10)
    return Number.isNaN(n) ? -1 : n
  }
  return -1
}

interface SortableBlockRowProps {
  id: string
  block: ProjectDetailBlock
  index: number
  projectId: number
  existingAttachments: ProjectAttachment[]
  existingImagePaths: string[]
  onStorageImageDeleted?: (path: string) => void
  onStorageImageUploaded?: (path: string) => void
  blockError?: string
  onUpdate: (index: number, block: ProjectDetailBlock) => void
  onRemove: (index: number) => void
}

function SortableBlockRow({
  id,
  block,
  index,
  projectId,
  existingAttachments,
  existingImagePaths,
  onStorageImageDeleted,
  onStorageImageUploaded,
  blockError,
  onUpdate,
  onRemove,
}: SortableBlockRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        ADMIN_BLOCK_ROW_CLASS,
        isDragging && 'cursor-grabbing shadow-md ring-2 ring-primary/20',
        blockError && 'border-destructive/50'
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 mt-2"
        aria-label="Przeciągnij aby zmienić kolejność"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0 space-y-2">
        {block.type === 'text' && (
          <>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Type className="h-3 w-3" /> Tekst
            </span>
            <BlockTextEditor
              value={block.content}
              onChange={(content) => onUpdate(index, { type: 'text', content })}
            />
          </>
        )}
        {block.type === 'screenshot' && (
          <>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Image className="h-3 w-3" /> Screenshot
            </span>
            <BlockScreenshotEditor
              projectId={projectId}
              block={block}
              onChange={(next) => onUpdate(index, next)}
              existingImagePaths={existingImagePaths}
              onRemoveBlock={() => onRemove(index)}
              onStorageImageDeleted={onStorageImageDeleted}
              onStorageImageUploaded={onStorageImageUploaded}
            />
          </>
        )}
        {block.type === 'code' && (
          <>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Code className="h-3 w-3" /> Kod
            </span>
            <BlockCodeEditor
              block={block}
              onChange={(next) => onUpdate(index, next)}
              existingAttachments={existingAttachments}
              onRemoveBlock={() => onRemove(index)}
            />
          </>
        )}
        {blockError && (
          <p className="text-sm text-destructive">{blockError}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="shrink-0 p-1 text-muted-foreground hover:text-destructive mt-2"
        aria-label="Usuń blok"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ProjectEditFullDescriptionProps {
  projectId?: number
  blocks: ProjectDetailBlock[]
  addBlock: (block: ProjectDetailBlock) => void
  removeBlock: (index: number) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  updateBlock: (index: number, block: ProjectDetailBlock) => void
  existingAttachments: ProjectAttachment[]
  existingImagePaths?: string[]
  onStorageImageDeleted?: (path: string) => void
  onStorageImageUploaded?: (path: string) => void
  blockErrors?: Record<number, string>
}

export function ProjectEditFullDescription({
  projectId = 0,
  blocks,
  addBlock,
  removeBlock,
  moveBlock,
  updateBlock,
  existingAttachments,
  existingImagePaths = [],
  onStorageImageDeleted,
  onStorageImageUploaded,
  blockErrors = {},
}: ProjectEditFullDescriptionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over == null || active.id === over.id) return
    const oldIndex = parseBlockId(active.id)
    const newIndex = parseBlockId(over.id)
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return
    moveBlock(oldIndex, newIndex)
  }

  const itemIds = blocks.map((_, i) => `${BLOCK_ID_PREFIX}${i}`)

  return (
    <AdminSectionCard
      title="Pełny opis"
      description="Dodaj bloki tekstu, screeny i fragmenty kodu. Kolejność można zmieniać przeciągając."
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {blocks.map((block, index) => (
              <SortableBlockRow
                key={`${BLOCK_ID_PREFIX}${index}`}
                id={`${BLOCK_ID_PREFIX}${index}`}
                block={block}
                index={index}
                projectId={projectId}
                existingAttachments={existingAttachments}
                existingImagePaths={existingImagePaths}
                onStorageImageDeleted={onStorageImageDeleted}
                onStorageImageUploaded={onStorageImageUploaded}
                blockError={blockErrors[index]}
                onUpdate={updateBlock}
                onRemove={removeBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addBlock({ type: 'text', content: '' })}
        >
          <Type className="mr-2 h-4 w-4" />
          Tekst
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addBlock({ type: 'screenshot', path: '', alt: '' })}
        >
          <Image className="mr-2 h-4 w-4" />
          Screenshot
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            addBlock({
              type: 'code',
              sourceFile: '',
              sourceType: 'py',
              fragmentId: '',
            })
          }
        >
          <Code className="mr-2 h-4 w-4" />
          Kod
        </Button>
      </div>
    </AdminSectionCard>
  )
}
