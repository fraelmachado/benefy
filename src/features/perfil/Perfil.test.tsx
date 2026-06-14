import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test/renderWithProviders'

let sessionValue: { session: unknown; loading: boolean }
vi.mock('../auth/AuthProvider', () => ({
  useSession: () => sessionValue,
}))

const linkMutate = vi.fn()
vi.mock('./useLinkEmail', () => ({
  useLinkEmail: () => ({ mutateAsync: linkMutate, isPending: false, isError: false }),
}))

import { Perfil } from './Perfil'

beforeEach(() => {
  linkMutate.mockReset()
  linkMutate.mockResolvedValue(undefined)
})

describe('Perfil', () => {
  it('conta anônima: envia magic link ao salvar o e-mail', async () => {
    sessionValue = { session: { user: { id: 'u1', is_anonymous: true, email: null } }, loading: false }
    renderWithProviders(<Perfil />)
    fireEvent.change(screen.getByRole('textbox', { name: /e-mail/i }), { target: { value: 'a@b.com' } })
    fireEvent.click(screen.getByRole('button', { name: /salvar meu acesso/i }))
    await waitFor(() => expect(linkMutate).toHaveBeenCalledWith('a@b.com'))
    expect(await screen.findByText(/enviamos um link/i)).toBeInTheDocument()
  })

  it('conta com e-mail: mostra o e-mail e não mostra o formulário', () => {
    sessionValue = { session: { user: { id: 'u1', is_anonymous: false, email: 'x@y.com' } }, loading: false }
    renderWithProviders(<Perfil />)
    expect(screen.getByText(/x@y.com/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /salvar meu acesso/i })).not.toBeInTheDocument()
  })

  it('tem link para editar as fontes', () => {
    sessionValue = { session: { user: { id: 'u1', is_anonymous: true, email: null } }, loading: false }
    renderWithProviders(<Perfil />)
    expect(screen.getByRole('link', { name: /editar minhas fontes/i })).toHaveAttribute('href', '/onboarding')
  })

  it('falha no envio não quebra nem mostra confirmação', async () => {
    sessionValue = { session: { user: { id: 'u1', is_anonymous: true, email: null } }, loading: false }
    linkMutate.mockRejectedValue(new Error('smtp down'))
    renderWithProviders(<Perfil />)
    fireEvent.change(screen.getByRole('textbox', { name: /e-mail/i }), { target: { value: 'a@b.com' } })
    fireEvent.click(screen.getByRole('button', { name: /salvar meu acesso/i }))
    await waitFor(() => expect(linkMutate).toHaveBeenCalledWith('a@b.com'))
    expect(screen.queryByText(/enviamos um link/i)).not.toBeInTheDocument()
  })
})
