import type { MyBenefit, BenefitCategory } from './types'
import type { PassProps } from '../../ui/Pass'

export type DsCat = 'airport' | 'seguro' | 'viagem' | 'cashback' | 'compras' | 'pontos'

const CAT_MAP: Record<BenefitCategory, DsCat> = {
  airport: 'airport', concierge: 'airport',
  travel: 'viagem', miles: 'viagem',
  insurance: 'seguro', security: 'seguro',
  cashback: 'cashback', investback: 'cashback',
  points: 'pontos',
  shopping: 'compras', restaurant: 'compras', international_purchase: 'compras',
  experience: 'compras', investment: 'compras', account_service: 'compras', other: 'compras',
}

export function categoryToDsCat(c: BenefitCategory): DsCat {
  return CAT_MAP[c] ?? 'compras'
}

const ORIGIN_MAP = { issuer: 'emissor', card_network: 'bandeira', partner: 'parceiro' } as const

export function toPassProps(b: MyBenefit): PassProps {
  const originType =
    b.benefit_source && b.benefit_source !== 'mixed' ? ORIGIN_MAP[b.benefit_source] : 'emissor'
  let originLabel = b.origins[0]?.provider ?? b.partner_name ?? b.source_name ?? ''
  if (originType === 'bandeira' && b.networks[0]) {
    originLabel = [b.networks[0].brand, b.networks[0].level].filter(Boolean).join(' ')
  }
  return {
    title: b.title,
    via: b.via[0] ?? originLabel,
    desc: b.summary,
    category: categoryToDsCat(b.category),
    originType,
    originLabel,
  }
}
