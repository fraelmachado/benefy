import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

// Garante uma sessão: usa a existente ou cria uma anônima.
export async function ensureAnonymousSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session
  const { data: signIn, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return signIn.session
}
