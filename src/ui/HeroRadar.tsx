import type * as React from 'react'

export interface HeroRadarProps {
  /** Número grande em destaque. */
  count?: number | string
  /** Valor estimado (ex.: "R$ 4.2k"); usado na legenda padrão. */
  value?: React.ReactNode
  /** Eyebrow acima do número. */
  label?: string
  /** Legenda customizada (substitui a legenda padrão). */
  caption?: React.ReactNode
}

export function HeroRadar({ count = 0, value, label = 'Seu radar', caption }: HeroRadarProps) {
  return (
    <div
      style={{
        borderRadius: '18px',
        padding: 'var(--s5)',
        color: '#fff',
        background: 'linear-gradient(120deg,var(--c-airport),var(--c-viagem) 58%,var(--c-seguro))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: '-30px',
          top: '-30px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,.13)',
        }}
      />
      <p className="lbl" style={{ color: 'rgba(255,255,255,.85)', marginBottom: '5px' }}>
        {label}
      </p>
      <div style={{ fontSize: 'var(--fz-display)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1 }}>
        {count}
      </div>
      {caption ? (
        <div style={{ fontSize: '13px', opacity: 0.92, marginTop: '4px' }}>{caption}</div>
      ) : value != null ? (
        <div style={{ fontSize: '13px', opacity: 0.92, marginTop: '4px' }}>
          benefícios ativos · <b>{value}</b> em valor estimado/ano
        </div>
      ) : null}
    </div>
  )
}
