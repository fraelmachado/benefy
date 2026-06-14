export type BenefitCategory =
  | 'viagem'
  | 'entretenimento'
  | 'saude'
  | 'seguros'
  | 'compras'

export interface MyBenefit {
  id: string
  title: string
  summary: string
  category: BenefitCategory
  scope: string
  uf: string | null
  steps: string | null
  partner_name: string | null
  valid_until: string | null
  image_url: string | null
  action_url: string | null
  action_label: string | null
  created_at: string
  via: string[]
}

export const CATEGORIES: { key: BenefitCategory; label: string; emoji: string }[] = [
  { key: 'viagem', label: 'Viagem', emoji: '✈️' },
  { key: 'entretenimento', label: 'Lazer', emoji: '🎬' },
  { key: 'saude', label: 'Saúde', emoji: '💊' },
  { key: 'seguros', label: 'Seguros', emoji: '🛡️' },
  { key: 'compras', label: 'Compras', emoji: '🛍️' },
]
