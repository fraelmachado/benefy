-- Alinhamento com Open Finance / Pluggy (aditivo; integração NÃO implementada).
-- connector (Pluggy) ≈ sources ; account.creditData (brand/level) ≈ source_items.
-- Ver docs/research/2026-06-15-pluggy-openfinance.md

alter table sources
  add column pluggy_connector_id integer unique,
  add column connector_type text,
  add column institution_url text,
  add column primary_color text,
  add column country text not null default 'BR';

alter table source_items
  add column card_brand text,
  add column card_level text,
  add column pluggy_product text;
