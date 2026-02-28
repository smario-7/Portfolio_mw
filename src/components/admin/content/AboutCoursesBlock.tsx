import type { ContentData } from '@/lib/types'
import type { Course } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { COURSE_YEARS } from '@/lib/constants/context-save'
import { MONTHS_SELECT_OPTIONS } from '@/lib/constants/months'

interface AboutCoursesBlockProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
  onAddCourse: () => void
  onRemoveCourse: (index: number) => void
}

interface SortableCourseItemProps {
  course: Course
  index: number
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
  onRemoveCourse: (index: number) => void
}

function SortableCourseItem({
  course,
  index,
  content,
  setContent,
  setHasChanges,
  onRemoveCourse,
}: SortableCourseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id ?? index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`space-y-3 rounded-lg border-2 border-border/50 bg-background p-4 transition-colors hover:bg-card/80 ${
        isDragging ? 'cursor-grabbing shadow-md ring-2 ring-primary/20' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Przeciągnij aby zmienić kolejność"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={course.courseName}
          onChange={(e) => {
            const updated = [...content.about.courses]
            updated[index] = { ...updated[index], courseName: e.target.value }
            setContent({
              ...content,
              about: { ...content.about, courses: updated },
            })
            setHasChanges(true)
          }}
          placeholder="Nazwa kursu"
          className="flex-1 rounded border-2 border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Select
          value={course.completionDate.year.toString()}
          onValueChange={(value) => {
            const updated = [...content.about.courses]
            updated[index] = {
              ...updated[index],
              completionDate: {
                ...updated[index].completionDate,
                year: parseInt(value, 10),
              },
            }
            setContent({
              ...content,
              about: { ...content.about, courses: updated },
            })
            setHasChanges(true)
          }}
        >
          <SelectTrigger className="rounded border-2 border-border bg-background/50 px-3 py-2 text-sm h-9">
            <SelectValue placeholder="Rok" />
          </SelectTrigger>
          <SelectContent>
            {COURSE_YEARS.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={course.completionDate.month.toString()}
          onValueChange={(value) => {
            const updated = [...content.about.courses]
            updated[index] = {
              ...updated[index],
              completionDate: {
                ...updated[index].completionDate,
                month: parseInt(value, 10),
              },
            }
            setContent({
              ...content,
              about: { ...content.about, courses: updated },
            })
            setHasChanges(true)
          }}
        >
          <SelectTrigger className="rounded border-2 border-border bg-background/50 px-3 py-2 text-sm h-9">
            <SelectValue placeholder="Miesiąc" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS_SELECT_OPTIONS.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <textarea
        value={course.description}
        onChange={(e) => {
          const updated = [...content.about.courses]
          updated[index] = {
            ...updated[index],
            description: e.target.value,
          }
          setContent({
            ...content,
            about: { ...content.about, courses: updated },
          })
          setHasChanges(true)
        }}
        placeholder="Opis"
        rows={2}
        className="w-full rounded border-2 border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
      />
      <button
        onClick={() => onRemoveCourse(index)}
        className="text-xs text-destructive transition-opacity hover:opacity-70"
      >
        Usuń
      </button>
    </div>
  )
}

export function AboutCoursesBlock({
  content,
  setContent,
  setHasChanges,
  onAddCourse,
  onRemoveCourse,
}: AboutCoursesBlockProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const courses = content.about.courses
      const oldIndex = courses.findIndex(
        (c, i) => (c.id ?? i) === active.id
      )
      const newIndex = courses.findIndex(
        (c, i) => (c.id ?? i) === over.id
      )

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedCourses = arrayMove(courses, oldIndex, newIndex)

        const updatedCourses = reorderedCourses.map((course, index) => ({
          ...course,
          order: index + 1,
        }))

        setContent({
          ...content,
          about: { ...content.about, courses: updatedCourses },
        })
        setHasChanges(true)
      }
    }
  }

  return (
    <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Kursy
        </h2>
        <button
          onClick={onAddCourse}
          className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          Dodaj +
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={content.about.courses.map((c, i) => c.id ?? i)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {content.about.courses.map((course, index) => (
              <SortableCourseItem
                key={course.id ?? index}
                course={course}
                index={index}
                content={content}
                setContent={setContent}
                setHasChanges={setHasChanges}
                onRemoveCourse={onRemoveCourse}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
