import { useMyBenefitsCount } from '../benefits/useMyBenefitsCount'

export function PainelPlaceholder() {
  const { data: count, isLoading } = useMyBenefitsCount()
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-3 p-6">
      <h1 className="text-2xl font-bold">
        {isLoading ? 'Carregando…' : `Você tem ${count} benefício${count === 1 ? '' : 's'} ativo${count === 1 ? '' : 's'}.`}
      </h1>
      <p className="text-slate-500">Painel completo em construção (M3).</p>
    </div>
  )
}
