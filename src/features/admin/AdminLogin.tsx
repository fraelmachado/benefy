import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Button } from '../../ui/Button'

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
      <h1 style={{ fontSize: 'var(--fz-h1)', fontWeight: 700, letterSpacing: '-.03em', margin: 0 }}>
        Admin · Mapa de Benefícios
      </h1>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
        <label className="lbl" htmlFor="email" style={{ margin: 0 }}>
          E-mail
        </label>
        <label className="input">
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="lbl" htmlFor="password" style={{ margin: 'var(--s2) 0 0' }}>
          Senha
        </label>
        <label className="input">
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p style={{ fontSize: 14, color: 'var(--warn)' }}>
            Não foi possível entrar. Verifique e-mail e senha.
          </p>
        )}
        <Button type="submit" disabled={loading}>
          Entrar
        </Button>
      </form>
    </div>
  )
}
