# ICONZA — Plano de migração gradual para Next.js

> **Princípio:** coexistência. O site estático atual continua no ar; o app Next.js cresce em `web/` até substituir rota a rota.
> **Última revisão:** maio/2026

---

## 1. Arquitetura ideal (visão geral)

### Coexistência em produção

```
iconza.vercel.app/
├── /                    → legacy (index.html) até migrar marketing
├── /login.html          → legacy (fase 1–2)
├── /diagnostico.html    → legacy → redirect para /onboarding (fase 3)
├── /dashboard.html      → legacy → redirect para /app (fase 4)
└── /app/*               → Next.js (novo) — prioridade: onboarding, dashboard, universos
```

**Deploy recomendado (Vercel):**
- Projeto único com `web/` como **Root Directory** em preview branches; ou
- Dois projetos: `iconza-legacy` (raiz) + `iconza-web` (`web/`) com rewrites no domínio principal.

### Camadas do app Next.js

```
┌─────────────────────────────────────────────────────────────┐
│  app/          Rotas, layouts, metadata, i18n por segmento   │
├─────────────────────────────────────────────────────────────┤
│  features/     Domínios: onboarding, dashboard, gamification │
├─────────────────────────────────────────────────────────────┤
│  components/   UI pura (design system) + layout (shell)     │
├─────────────────────────────────────────────────────────────┤
│  lib/          Supabase, auth helpers, utils, AI (futuro)    │
├─────────────────────────────────────────────────────────────┤
│  types/        Tipos gerados do Supabase + domínio         │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
   Supabase (mesmo projeto, mesmo schema, mesmas RLS)
```

### O que NÃO muda na migração

| Item | Decisão |
|------|---------|
| Banco Supabase | Mesmo projeto, `SCHEMA.md` continua fonte da verdade |
| Auth | Email/senha + Google OAuth; mesma tabela `profiles` |
| Fluxo onboarding | Diagnóstico → CRM → `onboarding_completo` |
| Regras de redirect | Espelhar `login.html` → `redirecionarAposLogin()` |
| Realtime | Feed/comunidade quando migrar; mesmas tabelas |

### O que evolui

| Item | De | Para |
|------|-----|------|
| Shell | `IconzaLayout` JS | `app/(app)/layout.tsx` + `<AppShell />` |
| Tokens | `iconza-tokens.css` | `tailwind.config.ts` + CSS variables |
| Auth guard | `IconzaAuth.requireUser()` | Middleware + `lib/auth/session.ts` |
| Páginas | `.html` monolítico | `app/**/page.tsx` + `features/*/components` |

---

## 2. Estrutura de pastas (`web/`)

```
web/
├── app/
│   ├── layout.tsx                 # Root: fonts, providers, i18n
│   ├── globals.css                # Tokens + Tailwind base
│   ├── (public)/                  # Sem auth obrigatória
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Marketing (futuro: index.html)
│   │   └── login/page.tsx         # Fase 2
│   ├── (onboarding)/              # Fluxo guiado, layout minimal
│   │   ├── layout.tsx
│   │   ├── diagnostico/page.tsx   # Fase 3 — prioridade
│   │   └── onboarding/page.tsx    # Fase 3
│   └── (app)/                     # Área logada (shell + sidebar)
│       ├── layout.tsx             # AppShell, require session
│       ├── page.tsx               # Dashboard — Fase 4
│       ├── universos/
│       │   ├── page.tsx           # Lista — Fase 5
│       │   └── [slug]/page.tsx
│       └── comunidade/page.tsx    # Fase posterior
│
├── components/
│   ├── ui/                        # Design system (Button, Card, Tag…)
│   ├── layout/                    # AppShell, Sidebar, Topbar, PageHeader
│   └── brain/                     # BrainCanvas (de iconza-brain.js)
│
├── features/
│   ├── auth/                      # Login forms, session hooks
│   ├── onboarding/                # Quiz diagnóstico, steps CRM
│   ├── dashboard/                 # Widgets, welcome, continue learning
│   ├── gamification/              # XP, badges, streaks (fase 5+)
│   ├── universos/                 # Catálogo de cursos
│   ├── comunidade/                # Feed (fase posterior)
│   └── ai/                        # Stubs + tipos para IA futura
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server Components / Actions
│   │   └── middleware.ts          # refreshSession helper
│   ├── auth/
│   │   ├── session.ts
│   │   ├── guards.ts              # requireUser, requireAdmin, requireOnboarding
│   │   └── redirects.ts           # espelha login.html
│   ├── i18n/
│   │   ├── config.ts
│   │   └── request.ts
│   └── utils/                     # tempoRelativo, avatar (de core-utils.js)
│
├── messages/                      # next-intl: pt, en, it, es, fr
│   ├── pt.json
│   └── en.json
│
├── types/
│   ├── database.ts                # supabase gen types
│   └── domain.ts                  # Profile, NivelCreativo, etc.
│
├── middleware.ts                  # Auth refresh + locale + onboarding gate
├── tailwind.config.ts
└── next.config.ts
```

---

## 3. Arquitetura de componentes

### Regra de dependência (unidirecional)

```
app/  →  features/  →  components/ui
              ↓
            lib/
```

- **`components/ui`**: sem Supabase, sem `useRouter`; só props.
- **`components/layout`**: shell; recebe `user` e `nav` por props.
- **`features/*`**: lógica de domínio, hooks, chamadas Supabase no client ou server actions.
- **`app/*`**: composição fina; busca dados no server quando possível.

### Mapa legacy → React

| Legacy | Destino React |
|--------|----------------|
| `iconza-layout.js` | `components/layout/app-shell.tsx` |
| `iconza-sidebar.js` | `components/layout/sidebar.tsx` + `lib/navigation.ts` |
| `iconza-icons.js` | `components/ui/icon.tsx` (lucide-react ou SVG inline) |
| `iconza-brain.js` | `components/brain/brain-canvas.tsx` |
| `iconza-card.js` | `components/ui/post-card.tsx`, `course-card.tsx` |
| `iconza-feed.js` | `features/comunidade/feed.tsx` |
| `core-auth.js` | `lib/auth/*` + `middleware.ts` |
| `core-utils.js` | `lib/utils/*` |
| `diagnostico.html` | `features/onboarding/diagnostico/*` |
| `onboarding.html` | `features/onboarding/crm-form/*` |
| `dashboard.html` | `features/dashboard/*` |

---

## 4. Design system reutilizável

### Fonte de verdade visual

1. **`iconza-tokens.css`** (legacy) → espelhado em `tailwind.config.ts` `theme.extend.colors`
2. **`app/globals.css`** → `@layer` + CSS variables para runtime (tema escuro futuro)
3. **`components/ui/*`** → variantes com `class-variance-authority` (opcional)

### Tokens críticos a portar primeiro

- Canvas: `bg-canvas`, `bg-soft`
- Ink: `ink`, `ink-muted`
- Sidebar: `side-from` … `side-to`
- Brand: `accent`, `gold`, `green`
- 7 níveis: `nivel-1` … `nivel-7` (gamificação + diagnóstico)
- Espaçamento: escala `--space-*` → `spacing` no Tailwind

### Mobile-first

- Sidebar: drawer abaixo de `lg` (como `IconzaSidebar.toggle()`)
- Touch targets ≥ 44px
- `100dvh` para shell (já usado no dashboard legacy)
- Tipografia fluida com `clamp()` nos headings de marketing

---

## 5. Ordem de migração das páginas HTML

### Tier 0 — Infra (esta etapa)

- Scaffold `web/`, env, Supabase clients, middleware esqueleto, tokens Tailwind

### Tier 1 — Onboarding (prioridade máxima)

| Arquivo | Motivo |
|---------|--------|
| `diagnostico.html` | Fluxo isolado, sem shell; UX autocontida; define gamificação inicial |
| `onboarding.html` | Form CRM; grava `profiles`; completa flag |

**Risco baixo:** não depende da sidebar; poucas integrações.

### Tier 2 — Dashboard

| Arquivo | Motivo |
|---------|--------|
| `dashboard.html` | Primeira página logada com shell; valida AppShell + auth |

**Depende de:** Tier 1 completo (gate `onboarding_completo`).

### Tier 3 — Universos

| Páginas | Motivo |
|---------|--------|
| Novas rotas `/app/universos` | Schema `cursos` já existe; sidebar já linka |

**Nota:** `universos.html` não existe no repo — criar direto em Next.

### Tier 4 — Auth pública

| Arquivo | Motivo |
|---------|--------|
| `login.html` | Crítico; migrar com redirects e OAuth testados |
| `sair.html` | Rota `/auth/signout` |

### Tier 5 — Comunidade e perfil

| Arquivo | Motivo |
|---------|--------|
| `comunidade.html` | Realtime + feed já modular (`iconza-feed.js`) |
| `perfil.html`, `u.html` | Perfis |

### Tier 6 — Admin e marketing

| Arquivo | Motivo |
|---------|--------|
| `admin-crm.html` | Monolito grande; último ou app separado `(admin)` |
| `index.html` | Marketing; pode ficar legacy por mais tempo |

---

## 6. Estratégia gradual sem quebrar o sistema

### Princípios

1. **Nenhum arquivo legacy removido** até a rota Next estar em produção com redirect 301.
2. **Mesma sessão Supabase:** cookie compartilhado se mesmo domínio (`iconza.vercel.app`).
3. **Feature flags:** `NEXT_PUBLIC_USE_NEXT_ONBOARDING=true` para linkar login → `/onboarding` vs `.html`.
4. **Redirects no `next.config.ts`:** preparados mas comentados até go-live por rota.
5. **Tipos do banco:** `supabase gen types` uma vez; não duplicar schema.

### Fluxo de cutover por rota

```
1. Implementar rota Next em preview
2. Testar auth + dados reais
3. Ativar redirect legacy → Next
4. Monitorar 1 semana
5. Marcar HTML como deprecated (comentário no topo)
```

### Compatibilidade de dados

- Diagnóstico legacy usa `localStorage.iconza_diagnostico` → Next deve **ler e migrar** na primeira visita.
- `onboarding_completo` permanece a única flag de conclusão.

---

## 7. Plano técnico por etapas

### Etapa 0 — Fundação (atual)

- [x] Documento de migração
- [x] Scaffold `web/` (App Router, TS, Tailwind)
- [ ] `.env.local` com chaves Supabase (não commitar)
- [ ] `supabase gen types` → `types/database.ts`

### Etapa 1 — Auth + middleware (1 sprint)

- Client/server Supabase (`@supabase/ssr`)
- `middleware.ts`: refresh session, locale prefix
- `lib/auth/redirects.ts` espelhando `redirecionarAposLogin`
- Página stub `/login` (opcional; login pode ficar legacy mais tempo)

### Etapa 2 — Design system (paralelo)

- Portar tokens para Tailwind
- `Button`, `Card`, `Tag`, `PageHeader`, `LoadingOverlay`
- `AppShell` + `Sidebar` (paridade com `iconza-sidebar.js` NAV_ALUNA)

### Etapa 3 — Onboarding (prioridade)

- `/onboarding/diagnostico` — steps, 7 níveis, save profile + localStorage bridge
- `/onboarding` — CRM multi-step
- Gate: sem `onboarding_completo` → não entra em `(app)`

### Etapa 4 — Dashboard

- `/app` — widgets: boas-vindas, brain preview, progresso, atalhos
- Integração gamificação mínima (placeholder XP)

### Etapa 5 — Gamificação + Universos

- Tabelas `conquistas` (quando criadas no Supabase)
- `/app/universos` — lista `cursos` publicados
- `/app/universos/[slug]` — detalhe

### Etapa 6 — i18n completo

- `next-intl` com locales `pt`, `en`, `it`, `es`, `fr` (alinhado a `profiles.idioma`)
- Middleware de locale + persistência no perfil

### Etapa 7 — Comunidade, IA, Admin

- Feed, Edge Functions para IA, admin em route group separado

---

## 8. Separação de responsabilidades

| Área | Local | Conteúdo |
|------|-------|----------|
| **Componentes reutilizáveis** | `components/ui`, `components/brain` | Button, Card, Icon, BrainCanvas |
| **Layouts** | `components/layout`, `app/**/layout.tsx` | AppShell, Sidebar, Topbar, onboarding layout |
| **Páginas** | `app/**/page.tsx` | Só composição e data fetching |
| **Auth** | `lib/auth`, `middleware.ts`, `features/auth` | Session, guards, forms |
| **Supabase** | `lib/supabase` | Clients; sem lógica de UI |
| **Gamificação** | `features/gamification` | XP, badges, hooks; tabelas futuras |
| **Onboarding** | `features/onboarding` | Diagnóstico + CRM |
| **Dashboard** | `features/dashboard` | Widgets e server loaders |
| **Universos** | `features/universos` | Cursos, matrículas |
| **IA (futuro)** | `features/ai` | Tipos, stubs, `lib/ai/client.ts` |
| **Comunidades (futuro)** | `features/comunidade` | Feed, grupos |

---

## 9. Multilíngue

- **Biblioteca:** `next-intl`
- **URLs:** `/pt/app`, `/en/app` ou cookie + default `pt`
- **Fonte:** `profiles.idioma` após login
- **Mensagens:** `messages/{locale}.json`; chaves por feature (`dashboard.title`)

---

## 10. Preparação IA e gamificação

### Gamificação (interfaces desde já)

```ts
// types/domain.ts
interface GamificationState {
  xp: number;
  level: number;
  streakDays: number;
  achievements: string[];
  creativeLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7; // diagnóstico
}
```

### IA (stubs)

- `features/ai/types.ts` — `AiSession`, `AiMessage`
- `lib/ai/client.ts` — chama Edge Function (implementar depois)
- Nunca expor API keys no `NEXT_PUBLIC_*`

---

## 11. Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Opcional servidor:
SUPABASE_SERVICE_ROLE_KEY=  # só server actions admin
```

---

## 12. Checklist antes de cada PR de migração

- [ ] Legacy ainda funciona na mesma URL
- [ ] Redirect documentado em `next.config.ts`
- [ ] RLS testado com usuária aluna e admin
- [ ] Mobile: sidebar drawer + touch
- [ ] `onboarding_completo` respeitado
- [ ] SCHEMA.md atualizado se nova coluna/tabela

---

**Próximo passo de implementação:** Etapa 1 (Supabase SSR + middleware) + Etapa 3 (diagnóstico em React), sem remover `diagnostico.html`.
