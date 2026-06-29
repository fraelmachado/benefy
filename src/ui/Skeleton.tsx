import type * as React from 'react'

export interface SkeletonProps {
  /** `pass` imita um card Passe; `bar` é uma barra simples. */
  variant?: 'bar' | 'pass'
  width?: string
  height?: string
  radius?: string
}

export function Skeleton({ variant = 'bar', width, height, radius }: SkeletonProps) {
  if (variant === 'pass') {
    const bar = (w: string, h: string, extra?: React.CSSProperties) => (
      <div className="sk" style={{ height: h, width: w, ...extra }} />
    )
    return (
      <div className="pass" style={{ '--cat': 'var(--line)' } as React.CSSProperties}>
        <div className="edge" />
        <div className="stub">
          {bar('130px', '12px', { marginBottom: '10px' })}
          {bar('90%', '18px', { marginBottom: '7px' })}
          {bar('70%', '13px')}
        </div>
        <div className="perf" />
        <div className="foot">
          {bar('120px', '22px', { borderRadius: '99px' })}
          {bar('31px', '31px', { borderRadius: '10px' })}
        </div>
      </div>
    )
  }
  return (
    <div className="sk" style={{ width: width ?? '100%', height: height ?? '14px', borderRadius: radius }} />
  )
}
