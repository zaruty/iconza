/* =====================================================
   ICONZA — CÉREBRO CRIATIVO PROCEDURAL
   Vanilla JS · SVG · Determinístico por seed
   Port direto do BrainNetwork.jsx do Claude Design
   ===================================================== */

(function() {
  'use strict';

  // PRNG determinístico (mesma seed = mesmo resultado)
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
        // Lobo cerebral esquerdo (denso)
        const a = rand() * Math.PI * 2;
        const rr = rMax * (0.10 + Math.pow(rand(), 0.6) * 0.60);
        x = cx - rMax * 0.22 + Math.cos(a) * rr * 0.55;
        y = cy + Math.sin(a) * rr * 0.88;
      } else {
        // Rede direita (expansiva)
        const a = (rand() - 0.5) * Math.PI * 1.6;
        const rr = rMax * (0.45 + rand() * 0.65);
        x = cx + Math.abs(Math.cos(a)) * rr * 0.95;
        y = cy + Math.sin(a) * rr * 0.95;
      }
      pts.push({ x, y, r: 1.2 + rand() * 1.4, hi: false, color: null });
    }

    // Nós destacados (cores ICONZA)
    const palette = [
      '#F28CA8', '#1E4D40', '#B8954A', '#3F7DCB',
      '#D9B23A', '#E25A6A', '#46A98B', '#5E8CC4', '#C8651F'
    ];
    const hiCount = 18;
    const indexed = pts
      .map((p, i) => ({ i, p }))
      .filter(({ p }) => p.x > cx - rMax * 0.1)
      .sort((a, b) => b.p.x - a.p.x);

    for (let k = 0; k < hiCount && k < indexed.length; k++) {
      const idx = indexed[Math.floor(rand() * Math.min(indexed.length, 60))].i;
      pts[idx].hi = true;
      pts[idx].r = 4 + rand() * 5;
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

  function genMassBlobs(seed, w, h) {
    const rand = mulberry32(seed + 1);
    const cx = w * 0.42;
    const cy = h * 0.5;
    const blobs = [];
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2;
      const rr = Math.min(w, h) * (0.10 + rand() * 0.22);
      const ox = Math.cos(a) * rr * 0.5;
      const oy = Math.sin(a) * rr * 0.7;
      blobs.push({
        cx: cx + ox,
        cy: cy + oy,
        rx: 38 + rand() * 50,
        ry: 38 + rand() * 50,
        op: 0.35 + rand() * 0.35,
      });
    }
    return blobs;
  }

  /**
   * Renderiza um Cérebro Criativo SVG
   * @param {object} opts
   * @param {number} opts.seed - Seed determinística
   * @param {number} opts.count - Quantidade de pontos
   * @param {number} opts.width - Largura
   * @param {number} opts.height - Altura
   * @param {string} opts.variant - 'hero' | 'compact'
   * @param {boolean} opts.showCircle - Mostra círculo de fundo
   * @param {boolean} opts.animate - Anima os nós destacados
   * @returns {string} SVG markup
   */
  window.IconzaBrain = function(opts = {}) {
    const {
      seed = 7,
      count = 110,
      width = 620,
      height = 560,
      variant = 'hero',
      showCircle = true,
      animate = true,
    } = opts;

    const pts = genBrainPoints(seed, count, width, height);
    const edges = genBrainEdges(pts, 3, width * 0.13);
    const blobs = variant === 'hero' ? genMassBlobs(seed, width, height) : [];

    const massEllipses = blobs.map((b, i) =>
      `<ellipse cx="${b.cx}" cy="${b.cy}" rx="${b.rx}" ry="${b.ry}" fill="url(#brainMass-${seed})" opacity="${b.op}"/>`
    ).join('');

    const mainMass = variant === 'hero' ? `
      <ellipse cx="${width * 0.42}" cy="${height * 0.5}" rx="${width * 0.28}" ry="${height * 0.42}"
               fill="url(#brainMass-${seed})" opacity="0.85"/>
      <ellipse cx="${width * 0.42}" cy="${height * 0.5}" rx="${width * 0.28}" ry="${height * 0.42}"
               fill="transparent" filter="url(#grain-${seed})"/>
    ` : '';

    const edgeLines = edges.map(([i, j]) =>
      `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[j].x}" y2="${pts[j].y}"/>`
    ).join('');

    const halos = pts.map((p, i) =>
      p.hi ? `<circle cx="${p.x}" cy="${p.y}" r="${p.r + 6}" fill="${p.color}" opacity="0.18"/>` : ''
    ).join('');

    const dots = pts.map((p, i) => {
      if (p.hi) {
        const delay = animate ? `style="animation-delay:${(i % 7) * 0.4}s"` : '';
        const cls = animate ? 'class="brain-node-anim"' : '';
        return `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="${p.color}" ${cls} ${delay}/>`;
      }
      return `<circle cx="${p.x}" cy="${p.y}" r="${p.r}" fill="#2A2823" opacity="0.7"/>`;
    }).join('');

    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block">
      <defs>
        <radialGradient id="brainMass-${seed}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#F4EDDD"/>
          <stop offset="55%" stop-color="#E9DFC9"/>
          <stop offset="100%" stop-color="#D9CCB0" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain-${seed}">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0.12 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      ${showCircle ? `<circle cx="${width * 0.55}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.46}" fill="rgba(214, 224, 218, 0.35)"/>` : ''}
      ${massEllipses}
      ${mainMass}
      <g stroke="rgba(22, 20, 15, 0.18)" stroke-width="0.6" fill="none">
        ${edgeLines}
      </g>
      ${halos}
      ${dots}
    </svg>`;
  };

  /**
   * Insere um cérebro em um container
   * @param {HTMLElement|string} target - elemento ou selector
   * @param {object} opts
   */
  window.renderBrain = function(target, opts = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    el.innerHTML = window.IconzaBrain(opts);
  };
})();
