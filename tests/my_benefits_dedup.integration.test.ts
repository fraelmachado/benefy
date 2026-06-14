import { describe, it, expect } from 'vitest'
import { userClient } from './helpers/clients'

const BLACK = 'aaaaaaa1-0000-0000-0000-000000000001'
const PLATINUM = 'aaaaaaa1-0000-0000-0000-000000000002'
const CINEMARK = 'd0000001-0000-0000-0000-000000000002'

describe('my_benefits dedup', () => {
  it('retorna 1 linha por benefício com via agregando as fontes', async () => {
    const { client, id } = await userClient()
    await client.rpc('replace_user_sources', { item_ids: [BLACK, PLATINUM] })

    const { data, error } = await client.from('my_benefits').select('id, via')
    expect(error).toBeNull()

    const rows = (data ?? []).filter((r) => r.id === CINEMARK)
    expect(rows.length).toBe(1)
    expect((rows[0].via as string[]).sort()).toEqual(['Black/Infinite', 'Platinum'])
    void id
  })
})
