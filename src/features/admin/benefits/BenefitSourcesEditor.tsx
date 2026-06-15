import type { SourceRow } from '../sources/types'

export function BenefitSourcesEditor({
  sources,
  selected,
  onChange,
}: {
  sources: SourceRow[]
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  function toggle(itemId: string) {
    onChange(selected.includes(itemId) ? selected.filter((i) => i !== itemId) : [...selected, itemId])
  }
  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <h3 className="mb-2 text-sm font-semibold">Destravado por (variantes)</h3>
      <div className="flex flex-col gap-3">
        {sources.map((s) => (
          <div key={s.id}>
            <p className="text-xs font-medium text-slate-500">{s.name}</p>
            <div className="flex flex-wrap gap-3">
              {s.source_items.map((it) => (
                <label key={it.id} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    aria-label={it.label}
                    checked={selected.includes(it.id)}
                    onChange={() => toggle(it.id)}
                  />
                  {it.label}
                </label>
              ))}
            </div>
          </div>
        ))}
        {sources.length === 0 && <p className="text-xs text-slate-400">Sem fontes cadastradas.</p>}
      </div>
    </div>
  )
}
