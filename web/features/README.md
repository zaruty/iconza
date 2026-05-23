# Features (domínios)

Cada pasta agrupa hooks, componentes e server actions de um domínio.

| Pasta | Legacy | Prioridade |
|-------|--------|------------|
| `onboarding/` | diagnostico.html, onboarding.html | **P0** |
| `dashboard/` | dashboard.html | **P1** |
| `gamification/` | (novo) | **P1** |
| `universos/` | (novo) | **P2** |
| `auth/` | login.html | P3 |
| `comunidade/` | comunidade.html, iconza-feed.js | P4 |
| `ai/` | prompts admin | P5 |

Regra: `features/*` pode importar `lib/*` e `components/*`, nunca o contrário.
