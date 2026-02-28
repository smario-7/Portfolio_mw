import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProjectForm } from '@/hooks/use-project-form'

describe('useProjectForm', () => {
  describe('validateForm', () => {
    it('returns false and sets errors when form is incomplete (mode new)', () => {
      const { result } = renderHook(() =>
        useProjectForm({ mode: 'new' })
      )

      let isValid: boolean
      act(() => {
        isValid = result.current.validateForm()
      })

      expect(isValid!).toBe(false)
      expect(result.current.errors.title).toBe('Tytuł jest wymagany')
      expect(result.current.errors.shortDescription).toBe('Krótki opis jest wymagany')
      expect(result.current.errors.technologies).toBe('Dodaj co najmniej jedną technologię')
    })

    it('returns true and clears errors when form has required fields (mode new)', () => {
      const { result } = renderHook(() =>
        useProjectForm({ mode: 'new' })
      )

      act(() => {
        result.current.setFormData((prev) => ({
          ...prev,
          title: 'Projekt',
          shortDescription: 'Krótki opis projektu',
          technologies: ['React'],
        }))
      })

      let isValid: boolean
      act(() => {
        isValid = result.current.validateForm()
      })

      expect(isValid!).toBe(true)
      expect(result.current.errors.title).toBeUndefined()
      expect(result.current.errors.shortDescription).toBeUndefined()
      expect(result.current.errors.technologies).toBeUndefined()
    })
  })

  describe('initial formData', () => {
    it('does not include downloadLinks in formData (mode new)', () => {
      const { result } = renderHook(() =>
        useProjectForm({ mode: 'new' })
      )
      expect(result.current.formData).not.toHaveProperty('downloadLinks')
    })

    it('does not include downloadLinks in formData (mode edit with initialData)', () => {
      const { result } = renderHook(() =>
        useProjectForm({
          mode: 'edit',
          initialData: {
            id: 1,
            title: 'Projekt',
            description: 'Opis',
            category: 'Frontend',
            stack: ['React'],
            github: '',
            demo: '',
          },
        })
      )
      expect(result.current.formData).not.toHaveProperty('downloadLinks')
    })
  })

  describe('handleAddTechnology / handleRemoveTechnology', () => {
    it('adds technology from techInput and clears techInput', () => {
      const { result } = renderHook(() =>
        useProjectForm({ mode: 'new' })
      )

      act(() => {
        result.current.setTechInput('React')
      })
      act(() => {
        result.current.handleAddTechnology()
      })

      expect(result.current.formData.technologies).toEqual(['React'])
      expect(result.current.techInput).toBe('')
    })

    it('does not add duplicate technology', () => {
      const { result } = renderHook(() =>
        useProjectForm({ mode: 'new' })
      )

      act(() => {
        result.current.setFormData((prev) => ({
          ...prev,
          technologies: ['React'],
        }))
      })
      act(() => {
        result.current.setTechInput('React')
      })
      act(() => {
        result.current.handleAddTechnology()
      })

      expect(result.current.formData.technologies).toEqual(['React'])
    })

    it('removes technology when handleRemoveTechnology is called', () => {
      const { result } = renderHook(() =>
        useProjectForm({ mode: 'new' })
      )

      act(() => {
        result.current.setFormData((prev) => ({
          ...prev,
          technologies: ['React', 'TypeScript'],
        }))
      })
      act(() => {
        result.current.handleRemoveTechnology('React')
      })

      expect(result.current.formData.technologies).toEqual(['TypeScript'])
    })
  })
})
