/* =====================================================
   ICONZA — CÉREBRO NEURAL v4.0
   Premium · Elegante · Refinado · Cinematográfico
   Linhas finas · Glow sutil · Paleta cool
   ===================================================== */

(function() {
  'use strict';

  // PRNG determinístico
  function mulberry32(a) {
    return function() {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function genBrainPoints(seed, count, w, h) {
    const rand = mulberry32(seed);
    const cx = w * 0.5;
    const cy = h * 0.5;
    const rMax = Math.min(w, h) * 0.45;
    const pts = [];

    for (let i = 0; i < count; i++) {
      let x, y;
      if (i < count * 0.55) {
        const a = rand() * Math.PI * 2;
        const rr = rMax * (0.10 + Math.pow(rand(), 0.6) * 0.60);
        x = cx - rMax * 0.22 + Math.cos(a) * rr * 0.55;
        y = cy + Math.sin(a) * rr * 0.88;
      } else {
        const a = (rand() - 0.5) * Math.PI * 1.6;
        const rr = rMax * (0.45 + rand() * 0.65);
        x = cx + Math.abs(Math.cos(a)) * rr * 0.95;
        y = cy + Math.sin(a) * rr * 0.95;
      }
      // Pontos menores e mais elegantes
      pts.push({ x, y, r: 0.8 + rand() * 1.0, hi: false, color: null });
    }

    // Paleta refinada premium (frio + sofisticado)
    const palette = [
      '#5B6CFF', // índigo accent
      '#3A6B7C', // azul oceano profundo
      '#B89968', // dourado frio
      '#1E4D40', // verde profundo
      '#5C8A6B', // sálvia
      '#8B4A6B', // bordô discreto
      '#2A4356', // azul noite
      '#A8A29E', // taupe neutro
    ];

    const hiCount = 14; // menos nós destacados, mais elegante
    const indexed = pts
      .map((p, i) => ({ i, p }))
      .filter(({ p }) => p.x > cx - rMax * 0.1)
      .sort((a, b) => b.p.x - a.p.x);

    for (let k = 0; k < hiCount && k < indexed.length; k++) {
      const idx = indexed[Math.floor(rand() * Math.min(indexed.length, 60))].i;
      pts[idx].hi = true;
      pts[idx].r = 3 + rand() * 3; // nós destacados menores
      pts[idx].color = palette[k % palette.length];
    }
    return pts;
  }

  function genBrainEdges(pts, maxNeighbors, maxDist) {
    const edges = [];
    const used = new Set();
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const cands = [];
      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue;
        const b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxDist) cands.push({ j, d });
      }
      cands.sort((x, y) => x.d - y.d);
      cands.slice(0, maxNeighbors).forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!used.has(key)) {
          used.add(key);
          edges.push([i, j]);
        }
      });
    }
    return edges;
  }

  /**
   * Renderiza Cérebro Neural Premium
   */
  window.IconzaBrain = function(opts = {}) {
    const {
      seed = 7,
      count = 90,
      width = 620,
      height = 500,
      variant = 'hero',
      showCircle = false,
      animate = true,
      theme = 'light', // 'light' | 'dark'
    } = opts;

    const pts = genBrainPoints(seed, count, width, height);
    const edges = genBrainEdges(pts, 3, width * 0.13);

    // Cores baseadas no tema
    const isDark = theme === 'dark';
    const edgeColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(11, 13, 15, 0.12)';
    const baseNodeColor = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(11, 13, 15, 0.35)';
    const massColor = isDark ? 'rgba(91, 108, 255, 0.06)' : 'rgba(91, 108, 255, 0.04)';

    // Massa cerebral (apenas hero, gradient sutil)
    const massBlob = variant === 'hero' ? `
      <defs>
        <radialGradient id="mass-${seed}" cx="42%" cy="50%" r="40%">
          <stop offset="0%" stop-color="${isDark ? 'rgba(91, 108, 255, 0.08)' : 'rgba(91, 108, 255, 0.06)'}"/>
          <stop offset="60%" stop-color="${massColor}"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <ellipse cx="${width * 0.42}" cy="${height * 0.5}"
               rx="${width * 0.32}" ry="${height * 0.42}"
               fill="url(#mass-${seed})"/>
    ` : '';

    // Edges (linhas finas premium)
    const edgeLines = edges.map(([i, j]) =>
      `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[j].x}" y2="${pts[j].y}"/>`
    ).join('');

    // Halos sutis em torno dos nós destacados
    const halos = pts.map((p, i) =>
      p.hi ? `<circle cx="${p.x}" cy="${p.y}" r="${p.r + 4}" fill="${p.color}" opacity="0.12"/>` : ''
    ).join('');

    // Nós
    const dots = pts.map((p, i) => {
      if (p.hi) {
        const delay = animate ? `style="animation-delay:${(i % 7) * 0.4}s"` : '';
        const cls = animate ? 'class="brain-node-anim"' : '';
        return `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="${p.color}" ${cls} ${delay}/>`;
      }
      return `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="${baseNodeColor}"/>`;
    }).join('');

    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block">
      ${massBlob}
      <g stroke="${edgeColor}" stroke-width="0.5" fill="none">
        ${edgeLines}
      </g>
      ${halos}
      ${dots}
    </svg>`;
  };

  window.renderBrain = function(target, opts = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    el.innerHTML = window.IconzaBrain(opts);
  };
})();
