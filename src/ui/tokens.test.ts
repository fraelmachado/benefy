import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'

// vitest empties CSS `?raw` imports, so read the source file from disk
// (cwd is the repo root when vitest runs).
const css = readFileSync('src/ui/ds.css', 'utf8')

describe('ds.css', () => {
  it('define os tokens-chave', () => {
    expect(css).toContain('--accent: #2B44FF')
    expect(css).toContain('--c-pontos: #E5447E')
    expect(css).toContain('[data-theme="dark"]')
  })
  it('define as classes de componente', () => {
    for (const cls of ['.pass', '.chip', '.btn', '.nav', '.seg']) expect(css).toContain(cls)
  })
})
