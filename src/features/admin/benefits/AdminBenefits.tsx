import { useState } from 'react'
import { useAdminBenefits, useSaveBenefit, useDeleteBenefit } from './useAdminBenefits'
import { useSaveBenefitSources } from './useBenefitSources'
import { useAdminSources } from '../sources/useAdminSources'
import { BenefitForm } from './BenefitForm'
import { BenefitLocationsEditor } from './BenefitLocationsEditor'
import type { BenefitInput, BenefitRow } from './types'

export function AdminBenefits() {
  const { data, isLoading, error } = useAdminBenefits()
  const { data: sources } = useAdminSources()
  const save = useSaveBenefit()
  const saveLinks = useSaveBenefitSources()
  const del = useDeleteBenefit()
  const [editing, setEditing] = useState<BenefitRow | null | 'new'>(null)

  if (isLoading) return <p className="text-slate-500">Carregando…</p>
  if (error) return <p className="text-red-600">Erro ao carregar benefícios.</p>

  async function onSubmit(payload: { input: BenefitInput; sourceItemIds: string[] }) {
    const current = editing
    const id = current && current !== 'new' ? current.id : undefined
    const savedId = await save.mutateAsync({ ...payload.input, id })
    await saveLinks.mutateAsync({ benefitId: savedId, sourceItemIds: payload.sourceItemIds })
    setEditing(null)
  }

  if (editing) {
    const initial = editing === 'new' ? null : editing
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">{initial ? `Editar ${initial.title}` : 'Novo benefício'}</h1>
        <BenefitForm initial={initial} sources={sources ?? []} onSubmit={onSubmit} onCancel={() => setEditing(null)} />
        {initial && <BenefitLocationsEditor benefitId={initial.id} locations={initial.benefit_locations} />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Benefícios</h1>
        <button type="button" onClick={() => setEditing('new')} className="rounded bg-slate-800 px-3 py-2 text-sm text-white">Novo benefício</button>
      </div>
      <ul className="flex flex-col gap-2">
        {(data ?? []).map((b) => (
          <li key={b.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
            <span className="flex-1">{b.title} <span className="text-xs text-slate-400">({b.category}{b.active ? '' : ' · inativo'})</span></span>
            <button type="button" onClick={() => setEditing(b)} className="text-sm text-slate-600">Editar</button>
            <button type="button" aria-label={`remover ${b.title}`} onClick={() => del.mutateAsync(b.id)} className="text-sm text-red-600">Remover</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
