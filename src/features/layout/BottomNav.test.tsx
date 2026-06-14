import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/renderWithProviders'
import { BottomNav } from './BottomNav'

describe('BottomNav', () => {
  it('tem links para Painel e Buscar', () => {
    renderWithProviders(<BottomNav />, { route: '/painel' })
    expect(screen.getByRole('link', { name: /painel/i })).toHaveAttribute('href', '/painel')
    expect(screen.getByRole('link', { name: /buscar/i })).toHaveAttribute('href', '/buscar')
  })
})
