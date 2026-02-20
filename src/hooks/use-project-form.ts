import { useState, useEffect, useRef, useCallback } from 'react'
import type { Project, ProjectDetailBlock } from '@/lib/types'
import { fullDescriptionToBlocks } from '@/lib/data/project-normalize'
import { validateProjectForm, validateProjectFormPartial, type ProjectFormData, type ProjectFormErrors } from '@/lib/validation/project-validation'
import { isValidAttachmentFile } from '@/lib/constants/file-types'
import { toast } from 'sonner'

export interface UseProjectFormOptions {
  initialData?: Partial<Project>
  mode: 'new' | 'edit'
  projects?: Project[]
}

export interface UseProjectFormReturn {
  formData: ProjectFormData
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
  errors: ProjectFormErrors
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  techInput: string
  setTechInput: React.Dispatch<React.SetStateAction<string>>
  attachmentFiles: File[]
  setAttachmentFiles: React.Dispatch<React.SetStateAction<File[]>>
  autoSaveStatus: 'idle' | 'saving' | 'saved'
  lastSaved: Date | null
  hasChanges: boolean
  handleAddTechnology: () => void
  handleRemoveTechnology: (tech: string) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'pdf' | 'ipynb') => void
  handleAttachmentFiles: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeAttachmentFile: (index: number) => void
  addBlock: (block: ProjectDetailBlock) => void
  removeBlock: (index: number) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  updateBlock: (index: number, block: ProjectDetailBlock) => void
  validateForm: () => boolean
  resetForm: () => void
}

const getInitialFormData = (initialData?: Partial<Project>): ProjectFormData => {
  const emptyDownloadLinks = { pdf: undefined, ipynb: undefined, md: undefined, image: undefined }
  if (initialData) {
    return {
      title: initialData.title ?? '',
      shortDescription: initialData.description ?? '',
      fullDescriptionBlocks: fullDescriptionToBlocks(initialData.fullDescription),
      technologies: initialData.stack ?? [],
      githubUrl: initialData.github ?? '',
      demoUrl: initialData.demo ?? '',
      category: initialData.category ?? 'Frontend',
      featured: false,
      status: initialData.status === 'published' ? 'published' : 'draft',
      image: null,
      imagePath: initialData.image ?? '',
      pdf: null,
      ipynb: null,
      downloadLinks: initialData.downloadLinks ?? emptyDownloadLinks,
      color: initialData.color ?? '',
    }
  }

  return {
    title: '',
    shortDescription: '',
    fullDescriptionBlocks: [],
    technologies: [],
    githubUrl: '',
    demoUrl: '',
    category: 'Frontend',
    featured: false,
    status: 'draft',
    image: null,
    imagePath: '',
    pdf: null,
    ipynb: null,
    downloadLinks: emptyDownloadLinks,
    color: '',
  }
}

export function useProjectForm(options: UseProjectFormOptions): UseProjectFormReturn {
  const { initialData, mode } = options

  const [formData, setFormData] = useState<ProjectFormData>(() => getInitialFormData(initialData))
  const [errors, setErrors] = useState<ProjectFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const initialFormDataRef = useRef<ProjectFormData>(formData)

  // Celowo tylko initialData w zależnościach – reset formularza przy zmianie projektu, bez reakcji na każdą zmianę formData.
  useEffect(() => {
    if (initialData) {
      const newFormData = getInitialFormData(initialData)
      const currentDataString = JSON.stringify(formData)
      const newDataString = JSON.stringify(newFormData)

      if (currentDataString !== newDataString) {
        setFormData(newFormData)
        initialFormDataRef.current = newFormData
        setHasChanges(false)
      }
    }
  }, [initialData])

  useEffect(() => {
    const currentData = JSON.stringify(formData)
    const initialData = JSON.stringify(initialFormDataRef.current)
    setHasChanges(currentData !== initialData)
  }, [formData])

  const performAutoSave = useCallback(async () => {
    if (!hasChanges) return

    setAutoSaveStatus('saving')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
      setHasChanges(false)
      initialFormDataRef.current = { ...formData }

      setTimeout(() => {
        setAutoSaveStatus('idle')
      }, 2000)
    } catch (_error) {
      setAutoSaveStatus('idle')
    }
  }, [hasChanges, formData])

  useEffect(() => {
    if (!hasChanges) return

    const autoSaveTimer = setTimeout(() => {
      performAutoSave()
    }, 3000)

    return () => clearTimeout(autoSaveTimer)
  }, [formData, hasChanges, performAutoSave])

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

  const handleAddTechnology = useCallback(() => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput('')
      setHasChanges(true)
    }
  }, [techInput, formData])

  const handleRemoveTechnology = useCallback(
    (tech: string) => {
      setFormData({
        ...formData,
        technologies: formData.technologies.filter((t) => t !== tech),
      })
      setHasChanges(true)
    },
    [formData]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'pdf' | 'ipynb') => {
      const file = e.target.files?.[0]
      if (file) {
        setFormData({ ...formData, [fieldName]: file })
        setHasChanges(true)
      }
    },
    [formData]
  )

  const handleAttachmentFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const allowed = files.filter((f) => isValidAttachmentFile(f.name))
    if (allowed.length < files.length) {
      toast.error('Dozwolone tylko .pdf, .ipynb, .md, .py')
    }
    setAttachmentFiles((prev) => [...prev, ...allowed])
    e.target.value = ''
  }, [])

  const removeAttachmentFile = useCallback((index: number) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addBlock = useCallback((block: ProjectDetailBlock) => {
    setFormData((prev) => ({
      ...prev,
      fullDescriptionBlocks: [...prev.fullDescriptionBlocks, block],
    }))
  }, [])

  const removeBlock = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      fullDescriptionBlocks: prev.fullDescriptionBlocks.filter((_, i) => i !== index),
    }))
  }, [])

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const blocks = [...prev.fullDescriptionBlocks]
      const [removed] = blocks.splice(fromIndex, 1)
      blocks.splice(toIndex, 0, removed)
      return { ...prev, fullDescriptionBlocks: blocks }
    })
  }, [])

  const updateBlock = useCallback((index: number, block: ProjectDetailBlock) => {
    setFormData((prev) => {
      const blocks = [...prev.fullDescriptionBlocks]
      if (index < 0 || index >= blocks.length) return prev
      blocks[index] = block
      return { ...prev, fullDescriptionBlocks: blocks }
    })
  }, [])

  const validateForm = useCallback((): boolean => {
    const validator = mode === 'new' ? validateProjectForm : validateProjectFormPartial
    const newErrors = validator(formData)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, mode])

  const resetForm = useCallback(() => {
    const resetData = getInitialFormData(initialData)
    setFormData(resetData)
    initialFormDataRef.current = resetData
    setErrors({})
    setHasChanges(false)
    setTechInput('')
    setAttachmentFiles([])
  }, [initialData])

  return {
    formData,
    setFormData,
    errors,
    isLoading,
    setIsLoading,
    techInput,
    setTechInput,
    attachmentFiles,
    setAttachmentFiles,
    autoSaveStatus,
    lastSaved,
    hasChanges,
    handleAddTechnology,
    handleRemoveTechnology,
    handleFileChange,
    handleAttachmentFiles,
    removeAttachmentFile,
    addBlock,
    removeBlock,
    moveBlock,
    updateBlock,
    validateForm,
    resetForm,
  }
}
