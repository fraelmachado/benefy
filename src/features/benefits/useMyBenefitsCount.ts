import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

// Conta benefícios DISTINTOS (my_benefits pode trazer 1 linha por fonte).
export function useMyBenefitsCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['my_benefits_count', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('my_benefits').select('id')
      if (error) throw error
      return new Set((data ?? []).map((r) => r.id)).size
    },
  })
}
