/* =====================================================
   ICONZA — AUTENTICAÇÃO CENTRALIZADA
   Funções únicas para login, perfil e proteção de páginas
   Carregar APÓS core-supabase.js
   ===================================================== */

(function() {
  'use strict';

  if (!window.sb) {
    console.error('⚠ IconzaAuth precisa de core-supabase.js carregado primeiro');
    return;
  }

  // Cache do perfil para não buscar várias vezes na mesma página
  let _perfilCache = null;
  let _perfilCacheTime = 0;
  const CACHE_DURATION = 60_000; // 1 minuto

  window.IconzaAuth = {
    /**
     * Pega a sessão atual do Supabase (rápido, vem do localStorage)
     * @returns {object|null} session ou null se não logado
     */
    async getSession() {
      const { data } = await sb.auth.getSession();
      return data.session;
    },

    /**
     * Protege a página: se não estiver logado, redireciona para login
     * USO: const session = await IconzaAuth.requireLogin();
     */
    async requireLogin() {
      const session = await this.getSession();
      if (!session) {
        console.log('⛔ Não autenticado, redirecionando para login');
        window.location.href = 'login.html';
        throw new Error('not_authenticated');
      }
      return session;
    },

    /**
     * Pega o perfil completo do usuário logado (com cache)
     * Retorna null se não estiver logado (não redireciona)
     */
    async getCurrentUser({ forceRefresh = false } = {}) {
      // Cache válido?
      if (!forceRefresh && _perfilCache && (Date.now() - _perfilCacheTime < CACHE_DURATION)) {
        return _perfilCache;
      }

      const session = await this.getSession();
      if (!session) return null;

      const { data, error } = await sb
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Erro carregar perfil:', error);
        return null;
      }

      _perfilCache = data;
      _perfilCacheTime = Date.now();
      return data;
    },

    /**
     * Pega perfil OBRIGATÓRIO: redireciona se não logado
     * USO PRINCIPAL em páginas protegidas
     * Promise lock: evita race condition se chamado múltiplas vezes
     */
    async requireUser() {
      // Se já existe uma promise em andamento, aguarda ela (não duplica)
      if (this._requireUserPromise) return this._requireUserPromise;
      this._requireUserPromise = (async () => {
        try {
          await this.requireLogin();
          const user = await this.getCurrentUser();
          if (!user) {
            console.error('Sessão válida mas perfil não encontrado');
            window.location.href = 'login.html';
            throw new Error('profile_not_found');
          }
          return user;
        } finally {
          // Limpa lock ao finalizar (sucesso ou erro)
          this._requireUserPromise = null;
        }
      })();
      return this._requireUserPromise;
    },

    /**
     * Protege página apenas para admin/founder
     * Se não for admin, redireciona para dashboard
     */
    async requireAdmin() {
      const user = await this.requireUser();
      if (user.role !== 'admin' && user.role !== 'founder') {
        console.warn('⛔ Usuário sem permissão admin');
        window.location.href = 'dashboard.html';
        throw new Error('not_admin');
      }
      return user;
    },

    /**
     * Verifica se é admin (sem redirecionar)
     */
    async isAdmin() {
      const user = await this.getCurrentUser();
      return user && (user.role === 'admin' || user.role === 'founder');
    },

    /**
     * Verifica se é founder (sem redirecionar)
     */
    async isFounder() {
      const user = await this.getCurrentUser();
      return user && user.role === 'founder';
    },

    /**
     * Faz logout limpo (usa /sair.html para limpar tudo)
     */
    logout() {
      _perfilCache = null;
      window.location.href = 'sair.html';
    },

    /**
     * Login com email/senha
     */
    async loginWithEmail(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      _perfilCache = null; // limpa cache para forçar reload do perfil
      return { data };
    },

    /**
     * Cadastro de novo usuário
     */
    async signUp(email, password, metadata = {}) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard.html`,
        }
      });
      if (error) return { error: error.message };
      return { data };
    },

    /**
     * Login com Google
     */
    async loginWithGoogle() {
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard.html`,
        }
      });
      if (error) return { error: error.message };
      return { success: true };
    },

    /**
     * Limpa cache local (útil após editar perfil)
     */
    clearCache() {
      _perfilCache = null;
      _perfilCacheTime = 0;
    },

    /**
     * Listener: chama callback quando auth muda (login/logout)
     * ATENÇÃO: Supabase emite INITIAL_SESSION ao montar — não usar para
     * detectar "novo login". Usar apenas para SIGNED_OUT / TOKEN_REFRESHED.
     * Retorna { data: { subscription } } — chamar .unsubscribe() ao desmontar.
     */
    onAuthChange(callback) {
      return sb.auth.onAuthStateChange((event, session) => {
        // Ignora INITIAL_SESSION para evitar loops de render ao carregar página
        if (event === 'INITIAL_SESSION') return;
        if (event === 'SIGNED_OUT') {
          _perfilCache = null;
        }
        callback({ event, session });
      });
    },
  };

  // Atalho global mais curto (opcional)
  window.iconzaAuth = window.IconzaAuth;
})();
