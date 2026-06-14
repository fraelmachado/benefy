import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

// Linka um e-mail à conta (anônima) atual; o Supabase envia um link de confirmação.
export function useLinkEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.updateUser({ email })
      if (error) throw error
    },
  })
}
