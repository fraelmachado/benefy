import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../auth/AuthProvider'
import { useLinkEmail } from './useLinkEmail'

export function Perfil() {
  const { session } = useSession()
  const user = session?.user
  const isAnon = user?.is_anonymous ?? true
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const link = useLinkEmail()

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      await link.mutateAsync(email)
      setSent(true)
    } catch {
      // erro exibido via link.isError
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-4 pb-24">
      <h1 className="text-2xl font-bold text-slate-900">Perfil</h1>

      {isAnon ? (
        sent ? (
          <p className="rounded-xl bg-slate-100 p-4 text-slate-700">
            Enviamos um link de confirmação para <strong>{email}</strong>. Abra seu e-mail para
            garantir seu acesso.
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <p className="text-sm text-slate-600">
              Sua conta é temporária. Adicione um e-mail para não perder seus benefícios ao trocar
              de aparelho.
            </p>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
            {link.isError && (
              <p className="text-sm text-red-600">Não foi possível enviar. Tente de novo.</p>
            )}
            <button
              type="submit"
              disabled={link.isPending}
              className="rounded-lg bg-slate-800 px-4 py-3 font-medium text-white disabled:opacity-60"
            >
              Salvar meu acesso
            </button>
          </form>
        )
      ) : (
        <p className="rounded-xl bg-slate-100 p-4 text-slate-700">
          Conectado como <strong>{user?.email}</strong>.
        </p>
      )}

      <Link to="/onboarding" className="text-slate-700 underline">
        Editar minhas fontes
      </Link>
    </div>
  )
}
