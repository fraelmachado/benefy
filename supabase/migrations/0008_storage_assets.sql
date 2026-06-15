-- Bucket público de imagens do catálogo (logos/banners).
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Leitura pública dos objetos do bucket.
create policy "assets public read" on storage.objects
  for select
  using (bucket_id = 'assets');

-- Escrita (insert/update/delete) só por admin.
create policy "assets admin write" on storage.objects
  for all
  to authenticated
  using (bucket_id = 'assets' and public.is_admin())
  with check (bucket_id = 'assets' and public.is_admin());
