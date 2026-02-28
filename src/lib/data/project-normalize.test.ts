import {
  fullDescriptionToBlocks,
  normalizeProject,
  fullDescriptionBlocksToFormString,
  formStringToFullDescriptionBlocks,
  buildProjectFromFormData,
  type RawProject,
} from '@/lib/data/project-normalize'
import type { ProjectFormData } from '@/lib/validation/project-validation'

describe('fullDescriptionToBlocks', () => {
  it('returns empty array for undefined', () => {
    expect(fullDescriptionToBlocks(undefined)).toEqual([])
  })

  it('returns empty array for empty array', () => {
    expect(fullDescriptionToBlocks([])).toEqual([])
  })

  it('returns same array when given array of blocks', () => {
    const blocks = [{ type: 'text' as const, content: 'x' }]
    expect(fullDescriptionToBlocks(blocks)).toEqual(blocks)
  })

  it('returns one text block for string with content (content is original string, not trimmed)', () => {
    const input = '  tekście  '
    expect(fullDescriptionToBlocks(input)).toEqual([
      { type: 'text', content: '  tekście  ' },
    ])
  })

  it('returns empty array for empty string', () => {
    expect(fullDescriptionToBlocks('')).toEqual([])
  })

  it('returns empty array for whitespace-only string', () => {
    expect(fullDescriptionToBlocks('   ')).toEqual([])
  })

  it('returns same array for multiple blocks including non-text', () => {
    const blocks = [
      { type: 'text' as const, content: 'A' },
      { type: 'screenshot' as const, path: '/img.png' },
      { type: 'text' as const, content: 'B' },
    ]
    expect(fullDescriptionToBlocks(blocks)).toEqual(blocks)
  })
})

describe('normalizeProject', () => {
  const baseRaw: RawProject = {
    id: 1,
    title: 'Test',
    description: 'Desc',
    category: 'Frontend',
    stack: [],
    github: '',
    demo: '',
  }

  it('converts fullDescription string to array of one text block', () => {
    const raw: RawProject = { ...baseRaw, fullDescription: 'opis' }
    const result = normalizeProject(raw)
    expect(result.fullDescription).toEqual([
      { type: 'text', content: 'opis' },
    ])
  })

  it('keeps fullDescription as array when already blocks', () => {
    const blocks = [{ type: 'text' as const, content: 'x' }]
    const raw: RawProject = { ...baseRaw, fullDescription: blocks }
    const result = normalizeProject(raw)
    expect(result.fullDescription).toEqual(blocks)
  })

  it('sets fullDescription to undefined when raw has undefined fullDescription', () => {
    const raw: RawProject = { ...baseRaw }
    const result = normalizeProject(raw)
    expect(result.fullDescription).toBeUndefined()
  })

  it('sets fullDescription to undefined when raw has empty array', () => {
    const raw: RawProject = { ...baseRaw, fullDescription: [] }
    const result = normalizeProject(raw)
    expect(result.fullDescription).toBeUndefined()
  })

  it('preserves other raw fields and normalizes fullDescription', () => {
    const raw: RawProject = {
      ...baseRaw,
      fullDescription: 'treść',
      order: 2,
    }
    const result = normalizeProject(raw)
    expect(result.id).toBe(1)
    expect(result.title).toBe('Test')
    expect(result.order).toBe(2)
    expect(result.fullDescription).toEqual([
      { type: 'text', content: 'treść' },
    ])
  })
})

describe('fullDescriptionBlocksToFormString', () => {
  it('returns empty string for undefined', () => {
    expect(fullDescriptionBlocksToFormString(undefined)).toBe('')
  })

  it('returns empty string for empty array', () => {
    expect(fullDescriptionBlocksToFormString([])).toBe('')
  })

  it('returns content for single text block', () => {
    expect(
      fullDescriptionBlocksToFormString([{ type: 'text', content: 'x' }])
    ).toBe('x')
  })

  it('joins multiple text blocks with double newline', () => {
    const blocks = [
      { type: 'text' as const, content: 'A' },
      { type: 'text' as const, content: 'B' },
    ]
    expect(fullDescriptionBlocksToFormString(blocks)).toBe('A\n\nB')
  })

  it('includes only text blocks when mixed with screenshot/code', () => {
    const blocks = [
      { type: 'screenshot' as const, path: '/a.png' },
      { type: 'text' as const, content: 'tekst' },
    ]
    expect(fullDescriptionBlocksToFormString(blocks)).toBe('tekst')
  })
})

describe('formStringToFullDescriptionBlocks', () => {
  it('returns undefined for empty string', () => {
    expect(formStringToFullDescriptionBlocks('')).toBeUndefined()
  })

  it('returns undefined for whitespace-only string', () => {
    expect(formStringToFullDescriptionBlocks('   ')).toBeUndefined()
  })

  it('returns one text block for non-empty string', () => {
    expect(formStringToFullDescriptionBlocks('abc')).toEqual([
      { type: 'text', content: 'abc' },
    ])
  })

  it('trims input and puts trimmed content in block', () => {
    expect(formStringToFullDescriptionBlocks('  x  ')).toEqual([
      { type: 'text', content: 'x' },
    ])
  })
})

describe('round-trip formString ↔ blocks', () => {
  it('formString → blocks → formString preserves string', () => {
    const formString = 'linia1\n\nlinia2'
    const blocks = formStringToFullDescriptionBlocks(formString)
    expect(blocks).toEqual([
      { type: 'text', content: 'linia1\n\nlinia2' },
    ])
    const back = fullDescriptionBlocksToFormString(blocks!)
    expect(back).toBe(formString)
  })

  it('blocks → formString → blocks yields single block with concatenated content', () => {
    const blocks = [
      { type: 'text' as const, content: 'A' },
      { type: 'text' as const, content: 'B' },
    ]
    const formString = fullDescriptionBlocksToFormString(blocks)
    expect(formString).toBe('A\n\nB')
    const back = formStringToFullDescriptionBlocks(formString)
    expect(back).toEqual([{ type: 'text', content: 'A\n\nB' }])
  })
})

function minimalFormData(overrides: Partial<ProjectFormData> = {}): ProjectFormData {
  return {
    title: 'Title',
    shortDescription: 'Lead',
    fullDescriptionBlocks: [],
    technologies: ['React', 'TS'],
    githubUrl: 'https://github.com/x',
    demoUrl: 'https://demo.example.com',
    category: 'Frontend',
    featured: false,
    status: 'published',
    image: null,
    imagePath: '',
    ...overrides,
  }
}

describe('buildProjectFromFormData', () => {
  it('returns Project with basic fields from minimal formData', () => {
    const formData = minimalFormData()
    const result = buildProjectFromFormData({
      formData,
      attachments: [],
      projectId: 1,
    })
    expect(result.id).toBe(1)
    expect(result.title).toBe('Title')
    expect(result.description).toBe('Lead')
    expect(result.category).toBe('Frontend')
    expect(result.stack).toEqual(['React', 'TS'])
    expect(result.github).toBe('https://github.com/x')
    expect(result.demo).toBe('https://demo.example.com')
    expect(result.status).toBe('published')
    expect(result.featured).toBe(false)
    expect(result.attachments).toEqual([])
  })

  it('uses imagePath when set, then existingImagePath when imagePath empty', () => {
    const withNewImage = buildProjectFromFormData({
      formData: minimalFormData({ imagePath: ' nowy.png ' }),
      attachments: [],
      projectId: 1,
      existingImagePath: 'stary.png',
    })
    expect(withNewImage.image).toBe('nowy.png')

    const withExistingOnly = buildProjectFromFormData({
      formData: minimalFormData({ imagePath: '' }),
      attachments: [],
      projectId: 1,
      existingImagePath: 'stary.png',
    })
    expect(withExistingOnly.image).toBe('stary.png')

    const bothEmpty = buildProjectFromFormData({
      formData: minimalFormData({ imagePath: '' }),
      attachments: [],
      projectId: 1,
    })
    expect(bothEmpty.image).toBeUndefined()
  })

  it('sets fullDescription to undefined when blocks empty, otherwise passes blocks', () => {
    const noBlocks = buildProjectFromFormData({
      formData: minimalFormData(),
      attachments: [],
      projectId: 1,
    })
    expect(noBlocks.fullDescription).toBeUndefined()

    const blocks = [{ type: 'text' as const, content: 'x' }]
    const withBlocks = buildProjectFromFormData({
      formData: minimalFormData({ fullDescriptionBlocks: blocks }),
      attachments: [],
      projectId: 1,
    })
    expect(withBlocks.fullDescription).toEqual(blocks)
  })

  it('trims title, description, github, demo, and color', () => {
    const result = buildProjectFromFormData({
      formData: minimalFormData({
        title: '  Tytuł  ',
        shortDescription: '  Opis  ',
        githubUrl: ' https://github.com/y ',
        demoUrl: ' https://demo.com ',
        color: ' #abc ',
      }),
      attachments: [],
      projectId: 2,
    })
    expect(result.title).toBe('Tytuł')
    expect(result.description).toBe('Opis')
    expect(result.github).toBe('https://github.com/y')
    expect(result.demo).toBe('https://demo.com')
    expect(result.color).toBe('#abc')
  })

  it('passes through attachments', () => {
    const attachments = [{ label: 'PDF', path: '/x.pdf', type: 'pdf' as const }]
    const result = buildProjectFromFormData({
      formData: minimalFormData(),
      attachments,
      projectId: 1,
    })
    expect(result.attachments).toEqual(attachments)
  })

  it('image is undefined when existingImagePath omitted and imagePath empty', () => {
    const result = buildProjectFromFormData({
      formData: minimalFormData({ imagePath: '' }),
      attachments: [],
      projectId: 1,
    })
    expect(result.image).toBeUndefined()
  })

  it('sets color to undefined when not provided in formData', () => {
    const result = buildProjectFromFormData({
      formData: minimalFormData(),
      attachments: [],
      projectId: 1,
    })
    expect(result.color).toBeUndefined()
  })
})
