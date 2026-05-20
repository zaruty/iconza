# 🗺️ ICONZA — Mapa do Banco de Dados

> **Última atualização:** 19 de maio de 2026
> **Versão:** v1.0
> **Total de tabelas:** 16

Este documento é a "planta da casa" do ICONZA. Sempre que criar nova feature, consulte aqui antes para entender o que já existe e como tudo se conecta.

---

## 📐 VISÃO GERAL — Como tudo se organiza

```
                          ┌──────────────┐
                          │   profiles   │  ← Núcleo: 1 linha por usuária
                          └──────┬───────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
   CONTEÚDO                  SOCIAL                  MONETIZAÇÃO
        │                        │                        │
   ┌────┴────┐              ┌────┴────┐              ┌────┴────┐
   cursos    aulas          posts     curtidas       transacoes
   modulos   matriculas     comentarios               doacoes
             progresso_aulas notificacoes              listas_presentes
                                                       itens_lista
                                                       reservas_presentes
                                                       contas_pagamento
                                                       projetos_doacao
```

---

## 🧬 1. NÚCLEO — Usuárias

### `profiles`
**O que é:** Uma linha por pessoa cadastrada no ICONZA.
**Quem cria:** Trigger automático ao se cadastrar via Supabase Auth.

```
Colunas principais:
- id (uuid)              → mesmo id de auth.users
- email                  → email único
- nome_completo
- role                   → 'founder' | 'admin' | 'mentor' | 'aluno' | 'visitante'
- onboarding_completo    → true após completar diagnóstico+onboarding
- idioma                 → 'pt' | 'en' | 'it' | 'es' | 'fr'
- aniversario, telefone, pais, cidade, etnia, signo
- aptidoes (jsonb)       → ['Comunicação', 'Design', ...]
- objetivo (jsonb)       → ['Monetizar conteúdo', ...]
- horarios (jsonb)       → ['Manhã', 'Noite']
- instagram, youtube, tiktok
- produto                → 'Acesso Gratuito', 'Tronco', ...
- status                 → 'Em andamento', 'Concluído', ...

Quem pode acessar:
- Aluna lê apenas o próprio perfil
- Admin/founder lê todos
```

---

## 📚 2. CONTEÚDO EDUCACIONAL

### `cursos`
**O que é:** Universos / cursos da plataforma.

```
- titulo, slug, subtitulo, descricao
- capa_url, trailer_url
- fase (1-6), nivel, idioma
- tipo: 'gratuito' | 'pago' | 'assinatura'
- preco, modulos_gratis
- status: 'rascunho' | 'publicado' | 'arquivado'
- criador_id → profiles
- total_aulas, total_matriculas (atualizados por trigger)

Acesso: público lê publicados. Admin gerencia tudo.
```

### `modulos`
Capítulos dentro de um curso.
```
- curso_id, titulo, descricao, ordem, gratuito
```

### `aulas`
Aulas individuais.
```
- modulo_id, curso_id
- titulo, descricao, ordem
- tipo: 'video' | 'texto' | 'quiz' | 'desafio' | 'pdf'
- video_url, video_provider ('youtube' | 'vimeo' | 'supabase' | 'external')
- duracao_min
- gratuita (boolean)
- materiais (jsonb)
```

### `matriculas`
Quem tem acesso a quais cursos.
```
- aluna_id, curso_id
- tipo_acesso: 'gratuito' | 'pago' | 'assinatura' | 'cortesia'
- transacao_id → transacoes
- progresso_pct (0-100)
- ultima_aula_id, data_inicio, data_conclusao
- certificado_emitido, certificado_url

UNIQUE(aluna_id, curso_id) — uma matrícula por curso
```

### `progresso_aulas`
Aula concluída por aluna.
```
- aluna_id, aula_id, curso_id
- concluida (boolean)
- tempo_assistido_seg
- ultima_visualizacao

Trigger: atualiza progresso_pct na matrícula automaticamente
```

---

## 💬 3. SOCIAL — Comunidade

### `posts`
Publicações na comunidade.
```
- autor_id, conteudo, imagem_url, link_url
- tipo: 'texto' | 'imagem' | 'projeto' | 'pergunta' | 'marco'
- status: 'publicado' | 'rascunho' | 'removido' | 'reportado'
- destaque, fixado (boolean)
- total_curtidas, total_comentarios (triggers)

Realtime: ✅ ativado
```

### `comentarios`
```
- post_id, autor_id
- resposta_a → comentarios (threads aninhados)
- conteudo
- status: 'publicado' | 'removido'
- total_curtidas
```

### `curtidas`
Tabela polimórfica: aponta para post OU comentário.
```
- usuario_id
- post_id (nullable)
- comentario_id (nullable)
- tipo: 'curtir' | 'amar' | 'inspirar' | 'aplaudir'

CHECK: ou tem post_id OU comentario_id, nunca os dois
UNIQUE: um usuário curte uma vez cada
```

### `notificacoes`
Avisos para a usuária.
```
- destinatario_id, remetente_id
- tipo: 'curtida' | 'comentario' | 'resposta' | 'mencao' | 'seguir' | 'marco' | 'sistema'
- titulo, mensagem
- ref_id, ref_tipo, ref_url   ← polimórfico
- lida (boolean), lida_em

Triggers automáticos criam notificações de curtidas e comentários
```

---

## 💰 4. MONETIZAÇÃO

### `transacoes` (tabela mestre)
Toda movimentação financeira passa aqui.
```
- user_id, email_pagador
- tipo: 'curso' | 'doacao' | 'presente' | 'assinatura' | 'outro'
- referencia_id, referencia_descricao
- valor, moeda
- provider: 'pix' | 'mercadopago' | 'stripe' | 'hotmart' | 'manual'
- provider_id, provider_metadata (jsonb)
- status: 'pendente' | 'processando' | 'pago' | 'cancelado' | 'reembolsado' | 'falhou'
- destinatario_id (quem recebe), taxa_plataforma, valor_liquido
```

### `contas_pagamento`
Chaves PIX / contas MP / Stripe das criadoras.
```
- user_id (único)
- pix_chave, pix_tipo, pix_nome_titular
- mp_access_token, mp_user_id
- stripe_account_id (futuro)
```

### `projetos_doacao`
Causas que aceitam doações.
```
- criador_id, titulo, descricao, capa_url
- meta_valor, valor_arrecadado, num_doadores
- status: 'rascunho' | 'ativo' | 'encerrado' | 'pausado'
```

### `doacoes`
```
- doador_id, doador_nome, doador_email, anonima
- projeto_id, destinatario_id
- valor, mensagem
- transacao_id → transacoes
- status: 'pendente' | 'confirmada' | 'cancelada'

Trigger: atualiza valor_arrecadado no projeto
```

### `listas_presentes`
Wishlists das usuárias.
```
- user_id, titulo, slug, descricao
- capa_url, ocasiao, data_evento
- ativa, publica
```

### `itens_lista`
Itens dentro da wishlist.
```
- lista_id, titulo, descricao, imagem_url
- link_externo, preco, quantidade
- status: 'disponivel' | 'reservado' | 'comprado'
- prioridade: 'baixa' | 'media' | 'alta'
```

### `reservas_presentes`
Quem reservou/comprou cada item.
```
- item_id, comprador_id, comprador_nome, comprador_email
- anonimo, mensagem
- transacao_id → transacoes
- status: 'reservado' | 'pago' | 'entregue' | 'cancelado'
```

---

## 🔐 5. SEGURANÇA — Row Level Security (RLS)

**TODAS as tabelas têm RLS ativado.** Regras gerais:

| Quem | Pode fazer |
|---|---|
| **Aluna** | Lê e edita SEUS dados, vê conteúdo publicado, faz suas matrículas/posts/curtidas |
| **Admin/Founder** | Lê e edita TUDO |
| **Visitante (não logada)** | Vê apenas cursos publicados, projetos de doação ativos, listas públicas |

**Funções de segurança disponíveis:**
- `is_admin()` → true para founder + admin
- `is_founder()` → true só para Lívia
- `get_user_role()` → retorna o role do usuário logado

---

## ⚡ 6. REALTIME

Tabelas com Supabase Realtime habilitado (mudanças aparecem instantaneamente no frontend):

- ✅ `posts`
- ✅ `comentarios`
- ✅ `curtidas`
- ✅ `notificacoes`

Para adicionar realtime em outra tabela:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE nome_da_tabela;
```

---

## 🔄 7. TRIGGERS AUTOMÁTICOS

| Trigger | O que faz |
|---|---|
| `handle_new_user()` | Ao cadastrar, cria linha em profiles com role correto |
| `atualizar_progresso_matricula()` | Aula concluída → atualiza % no curso |
| `atualizar_total_matriculas()` | Nova matrícula → incrementa contador no curso |
| `atualizar_total_curtidas_post()` | Curtida → incrementa contador no post |
| `atualizar_total_curtidas_comentario()` | Curtida → incrementa contador no comentário |
| `atualizar_total_comentarios()` | Novo comentário → incrementa contador no post |
| `atualizar_arrecadacao()` | Doação confirmada → incrementa valor no projeto |
| `notificar_curtida()` | Curtiu → cria notificação para autor |
| `notificar_comentario()` | Comentou → cria notificação para autor |

---

## 🚀 8. PRÓXIMAS TABELAS PLANEJADAS (ainda não criadas)

- ⏳ `mensagens` — DMs entre usuárias
- ⏳ `seguidores` — quem segue quem
- ⏳ `eventos` — lives, encontros, workshops
- ⏳ `cerebros` — visualização do cérebro criativo de cada aluna
- ⏳ `conquistas` — gamificação
- ⏳ `tags` — sistema de tags global

---

## 📞 Conexões Externas

- **Supabase URL:** `https://rwnedxbhlnvmqjsdzwyo.supabase.co`
- **Repo GitHub:** `github.com/zaruty/iconza`
- **Site:** `iconza.vercel.app`
- **Auth providers:** Email + senha · Google OAuth

---

## 🎯 Como usar este documento

1. **Antes de criar feature nova** → veja se já existe tabela que cobre
2. **Antes de criar nova coluna** → veja se outra coluna não resolve
3. **Quando esquecer estrutura** → consulta rápida aqui
4. **Quando outra pessoa entrar no projeto** → este é o primeiro doc a ler

---

**Atualize este documento sempre que mudar o schema. É a verdade do banco.**
