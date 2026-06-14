import { describe, it, expect } from 'vitest'
import { supabase } from './supabase'

describe('supabase client', () => {
  it('expõe um client configurado com a URL do env', () => {
    expect(supabase).toBeDefined()
    expect(typeof supabase.from).toBe('function')
  })
})
