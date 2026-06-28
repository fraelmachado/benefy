import { describe, it, expect } from 'vitest'
import { serviceClient } from './helpers/clients'

describe('taxonomia source_category', () => {
  it('sources do catálogo têm source_category = bank_card', async () => {
    const db = serviceClient()
    const { data, error } = await db
      .from('sources')
      .select('slug, source_category')
      .in('slug', ['nubank', 'inter', 'xp'])
    expect(error).toBeNull()
    const rows = data ?? []
    expect(rows.length).toBe(3)
    expect(rows.every((r) => r.source_category === 'bank_card')).toBe(true)
  })

  it('source_category rejeita valor fora do enum', async () => {
    const stamp = `${Date.now()}-${Math.floor(performance.now() * 1000)}`
    const db = serviceClient()
    const { error } = await db
      .from('sources')
      .insert({ kind: 'card', name: `S-${stamp}`, sort_order: 99, slug: `s-${stamp}`,
                source_category: 'not_a_real_category' })
    expect(error).not.toBeNull()
  })

  it('aceita um novo valor válido do enum (ex.: health)', async () => {
    const stamp = `${Date.now()}-${Math.floor(performance.now() * 1000)}`
    const db = serviceClient()
    const { data, error } = await db
      .from('sources')
      .insert({ kind: 'loyalty', name: `S-${stamp}`, sort_order: 99, slug: `s-${stamp}`,
                source_category: 'health' })
      .select('source_category')
      .single()
    expect(error).toBeNull()
    expect(data!.source_category).toBe('health')
    await db.from('sources').delete().eq('slug', `s-${stamp}`)
  })
})
