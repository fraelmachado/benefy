import type * as React from 'react'

export interface NavItem {
  label: string
  icon?: React.ReactNode
  href?: string
  active?: boolean
}

export interface NavProps {
  items: NavItem[]
  ariaLabel?: string
}

export function Nav({ items = [], ariaLabel = 'Principal' }: NavProps) {
  return (
    <nav className="nav" aria-label={ariaLabel}>
      {items.map((it, i) => (
        <a key={it.href ?? i} href={it.href ?? '#'} aria-current={it.active ? 'page' : undefined}>
          {it.icon ? (
            <span className="ic" aria-hidden="true">
              {it.icon}
            </span>
          ) : null}
          {it.label}
        </a>
      ))}
    </nav>
  )
}
