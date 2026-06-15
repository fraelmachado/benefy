// @vitest-environment node
// Ambiente node: o upload de Blob via fetch trava no jsdom (não finaliza o corpo da requisição).
import { describe, it, expect } from 'vitest'
import { adminClient, userClient, anonClient } from './helpers/clients'

describe('storage assets', () => {
  it('admin faz upload e leitura é pública; não-admin é negado', async () => {
    const { client: admin } = await adminClient()
    const path = `test/${Date.now()}.txt`
    const up = await admin.storage.from('assets').upload(path, new Blob(['oi']), { contentType: 'text/plain' })
    expect(up.error).toBeNull()

    const pub = anonClient().storage.from('assets').getPublicUrl(path)
    expect(pub.data.publicUrl).toContain('/assets/')

    const { client: user } = await userClient()
    const denied = await user.storage.from('assets').upload(`test/x-${Date.now()}.txt`, new Blob(['x']))
    expect(denied.error).not.toBeNull()

    await admin.storage.from('assets').remove([path])
  })
})
