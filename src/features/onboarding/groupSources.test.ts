import { describe, it, expect } from 'vitest'
import { groupSourcesByKind } from './groupSources'
import type { Source } from './types'

const sources: Source[] = [
  { id: 's2', kind: 'carrier', name: 'Claro', logo_url: null, sort_order: 2, source_items: [{ id: 'i3', label: 'Pós', sort_order: 1 }] },
  { id: 's1', kind: 'card', name: 'Itaú', logo_url: null, sort_order: 1, source_items: [
    { id: 'i2', label: 'Platinum', sort_order: 2 },
    { id: 'i1', label: 'Black', sort_order: 1 },
  ] },
]

describe('groupSourcesByKind', () => {
  it('agrupa por kind e ordena sources e items por sort_order', () => {
    const g = groupSourcesByKind(sources)
    expect(Object.keys(g)).toContain('card')
    expect(Object.keys(g)).toContain('carrier')
    expect(g.card[0].name).toBe('Itaú')
    expect(g.card[0].source_items.map((i) => i.label)).toEqual(['Black', 'Platinum'])
  })

  it('retorna grupos vazios ausentes como undefined-safe', () => {
    const g = groupSourcesByKind([])
    expect(g.card ?? []).toEqual([])
  })
})
