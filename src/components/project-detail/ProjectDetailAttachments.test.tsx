import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectDetailAttachments } from './ProjectDetailAttachments'
import * as storageUrl from '@/lib/utils/storage-url'

vi.mock('@/lib/utils/storage-url', () => ({
  getStorageFileUrl: vi.fn((path: string) => (path ? `https://storage.example.com/${path}` : '')),
}))

describe('ProjectDetailAttachments', () => {
  it('returns null when project has no attachments', () => {
    const { container } = render(
      <ProjectDetailAttachments project={{ id: 1, title: 'P', description: '', category: 'Frontend', stack: [], github: '', demo: '' } as never} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when attachments is empty array', () => {
    const { container } = render(
      <ProjectDetailAttachments
        project={{ id: 1, title: 'P', description: '', category: 'Frontend', stack: [], github: '', demo: '', attachments: [] } as never}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders links with href from getStorageFileUrl for each attachment', () => {
    const project = {
      id: 1,
      title: 'Project',
      description: '',
      category: 'Frontend' as const,
      stack: [],
      github: '',
      demo: '',
      attachments: [
        { path: 'projects/1/doc.pdf', label: 'Doc PDF', type: 'pdf' as const },
        { path: 'projects/1/notebook.ipynb', label: 'Notebook', type: 'ipynb' as const },
      ],
    }
    render(<ProjectDetailAttachments project={project} />)

    const linkPdf = screen.getByRole('link', { name: /Doc PDF/i })
    const linkIpynb = screen.getByRole('link', { name: /Notebook/i })

    expect(linkPdf).toHaveAttribute('href', 'https://storage.example.com/projects/1/doc.pdf')
    expect(linkIpynb).toHaveAttribute('href', 'https://storage.example.com/projects/1/notebook.ipynb')
    expect(storageUrl.getStorageFileUrl).toHaveBeenCalledWith('projects/1/doc.pdf')
    expect(storageUrl.getStorageFileUrl).toHaveBeenCalledWith('projects/1/notebook.ipynb')
  })

  it('uses getStorageFileUrl so href is not raw path', () => {
    const project = {
      id: 1,
      title: 'P',
      description: '',
      category: 'Frontend' as const,
      stack: [],
      github: '',
      demo: '',
      attachments: [{ path: 'projects/2/file.md', label: 'Readme', type: 'md' as const }],
    }
    render(<ProjectDetailAttachments project={project} />)
    const link = screen.getByRole('link', { name: /Readme/i })
    expect(link.getAttribute('href')).not.toBe('projects/2/file.md')
    expect(link.getAttribute('href')).toContain('projects/2/file.md')
  })
})
