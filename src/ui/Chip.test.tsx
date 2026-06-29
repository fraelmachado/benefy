import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Chip } from './Chip'

describe('Chip', () => {
  it('renderiza chip ativo com aria-pressed', () => {
    render(
      <Chip category="viagem" active>
        Viagem
      </Chip>,
    )
    const b = screen.getByRole('button', { name: /viagem/i })
    expect(b).toHaveAttribute('aria-pressed', 'true')
    expect(b).toHaveClass('chip', 'on')
  })
})
