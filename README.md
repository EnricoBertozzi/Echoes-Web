# Echoes-Web

Painel administrativo do projeto **Echoes** (simulador canino de ausculta
pulmonar e cardíaca para ensino veterinário).

## Stack

React 19 · React Router v8 (modo framework) · TypeScript estrito · Vite 8 +
`@tailwindcss/vite` (Tailwind v4) · axios · clsx · react-icons · radix-ui ·
vite-plugin-svgr.

## Decisão assumida

O combinado não define explicitamente em qual página do dashboard fica o
CRUD de instituições — apenas lista as moléculas
(`AddInstitutionModal`, `EditInstitutionModal`, `InstitutionTableRow`).
Como a rota `pages/dashboard/school/index.tsx` é a única semanticamente
compatível ("instituição de ensino"), a listagem/CRUD completo de
instituições foi implementado ali. As demais páginas do dashboard
(`devices`, `terms`, `audit`, `settings`, `users`, `scene`) foram deixadas
como stubs no mesmo design system, prontas para receber as próximas
features — o combinado não trouxe modelos/endpoints para elas.

## Rodando localmente

```bash
npm install
npm run dev
```

A API é esperada em `http://localhost:8080` (ver `app/api/client.ts`).

## Build e Docker

```bash
npm run build
docker build -t echoes-web .
docker run -p 3000:3000 echoes-web
```

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (client + server)
- `npm run start` — sobe o build via `@react-router/serve`
- `npm run typecheck` — gera os tipos de rota e roda `tsc`
