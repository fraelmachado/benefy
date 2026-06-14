import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useUserSources(userId: string | undefined) {
  return useQuery({
    queryKey: ['user_sources', userId],
    enabled: !!userId,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.from('user_sources').select('source_item_id')
      if (error) throw error
      return (data ?? []).map((r) => r.source_item_id as string)
    },
  })
}
