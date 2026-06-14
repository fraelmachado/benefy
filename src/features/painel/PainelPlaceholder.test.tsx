import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/renderWithProviders'

vi.mock('../auth/AuthProvider', () => ({
  useSession: () => ({ session: { user: { id: 'u1' } }, loading: false }),
}))

let countResult: { data: number | undefined; isLoading: boolean; error: unknown }
vi.mock('../benefits/useMyBenefitsCount', () => ({
  useMyBenefitsCount: () => countResult,
}))

import { PainelPlaceholder } from './PainelPlaceholder'

beforeEach(() => {
  countResult = { data: undefined, isLoading: false, error: null }
})

describe('PainelPlaceholder', () => {
  it('mostra a contagem quando carrega', () => {
    countResult = { data: 3, isLoading: false, error: null }
    renderWithProviders(<PainelPlaceholder />)
    expect(screen.getByText(/3 benefícios ativos/i)).toBeInTheDocument()
  })

  it('mostra erro quando a query falha', () => {
    countResult = { data: undefined, isLoading: false, error: new Error('x') }
    renderWithProviders(<PainelPlaceholder />)
    expect(screen.getByText(/não foi possível carregar/i)).toBeInTheDocument()
  })
})
