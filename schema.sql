create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  track_code text,
  guest_name text not null,
  phone text not null,
  created_by_name text not null default '',
  check_in date not null,
  check_out date not null,
  guests integer not null check (guests > 0),
  room_type text not null,
  room_type_label text not null,
  room_number integer not null check (room_number > 0),
  rooms_needed integer not null default 1 check (rooms_needed > 0),
  pricing_pax integer not null default 0,
  weekend_rate numeric(12,2) not null default 0,
  weekday_rate numeric(12,2) not null default 0,
  weekend_nights integer not null default 0,
  weekday_nights integer not null default 0,
  base_room_total numeric(12,2) not null default 0,
  offer_percentage numeric(8,2) not null default 0,
  advance_paid boolean not null default false,
  advance_amount numeric(12,2) not null default 0,
  room_total numeric(12,2) not null default 0,
  notes text not null default '',
  booking_status text not null,
  created_at timestamptz not null default now()
);

alter table public.bookings add column if not exists track_code text;
alter table public.bookings add column if not exists created_by_name text not null default '';
alter table public.bookings add column if not exists pricing_pax integer not null default 0;
alter table public.bookings add column if not exists weekend_rate numeric(12,2) not null default 0;
alter table public.bookings add column if not exists weekday_rate numeric(12,2) not null default 0;
alter table public.bookings add column if not exists weekend_nights integer not null default 0;
alter table public.bookings add column if not exists weekday_nights integer not null default 0;
alter table public.bookings add column if not exists base_room_total numeric(12,2) not null default 0;
alter table public.bookings add column if not exists offer_percentage numeric(8,2) not null default 0;
alter table public.bookings add column if not exists advance_paid boolean not null default false;
alter table public.bookings add column if not exists advance_amount numeric(12,2) not null default 0;
alter table public.bookings add column if not exists room_total numeric(12,2) not null default 0;

drop index if exists bookings_track_code_idx;

create index if not exists bookings_track_code_idx
  on public.bookings (track_code);

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
  extra_permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_idx
  on public.profiles (lower(username));

alter table public.profiles add column if not exists extra_permissions jsonb not null default '[]'::jsonb;

create table if not exists public.room_pricing (
  id uuid primary key default gen_random_uuid(),
  room_type text not null check (room_type in ('kitchen', 'normal', 'driver')),
  pax integer not null default 0,
  weekend_price numeric(12,2) not null default 0 check (weekend_price >= 0),
  weekday_percentage numeric(8,2) not null default 100 check (weekday_percentage >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint room_pricing_pax_check check (
    (room_type = 'normal' and pax between 1 and 4)
    or (room_type in ('kitchen', 'driver') and pax = 0)
  ),
  constraint room_pricing_unique unique (room_type, pax)
);

insert into public.room_pricing (room_type, pax, weekend_price, weekday_percentage)
values
  ('kitchen', 0, 0, 100),
  ('driver', 0, 0, 100),
  ('normal', 1, 0, 100),
  ('normal', 2, 0, 100),
  ('normal', 3, 0, 100),
  ('normal', 4, 0, 100)
on conflict (room_type, pax) do nothing;

create table if not exists public.room_inventory (
  id uuid primary key default gen_random_uuid(),
  room_type text not null check (room_type in ('kitchen', 'normal', 'driver')),
  room_number integer not null check (room_number > 0),
  max_pax integer not null check (max_pax > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint room_inventory_unique unique (room_type, room_number)
);

insert into public.room_inventory (room_type, room_number, max_pax, is_active)
values
  ('kitchen', 1, 6, true),
  ('kitchen', 2, 6, true),
  ('normal', 1, 4, true),
  ('normal', 2, 4, true),
  ('normal', 3, 4, true),
  ('normal', 4, 4, true),
  ('driver', 1, 4, true)
on conflict (room_type, room_number) do nothing;

create table if not exists public.booking_change_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('cancel', 'hold', 'change_date', 'edit_booking_data', 'change_room_price', 'additional_rooms', 'additional_services', 'remove_rooms', 'delete_booking', 'wrong_data')),
  request_note text not null default '',
  requested_scope text not null default 'single' check (requested_scope in ('single', 'group')),
  requested_guest_name text,
  requested_phone text,
  requested_check_in date,
  requested_check_out date,
  requested_room_type text,
  requested_room_type_label text,
  requested_room_number integer,
  requested_guests integer,
  requested_weekend_rate numeric(12,2),
  requested_weekday_rate numeric(12,2),
  requested_offer_percentage numeric(8,2),
  requested_extra_rooms jsonb not null default '[]'::jsonb,
  requested_services jsonb not null default '[]'::jsonb,
  requested_remove_rooms jsonb not null default '[]'::jsonb,
  requested_booking_rooms jsonb not null default '[]'::jsonb,
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

alter table public.booking_change_requests add column if not exists requested_room_type text;
alter table public.booking_change_requests add column if not exists requested_room_type_label text;
alter table public.booking_change_requests add column if not exists requested_room_number integer;
alter table public.booking_change_requests add column if not exists requested_guests integer;
alter table public.booking_change_requests add column if not exists requested_weekend_rate numeric(12,2);
alter table public.booking_change_requests add column if not exists requested_weekday_rate numeric(12,2);
alter table public.booking_change_requests add column if not exists requested_offer_percentage numeric(8,2);
alter table public.booking_change_requests add column if not exists requested_extra_rooms jsonb not null default '[]'::jsonb;
alter table public.booking_change_requests add column if not exists requested_scope text not null default 'single';
alter table public.booking_change_requests add column if not exists requested_services jsonb not null default '[]'::jsonb;
alter table public.booking_change_requests add column if not exists requested_remove_rooms jsonb not null default '[]'::jsonb;
alter table public.booking_change_requests add column if not exists requested_booking_rooms jsonb not null default '[]'::jsonb;
alter table public.booking_change_requests drop constraint if exists booking_change_requests_reason_check;
alter table public.booking_change_requests
  add constraint booking_change_requests_reason_check
  check (reason in ('cancel', 'hold', 'change_date', 'edit_booking_data', 'change_room_price', 'additional_rooms', 'additional_services', 'remove_rooms', 'delete_booking', 'wrong_data'));

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

create or replace function public.has_profile_permission(permission_key text)
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
      and (
        role in ('owner', 'admin')
        or coalesce(extra_permissions, '[]'::jsonb) @> jsonb_build_array(permission_key)
      )
  );
$$;

alter table public.bookings enable row level security;
alter table public.profiles enable row level security;
alter table public.booking_change_requests enable row level security;
alter table public.room_pricing enable row level security;
alter table public.room_inventory enable row level security;

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
using (public.has_profile_permission('manage_bookings'))
with check (public.has_profile_permission('manage_bookings'));

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

drop policy if exists "approved users can read room pricing" on public.room_pricing;
create policy "approved users can read room pricing"
on public.room_pricing
for select
to authenticated
using (public.is_approved_user());

drop policy if exists "owner admin can insert room pricing" on public.room_pricing;
create policy "owner admin can insert room pricing"
on public.room_pricing
for insert
to authenticated
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "owner admin can update room pricing" on public.room_pricing;
create policy "owner admin can update room pricing"
on public.room_pricing
for update
to authenticated
using (public.has_profile_permission('manage_pricing'))
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "approved users can read room inventory" on public.room_inventory;
create policy "approved users can read room inventory"
on public.room_inventory
for select
to authenticated
using (public.is_approved_user());

drop policy if exists "owner admin can insert room inventory" on public.room_inventory;
create policy "owner admin can insert room inventory"
on public.room_inventory
for insert
to authenticated
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "owner admin can update room inventory" on public.room_inventory;
create policy "owner admin can update room inventory"
on public.room_inventory
for update
to authenticated
using (public.has_profile_permission('manage_pricing'))
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "owner admin can delete room inventory" on public.room_inventory;
create policy "owner admin can delete room inventory"
on public.room_inventory
for delete
to authenticated
using (public.has_profile_permission('manage_pricing'));

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
using (public.has_profile_permission('manage_requests'));

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
using (public.has_profile_permission('manage_requests'))
with check (public.has_profile_permission('manage_requests'));

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
