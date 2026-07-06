# Prism

## 기술 스택

- `frontend/` — Vite + React + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite` 플러그인 사용, PostCSS 설정 없음)
- `backend/` — Node.js + Express 5 + TypeScript, CommonJS 빌드 (`tsx watch` 로 개발, `tsc` 로 빌드)

## 개발 명령

```bash
# frontend (http://localhost:5173)
cd frontend && npm run dev

# backend (http://localhost:3001)
cd backend && npm run dev
```

## 환경

- Windows, Node.js는 `%LOCALAPPDATA%\Programs\nodejs` 에 무권한(zip 압축 해제) 설치되어 있고 사용자 PATH에 등록됨 (관리자 권한 MSI 설치 아님).
- 새 셸에서 `node`/`npm` 이 안 잡히면 PATH 갱신이 반영 안 된 세션이니 새 터미널을 열거나 `$env:Path` 에 위 경로를 추가해서 사용.

## 규칙

- 백엔드 API 라우트는 `backend/src` 아래에 추가. 헬스체크: `GET /api/health`.
- 신규 npm 패키지는 반드시 해당 워크스페이스(`frontend` 또는 `backend`) 안에서 설치.
