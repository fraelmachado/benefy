import type * as React from 'react'

export type ChipCategory =
  | 'airport' | 'seguro' | 'viagem' | 'cashback' | 'compras' | 'pontos'

export interface ChipProps {
  children?: React.ReactNode
  /** Categoria — exibe o ponto colorido. */
  category?: ChipCategory
  /** Estado selecionado. */
  active?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export function Chip({ children, category, active = false, onClick }: ChipProps) {
  return (
    <button
      className={'chip' + (active ? ' on' : '')}
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {category ? <i className={`cat-${category}`} /> : null}
      {category ? ' ' : null}
      {children}
    </button>
  )
}
