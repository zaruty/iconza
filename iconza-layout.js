/* =====================================================
   ICONZA — LAYOUT COMPONENT
   Shell reutilizável (sidebar + topbar + área de conteúdo)
   Equivalente futuro: <AppLayout> do Next.js
   ===================================================== */

(function() {
  'use strict';

  if (!window.IconzaAuth) {
    console.error('⚠ IconzaLayout precisa de core-auth.js carregado primeiro');
    return;
  }

  /**
   * IconzaLayout — Componente de Shell
   *
   * Equivalentes Next.js futuro:
   *   .app()    → app/(app)/layout.jsx (rotas protegidas)
   *   .admin()  → app/(admin)/layout.jsx (rotas admin)
   *   .public() → app/(public)/layout.jsx (rotas públicas)
   */
  window.IconzaLayout = {

    /**
     * Layout APP — para usuárias logadas (aluna/founder/admin)
     *
     * Uso:
     *   IconzaLayout.app({
     *     activeId: 'comunidade',          // opcional, detecta da URL
     *     requireAdmin: false,              // se true, força admin
     *     onReady: (user) => { ... }       // callback após auth
     *   });
     */
    async app(opts = {}) {
      const {
        activeId = null,
        requireAdmin = false,
        onReady = null,
      } = opts;

      // 1) Auth — protege a rota
      const user = requireAdmin
        ? await IconzaAuth.requireAdmin()
        : await IconzaAuth.requireUser();

      // 2) Monta shell HTML (sidebar + topbar + conteúdo existente)
      this._mountShell();

      // 3) Renderiza sidebar
      const primeiroNome = IconzaUtils.primeiroNome(
        user.nome_completo || user.email.split('@')[0]
      );

      IconzaSidebar.render({
        target: '#iconza-sidebar',
        activeId: activeId || IconzaUtils.getCurrentPage(),
        user: {
          nome: primeiroNome,
          role: user.role,
          avatar_url: user.avatar_url || null,
        },
      });

      // 4) Topbar
      this._renderTopbar();

      // 5) Verifica notificações em background
      this._verificarNotificacoes(user);

      // 6) Esconde loading e dispara callback
      this._esconderLoading();

      if (typeof onReady === 'function') {
        await onReady(user);
      }

      return user;
    },

    /**
     * Layout PÚBLICO — para visitantes (não-logadas)
     * Não tem sidebar. Topbar minimalista.
     */
    async public(opts = {}) {
      const { onReady = null } = opts;

      // Verifica se está logada (mostra link diferente se sim)
      const user = await IconzaAuth.getCurrentUser();

      // Aqui o shell é diferente — sem sidebar
      // Por enquanto, layout público não tem shell automático
      // (cada página pública controla seu próprio layout)

      this._esconderLoading();

      if (typeof onReady === 'function') {
        await onReady(user);
      }

      return user;
    },

    // ============================================
    // INTERNAS — Não chamar diretamente
    // ============================================

    /**
     * Cria a estrutura HTML do shell envolvendo o conteúdo existente
     */
    _mountShell() {
      // Se já tem .iconza-app, não monta de novo (idempotente)
      if (document.querySelector('.iconza-app')) return;

      // Pega o que já existe no body
      const content = document.getElementById('iconza-content');

      if (!content) {
        console.warn('⚠ IconzaLayout: <main id="iconza-content"> não encontrado. Adicione no HTML.');
        return;
      }

      // Cria estrutura ao redor do conteúdo
      const shell = document.createElement('div');
      shell.className = 'iconza-app';
      shell.innerHTML = `
        <div id="iconza-sidebar"></div>
        <main class="iconza-main" id="iconzaMain">
          <header class="iconza-topbar" id="iconzaTopbar">
            <div class="iconza-topbar-date" id="iconzaDataHoje"></div>
            <button class="iconza-topbar-icon" aria-label="Notificações" onclick="IconzaLayout._abrirNotif()">
              <span class="dot" id="iconzaNotifDot" style="display:none"></span>
              <span id="iconzaBellIcon"></span>
            </button>
            <button class="iconza-topbar-icon" aria-label="Menu" onclick="IconzaSidebar.toggle()">
              <span id="iconzaMenuIcon"></span>
            </button>
          </header>
        </main>
      `;

      // Move conteúdo para dentro de iconza-main
      const main = shell.querySelector('#iconzaMain');
      const page = document.createElement('div');
      page.className = 'iconza-page';

      // Move children do iconza-content para iconza-page
      while (content.firstChild) {
        page.appendChild(content.firstChild);
      }
      main.appendChild(page);

      // Remove placeholder e adiciona shell ao body
      content.remove();
      document.body.insertBefore(shell, document.body.firstChild);

      // Re-anexa loading overlay se existir
      const loading = document.getElementById('loadingOverlay');
      if (loading) document.body.appendChild(loading);

      // Scroll listener para sombra do topbar
      const mainEl = document.getElementById('iconzaMain');
      const topbar = document.getElementById('iconzaTopbar');
      if (mainEl && topbar) {
        mainEl.addEventListener('scroll', () => {
          topbar.classList.toggle('is-scrolled', mainEl.scrollTop > 6);
        });
      }
    },

    /**
     * Renderiza topbar (data + ícones)
     */
    _renderTopbar() {
      const dataEl = document.getElementById('iconzaDataHoje');
      const bellEl = document.getElementById('iconzaBellIcon');
      const menuEl = document.getElementById('iconzaMenuIcon');

      if (dataEl) dataEl.textContent = IconzaUtils.formatarDataLonga();
      if (bellEl) bellEl.innerHTML = window.icon('bell', { size: 16, stroke: 1.6 });
      if (menuEl) menuEl.innerHTML = window.icon('menu', { size: 16, stroke: 1.6 });
    },

    /**
     * Verifica notificações não lidas
     */
    async _verificarNotificacoes(user) {
      try {
        const { count } = await window.sb
          .from('notificacoes')
          .select('*', { count: 'exact', head: true })
          .eq('destinatario_id', user.id)
          .eq('lida', false);

        if (count > 0) {
          const dot = document.getElementById('iconzaNotifDot');
          if (dot) dot.style.display = 'block';
        }
      } catch (e) {
        // Tabela notificacoes pode não existir ainda
        console.debug('Notificações não verificadas:', e.message);
      }
    },

    _esconderLoading() {
      setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hide');
      }, 300);
    },

    _abrirNotif() {
      IconzaUtils.toast('Central de notificações em construção');
    },

    /**
     * Helper: define o título da página dinamicamente
     */
    setTitle(titulo) {
      document.title = `ICONZA — ${titulo}`;
    },
  };
})();
