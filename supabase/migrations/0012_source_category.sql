-- P1: taxonomia de categoria de fonte (UI). Aditiva.
-- source_category é a dimensão voltada ao usuário (agrupa onboarding, ícone, pílula
-- de origem). sources.kind é mantido como metadado técnico (legado), não é removido.
create type source_category as enum (
  'bank_card','carrier','health','corporate_benefits','loyalty','retail','mall');

-- not null DEFAULT 'bank_card': em produção preenche todas as fontes existentes
-- automaticamente (100% do catálogo atual é banco/cartão) e writers que ainda não
-- conhecem a coluna (seed de teste, admin SourceForm) não quebram o NOT NULL.
alter table sources add column source_category source_category not null default 'bank_card';
