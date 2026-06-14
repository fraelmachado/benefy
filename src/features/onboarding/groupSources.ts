import type { GroupedSources, Source } from './types'

export function groupSourcesByKind(sources: Source[]): GroupedSources {
  const out = {} as GroupedSources
  const ordered = [...sources].sort((a, b) => a.sort_order - b.sort_order)
  for (const s of ordered) {
    const withSortedItems: Source = {
      ...s,
      source_items: [...s.source_items].sort((a, b) => a.sort_order - b.sort_order),
    }
    ;(out[s.kind] ??= []).push(withSortedItems)
  }
  return out
}
