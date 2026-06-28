import { describe, it, expect } from 'vitest'
import { serviceClient, userClient } from './helpers/clients'

describe('my_benefits projeta origem primária e secundária', () => {
  it('origins traz {provider, category}; networks traz {brand, level} no caminho de bandeira', async () => {
    const db = serviceClient()
    const { data: item } = await db.from('source_items').select('id').eq('slug', 'xp-infinite').single()
    const { client } = await userClient()
    await client.rpc('replace_user_sources', { item_ids: [item!.id] })

    const { data, error } = await client
      .from('my_benefits')
      .select('title, benefit_source, origins, networks')
    expect(error).toBeNull()
    const rows = data ?? []
    expect(rows.length).toBeGreaterThan(0)

    expect(rows.every((r) => Array.isArray(r.origins) && r.origins.length > 0)).toBe(true)
    expect(rows.every((r) =>
      (r.origins as Array<{ provider: string; category: string }>).every(
        (o) => typeof o.provider === 'string' && typeof o.category === 'string',
      ),
    )).toBe(true)
    expect(rows.some((r) =>
      (r.origins as Array<{ provider: string; category: string }>).some(
        (o) => o.provider === 'XP' && o.category === 'bank_card',
      ),
    )).toBe(true)

    const cardNetwork = rows.filter((r) => r.benefit_source === 'card_network')
    expect(cardNetwork.length).toBeGreaterThan(0)
    expect(cardNetwork.some((r) =>
      (r.networks as Array<{ brand: string; level: string }>).some(
        (n) => n.brand === 'visa' && n.level === 'infinite',
      ),
    )).toBe(true)
  })

  it('um benefício card_network agrega origins, networks, benefit_source e via na MESMA linha', async () => {
    const db = serviceClient()
    // xp-infinite (visa/infinite) destrava visa-infinite-fast-pass pelo caminho derivado.
    const { data: item } = await db.from('source_items').select('id').eq('slug', 'xp-infinite').single()
    const { data: ben } = await db.from('benefits').select('id').eq('slug', 'visa-infinite-fast-pass').single()
    const { client } = await userClient()
    await client.rpc('replace_user_sources', { item_ids: [item!.id] })

    const { data, error } = await client
      .from('my_benefits')
      .select('id, benefit_source, origins, networks, via')
      .eq('id', ben!.id)
      .single()
    expect(error).toBeNull()
    expect(data!.benefit_source).toBe('card_network')
    expect(data!.origins).toContainEqual({ provider: 'XP', category: 'bank_card' })
    expect(data!.networks).toContainEqual({ brand: 'visa', level: 'infinite' })
    expect(Array.isArray(data!.via) && data!.via.length).toBeGreaterThan(0)
  })

  it('networks é [] para benefício do caminho direto (sem bandeira)', async () => {
    const db = serviceClient()
    const { data: item } = await db.from('source_items').select('id').eq('slug', 'nubank-ultravioleta-black').single()
    const { client } = await userClient()
    await client.rpc('replace_user_sources', { item_ids: [item!.id] })

    const { data, error } = await client
      .from('my_benefits')
      .select('benefit_source, networks')
    expect(error).toBeNull()
    const direct = (data ?? []).filter((r) => r.benefit_source !== 'card_network')
    expect(direct.length).toBeGreaterThan(0)
    expect(direct.every((r) => Array.isArray(r.networks) && r.networks.length === 0)).toBe(true)
  })
})
