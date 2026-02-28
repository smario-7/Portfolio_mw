import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectEditStack } from './ProjectEditStack'

describe('ProjectEditStack', () => {
  const defaultProps = {
    formData: { technologies: [] } as never,
    techInput: '',
    setTechInput: () => {},
    onAddTechnology: () => {},
    onRemoveTechnology: () => {},
  }

  it('renders error message when error prop is set', () => {
    render(
      <ProjectEditStack
        {...defaultProps}
        error="Dodaj co najmniej jedną technologię"
      />
    )
    expect(screen.getByText('Dodaj co najmniej jedną technologię')).toBeInTheDocument()
  })

  it('does not render error paragraph when error is undefined', () => {
    render(<ProjectEditStack {...defaultProps} />)
    expect(screen.queryByText('Dodaj co najmniej jedną technologię')).not.toBeInTheDocument()
  })
})
