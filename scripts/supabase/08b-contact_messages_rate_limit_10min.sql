-- Rate limit: ten sam email nie może wysłać wiadomości w ciągu 10 minut (zmiana z 30)

create or replace function public.check_contact_rate_limit(p_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.contact_messages
  where email = p_email
    and created_at > now() - interval '10 minutes';

  return v_count = 0;
end;
$$;

create or replace function public.trigger_contact_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_contact_rate_limit(new.email) then
    raise exception 'Ten adres email wysłał już wiadomość w ostatnich 10 minutach. Spróbuj ponownie później.';
  end if;
  return new;
end;
$$;

drop trigger if exists contact_messages_rate_limit on public.contact_messages;

create trigger contact_messages_rate_limit
  before insert on public.contact_messages
  for each row
  execute function public.trigger_contact_rate_limit();
