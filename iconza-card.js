/* =====================================================
   ICONZA — COMPONENTE CARD REUTILIZÁVEL
   Posts · Cursos · Aulas · Universos
   ===================================================== */

(function() {
  'use strict';

  /**
   * Formata tempo relativo (há 5 min, há 2 horas, etc)
   */
  function tempoRelativo(timestamp) {
    const agora = new Date();
    const data = new Date(timestamp);
    const seg = Math.floor((agora - data) / 1000);

    if (seg < 60) return 'agora';
    if (seg < 3600) return `há ${Math.floor(seg / 60)} min`;
    if (seg < 86400) return `há ${Math.floor(seg / 3600)} h`;
    if (seg < 604800) return `há ${Math.floor(seg / 86400)} d`;
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  /**
   * Avatar com fallback para inicial
   */
  function renderAvatar(user, size = 36) {
    const inicial = (user.nome_completo || user.email || '?').charAt(0).toUpperCase();
    const url = user.avatar_url;
    const style = `width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-weight:600;font-size:${size * 0.4}px;color:white;background:linear-gradient(135deg,#5B6CFF,#1E4D40);overflow:hidden;flex-shrink:0`;
    if (url) return `<div style="${style}"><img src="${url}" style="width:100%;height:100%;object-fit:cover" alt="${user.nome_completo || ''}"></div>`;
    return `<div style="${style}">${inicial}</div>`;
  }

  /**
   * Card de Post para o feed
   */
  window.IconzaCard = {
    /**
     * Renderiza um post completo
     */
    post(post, opts = {}) {
      const { meuId = null, onCurtir = '', onComentar = '', onVer = '' } = opts;

      const autor = post.autor || {};
      const minhasCurtidas = post.minhas_curtidas || [];
      const jaCurti = minhasCurtidas.length > 0;

      const tipoBadge = post.tipo === 'marco' ?
        '<span class="iz-post-badge iz-post-badge--marco">⭐ Marco</span>' :
        post.tipo === 'pergunta' ?
        '<span class="iz-post-badge iz-post-badge--pergunta">? Pergunta</span>' :
        post.tipo === 'projeto' ?
        '<span class="iz-post-badge iz-post-badge--projeto">◆ Projeto</span>' :
        '';

      const fixado = post.fixado ?
        '<span class="iz-post-pinned">📌 Fixado pela criadora</span>' : '';

      return `
        <article class="iz-post" data-post-id="${post.id}">
          ${fixado}
          <div class="iz-post-header">
            ${renderAvatar(autor, 40)}
            <div class="iz-post-meta">
              <div class="iz-post-author">
                <span class="iz-post-author-name">${autor.nome_completo || 'Aluna ICONZA'}</span>
                ${autor.role === 'founder' ? '<span class="iz-post-badge-role">Criadora</span>' : ''}
                ${autor.role === 'admin' ? '<span class="iz-post-badge-role">Equipe</span>' : ''}
              </div>
              <div class="iz-post-time">
                <span>${tempoRelativo(post.created_at)}</span>
                ${tipoBadge}
              </div>
            </div>
            ${post.autor_id === meuId ? `
              <button class="iz-post-menu" onclick="IconzaCard.menu('${post.id}')" aria-label="Opções">
                ${window.icon('settings', { size: 16, stroke: 1.6 })}
              </button>
            ` : ''}
          </div>

          <div class="iz-post-content">
            <p class="iz-post-text">${escapeHtml(post.conteudo).replace(/\n/g, '<br>')}</p>
            ${post.imagem_url ? `<img src="${post.imagem_url}" class="iz-post-image" alt="">` : ''}
            ${post.link_url ? `<a href="${post.link_url}" target="_blank" class="iz-post-link">${post.link_url}</a>` : ''}
          </div>

          <div class="iz-post-footer">
            <button class="iz-post-action ${jaCurti ? 'is-active' : ''}" onclick="${onCurtir || `IconzaFeed.curtir('${post.id}')`}">
              <span class="iz-post-action-icon">
                ${window.icon('heart', { size: 16, stroke: 1.6 })}
              </span>
              <span class="iz-post-action-count">${post.total_curtidas || 0}</span>
            </button>
            <button class="iz-post-action" onclick="${onComentar || `IconzaFeed.abrirComentarios('${post.id}')`}">
              <span class="iz-post-action-icon">
                ${window.icon('users', { size: 16, stroke: 1.6 })}
              </span>
              <span class="iz-post-action-count">${post.total_comentarios || 0}</span>
            </button>
          </div>
        </article>
      `;
    },

    /**
     * Card de curso (para catálogo)
     */
    curso(curso, opts = {}) {
      const { matriculada = false, progresso = 0 } = opts;
      return `
        <article class="iz-card iz-card-curso" onclick="window.location.href='cursos.html?id=${curso.id}'">
          <div class="iz-card-cover" style="${curso.capa_url ? `background-image:url('${curso.capa_url}')` : ''}">
            ${!curso.capa_url ? `<div class="iz-card-placeholder">${(curso.titulo || '').charAt(0)}</div>` : ''}
            ${matriculada ? '<span class="iz-card-badge">EM ANDAMENTO</span>' : ''}
          </div>
          <div class="iz-card-body">
            ${curso.subtitulo ? `<p class="iz-card-eyebrow">${curso.subtitulo}</p>` : ''}
            <h3 class="iz-card-title">${curso.titulo}</h3>
            ${curso.descricao ? `<p class="iz-card-desc">${curso.descricao.substring(0, 100)}${curso.descricao.length > 100 ? '...' : ''}</p>` : ''}
            ${matriculada ? `
              <div class="iz-card-progress">
                <div class="iz-card-progress-bar"><span style="width:${progresso}%"></span></div>
                <span class="iz-card-progress-pct">${progresso}%</span>
              </div>
            ` : `
              <div class="iz-card-footer">
                <span class="iz-card-meta">${curso.total_aulas || 0} aulas</span>
                <span class="iz-card-price">${curso.tipo === 'gratuito' ? 'Gratuito' : `R$ ${Number(curso.preco || 0).toFixed(2)}`}</span>
              </div>
            `}
          </div>
        </article>
      `;
    },

    /**
     * Menu de opções do post (delete, editar)
     */
    menu(postId) {
      if (confirm('Deletar este post?')) {
        IconzaFeed.deletar(postId);
      }
    }
  };

  /**
   * Helper: escape HTML para prevenir XSS
   */
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.iconzaEscapeHtml = escapeHtml;
  window.iconzaTempoRelativo = tempoRelativo;
  window.iconzaRenderAvatar = renderAvatar;
})();
