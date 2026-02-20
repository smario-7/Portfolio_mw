import type { ProjectAttachment } from '@/lib/types'
import type { ProjectFormData } from '@/lib/validation/project-validation'
import { AdminSectionCard } from '@/components/admin/AdminSectionCard'

const EMPTY = ''

interface ProjectEditLinksProps {
  formData: ProjectFormData
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
  existingAttachments: ProjectAttachment[]
  existingImagePaths: string[]
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (path: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <select
        value={value || EMPTY}
        onChange={(e) => onChange(e.target.value === EMPTY ? '' : e.target.value)}
        className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
      >
        <option value={EMPTY}>— Nie pokazuj —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ProjectEditLinks({
  formData,
  setFormData,
  existingAttachments,
  existingImagePaths,
}: ProjectEditLinksProps) {
  const dl = formData.downloadLinks ?? {}

  const setDownloadLink = (key: keyof typeof dl, path: string) => {
    setFormData((prev) => ({
      ...prev,
      downloadLinks: {
        ...(prev.downloadLinks ?? {}),
        [key]: path || undefined,
      },
    }))
  }

  const pdfOptions = existingAttachments
    .filter((a) => a.type === 'pdf')
    .map((a) => ({ value: a.path, label: a.label }))
  const ipynbOptions = existingAttachments
    .filter((a) => a.type === 'ipynb')
    .map((a) => ({ value: a.path, label: a.label }))
  const mdOptions = existingAttachments
    .filter((a) => a.type === 'md')
    .map((a) => ({ value: a.path, label: a.label }))
  const imageOptions = existingImagePaths.map((path) => ({
    value: path,
    label: path.split('/').pop() ?? path,
  }))

  return (
    <AdminSectionCard title="Linki">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">GitHub</label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData({ ...formData, githubUrl: e.target.value })
            }
            placeholder="https://github.com/..."
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Demo</label>
          <input
            type="url"
            value={formData.demoUrl}
            onChange={(e) =>
              setFormData({ ...formData, demoUrl: e.target.value })
            }
            placeholder="https://demo.example.com"
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="mb-3 text-sm font-medium text-foreground">Przyciski pobierania</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Wybrane pliki pojawią się jako przyciski obok GitHub i Demo na stronie projektu.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectRow
            label="PDF"
            value={dl.pdf ?? ''}
            options={pdfOptions}
            onChange={(path) => setDownloadLink('pdf', path)}
          />
          <SelectRow
            label="Jupyter (.ipynb)"
            value={dl.ipynb ?? ''}
            options={ipynbOptions}
            onChange={(path) => setDownloadLink('ipynb', path)}
          />
          <SelectRow
            label="Markdown (.md)"
            value={dl.md ?? ''}
            options={mdOptions}
            onChange={(path) => setDownloadLink('md', path)}
          />
          <SelectRow
            label="Obraz"
            value={dl.image ?? ''}
            options={imageOptions}
            onChange={(path) => setDownloadLink('image', path)}
          />
        </div>
      </div>
    </AdminSectionCard>
  )
}
