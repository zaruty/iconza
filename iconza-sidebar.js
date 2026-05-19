/* =====================================================
   ICONZA — SIDEBAR COMPONENT
   Vanilla JS · Reutilizável · Configurável por role
   ===================================================== */

(function() {
  'use strict';

  // Navegação completa (filtrada por role)
  const NAV_ALUNA = [
    { id: 'boas-vindas',  label: 'Boas-vindas',       icon: 'home',     href: 'dashboard.html' },
    { id: 'universos',    label: 'Universos',         icon: 'compass',  href: 'universos.html' },
    { id: 'cerebro',      label: 'Cérebro Criativo',  icon: 'brain',    href: 'cerebro.html' },
    { id: 'cursos',       label: 'Meus Cursos',       icon: 'book',     href: 'cursos.html' },
    { id: 'aulas',        label: 'Aulas',             icon: 'play',     href: 'aulas.html' },
    { id: 'biblioteca',   label: 'Biblioteca',        icon: 'library',  href: 'biblioteca.html' },
    { id: 'prompts',      label: 'Prompts',           icon: 'sparkles', href: 'prompts.html' },
    { id: 'comunidade',   label: 'Comunidade',        icon: 'users',    href: 'comunidade.html' },
    { id: 'diario',       label: 'Diário Criativo',   icon: 'journal',  href: 'diario.html' },
    { id: 'config',       label: 'Configurações',     icon: 'settings', href: 'config.html' },
  ];

  const NAV_ADMIN = [
    { id: 'admin-dashboard', label: 'Dashboard',  icon: 'home',     href: 'admin-crm.html' },
    { id: 'admin-alunas',    label: 'Alunas',     icon: 'users',    href: 'admin-crm.html#usuarios' },
    { id: 'admin-cerebros',  label: 'Cérebros',   icon: 'brain',    href: 'admin-crm.html#cerebros' },
    { id: 'admin-cursos',    label: 'Cursos',     icon: 'book',     href: 'admin-crm.html#cursos' },
    { id: 'admin-prompts',   label: 'Prompts',    icon: 'sparkles', href: 'admin-crm.html#prompts' },
    { id: 'admin-config',    label: 'Configurações', icon: 'settings', href: 'admin-crm.html#config' },
    // separador visual
    { id: 'view-aluna',      label: 'Ver como aluna', icon: 'compass', href: 'dashboard.html', external: true },
  ];

  window.IconzaSidebar = {
    /**
     * Renderiza a sidebar
     * @param {object} opts
     * @param {string} opts.target - selector do container
     * @param {string} opts.activeId - id do item ativo
     * @param {object} opts.user - { nome, role, avatar_url }
     * @param {string} opts.variant - 'aluna' | 'admin' (auto detecta por role)
     */
    render(opts = {}) {
      const {
        target = '#iconza-sidebar',
        activeId = 'boas-vindas',
        user = { nome: 'Aluna', role: 'aluno', avatar_url: null },
      } = opts;

      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) {
        console.error('Sidebar target not found:', target);
        return;
      }

      const isAdmin = user.role === 'admin' || user.role === 'founder';
      const nav = opts.variant === 'admin' || isAdmin ? NAV_ADMIN : NAV_ALUNA;

      const initial = (user.nome || 'A').charAt(0).toUpperCase();
      const avatarContent = user.avatar_url
        ? `<img src="${user.avatar_url}" alt="${user.nome}">`
        : initial;

      const roleLabel = {
        founder: 'Fundadora',
        admin: 'Admin',
        mentor: 'Mentora',
        aluno: 'Aluna',
        visitante: 'Visitante',
      }[user.role] || 'Aluna';

      const navItems = nav.map(item => {
        const active = item.id === activeId ? 'is-active' : '';
        const target = item.external ? 'target="_blank"' : '';
        return `
          <a href="${item.href}" class="iconza-side-item ${active}" data-nav-id="${item.id}" ${target}>
            ${window.icon(item.icon, { size: 18, stroke: 1.5 })}
            <span>${item.label}</span>
          </a>
        `;
      }).join('');

      el.innerHTML = `
        <aside class="iconza-side">
          <a href="${isAdmin ? 'admin-crm.html' : 'dashboard.html'}" class="iconza-side-brand">
            <img src="coroa.png" alt="ICONZA" class="iconza-side-crown">
            <div class="iconza-side-brand-text">
              <div class="iconza-side-wordmark">ICONZA</div>
              <div class="iconza-side-sub">${isAdmin ? 'Admin' : 'Plataforma'}</div>
            </div>
          </a>

          <div class="iconza-side-user">
            <div class="iconza-side-avatar">${avatarContent}</div>
            <div class="iconza-side-user-info">
              <div class="iconza-side-name">${user.nome || 'Aluna'}</div>
              <div class="iconza-side-role">${roleLabel}</div>
            </div>
          </div>

          <nav class="iconza-side-nav">
            ${navItems}
          </nav>

          ${!isAdmin ? `
            <div class="iconza-side-support">
              <div class="iconza-side-support-title">
                ${window.icon('heart', { size: 12, stroke: 1.6 })}
                Apoie o ICONZA
              </div>
              <p class="iconza-side-support-copy">
                Sua doação mantém este universo vivo e acessível.
              </p>
              <button class="iconza-side-support-btn" onclick="window.location.href='apoiar.html'">
                Quero apoiar
                ${window.icon('arrow-right', { size: 12, stroke: 1.6 })}
              </button>
            </div>
          ` : `
            <div class="iconza-side-support">
              <div class="iconza-side-support-title">
                ${window.icon('users', { size: 12, stroke: 1.6 })}
                Modo Teste
              </div>
              <p class="iconza-side-support-copy">
                Trocar de conta para testar como aluna.
              </p>
              <button class="iconza-side-support-btn" onclick="iconzaTrocarConta()">
                Trocar de conta
                ${window.icon('arrow-right', { size: 12, stroke: 1.6 })}
              </button>
            </div>
          `}

          <button class="iconza-side-logout" onclick="iconzaLogout()">
            ${window.icon('logout', { size: 14, stroke: 1.5 })}
            <span>Sair da conta</span>
          </button>
        </aside>
      `;

      // Adiciona backdrop mobile (se ainda não existe)
      if (!document.querySelector('.iconza-side-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'iconza-side-backdrop';
        backdrop.onclick = () => this.close();
        document.body.appendChild(backdrop);
      }
    },

    /**
     * Abre sidebar no mobile
     */
    open() {
      const side = document.querySelector('.iconza-side');
      const backdrop = document.querySelector('.iconza-side-backdrop');
      if (side) side.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');
    },

    /**
     * Fecha sidebar no mobile
     */
    close() {
      const side = document.querySelector('.iconza-side');
      const backdrop = document.querySelector('.iconza-side-backdrop');
      if (side) side.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');
    },

    /**
     * Toggle (usado no botão menu mobile)
     */
    toggle() {
      const side = document.querySelector('.iconza-side');
      if (side && side.classList.contains('is-open')) {
        this.close();
      } else {
        this.open();
      }
    },

    /**
     * Atualiza item ativo
     */
    setActive(id) {
      document.querySelectorAll('.iconza-side-item').forEach(el => {
        el.classList.toggle('is-active', el.dataset.navId === id);
      });
    },
  };

  // Helper global de logout (chamado pelo botão)
  window.iconzaLogout = function() {
    window.location.href = 'sair.html';
  };

  // Helper para trocar de conta (modo teste)
  window.iconzaTrocarConta = function() {
    if (confirm('Sair desta conta e fazer login com outro email?\n\nSua sessão atual será encerrada.')) {
      window.location.href = 'sair.html?trocar=1';
    }
  };
})();
