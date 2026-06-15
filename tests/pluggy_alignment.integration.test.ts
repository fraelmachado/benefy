import { describe, it, expect } from 'vitest'
import { serviceClient } from './helpers/clients'

describe('pluggy alignment columns', () => {
  it('aceita campos de connector em sources e creditData em source_items', async () => {
    const db = serviceClient()
    const { data: src, error: e1 } = await db
      .from('sources')
      .insert({
        kind: 'card',
        name: 'PluggyBank',
        sort_order: 1,
        pluggy_connector_id: 999001,
        connector_type: 'PERSONAL_BANK',
        institution_url: 'https://bank.test',
        primary_color: '#0f172a',
      })
      .select()
      .single()
    expect(e1).toBeNull()
    expect(src!.country).toBe('BR') // default

    const { data: item, error: e2 } = await db
      .from('source_items')
      .insert({
        source_id: src!.id,
        label: 'Black/Infinite',
        sort_order: 1,
        card_brand: 'VISA',
        card_level: 'BLACK',
        pluggy_product: 'CREDIT_CARDS',
      })
      .select()
      .single()
    expect(e2).toBeNull()
    expect(item!.card_level).toBe('BLACK')

    await db.from('sources').delete().eq('id', src!.id)
  })
})
