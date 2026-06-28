import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(false)
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) {
      setError(true)
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin · Mapa de Benefícios</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">E-mail</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2" />
        <label className="text-sm font-medium text-slate-700" htmlFor="password">Senha</label>
        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2" />
        {error && <p className="text-sm text-red-600">Não foi possível entrar. Verifique e-mail e senha.</p>}
        <button type="submit" disabled={loading}
          className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white disabled:opacity-60">
          Entrar
        </button>
      </form>
    </div>
  )
}
