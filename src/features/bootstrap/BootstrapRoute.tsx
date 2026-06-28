import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../auth/AuthProvider'
import { useHasOnboarded } from './useHasOnboarded'

export function BootstrapRoute() {
  const navigate = useNavigate()
  const { session, loading } = useSession()
  const { data: onboarded, isLoading, error } = useHasOnboarded(session?.user.id)

  useEffect(() => {
    if (loading || !session || isLoading || error || onboarded === undefined) return
    navigate(onboarded ? '/painel' : '/onboarding', { replace: true })
  }, [loading, session, isLoading, error, onboarded, navigate])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-slate-700">Algo deu errado ao carregar seus dados.</p>
        <button
          type="button"
          className="rounded-lg bg-slate-800 px-4 py-2 text-white"
          onClick={() => window.location.reload()}
        >
          Tentar de novo
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500">Preparando o Mapa de Benefícios…</p>
    </div>
  )
}
