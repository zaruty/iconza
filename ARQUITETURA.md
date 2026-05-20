# 🏛️ ICONZA — Arquitetura Visual e Estrutural

> **Última atualização:** 19 de maio de 2026
> **Status:** Layout base consolidado · Pronto para Next.js futuro

Este documento é o **mapa mental** da arquitetura. Sempre que criar algo novo, consulte aqui primeiro para decidir onde mora.

---

## 🧠 MODELO MENTAL — 3 Camadas

```
┌─────────────────────────────────────────────────┐
│                    SHELL                         │  ← Casca persistente
│         IconzaLayout (sidebar + topbar)         │     (não muda entre páginas)
├─────────────────────────────────────────────────┤
│              CONTEÚDO ÚNICO                      │  ← Específico de cada página
│         <main id="iconza-content">              │     (muda em cada rota)
├─────────────────────────────────────────────────┤
│         COMPONENTES REUTILIZÁVEIS                │  ← Pedaços que aparecem
│   IconzaFeed, IconzaCard, IconzaBrain, etc.    │     em vários lugares
└─────────────────────────────────────────────────┘
```

---

## 📂 ESTRUTURA DE ARQUIVOS — Estado Atual

```
iconza/
│
├── 📄 PÁGINAS (telas completas)
│   ├── index.html              ← homepage pública
│   ├── login.html              ← entrada
│   ├── sair.html               ← saída limpa
│   ├── diagnostico.html        ← quiz cérebro
│   ├── onboarding.html         ← CRM inicial
│   ├── dashboard.html          ← boas-vindas (LOGADA)
│   ├── comunidade.html         ← feed social
│   ├── admin-crm.html          ← painel admin
│   ├── perfil.html             ← perfil privado
│   ├── u.html                  ← perfil público
│   └── _template.html          ← BASE para novas páginas
│
├── ⚙️ CORE (lógica compartilhada)
│   ├── core-supabase.js        ← cliente Supabase único
│   ├── core-auth.js            ← autenticação centralizada
│   └── core-utils.js           ← helpers (formatadores, avatar, toast)
│
├── 🧩 COMPONENTES (LEGOs reutilizáveis)
│   ├── iconza-layout.js        ← SHELL (sidebar + topbar) ⭐ NOVO
│   ├── iconza-sidebar.js       ← navegação lateral
│   ├── iconza-icons.js         ← biblioteca SVG
│   ├── iconza-brain.js         ← cérebro procedural
│   ├── iconza-card.js          ← cards (post, curso)
│   └── iconza-feed.js          ← motor da comunidade
│
├── 🎨 DESIGN SYSTEM (visual)
│   ├── iconza-tokens.css       ← variáveis (cores, fontes, espaços)
│   ├── iconza-base.css         ← reset, tipografia, botões
│   ├── iconza-sidebar.css      ← sidebar editorial
│   ├── iconza-dashboard.css    ← específico dashboard
│   └── iconza-comunidade.css   ← específico comunidade
│
├── 📚 DOCUMENTAÇÃO
│   ├── SCHEMA.md               ← mapa do banco
│   ├── ARQUITETURA.md          ← este documento
│   └── GUIA_NEXTJS_FUTURO.md   ← plano de migração
│
└── 🖼️ ASSETS
    └── coroa.png               ← logo oficial
```

---

## 🎯 REGRA DE OURO — Onde colocar o quê?

| Pergunta | Resposta |
|---|---|
| "Vai usar em múltiplas páginas" | `/components/` ou `/core/` |
| "É único de uma página" | Inline no HTML da página |
| "É lógica de banco" | `/core/` |
| "É visual reutilizável" | `/components/` |
| "É variável de design" | `iconza-tokens.css` |
| "É CSS de componente reutilizável" | `iconza-NOME.css` |
| "É CSS único de página" | `iconza-PAGINA.css` ou inline |

---

## 🆕 COMO CRIAR UMA PÁGINA NOVA

**Antes (modo antigo):** copiar 200 linhas de boilerplate de outra página.

**Agora:** 3 passos.

```bash
# 1) Copiar template
cp _template.html minha-pagina.html

# 2) Editar título e conteúdo
# (só mexe no <main id="iconza-content">)

# 3) Commit
git add minha-pagina.html
git commit -m "feat: nova página X"
git push
```

O `IconzaLayout.app()` cuida automaticamente de:
- ✅ Verificar login
- ✅ Renderizar sidebar com role correto
- ✅ Detectar página ativa pela URL
- ✅ Renderizar topbar
- ✅ Marcar notificações
- ✅ Esconder loading

---

## 🧩 INVENTÁRIO DE COMPONENTES

### **Componentes "Shell" (estrutura)**

| Componente | Função | Equivalente Next.js |
|---|---|---|
| `IconzaLayout.app()` | Monta shell completo logado | `app/(app)/layout.tsx` |
| `IconzaLayout.public()` | Layout sem sidebar (público) | `app/(public)/layout.tsx` |
| `IconzaSidebar.render()` | Sidebar editorial dark | `<Sidebar />` component |

### **Componentes de Conteúdo (UI)**

| Componente | Função | Equivalente React |
|---|---|---|
| `IconzaCard.post()` | Card de post no feed | `<PostCard />` |
| `IconzaCard.curso()` | Card de curso | `<CourseCard />` |
| `IconzaFeed.init()` | Motor do feed + realtime | `<Feed />` + `useRealtime` |
| `IconzaBrain()` | Cérebro procedural SVG | `<BrainCanvas />` |
| `window.icon(name)` | Ícone SVG inline | `<Icon name="..." />` |

### **Lógica (services / hooks)**

| Função | O que faz | Equivalente React |
|---|---|---|
| `IconzaAuth.requireUser()` | Protege rota | `useUser()` hook |
| `IconzaAuth.requireAdmin()` | Protege rota admin | `useRequireAdmin()` |
| `IconzaUtils.tempoRelativo()` | "há 5 min" | helper `formatTimeAgo()` |
| `IconzaUtils.renderAvatar()` | HTML do avatar | `<Avatar />` component |
| `IconzaUtils.toast()` | Notificação flutuante | `toast()` (sonner/react-toast) |

---

## 🚀 EVOLUÇÃO PARA NEXT.JS — Mapa Mental

Quando migrarmos, cada peça atual tem um destino claro:

```
HOJE (HTML/JS)                    FUTURO (Next.js)
─────────────                     ─────────────────
core-supabase.js          →       lib/supabase/client.ts
core-auth.js              →       lib/auth.ts + middleware.ts
core-utils.js             →       lib/utils.ts

iconza-layout.js          →       app/(app)/layout.tsx
iconza-sidebar.js         →       components/layout/Sidebar.tsx
iconza-card.js            →       components/cards/PostCard.tsx
iconza-feed.js            →       components/feed/Feed.tsx + hooks/useRealtimeFeed.ts
iconza-brain.js           →       components/brain/BrainCanvas.tsx

iconza-tokens.css         →       tailwind.config.ts (cores como tema)
iconza-base.css           →       app/globals.css
iconza-sidebar.css        →       components/layout/Sidebar.module.css

dashboard.html            →       app/(app)/page.tsx
comunidade.html           →       app/(app)/comunidade/page.tsx
admin-crm.html            →       app/(admin)/page.tsx
```

**Conclusão:** se você organizar bem agora, a migração futura é praticamente **renomear arquivos e adicionar tipos**.

---

## 🎨 PRINCÍPIOS VISUAIS

1. **Shell estável:** sidebar e topbar nunca recarregam (na futura SPA, isso é literal — não há F5)
2. **Conteúdo respira:** páginas com `<main id="iconza-content">` herdam padding e max-width corretos
3. **Loading universal:** todo loading flow passa por `#loadingOverlay`
4. **Notificações globais:** `IconzaUtils.toast()` é o único jeito
5. **Avatares consistentes:** sempre via `IconzaUtils.renderAvatar()`

---

## 🚦 STATUS POR PÁGINA

| Página | Refatorado? | Usa Layout? |
|---|---|---|
| `dashboard.html` | ✅ usa core/* | ⏳ ainda monta sidebar manualmente |
| `comunidade.html` | ✅ usa core/* | ✅ usa IconzaLayout |
| `admin-crm.html` | ✅ usa core/* | ❌ tem layout próprio (admin é especial) |
| `perfil.html` | ❌ ainda v1 | ❌ |
| `u.html` | ❌ ainda v1 | ❌ (público) |
| `login.html` | ⚠️ parcial | ❌ (não usa shell) |
| `index.html` | ❌ ainda v1 | ❌ (público) |
| `diagnostico.html` | ❌ ainda v1 | ❌ (fluxo único) |
| `onboarding.html` | ❌ ainda v1 | ❌ (fluxo único) |

**Próximas refatorações:** `dashboard.html` para usar `IconzaLayout` também.

---

## 📋 CHECKLIST AO CRIAR FEATURE NOVA

Antes de escrever uma linha de código, pergunte:

- [ ] Já existe componente que faz isso? (consulta inventário acima)
- [ ] Vai aparecer em mais de uma página? → vira componente
- [ ] Precisa de tabela no banco? → atualiza SCHEMA.md
- [ ] Mexe em auth? → usa IconzaAuth
- [ ] Mexe em UI? → usa IconzaUtils para formatação
- [ ] É uma página? → começa com `_template.html`

---

**Quando uma página segue a arquitetura, são ~50 linhas. Quando ignora, vira 250 linhas. Use o template.**
