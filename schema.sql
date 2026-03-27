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
  ac_enabled boolean not null default true,
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
  custom_payments jsonb not null default '[]'::jsonb,
  room_total numeric(12,2) not null default 0,
  lifecycle_status text not null default 'booked' check (lifecycle_status in ('booked', 'checked_in', 'checked_out', 'hold')),
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  close_details jsonb not null default '{}'::jsonb,
  notes text not null default '',
  booking_status text not null,
  created_at timestamptz not null default now()
);

alter table public.bookings add column if not exists track_code text;
alter table public.bookings add column if not exists created_by_name text not null default '';
alter table public.bookings add column if not exists ac_enabled boolean not null default true;
alter table public.bookings add column if not exists pricing_pax integer not null default 0;
alter table public.bookings add column if not exists weekend_rate numeric(12,2) not null default 0;
alter table public.bookings add column if not exists weekday_rate numeric(12,2) not null default 0;
alter table public.bookings add column if not exists weekend_nights integer not null default 0;
alter table public.bookings add column if not exists weekday_nights integer not null default 0;
alter table public.bookings add column if not exists base_room_total numeric(12,2) not null default 0;
alter table public.bookings add column if not exists offer_percentage numeric(8,2) not null default 0;
alter table public.bookings add column if not exists advance_paid boolean not null default false;
alter table public.bookings add column if not exists advance_amount numeric(12,2) not null default 0;
alter table public.bookings add column if not exists custom_payments jsonb not null default '[]'::jsonb;
alter table public.bookings add column if not exists room_total numeric(12,2) not null default 0;
alter table public.bookings add column if not exists lifecycle_status text not null default 'booked';
alter table public.bookings add column if not exists checked_in_at timestamptz;
alter table public.bookings add column if not exists checked_out_at timestamptz;
alter table public.bookings add column if not exists close_details jsonb not null default '{}'::jsonb;
alter table public.bookings drop constraint if exists bookings_lifecycle_status_check;
alter table public.bookings
  add constraint bookings_lifecycle_status_check
  check (lifecycle_status in ('booked', 'checked_in', 'checked_out', 'hold'));

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
  ac_enabled boolean not null default true,
  weekend_price numeric(12,2) not null default 0 check (weekend_price >= 0),
  weekday_percentage numeric(8,2) not null default 100 check (weekday_percentage >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint room_pricing_pax_check check (
    (room_type = 'normal' and pax between 1 and 4)
    or (room_type in ('kitchen', 'driver') and pax = 0 and ac_enabled = true)
  ),
  constraint room_pricing_unique unique (room_type, pax, ac_enabled)
);

alter table public.room_pricing add column if not exists ac_enabled boolean not null default true;
update public.room_pricing
set ac_enabled = true
where ac_enabled is distinct from true and room_type in ('kitchen', 'driver');

alter table public.room_pricing drop constraint if exists room_pricing_pax_check;
alter table public.room_pricing
  add constraint room_pricing_pax_check
  check (
    (room_type = 'normal' and pax between 1 and 4)
    or (room_type in ('kitchen', 'driver') and pax = 0 and ac_enabled = true)
  );

alter table public.room_pricing drop constraint if exists room_pricing_unique;
create unique index if not exists room_pricing_unique_idx
  on public.room_pricing (room_type, pax, ac_enabled);

insert into public.room_pricing (room_type, pax, ac_enabled, weekend_price, weekday_percentage)
values
  ('kitchen', 0, true, 0, 100),
  ('driver', 0, true, 0, 100),
  ('normal', 1, true, 0, 100),
  ('normal', 1, false, 0, 100),
  ('normal', 2, true, 0, 100),
  ('normal', 2, false, 0, 100),
  ('normal', 3, true, 0, 100),
  ('normal', 3, false, 0, 100),
  ('normal', 4, true, 0, 100),
  ('normal', 4, false, 0, 100)
on conflict (room_type, pax, ac_enabled) do nothing;

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

create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  service_name text not null unique,
  default_price numeric(12,2) not null default 0 check (default_price >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_catalog add column if not exists sort_order integer not null default 0;

insert into public.service_catalog (service_name, default_price, is_active, sort_order)
values
  ('Breakfast', 0, true, 1),
  ('Lunch', 0, true, 2),
  ('Dinner', 0, true, 3),
  ('Liquor', 0, true, 4),
  ('Kitchen', 0, true, 5),
  ('Car', 0, true, 6),
  ('Van', 0, true, 7)
on conflict (service_name) do nothing;

update public.service_catalog
set sort_order = source.sort_order
from (
  values
    ('Breakfast', 1),
    ('Lunch', 2),
    ('Dinner', 3),
    ('Liquor', 4),
    ('Kitchen', 5),
    ('Car', 6),
    ('Van', 7)
) as source(service_name, sort_order)
where public.service_catalog.service_name = source.service_name
  and coalesce(public.service_catalog.sort_order, 0) = 0;

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

create table if not exists public.booking_runtime_settings (
  id boolean primary key default true,
  check_in_time text not null default '14:00',
  check_out_time text not null default '11:00',
  pdf_fields jsonb not null default '["trackCode","customer","phone","bookedBy","stay","notes","totalPax","rooms","totalPrice","customPrice","lifecycle","advance","advanceAmount","balance","checkInAt","checkOutAt","exportedAt","services","servicePrices","customPriceEntries","roomDetails"]'::jsonb,
  whatsapp_fields jsonb not null default '["trackCode","customer","phone","bookedBy","stay","notes","totalPax","rooms","totalPrice","customPrice","lifecycle","advance","advanceAmount","balance","checkInAt","checkOutAt","exportedAt","services","servicePrices","customPriceEntries","roomDetails"]'::jsonb,
  booking_view_fields jsonb not null default '["stay","rooms","totalPax","lifecycle","balance","trackCode","customer","bookedBy","phone","checkIn","checkOut","status","statusNote","checkInAt","checkOutAt","totalPrice","advance","customPrice","advanceAmount"]'::jsonb,
  room_fix_section_order jsonb not null default '["pdf","whatsapp","shareMessages","bookingView","notifications","systemUpdates"]'::jsonb,
  notification_roles jsonb not null default '["owner","admin"]'::jsonb,
  system_update_roles jsonb not null default '["owner","admin"]'::jsonb,
  share_rebooking_note text not null default 'For another booking, please inform us at least 3 days in advance.',
  share_contact_note text not null default 'For more information, call or WhatsApp +94719707597.',
  share_pdf_keep_note text not null default 'Please keep this PDF safe for your booking record.',
  planner_accent_color text not null default '#93c0ec',
  planner_track_colors jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint booking_runtime_settings_singleton check (id = true)
);

alter table public.booking_runtime_settings
  add column if not exists pdf_fields jsonb not null default '["trackCode","customer","phone","bookedBy","stay","notes","totalPax","rooms","totalPrice","customPrice","lifecycle","advance","advanceAmount","balance","checkInAt","checkOutAt","exportedAt","services","servicePrices","customPriceEntries","roomDetails"]'::jsonb;

alter table public.booking_runtime_settings
  add column if not exists whatsapp_fields jsonb not null default '["trackCode","customer","phone","bookedBy","stay","notes","totalPax","rooms","totalPrice","customPrice","lifecycle","advance","advanceAmount","balance","checkInAt","checkOutAt","exportedAt","services","servicePrices","customPriceEntries","roomDetails"]'::jsonb;

alter table public.booking_runtime_settings
  add column if not exists booking_view_fields jsonb not null default '["stay","rooms","totalPax","lifecycle","balance","trackCode","customer","bookedBy","phone","checkIn","checkOut","status","statusNote","checkInAt","checkOutAt","totalPrice","advance","customPrice","advanceAmount"]'::jsonb;

alter table public.booking_runtime_settings
  add column if not exists room_fix_section_order jsonb not null default '["pdf","whatsapp","bookingView"]'::jsonb;

alter table public.booking_runtime_settings
  alter column room_fix_section_order set default '["pdf","whatsapp","shareMessages","bookingView","notifications","systemUpdates"]'::jsonb;

alter table public.booking_runtime_settings
  add column if not exists notification_roles jsonb not null default '["owner","admin"]'::jsonb;

alter table public.booking_runtime_settings
  add column if not exists system_update_roles jsonb not null default '["owner","admin"]'::jsonb;

alter table public.booking_runtime_settings
  add column if not exists share_rebooking_note text not null default 'For another booking, please inform us at least 3 days in advance.';

alter table public.booking_runtime_settings
  add column if not exists share_contact_note text not null default 'For more information, call or WhatsApp +94719707597.';

alter table public.booking_runtime_settings
  add column if not exists share_pdf_keep_note text not null default 'Please keep this PDF safe for your booking record.';

alter table public.booking_runtime_settings
  add column if not exists planner_accent_color text not null default '#93c0ec';

alter table public.booking_runtime_settings
  add column if not exists planner_track_colors jsonb not null default '{}'::jsonb;

insert into public.booking_runtime_settings (id, check_in_time, check_out_time, pdf_fields, whatsapp_fields, share_rebooking_note, share_contact_note, share_pdf_keep_note)
values (
  true,
  '14:00',
  '11:00',
  '["trackCode","customer","phone","bookedBy","stay","notes","totalPax","rooms","totalPrice","customPrice","lifecycle","advance","advanceAmount","balance","checkInAt","checkOutAt","exportedAt","services","servicePrices","customPriceEntries","roomDetails"]'::jsonb,
  '["trackCode","customer","phone","bookedBy","stay","notes","totalPax","rooms","totalPrice","customPrice","lifecycle","advance","advanceAmount","balance","checkInAt","checkOutAt","exportedAt","services","servicePrices","customPriceEntries","roomDetails"]'::jsonb,
  'For another booking, please inform us at least 3 days in advance.',
  'For more information, call or WhatsApp +94719707597.',
  'Please keep this PDF safe for your booking record.'
)
on conflict (id) do nothing;

update public.booking_runtime_settings
set booking_view_fields = coalesce(
  booking_view_fields,
  '["stay","rooms","totalPax","lifecycle","balance","trackCode","customer","bookedBy","phone","checkIn","checkOut","status","statusNote","checkInAt","checkOutAt","totalPrice","advance","customPrice","advanceAmount"]'::jsonb
)
where booking_view_fields is null;

update public.booking_runtime_settings
set planner_accent_color = coalesce(nullif(trim(planner_accent_color), ''), '#93c0ec')
where planner_accent_color is null or trim(planner_accent_color) = '';

update public.booking_runtime_settings
set planner_track_colors = coalesce(planner_track_colors, '{}'::jsonb)
where planner_track_colors is null;

update public.booking_runtime_settings
set room_fix_section_order = coalesce(
  room_fix_section_order,
  '["pdf","whatsapp","shareMessages","bookingView","notifications","systemUpdates"]'::jsonb
)
where room_fix_section_order is null;

update public.booking_runtime_settings
set room_fix_section_order = room_fix_section_order || '["shareMessages"]'::jsonb
where not coalesce(room_fix_section_order, '[]'::jsonb) @> '["shareMessages"]'::jsonb;

update public.booking_runtime_settings
set room_fix_section_order = room_fix_section_order || '["notifications"]'::jsonb
where not coalesce(room_fix_section_order, '[]'::jsonb) @> '["notifications"]'::jsonb;

update public.booking_runtime_settings
set room_fix_section_order = room_fix_section_order || '["systemUpdates"]'::jsonb
where not coalesce(room_fix_section_order, '[]'::jsonb) @> '["systemUpdates"]'::jsonb;

update public.booking_runtime_settings
set notification_roles = coalesce(
  notification_roles,
  '["owner","admin"]'::jsonb
)
where notification_roles is null;

update public.booking_runtime_settings
set system_update_roles = coalesce(
  system_update_roles,
  '["owner","admin"]'::jsonb
)
where system_update_roles is null;

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

create table if not exists public.booking_notifications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  track_code text not null default '',
  request_id uuid references public.booking_change_requests(id) on delete set null,
  event_type text not null,
  title text not null,
  message text not null default '',
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_name text not null default '',
  target_user_id uuid references auth.users(id) on delete set null,
  audience text not null default 'owner_admin' check (audience in ('owner_admin', 'requester', 'all')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists booking_notifications_created_idx
  on public.booking_notifications (created_at desc);

create index if not exists booking_notifications_track_idx
  on public.booking_notifications (track_code, created_at desc);

create index if not exists booking_notifications_target_user_idx
  on public.booking_notifications (target_user_id, created_at desc);

create table if not exists public.booking_notification_reads (
  notification_id uuid not null references public.booking_notifications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

create table if not exists public.system_update_history (
  id uuid primary key default gen_random_uuid(),
  update_type text not null,
  title text not null,
  message text not null default '',
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_name text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists system_update_history_created_idx
  on public.system_update_history (created_at desc);

create table if not exists public.monthly_deductions (
  id uuid primary key default gen_random_uuid(),
  deduction_month date not null,
  category text not null default 'Other',
  title text not null,
  details text not null default '',
  amount numeric(12,2) not null default 0,
  actor_user_id uuid references auth.users(id) on delete set null,
  created_by_name text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists monthly_deductions_month_idx
  on public.monthly_deductions (deduction_month desc, created_at desc);

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

  insert into public.booking_notifications (
    track_code,
    event_type,
    title,
    message,
    actor_user_id,
    actor_name,
    target_user_id,
    audience,
    metadata
  )
  values (
    '',
    'new_user_joined',
    'New User Joined',
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1))
      || ' joined as '
      || case when first_user then 'owner' else 'user' end,
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    new.id,
    'owner_admin',
    jsonb_build_object(
      'guestName', coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
      'role', case when first_user then 'owner' else 'user' end,
      'username', lower(coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)))
    )
  );

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
alter table public.service_catalog enable row level security;
alter table public.booking_runtime_settings enable row level security;
alter table public.booking_notifications enable row level security;
alter table public.booking_notification_reads enable row level security;
alter table public.system_update_history enable row level security;
alter table public.monthly_deductions enable row level security;

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
drop policy if exists "approved users can update bookings" on public.bookings;
create policy "approved users can update bookings"
on public.bookings
for update
to authenticated
using (public.is_approved_user())
with check (public.is_approved_user());

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "owner admin can read all profiles" on public.profiles;
drop policy if exists "account managers can read all profiles" on public.profiles;
create policy "account managers can read all profiles"
on public.profiles
for select
to authenticated
using (public.has_profile_permission('manage_accounts'));

drop policy if exists "owner admin can update profiles" on public.profiles;
drop policy if exists "account managers can update profiles" on public.profiles;
create policy "account managers can update profiles"
on public.profiles
for update
to authenticated
using (public.has_profile_permission('manage_accounts'))
with check (public.has_profile_permission('manage_accounts'));

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

drop policy if exists "approved users can read service catalog" on public.service_catalog;
create policy "approved users can read service catalog"
on public.service_catalog
for select
to authenticated
using (public.is_approved_user());

drop policy if exists "approved users can read booking runtime settings" on public.booking_runtime_settings;
create policy "approved users can read booking runtime settings"
on public.booking_runtime_settings
for select
to authenticated
using (public.is_approved_user());

drop policy if exists "owner admin can insert booking runtime settings" on public.booking_runtime_settings;
create policy "owner admin can insert booking runtime settings"
on public.booking_runtime_settings
for insert
to authenticated
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "owner admin can update booking runtime settings" on public.booking_runtime_settings;
create policy "owner admin can update booking runtime settings"
on public.booking_runtime_settings
for update
to authenticated
using (public.has_profile_permission('manage_pricing'))
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "notification readers can read booking notifications" on public.booking_notifications;
create policy "notification readers can read booking notifications"
on public.booking_notifications
for select
to authenticated
using (
  public.is_owner_or_admin()
  or actor_user_id = auth.uid()
  or target_user_id = auth.uid()
  or audience = 'all'
);

drop policy if exists "approved users can insert booking notifications" on public.booking_notifications;
create policy "approved users can insert booking notifications"
on public.booking_notifications
for insert
to authenticated
with check (
  public.is_approved_user()
  and actor_user_id = auth.uid()
);

drop policy if exists "users can read own notification reads" on public.booking_notification_reads;
create policy "users can read own notification reads"
on public.booking_notification_reads
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "users can insert own notification reads" on public.booking_notification_reads;
create policy "users can insert own notification reads"
on public.booking_notification_reads
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "users can update own notification reads" on public.booking_notification_reads;
create policy "users can update own notification reads"
on public.booking_notification_reads
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "system update readers can read history" on public.system_update_history;
create policy "system update readers can read history"
on public.system_update_history
for select
to authenticated
using (public.is_approved_user());

drop policy if exists "approved users can insert system update history" on public.system_update_history;
create policy "approved users can insert system update history"
on public.system_update_history
for insert
to authenticated
with check (
  public.is_approved_user()
  and actor_user_id = auth.uid()
);

drop policy if exists "settings users can delete system update history" on public.system_update_history;
create policy "settings users can delete system update history"
on public.system_update_history
for delete
to authenticated
using (public.has_profile_permission('manage_pricing'));

drop policy if exists "owner admin can read deductions" on public.monthly_deductions;
create policy "owner admin can read deductions"
on public.monthly_deductions
for select
to authenticated
using (public.is_owner_or_admin());

drop policy if exists "owner admin can insert deductions" on public.monthly_deductions;
create policy "owner admin can insert deductions"
on public.monthly_deductions
for insert
to authenticated
with check (
  public.is_owner_or_admin()
  and actor_user_id = auth.uid()
);

drop policy if exists "owner admin can delete deductions" on public.monthly_deductions;
create policy "owner admin can delete deductions"
on public.monthly_deductions
for delete
to authenticated
using (public.is_owner_or_admin());

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

drop policy if exists "owner admin can insert service catalog" on public.service_catalog;
create policy "owner admin can insert service catalog"
on public.service_catalog
for insert
to authenticated
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "owner admin can update service catalog" on public.service_catalog;
create policy "owner admin can update service catalog"
on public.service_catalog
for update
to authenticated
using (public.has_profile_permission('manage_pricing'))
with check (public.has_profile_permission('manage_pricing'));

drop policy if exists "owner admin can delete service catalog" on public.service_catalog;
create policy "owner admin can delete service catalog"
on public.service_catalog
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

create or replace function public.add_notifications_to_realtime()
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
      and tablename = 'booking_notifications'
  ) then
    execute 'alter publication supabase_realtime add table public.booking_notifications';
  end if;
end;
$$;

select public.add_notifications_to_realtime();

create or replace function public.add_notification_reads_to_realtime()
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
      and tablename = 'booking_notification_reads'
  ) then
    execute 'alter publication supabase_realtime add table public.booking_notification_reads';
  end if;
end;
$$;

select public.add_notification_reads_to_realtime();

create or replace function public.add_system_updates_to_realtime()
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
      and tablename = 'system_update_history'
  ) then
    execute 'alter publication supabase_realtime add table public.system_update_history';
  end if;
end;
$$;

select public.add_system_updates_to_realtime();

create or replace function public.add_deductions_to_realtime()
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
      and tablename = 'monthly_deductions'
  ) then
    execute 'alter publication supabase_realtime add table public.monthly_deductions';
  end if;
end;
$$;

select public.add_deductions_to_realtime();
