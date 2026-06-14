import { useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { queryClient } from '../../lib/queryClient'

// Regrava a seleção do usuário atomicamente via RPC (delete+insert em transação).
export function useSaveUserSources() {
  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      const { error } = await supabase.rpc('replace_user_sources', { item_ids: itemIds })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_benefits'] })
      queryClient.invalidateQueries({ queryKey: ['has_onboarded'] })
      queryClient.invalidateQueries({ queryKey: ['user_sources'] })
    },
  })
}
