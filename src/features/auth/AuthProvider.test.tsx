import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Quando true, o sign-in anônimo rejeita. A rejeição é criada dentro da
// implementação base do vi.fn (e não via mockRejectedValue/mockImplementation)
// para evitar que o Vitest reporte a rejeição tratada como erro do teste.
let signInShouldFail = false
const ensureMock = vi.fn(() =>
  signInShouldFail
    ? Promise.reject(new Error('falhou'))
    : Promise.resolve({ user: { id: 'x' } }),
)
vi.mock('./auth', () => ({ ensureAnonymousSession: () => ensureMock() }))
vi.mock('../../lib/supabase', () => ({
  supabase: { auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) } },
}))

import { AuthProvider } from './AuthProvider'

beforeEach(() => {
  signInShouldFail = false
  ensureMock.mockClear()
})

describe('AuthProvider', () => {
  it('mostra loading até a sessão resolver e então renderiza os filhos', async () => {
    let resolve!: (v: { user: { id: string } }) => void
    ensureMock.mockReturnValueOnce(new Promise((r) => (resolve = r)))
    render(<AuthProvider><div>conteúdo</div></AuthProvider>)
    expect(screen.getByText(/preparando/i)).toBeInTheDocument()
    expect(screen.queryByText('conteúdo')).not.toBeInTheDocument()
    resolve({ user: { id: 'x' } })
    await waitFor(() => expect(screen.getByText('conteúdo')).toBeInTheDocument())
  })

  it('mostra erro com retry quando o sign-in anônimo falha', async () => {
    signInShouldFail = true
    render(<AuthProvider><div>conteúdo</div></AuthProvider>)
    await waitFor(() => expect(screen.getByText(/não foi possível conectar/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /tentar de novo/i })).toBeInTheDocument()
    expect(screen.queryByText('conteúdo')).not.toBeInTheDocument()
  })
})
