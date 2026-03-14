create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  track_code text,
  guest_name text not null,
  phone text not null,
  check_in date not null,
  check_out date not null,
  guests integer not null check (guests > 0),
  room_type text not null,
  room_type_label text not null,
  room_number integer not null check (room_number > 0),
  rooms_needed integer not null default 1 check (rooms_needed > 0),
  notes text not null default '',
  booking_status text not null,
  created_at timestamptz not null default now()
);

alter table public.bookings add column if not exists track_code text;

create unique index if not exists bookings_track_code_idx
  on public.bookings (track_code)
  where track_code is not null;

create index if not exists bookings_date_idx
  on public.bookings (check_in, check_out);

create index if not exists bookings_room_idx
  on public.bookings (room_type, room_number, check_in, check_out);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'user' check (role in ('owner', 'admin', 'user')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_idx
  on public.profiles (lower(username));

create table if not exists public.booking_change_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('cancel', 'hold', 'change_date', 'wrong_data')),
  request_note text not null default '',
  requested_guest_name text,
  requested_phone text,
  requested_check_in date,
  requested_check_out date,
  requested_notes text,
  requested_booking_status text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text not null default '',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists booking_change_requests_booking_idx
  on public.booking_change_requests (booking_id, status, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  first_user boolean;
begin
  select not exists(select 1 from public.profiles) into first_user;

  insert into public.profiles (user_id, username, full_name, phone, role, approved)
  values (
    new.id,
    lower(coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1))),
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), ''),
    coalesce(nullif(new.raw_user_meta_data->>'phone', ''), ''),
    case when first_user then 'owner' else 'user' end,
    case when first_user then true else false end
  )
  on conflict (user_id) do update set
    username = excluded.username,
    full_name = excluded.full_name,
    phone = excluded.phone;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_approved_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1
    from public.profiles
    where user_id = auth.uid()
      and approved = true
  );
$$;

create or replace function public.is_owner_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1
    from public.profiles
    where user_id = auth.uid()
      and approved = true
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1
    from public.profiles
    where user_id = auth.uid()
      and approved = true
      and role = 'owner'
  );
$$;

alter table public.bookings enable row level security;
alter table public.profiles enable row level security;
alter table public.booking_change_requests enable row level security;

drop policy if exists "anon can read bookings" on public.bookings;
drop policy if exists "anon can insert bookings" on public.bookings;
drop policy if exists "approved users can read bookings" on public.bookings;
create policy "approved users can read bookings"
on public.bookings
for select
to authenticated
using (public.is_approved_user());

drop policy if exists "approved users can insert bookings" on public.bookings;
create policy "approved users can insert bookings"
on public.bookings
for insert
to authenticated
with check (public.is_approved_user());

drop policy if exists "owner admin can update bookings" on public.bookings;
create policy "owner admin can update bookings"
on public.bookings
for update
to authenticated
using (public.is_owner_or_admin())
with check (public.is_owner_or_admin());

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "owner admin can read all profiles" on public.profiles;
create policy "owner admin can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_owner_or_admin());

drop policy if exists "owner admin can update profiles" on public.profiles;
create policy "owner admin can update profiles"
on public.profiles
for update
to authenticated
using (public.is_owner_or_admin())
with check (public.is_owner_or_admin());

drop policy if exists "users can read own change requests" on public.booking_change_requests;
create policy "users can read own change requests"
on public.booking_change_requests
for select
to authenticated
using (requested_by = auth.uid());

drop policy if exists "owner admin can read all change requests" on public.booking_change_requests;
create policy "owner admin can read all change requests"
on public.booking_change_requests
for select
to authenticated
using (public.is_owner_or_admin());

drop policy if exists "approved users can insert own change requests" on public.booking_change_requests;
create policy "approved users can insert own change requests"
on public.booking_change_requests
for insert
to authenticated
with check (public.is_approved_user() and requested_by = auth.uid());

drop policy if exists "owner admin can update change requests" on public.booking_change_requests;
create policy "owner admin can update change requests"
on public.booking_change_requests
for update
to authenticated
using (public.is_owner_or_admin())
with check (public.is_owner_or_admin());

create or replace function public.add_bookings_to_realtime()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bookings'
  ) then
    execute 'alter publication supabase_realtime add table public.bookings';
  end if;
end;
$$;

select public.add_bookings_to_realtime();

create or replace function public.add_change_requests_to_realtime()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'booking_change_requests'
  ) then
    execute 'alter publication supabase_realtime add table public.booking_change_requests';
  end if;
end;
$$;

select public.add_change_requests_to_realtime();
