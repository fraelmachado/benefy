import { NavLink } from 'react-router-dom'

const items = [
  { to: '/painel', label: 'Painel', emoji: '🏠' },
  { to: '/buscar', label: 'Buscar', emoji: '🔎' },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-md">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ' +
              (isActive ? 'text-slate-900' : 'text-slate-400')
            }
          >
            <span aria-hidden>{it.emoji}</span>
            {it.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
