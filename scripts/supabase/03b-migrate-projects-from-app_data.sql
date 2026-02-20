-- Opcjonalna migracja: kopiowanie danych z app_data (key=projects) do tabeli projects.
-- Uruchomić JEDEN RAZ po 03-projects-table.sql, gdy tabela projects jest pusta.
-- Po migracji NIE usuwać wpisu key='projects' z app_data – nastąpi to po przełączeniu API na tabelę projects.

do $$
declare
  max_id bigint;
begin
  if (select count(*) from public.projects) > 0 then
    raise notice 'Tabela projects nie jest pusta – pomijam migrację.';
    return;
  end if;

  if not exists (select 1 from public.app_data where key = 'projects') then
    raise notice 'Brak wpisu app_data.key=projects – pomijam migrację.';
    return;
  end if;

  insert into public.projects (
    id,
    title,
    description,
    category,
    stack,
    image,
    github,
    demo,
    color,
    "order",
    full_description,
    attachments,
    download_links,
    status,
    featured,
    created_at,
    updated_at
  )
  overriding system value
  select
    (elem->>'id')::bigint,
    coalesce(elem->>'title', ''),
    coalesce(elem->>'description', ''),
    coalesce(elem->>'category', 'Frontend'),
    coalesce(elem->'stack', '[]'::jsonb),
    elem->>'image',
    coalesce(elem->>'github', ''),
    coalesce(elem->>'demo', ''),
    elem->>'color',
    coalesce((elem->>'order')::int, 0),
    coalesce(elem->'fullDescription', elem->'full_description', '[]'::jsonb),
    coalesce(elem->'attachments', '[]'::jsonb),
    coalesce(elem->'downloadLinks', elem->'download_links'),
    coalesce(elem->>'status', 'draft'),
    coalesce((elem->>'featured')::boolean, false),
    now(),
    now()
  from public.app_data,
    jsonb_array_elements(value) as elem
  where key = 'projects';

  select max(id) into max_id from public.projects;
  if max_id is not null then
    perform setval(pg_get_serial_sequence('public.projects', 'id'), max_id);
  end if;

  raise notice 'Migracja zakończona: skopiowano projekty z app_data do projects.';
end
$$;
