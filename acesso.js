// ICONZA — Sistema de Acessibilidade
// Inclua no final de todas as páginas internas:
// <script src="acesso.js"></script>

(function() {

  // Injeta HTML do botão e painel
  document.body.insertAdjacentHTML('beforeend', `
    <button class="acesso-btn" id="acessoBtn" title="Acessibilidade" onclick="toggleAcesso()">⚙</button>
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
    </div>
  `);

  // Aplica preferências salvas ao carregar
  aplicarPreferencias();

  // Fecha ao clicar fora
  document.addEventListener('click', function(e) {
    const painel = document.getElementById('acessoPainel');
    const btn = document.getElementById('acessoBtn');
    if (painel && !painel.contains(e.target) && e.target !== btn) {
      painel.classList.remove('show');
    }
  });

})();

function toggleAcesso() {
  const painel = document.getElementById('acessoPainel');
  painel.classList.toggle('show');
}

function setFonte(tamanho) {
  document.body.classList.remove('fonte-pequena','fonte-media','fonte-grande');
  document.body.classList.add('fonte-' + tamanho);
  localStorage.setItem('iconza_fonte', tamanho);
  // Painel flutuante
  ['pequena','media','grande'].forEach(t => {
    const el = document.getElementById('opt-' + t);
    if (el) el.classList.toggle('ativo', t === tamanho);
  });
  // Topbar
  ['pequena','media','grande'].forEach(t => {
    const el = document.getElementById('tb-' + t);
    if (el) el.classList.toggle('ativo', t === tamanho);
  });
}

function setModo(modo) {
  if (modo === 'escuro') {
    document.body.classList.add('modo-escuro');
  } else {
    document.body.classList.remove('modo-escuro');
  }
  localStorage.setItem('iconza_modo', modo);
  // Painel flutuante
  ['claro','escuro'].forEach(m => {
    const el = document.getElementById('opt-' + m);
    if (el) el.classList.toggle('ativo', m === modo);
  });
  // Topbar
  ['claro','escuro'].forEach(m => {
    const el = document.getElementById('tb-' + m);
    if (el) el.classList.toggle('ativo', m === modo);
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
  // Padrão: fonte média
  setFonte('media');
}

function aplicarPreferencias() {
  const fonte = localStorage.getItem('iconza_fonte') || 'media';
  const modo  = localStorage.getItem('iconza_modo')  || 'claro';
  setFonte(fonte);
  setModo(modo);
}
