-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Admin access)
-- Although we rely on Supabase Auth, we can use this to store role/profile info.
-- For V1, we assume any authenticated user is an admin, or we check a specific email domain in code.
-- But standard practice is a profiles table.
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CATEGORIES
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EQUIPMENT
create table equipment (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category_id uuid references categories(id) on delete set null,
  total_quantity integer not null default 0 check (total_quantity >= 0),
  status text not null default 'available' check (status in ('available', 'maintenance')),
  image_url text, -- Optional but good for UI
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BOOKINGS
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  equipment_id uuid references equipment(id) on delete restrict not null,
  start_date date not null,
  end_date date not null,
  quantity integer not null check (quantity > 0),
  customer_name text not null, -- Manual entry by admin
  customer_email text, -- Optional
  customer_phone text, -- Optional
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraint: End date must be after or equal to start date
  constraint bookings_dates_check check (end_date >= start_date)
);

-- APP SETTINGS (for Buffer Days)
create table app_settings (
  key text primary key,
  value jsonb not null
);

-- SEED SETTINGS
insert into app_settings (key, value) values ('buffer_days', '1') on conflict do nothing;

-- INDEXES
create index idx_bookings_equipment_dates on bookings(equipment_id, start_date, end_date);
create index idx_bookings_status on bookings(status);
create index idx_equipment_category on equipment(category_id);

-- RLS POLICIES
-- For this V1 Admin-only system, we allow full access to authenticated users.
-- In a real multi-tenant app, we would check roles.

alter table profiles enable row level security;
alter table categories enable row level security;
alter table equipment enable row level security;
alter table bookings enable row level security;
alter table app_settings enable row level security;

-- Policies
create policy "Allow all access to authenticated users" on profiles for all using (auth.role() = 'authenticated');
create policy "Allow all access to authenticated users" on categories for all using (auth.role() = 'authenticated');
create policy "Allow all access to authenticated users" on equipment for all using (auth.role() = 'authenticated');
create policy "Allow all access to authenticated users" on bookings for all using (auth.role() = 'authenticated');
create policy "Allow all access to authenticated users" on app_settings for all using (auth.role() = 'authenticated');

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
