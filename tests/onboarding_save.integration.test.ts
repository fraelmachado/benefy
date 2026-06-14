import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL!
const anonKey = process.env.VITE_SUPABASE_ANON_KEY!

// Itaú Black do seed (destrava Sala VIP + Cinemark = 2 benefícios distintos)
const ITAU_BLACK = 'aaaaaaa1-0000-0000-0000-000000000001'

describe('fluxo de gravação do onboarding', () => {
  it('usuário anônimo grava seleção e vê a contagem de benefícios', async () => {
    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: signIn, error: authErr } = await client.auth.signInAnonymously()
    expect(authErr).toBeNull()
    const userId = signIn.user!.id

    const { error: insErr } = await client
      .from('user_sources')
      .insert({ user_id: userId, source_item_id: ITAU_BLACK })
    expect(insErr).toBeNull()

    const { data, error } = await client.from('my_benefits').select('id')
    expect(error).toBeNull()
    const distinct = new Set((data ?? []).map((r) => r.id)).size
    expect(distinct).toBe(2)
  })
})
