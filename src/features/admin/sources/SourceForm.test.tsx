import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
vi.mock('../upload/ImageUpload', () => ({
  ImageUpload: ({ onChange }: { onChange: (u: string) => void }) => (
    <button type="button" onClick={() => onChange('https://cdn.test/logo.png')}>mock-upload</button>
  ),
}))
import { SourceForm } from './SourceForm'

describe('SourceForm', () => {
  it('preenche e submete os campos (inclui Pluggy + logo)', () => {
    const onSubmit = vi.fn()
    render(<SourceForm initial={null} onSubmit={onSubmit} onCancel={() => {}} />)
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Itaú' } })
    fireEvent.change(screen.getByLabelText(/tipo \(kind\)/i), { target: { value: 'card' } })
    fireEvent.change(screen.getByLabelText(/connector_type/i), { target: { value: 'PERSONAL_BANK' } })
    fireEvent.click(screen.getByRole('button', { name: /mock-upload/i }))
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Itaú', kind: 'card', connector_type: 'PERSONAL_BANK',
        logo_url: 'https://cdn.test/logo.png', country: 'BR', active: true,
      }),
    )
  })
})
