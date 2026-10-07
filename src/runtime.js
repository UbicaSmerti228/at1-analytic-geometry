(function () {
  'use strict';
  const { Plot2D, fmt } = window.GeoPlot;
  const { cos, sin, cosh, sinh, sqrt, PI, abs } = Math;

  /* ---------- theme tokens for canvas ---------- */
  const TOK = {};
  const readTok = () => {
    const s = getComputedStyle(document.documentElement);
    ['ink', 'soft', 'blue', 'red', 'green', 'amber', 'sheet', 'line'].forEach((k) => { TOK[k] = s.getPropertyValue('--' + k).trim() || '#000'; });
  };
  readTok();
  const themeCbs = [];
  const onTheme = () => { readTok(); themeCbs.forEach((f) => f()); };
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onTheme); } catch (e) { /* old Safari */ }
  try { new MutationObserver(onTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); } catch (e) {}

  const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  const frac = (p, q) => {
    if (q < 0) { p = -p; q = -q; }
    const g = gcd(p, q); p /= g; q /= g;
    const s = (p < 0 ? '−' : '') + abs(p);
    return q === 1 ? s : s + '/' + q;
  };
  const eqStr = (A, B, C) => {
    const parts = [];
    const term = (c, v) => {
      if (c === 0) return;
      const a = abs(c), sign = c < 0 ? '−' : '+';
      const body = (a === 1 && v) ? v : a + v;
      if (!parts.length) parts.push((c < 0 ? '−' : '') + body); else parts.push(sign + ' ' + body);
    };
    term(A, 'x'); term(B, 'y'); term(C, '');
    return (parts.join(' ') || '0') + ' = 0';
  };

  /* ---------- 1. General line explorer ---------- */
  function lineLab() {
    const root = document.getElementById('lab-line');
    if (!root) return;
    const ia = root.querySelector('#ln-a'), ib = root.querySelector('#ln-b'), ic = root.querySelector('#ln-c');
    const box = root.querySelector('#ln-plot'), read = root.querySelector('#ln-read');
    function render() {
      const A = +ia.value, B = +ib.value, C = +ic.value;
      root.querySelector('#ln-a-o').textContent = fmt(A);
      root.querySelector('#ln-b-o').textContent = fmt(B);
      root.querySelector('#ln-c-o').textContent = fmt(C);
      const p = new Plot2D({ xmin: -6, xmax: 6, ymin: -5, ymax: 5, width: 440, tickEvery: 2, idp: 'ln' });
      const facts = [];
      let kind = '';
      if (A === 0 && B === 0) {
        kind = 'Это не прямая';
        facts.push(C === 0 ? 'При A = B = C = 0 уравнению удовлетворяет любая точка плоскости.' : 'A и B одновременно равны нулю: получилось «' + fmt(C) + ' = 0», решений нет. У прямой хотя бы один из A, B не равен нулю.');
      } else {
        p.lineEq(A, B, C, 'st-blue thick');
        const L2 = A * A + B * B, L = sqrt(L2);
        const F0 = [-C * A / L2, -C * B / L2];
        const sc = 1.6 / L;
        p.arrow(F0, [F0[0] + A * sc, F0[1] + B * sc], 'red');
        p.text([F0[0] + A * sc, F0[1] + B * sc], 'n', { cls: 'c-red', b: true, it: true, dx: 6, dy: -4 });
        facts.push('Нормаль n = (' + fmt(A) + '; ' + fmt(B) + '), направляющий s = (' + fmt(-B) + '; ' + fmt(A) + ').');
        if (B !== 0) facts.push('Угловой коэффициент k = −A/B = ' + frac(-A, B) + ', прямая пересекает Oy в точке y = −C/B = ' + frac(-C, B) + '.');
        else facts.push('B = 0: прямая вертикальна, углового коэффициента нет.');
        if (C === 0 && A === 0) kind = 'A = C = 0 → это ось Ox (y = 0)';
        else if (C === 0 && B === 0) kind = 'B = C = 0 → это ось Oy (x = 0)';
        else if (C === 0) kind = 'C = 0 → прямая проходит через начало координат';
        else if (A === 0) kind = 'A = 0 → прямая параллельна оси Ox: y = ' + frac(-C, B);
        else if (B === 0) kind = 'B = 0 → прямая параллельна оси Oy: x = ' + frac(-C, A);
        else {
          kind = 'A, B, C ≠ 0 → уравнение в отрезках: x/a + y/b = 1';
          facts.push('Отрезки на осях: a = −C/A = ' + frac(-C, A) + ', b = −C/B = ' + frac(-C, B) + '.');
          const a = -C / A, b = -C / B;
          if (abs(a) <= 6) p.point([a, 0], 'a', { cls: 'red', lcls: 'c-red', dx: 4, dy: 16 });
          if (abs(b) <= 5) p.point([0, b], 'b', { cls: 'red', lcls: 'c-red', dx: 8, dy: -4 });
        }
      }
      box.innerHTML = p.svg('Прямая ' + eqStr(A, B, C));
      read.innerHTML = '';
      const add = (cls, t) => { const d = document.createElement('div'); d.className = cls; d.textContent = t; read.appendChild(d); };
      add('big', eqStr(A, B, C));
      add('kind', kind);
      facts.forEach((f) => add('', f));
    }
    [ia, ib, ic].forEach((i) => i.addEventListener('input', render));
    themeCbs.push(() => {});
    render();
  }

  /* ---------- 2. Eccentricity explorer ---------- */
  function eccLab() {
    const root = document.getElementById('lab-ecc');
    if (!root) return;
    const inp = root.querySelector('#ecc-e'), out = root.querySelector('#ecc-e-o');
    const box = root.querySelector('#ecc-plot'), read = root.querySelector('#ecc-read');
    const d = 2;
    function render() {
      let e = +inp.value;
      if (abs(e - 1) < 0.026) e = 1;
      out.textContent = e.toFixed(2).replace('.', ',');
      const p = new Plot2D({ xmin: -3.4, xmax: 6.6, ymin: -4, ymax: 4, width: 460, tickEvery: 2, idp: 'ecc' });
      p.lineEq(1, 0, d, 'st-red dash');
      p.text([-d, 3.8], 'директриса', { cls: 'c-red', small: true, dx: 5, dy: 6 });
      const fn = (t) => {
        const den = 1 - e * cos(t);
        if (abs(den) < 1e-3) return null;
        const r = e * d / den;
        return [r * cos(t), r * sin(t)];
      };
      p.curve(fn, -PI, PI, 900, 'st-blue thick');
      const t0 = 2 * PI / 3, r0 = e * d / (1 - e * cos(t0));
      const P = [r0 * cos(t0), r0 * sin(t0)], D = [-d, P[1]];
      p.seg(P, [0, 0], 'st-green thick').seg(P, D, 'st-ink thick');
      p.point([0, 0], 'F', { cls: 'red', lcls: 'c-red', dx: 6, dy: 18 });
      p.point(P, 'M', { dx: 6, dy: -8, cls: 'green' });
      p.point(D, 'D', { dx: -6, dy: -6, anchor: 'end' });
      box.innerHTML = p.svg('Коника с эксцентриситетом ' + e);
      const mf = Math.hypot(P[0], P[1]), md = abs(P[0] + d);
      let kind;
      if (e < 1) kind = 'e < 1 → эллипс: кривая замкнута';
      else if (e === 1) kind = 'e = 1 → парабола: |MF| = |MD|, кривая уходит в бесконечность одной ветвью';
      else kind = 'e > 1 → гипербола: две ветви (вторая — слева от директрисы)';
      read.innerHTML = '';
      const add = (cls, t) => { const el = document.createElement('div'); el.className = cls; el.textContent = t; read.appendChild(el); };
      add('kind', kind);
      add('big', '|MF| = ' + mf.toFixed(2).replace('.', ',') + ',  |MD| = ' + md.toFixed(2).replace('.', ',') + ',  |MF| / |MD| = ' + (mf / md).toFixed(2).replace('.', ','));
    }
    inp.addEventListener('input', render);
    render();
  }

  /* ---------- 3. 3D surfaces ---------- */
  const grid = (f, [u0, u1, nu], [v0, v1, nv], fine = 40) => {
    const lines = [];
    for (let i = 0; i <= nu; i++) { const u = u0 + (u1 - u0) * i / nu; const pts = []; for (let j = 0; j <= fine; j++) pts.push(f(u, v0 + (v1 - v0) * j / fine)); lines.push(pts); }
    for (let j = 0; j <= nv; j++) { const v = v0 + (v1 - v0) * j / nv; const pts = []; for (let i = 0; i <= fine; i++) pts.push(f(u0 + (u1 - u0) * i / fine, v)); lines.push(pts); }
    return lines;
  };
  const crv = (f, t0, t1, n = 90) => { const pts = []; for (let i = 0; i <= n; i++) pts.push(f(t0 + (t1 - t0) * i / n)); return pts; };
  const T = 2 * PI;
  const SURF = {
    ellipsoid: { R: 2.2, mesh: () => grid((u, v) => [2.2 * cos(v) * cos(u), 1.5 * cos(v) * sin(u), 1.2 * sin(v)], [0, T, 24], [-PI / 2, PI / 2, 10]),
      hl: () => [{ c: 'red', p: crv((t) => [2.2 * cos(t), 1.5 * sin(t), 0], 0, T) }, { c: 'green', p: crv((t) => [0, 1.5 * cos(t), 1.2 * sin(t)], 0, T) }] },
    hyp1: { R: 2.3, mesh: () => grid((u, v) => [cosh(v) * cos(u), cosh(v) * sin(u), 1.2 * sinh(v)], [0, T, 24], [-1.25, 1.25, 10]),
      hl: () => [{ c: 'red', p: crv((t) => [cos(t), sin(t), 0], 0, T) }, { c: 'green', p: crv((t) => [0, cosh(t), 1.2 * sinh(t)], -1.25, 1.25) }, { c: 'green', p: crv((t) => [0, -cosh(t), 1.2 * sinh(t)], -1.25, 1.25) }] },
    hyp2: { R: 2.2, mesh: () => grid((u, v) => [sinh(v) * cos(u), sinh(v) * sin(u), cosh(v)], [0, T, 24], [0, 1.35, 7]).concat(grid((u, v) => [sinh(v) * cos(u), sinh(v) * sin(u), -cosh(v)], [0, T, 24], [0, 1.35, 7])),
      hl: () => [{ c: 'red', p: crv((t) => [sqrt(1.56) * cos(t), sqrt(1.56) * sin(t), 1.6], 0, T) }, { c: 'green', p: crv((t) => [0, sinh(t), cosh(t)], -1.35, 1.35) }, { c: 'green', p: crv((t) => [0, sinh(t), -cosh(t)], -1.35, 1.35) }] },
    cone: { R: 2.1, mesh: () => grid((u, v) => [v * cos(u), v * sin(u), v], [0, T, 24], [-1.7, 1.7, 10]),
      hl: () => [{ c: 'red', p: crv((t) => [1.2 * cos(t), 1.2 * sin(t), 1.2], 0, T) }, { c: 'green', p: crv((t) => [0, t, t], -1.7, 1.7) }, { c: 'green', p: crv((t) => [0, t, -t], -1.7, 1.7) }] },
    ellpar: { R: 2.1, mesh: () => grid((u, v) => [v * cos(u), v * sin(u), v * v / 2], [0, T, 24], [0, 2, 8]),
      hl: () => [{ c: 'red', p: crv((t) => [1.6 * cos(t), 1.6 * sin(t), 1.28], 0, T) }, { c: 'green', p: crv((t) => [0, t, t * t / 2], -2, 2) }] },
    hyppar: { R: 2.2, mesh: () => grid((x, y) => [x, y, (x * x - y * y) / 2], [-1.8, 1.8, 12], [-1.8, 1.8, 12]),
      hl: () => [{ c: 'red', p: crv((t) => [t, 0, t * t / 2], -1.8, 1.8) }, { c: 'green', p: crv((t) => [0, t, -t * t / 2], -1.8, 1.8) }, { c: 'amber', p: crv((t) => [t, t, 0], -1.8, 1.8) }, { c: 'amber', p: crv((t) => [t, -t, 0], -1.8, 1.8) }] },
    ellcyl: { R: 2.2, mesh: () => grid((u, v) => [2 * cos(u), sin(u), v], [0, T, 24], [-1.5, 1.5, 6]),
      hl: () => [{ c: 'red', p: crv((t) => [2 * cos(t), sin(t), 0], 0, T) }, { c: 'green', p: crv((t) => [0, 1, t], -1.5, 1.5) }, { c: 'green', p: crv((t) => [0, -1, t], -1.5, 1.5) }] },
    hypcyl: { R: 2.3, mesh: () => grid((z, v) => [cosh(v), sinh(v), z], [-1.5, 1.5, 6], [-1.4, 1.4, 10]).concat(grid((z, v) => [-cosh(v), sinh(v), z], [-1.5, 1.5, 6], [-1.4, 1.4, 10])),
      hl: () => [{ c: 'red', p: crv((t) => [cosh(t), sinh(t), 0], -1.4, 1.4) }, { c: 'red', p: crv((t) => [-cosh(t), sinh(t), 0], -1.4, 1.4) }] },
    parcyl: { R: 2.1, mesh: () => grid((x, y) => [x, y, y * y], [-2, 2, 8], [-1.45, 1.45, 10]),
      hl: () => [{ c: 'red', p: crv((t) => [0, t, t * t], -1.45, 1.45) }, { c: 'green', p: crv((t) => [t, 1, 1], -2, 2) }, { c: 'green', p: crv((t) => [t, -1, 1], -2, 2) }, { c: 'amber', p: crv((t) => [t, 0, 0], -2, 2) }] }
  };
  const reduced = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();

  function Viewer(el) {
    const cv = el.querySelector('canvas');
    const ctx = cv.getContext('2d');
    const btn = el.querySelector('.spin');
    let key = el.dataset.surface, mesh = [], hl = [], R = 2.2;
    let theta = -125, phi = 22, spinning = !reduced, visible = false, raf = 0, lastT = 0, holdUntil = 0;
    const setSurf = (k) => { key = k; const s = SURF[k]; mesh = s.mesh(); hl = s.hl(); R = s.R; draw(); };
    function size() {
      const w = cv.clientWidth || 600;
      const h = Math.round(Math.min(Math.max(w * 0.9, 280), 430));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return [w, h];
    }
    let W = 600, H = 360;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = theta * PI / 180, p = phi * PI / 180;
      const ct = cos(t), st = sin(t), cp = cos(p), sp = sin(p);
      const cx = W / 2, cy = H / 2 + H * 0.04;
      const sc = Math.min(W * 0.44, (cy - 20) / 1.32) / R;
      const P = (v) => { const x1 = v[0] * ct - v[1] * st, y1 = v[0] * st + v[1] * ct; return [cx + sc * x1, cy - sc * (v[2] * cp + y1 * sp), y1 * cp - v[2] * sp]; };
      const alpha = (dep) => Math.max(0.12, Math.min(0.95, 0.55 - 0.4 * dep / R));
      // axes
      const L = R * 1.25;
      ctx.lineWidth = 1.2; ctx.strokeStyle = TOK.ink; ctx.fillStyle = TOK.ink;
      ctx.font = 'italic 15px Literata, Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      [[1, 0, 0, 'x'], [0, 1, 0, 'y'], [0, 0, 1, 'z']].forEach(([a, b, c, n]) => {
        const s0 = P([-a * L * 0.55, -b * L * 0.55, -c * L * 0.55]), s1 = P([a * L, b * L, c * L]);
        ctx.globalAlpha = 0.55; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(s0[0], s0[1]); ctx.lineTo(cx + 0, cy + 0); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 0.9;
        const o = P([0, 0, 0]);
        ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(s1[0], s1[1]); ctx.stroke();
        const ang = Math.atan2(s1[1] - o[1], s1[0] - o[0]);
        ctx.beginPath(); ctx.moveTo(s1[0], s1[1]);
        ctx.lineTo(s1[0] - 9 * cos(ang) + 4 * sin(ang), s1[1] - 9 * sin(ang) - 4 * cos(ang));
        ctx.lineTo(s1[0] - 9 * cos(ang) - 4 * sin(ang), s1[1] - 9 * sin(ang) + 4 * cos(ang)); ctx.closePath(); ctx.fill();
        const lp = P([a * L * 1.1, b * L * 1.1, c * L * 1.1]);
        ctx.fillText(n, lp[0], lp[1]);
      });
      // mesh
      ctx.lineWidth = 1; ctx.strokeStyle = TOK.blue;
      for (const line of mesh) {
        let prev = P(line[0]);
        for (let i = 1; i < line.length; i++) {
          const cur = P(line[i]);
          ctx.globalAlpha = alpha((prev[2] + cur[2]) / 2);
          ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(cur[0], cur[1]); ctx.stroke();
          prev = cur;
        }
      }
      // highlighted sections
      ctx.lineWidth = 3;
      for (const h of hl) {
        ctx.strokeStyle = TOK[h.c];
        let prev = P(h.p[0]);
        for (let i = 1; i < h.p.length; i++) {
          const cur = P(h.p[i]);
          ctx.globalAlpha = Math.max(0.45, alpha((prev[2] + cur[2]) / 2) + 0.15);
          ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(cur[0], cur[1]); ctx.stroke();
          prev = cur;
        }
      }
      ctx.globalAlpha = 1;
    }
    function resize() { [W, H] = size(); draw(); }
    function loop(ts) {
      raf = 0;
      if (!visible || !spinning) return;
      const dt = lastT ? Math.min(ts - lastT, 50) : 16; lastT = ts;
      if (performance.now() > holdUntil) { theta += dt * 0.018; draw(); }
      raf = requestAnimationFrame(loop);
    }
    const kick = () => { if (!raf && visible && spinning) { lastT = 0; raf = requestAnimationFrame(loop); } };
    // pointer
    let drag = null;
    cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} cv.style.cursor = 'grabbing'; holdUntil = performance.now() + 2500; });
    cv.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      theta -= dx * 0.5;
      if (e.pointerType === 'mouse') phi = Math.max(-5, Math.min(75, phi + dy * 0.35));
      holdUntil = performance.now() + 2500;
      draw();
    });
    const end = () => { drag = null; cv.style.cursor = ''; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    if (btn) {
      const label = () => { btn.textContent = spinning ? 'Пауза' : 'Вращать'; };
      label();
      btn.addEventListener('click', () => { spinning = !spinning; label(); kick(); });
    }
    try {
      new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; kick(); }, { threshold: 0.05 }).observe(cv);
    } catch (e) { visible = true; }
    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
    themeCbs.push(draw);
    setSurf(key);
    resize();
    kick();
    return { setSurf };
  }

  function surfLab() {
    const viewers = {};
    document.querySelectorAll('.viewer').forEach((el) => { viewers[el.dataset.viewer] = Viewer(el); });
    const lab = document.getElementById('lab-surf');
    if (!lab || !viewers.gallery) return;
    const btns = lab.querySelectorAll('.chips button');
    btns.forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.s;
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      lab.querySelectorAll('.sdesc').forEach((d) => { d.hidden = d.dataset.desc !== k; });
      viewers.gallery.setSurf(k);
    }));
  }

  /* ---------- 4. Checklist ---------- */
  function checklist() {
    const KEY = 'at1-geom-checklist-v1';
    const inputs = Array.from(document.querySelectorAll('#check input[type=checkbox]'));
    if (!inputs.length) return;
    let state = {};
    try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
    const bar = document.getElementById('ck-bar'), txt = document.getElementById('ck-text');
    function update() {
      const done = inputs.filter((i) => i.checked).length;
      bar.style.width = (100 * done / inputs.length) + '%';
      txt.textContent = done === inputs.length ? 'Готов к АТ: ' + done + ' из ' + inputs.length + ' ✓' : 'Готово ' + done + ' из ' + inputs.length;
      document.querySelectorAll('#check small[data-g]').forEach((s) => {
        const g = inputs.filter((i) => i.dataset.g === s.dataset.g);
        s.textContent = g.filter((i) => i.checked).length + '/' + g.length;
      });
    }
    inputs.forEach((i) => { i.checked = !!state[i.id]; i.addEventListener('change', () => { state[i.id] = i.checked; save(); update(); }); });
    const reset = document.getElementById('ck-reset');
    let armed = false, timer = 0;
    reset.addEventListener('click', () => {
      if (!armed) { armed = true; reset.textContent = 'Точно сбросить? Нажми ещё раз'; timer = setTimeout(() => { armed = false; reset.textContent = 'Сбросить отметки'; }, 3500); return; }
      clearTimeout(timer); armed = false; reset.textContent = 'Сбросить отметки';
      inputs.forEach((i) => { i.checked = false; }); state = {}; save(); update();
    });
    update();
  }

  const start = () => { lineLab(); eccLab(); surfLab(); checklist(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
