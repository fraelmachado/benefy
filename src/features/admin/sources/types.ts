import type { SourceKind } from '../../onboarding/types'
import type { SourceCategory } from '../../benefits/types'

export interface SourceRow {
  id: string
  kind: SourceKind
  source_category: SourceCategory
  name: string
  logo_url: string | null
  sort_order: number
  active: boolean
  connector_type: string | null
  pluggy_connector_id: number | null
  institution_url: string | null
  primary_color: string | null
  country: string
  source_items: SourceItemRow[]
}

export interface SourceItemRow {
  id: string
  source_id: string
  label: string
  sort_order: number
  card_brand: string | null
  card_level: string | null
  pluggy_product: string | null
}

export type SourceInput = Omit<SourceRow, 'id' | 'source_items'>
export type SourceItemInput = Omit<SourceItemRow, 'id'>
