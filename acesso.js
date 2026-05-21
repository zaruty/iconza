// ICONZA — Sistema de Acessibilidade v2
// Inclua no final de todas as páginas internas:
// <script src="acesso.js"></script>
// Guard: evita inicializar múltiplas vezes (ex: hot reload, navegação SPA)

(function() {
  // Idempotência: se já inicializou, não executa de novo
  if (window.__iconzaAcessoInit) return;
  window.__iconzaAcessoInit = true;

  // Injeta HTML apenas se ainda não existe
  if (!document.getElementById('acessoBtn')) {
    document.body.insertAdjacentHTML('beforeend', `
      <button class="acesso-btn" id="acessoBtn" title="Preferências" onclick="toggleAcesso()">⚙</button>
      <div class="acesso-painel" id="acessoPainel">
        <span class="acesso-titulo">Preferências</span>

        <div class="acesso-row">
          <span class="acesso-label">Tamanho da fonte</span>
          <div class="acesso-btns">
            <button class="acesso-opt" id="opt-pequena" onclick="setFonte('pequena')">A−</button>
            <button class="acesso-opt" id="opt-media"   onclick="setFonte('media')">A</button>
            <button class="acesso-opt" id="opt-grande"  onclick="setFonte('grande')">A+</button>
          </div>
        </div>

        <div class="acesso-row">
          <span class="acesso-label">Modo de visualização</span>
          <div class="acesso-btns">
            <button class="acesso-opt" id="opt-claro"  onclick="setModo('claro')">☀ Claro</button>
            <button class="acesso-opt" id="opt-escuro" onclick="setModo('escuro')">☾ Escuro</button>
          </div>
        </div>

        <div style="border-top:1px solid #e8e4de;padding-top:.8rem;margin-top:.2rem">
          <button onclick="resetAcesso()" style="width:100%;background:none;border:none;font-size:.62rem;color:#9a9490;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.08em;text-transform:uppercase">↺ Restaurar padrão</button>
        </div>

        <!-- SESSÃO — visível apenas no mobile onde sidebar fica oculta -->
        <div id="acessoSessaoBlock" style="border-top:1px solid #e8e4de;padding-top:.85rem;margin-top:.5rem;display:none">
          <div style="font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;color:#aaa;font-weight:600;margin-bottom:.5rem">Conta ativa</div>
          <div id="acessoSessaoEmail" style="font-size:.72rem;color:#666;margin-bottom:.65rem;word-break:break-all;line-height:1.4"></div>
          <button onclick="acessoTrocarConta()" style="width:100%;padding:.55rem;background:none;border:1px solid #e0dbd4;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:#888;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:.4rem;min-height:36px">↺ Trocar conta</button>
          <button onclick="acessoSair()" style="width:100%;padding:.55rem;background:#0a0a0a;border:none;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:#f5f2ee;cursor:pointer;font-family:'DM Sans',sans-serif;min-height:36px">Sair da conta</button>
        </div>
      </div>
    `);

    // Preenche sessão no painel — só no mobile (onde sidebar fica oculta)
    _preencherSessaoAcesso();
  }

  // Aplica preferências salvas ao carregar
  aplicarPreferencias();

  // Listener único: guarda referência para não duplicar
  // Usa AbortController para limpeza segura se necessário
  const _acessoController = new AbortController();
  document.addEventListener('click', function(e) {
    const painel = document.getElementById('acessoPainel');
    const btn = document.getElementById('acessoBtn');
    if (painel && painel.classList.contains('show') &&
        !painel.contains(e.target) && e.target !== btn) {
      painel.classList.remove('show');
    }
  }, { signal: _acessoController.signal });

  // Expõe cleanup para caso de navegação SPA futura
  window.__iconzaAcessoCleanup = () => {
    _acessoController.abort();
    window.__iconzaAcessoInit = false;
  };

  // Preenche email da sessão no painel de preferências
  async function _preencherSessaoAcesso() {
    // Só mostra no mobile (largura <= 768px)
    if (window.innerWidth > 768) return;
    try {
      const sb = window.sb;
      if (!sb) return;
      const { data } = await sb.auth.getSession();
      if (!data.session) return;
      const email = data.session.user.email;
      const bloco = document.getElementById('acessoSessaoBlock');
      const emailEl = document.getElementById('acessoSessaoEmail');
      if (bloco && emailEl) {
        emailEl.textContent = email;
        bloco.style.display = 'block';
      }
    } catch(e) {}
  }

})();

function toggleAcesso() {
  const painel = document.getElementById('acessoPainel');
  if (painel) painel.classList.toggle('show');
}

function setFonte(tamanho) {
  document.body.classList.remove('fonte-pequena','fonte-media','fonte-grande');
  document.body.classList.add('fonte-' + tamanho);
  localStorage.setItem('iconza_fonte', tamanho);
  ['pequena','media','grande'].forEach(t => {
    // Painel flutuante
    const el = document.getElementById('opt-' + t);
    if (el) el.classList.toggle('ativo', t === tamanho);
    // Topbar (se existir)
    const tb = document.getElementById('tb-' + t);
    if (tb) tb.classList.toggle('ativo', t === tamanho);
  });
}

function setModo(modo) {
  document.body.classList.toggle('modo-escuro', modo === 'escuro');
  localStorage.setItem('iconza_modo', modo);
  ['claro','escuro'].forEach(m => {
    const el = document.getElementById('opt-' + m);
    if (el) el.classList.toggle('ativo', m === modo);
    const tb = document.getElementById('tb-' + m);
    if (tb) tb.classList.toggle('ativo', m === modo);
  });
}

function resetAcesso() {
  localStorage.removeItem('iconza_fonte');
  localStorage.removeItem('iconza_modo');
  document.body.classList.remove('fonte-pequena','fonte-media','fonte-grande','modo-escuro');
  ['pequena','media','grande','claro','escuro'].forEach(id => {
    const el = document.getElementById('opt-' + id);
    if (el) el.classList.remove('ativo');
  });
  setFonte('media');
}

function aplicarPreferencias() {
  const fonte = localStorage.getItem('iconza_fonte') || 'media';
  const modo  = localStorage.getItem('iconza_modo')  || 'claro';
  // Aplica classes diretamente sem disparar eventos desnecessários
  document.body.classList.remove('fonte-pequena','fonte-media','fonte-grande');
  document.body.classList.add('fonte-' + fonte);
  document.body.classList.toggle('modo-escuro', modo === 'escuro');
  // Atualiza botões ativos
  ['pequena','media','grande'].forEach(t => {
    const el = document.getElementById('opt-' + t);
    if (el) el.classList.toggle('ativo', t === fonte);
  });
  ['claro','escuro'].forEach(m => {
    const el = document.getElementById('opt-' + m);
    if (el) el.classList.toggle('ativo', m === modo);
  });
}


// Sair da conta pelo painel de acessibilidade (mobile)
async function acessoSair() {
  try { if (window.sb) await window.sb.auth.signOut({ scope: 'local' }); } catch(e) {}
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('sb-') || k.startsWith('iconza')) localStorage.removeItem(k);
  });
  window.location.replace('login.html');
}

// Trocar conta pelo painel de acessibilidade (mobile)
async function acessoTrocarConta() {
  try { if (window.sb) await window.sb.auth.signOut({ scope: 'local' }); } catch(e) {}
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('sb-') || k.startsWith('iconza')) localStorage.removeItem(k);
  });
  window.location.replace('login.html');
}
