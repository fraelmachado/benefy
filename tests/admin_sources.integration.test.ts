import { describe, it, expect } from 'vitest'
import { adminClient, userClient } from './helpers/clients'

describe('admin sources CRUD (RLS)', () => {
  it('admin cria/edita fonte + variante com campos Pluggy; remove', async () => {
    const { client: admin } = await adminClient()

    const { data: src, error: e1 } = await admin
      .from('sources')
      .insert({
        kind: 'card', name: 'Banco Teste', sort_order: 10, active: true,
        connector_type: 'PERSONAL_BANK', pluggy_connector_id: 123456,
        institution_url: 'https://bt.test', primary_color: '#123456',
      })
      .select()
      .single()
    expect(e1).toBeNull()
    expect(src!.country).toBe('BR')

    const { error: e2 } = await admin.from('sources').update({ name: 'Banco Teste 2' }).eq('id', src!.id)
    expect(e2).toBeNull()

    const { data: item, error: e3 } = await admin
      .from('source_items')
      .insert({
        source_id: src!.id, label: 'Black', sort_order: 1,
        card_brand: 'VISA', card_level: 'BLACK', pluggy_product: 'CREDIT_CARDS',
      })
      .select()
      .single()
    expect(e3).toBeNull()
    expect(item!.card_level).toBe('BLACK')

    await admin.from('sources').delete().eq('id', src!.id)
  })

  it('não-admin não consegue criar fonte', async () => {
    const { client: user } = await userClient()
    const { error } = await user.from('sources').insert({ kind: 'card', name: 'Hacker', sort_order: 1 })
    expect(error).not.toBeNull()
  })
})
