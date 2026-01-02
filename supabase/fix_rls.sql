-- Fix RLS policies to explicitly allow everything for authenticated users
-- Run this in Supabase SQL Editor

-- 1. Equipment Table
alter table equipment enable row level security;
drop policy if exists "Allow all access to authenticated users" on equipment;
create policy "Enable all for authenticated users" on equipment 
  for all 
  to authenticated 
  using (true) 
  with check (true);

-- 2. Bookings Table
alter table bookings enable row level security;
drop policy if exists "Allow all access to authenticated users" on bookings;
create policy "Enable all for authenticated users" on bookings 
  for all 
  to authenticated 
  using (true) 
  with check (true);

-- 3. Categories Table
alter table categories enable row level security;
drop policy if exists "Allow all access to authenticated users" on categories;
create policy "Enable all for authenticated users" on categories 
  for all 
  to authenticated 
  using (true) 
  with check (true);

-- 4. Profiles Table (if used)
alter table profiles enable row level security;
drop policy if exists "Allow all access to authenticated users" on profiles;
create policy "Enable all for authenticated users" on profiles 
  for all 
  to authenticated 
  using (true) 
  with check (true);

-- 5. App Settings Table
alter table app_settings enable row level security;
drop policy if exists "Allow all access to authenticated users" on app_settings;
create policy "Enable all for authenticated users" on app_settings 
  for all 
  to authenticated 
  using (true) 
  with check (true);
