-- Redefine my_benefits: 1 linha por benefício; via agrega as fontes (text[]).
drop view if exists my_benefits;

create view my_benefits with (security_invoker = true) as
select
  b.id,
  b.title,
  b.summary,
  b.category,
  b.scope,
  b.uf,
  b.steps,
  b.partner_name,
  b.valid_until,
  b.image_url,
  b.action_url,
  b.action_label,
  b.created_at,
  array_agg(distinct si.label order by si.label) as via
from benefits b
join benefit_sources bs on bs.benefit_id = b.id
join source_items si on si.id = bs.source_item_id
join user_sources us on us.source_item_id = si.id
where us.user_id = auth.uid() and b.active
group by b.id;

grant select on my_benefits to authenticated;
