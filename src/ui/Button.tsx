import type * as React from 'react'

export interface ButtonProps {
  children?: React.ReactNode
  /** Estilo visual. */
  variant?: 'primary' | 'ink' | 'ghost'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent) => void
  /** Ícone opcional à esquerda do rótulo. */
  icon?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  type = 'button',
  onClick,
  icon,
}: ButtonProps) {
  const cls = 'btn' + (variant === 'ink' ? ' ink' : variant === 'ghost' ? ' ghost' : '')
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      {icon ?? null}
      {children}
    </button>
  )
}
