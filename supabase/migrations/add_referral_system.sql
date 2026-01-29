create extension if not exists "pgcrypto";

alter table profiles add column if not exists referral_code text;
alter table profiles add column if not exists referred_by uuid;
alter table profiles add column if not exists referral_credits integer not null default 0;
alter table profiles add column if not exists is_banned boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_referral_code_key'
  ) then
    alter table profiles add constraint profiles_referral_code_key unique (referral_code);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_referred_by_fkey'
  ) then
    alter table profiles add constraint profiles_referred_by_fkey
      foreign key (referred_by) references profiles(id) on delete set null;
  end if;
end;
$$;

create index if not exists idx_profiles_referral_code on profiles(referral_code);
create index if not exists idx_profiles_referred_by on profiles(referred_by);

create or replace function generate_referral_code()
returns text
language plpgsql
as $$
declare
  code text;
begin
  loop
    code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));
    exit when not exists (select 1 from profiles where referral_code = code);
  end loop;
  return code;
end;
$$;

create or replace function set_referral_code()
returns trigger
language plpgsql
as $$
begin
  if new.referral_code is null or length(new.referral_code) = 0 then
    new.referral_code := generate_referral_code();
  end if;
  return new;
end;
$$;

drop trigger if exists set_referral_code on profiles;
create trigger set_referral_code
before insert on profiles
for each row execute function set_referral_code();

update profiles
set referral_code = generate_referral_code()
where referral_code is null or referral_code = '';

create or replace function increment_referral_credits(amount integer, target_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update profiles
  set referral_credits = referral_credits + amount,
      updated_at = now()
  where id = target_user_id;

  if not found then
    raise exception 'User % not found', target_user_id;
  end if;
end;
$$;
