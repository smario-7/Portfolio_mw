import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useProjects } from '@/contexts/PortfolioContext'
import { ProjectDetail } from './ProjectDetail'
import type { Project } from '@/lib/types'

const defaultProjectsContext = {
  projects: [] as Project[],
  projectFilters: [] as string[],
  setProjects: vi.fn(),
  addProject: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  loading: false,
  error: null as string | null,
  useSupabase: false,
}

vi.mock('@/contexts/PortfolioContext', () => ({
  useProjects: vi.fn(() => defaultProjectsContext),
}))

vi.mock('@/lib/utils/storage-url', () => ({
  getStorageFileUrl: vi.fn((path: string) => (path ? `https://storage.example.com/${path}` : '')),
}))

vi.mock('./ProjectDetailFullDescription', () => ({
  ProjectDetailFullDescription: () => null,
}))

const mockProject: Project = {
  id: 1,
  title: 'Test Project Title',
  description: 'Short project description',
  category: 'Frontend',
  stack: ['React', 'TypeScript'],
  github: 'https://github.com/example/repo',
  demo: 'https://example.com/demo',
}

describe('ProjectDetail', () => {
  it('renders project title and description when project prop is passed', () => {
    render(<ProjectDetail project={mockProject} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockProject.title)
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
  })

  it('returns null when projectId is passed and project is not in context', () => {
    render(<ProjectDetail projectId={123} />)

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.queryByText(mockProject.title)).not.toBeInTheDocument()
  })

  it('renders project from context when projectId is passed and project exists in context', () => {
    vi.mocked(useProjects).mockReturnValueOnce({
  ...defaultProjectsContext,
  projects: [mockProject],
})

    render(<ProjectDetail projectId={mockProject.id} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockProject.title)
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
  })
})
