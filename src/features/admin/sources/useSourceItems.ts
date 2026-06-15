import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase'
import type { SourceItemInput } from './types'

export function useSaveSourceItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: SourceItemInput & { id?: string }) => {
      const { id, ...fields } = input
      const q = id
        ? supabase.from('source_items').update(fields as never).eq('id', id)
        : supabase.from('source_items').insert(fields as never)
      const { error } = await q
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_sources'] })
      qc.invalidateQueries({ queryKey: ['sources'] })
    },
  })
}

export function useDeleteSourceItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('source_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_sources'] })
      qc.invalidateQueries({ queryKey: ['sources'] })
    },
  })
}
