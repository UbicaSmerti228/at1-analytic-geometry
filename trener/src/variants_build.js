// Собирает HTML вкладки «Задачи из вариантов» из страницы разбора вариантов
const fs = require('fs');
const src = fs.readFileSync('/home/claude/varianty/content.html', 'utf8');
const F = require('/home/claude/varianty/figs-v.js');
function removeDivs(html, cls) { // удалить <div class="cls"> вместе с вложенными div
  let out = html, i;
  while ((i = out.indexOf(`<div class="${cls}"`)) !== -1) {
    let depth = 0, j = i;
    const re = /<div\b|<\/div>/g; re.lastIndex = i;
    let m;
    while ((m = re.exec(out))) { if (m[0] === '</div>') { depth--; if (depth === 0) { j = re.lastIndex; break; } } else depth++; }
    out = out.slice(0, i) + out.slice(j);
  }
  return out;
}
function parseVars(block) { // все .var внутри блока
  const items = []; const re = /<div class="var"><div class="var-h"><span class="vtag">(.*?)<\/span><span class="cond">([\s\S]*?)<\/span><\/div>\s*<details class="sol"[^>]*><summary>[\s\S]*?<\/summary><div>([\s\S]*?)<\/div><\/details><\/div>/g;
  const norm = block.replace(/<div class="var">\s*<div class="var-h">/g, '<div class="var"><div class="var-h">').replace(/<\/div>\s*<\/details>\s*<\/div>/g, '</div></details></div>');
  let m; while ((m = re.exec(norm))) items.push({ tag: m[1], cond: m[2], sol: m[3] });
  return items;
}
const TIER = { 5: 'S', 9: 'S', 2: 'A', 4: 'A', 10: 'A', 8: 'B', 1: 'B', 3: 'B', 6: 'C', 7: 'C' };
const PTS = { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4 };
const ORDER = [5, 9, 2, 4, 10, 8, 1, 3, 6, 7];
const V = {}; // V['II'][5] = item
const theory = {};
for (let n = 1; n <= 10; n++) {
  const a = src.indexOf(`<section class="task-sec" id="t${n}">`); const b = src.indexOf('</section>', a);
  for (const it of parseVars(src.slice(a, b))) {
    const v = it.tag.replace('Вар. ', '').trim();
    if (v.endsWith('?')) { theory[v.slice(0, -1)] = it; continue; }
    (V[v] = V[v] || {})[n] = it;
  }
}
const pa = src.indexOf('<section class="block" id="prognoz">'); const pb = src.indexOf('</section>', pa);
const prog = src.slice(pa, pb);
for (const v of ['I', 'V', 'VI']) {
  const a = prog.indexOf(`<b>Вариант ${v} · прогноз</b>`); const b = prog.indexOf('</div></details>\n', prog.indexOf('№10 ·', a));
  for (const it of parseVars(prog.slice(a, b + 30))) {
    const n = parseInt(it.tag.match(/№(\d+)/)[1], 10);
    if (n === 10 && theory[v]) { it.cond = theory[v].cond; it.sol = theory[v].sol; }
    (V['п' + v] = V['п' + v] || {})[n] = it;
  }
}
const LIST = [['II', 'Вариант II'], ['III', 'Вариант III'], ['IV', 'Вариант IV'], ['пI', 'Прогноз I'], ['пV', 'Прогноз V'], ['пVI', 'Прогноз VI']];
let html = '<div class="vchips" role="tablist">' + LIST.map(([k, l], i) => `<button type="button" class="vchip" data-v="${k}" aria-selected="${i === 0}">${l}<small data-vc="${k}"></small></button>`).join('') + '</div>';
let count = 0;
for (const [k, l] of LIST) {
  const set = V[k]; if (!set) throw new Error('no variant ' + k);
  html += `<div class="vset" data-v="${k}"${k === 'II' ? '' : ' hidden'}><h2>${l}${k.startsWith('п') ? ' <span class="muted" style="font-size:.6em">(составлен по типам задач)</span>' : ''}</h2>`;
  for (const n of ORDER) {
    const it = set[n]; if (!it) throw new Error(`missing ${k} №${n}`);
    let sol = removeDivs(it.sol, 'lab');
    sol = sol.replace(/\{\{fig:([a-zA-Z0-9]+)\|([\s\S]*?)\}\}(?!\})/g, (m, name, cap) => F[name] ? `<figure class="fig">${F[name]}<figcaption>${cap}</figcaption></figure>` : '');
    const id = `${k}-${n}`;
    html += `<div class="vcard" data-id="${id}" data-v="${k}">
  <div class="vc-head"><span class="tier t${TIER[n]}">${TIER[n]}</span><b>№${n}</b><span class="vc-pts">${PTS[n]} б.</span><span class="vc-mark"></span></div>
  <div class="vc-q">${it.cond}</div>
  <div class="vc-hint" hidden></div>
  <div class="vc-sol" hidden>${sol}</div>
  <div class="vc-actions"><button type="button" class="vc-hbtn">Подсказка</button><button type="button" class="vc-sbtn">Показать решение</button></div>
  <div class="vc-self" hidden><span>Сам решил?</span><button type="button" class="vc-yes">Да, решил ✓</button><button type="button" class="vc-no">Нет, ошибся</button></div>
</div>`;
    count++;
  }
  html += '</div>';
}
module.exports = { html, count };
if (require.main === module) console.log('cards', count);
