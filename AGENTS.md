# a-donde — Agent Instructions

## Stack
- Next.js 16 (App Router), React 19, Tailwind CSS 4
- MySQL via `mysql2/promise` (raw SQL, no ORM)
- Auth: bcryptjs + jose (JWT HS256) + refresh tokens in DB
- Validation: Zod

## Setup
```bash
npm install
npm run dev

Generate `AUTH_SECRET`: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build → `.next/` |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (flat config, next/core-web-vitals + TS) |
| `npx tsc --noEmit` | Type check (strict mode) |

No test framework configured.

## Database
- Connection pool in `lib/db.ts` (limit 5, SSL auto-enabled for non-localhost hosts)
- Models in `models/` — hand-written SQL via `pool.query()`
- Schema & seed scripts in `scripts/` (SQL files + JS migration helpers)

## Auth architecture
- **Login flow**: Zod validate → `bcrypt.compare` → `jose.SignJWT` (HS256, 15min) → `crypto.randomBytes(64)` refresh token → store in `sesiones` table → set httpOnly cookies (`access_token` path `/`, `refresh_token` path `/api/auth`)
- **Middleware** (`middleware.ts`): Protects `/api/*`, `/perfil/*`, `/admin/*`. Public routes: `/login`, `/register`, `/`, `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/productos/buscar`, `/api/lugares`. Verifies access_token cookie with `jose.jwtVerify`, injects `x-user-id`/`x-user-email` headers.
- **Model layer** (`models/sesion.ts`): Sessions stored in `sesiones` table (`id`, `usuario_id`, `refresh_token`, `expires_at`, `created_at`). `refresh_token VARCHAR(128) NOT NULL UNIQUE`.

## API conventions
All routes respond with `{ success: boolean, data?: ..., error?: string }` (helpers in `lib/utils.ts`).

## Netlify deployment
Configured via `netlify.toml` + `@netlify/plugin-nextjs`.

## Framework quirks
- `next.config.ts` has `serverExternalPackages: ["mysql2"]` — mysql2 stays server-side
- `allowedDevOrigins` configured for LAN access on several IPs
- `eslint.config.mjs` is flat config (not `.eslintrc`)
- PostCSS with `@tailwindcss/postcss` (Tailwind v4)
