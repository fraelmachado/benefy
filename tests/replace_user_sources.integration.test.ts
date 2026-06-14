import { describe, it, expect } from 'vitest'
import { userClient, serviceClient } from './helpers/clients'

const BLACK = 'aaaaaaa1-0000-0000-0000-000000000001'
const PLATINUM = 'aaaaaaa1-0000-0000-0000-000000000002'

describe('replace_user_sources RPC', () => {
  it('substitui a seleção do usuário atomicamente', async () => {
    const { client, id } = await userClient()
    // primeira seleção
    let res = await client.rpc('replace_user_sources', { item_ids: [BLACK] })
    expect(res.error).toBeNull()
    // segunda seleção substitui a primeira
    res = await client.rpc('replace_user_sources', { item_ids: [PLATINUM] })
    expect(res.error).toBeNull()

    const db = serviceClient()
    const { data } = await db.from('user_sources').select('source_item_id').eq('user_id', id)
    expect(data!.map((r) => r.source_item_id)).toEqual([PLATINUM])
  })

  it('lista vazia limpa a seleção', async () => {
    const { client, id } = await userClient()
    await client.rpc('replace_user_sources', { item_ids: [BLACK] })
    const res = await client.rpc('replace_user_sources', { item_ids: [] })
    expect(res.error).toBeNull()
    const db = serviceClient()
    const { count } = await db
      .from('user_sources')
      .select('source_item_id', { count: 'exact', head: true })
      .eq('user_id', id)
    expect(count).toBe(0)
  })

  it('só mexe nas linhas do próprio usuário', async () => {
    const a = await userClient()
    const b = await userClient()
    await a.client.rpc('replace_user_sources', { item_ids: [BLACK] })
    await b.client.rpc('replace_user_sources', { item_ids: [PLATINUM] })
    const db = serviceClient()
    const { data } = await db.from('user_sources').select('source_item_id').eq('user_id', a.id)
    expect(data!.map((r) => r.source_item_id)).toEqual([BLACK])
  })
})
