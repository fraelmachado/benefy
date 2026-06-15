import { supabase } from '../../../lib/supabase'

// Sobe um arquivo pro bucket público `assets` e devolve a URL pública.
export async function uploadAsset(folder: string, file: File): Promise<string> {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('assets').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from('assets').getPublicUrl(path).data.publicUrl
}
