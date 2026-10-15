const G = require('./gen.js');
const strip = (h) => h.replace(/<[^>]+>/g, '');
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const crossZero = (a, b) => Math.abs(a[1]*b[2]-a[2]*b[1]) + Math.abs(a[2]*b[0]-a[0]*b[2]) + Math.abs(a[0]*b[1]-a[1]*b[0]) < 1e-9;
const res = {};
const chk = (k, c) => { res[k] = res[k] || [0, 0]; res[k][0]++; if (!c) res[k][1]++; };
for (let i = 0; i < 20000; i++) {
  for (const t of ['1', '3', '4']) {
    const m = G.GEN[t]().meta;
    if (t === '3' && m.sub === 'perp') { const n2 = m.n2.slice(); n2[m.slot] = m.ans; chk('3 perp', Math.abs(dot(m.n1, n2)) < 1e-9); }
    if (t === '3' && m.sub === 'par') { const n2 = m.n2.slice(); n2[m.slot] = m.ans; chk('3 par', crossZero(m.n1, n2)); }
    if (t === '3' && m.sub === 'dist') { const d = Math.abs(dot(m.n, m.M) + m.D) / Math.hypot(...m.n); chk('3 dist', Math.abs(d - m.ans) < 1e-9); }
    if (t === '3' && m.sub === 'bis') { // random point on plane equidistant
      const [a, b, c] = m.n; let x, y, z; if (c !== 0) { x = Math.random() * 6; y = Math.random() * 6; z = -(a * x + b * y + m.D) / c; } else if (b !== 0) { x = Math.random() * 6; z = Math.random() * 6; y = -(a * x + m.D) / b; } else { y = Math.random() * 6; z = Math.random() * 6; x = -m.D / a; }
      const d1 = (x - m.P[0]) ** 2 + (y - m.P[1]) ** 2 + (z - m.P[2]) ** 2, d2 = (x - m.Q[0]) ** 2 + (y - m.Q[1]) ** 2 + (z - m.Q[2]) ** 2;
      chk('3 bis', Math.abs(d1 - d2) < 1e-7); }
    if (t === '4' && m.B) chk('4 two', m.s.every((v, i) => v === m.B[i] - m.P[i]));
    if (t === '4' && m.given) chk('4 par/perp', crossZero(m.s, m.given));
    if (t === '1' && m.sub === 'angle') { const kv = { '1': 1, '−1': -1 }[m.kH] ?? null; const tan = Math.tan(m.a * Math.PI / 180); const kNum = strip(m.kH).replace('−', '-'); let kk; if (kNum === '1') kk = 1; else if (kNum === '-1') kk = -1; else if (kNum === '√3') kk = Math.sqrt(3); else if (kNum === '-√3') kk = -Math.sqrt(3); else if (kNum === '√33') kk = Math.sqrt(3) / 3; else if (kNum === '-√33') kk = -Math.sqrt(3) / 3; chk('1 angle', Math.abs(tan - kk) < 1e-9); }
    if (t === '1' && m.sub === 'param') { const A1 = m.ans; if (m.want === 'perp') chk('1 param perp', Math.abs(A1 * m.A2 + m.B1 * m.B2) < 1e-9); else chk('1 param par', Math.abs(A1 * m.B2 - m.A2 * m.B1) < 1e-9); }
  }
}
console.log(res);
