-- Holders: run this once in Supabase SQL Editor
-- RLS ON + no public grants: only the service role (server) can read/write.

create table if not exists public.users (
  id text primary key,
  username text unique not null,
  display_name text not null,
  bio text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_user_id_idx on public.posts (user_id);

alter table public.users enable row level security;
alter table public.posts enable row level security;

-- Revoke broad Data API access; app uses service role on the server.
revoke all on table public.users from anon, authenticated;
revoke all on table public.posts from anon, authenticated;

-- Seed sample collectors (safe to re-run)
insert into public.users (id, username, display_name, bio, avatar_url, created_at)
values
  (
    'user_kenji',
    'kenji.steel',
    'Kenji Nakamura',
    '機械式とシルバーリング。東京 / 銀座まわりで撮影。',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    '2026-01-05T09:00:00.000Z'
  ),
  (
    'user_marcus',
    'marcus.hold',
    'Marcus Hale',
    'Dive watches & chain bracelets. Less talk, more steel.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80',
    '2026-01-08T11:20:00.000Z'
  ),
  (
    'user_rio',
    'rio.cuff',
    'Rio Tanaka',
    'カフとシグネット。手元のディテールを集めています。',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80',
    '2026-01-12T14:40:00.000Z'
  )
on conflict (id) do nothing;

insert into public.posts (id, user_id, image_url, caption, created_at)
values
  (
    'post_1',
    'user_kenji',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1200&fit=crop&q=80',
    '朝の光に乗ったブラッシュドケース。今日の一振り。',
    '2026-03-01T02:10:00.000Z'
  ),
  (
    'post_2',
    'user_marcus',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200&h=1200&fit=crop&q=80',
    'Black dial, quiet flex. Weekend kit.',
    '2026-03-02T08:30:00.000Z'
  ),
  (
    'post_3',
    'user_rio',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=1200&fit=crop&q=80',
    'シルバーカフ。袖口から少しだけ見せるのが好み。',
    '2026-03-03T05:45:00.000Z'
  ),
  (
    'post_4',
    'user_kenji',
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1200&h=1200&fit=crop&q=80',
    'ゴールドとネイビー。夜のダイバー。',
    '2026-03-04T12:00:00.000Z'
  ),
  (
    'post_5',
    'user_marcus',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=1200&fit=crop&q=80',
    'Chain weight that sits right under the cuff.',
    '2026-03-05T16:20:00.000Z'
  ),
  (
    'post_6',
    'user_rio',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1200&h=1200&fit=crop&q=80',
    'シグネットリング。刻印はまだ内緒。',
    '2026-03-06T01:55:00.000Z'
  )
on conflict (id) do nothing;
