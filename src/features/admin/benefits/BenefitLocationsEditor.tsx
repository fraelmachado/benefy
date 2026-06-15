import { useState } from 'react'
import { useSaveBenefitLocation, useDeleteBenefitLocation } from './useBenefitLocations'
import type { BenefitLocationRow } from './types'

export function BenefitLocationsEditor({ benefitId, locations }: { benefitId: string; locations: BenefitLocationRow[] }) {
  const save = useSaveBenefitLocation()
  const del = useDeleteBenefitLocation()
  const [name, setName] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [city, setCity] = useState('')
  const [uf, setUf] = useState('')

  async function add() {
    if (!name.trim() || lat === '' || lng === '') return
    await save.mutateAsync({
      benefit_id: benefitId,
      name: name.trim(),
      lat: Number(lat),
      lng: Number(lng),
      address: null,
      city: city || null,
      uf: uf || null,
      radius_m: null,
      active: true,
    })
    setName(''); setLat(''); setLng(''); setCity(''); setUf('')
  }

  return (
    <div className="mt-3 rounded-lg border border-slate-100 p-3">
      <h3 className="mb-2 text-sm font-semibold">Locais (geo)</h3>
      <ul className="flex flex-col gap-1">
        {locations.map((l) => (
          <li key={l.id} className="flex items-center gap-2 text-sm">
            <span>{l.name}</span>
            <span className="text-xs text-slate-400">{l.lat}, {l.lng}{l.city ? ` · ${l.city}` : ''}</span>
            <button type="button" aria-label={`remover ${l.name}`} onClick={() => del.mutateAsync(l.id)} className="ml-auto text-red-600">×</button>
          </li>
        ))}
        {locations.length === 0 && <li className="text-xs text-slate-400">Nenhum local.</li>}
      </ul>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="text-xs">Nome do local
          <input aria-label="nome do local" value={name} onChange={(e) => setName(e.target.value)} className="block rounded border px-2 py-1" />
        </label>
        <label className="text-xs">lat
          <input aria-label="lat" value={lat} onChange={(e) => setLat(e.target.value)} className="block w-24 rounded border px-2 py-1" />
        </label>
        <label className="text-xs">lng
          <input aria-label="lng" value={lng} onChange={(e) => setLng(e.target.value)} className="block w-24 rounded border px-2 py-1" />
        </label>
        <label className="text-xs">cidade
          <input aria-label="cidade" value={city} onChange={(e) => setCity(e.target.value)} className="block rounded border px-2 py-1" />
        </label>
        <label className="text-xs">uf
          <input aria-label="uf" value={uf} onChange={(e) => setUf(e.target.value)} className="block w-16 rounded border px-2 py-1" />
        </label>
        <button type="button" onClick={add} className="rounded bg-slate-700 px-3 py-1 text-sm text-white">Adicionar local</button>
      </div>
    </div>
  )
}
