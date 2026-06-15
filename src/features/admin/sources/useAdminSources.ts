import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { SourceInput, SourceRow } from './types'

const SELECT =
  'id, kind, name, logo_url, sort_order, active, connector_type, pluggy_connector_id, institution_url, primary_color, country, source_items(id, source_id, label, sort_order, card_brand, card_level, pluggy_product)'

export function useAdminSources() {
  return useQuery({
    queryKey: ['admin_sources'],
    queryFn: async (): Promise<SourceRow[]> => {
      const { data, error } = await supabase.from('sources').select(SELECT).order('sort_order')
      if (error) throw error
      return (data ?? []) as unknown as SourceRow[]
    },
  })
}

export function useSaveSource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: SourceInput & { id?: string }) => {
      const { id, ...fields } = input
      const q = id
        ? supabase.from('sources').update(fields as never).eq('id', id)
        : supabase.from('sources').insert(fields as never)
      const { data, error } = await q.select('id').single()
      if (error) throw error
      return data.id as string
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_sources'] })
      qc.invalidateQueries({ queryKey: ['sources'] })
    },
  })
}

export function useDeleteSource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sources').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_sources'] })
      qc.invalidateQueries({ queryKey: ['sources'] })
    },
  })
}
