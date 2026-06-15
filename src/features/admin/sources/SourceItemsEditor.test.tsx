import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const saveItem = vi.fn()
const deleteItem = vi.fn()
vi.mock('./useSourceItems', () => ({
  useSaveSourceItem: () => ({ mutateAsync: saveItem, isPending: false }),
  useDeleteSourceItem: () => ({ mutateAsync: deleteItem, isPending: false }),
}))

import { SourceItemsEditor } from './SourceItemsEditor'
import type { SourceItemRow } from './types'

const items: SourceItemRow[] = [
  { id: 'i1', source_id: 's1', label: 'Black', sort_order: 1, card_brand: 'VISA', card_level: 'BLACK', pluggy_product: 'CREDIT_CARDS' },
]

beforeEach(() => {
  saveItem.mockReset(); saveItem.mockResolvedValue(undefined)
  deleteItem.mockReset(); deleteItem.mockResolvedValue(undefined)
})

describe('SourceItemsEditor', () => {
  it('lista variantes e adiciona uma nova', async () => {
    render(<SourceItemsEditor sourceId="s1" items={items} />)
    expect(screen.getByText('Black')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/nova variante/i), { target: { value: 'Platinum' } })
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }))
    await waitFor(() => expect(saveItem).toHaveBeenCalledWith(expect.objectContaining({ source_id: 's1', label: 'Platinum' })))
  })

  it('remove uma variante', async () => {
    render(<SourceItemsEditor sourceId="s1" items={items} />)
    fireEvent.click(screen.getByRole('button', { name: /remover Black/i }))
    await waitFor(() => expect(deleteItem).toHaveBeenCalledWith('i1'))
  })
})
