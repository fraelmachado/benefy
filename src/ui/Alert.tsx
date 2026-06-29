import type * as React from 'react'

export interface AlertProps {
  children?: React.ReactNode
  /** Glifo/ícone à esquerda (padrão ⚠). */
  icon?: React.ReactNode
}

export function Alert({ children, icon = '⚠' }: AlertProps) {
  return (
    <div className="alert" role="note">
      <span aria-hidden="true">{icon}</span>
      <div>{children}</div>
    </div>
  )
}
