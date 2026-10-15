const G = require('./gen.js');
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const r = {}; const ck = (k, c) => { r[k] = r[k] || [0, 0]; r[k][0]++; if (!c) r[k][1]++; };
for (let i = 0; i < 8000; i++) for (const t of ['6', '7']) {
  let it; try { it = G.GEN[t](); } catch (e) { ck(t + ' throw ' + e.message, false); continue; }
  const all = [it.q, it.sol, ...it.parts.flatMap((p) => [p.label, ...p.opts])].join(' ');
  ck(t + ' text', !/undefined|NaN|Infinity/.test(all));
  for (const p of it.parts) ck(t + ' uniq', new Set(p.opts).size === p.opts.length);
  const m = it.meta;
  if (m.sub === 'centroid') ck('6 centroid', (m.A[0] + m.B[0] + m.C[0]) === 3 * m.O[0] && (m.A[1] + m.B[1] + m.C[1]) === 3 * m.O[1]);
  if (t === '6' && m.sub === 'height') { const [a, b, c] = m.H; const ab = [m.B[0] - m.A[0], m.B[1] - m.A[1]]; ck('6 height', a * m.C[0] + b * m.C[1] + c === 0 && a * ab[1] - b * ab[0] === 0); }
  if (t === '6' && m.sub === 'sym') { const mid = [(m.M[0] + m.Ms[0]) / 2, (m.M[1] + m.Ms[1]) / 2]; const d = [m.Ms[0] - m.M[0], m.Ms[1] - m.M[1]]; ck('6 sym', m.n[0] * mid[0] + m.n[1] * mid[1] + m.c === 0 && d[0] * m.n[1] - d[1] * m.n[0] === 0); }
  if (m.sub === 'perpInt') { const [a, b, c] = m.ans; ck('6 perpInt', a * m.P[0] + b * m.P[1] + c === 0 && a * m.n3[0] + b * m.n3[1] === 0); }
  if (m.sub === 'ang45') { for (const k of [m.ka, m.kb]) ck('6 ang45', Math.abs(Math.abs((k - m.K) / (1 + m.K * k)) - 1) < 1e-9); }
  if (t === '6' && m.sub === undefined) {}
  if (m.q !== undefined && m.k1 !== undefined) ck('6 median angle', Math.abs(Math.abs((m.k2 - m.k1) / (1 + m.k1 * m.k2)) - m.q) < 1e-9);
  if (t === '7' && (m.sub === 'proj' || m.sub === 'sym')) { ck('7 H in plane', dot(m.n, m.H) + m.D === 0); const d = m.P.map((x, i) => x - m.H[i]); ck('7 PH ∥ n', d[0] * m.n[1] - d[1] * m.n[0] === 0 && d[1] * m.n[2] - d[2] * m.n[1] === 0); ck('7 sym mid', m.S.every((x, i) => x + m.P[i] === 2 * m.H[i])); }
  if (m.sub === 'inter') ck('7 inter', dot(m.n, m.Xp) + m.D === 0);
  if (m.sub === 'canon') ck('7 canon', dot(m.s, m.n1) === 0 && dot(m.s, m.n2) === 0 && dot(m.n1, m.Xp) + m.D1 === 0 && dot(m.n2, m.Xp) + m.D2 === 0);
  if (m.sub === 'projLine') {}
  if (t === '7' && m.P && m.Xp && m.s && !m.sub) {}
  if (t === '7' && it.title === 'Проекция точки на прямую') ck('7 projLine', dot(m.P.map((x, i) => x - m.Xp[i]), m.s) === 0);
}
console.log(r);
