import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test/renderWithProviders'

const signIn = vi.fn()
vi.mock('../../lib/supabase', () => ({
  supabase: { auth: { signInWithPassword: (...a: unknown[]) => signIn(...a) } },
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

import { AdminLogin } from './AdminLogin'

beforeEach(() => {
  signIn.mockReset()
  navigateMock.mockReset()
})

describe('AdminLogin', () => {
  it('faz login e navega pro /admin', async () => {
    signIn.mockResolvedValue({ data: { session: {} }, error: null })
    renderWithProviders(<AdminLogin />)
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'segredo123' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => expect(signIn).toHaveBeenCalledWith({ email: 'a@b.com', password: 'segredo123' }))
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/admin', { replace: true }))
  })

  it('mostra erro quando o login falha', async () => {
    signIn.mockResolvedValue({ data: {}, error: { message: 'Invalid login credentials' } })
    renderWithProviders(<AdminLogin />)
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'errada' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText(/não foi possível entrar/i)).toBeInTheDocument()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
