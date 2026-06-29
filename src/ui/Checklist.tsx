import type * as React from 'react'

export interface ChecklistItem {
  label: React.ReactNode
  /** Concluído (mostra ✓). Os demais são numerados na ordem. */
  done?: boolean
}

export interface ChecklistProps {
  items: ChecklistItem[]
}

export function Checklist({ items = [] }: ChecklistProps) {
  let step = 0
  return (
    <div>
      {items.map((it, i) => {
        const last = i === items.length - 1
        const mark = it.done ? '✓' : String(++step)
        return (
          <div key={i} className="check" style={last ? { borderBottom: 0 } : undefined}>
            <span className={'bx' + (it.done ? ' dn' : '')} aria-hidden="true">
              {mark}
            </span>
            {it.label}
          </div>
        )
      })}
    </div>
  )
}
