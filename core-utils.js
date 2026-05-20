/* =====================================================
   ICONZA — UTILITÁRIOS COMPARTILHADOS
   Funções pequenas usadas em vários lugares do projeto
   ===================================================== */

(function() {
  'use strict';

  window.IconzaUtils = {
    /**
     * Detecta a página atual baseado na URL
     * Retorna o ID de navegação correspondente
     */
    getCurrentPage() {
      const path = window.location.pathname.toLowerCase();

      // Mapa URL → activeId (deve bater com IDs da sidebar)
      const mapa = [
        { url: 'admin-crm', id: 'admin-dashboard' },
        { url: 'comunidade', id: 'comunidade' },
        { url: 'cursos', id: 'cursos' },
        { url: 'aulas', id: 'aulas' },
        { url: 'cerebro', id: 'cerebro' },
        { url: 'universos', id: 'universos' },
        { url: 'biblioteca', id: 'biblioteca' },
        { url: 'prompts', id: 'prompts' },
        { url: 'diario', id: 'diario' },
        { url: 'config', id: 'config' },
        { url: 'perfil', id: 'perfil' },
        { url: 'dashboard', id: 'boas-vindas' },
        { url: 'index', id: 'boas-vindas' },
      ];

      for (const item of mapa) {
        if (path.includes(item.url)) return item.id;
      }
      return 'boas-vindas';
    },

    /**
     * Formata tempo relativo (há 5 min, há 2 horas, etc)
     */
    tempoRelativo(timestamp) {
      const agora = new Date();
      const data = new Date(timestamp);
      const seg = Math.floor((agora - data) / 1000);

      if (seg < 60) return 'agora';
      if (seg < 3600) return `há ${Math.floor(seg / 60)} min`;
      if (seg < 86400) return `há ${Math.floor(seg / 3600)} h`;
      if (seg < 604800) return `há ${Math.floor(seg / 86400)} d`;
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    },

    /**
     * Formata data no padrão ICONZA: "18 DE MAIO DE 2026"
     */
    formatarDataLonga(data = new Date()) {
      const d = data instanceof Date ? data : new Date(data);
      const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
      return `${d.getDate()} DE ${meses[d.getMonth()]} DE ${d.getFullYear()}`;
    },

    /**
     * Formata data simples: "18/05/2026"
     */
    formatarData(data) {
      if (!data) return '';
      return new Date(data).toLocaleDateString('pt-BR');
    },

    /**
     * Pega primeiro nome
     */
    primeiroNome(nomeCompleto) {
      if (!nomeCompleto) return '';
      return nomeCompleto.trim().split(/\s+/)[0];
    },

    /**
     * Pega inicial para avatar
     */
    inicial(texto) {
      if (!texto) return '?';
      return texto.trim().charAt(0).toUpperCase();
    },

    /**
     * Renderiza avatar com fallback para inicial
     */
    renderAvatar(user, size = 36) {
      const inicial = this.inicial(user?.nome_completo || user?.email);
      const url = user?.avatar_url;
      const style = `width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-weight:600;font-size:${Math.round(size * 0.4)}px;color:white;background:linear-gradient(135deg,#5B6CFF,#1E4D40);overflow:hidden;flex-shrink:0`;
      if (url) return `<div style="${style}"><img src="${url}" style="width:100%;height:100%;object-fit:cover" alt=""></div>`;
      return `<div style="${style}">${inicial}</div>`;
    },

    /**
     * Escape de HTML (prevenção XSS) — use sempre que renderizar texto do usuário
     */
    escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * Trunca texto com reticências
     */
    truncar(texto, max = 100) {
      if (!texto) return '';
      if (texto.length <= max) return texto;
      return texto.substring(0, max).trim() + '...';
    },

    /**
     * Formata valor em BRL: "R$ 297,00"
     */
    formatarPreco(valor) {
      const num = Number(valor) || 0;
      return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },

    /**
     * Formata número grande: 1500 → "1.5k", 1500000 → "1.5M"
     */
    formatarNumero(num) {
      if (num < 1000) return String(num);
      if (num < 1_000_000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
      return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    },

    /**
     * Slugify — converte texto em slug URL-safe
     */
    slugify(texto) {
      return String(texto || '')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    },

    /**
     * Pega query string da URL: ?id=123 → 123
     */
    getQueryParam(nome) {
      return new URLSearchParams(window.location.search).get(nome);
    },

    /**
     * Atualiza URL sem recarregar
     */
    setQueryParam(nome, valor) {
      const params = new URLSearchParams(window.location.search);
      if (valor === null || valor === undefined) {
        params.delete(nome);
      } else {
        params.set(nome, valor);
      }
      const novaUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', novaUrl);
    },

    /**
     * Toast simples (notificação flutuante)
     */
    toast(mensagem, tipo = 'sucesso') {
      const toast = document.createElement('div');
      toast.className = `iz-toast iz-toast--${tipo}`;
      toast.textContent = mensagem;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('is-visible'));
      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },

    /**
     * Debounce — evita chamadas excessivas (ex: busca enquanto digita)
     */
    debounce(fn, wait = 300) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    /**
     * Copia para clipboard
     */
    async copiar(texto) {
      try {
        await navigator.clipboard.writeText(texto);
        this.toast('Copiado!');
        return true;
      } catch {
        return false;
      }
    },

    /**
     * Detecta plataforma (mobile/desktop)
     */
    isMobile() {
      return window.innerWidth < 768;
    },

    /**
     * Label amigável do role
     */
    roleLabel(role) {
      return {
        founder: 'Fundadora',
        admin: 'Equipe',
        mentor: 'Mentora',
        aluno: 'Aluna',
        visitante: 'Visitante',
      }[role] || 'Aluna';
    },
  };

  // Atalho global
  window.iconzaUtils = window.IconzaUtils;
})();
