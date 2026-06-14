import { useSession } from '../auth/AuthProvider'
import { useMyBenefitsCount } from '../benefits/useMyBenefitsCount'

export function PainelPlaceholder() {
  const { session } = useSession()
  const { data: count, isLoading, error } = useMyBenefitsCount(session?.user.id)

  if (error) {
    return <div className="p-6 text-red-600">Não foi possível carregar seus benefícios.</div>
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-3 p-6">
      <h1 className="text-2xl font-bold">
        {isLoading || count === undefined
          ? 'Carregando…'
          : `Você tem ${count} benefício${count === 1 ? '' : 's'} ativo${count === 1 ? '' : 's'}.`}
      </h1>
      <p className="text-slate-500">Painel completo em construção (M3).</p>
    </div>
  )
}
