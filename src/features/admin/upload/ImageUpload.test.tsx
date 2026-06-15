import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const uploadAsset = vi.fn()
vi.mock('./useUploadAsset', () => ({ uploadAsset: (...a: unknown[]) => uploadAsset(...a) }))

import { ImageUpload } from './ImageUpload'

beforeEach(() => uploadAsset.mockReset())

describe('ImageUpload', () => {
  it('faz upload e chama onChange com a URL', async () => {
    uploadAsset.mockResolvedValue('https://cdn.test/assets/x.png')
    const onChange = vi.fn()
    render(<ImageUpload folder="sources" value={null} onChange={onChange} />)
    const file = new File(['bytes'], 'logo.png', { type: 'image/png' })
    const input = screen.getByLabelText(/imagem/i) as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('https://cdn.test/assets/x.png'))
  })

  it('mostra a imagem atual quando há value', () => {
    render(<ImageUpload folder="sources" value="https://cdn.test/a.png" onChange={() => {}} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.test/a.png')
  })
})
