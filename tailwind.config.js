/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        cat: {
          airport: 'var(--c-airport)',
          seguro: 'var(--c-seguro)',
          viagem: 'var(--c-viagem)',
          cashback: 'var(--c-cashback)',
          compras: 'var(--c-compras)',
          pontos: 'var(--c-pontos)',
        },
      },
      fontFamily: { sans: ['Onest', 'system-ui', 'sans-serif'] },
      borderRadius: { ds: '20px', 'ds-sm': '14px', 'ds-xs': '10px' },
    },
  },
  plugins: [],
}
