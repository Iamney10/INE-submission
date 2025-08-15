# Mini Auction (Real-Time)

## Quick start (local)
1) Copy `.env.example` to `apps/server/.env` (or root `.env`) and fill values.
2) Install deps: `corepack enable && pnpm i`
3) Dev: `pnpm dev`
4) Visit http://localhost:5173 (Vite) and backend on http://localhost:8080

## Build & run single server (serves frontend)
- `pnpm build`
- `pnpm start` → visit http://localhost:8080

## Deploy on Render
- Create a **Web Service** from this repo.
- Build Command: `pnpm build`
- Start Command: `pnpm start`
- Add env vars (DATABASE_URL, REDIS_URL, SENDGRID_API_KEY, FROM_EMAIL, PUBLIC_URL, JWT_SECRET)
