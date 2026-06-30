import { useState, type FormEvent } from 'react'
import { ImageUpload } from '../upload/ImageUpload'
import type { SourceInput, SourceRow } from './types'
import type { SourceKind } from '../../onboarding/types'
import type { SourceCategory } from '../../benefits/types'
import { SOURCE_CATEGORY_META } from '../../onboarding/categoryMeta'

const KINDS: SourceKind[] = ['card', 'carrier', 'loyalty', 'cpf']

export function SourceForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: SourceRow | null
  onSubmit: (input: SourceInput) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [kind, setKind] = useState<SourceKind>(initial?.kind ?? 'card')
  const [sourceCategory, setSourceCategory] = useState<SourceCategory>(
    initial?.source_category ?? 'bank_card',
  )
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0)
  const [active, setActive] = useState(initial?.active ?? true)
  const [logoUrl, setLogoUrl] = useState<string | null>(initial?.logo_url ?? null)
  const [connectorType, setConnectorType] = useState(initial?.connector_type ?? '')
  const [pluggyId, setPluggyId] = useState<string>(initial?.pluggy_connector_id?.toString() ?? '')
  const [institutionUrl, setInstitutionUrl] = useState(initial?.institution_url ?? '')
  const [primaryColor, setPrimaryColor] = useState(initial?.primary_color ?? '')
  const [country, setCountry] = useState(initial?.country ?? 'BR')

  function submit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      name,
      kind,
      source_category: sourceCategory,
      sort_order: Number(sortOrder) || 0,
      active,
      logo_url: logoUrl,
      connector_type: connectorType || null,
      pluggy_connector_id: pluggyId ? Number(pluggyId) : null,
      institution_url: institutionUrl || null,
      primary_color: primaryColor || null,
      country: country || 'BR',
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4">
      <label className="text-sm font-medium" htmlFor="s-name">Nome</label>
      <input id="s-name" required value={name} onChange={(e) => setName(e.target.value)} className="rounded border px-2 py-1" />

      <label className="text-sm font-medium" htmlFor="s-kind">Tipo (kind)</label>
      <select id="s-kind" value={kind} onChange={(e) => setKind(e.target.value as SourceKind)} className="rounded border px-2 py-1">
        {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
      </select>

      <label className="text-sm font-medium" htmlFor="s-cat">Categoria</label>
      <select id="s-cat" value={sourceCategory} onChange={(e) => setSourceCategory(e.target.value as SourceCategory)} className="rounded border px-2 py-1">
        {SOURCE_CATEGORY_META.map((c) => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
      </select>

      <label className="text-sm font-medium" htmlFor="s-order">Ordem</label>
      <input id="s-order" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="rounded border px-2 py-1" />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Ativo
      </label>

      <span className="text-sm font-medium">Logo</span>
      <ImageUpload folder="sources" value={logoUrl} onChange={setLogoUrl} />

      <fieldset className="mt-2 rounded border border-slate-100 p-3">
        <legend className="text-xs text-slate-500">Open Finance / Pluggy</legend>
        <label className="text-sm font-medium" htmlFor="s-ct">connector_type</label>
        <input id="s-ct" value={connectorType} onChange={(e) => setConnectorType(e.target.value)} className="mb-2 w-full rounded border px-2 py-1" placeholder="PERSONAL_BANK / TELECOMMUNICATION / DIGITAL_ECONOMY" />
        <label className="text-sm font-medium" htmlFor="s-pid">pluggy_connector_id</label>
        <input id="s-pid" type="number" value={pluggyId} onChange={(e) => setPluggyId(e.target.value)} className="mb-2 w-full rounded border px-2 py-1" />
        <label className="text-sm font-medium" htmlFor="s-iu">institution_url</label>
        <input id="s-iu" value={institutionUrl} onChange={(e) => setInstitutionUrl(e.target.value)} className="mb-2 w-full rounded border px-2 py-1" />
        <label className="text-sm font-medium" htmlFor="s-pc">primary_color</label>
        <input id="s-pc" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="mb-2 w-full rounded border px-2 py-1" placeholder="#0f172a" />
        <label className="text-sm font-medium" htmlFor="s-country">country</label>
        <input id="s-country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded border px-2 py-1" />
      </fieldset>

      <div className="mt-2 flex gap-2">
        <button type="submit" className="rounded bg-slate-800 px-4 py-2 text-white">Salvar</button>
        <button type="button" onClick={onCancel} className="rounded border px-4 py-2">Cancelar</button>
      </div>
    </form>
  )
}
