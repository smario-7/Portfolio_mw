'use client'

import React, { useEffect } from "react"

import { useState } from 'react'
import { ChevronLeft, Upload, X, Loader2, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from '@/components/admin/sidebar'

interface FormData {
  title: string
  description: string
  shortDescription: string
  technologies: string[]
  githubUrl: string
  demoUrl: string
  featured: boolean
  status: 'draft' | 'published'
  image: File | null
  pdf: File | null
  ipynb: File | null
}

interface FormErrors {
  [key: string]: string
}

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [techInput, setTechInput] = useState('')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    shortDescription: '',
    technologies: [],
    githubUrl: '',
    demoUrl: '',
    featured: false,
    status: 'draft',
    image: null,
    pdf: null,
    ipynb: null,
  })

  useEffect(() => {
    if (!hasChanges) return
    
    const autoSaveTimer = setTimeout(() => {
      performAutoSave()
    }, 3000)

    return () => clearTimeout(autoSaveTimer)
  }, [formData, hasChanges])

  const performAutoSave = async () => {
    setAutoSaveStatus('saving')
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
      setHasChanges(false)
      
      setTimeout(() => {
        setAutoSaveStatus('idle')
      }, 2000)
    } catch (error) {
      setAutoSaveStatus('idle')
    }
  }

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanges) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasChanges])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Tytuł jest wymagany'
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Krótki opis jest wymagany'
    if (!formData.description.trim()) newErrors.description = 'Pełny opis jest wymagany'
    if (formData.technologies.length === 0) newErrors.technologies = 'Dodaj co najmniej jedno technologię'
    if (!formData.githubUrl.trim()) newErrors.githubUrl = 'Link GitHub jest wymagany'
    if (!formData.demoUrl.trim()) newErrors.demoUrl = 'Link Demo jest wymagany'
    if (!formData.image) newErrors.image = 'Obraz projektu jest wymagany'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'pdf' | 'ipynb') => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, [fieldName]: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Zapis projektu i przekierowanie do listy
      console.log('Form submitted:', formData)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/projects" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <ChevronLeft className="h-5 w-5" />
                Wróć
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Nowy Projekt</h1>
                <p className="text-muted-foreground">Dodaj nowy projekt do portfolio</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-sm">
                {autoSaveStatus === 'saving' && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">Zapisywanie...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Zapisano</span>
                  </>
                )}
                {autoSaveStatus === 'idle' && lastSaved && (
                  <span className="text-muted-foreground text-xs">
                    Ostatnia aktualizacja: {lastSaved.toLocaleTimeString('pl-PL')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Status:</span>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })
                    setHasChanges(true)
                  }}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="draft">Szkic</option>
                  <option value="published">Opublikowane</option>
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-lg border border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Informacje podstawowe</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tytuł projektu *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nazwa projektu"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => {
                        setFormData({ ...formData, featured: e.target.checked })
                        setHasChanges(true)
                      }}
                      className="h-4 w-4 rounded border border-border bg-background accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Wyróżniony projekt</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })
                      setHasChanges(true)
                    }}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="draft">Szkic</option>
                    <option value="published">Opublikowane</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Krótki opis *</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Jednolinijkowy opis projektu (max 100 znaków)"
                  maxLength={100}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
                {errors.shortDescription && <p className="text-xs text-destructive mt-1">{errors.shortDescription}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Pełny opis *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Szczegółowy opis projektu..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Stack technologiczny</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Dodaj technologię *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                    placeholder="np. React, TypeScript, PostgreSQL..."
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechnology}
                    className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Dodaj
                  </button>
                </div>
                {errors.technologies && <p className="text-xs text-destructive mt-1">{errors.technologies}</p>}
              </div>

              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Linki</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Link GitHub *</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {errors.githubUrl && <p className="text-xs text-destructive mt-1">{errors.githubUrl}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Link Demo / Live *</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {errors.demoUrl && <p className="text-xs text-destructive mt-1">{errors.demoUrl}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Pliki</h2>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Obraz projektu *</label>
                  <label className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-background/50 px-6 py-8 cursor-pointer transition-colors hover:border-primary hover:bg-background/80">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{formData.image?.name || 'Wybierz obraz'}</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WebP</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="hidden"
                    />
                  </label>
                  {errors.image && <p className="text-xs text-destructive mt-1">{errors.image}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">PDF (opcjonalnie)</label>
                  <label className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-background/50 px-6 py-8 cursor-pointer transition-colors hover:border-primary hover:bg-background/80">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{formData.pdf?.name || 'Wybierz PDF'}</p>
                      <p className="text-xs text-muted-foreground">PDF</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, 'pdf')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Jupyter Notebook (opcjonalnie)</label>
                  <label className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-background/50 px-6 py-8 cursor-pointer transition-colors hover:border-primary hover:bg-background/80">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{formData.ipynb?.name || 'Wybierz .ipynb'}</p>
                      <p className="text-xs text-muted-foreground">.ipynb</p>
                    </div>
                    <input
                      type="file"
                      accept=".ipynb"
                      onChange={(e) => handleFileChange(e, 'ipynb')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/admin/projects"
                className="flex-1 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-card text-center"
              >
                Anuluj
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  'Dodaj projekt'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
