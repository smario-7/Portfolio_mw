import { useState, useEffect, useCallback } from 'react'
import type { ContentData } from '@/lib/types/content'
import { validateContentData, type ContentFormErrors } from '@/lib/validation/content-validation'
import { saveContent as saveContentService } from '@/lib/services/content-service'
import { toast } from 'sonner'

export interface UseContentFormOptions {
  initialContent: ContentData
}

export interface UseContentFormReturn {
  content: ContentData
  setContent: React.Dispatch<React.SetStateAction<ContentData>>
  saveStatus: 'idle' | 'saving' | 'saved'
  lastSaved: Date | null
  hasChanges: boolean
  skillInput: string
  setSkillInput: React.Dispatch<React.SetStateAction<string>>
  errors: ContentFormErrors
  handleSave: () => Promise<void>
  handleAddSkill: () => void
  handleRemoveSkill: (skill: string) => void
  handleAddCourse: () => void
  handleRemoveCourse: (index: number) => void
  validateContent: () => boolean
  resetContent: () => void
}

export function useContentForm(options: UseContentFormOptions): UseContentFormReturn {
  const { initialContent } = options

  const [content, setContent] = useState<ContentData>(initialContent)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState<ContentFormErrors>({})

  useEffect(() => {
    setContent(initialContent)
    setHasChanges(false)
  }, [initialContent])

  useEffect(() => {
    const currentData = JSON.stringify(content)
    const initialData = JSON.stringify(initialContent)
    setHasChanges(currentData !== initialData)
  }, [content, initialContent])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      await saveContentService(content)
      setLastSaved(new Date())
      setHasChanges(false)
      setSaveStatus('saved')
      toast.success('Treść zapisana')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('idle')
      toast.error('Nie udało się zapisać')
    }
  }, [content])

  const handleAddSkill = useCallback(() => {
    if (skillInput.trim() && !content.home.skills.includes(skillInput.trim())) {
      setContent({
        ...content,
        home: {
          ...content.home,
          skills: [...content.home.skills, skillInput.trim()],
        },
      })
      setSkillInput('')
      setHasChanges(true)
    }
  }, [skillInput, content])

  const handleRemoveSkill = useCallback(
    (skill: string) => {
      setContent({
        ...content,
        home: {
          ...content.home,
          skills: content.home.skills.filter((s) => s !== skill),
        },
      })
      setHasChanges(true)
    },
    [content]
  )

  const handleAddCourse = useCallback(() => {
    const now = new Date()
    const courses = content.about.courses
    
    // Oblicz maksymalne wartości id i order z istniejących kursów
    const maxId = courses.length > 0
      ? Math.max(...courses.map(c => c.id ?? 0), 0)
      : 0
    const maxOrder = courses.length > 0
      ? Math.max(...courses.map(c => c.order ?? 0), 0)
      : 0
    
    setContent({
      ...content,
      about: {
        ...content.about,
        courses: [
          ...content.about.courses,
          {
            courseName: '',
            description: '',
            completionDate: {
              year: now.getFullYear(),
              month: now.getMonth() + 1,
            },
            id: maxId + 1,
            order: maxOrder + 1,
          },
        ],
      },
    })
    setHasChanges(true)
  }, [content])

  const handleRemoveCourse = useCallback(
    (index: number) => {
      setContent({
        ...content,
        about: {
          ...content.about,
          courses: content.about.courses.filter((_, i) => i !== index),
        },
      })
      setHasChanges(true)
    },
    [content]
  )

  const validateContent = useCallback((): boolean => {
    const newErrors = validateContentData(content)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [content])

  const resetContent = useCallback(() => {
    setContent(initialContent)
    setHasChanges(false)
    setErrors({})
    setSkillInput('')
  }, [initialContent])

  return {
    content,
    setContent,
    saveStatus,
    lastSaved,
    hasChanges,
    skillInput,
    setSkillInput,
    errors,
    handleSave,
    handleAddSkill,
    handleRemoveSkill,
    handleAddCourse,
    handleRemoveCourse,
    validateContent,
    resetContent,
  }
}
