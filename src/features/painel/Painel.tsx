import { useState } from 'react'
import { useSession } from '../auth/AuthProvider'
import { useMyBenefits } from '../benefits/useMyBenefits'
import { filterBenefits } from '../benefits/filterBenefits'
import { BenefitCard } from '../benefits/BenefitCard'
import { CategoryChips } from '../benefits/CategoryChips'
import { HeroRadar } from '../../ui/HeroRadar'
import type { BenefitCategory } from '../benefits/types'

export function Painel() {
  const { session } = useSession()
  const { data, isLoading, error } = useMyBenefits(session?.user.id)
  const [category, setCategory] = useState<BenefitCategory | null>(null)

  if (isLoading) return <p className="p-6 text-muted">Carregando…</p>
  if (error) return <p className="p-6 text-red-600">Não foi possível carregar seus benefícios.</p>

  const all = data ?? []
  const visible = filterBenefits(all, { category, text: '' })

  return (
    <div className="mx-auto max-w-md p-4 pb-24">
      <p className="lbl" style={{ marginBottom: 2 }}>
        Seu radar de benefícios
      </p>
      <HeroRadar
        count={all.length}
        label="Seu radar"
        caption={`${all.length} benefício${all.length === 1 ? '' : 's'} ativo${all.length === 1 ? '' : 's'}`}
      />

      <div style={{ margin: 'var(--s5) 0 var(--s3)' }}>
        <CategoryChips selected={category} onChange={setCategory} />
      </div>

      {all.length === 0 ? (
        <p className="muted" style={{ textAlign: 'center', padding: 'var(--s8) 0' }}>
          Nenhum benefício ainda. Refaça a varredura para incluir mais fontes.
        </p>
      ) : (
        <div className="passes">
          {visible.map((b) => (
            <BenefitCard key={b.id} benefit={b} />
          ))}
        </div>
      )}
    </div>
  )
}
