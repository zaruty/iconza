/* =====================================================
   ICONZA — MOTOR DO FEED
   Posts · Realtime · Curtidas · Comentários
   ===================================================== */

(function() {
  'use strict';

  const IconzaFeed = {
    sb: null,
    usuario: null,
    posts: [],
    realtimeChannel: null,
    container: null,

    /**
     * Inicializa o feed
     */
    async init(opts = {}) {
      this.sb = opts.sb || window.sb;
      this.container = opts.container || '#feedContainer';
      this.usuario = opts.usuario;

      if (!this.sb) {
        console.error('IconzaFeed: Supabase não configurado');
        return;
      }

      await this.carregarPosts();
      this.iniciarRealtime();
    },

    /**
     * Carrega posts do banco
     */
    async carregarPosts(limit = 50) {
      const { data, error } = await this.sb
        .from('posts')
        .select(`
          *,
          autor:profiles!autor_id(id, nome_completo, avatar_url, role)
        `)
        .eq('status', 'publicado')
        .order('fixado', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao carregar posts:', error);
        this.renderErro(error.message);
        return;
      }

      // Carrega minhas curtidas para marcar os corações
      if (this.usuario && data.length > 0) {
        const postIds = data.map(p => p.id);
        const { data: curtidas } = await this.sb
          .from('curtidas')
          .select('post_id')
          .eq('usuario_id', this.usuario.id)
          .in('post_id', postIds);

        const meusCurtidos = new Set((curtidas || []).map(c => c.post_id));
        data.forEach(p => {
          p.minhas_curtidas = meusCurtidos.has(p.id) ? ['curtir'] : [];
        });
      }

      this.posts = data;
      this.renderFeed();
    },

    /**
     * Renderiza o feed completo
     */
    renderFeed() {
      const el = typeof this.container === 'string'
        ? document.querySelector(this.container)
        : this.container;
      if (!el) return;

      if (this.posts.length === 0) {
        el.innerHTML = `
          <div class="iz-feed-empty">
            <div class="iz-feed-empty-icon">${window.icon('users', { size: 48, stroke: 1.4 })}</div>
            <h3 class="iz-feed-empty-title">A comunidade está começando</h3>
            <p class="iz-feed-empty-desc">Seja a primeira a compartilhar algo aqui.</p>
          </div>
        `;
        return;
      }

      el.innerHTML = this.posts.map(p =>
        window.IconzaCard.post(p, { meuId: this.usuario?.id })
      ).join('');
    },

    renderErro(msg) {
      const el = typeof this.container === 'string'
        ? document.querySelector(this.container)
        : this.container;
      if (!el) return;
      el.innerHTML = `<div class="iz-feed-empty"><p>Erro ao carregar feed: ${msg}</p></div>`;
    },

    /**
     * Realtime — escuta novos posts, curtidas, comentários
     */
    iniciarRealtime() {
      if (this.realtimeChannel) {
        this.sb.removeChannel(this.realtimeChannel);
      }

      this.realtimeChannel = this.sb
        .channel('comunidade')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'posts' },
          (payload) => this.aoNovoPost(payload.new)
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'posts' },
          (payload) => this.aoAtualizarPost(payload.new)
        )
        .on('postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'posts' },
          (payload) => this.aoRemoverPost(payload.old)
        )
        .subscribe();
    },

    async aoNovoPost(post) {
      // Busca dados do autor
      const { data: autor } = await this.sb
        .from('profiles')
        .select('id, nome_completo, avatar_url, role')
        .eq('id', post.autor_id)
        .single();

      post.autor = autor;
      post.minhas_curtidas = [];

      // Adiciona no topo (depois dos fixados)
      const idxFixados = this.posts.findIndex(p => !p.fixado);
      this.posts.splice(idxFixados >= 0 ? idxFixados : 0, 0, post);
      this.renderFeed();

      // Toast notificando (só se não for meu próprio post)
      if (post.autor_id !== this.usuario?.id) {
        this.mostrarToast(`${autor?.nome_completo || 'Alguém'} acabou de publicar`);
      }
    },

    aoAtualizarPost(postAtualizado) {
      const idx = this.posts.findIndex(p => p.id === postAtualizado.id);
      if (idx >= 0) {
        // Mantém o autor e curtidas, atualiza o resto
        this.posts[idx] = {
          ...this.posts[idx],
          ...postAtualizado,
          autor: this.posts[idx].autor,
          minhas_curtidas: this.posts[idx].minhas_curtidas,
        };
        this.atualizarPostNoDOM(this.posts[idx]);
      }
    },

    aoRemoverPost(post) {
      this.posts = this.posts.filter(p => p.id !== post.id);
      const el = document.querySelector(`[data-post-id="${post.id}"]`);
      if (el) {
        el.style.transition = 'all .3s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        setTimeout(() => el.remove(), 300);
      }
    },

    atualizarPostNoDOM(post) {
      const el = document.querySelector(`[data-post-id="${post.id}"]`);
      if (!el) return;
      const novoHtml = window.IconzaCard.post(post, { meuId: this.usuario?.id });
      const temp = document.createElement('div');
      temp.innerHTML = novoHtml;
      el.replaceWith(temp.firstElementChild);
    },

    /**
     * Criar novo post
     */
    async criarPost(conteudo, tipo = 'texto') {
      if (!conteudo || !conteudo.trim()) return { error: 'Conteúdo vazio' };

      const { data, error } = await this.sb
        .from('posts')
        .insert({
          autor_id: this.usuario.id,
          conteudo: conteudo.trim(),
          tipo,
          status: 'publicado'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar post:', error);
        return { error: error.message };
      }

      this.mostrarToast('Post publicado ✓');
      return { data };
    },

    /**
     * Curtir / descurtir post
     */
    async curtir(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (!post) return;

      const jaCurti = (post.minhas_curtidas || []).length > 0;

      if (jaCurti) {
        // Descurtir
        const { error } = await this.sb
          .from('curtidas')
          .delete()
          .match({ usuario_id: this.usuario.id, post_id: postId, tipo: 'curtir' });

        if (!error) {
          post.minhas_curtidas = [];
          post.total_curtidas = Math.max(0, (post.total_curtidas || 1) - 1);
          this.atualizarPostNoDOM(post);
        }
      } else {
        // Curtir
        const { error } = await this.sb
          .from('curtidas')
          .insert({ usuario_id: this.usuario.id, post_id: postId, tipo: 'curtir' });

        if (!error) {
          post.minhas_curtidas = ['curtir'];
          post.total_curtidas = (post.total_curtidas || 0) + 1;
          this.atualizarPostNoDOM(post);
        }
      }
    },

    /**
     * Deletar post
     */
    async deletar(postId) {
      const { error } = await this.sb
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        alert('Erro ao deletar: ' + error.message);
        return;
      }
      // Realtime cuida da remoção visual
      this.mostrarToast('Post removido');
    },

    /**
     * Abrir modal de comentários
     */
    async abrirComentarios(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (!post) return;

      const { data: comentarios } = await this.sb
        .from('comentarios')
        .select(`*, autor:profiles!autor_id(id, nome_completo, avatar_url, role)`)
        .eq('post_id', postId)
        .eq('status', 'publicado')
        .order('created_at', { ascending: true });

      const comentariosHtml = (comentarios || []).map(c => `
        <div class="iz-comment">
          ${window.iconzaRenderAvatar(c.autor || {}, 32)}
          <div class="iz-comment-body">
            <div class="iz-comment-header">
              <strong class="iz-comment-author">${c.autor?.nome_completo || 'Aluna'}</strong>
              <span class="iz-comment-time">${window.iconzaTempoRelativo(c.created_at)}</span>
            </div>
            <p class="iz-comment-text">${window.iconzaEscapeHtml(c.conteudo)}</p>
          </div>
        </div>
      `).join('');

      const modal = document.createElement('div');
      modal.className = 'iz-modal-backdrop';
      modal.innerHTML = `
        <div class="iz-modal iz-modal-comments">
          <header class="iz-modal-header">
            <h3>Comentários</h3>
            <button onclick="this.closest('.iz-modal-backdrop').remove()" class="iz-modal-close">${window.icon('close', { size: 18, stroke: 1.6 })}</button>
          </header>
          <div class="iz-comments-list">
            ${comentariosHtml || '<p class="iz-empty-text">Seja a primeira a comentar.</p>'}
          </div>
          <div class="iz-comment-composer">
            <textarea id="novoComentario" placeholder="Escreva um comentário..." maxlength="1000"></textarea>
            <button class="iconza-btn iconza-btn--primary iconza-btn--sm" onclick="IconzaFeed.adicionarComentario('${postId}')">Comentar</button>
          </div>
        </div>
      `;
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
      document.body.appendChild(modal);
      setTimeout(() => modal.querySelector('#novoComentario')?.focus(), 100);
    },

    async adicionarComentario(postId) {
      const textarea = document.getElementById('novoComentario');
      const conteudo = textarea?.value.trim();
      if (!conteudo) return;

      const { error } = await this.sb
        .from('comentarios')
        .insert({
          post_id: postId,
          autor_id: this.usuario.id,
          conteudo,
          status: 'publicado'
        });

      if (error) { alert('Erro: ' + error.message); return; }

      document.querySelector('.iz-modal-backdrop')?.remove();
      this.mostrarToast('Comentário enviado ✓');
    },

    /**
     * Toast simples
     */
    mostrarToast(msg, tipo = 'sucesso') {
      const toast = document.createElement('div');
      toast.className = `iz-toast iz-toast--${tipo}`;
      toast.textContent = msg;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('is-visible'));
      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },

    /**
     * Desconectar realtime
     */
    desconectar() {
      if (this.realtimeChannel) {
        this.sb.removeChannel(this.realtimeChannel);
        this.realtimeChannel = null;
      }
    }
  };

  window.IconzaFeed = IconzaFeed;
})();
