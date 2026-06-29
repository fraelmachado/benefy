import { Link } from 'react-router-dom'
import { Pass } from '../../ui/Pass'
import { toPassProps } from './toPassProps'
import type { MyBenefit } from './types'

export function BenefitCard({ benefit }: { benefit: MyBenefit }) {
  return (
    <Link to={`/beneficio/${benefit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Pass {...toPassProps(benefit)} />
    </Link>
  )
}
