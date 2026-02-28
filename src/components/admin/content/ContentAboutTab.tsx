import type { ContentData } from '@/lib/types'
import { AboutIntroductionBlock } from '@/components/admin/content/AboutIntroductionBlock'
import { AboutCoursesBlock } from '@/components/admin/content/AboutCoursesBlock'
import { AboutSkillsBlock } from '@/components/admin/content/AboutSkillsBlock'
import { AboutToolsBlock } from '@/components/admin/content/AboutToolsBlock'

interface ContentAboutTabProps {
  content: ContentData
  setContent: (content: ContentData | ((prev: ContentData) => ContentData)) => void
  setHasChanges: (value: boolean) => void
  onAddCourse: () => void
  onRemoveCourse: (index: number) => void
}

export function ContentAboutTab({
  content,
  setContent,
  setHasChanges,
  onAddCourse,
  onRemoveCourse,
}: ContentAboutTabProps) {
  return (
    <div className="space-y-6">
      <AboutIntroductionBlock
        content={content}
        setContent={setContent}
        setHasChanges={setHasChanges}
      />
      <AboutCoursesBlock
        content={content}
        setContent={setContent}
        setHasChanges={setHasChanges}
        onAddCourse={onAddCourse}
        onRemoveCourse={onRemoveCourse}
      />
      <AboutSkillsBlock
        content={content}
        setContent={setContent}
        setHasChanges={setHasChanges}
      />
      <AboutToolsBlock
        content={content}
        setContent={setContent}
        setHasChanges={setHasChanges}
      />
    </div>
  )
}
