import { describe, expect, it } from 'vitest'
import {
  validateProjectForm,
  validateFullDescriptionBlocks,
  type ProjectFormData,
} from '@/lib/validation/project-validation'
import type { ProjectDetailBlock } from '@/lib/types'

describe('validateProjectForm', () => {
  it('returns error when title is missing', () => {
    const result = validateProjectForm({
      title: '',
      shortDescription: 'Opis',
      technologies: ['React'],
    })
    expect(result.title).toBe('Tytuł jest wymagany')
  })

  it('returns error when title is only whitespace', () => {
    const result = validateProjectForm({
      title: '   ',
      shortDescription: 'Opis',
      technologies: ['React'],
    })
    expect(result.title).toBe('Tytuł jest wymagany')
  })

  it('returns error when shortDescription is missing', () => {
    const result = validateProjectForm({
      title: 'Projekt',
      shortDescription: '',
      technologies: ['React'],
    })
    expect(result.shortDescription).toBe('Krótki opis jest wymagany')
  })

  it('returns error when technologies is empty', () => {
    const result = validateProjectForm({
      title: 'Projekt',
      shortDescription: 'Opis',
      technologies: [],
    })
    expect(result.technologies).toBe('Dodaj co najmniej jedną technologię')
  })

  it('returns error when githubUrl is invalid', () => {
    const result = validateProjectForm({
      title: 'Projekt',
      shortDescription: 'Opis',
      technologies: ['React'],
      githubUrl: 'not-a-url',
    })
    expect(result.githubUrl).toBe('Link GitHub musi być poprawnym URL')
  })

  it('returns error when demoUrl is invalid', () => {
    const result = validateProjectForm({
      title: 'Projekt',
      shortDescription: 'Opis',
      technologies: ['React'],
      demoUrl: 'not-a-url',
    })
    expect(result.demoUrl).toBe('Link Demo musi być poprawnym URL')
  })

  it('does not set url errors when urls are empty', () => {
    const result = validateProjectForm({
      title: 'Projekt',
      shortDescription: 'Opis',
      technologies: ['React'],
      githubUrl: '',
      demoUrl: '',
    })
    expect(result.githubUrl).toBeUndefined()
    expect(result.demoUrl).toBeUndefined()
  })

  it('returns no errors when all required fields are valid', () => {
    const formData: Partial<ProjectFormData> = {
      title: 'Projekt',
      shortDescription: 'Krótki opis projektu',
      technologies: ['React'],
      githubUrl: 'https://github.com/user/repo',
      demoUrl: 'https://example.com',
    }
    const result = validateProjectForm(formData)
    expect(result.title).toBeUndefined()
    expect(result.shortDescription).toBeUndefined()
    expect(result.technologies).toBeUndefined()
    expect(result.githubUrl).toBeUndefined()
    expect(result.demoUrl).toBeUndefined()
  })

  it('includes fullDescriptionBlocks errors when blocks are invalid', () => {
    const result = validateProjectForm({
      title: 'Projekt',
      shortDescription: 'Opis',
      technologies: ['React'],
      fullDescriptionBlocks: [
        { type: 'screenshot', path: '' },
      ] as ProjectDetailBlock[],
    })
    expect(result.fullDescriptionBlocks).toEqual({
      0: 'Screenshot: podaj ścieżkę do obrazka',
    })
  })
})

describe('validateFullDescriptionBlocks', () => {
  it('returns error for screenshot block without path', () => {
    const blocks: ProjectDetailBlock[] = [
      { type: 'screenshot', path: '' },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBe('Screenshot: podaj ścieżkę do obrazka')
  })

  it('returns error for screenshot block with whitespace-only path', () => {
    const blocks: ProjectDetailBlock[] = [
      { type: 'screenshot', path: '   ' },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBe('Screenshot: podaj ścieżkę do obrazka')
  })

  it('returns no error for screenshot block with path', () => {
    const blocks: ProjectDetailBlock[] = [
      { type: 'screenshot', path: '/img.png' },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBeUndefined()
  })

  it('returns error for code block without sourceFile', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: '',
        sourceType: 'py',
        fragmentId: '',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBe('Kod: wybierz plik źródłowy')
  })

  it('returns error for code .py block when range "from" is greater than "to"', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'main.py',
        sourceType: 'py',
        fragmentId: '10-5',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toContain('wartość „od” musi być mniejsza lub równa „do”')
  })

  it('returns no error for code .py block with single line fragment', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'main.py',
        sourceType: 'py',
        fragmentId: '7',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBeUndefined()
  })

  it('returns no error for code .py block with valid range', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'main.py',
        sourceType: 'py',
        fragmentId: '1-10',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBeUndefined()
  })

  it('returns error for code .py block with invalid fragment format', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'main.py',
        sourceType: 'py',
        fragmentId: 'abc',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBe('Kod (.py): fragment to numer linii (np. 7) lub zakres (np. 10-25)')
  })

  it('returns error for code ipynb block with invalid fragment', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'notebook.ipynb',
        sourceType: 'ipynb',
        fragmentId: 'x,y',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBe('Kod (ipynb): fragment to indeksy komórek (np. 0,2,4 lub 1-3)')
  })

  it('returns no error for code ipynb block with empty fragmentId', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'notebook.ipynb',
        sourceType: 'ipynb',
        fragmentId: '',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBeUndefined()
  })

  it('returns no error for code ipynb block with single cell index', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'notebook.ipynb',
        sourceType: 'ipynb',
        fragmentId: '0',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBeUndefined()
  })

  it('returns no error for code ipynb block with comma-separated indices', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'notebook.ipynb',
        sourceType: 'ipynb',
        fragmentId: '0,2,4',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBeUndefined()
  })

  it('returns no error for code ipynb block with valid range', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'notebook.ipynb',
        sourceType: 'ipynb',
        fragmentId: '1-3',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBeUndefined()
  })

  it('returns error for code ipynb block when range "from" is greater than "to"', () => {
    const blocks: ProjectDetailBlock[] = [
      {
        type: 'code',
        sourceFile: 'notebook.ipynb',
        sourceType: 'ipynb',
        fragmentId: '3-1',
      },
    ]
    const result = validateFullDescriptionBlocks(blocks)
    expect(result[0]).toBe(
      'Kod (ipynb): w zakresie indeksów wartość „od” musi być mniejsza lub równa „do”'
    )
  })
})
