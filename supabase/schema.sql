-- Prism Supabase schema
-- Supabase 프로젝트 SQL Editor에서 실행. (Project → SQL Editor → New query → 붙여넣고 Run)
-- 전체가 재실행 가능(idempotent)하도록 작성됨 — 스키마가 바뀔 때마다 전체를 다시 실행해도 안전함.

create extension if not exists "pgcrypto";

-- ===================================================================
-- users: auth.users 확장 프로필 (닉네임 / 프로필 이미지)
-- 이메일은 여기 저장하지 않음 — auth.users에만 있고, 클라이언트는 로그인 세션(user.email)으로 조회.
-- 이 테이블은 다른 사용자에게도 공개 조회되므로(게시글/댓글 작성자 표시용) 이메일 같은 개인정보는 넣지 않음.
-- ===================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default 'prism_user',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

drop policy if exists "users are publicly readable" on public.users;
create policy "users are publicly readable"
  on public.users for select
  using (true);

drop policy if exists "users can update own row" on public.users;
create policy "users can update own row"
  on public.users for update
  using (auth.uid() = id);

-- 신규 가입 시 public.users 행 자동 생성.
-- 이메일 가입은 raw_user_meta_data.nickname만 있고, 카카오/구글 OAuth는
-- 각 provider가 넘겨주는 필드명이 달라서 순서대로 폴백함.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'nickname',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===================================================================
-- search_history: 검색 기록
-- ===================================================================
create table if not exists public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  query text not null,
  searched_at timestamptz not null default now()
);

create index if not exists search_history_user_id_idx on public.search_history(user_id, searched_at desc);

alter table public.search_history enable row level security;

drop policy if exists "users manage own search history" on public.search_history;
create policy "users manage own search history"
  on public.search_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===================================================================
-- popular_searches: 인기 검색어 집계용 (검색어 / 검색횟수)
-- ===================================================================
create table if not exists public.popular_searches (
  query text primary key,
  search_count integer not null default 0,
  last_searched_at timestamptz not null default now()
);

alter table public.popular_searches enable row level security;

drop policy if exists "popular searches are publicly readable" on public.popular_searches;
create policy "popular searches are publicly readable"
  on public.popular_searches for select
  using (true);

-- search_history에 새 행이 쌓일 때마다 집계 테이블 갱신 (클라이언트는 직접 쓰기 불가, 트리거로만 갱신)
create or replace function public.bump_popular_search()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.popular_searches (query, search_count, last_searched_at)
  values (new.query, 1, new.searched_at)
  on conflict (query)
  do update set
    search_count = public.popular_searches.search_count + 1,
    last_searched_at = excluded.last_searched_at;
  return new;
end;
$$;

drop trigger if exists on_search_history_insert on public.search_history;
create trigger on_search_history_insert
  after insert on public.search_history
  for each row execute function public.bump_popular_search();

-- ===================================================================
-- scraps: 스크랩/찜 (제품 또는 리뷰)
-- ===================================================================
create table if not exists public.scraps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  item_type text not null check (item_type in ('product', 'review')),
  ref_id text not null, -- 원본 항목 식별자 (예: product:질문, 또는 외부 리뷰 id)
  title text not null,
  subtitle text,
  query text,   -- product 타입: /result 재검색용 검색어
  rating numeric, -- product 타입: AI 종합 별점
  url text,     -- review 타입: 원문 링크
  source text check (source in ('blog', 'youtube', 'community')),
  created_at timestamptz not null default now(),
  unique (user_id, ref_id)
);

create index if not exists scraps_user_id_idx on public.scraps(user_id, created_at desc);

alter table public.scraps enable row level security;

drop policy if exists "users manage own scraps" on public.scraps;
create policy "users manage own scraps"
  on public.scraps for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===================================================================
-- posts: 커뮤니티 게시글
-- ===================================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id) on delete cascade,
  category text not null check (category in ('자유수다', '코디 추천', '질문')),
  title text not null,
  content text not null,
  view_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts(created_at desc);

alter table public.posts enable row level security;

drop policy if exists "posts are publicly readable" on public.posts;
create policy "posts are publicly readable"
  on public.posts for select
  using (true);

drop policy if exists "authenticated users can create posts" on public.posts;
create policy "authenticated users can create posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "authors manage own posts" on public.posts;
create policy "authors manage own posts"
  on public.posts for update
  using (auth.uid() = author_id);

drop policy if exists "authors delete own posts" on public.posts;
create policy "authors delete own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- 조회수 증가는 작성자가 아닌 누구나 할 수 있어야 하므로 security definer 함수로 우회
create or replace function public.increment_post_view(post_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.posts set view_count = view_count + 1 where id = post_id;
end;
$$;

grant execute on function public.increment_post_view(uuid) to authenticated, anon;

-- ===================================================================
-- comments: 댓글/대댓글 (게시글 또는 리뷰 대상)
-- ===================================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'review')),
  target_id text not null, -- posts.id(uuid 문자열) 또는 외부 리뷰 id
  author_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  reply_to_author text, -- 대댓글 UI에 쓰이는 "@닉네임" 표시용 (parent_comment_id 작성자의 닉네임 스냅샷)
  created_at timestamptz not null default now()
);

create index if not exists comments_target_idx on public.comments(target_type, target_id, created_at);

alter table public.comments enable row level security;

drop policy if exists "comments are publicly readable" on public.comments;
create policy "comments are publicly readable"
  on public.comments for select
  using (true);

drop policy if exists "authenticated users can write comments" on public.comments;
create policy "authenticated users can write comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

drop policy if exists "authors manage own comments" on public.comments;
create policy "authors manage own comments"
  on public.comments for update
  using (auth.uid() = author_id);

drop policy if exists "authors delete own comments" on public.comments;
create policy "authors delete own comments"
  on public.comments for delete
  using (auth.uid() = author_id);

-- 게시글 사진 첨부용 (없으면 null)
alter table public.posts add column if not exists image_url text;

-- ===================================================================
-- likes: 좋아요/싫어요 (리뷰/게시글/댓글 공용)
-- ===================================================================
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'review', 'comment')),
  target_id text not null, -- posts.id, 외부 리뷰 id, 또는 comments.id
  vote_type text not null check (vote_type in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index if not exists likes_target_idx on public.likes(target_type, target_id);

alter table public.likes enable row level security;

drop policy if exists "likes are publicly readable" on public.likes;
create policy "likes are publicly readable"
  on public.likes for select
  using (true);

drop policy if exists "users manage own likes" on public.likes;
create policy "users manage own likes"
  on public.likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ===================================================================
-- storage: 프로필 사진 / 게시글 첨부 이미지
-- 경로 규칙: {user_id}/avatar-*.* , {user_id}/post-*.*  (RLS가 첫 폴더로 소유자 확인)
-- ===================================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images are publicly readable" on storage.objects;
create policy "images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'images');

drop policy if exists "users can upload own images" on storage.objects;
create policy "users can upload own images"
  on storage.objects for insert
  with check (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "users can update own images" on storage.objects;
create policy "users can update own images"
  on storage.objects for update
  using (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "users can delete own images" on storage.objects;
create policy "users can delete own images"
  on storage.objects for delete
  using (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);
