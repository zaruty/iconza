# ICONZA Web (Next.js)

App moderno em migração gradual. O HTML legacy permanece na **raiz do repositório**.

## Documentação

- Plano completo: [`../docs/MIGRACAO_NEXTJS.md`](../docs/MIGRACAO_NEXTJS.md)
- Banco: [`../SCHEMA.md`](../SCHEMA.md)
- Arquitetura legacy: [`../ARQUITETURA.md`](../ARQUITETURA.md)

## Setup

```bash
cd web
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_* (mesmo projeto do legacy)
npm install
npm run dev
```

Abrir: http://localhost:3000/pt/onboarding/diagnostico

### Testar com login legacy

1. `npm run dev` em `web/`
2. No console do browser (em `login.html` ou após login):  
   `localStorage.setItem('iconza_use_next_onboarding','true')`
3. Faça login — redireciona para `/pt/onboarding/diagnostico`

Ou ative redirect automático de `diagnostico.html` com  
`NEXT_PUBLIC_USE_NEXT_ONBOARDING=true` no `.env.local`.

## Rotas

| Rota | Status |
|------|--------|
| `/pt/onboarding/diagnostico` | Placeholder — Etapa 3 |
| `/pt/onboarding` | Placeholder — Etapa 3 |
| `/pt/app` | Placeholder — Etapa 4 |
| `/pt/app/universos` | Placeholder — Etapa 5 |

## Deploy (Vercel)

- **Opção A:** Projeto separado, root = `web/`
- **Opção B:** Monorepo com rewrites do domínio principal para rotas `/pt/*`

Não remover páginas `.html` até redirect ativo em `next.config.ts`.
