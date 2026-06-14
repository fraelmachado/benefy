import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function useHasOnboarded(userId: string | undefined) {
  return useQuery({
    queryKey: ['has_onboarded', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_sources')
        .select('source_item_id', { count: 'exact', head: true })
      if (error) throw error
      return (count ?? 0) > 0
    },
  })
}
