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

  it('default bank_card é aplicado quando a coluna é omitida (comportamento conhecido)', async () => {
    // Trava o comportamento do DEFAULT: writers que omitem source_category (ex.: o admin
    // SourceForm hoje) recebem bank_card SILENCIOSAMENTE — inclusive para kinds não-bancários.
    // Aceitável no P1 (100% do catálogo é banco/cartão). Follow-up: P2/P4 devem adicionar
    // source_category ao SourceForm e remover o default antes de cadastrar fontes não-bancárias,
    // senão carrier/loyalty serão mislabeled como bank_card. Ver plano P1 (self-review).
    const stamp = `${Date.now()}-${Math.floor(performance.now() * 1000)}`
    const db = serviceClient()
    const { data, error } = await db
      .from('sources')
      .insert({ kind: 'carrier', name: `S-${stamp}`, sort_order: 99, slug: `s-${stamp}` })
      .select('source_category')
      .single()
    expect(error).toBeNull()
    expect(data!.source_category).toBe('bank_card')
    await db.from('sources').delete().eq('slug', `s-${stamp}`)
  })
})
