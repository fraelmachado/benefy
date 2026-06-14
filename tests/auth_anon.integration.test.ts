import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL!
const anonKey = process.env.VITE_SUPABASE_ANON_KEY!

describe('auth anônimo', () => {
  it('permite sign-in anônimo e cria usuário', async () => {
    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await client.auth.signInAnonymously()
    expect(error).toBeNull()
    expect(data.user?.id).toBeTruthy()
    expect(data.user?.is_anonymous).toBe(true)
  })
})
