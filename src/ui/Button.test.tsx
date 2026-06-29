import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('aplica a variante ghost', () => {
    render(<Button variant="ghost">Ok</Button>)
    expect(screen.getByRole('button', { name: 'Ok' })).toHaveClass('btn', 'ghost')
  })
})
