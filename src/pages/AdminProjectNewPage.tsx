import { useRef } from 'react'
import { ChevronLeft, Upload, X, Loader2, Check, Paperclip } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { usePortfolio } from '@/contexts/PortfolioContext'
import { useProjectForm } from '@/hooks/use-project-form'
import { PROJECT_CATEGORIES } from '@/lib/constants/categories'
import { uploadProjectFile } from '@/lib/api/storage-api'
import { nextProjectId } from '@/lib/services/projects-service'
import type { ProjectCategory, ProjectAttachment } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export default function NewProjectPage() {
  const navigate = useNavigate()
  const { addProject, updateProject, projects } = usePortfolio()
  const form = useProjectForm({ mode: 'new', projects })
  const attachmentInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.validateForm()) return

    form.setIsLoading(true)
    try {
      const nextId = nextProjectId(projects)
      addProject({
        id: nextId,
        title: form.formData.title.trim(),
        description: form.formData.shortDescription.trim(),
        fullDescription: form.formData.description.trim() || undefined,
        category: form.formData.category,
        stack: form.formData.technologies,
        github: form.formData.githubUrl.trim(),
        demo: form.formData.demoUrl.trim(),
        image: form.formData.image ? '/projects/placeholder.jpg' : undefined,
      })
      const attachments: ProjectAttachment[] = []
      if (form.attachmentFiles.length > 0) {
        for (const file of form.attachmentFiles) {
          try {
            const data = await uploadProjectFile(nextId, file)
            attachments.push({ label: data.label, path: data.path, type: data.type as ProjectAttachment['type'] })
          } catch (error) {
            console.error('Błąd uploadu pliku:', error)
          }
        }
        if (attachments.length > 0) updateProject(nextId, { attachments })
      }
      toast.success('Projekt dodany')
      navigate('/admin/projects')
    } catch {
      toast.error('Nie udało się dodać projektu')
    } finally {
      form.setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
        <div className="mb-4">
          <Link to="/admin/projects" className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
            Wróć
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Nowy Projekt</h1>
            <p className="text-muted-foreground">Dodaj nowy projekt do portfolio</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {form.autoSaveStatus === 'saving' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-muted-foreground">Zapisywanie...</span>
                </>
              )}
              {form.autoSaveStatus === 'saved' && (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Zapisano</span>
                </>
              )}
              {form.autoSaveStatus === 'idle' && form.lastSaved && (
                <span className="text-muted-foreground text-xs">
                  Ostatnia aktualizacja: {form.lastSaved.toLocaleTimeString('pl-PL')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Status:</span>
              <Select
                value={form.formData.status}
                onValueChange={(value) => {
                  form.setFormData({ ...form.formData, status: value as 'draft' | 'published' })
                }}
              >
                <SelectTrigger size="sm" className="rounded-full w-fit min-w-[7rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Szkic</SelectItem>
                  <SelectItem value="published">Opublikowane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              type="submit"
              form="new-project-form"
              disabled={form.isLoading}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {form.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                'Dodaj projekt'
              )}
            </button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-14rem)]">
          <form id="new-project-form" onSubmit={handleSubmit} className="space-y-8 pr-4">
            <div className="rounded-lg border-2 border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Informacje podstawowe</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tytuł projektu *</label>
                  <input
                    type="text"
                    value={form.formData.title}
                    onChange={(e) => form.setFormData({ ...form.formData, title: e.target.value })}
                    placeholder="Nazwa projektu"
                    className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {form.errors.title && <p className="text-xs text-destructive mt-1">{form.errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Kategoria *</label>
                  <Select
                    value={form.formData.category}
                    onValueChange={(value) => {
                      form.setFormData({ ...form.formData, category: value as ProjectCategory })
                    }}
                  >
                    <SelectTrigger className="w-full rounded-lg h-10 px-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.formData.featured}
                      onChange={(e) => {
                        form.setFormData({ ...form.formData, featured: e.target.checked })
                      }}
                      className="h-4 w-4 rounded border-2 border-border bg-background accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Wyróżniony projekt</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
                  <Select
                    value={form.formData.status}
                    onValueChange={(value) => {
                      form.setFormData({ ...form.formData, status: value as 'draft' | 'published' })
                    }}
                  >
                    <SelectTrigger className="w-full rounded-lg h-10 px-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Szkic</SelectItem>
                      <SelectItem value="published">Opublikowane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Krótki opis *</label>
                <input
                  type="text"
                  value={form.formData.shortDescription}
                  onChange={(e) => form.setFormData({ ...form.formData, shortDescription: e.target.value })}
                  placeholder="Jednolinijkowy opis projektu (max 100 znaków)"
                  maxLength={100}
                  className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
                {form.errors.shortDescription && <p className="text-xs text-destructive mt-1">{form.errors.shortDescription}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Pełny opis *</label>
                <textarea
                  value={form.formData.description}
                  onChange={(e) => form.setFormData({ ...form.formData, description: e.target.value })}
                  placeholder="Szczegółowy opis projektu..."
                  rows={4}
                  className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
                />
                {form.errors.description && <p className="text-xs text-destructive mt-1">{form.errors.description}</p>}
              </div>
            </div>

            <div className="rounded-lg border-2 border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Stack technologiczny</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Dodaj technologię *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.techInput}
                    onChange={(e) => form.setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), form.handleAddTechnology())}
                    placeholder="np. React, TypeScript, PostgreSQL..."
                    className="flex-1 rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={form.handleAddTechnology}
                    className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Dodaj
                  </button>
                </div>
                {form.errors.technologies && <p className="text-xs text-destructive mt-1">{form.errors.technologies}</p>}
              </div>

              {form.formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.formData.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => form.handleRemoveTechnology(tech)}
                        className="hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border-2 border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Linki</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Link GitHub *</label>
                  <input
                    type="url"
                    value={form.formData.githubUrl}
                    onChange={(e) => form.setFormData({ ...form.formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {form.errors.githubUrl && <p className="text-xs text-destructive mt-1">{form.errors.githubUrl}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Link Demo / Live *</label>
                  <input
                    type="url"
                    value={form.formData.demoUrl}
                    onChange={(e) => form.setFormData({ ...form.formData, demoUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {form.errors.demoUrl && <p className="text-xs text-destructive mt-1">{form.errors.demoUrl}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-border bg-card/30 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Pliki</h2>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Obraz projektu *</label>
                  <label className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-background/50 px-6 py-8 cursor-pointer transition-colors hover:border-primary hover:bg-background/80">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{form.formData.image?.name || 'Wybierz obraz'}</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WebP</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => form.handleFileChange(e, 'image')}
                      className="hidden"
                    />
                  </label>
                  {form.errors.image && <p className="text-xs text-destructive mt-1">{form.errors.image}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4" />
                  Załączniki (PDF, .ipynb, .md)
                </h3>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept=".pdf,.ipynb,.md,application/pdf"
                  multiple
                  className="hidden"
                  onChange={form.handleAttachmentFiles}
                />
                <button
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  className="rounded-lg border-2 border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
                >
                  Wybierz pliki
                </button>
                {form.attachmentFiles.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {form.attachmentFiles.map((file, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg border-2 border-border bg-background/50 px-4 py-2">
                        <span className="text-sm text-foreground truncate flex-1 min-w-0">{file.name}</span>
                        <button type="button" onClick={() => form.removeAttachmentFile(i)} className="ml-2 p-1 text-muted-foreground hover:text-destructive" aria-label="Usuń">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/admin/projects"
                className="flex-1 rounded-lg border-2 border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-card text-center"
              >
                Anuluj
              </Link>
            </div>
          </form>
      </ScrollArea>
    </div>
  )
}
