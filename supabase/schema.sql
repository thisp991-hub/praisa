-- Praisa Database Schema
-- Run this in your Supabase SQL editor to set up the required tables.

-- Business profiles table
create table if not exists business_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  business_name text not null,
  business_slug text unique not null,
  google_review_link text,
  created_at timestamptz default now() not null,
  unique(user_id)
);

-- Feedbacks table
create table if not exists feedbacks (
  id uuid default gen_random_uuid() primary key,
  business_slug text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  feedback_text text,
  name text,
  email text,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table business_profiles enable row level security;
alter table feedbacks enable row level security;

-- Business profiles: users can only access their own profile
create policy "Users can view own profile"
  on business_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on business_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on business_profiles for update
  using (auth.uid() = user_id);

-- Feedbacks: anyone can insert (public feedback page), owners can view
create policy "Anyone can submit feedback"
  on feedbacks for insert
  with check (true);

create policy "Business owners can view their feedback"
  on feedbacks for select
  using (
    exists (
      select 1 from business_profiles
      where business_profiles.business_slug = feedbacks.business_slug
      and business_profiles.user_id = auth.uid()
    )
  );

-- Public read access for business profiles (needed for feedback page)
create policy "Anyone can view business profiles by slug"
  on business_profiles for select
  using (true);

-- Saved AI replies table
create table if not exists saved_replies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  review_text text not null,
  reply_text text not null,
  tone text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS for saved replies
alter table saved_replies enable row level security;

-- Saved replies: users can only manage their own replies
create policy "Users can view own replies"
  on saved_replies for select
  using (auth.uid() = user_id);

create policy "Users can insert own replies"
  on saved_replies for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own replies"
  on saved_replies for delete
  using (auth.uid() = user_id);

-- Index for faster slug lookups
create index if not exists idx_feedbacks_business_slug on feedbacks(business_slug);
create index if not exists idx_business_profiles_slug on business_profiles(business_slug);
create index if not exists idx_business_profiles_user_id on business_profiles(user_id);
create index if not exists idx_saved_replies_user_id on saved_replies(user_id);
