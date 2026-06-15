import { useState } from 'react'
import { useSaveSourceItem, useDeleteSourceItem } from './useSourceItems'
import type { SourceItemRow } from './types'

export function SourceItemsEditor({ sourceId, items }: { sourceId: string; items: SourceItemRow[] }) {
  const save = useSaveSourceItem()
  const del = useDeleteSourceItem()
  const [label, setLabel] = useState('')
  const [brand, setBrand] = useState('')
  const [level, setLevel] = useState('')

  async function add() {
    if (!label.trim()) return
    await save.mutateAsync({
      source_id: sourceId,
      label: label.trim(),
      sort_order: items.length + 1,
      card_brand: brand || null,
      card_level: level || null,
      pluggy_product: null,
    })
    setLabel(''); setBrand(''); setLevel('')
  }

  return (
    <div className="mt-3 rounded-lg border border-slate-100 p-3">
      <h3 className="mb-2 text-sm font-semibold">Variantes</h3>
      <ul className="flex flex-col gap-1">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-2 text-sm">
            <span>{it.label}</span>
            {it.card_level && <span className="text-xs text-slate-400">{it.card_brand ?? ''} {it.card_level}</span>}
            <button type="button" aria-label={`remover ${it.label}`} onClick={() => del.mutateAsync(it.id)} className="ml-auto text-red-600">×</button>
          </li>
        ))}
        {items.length === 0 && <li className="text-xs text-slate-400">Nenhuma variante.</li>}
      </ul>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="text-xs">Nova variante
          <input aria-label="nova variante" value={label} onChange={(e) => setLabel(e.target.value)} className="block rounded border px-2 py-1" />
        </label>
        <label className="text-xs">brand
          <input aria-label="card_brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="block rounded border px-2 py-1" placeholder="VISA" />
        </label>
        <label className="text-xs">level
          <input aria-label="card_level" value={level} onChange={(e) => setLevel(e.target.value)} className="block rounded border px-2 py-1" placeholder="BLACK" />
        </label>
        <button type="button" onClick={add} className="rounded bg-slate-700 px-3 py-1 text-sm text-white">Adicionar</button>
      </div>
    </div>
  )
}
