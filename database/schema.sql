-- Supabase schema for portfolio + tools + blog + admin

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text not null,
  image_url text,
  github_url text,
  live_url text,
  priority boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  platform text not null,
  description text not null,
  certificate_url text,
  image_url text,
  issue_date date not null,
  priority boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  cover_image text,
  published_at timestamptz not null default now()
);

create table if not exists site_settings (
  id int primary key default 1,
  hero_title text not null,
  hero_description text not null,
  about_me text,
  about_description text,
  skills text,
  core_focus text,
  github text,
  linkedin text,
  email text,
  resume_url text,
  profile_image_url text,
  constraint one_row check (id = 1)
);

alter table if exists projects add column if not exists priority boolean not null default false;
alter table if exists certificates add column if not exists priority boolean not null default true;

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

insert into site_settings (id, hero_title, hero_description, github, linkedin, email, resume_url)
values (
  1,
  'Build. Automate. Impact.',
  'CS student at Begum Rokeya University building AI automation tools, backend systems and digital products that solve real problems.',
  'https://github.com/rakibul-h',
  'https://linkedin.com/in/rakibul-hasan',
  'rakib@example.com',
  '/resume.pdf'
)
on conflict (id) do nothing;

-- Enable Row Level Security
alter table projects enable row level security;
alter table tools enable row level security;
alter table certificates enable row level security;
alter table blog_posts enable row level security;
alter table site_settings enable row level security;
alter table contact_messages enable row level security;

-- Public Read Policies (Allow anyone to view content)
create policy "public read projects" on projects for select to anon using (true);
create policy "public read tools" on tools for select to anon using (true);
create policy "public read certificates" on certificates for select to anon using (true);
create policy "public read blog_posts" on blog_posts for select to anon using (true);
create policy "public read site_settings" on site_settings for select to anon using (true);

create policy "authenticated read projects" on projects for select to authenticated using (true);
create policy "authenticated read tools" on tools for select to authenticated using (true);
create policy "authenticated read certificates" on certificates for select to authenticated using (true);
create policy "authenticated read blog_posts" on blog_posts for select to authenticated using (true);
create policy "authenticated read site_settings" on site_settings for select to authenticated using (true);

-- Admin/Service Role Policies (Allow management via service role key)
create policy "service role manage projects" on projects for all to service_role using (true) with check (true);
create policy "service role manage tools" on tools for all to service_role using (true) with check (true);
create policy "service role manage certificates" on certificates for all to service_role using (true) with check (true);
create policy "service role manage blog_posts" on blog_posts for all to service_role using (true) with check (true);
create policy "service role manage site_settings" on site_settings for all to service_role using (true) with check (true);

-- Contact Messages Policies
create policy "service role insert contact_messages" on contact_messages for insert to service_role with check (true);
create policy "service role read contact_messages" on contact_messages for select to service_role using (true);
