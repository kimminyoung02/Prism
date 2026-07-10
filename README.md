# Prism

AI가 여러 채널(블로그·유튜브)의 제품 리뷰를 모아 분석하고, 한 줄 결론과 장단점을 요약해주는 모바일 리뷰 분석 서비스입니다. 커뮤니티, 찜하기, 실시간 인기 검색어 등 소셜 기능을 갖춘 풀스택 애플리케이션입니다.

**Live Demo**: https://prism-app-neon.vercel.app

## 주요 기능

- **AI 리뷰 분석**: 제품명을 검색하면 네이버 블로그·유튜브 리뷰를 실시간 수집해 장단점/핵심 키워드/한 줄 결론으로 요약
- **Prism Lens**: 사진을 찍어 제품을 인식하고 바로 분석으로 연결
- **커뮤니티**: 카테고리별 게시판, 댓글/대댓글, 이미지 첨부, 좋아요·싫어요
- **찜하기(스크랩)**: 제품/리뷰를 저장하고 마이페이지에서 모아보기
- **실시간 인기 검색어**: 전체 사용자의 검색 기록을 집계해 랭킹 제공
- **계정**: 이메일/비밀번호 가입·로그인, 구글/카카오 소셜 로그인(Supabase Auth OAuth), 비밀번호 찾기(이메일 재설정), 프로필 사진 업로드
- 라이트/다크 모드, 반응형 모바일 UI(뉴모피즘 디자인)

## 기술 스택

| 영역 | 스택 |
|---|---|
| Frontend | Vite, React 19, TypeScript, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express 5, TypeScript |
| Database / Auth / Storage | Supabase (PostgreSQL, Row Level Security, Auth, Storage) |
| 외부 API | 네이버 검색 API(블로그/이미지), YouTube Data API v3 |
| 모바일 앱 | Flutter (Provider, go_router) — `frontend_flutter/` |
| 배포 | Vercel (Frontend + Backend 통합 배포) |

## 프로젝트 구조

```
Prism/
├── frontend/          # Vite + React 웹 앱
├── backend/           # Express API 서버 (네이버/유튜브 API 프록시)
├── frontend_flutter/  # Flutter 모바일 앱 (Android/iOS)
├── supabase/
│   └── schema.sql     # DB 테이블 · RLS 정책 · 트리거 · Storage 버킷 정의
└── vercel.json        # Frontend/Backend 통합 배포 설정
```

## 아키텍처

- 프론트엔드(React, Flutter 공통)는 Supabase 클라이언트를 통해 인증/DB/Storage에 직접 접근하며, Row Level Security로 사용자별 데이터를 보호합니다.
- 네이버·유튜브 API는 비밀 키가 필요해 Express 백엔드가 프록시 역할을 합니다.
- `posts`(게시글), `comments`(댓글/대댓글), `likes`(좋아요·싫어요), `scraps`(찜하기), `search_history`/`popular_searches`(검색 기록·인기 검색어), `users`(공개 프로필) 테이블로 구성되어 있으며 전체 스키마는 `supabase/schema.sql`에서 확인할 수 있습니다.

## 로컬 실행

### 1. 환경 변수

```bash
# backend/.env
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
YOUTUBE_API_KEY=...

# frontend/.env
VITE_API_BASE_URL=http://localhost:3001
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

각 워크스페이스의 `.env.example`을 참고하세요.

### 2. Supabase 프로젝트 준비

Supabase 프로젝트의 SQL Editor에서 `supabase/schema.sql`을 실행하면 테이블/정책/Storage 버킷이 모두 생성됩니다.

### 3. 실행

```bash
# 프론트엔드 (http://localhost:5173)
cd frontend
npm install
npm run dev

# 백엔드 (http://localhost:3001)
cd backend
npm install
npm run dev
```

### Flutter 앱

```bash
cd frontend_flutter
flutter pub get
flutter run
```

## 배포

- Frontend + Backend: Vercel `services` 설정으로 단일 프로젝트에서 통합 배포 (`vercel.json` 참고)
- Database/Auth/Storage: Supabase
