import type * as React from 'react'

export interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Ícone à esquerda. */
  icon?: React.ReactNode
  ariaLabel?: string
}

export function Input({ type = 'text', placeholder, value, onChange, icon, ariaLabel }: InputProps) {
  return (
    <label className="input">
      {icon ? (
        <span className="muted" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel ?? placeholder}
      />
    </label>
  )
}
