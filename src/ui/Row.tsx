import type * as React from 'react'

export interface RowProps {
  children?: React.ReactNode
  /** Elemento à esquerda (avatar, badge…). */
  leading?: React.ReactNode
  /** Elemento à direita (seta, contador…). */
  trailing?: React.ReactNode
  /** Se informado, a linha vira link. */
  href?: string
  onClick?: (e: React.MouseEvent) => void
}

export function Row({ children, leading, trailing, href, onClick }: RowProps) {
  const main = leading ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
      {leading}
      {children}
    </span>
  ) : (
    children
  )
  const common = {
    className: 'row',
    onClick,
  }
  const inner = (
    <>
      {main}
      {trailing != null ? (
        <span className="muted" aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </>
  )
  if (href) {
    return (
      <a {...common} href={href}>
        {inner}
      </a>
    )
  }
  return (
    <div {...common} tabIndex={onClick ? 0 : undefined} role={onClick ? 'button' : undefined}>
      {inner}
    </div>
  )
}
