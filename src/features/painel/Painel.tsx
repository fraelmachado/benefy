import { useState } from 'react'
import { useSession } from '../auth/AuthProvider'
import { useMyBenefits } from '../benefits/useMyBenefits'
import { filterBenefits } from '../benefits/filterBenefits'
import { BenefitCard } from '../benefits/BenefitCard'
import { CategoryChips } from '../benefits/CategoryChips'
import type { BenefitCategory } from '../benefits/types'

export function Painel() {
  const { session } = useSession()
  const { data, isLoading, error } = useMyBenefits(session?.user.id)
  const [category, setCategory] = useState<BenefitCategory | null>(null)

  if (isLoading) return <p className="p-6 text-slate-500">Carregando…</p>
  if (error) return <p className="p-6 text-red-600">Não foi possível carregar seus benefícios.</p>

  const all = data ?? []
  const highlight = category ? undefined : all[0]
  const visible = filterBenefits(all, { category, text: '' }).filter(
    (b) => b.id !== highlight?.id,
  )

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Você tem {all.length} benefício{all.length === 1 ? '' : 's'} ativo{all.length === 1 ? '' : 's'}.
        </h1>
      </header>

      {highlight && (
        <div className="rounded-xl bg-slate-900 p-4 text-white">
          <p className="text-xs uppercase tracking-wide text-slate-300">💡 Destaque</p>
          <p className="mt-1 font-semibold">{highlight.title}</p>
          <p className="mt-1 text-sm text-slate-200">{highlight.summary}</p>
        </div>
      )}

      <CategoryChips selected={category} onChange={setCategory} />

      {all.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
          Nenhum benefício encontrado. Refaça a varredura para incluir mais fontes.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((b) => (
            <BenefitCard key={b.id} benefit={b} />
          ))}
        </div>
      )}
    </div>
  )
}
