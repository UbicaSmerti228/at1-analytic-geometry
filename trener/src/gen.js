/* Генераторы задач тренажёра АТ №1. Каждый вызов даёт новую задачу:
   { title, q, parts:[{label, opts:[html], ok:0, why:{idx:text}}], sol, plot? , meta }
   Варианты ответа: opts[0] — правильный, остальные — типичные ошибки (движок перемешивает). */
(function (root) {
  'use strict';
  /* ---------- арифметика ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  class Q {
    constructor(p, q = 1) { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q); this.p = p / g; this.q = q / g; }
    static of(x) { return x instanceof Q ? x : new Q(x, 1); }
    add(o) { o = Q.of(o); return new Q(this.p * o.q + o.p * this.q, this.q * o.q); }
    sub(o) { o = Q.of(o); return new Q(this.p * o.q - o.p * this.q, this.q * o.q); }
    mul(o) { o = Q.of(o); return new Q(this.p * o.p, this.q * o.q); }
    div(o) { o = Q.of(o); return new Q(this.p * o.q, this.q * o.p); }
    neg() { return new Q(-this.p, this.q); }
    eq(o) { o = Q.of(o); return this.p === o.p && this.q === o.q; }
    get v() { return this.p / this.q; }
  }
  let rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const nz = (a, b) => { let x = 0; while (x === 0) x = ri(a, b); return x; };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const wpick = (pairs) => { const t = pairs.reduce((s, p) => s + p[1], 0); let r = rnd() * t; for (const [v, w] of pairs) { r -= w; if (r < 0) return v; } return pairs[0][0]; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const gcdN = (v) => v.reduce((g, x) => gcd(g, x), 0) || 1;
  const reduce = (v) => { const g = gcdN(v); let r = v.map((x) => x / g); const f = r.find((x) => x !== 0); if (f < 0) r = r.map((x) => -x); return r.map((x) => x + 0); };
  const add3 = (a, b) => a.map((x, i) => x + b[i]);
  const sub3 = (a, b) => a.map((x, i) => x - b[i]);
  const neg3 = (a) => a.map((x) => -x + 0);
  const eqv = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

  /* ---------- оформление формул (HTML) ---------- */
  const MI = '−';
  const I = (s) => `<i>${s}</i>`;
  const X = I('x'), Y = I('y'), Z = I('z'), T = I('t');
  const SUP = (b, e) => `${b}<sup>${e}</sup>`;
  const FR = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
  const SQRT = (x) => `<span class="sq">√<span>${x}</span></span>`;
  const num = (x) => { x = Q.of(x); const s = x.p < 0 ? MI : ''; const a = Math.abs(x.p); return x.q === 1 ? s + a : s + FR(a, x.q); };
  const mag = (q, body) => { q = Q.of(q); const a = new Q(Math.abs(q.p), q.q); if (!body) return num(a); if (a.eq(1)) return body; return (a.q === 1 ? a.p : FR(a.p, a.q)) + body; };
  function lin(terms, c) {
    const parts = [];
    for (const [k, b] of terms) { const q = Q.of(k); if (q.p === 0) continue; parts.push([q.p < 0, mag(q, b)]); }
    if (c !== undefined && c !== null) { const q = Q.of(c); if (q.p !== 0) parts.push([q.p < 0, mag(q, '')]); }
    if (!parts.length) return '0';
    return parts.map(([n, m], i) => (i === 0 ? (n ? MI : '') + m : (n ? ` ${MI} ` : ' + ') + m)).join('');
  }
  const sh = (v, a) => { a = Q.of(a); if (a.p === 0) return v; return a.p > 0 ? `${v} ${MI} ${num(a)}` : `${v} + ${num(a.neg())}`; };
  const sqs = (v, a) => (Q.of(a).p === 0 ? SUP(v, 2) : SUP(`(${sh(v, a)})`, 2));
  const pt = (P) => `(${P.map(num).join('; ')})`;
  const vec = (P) => `(${P.map(num).join('; ')})`;
  const plane = (n, D) => `${lin([[n[0], X], [n[1], Y], [n[2], Z]], D)} = 0`;
  const line2 = (A, B, C) => `${lin([[A, X], [B, Y]], C)} = 0`;
  const canon = (P, s) => [X, Y, Z].map((v, i) => FR(sh(v, P[i]), num(s[i]))).join(' = ');
  const comp = (p0, k) => { const parts = []; if (p0 !== 0) parts.push([p0 < 0, String(Math.abs(p0))]); if (k !== 0) parts.push([k < 0, mag(k, T)]); if (!parts.length) return '0'; return parts.map(([n, m], i) => (i === 0 ? (n ? MI : '') + m : (n ? ` ${MI} ` : ' + ') + m)).join(''); };
  const param = (P, s) => [X, Y, Z].map((v, i) => `${v} = ${comp(P[i], s[i])}`).join(', ');
  const shiftTerms = (n, P, vars) => n.map((k, i) => [k, Q.of(P[i]).p === 0 ? vars[i] : `(${sh(vars[i], P[i])})`]);
  const step = (i, html) => `<div class="st"><b>${i}</b><div>${html}</div></div>`;
  const ok = (html) => `<div class="okline">✓ ${html}</div>`;
  const uniq = (arr) => new Set(arr).size === arr.length;
  const deg = (s) => `${s}°`;

  /* =====================================================================
     №5 · плоскость через точку
     ===================================================================== */
  function g5() {
    for (let t = 0; t < 200; t++) {
      const sub = wpick([['perpCanon', 4], ['perpParam', 2], ['parallel', 2], ['three', 2]]);
      const M = [ri(-4, 4), ri(-4, 4), ri(-4, 4)];
      if (sub === 'perpCanon' || sub === 'perpParam') {
        const s = [ri(1, 5), nz(-5, 5), nz(-5, 5)];
        if (gcdN(s) !== 1) continue;
        const L = [ri(-5, 5), ri(-5, 5), ri(-5, 5)];
        if (eqv(L, M) || dot(s, M) === 0 || dot(s, L) === dot(s, M)) continue;
        const lineH = sub === 'perpCanon' ? canon(L, s) : param(L, s);
        const D = -dot(s, M);
        const n3 = [s[0], -s[1], s[2]];
        const opts = [plane(s, D), plane(s, -D), plane(s, -dot(s, L)), plane(n3, -dot(n3, M))];
        if (!uniq(opts)) continue;
        return {
          title: sub === 'perpCanon' ? 'Плоскость ⊥ прямой (каноническое уравнение)' : 'Плоскость ⊥ прямой (параметрическое уравнение)',
          q: `Составить уравнение плоскости, проходящей через точку <i>M</i><sub>0</sub>${pt(M)} перпендикулярно прямой<div class="eq">${lineH}</div>`,
          parts: [{ label: 'Ответ:', opts, why: {
            1: 'Ошибка в знаке свободного члена. При раскрытии A(x − x₀) получается −A·x₀, а не +A·x₀.',
            2: 'Подставлена точка прямой. Плоскость должна проходить через M₀, поэтому в скобках координаты M₀.',
            3: 'Нормаль — это направляющий вектор прямой ровно как есть, со своими знаками.' } }],
          sol: step(1, `Плоскость ⊥ прямой, значит нормаль плоскости — направляющий вектор прямой (${sub === 'perpCanon' ? 'знаменатели' : 'коэффициенты при <i>t</i>'}): <b>n</b> = ${vec(s)}.`) +
            step(2, `<i>A</i>(<i>x</i> − <i>x</i>₀) + <i>B</i>(<i>y</i> − <i>y</i>₀) + <i>C</i>(<i>z</i> − <i>z</i>₀) = 0:<div class="eq">${lin(shiftTerms(s, M, [X, Y, Z]))} = 0</div>`) +
            step(3, `Раскрываем скобки: <div class="eq">${opts[0]}</div>`) +
            ok(`Проверка: подставь M₀ — получится ${num(dot(s, M))} ${D < 0 ? MI : '+'} ${Math.abs(D)} = 0.`),
          meta: { type: '5', n: s, D, M }
        };
      }
      if (sub === 'parallel') {
        const n = [ri(1, 5), nz(-5, 5), nz(-5, 5)];
        if (gcdN(n) !== 1) continue;
        const D0 = nz(-9, 9), D = -dot(n, M);
        if (D0 === D || D === 0 || D0 === -D) continue;
        const n3 = [n[0], n[1], -n[2]];
        const opts = [plane(n, D), plane(n, -D), plane(n, D0), plane(n3, -dot(n3, M))];
        if (!uniq(opts)) continue;
        return {
          title: 'Плоскость ∥ данной плоскости',
          q: `Составить уравнение плоскости, проходящей через точку <i>M</i><sub>0</sub>${pt(M)} параллельно плоскости<div class="eq">${plane(n, D0)}</div>`,
          parts: [{ label: 'Ответ:', opts, why: {
            1: 'Ошибка в знаке свободного члена: −A·x₀ − B·y₀ − C·z₀.',
            2: 'Это и есть данная плоскость — она не проходит через M₀. Нужна та же нормаль, но новый свободный член.',
            3: 'У параллельных плоскостей нормаль та же самая — все знаки сохраняются.' } }],
          sol: step(1, `Параллельные плоскости имеют одну нормаль: <b>n</b> = ${vec(n)}.`) +
            step(2, `<div class="eq">${lin(shiftTerms(n, M, [X, Y, Z]))} = 0</div>`) +
            step(3, `<div class="eq">${opts[0]}</div>`) + ok('Проверка: подставь M₀ — получится 0.'),
          meta: { type: '5', n, D, M }
        };
      }
      // через три точки
      const u = [ri(-3, 3), ri(-3, 3), ri(-3, 3)], v = [ri(-3, 3), ri(-3, 3), ri(-3, 3)];
      const c = cross(u, v);
      if (c.every((x) => x === 0) || c[1] === 0) continue;
      const n = reduce(c);
      const M2 = add3(M, u), M3 = add3(M, v);
      const D = -dot(n, M);
      const nj = reduce([c[0], -c[1], c[2]]);
      const ns = [n[0], n[1], -n[2]];
      if (D === 0 || eqv(nj, n)) continue;
      const opts = [plane(n, D), plane(nj, -dot(nj, M)), plane(n, -D), plane(ns, -dot(ns, M))];
      if (!uniq(opts)) continue;
      return {
        title: 'Плоскость через три точки',
        q: `Составить уравнение плоскости, проходящей через точки <i>M</i><sub>1</sub>${pt(M)}, <i>M</i><sub>2</sub>${pt(M2)}, <i>M</i><sub>3</sub>${pt(M3)}.`,
        parts: [{ label: 'Ответ:', opts, why: {
          1: 'В векторном произведении (или определителе) у среднего слагаемого знак минус: −j(x₁z₂ − z₁x₂).',
          2: 'Ошибка в знаке свободного члена.',
          3: 'Ошибка в одной координате нормали — пересчитай определитель и сделай проверку точками.' } }],
        sol: step(1, `Векторы в плоскости: <i>M</i>₁<i>M</i>₂ = ${vec(u)}, <i>M</i>₁<i>M</i>₃ = ${vec(v)}.`) +
          step(2, `Нормаль — их векторное произведение: ${vec(c)}${eqv(c, n) ? '' : `, сокращаем: <b>n</b> = ${vec(n)}`}.`) +
          step(3, `Плоскость через <i>M</i>₁: <div class="eq">${lin(shiftTerms(n, M, [X, Y, Z]))} = 0 ⇒ ${opts[0]}</div>`) +
          ok('Проверка: подставь M₂ и M₃ — обе дают 0.'),
        meta: { type: '5', n, D, M, M2, M3 }
      };
    }
  }

  /* =====================================================================
     №9 · поверхность (цилиндры)
     ===================================================================== */
  const PL = { x: 'yOz', y: 'xOz', z: 'xOy' };
  const SECT_POOL = ['окружность', 'эллипс', 'гипербола', 'парабола', 'две параллельные прямые', 'одна прямая', 'нет пересечения'];
  const NAME_POOL = ['круговой цилиндр', 'эллиптический цилиндр', 'гиперболический цилиндр', 'параболический цилиндр', 'эллиптический параболоид', 'однополостный гиперболоид', 'конус'];
  function g9() {
    for (let t = 0; t < 100; t++) {
      const miss = pick(['x', 'y', 'z']);
      const [u, v] = ['x', 'y', 'z'].filter((a) => a !== miss);
      const type = wpick([['hyp', 3], ['par', 3], ['circ', 2], ['ell', 2]]);
      let eq, name, sec = {}, sub = {}, curve, curveName;
      if (type === 'circ') {
        const R = pick([1, 2, 3]);
        eq = `${SUP(I(u), 2)} + ${SUP(I(v), 2)} = ${R * R}`; name = 'круговой цилиндр'; curveName = `окружность радиуса ${R}`;
        sec[miss] = 'окружность'; sub[miss] = `${SUP(I(u), 2)} + ${SUP(I(v), 2)} = ${R * R}`;
        sec[u] = sec[v] = 'две параллельные прямые'; sub[u] = `${SUP(I(v), 2)} = ${R * R}, ${I(v)} = ±${R}`; sub[v] = `${SUP(I(u), 2)} = ${R * R}, ${I(u)} = ±${R}`;
        curve = { kind: 'ell', a: R, b: R };
      } else if (type === 'ell') {
        const [a2, b2] = shuffle([1, 4, 9, 16, 25]).slice(0, 2); const L = a2 * b2;
        eq = `${lin([[b2, SUP(I(u), 2)], [a2, SUP(I(v), 2)]])} = ${L}`; name = 'эллиптический цилиндр'; curveName = 'эллипс';
        sec[miss] = 'эллипс'; sub[miss] = eq;
        sec[u] = sec[v] = 'две параллельные прямые'; sub[u] = `${I(v)} = ±${Math.sqrt(b2)}`; sub[v] = `${I(u)} = ±${Math.sqrt(a2)}`;
        curve = { kind: 'ell', a: Math.sqrt(a2), b: Math.sqrt(b2) };
      } else if (type === 'hyp') {
        const [p, m] = shuffle([u, v]); // p со знаком +, m со знаком −
        const k = pick([1, 1, 4, 9]);
        eq = `${SUP(I(p), 2)} ${MI} ${SUP(I(m), 2)} = ${k}`; name = 'гиперболический цилиндр'; curveName = 'гипербола';
        sec[miss] = 'гипербола'; sub[miss] = eq;
        sec[p] = 'нет пересечения'; sub[p] = `${MI}${SUP(I(m), 2)} = ${k} — решений нет`;
        sec[m] = 'две параллельные прямые'; sub[m] = `${SUP(I(p), 2)} = ${k}, ${I(p)} = ±${Math.sqrt(k)}`;
        curve = { kind: 'hyp', pos: p === u ? 'u' : 'v', a: Math.sqrt(k) };
      } else {
        const [l, s2] = shuffle([u, v]); // l = c·s2²
        const c = pick([1, 1, 2, 3]);
        eq = `${I(l)} = ${c === 1 ? '' : c}${SUP(I(s2), 2)}`; name = 'параболический цилиндр'; curveName = 'парабола';
        sec[miss] = 'парабола'; sub[miss] = eq;
        sec[l] = 'одна прямая'; sub[l] = `${c === 1 ? '' : c}${SUP(I(s2), 2)} = 0, ${I(s2)} = 0 — ось O${miss}`;
        sec[s2] = 'одна прямая'; sub[s2] = `${I(l)} = 0 — ось O${miss}`;
        curve = { kind: 'par', lin: l === u ? 'u' : 'v', c };
      }
      const askPlane = pick(['x', 'y', 'z']);
      const sCorrect = sec[askPlane];
      let pool = SECT_POOL.filter((x) => x !== sCorrect && !(sCorrect === 'окружность' && x === 'эллипс') && !(sCorrect === 'эллипс' && x === 'окружность'));
      const sOpts = [sCorrect, ...shuffle(pool).slice(0, 3)];
      let npool = NAME_POOL.filter((x) => x !== name && !(name === 'круговой цилиндр' && x === 'эллиптический цилиндр') && !(name === 'эллиптический цилиндр' && x === 'круговой цилиндр'));
      const nOpts = [name, ...shuffle(npool).slice(0, 3)];
      const aOpts = ['O' + miss, ...['x', 'y', 'z'].filter((a) => a !== miss).map((a) => 'O' + a)];
      const sol = step(1, `В уравнении нет <i>${miss}</i> → цилиндр, образующие ∥ <b>O${miss}</b>. Направляющая в плоскости ${PL[miss]} — ${curveName}, поэтому это <b>${name}</b>.`) +
        step(2, 'Сечения координатными плоскостями:<ul class="secs">' + ['x', 'y', 'z'].map((a) => `<li><b>${I(a)} = 0</b> (${PL[a]}): ${sub[a]} → <b>${sec[a]}</b></li>`).join('') + '</ul>') +
        step(3, `Рисунок: нарисуй ${({ 'гипербола': 'гиперболу', 'парабола': 'параболу', 'эллипс': 'эллипс', 'окружность': 'окружность' })[curveName.split(' ')[0]]} в плоскости ${PL[miss]}, такую же кривую сдвинь вдоль O${miss} и соедини их прямыми ∥ O${miss}.`);
      return {
        title: 'Поверхность: какой цилиндр и какие сечения',
        q: `Построить поверхность <span class="eq-in">${eq}</span>. Определить, какие кривые получаются при пересечении с координатными плоскостями.`,
        parts: [
          { label: 'Что это за поверхность?', opts: nOpts, why: { '*': `В уравнении нет переменной ${miss} — значит, цилиндр. Вид цилиндра — по кривой: ${curveName}.` } },
          { label: 'Образующие параллельны оси:', opts: aOpts, why: { '*': 'Образующие параллельны оси той переменной, которой нет в уравнении.' } },
          { label: `Сечение плоскостью ${I(askPlane)} = 0 (${PL[askPlane]}) — это:`, opts: sOpts, why: { '*': `Подставь ${askPlane} = 0 в уравнение: ${sub[askPlane].replace(/<[^>]+>/g, '')}.` } }
        ],
        sol,
        plot: { kind: 'dir9', curve, h: u, v },
        meta: { type: '9', miss, sec }
      };
    }
  }

  /* =====================================================================
     №2 · кривая по числам
     ===================================================================== */
  const hypEq = (a2, b2) => `${FR(SUP(X, 2), a2)} ${MI} ${FR(SUP(Y, 2), b2)} = 1`;
  const ellEq = (a2, b2) => `${FR(SUP(X, 2), a2)} + ${FR(SUP(Y, 2), b2)} = 1`;
  const TRI = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]];
  function g2() {
    for (let t = 0; t < 100; t++) {
      const sub = wpick([['hypAxes', 2], ['hypE', 2], ['ellFoci', 2], ['ecc', 2], ['ellAxes', 1], ['par', 1]]);
      if (sub === 'hypAxes') {
        const a = ri(2, 7), b = ri(2, 7); if (a === b) continue;
        const opts = [hypEq(a * a, b * b), hypEq(4 * a * a, 4 * b * b), ellEq(a * a, b * b), hypEq(a, b)];
        if (!uniq(opts)) continue;
        return { title: 'Гипербола по осям',
          q: `Составить уравнение гиперболы, фокусы которой расположены на оси абсцисс симметрично относительно начала координат, если её оси 2<i>a</i> = ${2 * a} и 2<i>b</i> = ${2 * b}.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Даны оси 2a и 2b — сначала раздели на 2.', 2: 'Это эллипс. У гиперболы между дробями минус.', 3: 'В знаменателях стоят квадраты: a² и b².' } }],
          sol: step(1, `<i>a</i> = ${a}, <i>b</i> = ${b}.`) + step(2, `Гипербола: ${FR(SUP(X, 2), SUP(I('a'), 2))} ${MI} ${FR(SUP(Y, 2), SUP(I('b'), 2))} = 1 ⇒ <span class="eq-in">${opts[0]}</span>`), meta: { type: '2' } };
      }
      if (sub === 'hypE') {
        const [a, b, c] = pick(TRI.filter(([a, b, c]) => a * a + b * b === c * c));
        const e = new Q(c, a);
        const wrongB2 = c * c + a * a;
        const opts = [hypEq(a * a, b * b), hypEq(a * a, wrongB2), hypEq(4 * a * a, 4 * b * b), ellEq(a * a, b * b)];
        if (!uniq(opts)) continue;
        return { title: 'Гипербола по оси и эксцентриситету',
          q: `Составить уравнение гиперболы, фокусы которой расположены на оси абсцисс симметрично относительно начала координат, если ось 2<i>a</i> = ${2 * a} и эксцентриситет ε = ${num(e)}.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'У гиперболы b² = c² − a², а не c² + a².', 2: 'Дано 2a — раздели на 2, прежде чем считать.', 3: 'Это эллипс. У гиперболы между дробями минус.' } }],
          sol: step(1, `<i>a</i> = ${a}, <i>c</i> = ε·<i>a</i> = ${num(e)}·${a} = ${c}.`) + step(2, `Гипербола: <i>b</i>² = <i>c</i>² − <i>a</i>² = ${c * c} − ${a * a} = ${b * b}.`) + step(3, `<span class="eq-in">${opts[0]}</span>`), meta: { type: '2', kind: 'hyp', a, b, c } };
      }
      if (sub === 'ellFoci') {
        const [b, c, a] = pick(TRI); // эллипс: a — гипотенуза, a² = b² + c²
        const vert = rnd() < 0.35;
        const A2 = vert ? b * b : a * a, B2 = vert ? a * a : b * b; // знаменатели под x², y²
        const eqn = `${lin([[B2, SUP(X, 2)], [A2, SUP(Y, 2)]])} = ${A2 * B2}`;
        const F = (s) => (vert ? `(0; ±${s})` : `(±${s}; 0)`);
        const Fw = (s) => (vert ? `(±${s}; 0)` : `(0; ±${s})`);
        const wrongC = Number.isInteger(Math.sqrt(a * a + b * b)) ? String(Math.sqrt(a * a + b * b)) : SQRT(a * a + b * b);
        const opts = [`<i>F</i>${F(c)}`, `<i>F</i>${Fw(c)}`, `<i>F</i>${F(wrongC)}`, `<i>F</i>${F(a)}`];
        return { title: 'Фокусы эллипса по уравнению',
          q: `Найти координаты фокусов эллипса <span class="eq-in">${eqn}</span>.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Фокусы лежат на оси, вдоль которой эллипс вытянут, — под той переменной, где знаменатель больше.', 2: 'У эллипса c² = a² − b² (минус). Плюс — у гиперболы.', 3: 'Это вершина эллипса, а не фокус. Фокус — на расстоянии c от центра.' } }],
          sol: step(1, `Делим на ${A2 * B2}: <span class="eq-in">${ellEq(A2, B2)}</span>.`) + step(2, `Больший знаменатель ${a * a} стоит под ${vert ? '<i>y</i>²' : '<i>x</i>²'} → эллипс вытянут вдоль ${vert ? 'Oy' : 'Ox'}, <i>a</i> = ${a}, <i>b</i> = ${b}.`) + step(3, `<i>c</i>² = <i>a</i>² − <i>b</i>² = ${a * a} − ${b * b} = ${c * c}, <i>c</i> = ${c}. Фокусы: ${F(c)}.`), meta: { type: '2', kind: 'ell', a, b, c } };
      }
      if (sub === 'ecc') {
        const isH = rnd() < 0.5;
        let a, b, c, eqn;
        if (isH) { [a, b, c] = pick(TRI.filter(([a, b, c]) => a * a + b * b === c * c)); eqn = `${lin([[b * b, SUP(X, 2)], [-a * a, SUP(Y, 2)]])} = ${a * a * b * b}`; }
        else { [b, c, a] = pick(TRI); eqn = `${lin([[b * b, SUP(X, 2)], [a * a, SUP(Y, 2)]])} = ${a * a * b * b}`; }
        const opts = [num(new Q(c, a)), num(new Q(b, a)), num(new Q(c, b)), num(new Q(a, c))];
        if (!uniq(opts)) continue;
        return { title: 'Эксцентриситет по уравнению',
          q: `Определить эксцентриситет ${isH ? 'гиперболы' : 'эллипса'} <span class="eq-in">${eqn}</span>.`,
          parts: [{ label: 'ε =', opts, why: { '*': `ε = c/a, где a — ${isH ? 'действительная полуось (под плюсом)' : 'большая полуось'}, а c находят из c² = a² ${isH ? '+' : '−'} b².` } }],
          sol: step(1, `Делим на ${a * a * b * b}: <span class="eq-in">${isH ? hypEq(a * a, b * b) : ellEq(a * a, b * b)}</span>, <i>a</i> = ${a}, <i>b</i> = ${b}.`) + step(2, `<i>c</i>² = <i>a</i>² ${isH ? '+' : MI} <i>b</i>² = ${c * c}, <i>c</i> = ${c}.`) + step(3, `ε = <i>c</i>/<i>a</i> = ${num(new Q(c, a))} ${isH ? '(больше 1, как и должно быть у гиперболы)' : '(меньше 1, как у эллипса)'}.`), meta: { type: '2', kind: isH ? 'hyp' : 'ell', a, b, c } };
      }
      if (sub === 'ellAxes') {
        const [b, c, a] = pick(TRI);
        const opts = [ellEq(a * a, b * b), ellEq(a * a, a * a + c * c), ellEq(4 * a * a, 4 * b * b), hypEq(a * a, b * b)];
        return { title: 'Эллипс по большой оси и фокусному расстоянию',
          q: `Составить уравнение эллипса с фокусами на оси абсцисс, симметричными относительно начала координат, если большая ось равна ${2 * a}, а расстояние между фокусами 2<i>c</i> = ${2 * c}.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'У эллипса b² = a² − c².', 2: 'Даны 2a и 2c — сначала раздели на 2.', 3: 'Это гипербола. У эллипса между дробями плюс.' } }],
          sol: step(1, `<i>a</i> = ${a}, <i>c</i> = ${c}.`) + step(2, `<i>b</i>² = <i>a</i>² − <i>c</i>² = ${a * a} − ${c * c} = ${b * b}.`) + step(3, `<span class="eq-in">${opts[0]}</span>`), meta: { type: '2', kind: 'ell', a, b, c } };
      }
      // парабола через точку
      const p = ri(1, 4), k = pick([1, 2, -1, -2]);
      const x0 = 2 * p * k * k, y0 = 2 * p * k;
      const opts = [`${SUP(Y, 2)} = ${2 * p}${X}`, `${SUP(Y, 2)} = ${p === 1 ? '' : p}${X}`, `${SUP(X, 2)} = ${2 * p}${Y}`, `${SUP(Y, 2)} = ${4 * p}${X}`];
      return { title: 'Парабола через точку',
        q: `Составить уравнение параболы с вершиной в начале координат, симметричной относительно оси <i>Ox</i> и проходящей через точку <i>A</i>${pt([x0, y0])}.`,
        parts: [{ label: 'Ответ:', opts, why: { 1: 'Из y² = 2px получаем 2p, а не p: подставь точку и найди 2p.', 2: 'Симметрична относительно Ox — значит, вид y² = 2px (в квадрате y).', 3: 'Подставь точку ещё раз: y₀² = 2p·x₀.' } }],
        sol: step(1, `Симметрия относительно <i>Ox</i>, вершина в <i>O</i> → вид ${SUP(Y, 2)} = 2<i>px</i>.`) + step(2, `Подставляем <i>A</i>: ${y0 * y0} = 2<i>p</i>·${x0}, 2<i>p</i> = ${2 * p}, <i>p</i> = ${p}.`) + step(3, `<span class="eq-in">${opts[0]}</span>; фокус (${num(new Q(p, 2))}; 0), директриса <i>x</i> = ${num(new Q(-p, 2))}.`), meta: { type: '2' } };
    }
  }

  /* =====================================================================
     №8 · привести к каноническому виду
     ===================================================================== */
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const PAIRS = [[4, 1], [9, 4], [25, 16], [16, 9], [4, 9], [1, 4], [8, 16], [16, 8], [25, 9], [9, 25], [4, 16], [2, 8], [9, 1], [1, 9], [16, 4]];
  const canonEll = (h, k, al, be) => `${FR(sqs(X, h), num(al))} + ${FR(sqs(Y, k), num(be))} = 1`;
  const canonHyp = (h, k, al, be, vert) => (vert ? `${FR(sqs(Y, k), num(be))} ${MI} ${FR(sqs(X, h), num(al))} = 1` : `${FR(sqs(X, h), num(al))} ${MI} ${FR(sqs(Y, k), num(be))} = 1`);
  const grp = (P, v, h) => { if (h === 0) return mag(P, SUP(v, 2)); const inner = `${SUP(v, 2)} ${-2 * h < 0 ? MI : '+'} ${Math.abs(2 * h)}${v}`; return Math.abs(P) === 1 ? `${P < 0 ? MI : ''}(${inner})` : `${P < 0 ? MI : ''}${Math.abs(P)}(${inner})`; };
  const cmp = (P, v, h) => { if (h === 0) return mag(P, SUP(v, 2)); const inner = `${sqs(v, h)} ${MI} ${h * h}`; return Math.abs(P) === 1 ? `${P < 0 ? MI : ''}[${inner}]` : `${P < 0 ? MI : ''}${Math.abs(P)}[${inner}]`; };
  const joinSigned = (arr) => arr.map((s, i) => (i === 0 ? s : (s.startsWith(MI) ? ` ${MI} ${s.slice(1)}` : ` + ${s}`))).join('');
  function g8() {
    for (let t = 0; t < 300; t++) {
      const kind = wpick([['ell', 5], ['hyp', 3], ['par', 3]]);
      const h = ri(-3, 3), k = ri(-3, 3);
      if (h === 0 && k === 0) continue;
      if (kind === 'ell' || kind === 'hyp') {
        const [al, be] = pick(PAIRS);
        const L = lcm(al, be), P = L / al, Qc = L / be;
        if (P > 25 || Qc > 25) continue;
        const vert = kind === 'hyp' && rnd() < 0.45;
        const sx = kind === 'ell' ? 1 : (vert ? -1 : 1), sy = kind === 'ell' ? 1 : (vert ? 1 : -1);
        const Px = sx * P, Py = sy * Qc; // коэффициенты при x², y²
        const F = Px * h * h + Py * k * k - L;
        const eqTerms = rnd() < 0.5
          ? [[Px, SUP(X, 2)], [Py, SUP(Y, 2)], [-2 * Px * h, X], [-2 * Py * k, Y]]
          : [[Px, SUP(X, 2)], [-2 * Px * h, X], [Py, SUP(Y, 2)], [-2 * Py * k, Y]];
        const eqn = `${lin(eqTerms, F)} = 0`;
        const correct = kind === 'ell' ? canonEll(h, k, al, be) : canonHyp(h, k, al, be, vert);
        const opts = [correct];
        const why = {};
        opts.push(kind === 'ell' ? canonEll(-h, -k, al, be) : canonHyp(-h, -k, al, be, vert)); why[1] = 'Центр — числа из скобок с обратным знаком: (x − 2)² означает x₀ = 2, (x + 2)² — x₀ = −2.';
        // «забыл умножить хвост»
        const Rw = sx * h * h + sy * k * k - F; // при ошибке справа получится это (с учётом знаков)
        if (Rw > 0 && Rw !== L && (P !== 1 || Qc !== 1)) {
          opts.push(kind === 'ell' ? canonEll(h, k, new Q(Rw, P), new Q(Rw, Qc)) : canonHyp(h, k, new Q(Rw, P), new Q(Rw, Qc), vert));
          why[opts.length - 1] = 'Забыл умножить «хвост» на вынесенный коэффициент: 4[(x − 1)² − 1] = 4(x − 1)² − 4, а не −1.';
        }
        if (kind === 'ell') { opts.push(canonEll(h, k, be, al)); why[opts.length - 1] = 'Перепутаны знаменатели: под (x − x₀)² стоит число, которое получилось при делении правой части на коэффициент при x².'; }
        else { opts.push(canonHyp(h, k, al, be, !vert)); why[opts.length - 1] = 'Перепутано, какое слагаемое с плюсом. Справа должна быть +1: положительным остаётся то, у которого коэффициент был положительным.'; }
        if (opts.length < 4) {
          if (kind === 'ell') { opts.push(`${mag(P, sqs(X, h))} + ${mag(Qc, sqs(Y, k))} = 1`); why[opts.length - 1] = 'Правую часть надо разделить на число справа, чтобы получилась 1, — тогда коэффициенты уйдут в знаменатели.'; }
          else { opts.push(canonEll(h, k, al, be)); why[opts.length - 1] = 'Это эллипс — у гиперболы между дробями минус.'; }
        }
        if (opts.length > 4) opts.length = 4;
        if (!uniq(opts) || opts.length < 4) continue;
        const name = kind === 'ell' ? 'эллипс' : 'гипербола';
        const tOpts = [name, ...['эллипс', 'гипербола', 'парабола', 'окружность'].filter((x) => x !== name)];
        const sq = (n) => (Number.isInteger(Math.sqrt(n)) ? String(Math.sqrt(n)) : SQRT(n));
        const s1 = joinSigned([grp(Px, X, h), grp(Py, Y, k), ...(F !== 0 ? [num(F)] : [])]) + ' = 0';
        const s2 = joinSigned([cmp(Px, X, h), cmp(Py, Y, k), ...(F !== 0 ? [num(F)] : [])]) + ' = 0';
        const s3 = joinSigned([mag(Px, sqs(X, h)).replace(/^/, Px < 0 ? MI : ''), mag(Py, sqs(Y, k)).replace(/^/, Py < 0 ? MI : '')]) + ` = ${L}`;
        let info;
        if (kind === 'ell') info = `Эллипс: центр (${num(h)}; ${num(k)}), полуось по <i>x</i> — ${sq(al)}, по <i>y</i> — ${sq(be)}.`;
        else info = `Гипербола: центр (${num(h)}; ${num(k)}), ветви ${vert ? 'вверх-вниз (плюс у y)' : 'влево-вправо (плюс у x)'}; <i>a</i> = ${sq(vert ? be : al)}, <i>b</i> = ${sq(vert ? al : be)}. Асимптоты — диагонали прямоугольника со сторонами 2<i>a</i> и 2<i>b</i> вокруг центра.`;
        return { title: kind === 'ell' ? 'Построить кривую (эллипс)' : 'Построить кривую (гипербола)',
          q: `Привести к каноническому виду и построить кривую<div class="eq">${eqn}</div>`,
          parts: [{ label: 'Какая это кривая?', opts: tOpts, why: { '*': kind === 'ell' ? 'При x² и y² одинаковые знаки — эллипс.' : 'При x² и y² разные знаки — гипербола.' } },
            { label: 'Канонический вид:', opts, why }],
          sol: step(1, `Группируем: <div class="eq">${s1}</div>`) + step(2, `Выделяем полные квадраты: <div class="eq">${s2}</div>`) + step(3, `Раскрываем, числа вправо: <div class="eq">${s3}</div>`) + step(4, `Делим на ${L}: <div class="eq">${correct}</div>`) + `<p>${info}</p>`,
          plot: { kind, h, k, al, be, vert }, meta: { type: '8', kind, h, k, al, be, vert, Px, Py, F, L } };
      }
      // парабола
      const twoP = pick([2, 4, 6, 8, -2, -4, -6, -8]);
      const horiz = rnd() < 0.65; // (y − k)² = 2p(x − h)
      const a = horiz ? Y : X, bvar = horiz ? X : Y, ca = horiz ? k : h, cb = horiz ? h : k;
      // a² − 2·ca·a − 2p·b + (ca² + 2p·cb) = 0
      const C0 = ca * ca + twoP * cb;
      const eqTerms = [[1, SUP(a, 2)], [-2 * ca, a], [-twoP, bvar]];
      const eqn = `${lin(horiz ? eqTerms : [[1, SUP(a, 2)], [-2 * ca, a], [-twoP, bvar]], C0)} = 0`;
      const rhs = (c, s) => `${c}(${sh(bvar, s)})`;
      const canP = (sa, sb, c) => `${sqs(a, sa)} = ${rhs(num(c), sb)}`;
      const opts = [canP(ca, cb, twoP), canP(-ca, -cb, twoP), canP(ca, cb, -twoP), canP(ca, -cb, twoP)];
      if (!uniq(opts) || cb === 0) continue;
      const p = twoP / 2;
      const focus = horiz ? `(${num(new Q(2 * h + p, 2))}; ${num(k)})` : `(${num(h)}; ${num(new Q(2 * k + p, 2))})`;
      const dir = horiz ? `<i>x</i> = ${num(new Q(2 * h - p, 2))}` : `<i>y</i> = ${num(new Q(2 * k - p, 2))}`;
      return { title: 'Построить кривую (парабола)',
        q: `Привести к каноническому виду и построить кривую<div class="eq">${eqn}</div>`,
        parts: [{ label: 'Какая это кривая?', opts: ['парабола', 'эллипс', 'гипербола', 'окружность'], why: { '*': 'В квадрате только одна переменная — это парабола.' } },
          { label: 'Канонический вид:', opts, why: { 1: 'Вершина — числа из скобок с обратным знаком.', 2: `При переносе слагаемого ${twoP > 0 ? MI : '+'}${Math.abs(twoP)}${horiz ? 'x' : 'y'} в правую часть его знак меняется.`, 3: 'Вынеси коэффициент за скобку аккуратно: проверь знак числа внутри скобки.' } }],
        sol: step(1, `Выделяем квадрат по ${horiz ? '<i>y</i>' : '<i>x</i>'}: <div class="eq">${ca === 0 ? SUP(a, 2) : `[${sqs(a, ca)} ${MI} ${ca * ca}]`} ${twoP > 0 ? MI : '+'} ${Math.abs(twoP)}${bvar}${C0 !== 0 ? (C0 > 0 ? ' + ' : ` ${MI} `) + Math.abs(C0) : ''} = 0</div>`) +
          step(2, `Всё, кроме квадрата, переносим вправо и выносим ${twoP}: <div class="eq">${opts[0]}</div>`) +
          `<p>Парабола: вершина (${num(h)}; ${num(k)}), 2<i>p</i> = ${twoP}, ветви ${horiz ? (twoP > 0 ? 'вправо' : 'влево') : (twoP > 0 ? 'вверх' : 'вниз')}. Фокус ${focus}, директриса ${dir}.</p>`,
        plot: { kind: 'par', h, k, twoP, horiz }, meta: { type: '8', kind: 'par', h, k, twoP, horiz, C0 } };
    }
  }

  /* =====================================================================
     №10 · теория (банк вопросов)
     ===================================================================== */
  const x0 = `<i>x</i><sub>0</sub>`, y0 = `<i>y</i><sub>0</sub>`, x1 = `<i>x</i><sub>1</sub>`, y1 = `<i>y</i><sub>1</sub>`, x2 = `<i>x</i><sub>2</sub>`, y2 = `<i>y</i><sub>2</sub>`;
  const F_NORM = `<i>A</i>(${X} − ${x0}) + <i>B</i>(${Y} − ${y0}) = 0`;
  const F_DIR = `${FR(`${X} − ${x0}`, I('m'))} = ${FR(`${Y} − ${y0}`, I('n'))}`;
  const F_K = `${Y} − ${y0} = <i>k</i>(${X} − ${x0})`;
  const F_TWO = `${FR(`${X} − ${x1}`, `${x2} − ${x1}`)} = ${FR(`${Y} − ${y1}`, `${y2} − ${y1}`)}`;
  const BANK10 = [
    { q: 'Вопрос 1 (через две точки). На чём основан вывод?', o: ['векторы M₁M и M₁M₂ коллинеарны — координаты пропорциональны', 'векторы M₁M и M₁M₂ перпендикулярны — скалярное произведение равно 0', 'тангенс угла наклона равен k', 'длины векторов M₁M и M₁M₂ равны'] },
    { q: 'Вопрос 2 (точка и направляющий вектор s). На чём основан вывод?', o: ['вектор M₀M коллинеарен s', 'вектор M₀M перпендикулярен s', 'вектор M₀M равен s', 'тангенс угла наклона прямой'] },
    { q: 'Вопрос 3 (точка и нормальный вектор n). На чём основан вывод?', o: ['n · M₀M = 0, потому что M₀M ⟂ n', 'M₀M коллинеарен n', 'координаты M₀M и n пропорциональны', 'векторное произведение n × M₀M = 0'] },
    { q: 'Вопрос 4 (угловой коэффициент и точка). Откуда берётся k = (y − y₀)/(x − x₀)?', o: ['из прямоугольного треугольника с катетами x − x₀ и y − y₀: tg α — отношение противолежащего катета к прилежащему', 'из скалярного произведения векторов', 'из теоремы Пифагора', 'из пропорциональности координат нормали'] },
    { q: 'Какое уравнение получается в выводе через точку и нормаль?', o: [F_NORM, F_DIR, F_K, F_TWO], html: true },
    { q: 'Какое уравнение получается в выводе через точку и направляющий вектор?', o: [F_DIR, F_NORM, F_K, F_TWO], html: true },
    { q: 'Какое уравнение получается в выводе с угловым коэффициентом?', o: [F_K, F_NORM, F_DIR, F_TWO], html: true },
    { q: 'Какое уравнение получается в выводе через две точки?', o: [F_TWO, F_NORM, F_DIR, F_K], html: true },
    { q: 'В общем уравнении Ax + By + C = 0 числа A и B — это…', o: ['координаты нормального вектора (он ⟂ прямой)', 'координаты направляющего вектора', 'координаты точки на прямой', 'отрезки, которые прямая отсекает на осях'] },
    { q: 'Вопрос 5. При C = 0 прямая Ax + By + C = 0…', o: ['проходит через начало координат', 'параллельна оси Ox', 'параллельна оси Oy', 'совпадает с осью Ox'] },
    { q: 'Вопрос 5. При A = 0 прямая Ax + By + C = 0…', o: ['параллельна оси Ox (горизонтальна)', 'параллельна оси Oy (вертикальна)', 'проходит через начало координат', 'совпадает с осью Oy'] },
    { q: 'Вопрос 5. При B = 0 прямая Ax + By + C = 0…', o: ['параллельна оси Oy (вертикальна)', 'параллельна оси Ox (горизонтальна)', 'проходит через начало координат', 'совпадает с осью Ox'] },
    { q: 'Вопрос 5. Если A, B, C ≠ 0, что делают с уравнением?', o: ['переносят C и делят на −C — получается уравнение в отрезках x/a + y/b = 1', 'делят на A — получается y = kx + b', 'приравнивают к t — получается параметрическое', 'возводят в квадрат'] },
    { q: 'Вопрос 6. Прямые A₁x + B₁y + C₁ = 0 и A₂x + B₂y + C₂ = 0 параллельны, если…', o: ['A₁/A₂ = B₁/B₂ ≠ C₁/C₂', 'A₁A₂ + B₁B₂ = 0', 'A₁/A₂ ≠ B₁/B₂', 'A₁/A₂ = B₁/B₂ = C₁/C₂'] },
    { q: 'Вопрос 6. Те же прямые перпендикулярны, если…', o: ['A₁A₂ + B₁B₂ = 0', 'A₁/A₂ = B₁/B₂', 'A₁B₁ + A₂B₂ = 0', 'C₁ = C₂'] },
    { q: 'Вопрос 6. Прямые совпадают, если…', o: ['A₁/A₂ = B₁/B₂ = C₁/C₂', 'A₁/A₂ = B₁/B₂ ≠ C₁/C₂', 'A₁A₂ + B₁B₂ = 0', 'A₁ = A₂'] },
    { q: 'Почему у вертикальной прямой нет углового коэффициента?', o: ['α = 90°, а tg 90° не существует', 'потому что она проходит через начало координат', 'потому что B ≠ 0', 'у неё k = 0'] },
    { q: 'Как из канонического уравнения получить параметрическое?', o: ['приравнять каждое отношение к t и выразить x и y', 'разделить на t', 'перемножить числители', 'возвести обе части в квадрат'] },
    { q: 'Как получить y = kx + b из y − y₀ = k(x − x₀)?', o: ['взять точку M₀(0; b) на оси Oy', 'взять k = 0', 'взять точку M₀(b; 0) на оси Ox', 'разделить на k'] }
  ];
  function g10() {
    const it = pick(BANK10);
    return { title: 'Теория: выводы уравнения прямой', q: it.q, parts: [{ label: 'Ответ:', opts: it.o.slice(), why: { '*': 'Повтори этот вывод в разделе «Шпаргалка выводов» ниже.' } }], sol: '', meta: { type: '10' } };
  }

  /* =====================================================================
     №1 · прямая на плоскости
     ===================================================================== */
  const ANG = [['1', 45], [`${MI}1`, 135], [SQRT(3), 60], [`${MI}${SQRT(3)}`, 120], [FR(SQRT(3), 3), 30], [`${MI}${FR(SQRT(3), 3)}`, 150]];
  function normLine(A, B, C) { const g = gcdN([A, B, C]); let r = [A / g, B / g, C / g]; const f = r[0] !== 0 ? r[0] : r[1]; if (f < 0) r = r.map((x) => -x); return r.map((x) => x + 0); }
  function g1() {
    for (let t = 0; t < 200; t++) {
      const sub = wpick([['angle', 2], ['two', 3], ['par', 2], ['perp', 2], ['param', 2]]);
      if (sub === 'angle') {
        const [kH, a] = pick(ANG); const b = ri(-4, 4);
        const others = shuffle(ANG.map((x) => x[1]).filter((x) => x !== a && x !== 180 - a)).slice(0, 2);
        const opts = [a, 180 - a, ...others].map(deg);
        return { title: 'Угол наклона прямой',
          q: `Какой угол образует прямая <span class="eq-in">${Y} = ${kH === '1' ? '' : kH === `${MI}1` ? MI : kH}${X}${b === 0 ? '' : (b > 0 ? ' + ' : ` ${MI} `) + Math.abs(b)}</span> с положительным направлением оси <i>Ox</i>?`,
          parts: [{ label: 'α =', opts, why: { '*': 'k = tg α. tg 30° = √3/3, tg 45° = 1, tg 60° = √3. Если k отрицательный, угол тупой: 180° минус острый угол.' } }],
          sol: step(1, `Угловой коэффициент <i>k</i> = ${kH} = tg α.`) + step(2, `${a < 90 ? 'k > 0 — угол острый' : 'k < 0 — угол тупой: 180° − ' + (180 - a) + '°'}. α = ${a}°.`), meta: { type: '1', sub: 'angle', kH, a } };
      }
      if (sub === 'two') {
        let A = [ri(-5, 5), ri(-5, 5)], B = [ri(-5, 5), ri(-5, 5)];
        const dx = B[0] - A[0], dy = B[1] - A[1]; if (dx === 0 || dy === 0) continue;
        let pre = '', q;
        const useMid = rnd() < 0.3;
        let P1, P2;
        if (useMid) { P1 = [B[0] + ri(-3, 3), B[1] + ri(-3, 3)]; P2 = [2 * B[0] - P1[0], 2 * B[1] - P1[1]]; if (eqv(P1, P2)) continue; }
        const [a, b, c] = normLine(dy, -dx, dx * A[1] - dy * A[0]);
        const [a2, b2, c2] = normLine(dx, -dy, dy * A[1] - dx * A[0]);
        const [a3, b3, c3] = normLine(dy, dx, -(dy * A[0] + dx * A[1]));
        const opts = [line2(a, b, c), line2(a, b, -c), line2(a2, b2, c2), line2(a3, b3, c3)];
        if (!uniq(opts) || c === 0) continue;
        q = useMid ? `Написать уравнение прямой, проходящей через точку <i>M</i><sub>0</sub>${pt(A)} и середину отрезка <i>P</i>${pt(P1)}, <i>Q</i>${pt(P2)}.` : `Составить уравнение прямой, проходящей через точки <i>A</i>${pt(A)} и <i>B</i>${pt(B)}.`;
        if (useMid) pre = `<p>Сначала середина <i>PQ</i>: ${pt(B)}. Дальше — прямая через <i>M</i>₀ и эту точку.</p>`;
        return { title: useMid ? 'Прямая через точку и середину отрезка' : 'Прямая через две точки', q,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Ошибка в знаке свободного члена — сделай проверку точкой.', 2: 'Под x − x₁ стоит x₂ − x₁, под y − y₁ стоит y₂ − y₁. Не перепутай знаменатели.', 3: 'Ошибка при «крест-накрест» — знак одного из коэффициентов. Проверь вторую точку.' } }],
          sol: pre + step(1, `<div class="eq">${FR(sh(X, A[0]), num(dx))} = ${FR(sh(Y, A[1]), num(dy))}</div>`) + step(2, `Крест-накрест: ${num(dy)}(${sh(X, A[0])}) = ${num(dx)}(${sh(Y, A[1])}) ⇒ <span class="eq-in">${opts[0]}</span>`) + ok('Проверка: обе точки дают 0.'), meta: { type: '1', A, B, line: [a, b, c] } };
      }
      if (sub === 'par' || sub === 'perp') {
        const A = ri(1, 5), B = nz(-5, 5), C0 = nz(-8, 8); if (gcd(A, B) !== 1) continue;
        const M = [ri(-4, 4), ri(-4, 4)];
        const par = normLine(A, B, -(A * M[0] + B * M[1]));
        const pe = normLine(B, -A, -(B * M[0] - A * M[1]));
        const wrongPe = normLine(B, A, -(B * M[0] + A * M[1]));
        const main = sub === 'par' ? par : pe, other = sub === 'par' ? pe : par;
        const opts = [line2(...main), line2(...other), line2(main[0], main[1], -main[2]), sub === 'par' ? line2(A, B, C0) : line2(...wrongPe)];
        if (!uniq(opts) || main[2] === 0) continue;
        return { title: sub === 'par' ? 'Прямая через точку ∥ данной' : 'Прямая через точку ⟂ данной',
          q: `Составить уравнение прямой, проходящей через точку <i>M</i>${pt(M)} ${sub === 'par' ? 'параллельно' : 'перпендикулярно'} прямой <span class="eq-in">${line2(A, B, C0)}</span>.`,
          parts: [{ label: 'Ответ:', opts, why: sub === 'par'
            ? { 1: 'Это перпендикулярная прямая. У параллельной нормаль та же: (A; B).', 2: 'Ошибка в знаке свободного члена.', 3: 'Это данная прямая — она не проходит через M.' }
            : { 1: 'Это параллельная прямая. У перпендикулярной нормаль — направляющий вектор данной: (B; −A).', 2: 'Ошибка в знаке свободного члена.', 3: 'Чтобы получить перпендикулярный вектор, коэффициенты переставляют И у одного меняют знак: (A; B) → (B; −A).' } }],
          sol: step(1, sub === 'par' ? `Нормаль та же: <b>n</b> = (${A}; ${num(B)}).` : `Нормаль данной (${A}; ${num(B)}) — это направление искомой. Нормаль искомой — перпендикулярный вектор (${num(B)}; ${num(-A)}).`) +
            step(2, `Через точку <i>M</i>: <span class="eq-in">${opts[0]}</span>`) + ok('Проверка: подставь M — получится 0.'), meta: { type: '1' } };
      }
      // параметр для ⊥ или ∥
      const want = rnd() < 0.6 ? 'perp' : 'par';
      const B1 = nz(-5, 5), C1 = nz(-6, 6), A2 = nz(-5, 5), B2 = nz(-5, 5), C2 = nz(-6, 6);
      const aPerp = new Q(-B1 * B2, A2), aPar = new Q(A2 * B1, B2);
      const ans = want === 'perp' ? aPerp : aPar, alt = want === 'perp' ? aPar : aPerp;
      const opts = [num(ans), num(alt), num(ans.neg()), num(new Q(ans.q, ans.p || 1))];
      if (!uniq(opts) || ans.p === 0) continue;
      return { title: want === 'perp' ? 'Параметр: прямые перпендикулярны' : 'Параметр: прямые параллельны',
        q: `При каком значении <i>a</i> прямые <span class="eq-in">${lin([[1, `<i>a</i>${X}`], [B1, Y]], C1)} = 0</span> и <span class="eq-in">${line2(A2, B2, C2)}</span> ${want === 'perp' ? 'перпендикулярны' : 'параллельны'}?`,
        parts: [{ label: '<i>a</i> =', opts, why: { 1: want === 'perp' ? 'Это условие параллельности. Перпендикулярность: A₁A₂ + B₁B₂ = 0.' : 'Это условие перпендикулярности. Параллельность: A₁/A₂ = B₁/B₂.', 2: 'Ошибка в знаке при переносе.', 3: 'Перевёрнута дробь — аккуратно вырази a.' } }],
        sol: want === 'perp' ? step(1, `Нормали (<i>a</i>; ${num(B1)}) и (${num(A2)}; ${num(B2)}). Перпендикулярность: <i>a</i>·${num(A2)} + ${num(B1)}·${num(B2)} = 0.`) + step(2, `<i>a</i> = ${num(ans)}.`)
          : step(1, `Параллельность: <i>a</i>/${num(A2)} = ${num(B1)}/${num(B2)}.`) + step(2, `<i>a</i> = ${num(ans)}.`), meta: { type: '1', sub: 'param', want, B1, A2, B2, ans: ans.v } };
    }
  }

  /* =====================================================================
     №3 · плоскость
     ===================================================================== */
  const NORMS = [[1, 2, 2, 3], [2, 1, 2, 3], [2, 2, 1, 3], [1, 4, 8, 9], [4, 4, 7, 9], [2, 3, 6, 7], [6, 2, 3, 7], [3, 6, 2, 7], [2, 6, 9, 11], [6, 6, 7, 11]];
  const SPECIAL = [
    ['параллельна плоскости <i>Oxy</i>', '<i>A</i> = <i>B</i> = 0 (<i>C</i>, <i>D</i> ≠ 0)'],
    ['параллельна плоскости <i>Oxz</i>', '<i>A</i> = <i>C</i> = 0 (<i>B</i>, <i>D</i> ≠ 0)'],
    ['параллельна плоскости <i>Oyz</i>', '<i>B</i> = <i>C</i> = 0 (<i>A</i>, <i>D</i> ≠ 0)'],
    ['параллельна оси <i>Ox</i>', '<i>A</i> = 0'],
    ['параллельна оси <i>Oy</i>', '<i>B</i> = 0'],
    ['параллельна оси <i>Oz</i>', '<i>C</i> = 0'],
    ['проходит через начало координат', '<i>D</i> = 0'],
    ['проходит через ось <i>Ox</i>', '<i>A</i> = 0 и <i>D</i> = 0'],
    ['проходит через ось <i>Oz</i>', '<i>C</i> = 0 и <i>D</i> = 0']
  ];
  const planeU = (n, D, slot, letter) => { const vars = [X, Y, Z]; const terms = n.map((k, i) => (i === slot ? [1, `<i>${letter}</i>${vars[i]}`] : [k, vars[i]])); return `${lin(terms, D)} = 0`; };
  function g3() {
    for (let t = 0; t < 200; t++) {
      const sub = wpick([['perp', 2], ['par', 2], ['dist', 3], ['bis', 2], ['special', 2]]);
      if (sub === 'perp') {
        const n1 = [nz(-5, 5), nz(-5, 5), nz(-5, 5)], n2 = [nz(-5, 5), nz(-5, 5), nz(-5, 5)];
        const slot = ri(0, 2), letter = ['A', 'B', 'C'][slot];
        const rest = n1.reduce((s, x, i) => (i === slot ? s : s + x * n2[i]), 0);
        const ans = new Q(-rest, n1[slot]);
        const j = (slot + 1) % 3;
        const parAns = new Q(n1[slot] * n2[j], n1[j]);
        const lost = new Q(-(rest - n1[j] * n2[j]), n1[slot]);
        const opts = [num(ans), num(ans.neg()), num(parAns), num(lost)];
        if (!uniq(opts) || ans.p === 0) continue;
        const n2h = `(${n2.map((x, i) => (i === slot ? `<i>${letter}</i>` : num(x))).join('; ')})`;
        return { title: 'Параметр: плоскости перпендикулярны',
          q: `При каком значении <i>${letter}</i> плоскости <span class="eq-in">${plane(n1, nz(-6, 6))}</span> и <span class="eq-in">${planeU(n2, nz(-6, 6), slot, letter)}</span> перпендикулярны?`,
          parts: [{ label: `<i>${letter}</i> =`, opts, why: { 1: 'Ошибка в знаке при переносе.', 2: 'Перпендикулярность — это скалярное произведение нормалей = 0, а не пропорциональность.', 3: 'Потеряно одно из трёх слагаемых скалярного произведения.' } }],
          sol: step(1, `Нормали ${vec(n1)} и ${n2h}.`) +
            step(2, `Скалярное произведение = 0: ${n1.map((x, i) => (i === slot ? `${num(x)}·<i>${letter}</i>` : `${num(x)}·${num(n2[i])}`)).join(' + ')} = 0.`) + step(3, `<i>${letter}</i> = ${num(ans)}.`), meta: { type: '3', sub: 'perp', n1, n2, slot, ans: ans.v } };
      }
      if (sub === 'par') {
        const n1 = [nz(-4, 4), nz(-4, 4), nz(-4, 4)], kk = pick([2, 3, -2, -1, 2]);
        const slot = ri(0, 2), letter = ['A', 'B', 'C'][slot];
        const n2 = n1.map((x) => x * kk);
        const ans = new Q(n2[slot]);
        const perpRest = n1.reduce((s, x, i) => (i === slot ? s : s + x * n2[i]), 0);
        const opts = [num(ans), num(new Q(n1[slot], kk)), num(ans.neg()), num(new Q(-perpRest, n1[slot]))];
        const D1 = nz(-6, 6); let D2 = nz(-9, 9); if (D2 === D1 * kk) D2 += 1;
        if (!uniq(opts) || D2 === 0) continue;
        return { title: 'Параметр: плоскости параллельны',
          q: `При каком значении <i>${letter}</i> плоскости <span class="eq-in">${plane(n1, D1)}</span> и <span class="eq-in">${planeU(n2, D2, slot, letter)}</span> параллельны?`,
          parts: [{ label: `<i>${letter}</i> =`, opts, why: { 1: 'Отношение перевёрнуто: у второй плоскости коэффициенты в k раз больше, чем у первой.', 2: 'Ошибка в знаке: знак сохраняется вместе с коэффициентом пропорциональности.', 3: 'Это условие перпендикулярности. Для параллельности нормали пропорциональны.' } }],
          sol: step(1, `Параллельные плоскости — нормали пропорциональны. Известные коэффициенты второй плоскости в ${kk} раз больше, чем у первой.`) + step(2, `<i>${letter}</i> = ${kk}·${num(n1[slot])} = ${num(ans)}.`), meta: { type: '3', sub: 'par', n1, n2, slot, ans: ans.v } };
      }
      if (sub === 'dist') {
        const [a, b, c, L] = pick(NORMS); const n = [a, b, c].map((x) => (rnd() < 0.4 ? -x : x));
        const M = [ri(-4, 4), ri(-4, 4), ri(-4, 4)], D = nz(-9, 9);
        const top = dot(n, M) + D; if (top === 0 || dot(n, M) === 0 || Math.abs(dot(n, M) - D) === Math.abs(top)) continue;
        const ans = new Q(Math.abs(top), L);
        const opts = [num(ans), num(new Q(Math.abs(top), L * L)), num(new Q(Math.abs(dot(n, M)), L)), num(new Q(Math.abs(dot(n, M) - D), L))];
        if (!uniq(opts)) continue;
        return { title: 'Расстояние от точки до плоскости',
          q: `Найти расстояние от точки <i>M</i>${pt(M)} до плоскости <span class="eq-in">${plane(n, D)}</span>.`,
          parts: [{ label: '<i>d</i> =', opts, why: { 1: `В знаменателе корень из суммы квадратов: √(${a * a}+${b * b}+${c * c}) = ${L}, а не сама сумма.`, 2: 'Забыт свободный член D в числителе.', 3: 'Ошибка в знаке D: в числителе Ax₀ + By₀ + Cz₀ + D.' } }],
          sol: step(1, `<i>d</i> = |<i>Ax</i>₀ + <i>By</i>₀ + <i>Cz</i>₀ + <i>D</i>| / √(<i>A</i>² + <i>B</i>² + <i>C</i>²).`) + step(2, `Числитель: |${num(n[0])}·${num(M[0])} + ${num(n[1])}·${num(M[1])} + ${num(n[2])}·${num(M[2])} + ${num(D)}| = ${Math.abs(top)}. Знаменатель: √${a * a + b * b + c * c} = ${L}.`) + step(3, `<i>d</i> = ${num(ans)}.`), meta: { type: '3', sub: 'dist', n, D, M, ans: ans.v } };
      }
      if (sub === 'bis') {
        const P = [ri(-4, 4), ri(-4, 4), ri(-4, 4)], d = [2 * ri(-2, 2), 2 * ri(-2, 2), 2 * ri(-2, 2)];
        if (d.every((x) => x === 0)) continue;
        const Qp = add3(P, d), mid = add3(P, d.map((x) => x / 2));
        const n = reduce(d);
        const D = -dot(n, mid);
        const opts = [plane(n, D), plane(n, -dot(n, P)), plane(n, -D), plane(reduce(add3(P, Qp)), -dot(reduce(add3(P, Qp)), mid))];
        if (!uniq(opts) || D === 0 || add3(P, Qp).every((x) => x === 0)) continue;
        return { title: 'Плоскость, равноудалённая от двух точек',
          q: `Написать уравнение плоскости, точки которой одинаково удалены от точек <i>P</i>${pt(P)} и <i>Q</i>${pt(Qp)}.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Плоскость проходит через СЕРЕДИНУ отрезка PQ, а не через P.', 2: 'Ошибка в знаке свободного члена.', 3: 'Нормаль — вектор PQ (разность), а не сумма координат.' } }],
          sol: step(1, `Середина <i>PQ</i>: ${pt(mid)}.`) + step(2, `Нормаль <i>PQ</i> = ${vec(d)}${eqv(d, n) ? '' : `, короче <b>n</b> = ${vec(n)}`}.`) + step(3, `<div class="eq">${lin(shiftTerms(n, mid, [X, Y, Z]))} = 0 ⇒ ${opts[0]}</div>`), meta: { type: '3', sub: 'bis', n, D, P, Q: Qp } };
      }
      const [cond, ansH] = pick(SPECIAL);
      const others = shuffle(SPECIAL.filter((s) => s[1] !== ansH)).slice(0, 3).map((s) => s[1]);
      return { title: 'Особые случаи уравнения плоскости',
        q: `В каком случае плоскость <span class="eq-in"><i>Ax</i> + <i>By</i> + <i>Cz</i> + <i>D</i> = 0</span> ${cond}?`,
        parts: [{ label: 'Ответ:', opts: [ansH, ...others], why: { '*': 'Нет переменной → плоскость ∥ этой оси. Нет двух переменных → ∥ координатной плоскости из оставшихся двух осей. D = 0 → проходит через начало координат.' } }],
        sol: step(1, 'Правило: коэффициент при переменной равен 0 → плоскость параллельна оси этой переменной; D = 0 → проходит через O.') + step(2, `Ответ: ${ansH}.`), meta: { type: '3' } };
    }
  }

  /* =====================================================================
     №4 · прямая в пространстве
     ===================================================================== */
  function g4() {
    for (let t = 0; t < 200; t++) {
      const sub = wpick([['two', 3], ['par', 2], ['perp', 2], ['axis', 1]]);
      const M = [ri(-4, 4), ri(-4, 4), ri(-4, 4)];
      if (sub === 'two') {
        const B = [ri(-4, 4), ri(-4, 4), ri(-4, 4)]; const s = sub3(B, M);
        if (s.every((x) => x === 0) || M.every((x) => x === 0)) continue;
        const asParam = rnd() < 0.4;
        const f = asParam ? param : canon;
        const opts = [f(M, s), f(neg3(M), s), f(M, add3(M, B)), f(s, M)];
        if (!uniq(opts) || add3(M, B).every((x) => x === 0) || s.some((x) => x === 0) && rnd() < 0.5) continue;
        return { title: `Прямая через две точки (${asParam ? 'параметрическая' : 'каноническая'})`,
          q: `Составить ${asParam ? 'параметрические' : 'канонические'} уравнения прямой, проходящей через точки <i>A</i>${pt(M)} и <i>B</i>${pt(B)}.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Ошибка в знаке точки: в числителе x − x₀, поэтому для x₀ = −2 будет x + 2.', 2: 'Направляющий вектор — разность B − A, а не сумма.', 3: 'Перепутаны точка и вектор.' } }],
          sol: step(1, `<b>s</b> = <i>AB</i> = ${vec(s)}.`) + step(2, `Точка <i>A</i>: <span class="eq-in">${opts[0]}</span>`) + (s.some((x) => x === 0) ? '<p class="note">Ноль в знаменателе значит, что эта координата не меняется.</p>' : '') + ok('Проверка: при t = 1 получается точка B.'), meta: { type: '4', P: M, s, B } };
      }
      if (sub === 'par') {
        const s = [nz(-5, 5), nz(-5, 5), nz(-5, 5)], L = [ri(-5, 5), ri(-5, 5), ri(-5, 5)];
        if (eqv(L, M) || L.every((x) => x === 0) || M.every((x) => x === 0)) continue;
        const asParam = rnd() < 0.5;
        const given = rnd() < 0.5 ? canon(L, s) : param(L, s);
        const f = asParam ? param : canon;
        const opts = [f(M, s), f(M, L), f(neg3(M), s), f(L, s)];
        if (!uniq(opts)) continue;
        return { title: 'Прямая через точку ∥ данной прямой',
          q: `Составить ${asParam ? 'параметрические' : 'канонические'} уравнения прямой, проходящей через точку <i>M</i>${pt(M)} параллельно прямой <span class="eq-in">${given}</span>.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'В качестве направления взята точка данной прямой. Направление — знаменатели (или коэффициенты при t).', 2: 'Ошибка в знаке точки M.', 3: 'Это данная прямая — она не проходит через M.' } }],
          sol: step(1, `Параллельные прямые — общий направляющий вектор: <b>s</b> = ${vec(s)}.`) + step(2, `Через <i>M</i>: <span class="eq-in">${opts[0]}</span>`), meta: { type: '4', P: M, s, given: s } };
      }
      if (sub === 'perp') {
        const n = [nz(-5, 5), nz(-5, 5), nz(-5, 5)], D = nz(-9, 9);
        if (M.every((x) => x === 0)) continue;
        const asParam = rnd() < 0.6; const f = asParam ? param : canon;
        const nf = [n[0], -n[1], n[2]];
        const opts = [f(M, n), f(neg3(M), n), f(n, M), f(M, nf)];
        if (!uniq(opts)) continue;
        return { title: 'Прямая через точку ⟂ плоскости',
          q: `Составить ${asParam ? 'параметрические' : 'канонические'} уравнения прямой, проходящей через точку <i>M</i>${pt(M)} перпендикулярно плоскости <span class="eq-in">${plane(n, D)}</span>.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Ошибка в знаке точки M.', 2: 'Перепутаны точка и вектор.', 3: 'Направляющий вектор — нормаль плоскости как есть, со всеми знаками.' } }],
          sol: step(1, `Прямая ⟂ плоскости → её направляющий — нормаль плоскости: <b>s</b> = <b>n</b> = ${vec(n)}.`) + step(2, `<span class="eq-in">${opts[0]}</span>`), meta: { type: '4', P: M, s: n, given: n } };
      }
      const ax = ri(0, 2); const e = [0, 0, 0]; e[ax] = 1;
      const others = [0, 1, 2].filter((i) => i !== ax).map((i) => { const v = [0, 0, 0]; v[i] = 1; return v; });
      if (M.every((x) => x === 0)) continue;
      const opts = [canon(M, e), canon(M, others[0]), canon(M, others[1]), canon(neg3(M), e)];
      if (!uniq(opts)) continue;
      return { title: 'Прямая через точку ∥ оси',
        q: `Составить канонические уравнения прямой, проходящей через точку <i>M</i>${pt(M)} параллельно оси <i>O${'xyz'[ax]}</i>.`,
        parts: [{ label: 'Ответ:', opts, why: { 1: `Направление оси O${'xyz'[ax]} — единица на месте ${'xyz'[ax]}, остальные нули.`, 2: `Направление оси O${'xyz'[ax]} — единица на месте ${'xyz'[ax]}, остальные нули.`, 3: 'Ошибка в знаке точки M.' } }],
        sol: step(1, `Направление оси <i>O${'xyz'[ax]}</i>: <b>s</b> = ${vec(e)}.`) + step(2, `<span class="eq-in">${opts[0]}</span>. Нули в знаменателях значат, что две другие координаты постоянны.`), meta: { type: '4' } };
    }
  }


  /* =====================================================================
     №6 · плоскость, уровень B
     ===================================================================== */
  const slopeLine = (k, b) => `${Y} = ${lin([[k, X]], b)}`;
  function g6() {
    for (let t = 0; t < 300; t++) {
      const sub = wpick([['centroid', 2], ['height', 2], ['sym', 2], ['perpInt', 2], ['ang45', 2], ['median', 2]]);
      if (sub === 'centroid') {
        const A = [ri(-4, 4), ri(-4, 4)], B = [ri(-4, 4), ri(-4, 4)], O = [ri(-3, 3), ri(-3, 3)];
        const C = [3 * O[0] - A[0] - B[0], 3 * O[1] - A[1] - B[1]];
        if (eqv(A, B) || Math.abs(C[0]) > 12 || Math.abs(C[1]) > 12) continue;
        const d1 = [2 * O[0] - A[0] - B[0], 2 * O[1] - A[1] - B[1]], d2 = [O[0] - A[0] - B[0], O[1] - A[1] - B[1]], d3 = [3 * O[0] + A[0] + B[0], 3 * O[1] + A[1] + B[1]];
        const opts = [C, d1, d2, d3].map((p) => `<i>C</i>${pt(p)}`);
        if (!uniq(opts)) continue;
        return { title: 'Третья вершина по точке пересечения медиан',
          q: `Даны вершины треугольника <i>A</i>${pt(A)}, <i>B</i>${pt(B)} и точка пересечения его медиан <i>O</i>${pt(O)}. Найти третью вершину <i>C</i>.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Точка пересечения медиан — среднее ТРЁХ вершин: делим на 3, а не на 2.', 2: 'Забыл умножить O на 3: x_C = 3·x_O − x_A − x_B.', 3: 'Координаты A и B надо вычитать, а не прибавлять.' } }],
          sol: step(1, `Точка пересечения медиан — среднее арифметическое вершин: <i>x</i><sub>O</sub> = (<i>x</i><sub>A</sub> + <i>x</i><sub>B</sub> + <i>x</i><sub>C</sub>)/3.`) +
            step(2, `Отсюда <i>x</i><sub>C</sub> = 3<i>x</i><sub>O</sub> − <i>x</i><sub>A</sub> − <i>x</i><sub>B</sub> = 3·${num(O[0])} − ${num(A[0])} − ${num(B[0])} = ${num(C[0])}; так же <i>y</i><sub>C</sub> = ${num(C[1])}.`) +
            ok(`Проверка: (${num(A[0])} + ${num(B[0])} + ${num(C[0])})/3 = ${num(O[0])}.`), meta: { type: '6', sub, A, B, C, O } };
      }
      if (sub === 'height') {
        const A = [ri(-4, 4), ri(-4, 4)], B = [ri(-4, 4), ri(-4, 4)], C = [ri(-4, 4), ri(-4, 4)];
        const dx = B[0] - A[0], dy = B[1] - A[1];
        if ((dx === 0 && dy === 0) || dx === 0 || dy === 0) continue;
        const AB = normLine(dy, -dx, dx * A[1] - dy * A[0]);
        const val = AB[0] * C[0] + AB[1] * C[1] + AB[2]; if (val === 0) continue;
        const H = normLine(dx, dy, -(dx * C[0] + dy * C[1]));
        const Pw = normLine(dy, -dx, -(dy * C[0] - dx * C[1]));
        const opts = [line2(...H), line2(...Pw), line2(...AB), line2(H[0], H[1], -H[2])];
        const S = AB[0] * AB[0] + AB[1] * AB[1], r = Math.sqrt(S);
        const lenH = (v, den) => (Number.isInteger(den) ? num(new Q(Math.abs(v), den)) : FR(Math.abs(v), SQRT(S)));
        const L = [lenH(val, Number.isInteger(r) ? r : 1.5), num(new Q(Math.abs(val), S)), Number.isInteger(r) ? String(r) : SQRT(S), lenH(AB[0] * C[0] + AB[1] * C[1] - AB[2], Number.isInteger(r) ? r : 1.5)];
        if (!uniq(opts) || !uniq(L) || H[2] === 0) continue;
        return { title: 'Уравнение и длина высоты',
          q: `Дан треугольник <i>A</i>${pt(A)}, <i>B</i>${pt(B)}, <i>C</i>${pt(C)}. Составить уравнение высоты, проведённой из вершины <i>C</i>, и найти её длину.`,
          parts: [{ label: 'Уравнение высоты:', opts, why: { 1: 'Это прямая через C ПАРАЛЛЕЛЬНО AB. Высота перпендикулярна AB, поэтому вектор AB — её нормаль.', 2: 'Это сама сторона AB, а не высота.', 3: 'Ошибка в знаке свободного члена — подставь точку C для проверки.' } },
            { label: 'Длина высоты:', opts: L, why: { 1: 'В знаменателе корень из (A² + B²), а не сама сумма.', 2: 'Это длина стороны AB, а не высоты.', 3: 'Ошибка в знаке C в числителе: |A·x + B·y + C|.' } }],
          sol: step(1, `Высота ⟂ <i>AB</i>, поэтому <i>AB</i> = (${num(dx)}; ${num(dy)}) — её нормаль. Через <i>C</i>: ${num(dx)}(${sh(X, C[0])}) + ${num(dy)}(${sh(Y, C[1])}) = 0 ⇒ <span class="eq-in">${opts[0]}</span>.`) +
            step(2, `Прямая <i>AB</i> (через две точки): <span class="eq-in">${line2(...AB)}</span>.`) +
            step(3, `Длина высоты — расстояние от <i>C</i> до <i>AB</i>: |${num(AB[0])}·${num(C[0])} + ${num(AB[1])}·${num(C[1])} + ${num(AB[2])}| / √(${AB[0] * AB[0]} + ${AB[1] * AB[1]}) = ${L[0]}.`),
          meta: { type: '6', sub, A, B, C, H, val, S } };
      }
      if (sub === 'sym') {
        const Hh = [ri(-3, 3), ri(-3, 3)], n = [nz(-3, 3), nz(-3, 3)], k = pick([1, -1, 2, -2]);
        if (gcd(n[0], n[1]) !== 1) continue;
        const c = -(n[0] * Hh[0] + n[1] * Hh[1]);
        const M = [Hh[0] + k * n[0], Hh[1] + k * n[1]], Ms = [2 * Hh[0] - M[0], 2 * Hh[1] - M[1]];
        const opts = [Ms, Hh, [-M[0], -M[1]], [Ms[0], 2 * Hh[1] + M[1]]].map((p) => `<i>M</i>′${pt(p)}`);
        if (!uniq(opts)) continue;
        return { title: 'Точка, симметричная относительно прямой',
          q: `Найти точку, симметричную точке <i>M</i>${pt(M)} относительно прямой <span class="eq-in">${line2(n[0], n[1], c)}</span>.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Это проекция H — середина отрезка MM′. Симметричная точка дальше: M′ = 2H − M.', 2: 'Это симметрия относительно начала координат, а не прямой.', 3: 'Ошибка в одной координате: M′ = 2H − M по каждой координате.' } }],
          sol: step(1, `Прямая через <i>M</i> перпендикулярно данной (по нормали ${vec(n)}): <i>x</i> = ${comp(M[0], n[0])}, <i>y</i> = ${comp(M[1], n[1])}.`) +
            step(2, `Подставляем в данную прямую и находим <i>t</i> = ${-k}. Получаем проекцию <i>H</i>${pt(Hh)}.`) +
            step(3, `<i>H</i> — середина <i>MM</i>′, поэтому <i>M</i>′ = 2<i>H</i> − <i>M</i> = ${pt(Ms)}.`), meta: { type: '6', sub, M, Hh, Ms, n, c } };
      }
      if (sub === 'perpInt') {
        const P = [ri(-3, 3), ri(-3, 3)];
        const n1 = [nz(-3, 3), nz(-3, 3)], n2 = [nz(-3, 3), nz(-3, 3)]; if (n1[0] * n2[1] - n1[1] * n2[0] === 0) continue;
        const c1 = -(n1[0] * P[0] + n1[1] * P[1]), c2 = -(n2[0] * P[0] + n2[1] * P[1]);
        const n3 = [ri(1, 4), nz(-4, 4)]; const c3 = nz(-6, 6);
        const ans = normLine(n3[1], -n3[0], -(n3[1] * P[0] - n3[0] * P[1]));
        const par = normLine(n3[0], n3[1], -(n3[0] * P[0] + n3[1] * P[1]));
        const wr = normLine(n3[1], n3[0], -(n3[1] * P[0] + n3[0] * P[1]));
        const opts = [line2(...ans), line2(...par), line2(ans[0], ans[1], -ans[2]), line2(...wr)];
        if (!uniq(opts) || ans[2] === 0) continue;
        return { title: 'Прямая через точку пересечения ⟂ третьей прямой',
          q: `Составить уравнение прямой, проходящей через точку пересечения прямых <span class="eq-in">${line2(n1[0], n1[1], c1)}</span> и <span class="eq-in">${line2(n2[0], n2[1], c2)}</span> перпендикулярно прямой <span class="eq-in">${line2(n3[0], n3[1], c3)}</span>.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Это параллельная прямая. Для перпендикулярной нормаль — (B; −A) от данной.', 2: 'Ошибка в знаке свободного члена.', 3: 'Для перпендикулярного вектора мало поменять A и B местами — у одного надо сменить знак.' } }],
          sol: step(1, `Решаем систему из двух первых уравнений — точка пересечения ${pt(P)}.`) +
            step(2, `Нормаль третьей прямой (${num(n3[0])}; ${num(n3[1])}) — направление искомой. Нормаль искомой: (${num(n3[1])}; ${num(-n3[0])}).`) +
            step(3, `Через точку ${pt(P)}: <span class="eq-in">${opts[0]}</span>.`), meta: { type: '6', sub, P, ans, n3 } };
      }
      if (sub === 'ang45') {
        const k1 = pick([2, 3, -2, -3, new Q(1, 2), new Q(-1, 2), new Q(1, 3), 4]); const K = Q.of(k1);
        const b1 = ri(-3, 3), M = [ri(-3, 3), ri(-3, 3)];
        const ka = K.sub(1).div(K.add(1)), kb = K.add(1).div(new Q(1).sub(K));
        const bOf = (k) => new Q(M[1]).sub(k.mul(M[0]));
        const L = (k) => slopeLine(k, bOf(k));
        const pair = (x, y) => `${L(x)} и ${L(y)}`;
        const opts = [pair(ka, kb), pair(ka.neg(), kb.neg()), pair(K.add(1), K.sub(1)), `только ${L(ka)}`];
        if (!uniq(opts) || M[1] === K.mul(M[0]).v + b1) continue;
        return { title: 'Прямая через точку под углом 45° к данной',
          q: `Составить уравнение прямой, проходящей через точку <i>M</i>${pt(M)} под углом 45° к прямой <span class="eq-in">${slopeLine(K, b1)}</span>. Рассмотреть все случаи.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Ошибка в знаке: в формуле tg φ = (k − k₁)/(1 + k₁k) — числитель k − k₁.', 2: 'Угловые коэффициенты не прибавляют к углу. Нужна формула tg φ = |(k − k₁)/(1 + k₁k)| = 1.', 3: 'Модуль раскрывается двумя способами (+1 и −1) — ответов два.' } }],
          sol: step(1, `<i>k</i>₁ = ${num(K)}. Условие: |(<i>k</i> − <i>k</i>₁)/(1 + <i>k</i>₁<i>k</i>)| = tg 45° = 1.`) +
            step(2, `Случай «= 1»: <i>k</i> − ${num(K)} = 1 + ${num(K)}<i>k</i> ⇒ <i>k</i> = ${num(kb)}. Случай «= −1»: <i>k</i> − ${num(K)} = −1 − ${num(K)}<i>k</i> ⇒ <i>k</i> = ${num(ka)}.`) +
            step(3, `Через <i>M</i>: <i>y</i> − ${num(M[1])} = <i>k</i>(<i>x</i> − ${num(M[0])}). Получаем ${opts[0]}.`), meta: { type: '6', sub, K: K.v, ka: ka.v, kb: kb.v } };
      }
      // угол между стороной AB и медианой AM
      const A = [ri(-3, 3), ri(-3, 3)], B = [ri(-4, 4), ri(-4, 4)], C = [ri(-4, 4), ri(-4, 4)];
      if ((B[0] + C[0]) % 2 || (B[1] + C[1]) % 2) continue;
      const M = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2];
      const u = [B[0] - A[0], B[1] - A[1]], v = [M[0] - A[0], M[1] - A[1]];
      if (u[0] === 0 || v[0] === 0 || eqv(B, C)) continue;
      const k1 = new Q(u[1], u[0]), k2 = new Q(v[1], v[0]);
      const den = new Q(1).add(k1.mul(k2)); if (den.p === 0 || k1.eq(k2)) continue;
      let q = k2.sub(k1).div(den); if (q.p < 0) q = q.neg();
      const qa = k2.sub(k1).div(new Q(1).sub(k1.mul(k2))); const qaa = qa.p < 0 ? qa.neg() : qa;
      const qb = k2.sub(k1); const qbb = qb.p < 0 ? qb.neg() : qb;
      const ar = (x) => (x.eq(1) ? '45°' : `arctg ${num(x)}`);
      const opts = [ar(q), ar(new Q(q.q, q.p)), ar(qaa), ar(qbb)];
      if (!uniq(opts) || qaa.p === 0) continue;
      return { title: 'Угол между стороной и медианой',
        q: `Найти угол между стороной <i>AB</i> и медианой <i>AM</i> треугольника <i>ABC</i>: <i>A</i>${pt(A)}, <i>B</i>${pt(B)}, <i>C</i>${pt(C)}.`,
        parts: [{ label: 'φ =', opts, why: { 1: 'Дробь перевёрнута: tg φ = |(k₂ − k₁)/(1 + k₁k₂)|.', 2: 'В знаменателе 1 + k₁k₂ (плюс).', 3: 'Забыл знаменатель 1 + k₁k₂.' } }],
        sol: step(1, `<i>M</i> — середина <i>BC</i>: ${pt(M)}.`) + step(2, `Угловые коэффициенты: <i>k</i><sub>AB</sub> = ${num(u[1])}/${num(u[0])} = ${num(k1)}, <i>k</i><sub>AM</sub> = ${num(v[1])}/${num(v[0])} = ${num(k2)}.`) +
          step(3, `tg φ = |(${num(k2)} − ${num(k1)}) / (1 + ${num(k1)}·${num(k2)})| = ${num(q)}, φ = ${ar(q)}.`), meta: { type: '6', sub, k1: k1.v, k2: k2.v, q: q.v } };
    }
  }

  /* =====================================================================
     №7 · пространство, уровень B
     ===================================================================== */
  function g7() {
    for (let t = 0; t < 300; t++) {
      const sub = wpick([['proj', 2], ['sym', 2], ['inter', 2], ['canon', 2], ['projLine', 2]]);
      if (sub === 'proj' || sub === 'sym') {
        const H = [ri(-3, 3), ri(-3, 3), ri(-3, 3)], n = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], k = pick([1, -1, 2, -2]);
        if (gcdN(n) !== 1) continue;
        const D = -dot(n, H); const P = add3(H, n.map((x) => k * x)); const S = sub3(H.map((x) => 2 * x), P);
        const over = add3(P, n.map((x) => k * x));
        const opts = sub === 'proj' ? [H, S, over, P.map((x, i) => (i === 1 ? -x : x))] : [S, H, neg3(P), over];
        const oh = opts.map(pt);
        if (!uniq(oh)) continue;
        return { title: sub === 'proj' ? 'Проекция точки на плоскость' : 'Точка, симметричная относительно плоскости',
          q: `Найти ${sub === 'proj' ? 'проекцию точки' : 'точку, симметричную точке'} <i>P</i>${pt(P)} ${sub === 'proj' ? 'на плоскость' : 'относительно плоскости'} <span class="eq-in">${plane(n, D)}</span>.`,
          parts: [{ label: 'Ответ:', opts: oh, why: sub === 'proj'
            ? { 1: 'Это симметричная точка (она в 2 раза дальше). Проекция лежит в самой плоскости.', 2: 'Ошибка в знаке t: проверь, что найденная точка удовлетворяет уравнению плоскости.', 3: 'Сделай проверку: найденная точка должна лежать в плоскости.' }
            : { 1: 'Это проекция H — середина отрезка PP′. Симметричная точка: P′ = 2H − P.', 2: 'Это симметрия относительно начала координат.', 3: 'Ошибка в знаке t при нахождении H.' } }],
          sol: step(1, `Прямая через <i>P</i> по нормали ${vec(n)}: ${param(P, n)}.`) +
            step(2, `Подставляем в плоскость: ${lin([[dot(n, n), T]], dot(n, P) + D)} = 0 ⇒ <i>t</i> = ${-k}. Проекция <i>H</i>${pt(H)}.`) +
            (sub === 'sym' ? step(3, `<i>H</i> — середина <i>PP</i>′: <i>P</i>′ = 2<i>H</i> − <i>P</i> = ${pt(S)}.`) : ok(`Проверка: ${pt(H)} лежит в плоскости.`)),
          meta: { type: '7', sub, P, H, S, n, D } };
      }
      if (sub === 'inter') {
        const L0 = [ri(-3, 3), ri(-3, 3), ri(-3, 3)], s = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = nz(-2, 2);
        const n = [nz(-3, 3), nz(-3, 3), nz(-3, 3)]; if (dot(n, s) === 0) continue;
        const Xp = add3(L0, s.map((x) => t0 * x)); const D = -dot(n, Xp);
        const opts = [Xp, add3(L0, s.map((x) => -t0 * x)), L0, add3(L0, s.map((x) => (t0 + 1) * x))].map(pt);
        if (!uniq(opts)) continue;
        return { title: 'Точка пересечения прямой и плоскости',
          q: `Найти точку пересечения прямой <span class="eq-in">${canon(L0, s)}</span> и плоскости <span class="eq-in">${plane(n, D)}</span>.`,
          parts: [{ label: 'Ответ:', opts, why: { 1: 'Ошибка в знаке t — подставь ответ в плоскость для проверки.', 2: 'Это точка прямой при t = 0 — она не лежит в плоскости.', 3: 'Арифметическая ошибка при нахождении t.' } }],
          sol: step(1, `Параметрически: ${param(L0, s)}.`) + step(2, `Подставляем в плоскость: ${lin([[dot(n, s), T]], dot(n, L0) + D)} = 0 ⇒ <i>t</i> = ${t0}.`) + step(3, `Точка: ${pt(Xp)}.`) + ok('Проверка: точка удовлетворяет уравнению плоскости.'),
          meta: { type: '7', sub, Xp, n, D, L0, s } };
      }
      if (sub === 'canon') {
        const n1 = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], n2 = [nz(-3, 3), nz(-3, 3), nz(-3, 3)];
        const c = cross(n1, n2); if (c.every((x) => x === 0) || c[1] === 0) continue;
        const s = reduce(c); const Xp = [ri(-3, 3), 0, ri(-3, 3)];
        const D1 = -dot(n1, Xp), D2 = -dot(n2, Xp);
        const sj = reduce([c[0], -c[1], c[2]]); if (eqv(sj, s)) continue;
        const sOpts = [vec(s), vec(sj), vec(reduce(add3(n1, n2)).every((x) => x === 0) ? [1, 2, 3] : reduce(add3(n1, n2))), vec(n1)];
        const pOpts = [pt(Xp), pt([Xp[2], 0, Xp[0]]), pt([-Xp[0], 0, -Xp[2]]), pt([Xp[0] + 1, 0, Xp[2]])];
        if (!uniq(sOpts) || !uniq(pOpts)) continue;
        return { title: 'Каноническое уравнение прямой из двух плоскостей',
          q: `Составить каноническое уравнение прямой <span class="eq-in">${plane(n1, D1)}</span>, <span class="eq-in">${plane(n2, D2)}</span>.`,
          parts: [{ label: 'Направляющий вектор (сокращённый):', opts: sOpts, why: { 1: 'В векторном произведении у среднего слагаемого (при j) знак минус.', 2: 'Направление — векторное произведение нормалей, а не их сумма.', 3: 'Это нормаль первой плоскости. Направление прямой ⟂ обеим нормалям: s = n₁ × n₂.' } },
            { label: 'Точка прямой при <i>y</i> = 0:', opts: pOpts, why: { '*': 'Подставь y = 0 в оба уравнения и реши систему из двух уравнений с x и z.' } }],
          sol: step(1, `<b>s</b> = <b>n</b>₁ × <b>n</b>₂ = ${vec(c)}${eqv(c, s) ? '' : `, сокращаем: ${vec(s)}`}.`) + step(2, `Положим <i>y</i> = 0 и решим систему из двух уравнений — получится точка ${pt(Xp)}.`) +
            step(3, `<div class="eq">${canon(Xp, s)}</div>`) + ok('Проверка: s скалярно на каждую нормаль даёт 0; точка удовлетворяет обоим уравнениям.'), meta: { type: '7', sub, n1, n2, s, Xp, D1, D2 } };
      }
      // проекция точки на прямую
      const L0 = [ri(-3, 3), ri(-3, 3), ri(-3, 3)], s = [nz(-3, 3), nz(-3, 3), nz(-3, 3)], t0 = nz(-2, 2);
      const Xp = add3(L0, s.map((x) => t0 * x)); const w = cross(s, [ri(-1, 1), ri(-1, 1), nz(-1, 1)]);
      if (w.every((x) => x === 0)) continue;
      const P = add3(Xp, w);
      const opts = [Xp, L0, add3(Xp, s), add3(L0, s.map((x) => -t0 * x))].map(pt);
      if (!uniq(opts)) continue;
      return { title: 'Проекция точки на прямую',
        q: `Найти проекцию точки <i>P</i>${pt(P)} на прямую <span class="eq-in">${param(L0, s)}</span>.`,
        parts: [{ label: 'Ответ:', opts, why: { 1: 'Это точка прямой при t = 0. Проекция — та точка M прямой, для которой PM ⟂ s.', 2: 'Ошибка в t на единицу — пересчитай уравнение PM · s = 0.', 3: 'Ошибка в знаке t.' } }],
        sol: step(1, `Точка прямой <i>M</i>(${comp(L0[0], s[0])}; ${comp(L0[1], s[1])}; ${comp(L0[2], s[2])}).`) +
          step(2, `Проекция — там, где <i>PM</i> ⟂ <b>s</b>: <i>PM</i> · ${vec(s)} = 0 ⇒ ${lin([[dot(s, s), T]], dot(s, sub3(L0, P)))} = 0 ⇒ <i>t</i> = ${t0}.`) + step(3, `Подставляем: ${pt(Xp)}.`),
        meta: { type: '7', sub, P, Xp, s } };
    }
  }

  const GEN = { '5': g5, '9': g9, '2': g2, '8': g8, '10': g10, '1': g1, '3': g3, '4': g4, '6': g6, '7': g7 };
  const api = { GEN, Q, setRandom: (f) => { rnd = f; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AT1Gen = api;
})(typeof window !== 'undefined' ? window : globalThis);
