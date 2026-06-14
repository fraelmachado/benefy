import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

const ensureMock = vi.fn()
vi.mock('./auth', () => ({ ensureAnonymousSession: () => ensureMock() }))
vi.mock('../../lib/supabase', () => ({
  supabase: { auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) } },
}))

import { AuthProvider } from './AuthProvider'

beforeEach(() => ensureMock.mockReset())

describe('AuthProvider', () => {
  it('mostra loading até a sessão resolver e então renderiza os filhos', async () => {
    let resolve!: (v: unknown) => void
    ensureMock.mockReturnValue(new Promise((r) => (resolve = r)))
    render(<AuthProvider><div>conteúdo</div></AuthProvider>)
    expect(screen.getByText(/preparando/i)).toBeInTheDocument()
    expect(screen.queryByText('conteúdo')).not.toBeInTheDocument()
    resolve({ user: { id: 'x' } })
    await waitFor(() => expect(screen.getByText('conteúdo')).toBeInTheDocument())
  })
})
