/* =====================================================
   ICONZA — SIDEBAR COMPONENT v4
   Vanilla JS · Reutilizável · Configurável por role

   ARQUITETURA:
   - NAV_ADMIN  → sidebar completa do admin-crm.html
   - NAV_ALUNA  → sidebar da experiência da aluna (dashboard, cursos, etc)
   - Preview Mode → flag localStorage 'iconza-preview-mode'
     quando ativa: admin vê sidebar de aluna + barra de preview no topo
   ===================================================== */

(function() {
  'use strict';

  // ── NAV ADMIN — sidebar operacional completa ──────────────────────
  // Usada APENAS em admin-crm.html
  // O logo nesta sidebar aponta para admin-crm.html
  const NAV_ADMIN = [
    // GERAL
    { id: 'dashboard',    label: 'Dashboard',       icon: 'home',     href: 'admin-crm.html',           section: 'Geral' },
    // PESSOAS
    { id: 'usuarios',     label: 'Usuárias',        icon: 'users',    href: 'admin-crm.html',           section: 'Pessoas', mod: 'usuarios' },
    { id: 'onboarding',   label: 'Onboarding',      icon: 'check',    href: 'admin-crm.html',           section: null,      mod: 'onboarding' },
    { id: 'cerebros',     label: 'Cérebros',        icon: 'brain',    href: 'admin-crm.html',           section: null,      mod: 'cerebros' },
    // PLATAFORMA
    { id: 'fases',        label: 'Fases & Ícones',  icon: 'star',     href: 'admin-crm.html',           section: 'Plataforma', mod: 'fases' },
    { id: 'cursos',       label: 'Universos',       icon: 'book',     href: 'admin-crm.html',           section: null,      mod: 'cursos' },
    { id: 'aulas',        label: 'Aulas',           icon: 'play',     href: 'admin-crm.html',           section: null,      mod: 'aulas' },
    { id: 'prompts',      label: 'Prompts',         icon: 'sparkles', href: 'admin-crm.html',           section: null,      mod: 'prompts' },
    { id: 'biblioteca',   label: 'Biblioteca',      icon: 'library',  href: 'admin-crm.html',           section: null,      mod: 'biblioteca' },
    // ENGAJAMENTO
    { id: 'comunidade',   label: 'Comunidade',      icon: 'users',    href: 'admin-crm.html',           section: 'Engajamento', mod: 'comunidade' },
    { id: 'blog',         label: 'Blog',            icon: 'journal',  href: 'admin-crm.html',           section: null,      mod: 'blog' },
    { id: 'certificados', label: 'Certificados',    icon: 'award',    href: 'admin-crm.html',           section: null,      mod: 'certificados' },
    // ANÁLISE
    { id: 'analytics',    label: 'Analytics',       icon: 'bar',      href: 'admin-crm.html',           section: 'Análise', mod: 'analytics' },
    { id: 'idiomas',      label: 'Idiomas',         icon: 'globe',    href: 'admin-crm.html',           section: null,      mod: 'idiomas' },
    // SISTEMA
    { id: 'config',       label: 'Configurações',   icon: 'settings', href: 'admin-crm.html',           section: 'Sistema', mod: 'config' },
    { id: 'suporte',      label: 'Suporte',         icon: 'help',     href: 'admin-crm.html',           section: null,      mod: 'suporte' },
  ];

  // ── NAV ALUNA — sidebar da experiência da aluna ───────────────────
  // Usada em dashboard.html, cursos, biblioteca, comunidade, etc
  // O logo nesta sidebar aponta para dashboard.html
  const NAV_ALUNA = [
    { id: 'boas-vindas',  label: 'Dashboard',       icon: 'home',     href: 'dashboard.html' },
    { id: 'universos',    label: 'Universos',        icon: 'compass',  href: 'universos.html' },
    { id: 'cerebro',      label: 'Cérebro Criativo', icon: 'brain',    href: 'cerebro.html' },
    { id: 'cursos',       label: 'Meus Cursos',      icon: 'book',     href: 'cursos.html' },
    { id: 'aulas',        label: 'Aulas',            icon: 'play',     href: 'aulas.html' },
    { id: 'biblioteca',   label: 'Biblioteca',       icon: 'library',  href: 'biblioteca.html' },
    { id: 'prompts',      label: 'Prompts',          icon: 'sparkles', href: 'prompts.html' },
    { id: 'comunidade',   label: 'Comunidade',       icon: 'users',    href: 'comunidade.html' },
    { id: 'diario',       label: 'Diário Criativo',  icon: 'journal',  href: 'diario.html' },
    { id: 'config',       label: 'Configurações',    icon: 'settings', href: 'config.html' },
  ];

  window.IconzaSidebar = {

    render(opts = {}) {
      const {
        target = '#iconza-sidebar',
        activeId = 'boas-vindas',
        user = { nome: 'Aluna', role: 'aluno', avatar_url: null },
        variant = null, // 'admin' | 'aluna' — se null, detecta por role
      } = opts;

      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) { console.error('Sidebar target not found:', target); return; }

      // Determina contexto: admin real ou aluna (inclui preview mode)
      const isAdminReal = user.role === 'admin' || user.role === 'founder';
      const previewMode = localStorage.getItem('iconza-preview-mode') === 'aluna';

      // variant explícito > preview override > role
      let useAdmin;
      if (variant === 'admin') useAdmin = true;
      else if (variant === 'aluna') useAdmin = false;
      else if (previewMode) useAdmin = false; // preview sempre força aluna
      else useAdmin = isAdminReal;

      const nav = useAdmin ? NAV_ADMIN : NAV_ALUNA;

      // Logo href: NUNCA troca contexto automaticamente
      const logoHref = useAdmin ? 'admin-crm.html' : 'dashboard.html';

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

      // Renderiza itens de nav
      // Admin: usa função mostrar() do admin-crm para trocar módulo
      // Aluna: links normais
      const navItems = useAdmin
        ? this._renderAdminNav(nav, activeId)
        : this._renderAlunaNav(nav, activeId);

      // Bloco inferior: Modo Teste (admin) ou Apoio (aluna)
      const footerBlock = (isAdminReal && !previewMode) ? `
        <div class="iconza-side-support iconza-modo-teste">
          <div class="iconza-side-support-title">
            ${window.icon('users', { size: 12, stroke: 1.6 })}
            Modo Teste
          </div>
          <p class="iconza-side-support-copy">
            Visualize a plataforma exatamente como uma aluna vê.
          </p>
          <button class="iconza-side-support-btn" onclick="iconzaAtivarPreview()">
            Visualizar como aluna
            ${window.icon('arrow-right', { size: 12, stroke: 1.6 })}
          </button>
        </div>
      ` : (previewMode ? `
        <div class="iconza-side-support" style="border-color:rgba(79,70,229,.3);background:rgba(79,70,229,.08)">
          <div class="iconza-side-support-title" style="color:#818cf8">
            ${window.icon('eye', { size: 12, stroke: 1.6 })}
            Modo Preview ativo
          </div>
          <p class="iconza-side-support-copy">Você está vendo como aluna.</p>
          <button class="iconza-side-support-btn" onclick="iconzaSairPreview()" style="border-color:rgba(79,70,229,.4);color:#818cf8">
            Sair do preview
            ${window.icon('arrow-left', { size: 12, stroke: 1.6 })}
          </button>
        </div>
      ` : `
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
      `);

      el.innerHTML = `
        <aside class="iconza-side">
          <a href="${logoHref}" class="iconza-side-brand">
            <img src="coroa.png" alt="ICONZA" class="iconza-side-crown">
            <div class="iconza-side-brand-text">
              <div class="iconza-side-wordmark">ICONZA</div>
              <div class="iconza-side-sub">${useAdmin ? 'Admin' : (previewMode ? 'Preview' : 'Plataforma')}</div>
            </div>
          </a>

          <div class="iconza-side-user">
            <div class="iconza-side-avatar">${avatarContent}</div>
            <div class="iconza-side-user-info">
              <div class="iconza-side-name">${user.nome || 'Aluna'}</div>
              <div class="iconza-side-role">${roleLabel}${previewMode ? ' · Preview' : ''}</div>
            </div>
          </div>

          <nav class="iconza-side-nav">
            ${navItems}
          </nav>

          ${footerBlock}

          <button class="iconza-side-logout" onclick="iconzaLogout()">
            ${window.icon('logout', { size: 14, stroke: 1.5 })}
            <span>Sair da conta</span>
          </button>
        </aside>
      `;

      // Backdrop mobile
      if (!document.querySelector('.iconza-side-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'iconza-side-backdrop';
        backdrop.onclick = () => this.close();
        document.body.appendChild(backdrop);
      }
    },

    // Nav admin: botões que chamam mostrar() do admin-crm
    _renderAdminNav(nav, activeId) {
      let currentSection = null;
      return nav.map(item => {
        let sectionHtml = '';
        if (item.section && item.section !== currentSection) {
          currentSection = item.section;
          sectionHtml = `<span class="iconza-side-section">${item.section}</span>`;
        }
        const active = item.id === activeId ? 'is-active' : '';
        // Se tem mod, chama mostrar() do admin-crm; senão, link normal
        const clickHandler = item.mod
          ? `onclick="if(typeof mostrar==='function'){mostrar('${item.mod}',this);return false;}"`
          : '';
        return `
          ${sectionHtml}
          <a href="${item.href}${item.mod ? '#'+item.mod : ''}"
             class="iconza-side-item ${active}"
             data-nav-id="${item.id}"
             ${clickHandler}>
            ${window.icon(item.icon, { size: 18, stroke: 1.5 })}
            <span>${item.label}</span>
          </a>
        `;
      }).join('');
    },

    // Nav aluna: links normais
    _renderAlunaNav(nav, activeId) {
      return nav.map(item => {
        const active = item.id === activeId ? 'is-active' : '';
        return `
          <a href="${item.href}" class="iconza-side-item ${active}" data-nav-id="${item.id}">
            ${window.icon(item.icon, { size: 18, stroke: 1.5 })}
            <span>${item.label}</span>
          </a>
        `;
      }).join('');
    },

    open() {
      document.querySelector('.iconza-side')?.classList.add('is-open');
      document.querySelector('.iconza-side-backdrop')?.classList.add('is-visible');
    },
    close() {
      document.querySelector('.iconza-side')?.classList.remove('is-open');
      document.querySelector('.iconza-side-backdrop')?.classList.remove('is-visible');
    },
    toggle() {
      const side = document.querySelector('.iconza-side');
      side?.classList.contains('is-open') ? this.close() : this.open();
    },
    setActive(id) {
      document.querySelectorAll('.iconza-side-item').forEach(el => {
        el.classList.toggle('is-active', el.dataset.navId === id);
      });
    },
  };

  // ── HELPERS GLOBAIS ──────────────────────────────────────────────

  window.iconzaLogout = function() {
    window.location.href = 'sair.html';
  };

  // Ativa preview: flag no localStorage, vai para dashboard como aluna
  // SEM logout — sessão Supabase permanece intacta
  window.iconzaAtivarPreview = function() {
    localStorage.setItem('iconza-preview-mode', 'aluna');
    window.location.href = 'dashboard.html';
  };

  // Sai do preview: remove flag, volta para admin-crm
  window.iconzaSairPreview = function() {
    localStorage.removeItem('iconza-preview-mode');
    window.location.href = 'admin-crm.html';
  };

})();
