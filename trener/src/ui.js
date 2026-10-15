(function () {
  'use strict';
  const { GEN } = window.AT1Gen;
  const { Plot2D } = window.GeoPlot;
  const ORDER = ['5', '9', '2', '4', '10', '8', '1', '3', '6', '7'];
  const NAMES = { '5': 'Плоскость через точку', '9': 'Поверхность', '2': 'Кривая по числам', '8': 'Построить кривую', '10': 'Теория', '1': 'Прямая на плоскости', '3': 'Плоскость', '4': 'Прямая в пространстве', '6': 'Плоскость, уровень B', '7': 'Пространство, уровень B' };
  const PTS = { '5': 2, '9': 4, '2': 2, '4': 2, '10': 4, '8': 4, '1': 2, '3': 2, '6': 4, '7': 4 };
  const GOOD = ['Верно!', 'Точно!', 'Есть!', 'Отлично!', 'В яблочко!', 'Так держать!'];
  const pickW = (a) => a[Math.floor(Math.random() * a.length)];
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mastered = (t) => st(t).best >= GOAL;
  const nextAfter = (t) => { const i = ORDER.indexOf(t); for (let k = 1; k <= ORDER.length; k++) { const n = ORDER[(i + k) % ORDER.length]; if (!mastered(n)) return n; } return null; };
  const firstTodo = () => ORDER.find((n) => !mastered(n)) || null;
  const left = (n) => (n === 1 ? 'ещё 1 верный' : n < 5 ? `ещё ${n} верных` : `ещё ${n} верных`);
  function goTo(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' }); }
  const GOAL = 5;
  const HINT10 = 'вспомни шпаргалку выводов выше: какое условие выполняется для любой точки M прямой — параллельность, перпендикулярность или тангенс?';
  const KEY = 'at1-trainer-v1';
  let stats = {};
  try { stats = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { stats = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(stats)); } catch (e) {} };
  const st = (t) => (stats[t] = stats[t] || { streak: 0, best: 0, right: 0, total: 0 });
  const shuffleIdx = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let uid = 0;

  /* ---------- графики в решениях ---------- */
  function drawPlot(box, p) {
    let plot;
    const id = 'tp' + (++uid);
    if (p.kind === 'dir9') {
      const c = p.curve;
      if (c.kind === 'ell') {
        const W = Math.max(c.a, c.b) + 1.3;
        plot = new Plot2D({ xmin: -W, xmax: W, ymin: -W, ymax: W, width: 300, xName: p.h, yName: p.v, idp: id, tickEvery: W > 5 ? 2 : 1 });
        plot.curve((t) => [c.a * Math.cos(t), c.b * Math.sin(t)], 0, 2 * Math.PI, 200, 'st-red thick');
      } else if (c.kind === 'hyp') {
        const W = c.a * 3 + 1;
        plot = new Plot2D({ xmin: -W, xmax: W, ymin: -W, ymax: W, width: 300, xName: p.h, yName: p.v, idp: id, tickEvery: W > 6 ? 2 : 1 });
        plot.lineEq(1, -1, 0, 'st-soft dash').lineEq(1, 1, 0, 'st-soft dash');
        const f = c.pos === 'u' ? [(t) => [c.a * Math.cosh(t), c.a * Math.sinh(t)], (t) => [-c.a * Math.cosh(t), c.a * Math.sinh(t)]] : [(t) => [c.a * Math.sinh(t), c.a * Math.cosh(t)], (t) => [c.a * Math.sinh(t), -c.a * Math.cosh(t)]];
        f.forEach((g) => plot.curve(g, -2.2, 2.2, 160, 'st-red thick'));
      } else {
        const W = 4.5;
        plot = new Plot2D({ xmin: c.lin === 'u' ? -1 : -W, xmax: W, ymin: c.lin === 'u' ? -W : -1, ymax: W, width: 300, xName: p.h, yName: p.v, idp: id });
        plot.curve(c.lin === 'u' ? (t) => [c.c * t * t, t] : (t) => [t, c.c * t * t], -3, 3, 160, 'st-red thick');
      }
    } else if (p.kind === 'ell' || p.kind === 'hyp') {
      const a = Math.sqrt(p.al), b = Math.sqrt(p.be);
      const R = p.kind === 'ell' ? 1 : 2.4;
      const xmin = Math.min(p.h - a * R, 0) - 1.2, xmax = Math.max(p.h + a * R, 0) + 1.2;
      const ymin = Math.min(p.k - b * R, 0) - 1.2, ymax = Math.max(p.k + b * R, 0) + 1.2;
      const span = Math.max(xmax - xmin, ymax - ymin);
      plot = new Plot2D({ xmin, xmax, ymin, ymax, width: 340, idp: id, tickEvery: span > 14 ? 4 : span > 8 ? 2 : 1 });
      plot.seg([xmin, p.k], [xmax, p.k], 'st-soft dash').seg([p.h, ymin], [p.h, ymax], 'st-soft dash');
      if (p.kind === 'ell') {
        plot.curve((t) => [p.h + a * Math.cos(t), p.k + b * Math.sin(t)], 0, 2 * Math.PI, 240, 'st-blue thick');
        [[p.h - a, p.k], [p.h + a, p.k], [p.h, p.k - b], [p.h, p.k + b]].forEach((q) => plot.point(q, '', { r: 3.2 }));
      } else {
        plot.path([[p.h - a, p.k - b], [p.h + a, p.k - b], [p.h + a, p.k + b], [p.h - a, p.k + b]], 'st-soft dash', true);
        const m = b / a;
        plot.lineEq(m, -1, p.k - m * p.h, 'st-ink dash').lineEq(-m, -1, p.k + m * p.h, 'st-ink dash');
        if (!p.vert) {
          plot.curve((t) => [p.h + a * Math.cosh(t), p.k + b * Math.sinh(t)], -2.2, 2.2, 160, 'st-blue thick');
          plot.curve((t) => [p.h - a * Math.cosh(t), p.k + b * Math.sinh(t)], -2.2, 2.2, 160, 'st-blue thick');
          plot.point([p.h - a, p.k], '', { r: 3.2 }).point([p.h + a, p.k], '', { r: 3.2 });
        } else {
          plot.curve((t) => [p.h + a * Math.sinh(t), p.k + b * Math.cosh(t)], -2.2, 2.2, 160, 'st-blue thick');
          plot.curve((t) => [p.h + a * Math.sinh(t), p.k - b * Math.cosh(t)], -2.2, 2.2, 160, 'st-blue thick');
          plot.point([p.h, p.k - b], '', { r: 3.2 }).point([p.h, p.k + b], '', { r: 3.2 });
        }
      }
      plot.point([p.h, p.k], `(${fmt(p.h)}; ${fmt(p.k)})`, { dx: 6, dy: 16, it: false, cls: 'red', lcls: 'c-red' });
    } else if (p.kind === 'par') {
      const T = 4, P = p.twoP;
      const far = T * T / Math.abs(P);
      let xmin, xmax, ymin, ymax;
      if (p.horiz) { xmin = Math.min(p.h, p.h + Math.sign(P) * far, 0) - 1; xmax = Math.max(p.h, p.h + Math.sign(P) * far, 0) + 1; ymin = Math.min(p.k - T, 0) - 1; ymax = Math.max(p.k + T, 0) + 1; }
      else { ymin = Math.min(p.k, p.k + Math.sign(P) * far, 0) - 1; ymax = Math.max(p.k, p.k + Math.sign(P) * far, 0) + 1; xmin = Math.min(p.h - T, 0) - 1; xmax = Math.max(p.h + T, 0) + 1; }
      const span = Math.max(xmax - xmin, ymax - ymin);
      plot = new Plot2D({ xmin, xmax, ymin, ymax, width: 330, idp: id, tickEvery: span > 14 ? 4 : span > 8 ? 2 : 1 });
      if (p.horiz) {
        plot.lineEq(1, 0, -(p.h - P / 4), 'st-red dash');
        plot.curve((t) => [p.h + t * t / P, p.k + t], -T, T, 160, 'st-blue thick');
        plot.point([p.h + P / 4, p.k], 'F', { cls: 'red', lcls: 'c-red', dx: 6, dy: -7 });
      } else {
        plot.lineEq(0, 1, -(p.k - P / 4), 'st-red dash');
        plot.curve((t) => [p.h + t, p.k + t * t / P], -T, T, 160, 'st-blue thick');
        plot.point([p.h, p.k + P / 4], 'F', { cls: 'red', lcls: 'c-red', dx: 6, dy: -7 });
      }
      plot.point([p.h, p.k], `(${fmt(p.h)}; ${fmt(p.k)})`, { dx: 6, dy: 16, it: false });
    }
    if (plot) {
      const fig = document.createElement('figure'); fig.className = 'fig';
      fig.innerHTML = plot.svg('Рисунок к решению');
      box.appendChild(fig);
    }
  }
  const fmt = (n) => (n < 0 ? '−' + Math.abs(n) : String(n));

  /* ---------- доска прогресса ---------- */
  function renderBoard() {
    const board = document.getElementById('board');
    if (!board) return;
    let done = 0, pts = 0;
    const todo = firstTodo();
    board.querySelectorAll('[data-b]').forEach((el) => {
      const t = el.dataset.b, s = st(t);
      const m = s.best >= GOAL; if (m) { done++; pts += PTS[t] || 0; }
      el.classList.toggle('mastered', m);
      el.classList.toggle('now', t === todo);
      const n = m ? GOAL : Math.min(s.streak, GOAL);
      el.querySelector('.pips').innerHTML = Array.from({ length: GOAL }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
      el.querySelector('.bst').textContent = m ? 'освоено ✓' : t === todo ? (s.total ? `сейчас · ${s.streak}/5` : 'начни отсюда') : s.total ? `${s.streak}/5 подряд` : 'не начат';
      const toc = document.querySelector(`.toc a[href="#t${t}"]`); if (toc) toc.classList.toggle('mastered', m);
    });
    const sum = document.getElementById('board-sum');
    if (sum) sum.textContent = done ? `Освоено ${done} из ${ORDER.length} · это ≈ ${pts}\u00a0б.` : `Освоено 0 из ${ORDER.length}`;
    document.querySelectorAll('[data-cta]').forEach((a) => {
      if (todo) { a.href = '#t' + todo; a.textContent = (ORDER.some((n) => stats[n] && stats[n].total) ? 'Продолжить: №' : 'Начать с №') + todo + ' →'; }
      else { a.href = '#end'; a.textContent = 'Всё освоено — к финишу →'; }
    });
    document.querySelectorAll('[data-cta-sub]').forEach((el) => {
      el.textContent = todo ? `${NAMES[todo]} · ${PTS[todo]}\u00a0б.` : 'ты прошёл все 10 номеров';
    });
  }

  /* ---------- карточка тренажёра ---------- */
  function Trainer(root) {
    const t = root.dataset.type;
    let item = null, answered = [], finished = false;
    root.innerHTML = `<div class="tt-head"><span class="tt-title"></span><span class="tt-stat"><span class="tt-pips" aria-hidden="true"></span><span class="tt-goal"></span></span></div>
      <ol class="tt-flow"><li>Реши на бумаге</li><li>Нажми свой ответ</li><li>Прочитай разбор</li></ol>
      <div class="tt-qbox"><div class="tt-qh">Задача</div><div class="tt-q"></div></div>
      <div class="tt-hintbox" hidden></div>
      <div class="tt-parts"></div>
      <div class="tt-sol" hidden></div>
      <div class="tt-actions"><button type="button" class="tt-hint">Подсказка</button><button type="button" class="tt-show">Не знаю — покажи решение</button><button type="button" class="tt-next">Другая задача ↻</button></div>`;
    const $ = (s) => root.querySelector(s);
    const statLine = () => {
      const s = st(t), m = s.best >= GOAL, n = Math.min(s.streak, GOAL);
      $('.tt-pips').innerHTML = Array.from({ length: GOAL }, (_, i) => `<i class="${i < n || (m && s.streak >= GOAL) ? 'on' : ''}"></i>`).join('');
      $('.tt-goal').textContent = m ? (s.streak >= GOAL ? 'освоено ✓' : `освоено ✓ · подряд ${s.streak}`) : `${left(GOAL - n)} подряд до «освоено»`;
      $('.tt-stat').title = `всего верно ${s.right} из ${s.total}`;
    };
    const flow = (k) => root.querySelectorAll('.tt-flow li').forEach((li, i) => { li.classList.toggle('on', k === 1 ? i < 2 : i === 2); li.classList.toggle('past', k === 2 && i < 2); });
    function finish(gotAll, gaveUp) {
      if (finished) return;
      finished = true;
      const s = st(t); s.total++;
      const wasM = s.best >= GOAL;
      if (gotAll) { s.right++; s.streak++; s.best = Math.max(s.best, s.streak); } else s.streak = 0;
      save(); statLine(); renderBoard(); flow(2);
      showSolution();
      const res = document.createElement('div');
      res.className = 'tt-res ' + (gotAll ? 'good' : 'bad');
      res.setAttribute('role', 'status');
      const justM = gotAll && !wasM && s.best >= GOAL;
      const nx = nextAfter(t);
      if (justM) {
        res.className = 'tt-res good master';
        res.innerHTML = `<b>Номер освоен! 🎉</b><span>5 верных подряд — №${t} теперь твой, это ${PTS[t]}\u00a0б. на контрольной.</span>` +
          (nx ? `<button type="button" class="tt-go">Дальше: №${nx} · ${NAMES[nx]} →</button>` : `<button type="button" class="tt-go" data-end>Все номера освоены — к финишу →</button>`);
      } else if (gotAll) {
        const k = GOAL - Math.min(s.streak, GOAL);
        res.innerHTML = `<b>${pickW(GOOD)}</b><span>${wasM ? 'Номер уже освоен — можешь идти дальше или потренироваться ещё.' : `Подряд ${s.streak} из ${GOAL}: ${left(k)} — и номер освоен. Разбор ниже, если хочешь сверить.`}</span>`;
      } else if (gaveUp) {
        res.innerHTML = `<b>Ничего страшного — так и учатся.</b><span>Прочитай решение ниже по шагам, потом жми «Следующая задача»: там будут новые числа, тот же приём.</span>`;
      } else {
        res.innerHTML = `<b>Почти! Есть ошибка.</b><span>Зелёным отмечен правильный ответ, красной чертой под вариантами — в чём промах. Разбор ниже, потом «Следующая задача». Серия начнётся заново — это нормально.</span>`;
      }
      $('.tt-parts').after(res);
      const go = res.querySelector('.tt-go');
      if (go) go.addEventListener('click', () => goTo(go.dataset.end !== undefined ? 'end' : 't' + nx));
      $('.tt-show').hidden = true; $('.tt-hint').hidden = true;
      const nb = $('.tt-next'); nb.textContent = 'Следующая задача →'; nb.classList.add('primary');
      requestAnimationFrame(() => { const r = res.getBoundingClientRect(); if (r.bottom > innerHeight - 20 || r.top < 60) res.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' }); });
    }
    function showSolution() {
      const sol = $('.tt-sol');
      if (!sol.hidden) return;
      sol.hidden = false;
      sol.innerHTML = item.sol ? `<div class="tt-sol-h">Решение</div>${item.sol}` : '';
      if (item.plot) drawPlot(sol, item.plot);
      if (!item.sol && !item.plot) sol.hidden = true;
    }
    function render() {
      item = GEN[t]();
      answered = item.parts.map(() => null); finished = false;
      root.querySelector('.tt-res')?.remove();
      $('.tt-title').textContent = item.title;
      $('.tt-q').innerHTML = item.q;
      $('.tt-sol').hidden = true; $('.tt-sol').innerHTML = '';
      $('.tt-show').hidden = false; $('.tt-hint').hidden = false; $('.tt-hintbox').hidden = true;
      const nb = $('.tt-next'); nb.textContent = 'Другая задача ↻'; nb.classList.remove('primary');
      flow(1);
      const parts = $('.tt-parts'); parts.innerHTML = '';
      item.parts.forEach((p, pi) => {
        const wrap = document.createElement('div'); wrap.className = 'tt-part';
        wrap.innerHTML = `<div class="tt-label">${item.parts.length > 1 ? `<span class="tt-pn">${pi + 1}/${item.parts.length}</span>` : ''}${p.label}</div><div class="tt-opts"></div><div class="tt-why" hidden></div>`;
        const opts = wrap.querySelector('.tt-opts');
        shuffleIdx(p.opts.length).forEach((oi) => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'tt-opt'; b.innerHTML = p.opts[oi];
          b.addEventListener('click', () => {
            if (answered[pi] !== null || finished) return;
            const good = oi === 0;
            answered[pi] = good;
            opts.querySelectorAll('.tt-opt').forEach((x) => { x.disabled = true; });
            b.classList.add(good ? 'right' : 'wrong');
            if (!good) {
              opts.querySelectorAll('.tt-opt').forEach((x) => { if (x.dataset.i === '0') x.classList.add('right'); });
              const why = p.why && (p.why[oi] || p.why['*']);
              if (why) { const w = wrap.querySelector('.tt-why'); w.hidden = false; w.textContent = why; }
            }
            wrap.classList.add(good ? 'p-ok' : 'p-bad');
            if (answered.every((x) => x !== null)) finish(answered.every(Boolean));
            else { const nxt = parts.querySelectorAll('.tt-part')[answered.findIndex((x) => x === null)]; if (nxt) { nxt.classList.add('p-next'); const r = nxt.getBoundingClientRect(); if (r.top > innerHeight - 120) nxt.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' }); } }
          });
          b.dataset.i = String(oi);
          opts.appendChild(b);
        });
        parts.appendChild(wrap);
      });
      statLine();
    }
    $('.tt-next').addEventListener('click', () => { render(); root.classList.remove('fresh'); void root.offsetWidth; root.classList.add('fresh'); if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' }); });
    $('.tt-show').addEventListener('click', () => { if (!finished) finish(false, true); });
    $('.tt-hint').addEventListener('click', () => {
      const box = $('.tt-hintbox');
      const tmp = document.createElement('div'); tmp.innerHTML = item.sol || '';
      const first = tmp.querySelector('.st > div');
      box.innerHTML = '<b>💡 Первый шаг:</b> ' + (first ? first.innerHTML : (HINT10)) + '<div class="tt-hint-more">Дальше попробуй сам — подсказка не сбивает серию.</div>';
      box.hidden = false; $('.tt-hint').hidden = true;
    });
    root.addEventListener('restat', statLine);
    render();
  }

  function resetAll() {
    const btn = document.getElementById('reset');
    if (!btn) return;
    let armed = false, tm = 0;
    btn.addEventListener('click', () => {
      if (!armed) { armed = true; btn.textContent = 'Точно сбросить? Нажми ещё раз'; tm = setTimeout(() => { armed = false; btn.textContent = 'Сбросить прогресс'; }, 3500); return; }
      clearTimeout(tm); armed = false; btn.textContent = 'Сбросить прогресс';
      stats = {}; save(); renderBoard();
      document.querySelectorAll('.trainer').forEach((r) => r.dispatchEvent(new Event('restat')));
      const sum = document.getElementById('board-sum'); if (sum) sum.textContent = 'Прогресс сброшен — начинаем заново!';
    });
  }


  /* ---------- вкладки и задачи вариантов ---------- */
  function tabs() {
    const VKEY = 'at1-trainer-var-v1';
    let vs = {}; try { vs = JSON.parse(localStorage.getItem(VKEY) || '{}') || {}; } catch (e) { vs = {}; }
    const vsave = () => { try { localStorage.setItem(VKEY, JSON.stringify(vs)); } catch (e) {} };
    const show = (t) => {
      document.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
      document.getElementById('pane-train').hidden = t !== 'train';
      document.getElementById('pane-var').hidden = t !== 'var';
    };
    document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => { show(b.dataset.tab); window.scrollTo({ top: document.querySelector('.tabs').offsetTop - 8 }); }));
    if (location.hash === '#varianty') show('var');
    document.querySelectorAll('[data-goto-var]').forEach((b) => b.addEventListener('click', () => { show('var'); window.scrollTo({ top: document.querySelector('.tabs').offsetTop - 8, behavior: reduce() ? 'auto' : 'smooth' }); }));
    const counts = () => document.querySelectorAll('[data-vc]').forEach((el) => {
      const k = el.dataset.vc; const n = [...document.querySelectorAll(`.vcard[data-v="${k}"]`)].filter((c) => vs[c.dataset.id] === 1).length;
      el.textContent = n ? `${n}/10` : '';
    });
    document.querySelectorAll('.vchip').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('.vchip').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      document.querySelectorAll('.vset').forEach((s) => { s.hidden = s.dataset.v !== b.dataset.v; });
    }));
    document.querySelectorAll('.vcard').forEach((c) => {
      const id = c.dataset.id, q = (s) => c.querySelector(s);
      const mark = () => { c.classList.toggle('vok', vs[id] === 1); c.classList.toggle('vbad', vs[id] === 0); q('.vc-mark').textContent = vs[id] === 1 ? 'решил ✓' : vs[id] === 0 ? 'повторить' : ''; };
      q('.vc-hbtn').addEventListener('click', () => {
        const sol = q('.vc-sol'); const first = sol.querySelector('.step > div') || sol.querySelector('p');
        const h = q('.vc-hint'); h.innerHTML = '<b>Подсказка:</b> ' + (first ? first.innerHTML : 'посмотри алгоритм этого номера во вкладке «Тренажёр».'); h.hidden = false; q('.vc-hbtn').hidden = true;
      });
      q('.vc-sbtn').addEventListener('click', () => { q('.vc-sol').hidden = false; q('.vc-sbtn').hidden = true; q('.vc-hbtn').hidden = true; q('.vc-hint').hidden = true; q('.vc-self').hidden = false; });
      q('.vc-yes').addEventListener('click', () => { vs[id] = 1; vsave(); mark(); counts(); q('.vc-mark').textContent = pickW(['решил ✓', 'молодец ✓', 'засчитано ✓']); });
      q('.vc-no').addEventListener('click', () => { vs[id] = 0; vsave(); mark(); counts(); q('.vc-mark').textContent = 'вернёмся позже'; });
      mark();
    });
    counts();
  }

  const start = () => { document.querySelectorAll('.trainer').forEach(Trainer); renderBoard(); resetAll(); tabs(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
