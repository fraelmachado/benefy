import type * as React from 'react'

export type PassCategory =
  | 'airport' | 'seguro' | 'viagem' | 'cashback' | 'compras' | 'pontos'

export type PassOriginType = 'emissor' | 'bandeira' | 'parceiro'

export interface PassProps {
  /** Título do benefício (obrigatório). */
  title: string
  /** Origem: nome do cartão/emissor — "via <via>". */
  via?: string
  /** Descrição curta opcional. */
  desc?: string
  /** Categoria — define a cor da borda e da tag. */
  category?: PassCategory
  /** Rótulo de tag no canto (ignorado quando isNew). */
  tag?: string
  /** Marca o passe como novo. */
  isNew?: boolean
  /** Tipo de origem — define o estilo do pill. */
  originType?: PassOriginType
  /** Texto do pill de origem, ex.: "Emissor · Nubank". */
  originLabel?: string
  /** Se informado, o card vira link. */
  href?: string
  /** Handler de clique (card vira botão se não houver href). */
  onClick?: (e: React.MouseEvent) => void
}

const CAT: Record<PassCategory, string> = {
  airport: '--c-airport',
  seguro: '--c-seguro',
  viagem: '--c-viagem',
  cashback: '--c-cashback',
  compras: '--c-compras',
  pontos: '--c-pontos',
}

const ORIGIN: Record<PassOriginType, { cls: string; sym: string }> = {
  emissor: { cls: 'iss', sym: '●' },
  bandeira: { cls: 'brand', sym: '◈' },
  parceiro: { cls: 'part', sym: '●' },
}

export function Pass({
  title,
  via,
  desc,
  category = 'airport',
  tag,
  isNew = false,
  originType = 'emissor',
  originLabel,
  href,
  onClick,
}: PassProps) {
  const catVar = CAT[category] ?? CAT.airport
  const origin = ORIGIN[originType] ?? ORIGIN.emissor
  const interactive = !!href || !!onClick
  const style = { '--cat': `var(${catVar})` } as React.CSSProperties

  const topRight = isNew ? (
    <span className="new">novo</span>
  ) : tag ? (
    <span className="tag">{tag}</span>
  ) : null

  const inner = (
    <>
      <div className="edge" />
      <div className="stub">
        <div className="top">
          <span className="via">
            via <b>{via}</b>
          </span>
          {topRight}
        </div>
        <h3>{title}</h3>
        {desc ? <p className="d">{desc}</p> : null}
      </div>
      <div className="perf" />
      <div className="foot">
        <span className={`pill ${origin.cls}`}>{`${origin.sym} ${originLabel ?? ''}`}</span>
        <span className="go" aria-hidden="true">
          →
        </span>
      </div>
    </>
  )

  if (href) {
    return (
      <a className="pass" href={href} onClick={onClick} style={style}>
        {inner}
      </a>
    )
  }
  return (
    <div
      className="pass"
      onClick={onClick}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      style={style}
    >
      {inner}
    </div>
  )
}
