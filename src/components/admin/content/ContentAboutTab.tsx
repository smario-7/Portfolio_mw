import { useState } from 'react'
import type { ContentData } from '@/lib/types'
import { getToolsCatalog } from '@/lib/services/projects-service'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
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
import type { Course } from '@/lib/types'

interface ContentAboutTabProps {
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

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
  const months = [
    { value: 1, label: 'Styczeń' },
    { value: 2, label: 'Luty' },
    { value: 3, label: 'Marzec' },
    { value: 4, label: 'Kwiecień' },
    { value: 5, label: 'Maj' },
    { value: 6, label: 'Czerwiec' },
    { value: 7, label: 'Lipiec' },
    { value: 8, label: 'Sierpień' },
    { value: 9, label: 'Wrzesień' },
    { value: 10, label: 'Październik' },
    { value: 11, label: 'Listopad' },
    { value: 12, label: 'Grudzień' },
  ]

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
            {years.map((year) => (
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
            {months.map((month) => (
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

export function ContentAboutTab({
  content,
  setContent,
  setHasChanges,
  onAddCourse,
  onRemoveCourse,
}: ContentAboutTabProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSkillByCategory, setNewSkillByCategory] = useState<
    Record<string, string>
  >({})

  const catalog = getToolsCatalog()
  const selectedToolIds = content.about.tools ?? []

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

  const toggleTool = (toolId: string) => {
    const isSelected = selectedToolIds.includes(toolId)
    setContent({
      ...content,
      about: {
        ...content.about,
        tools: isSelected
          ? selectedToolIds.filter((id) => id !== toolId)
          : [...selectedToolIds, toolId],
      },
    })
    setHasChanges(true)
  }

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name || name in content.about.skills) return
    setContent({
      ...content,
      about: {
        ...content.about,
        skills: { ...content.about.skills, [name]: [] },
      },
    })
    setHasChanges(true)
    setNewCategoryName('')
  }

  const handleRemoveCategory = (category: string) => {
    const { [category]: _, ...rest } = content.about.skills
    setContent({
      ...content,
      about: { ...content.about, skills: rest },
    })
    setHasChanges(true)
    setNewSkillByCategory((prev) => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  const handleAddSkill = (category: string) => {
    const value = (newSkillByCategory[category] ?? '').trim()
    if (!value) return
    const skills = content.about.skills[category] ?? []
    if (skills.includes(value)) return
    const updated = {
      ...content.about.skills,
      [category]: [...skills, value],
    }
    setContent({
      ...content,
      about: { ...content.about, skills: updated },
    })
    setHasChanges(true)
    setNewSkillByCategory((prev) => ({ ...prev, [category]: '' }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">Wprowadzenie</h2>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Tekst wprowadzenia
          </label>
          <textarea
            value={content.about.introduction}
            onChange={(e) => {
              setContent({
                ...content,
                about: { ...content.about, introduction: e.target.value },
              })
              setHasChanges(true)
            }}
            rows={6}
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Edytor
            </label>
            <div className="rounded-lg border-2 border-border bg-background/50 p-4 text-sm text-muted-foreground">
              Zawartość textarea powyżej
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Podgląd
            </label>
            <div className="rounded-lg border-2 border-border bg-background/50 p-4 text-sm leading-relaxed text-foreground">
              {content.about.introduction}
            </div>
          </div>
        </div>
      </div>

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

      <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">Umiejętności</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            placeholder="Nazwa kategorii"
            className="rounded border-2 border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleAddCategory}
            className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Dodaj kategorię
          </button>
        </div>
        <div className="space-y-6">
          {Object.entries(content.about.skills).map(([category, skills]) => (
            <div
              key={category}
              className="space-y-3 rounded-lg border-2 border-border/50 bg-background p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-foreground">{category}</h3>
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="text-xs text-destructive transition-opacity hover:opacity-70"
                >
                  Usuń kategorię
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={newSkillByCategory[category] ?? ''}
                  onChange={(e) =>
                    setNewSkillByCategory((prev) => ({
                      ...prev,
                      [category]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddSkill(category))
                  }
                  placeholder="Nowa umiejętność"
                  className="rounded border-2 border-border bg-background/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => handleAddSkill(category)}
                  className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  Dodaj
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {skill}
                    <button
                      onClick={() => {
                        const updated = { ...content.about.skills }
                        updated[category] = updated[category].filter(
                          (s) => s !== skill
                        )
                        setContent({
                          ...content,
                          about: { ...content.about, skills: updated },
                        })
                        setHasChanges(true)
                      }}
                      className="transition-opacity hover:opacity-70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-lg border-2 border-border bg-card/30 p-6">
        <h2 className="text-xl font-semibold text-foreground">
          Narzędzia i technologie
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedToolIds.map((id) => {
            const tool = catalog.find((t) => t.id === id)
            const label = tool?.name ?? id
            return (
              <div
                key={id}
                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {label}
                <button
                  onClick={() => toggleTool(id)}
                  className="transition-opacity hover:opacity-70"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
        <ScrollArea className="h-[260px] rounded-lg border-2 border-border bg-background/50">
          <div className="p-2 space-y-1">
            {catalog.map((tool) => {
              const checked = selectedToolIds.includes(tool.id)
              return (
                <label
                  key={tool.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleTool(tool.id)}
                  />
                  <span className="text-sm text-foreground">{tool.name}</span>
                </label>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
