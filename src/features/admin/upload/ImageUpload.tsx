import { useState, type ChangeEvent } from 'react'
import { uploadAsset } from './useUploadAsset'

export function ImageUpload({
  folder,
  value,
  onChange,
}: {
  folder: string
  value: string | null
  onChange: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError(false)
    try {
      const url = await uploadAsset(folder, file)
      onChange(url)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value && <img src={value} alt="prévia" className="h-12 w-12 rounded object-contain" />}
      <label className="text-sm text-slate-700">
        <span className="sr-only">Imagem</span>
        <input type="file" accept="image/*" aria-label="Imagem" onChange={onFile} />
      </label>
      {busy && <span className="text-xs text-slate-500">enviando…</span>}
      {error && <span className="text-xs text-red-600">falha no upload</span>}
    </div>
  )
}
