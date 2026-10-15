const G = require('./gen.js');
// seeded RNG
let seed = 12345; G.setRandom(() => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; });
const fails = {}; const counts = {}; const titles = {};
const bad = (t, m) => { (fails[t] = fails[t] || []).push(m); };
const strip = (h) => h.replace(/<[^>]+>/g, '');
for (const t of Object.keys(G.GEN)) {
  counts[t] = 0; titles[t] = new Set();
  for (let i = 0; i < 4000; i++) {
    let it;
    try { it = G.GEN[t](); } catch (e) { bad(t, 'throw ' + e.message); continue; }
    if (!it) { bad(t, 'undefined item'); continue; }
    counts[t]++; titles[t].add(it.title);
    const all = [it.q, it.sol || '', ...it.parts.flatMap((p) => [p.label, ...p.opts])].join(' ');
    if (/undefined|NaN|Infinity|\[object/.test(all)) bad(t, 'bad text: ' + strip(all).slice(0, 200));
    for (const p of it.parts) {
      if (p.opts.length < 3) bad(t, 'few opts');
      if (new Set(p.opts).size !== p.opts.length) bad(t, 'dup opts: ' + p.opts.map(strip).join(' | '));
    }
    const m = it.meta || {};
    if (t === '5') { // correct plane contains M (and M2, M3)
      const v = m.n[0] * m.M[0] + m.n[1] * m.M[1] + m.n[2] * m.M[2] + m.D; if (v !== 0) bad(t, 'plane misses M');
      for (const P of [m.M2, m.M3]) if (P) { const w = m.n[0] * P[0] + m.n[1] * P[1] + m.n[2] * P[2] + m.D; if (w !== 0) bad(t, 'plane misses M2/M3'); }
    }
    if (t === '8' && m.kind !== 'par') { // canonical equivalent to original
      for (let k = 0; k < 4; k++) {
        const x = Math.random() * 10 - 5, y = Math.random() * 10 - 5;
        const orig = m.Px * x * x + m.Py * y * y - 2 * m.Px * m.h * x - 2 * m.Py * m.k * y + m.F;
        const sx = Math.sign(m.Px), sy = Math.sign(m.Py);
        const can = sx * (x - m.h) ** 2 / m.al + sy * (y - m.k) ** 2 / m.be - 1;
        if (Math.abs(orig - m.L * can) > 1e-7) { bad(t, 'canonical mismatch ' + JSON.stringify(m)); break; }
      }
    }
    if (t === '8' && m.kind === 'par') {
      for (let k = 0; k < 4; k++) {
        const x = Math.random() * 10 - 5, y = Math.random() * 10 - 5;
        const [a, b, ca, cb] = m.horiz ? [y, x, m.k, m.h] : [x, y, m.h, m.k];
        const orig = a * a - 2 * ca * a - m.twoP * b + m.C0;
        const can = (a - ca) ** 2 - m.twoP * (b - cb);
        if (Math.abs(orig - can) > 1e-7) { bad(t, 'parabola mismatch'); break; }
      }
    }
    if (t === '1' && m.line) { const [a, b, c] = m.line; if (a * m.A[0] + b * m.A[1] + c !== 0 || a * m.B[0] + b * m.B[1] + c !== 0) bad(t, 'line misses points'); }
  }
}
for (const t of Object.keys(counts)) console.log('№' + t, counts[t], 'ok-items; subtypes:', [...titles[t]].length, '; fails:', (fails[t] || []).length, (fails[t] || []).slice(0, 3));
// №2: проверка формул эллипса и гиперболы
{
  let bad2 = 0, n2 = 0, eqv = 0;
  for (let i = 0; i < 6000; i++) {
    const it = G.GEN['2'](); const m = it.meta;
    if (!m.kind) continue; n2++;
    if (m.kind === 'ell' && m.a * m.a !== m.b * m.b + m.c * m.c) bad2++;
    if (m.kind === 'hyp' && m.c * m.c !== m.a * m.a + m.b * m.b) bad2++;
    const txt = it.parts[0].opts.map((o) => o.replace(/<[^>]+>/g, ''));
    if (new Set(txt).size !== txt.length) eqv++;
  }
  console.log('№2 formula checks:', n2, 'bad:', bad2, 'text-dups:', eqv);
}
