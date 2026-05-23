# iconza

Plataforma educacional ICONZA.

## Estrutura do repositório

| Pasta | Descrição |
|-------|-----------|
| `/` (raiz) | **Legacy** — HTML/JS/CSS em produção (`iconza.vercel.app`) |
| `web/` | **Next.js** — migração gradual (App Router + TypeScript) |
| `docs/` | Planos técnicos (`MIGRACAO_NEXTJS.md`) |

## Migração Next.js

Ver [`docs/MIGRACAO_NEXTJS.md`](docs/MIGRACAO_NEXTJS.md) e [`web/README.md`](web/README.md).

```bash
cd web && cp .env.example .env.local && npm install && npm run dev
```
