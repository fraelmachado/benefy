export type SourceKind = 'card' | 'carrier' | 'loyalty' | 'cpf'

export interface SourceItem {
  id: string
  label: string
  sort_order: number
}

export interface Source {
  id: string
  kind: SourceKind
  name: string
  logo_url: string | null
  sort_order: number
  source_items: SourceItem[]
}

export type GroupedSources = Record<SourceKind, Source[]>
