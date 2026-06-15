-- Catálogo real (M7). Vocabulário controlado:
--   card_brand: mastercard | visa
--   card_level: gold | platinum | black | signature | infinite
-- Catálogo é autoritativo. Remoção ESCOPADA do catálogo demo (no-op em banco limpo,
-- relevante ao reaplicar sobre um banco com o seed demo do M5).
delete from benefits where id in (
  'd0000001-0000-0000-0000-000000000001',
  'd0000001-0000-0000-0000-000000000002',
  'd0000001-0000-0000-0000-000000000003');
delete from sources where id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333');

-- (Tasks 2–5 inserem sources, source_items, benefits, benefit_sources,
--  benefit_card_tiers e benefit_locations abaixo desta linha.)
