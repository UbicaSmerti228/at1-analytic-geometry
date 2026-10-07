/*
 * Сборка сайта: src/ → docs/index.html
 *
 *  1. Склеивает три файла из src/content/.
 *  2. Рендерит все формулы ($…$ и $$…$$) через KaTeX прямо при сборке —
 *     сайту не нужен интернет, а любая ошибка в формуле останавливает сборку.
 *  3. Вставляет рисунки {{fig:имя|подпись}} из figs.js (SVG строятся по настоящим уравнениям).
 *  4. Встраивает шрифты KaTeX внутрь страницы — получается один самодостаточный файл.
 *
 * Запуск: npm install && npm run build
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = __dirname;
const katexDir = path.dirname(require.resolve('katex/package.json', { paths: [ROOT, ...(process.env.NODE_PATH || '').split(':').filter(Boolean)] }));
const katex = require(path.join(katexDir, 'dist', 'katex.js'));
const F = require('./figs.js');
const alias = { task6: 'triangle' };

const read = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const contentDir = path.join(SRC, 'content');
let body = fs.readdirSync(contentDir).filter((f) => f.endsWith('.html')).sort()
  .map((f) => fs.readFileSync(path.join(contentDir, f), 'utf8')).join('\n');

/* 1. Формулы. Цепочки «⇒» в выносных формулах переносятся на новые строки. */
const stack = (s) => /\\ \\Rightarrow\\ /.test(s) && !/aligned|gathered/.test(s)
  ? '\\begin{gathered} ' + s.split(/\s*\\ \\Rightarrow\\ \s*/).join(' \\\\ \\Rightarrow\\ ') + ' \\end{gathered}' : s;
const errors = [];
let count = 0;
const tex = (src, display) => {
  if (/[<>]/.test(src)) { errors.push('HTML внутри формулы: ' + src.slice(0, 80)); return src; }
  count++;
  try {
    return katex.renderToString(src, { displayMode: display, output: 'html', throwOnError: true, strict: 'ignore' });
  } catch (e) { errors.push(e.message + '  ⟵  ' + src.slice(0, 80)); return src; }
};
body = body.split(/(<svg[\s\S]*?<\/svg>)/).map((seg) => seg.startsWith('<svg') ? seg : seg
  .replace(/\$\$([\s\S]+?)\$\$/g, (m, s) => tex(stack(s.trim()), true))
  .replace(/\$([^$]+?)\$/g, (m, s) => tex(s, false))).join('');

/* 2. Рисунки */
body = body.replace(/\{\{fig:([a-zA-Z0-9]+)\|([\s\S]*?)\}\}(?!\})/g, (m, name, cap) => {
  const svg = F[alias[name] || name];
  if (!svg) { errors.push('Нет рисунка: ' + name); return ''; }
  return `<figure class="fig">${svg}<figcaption>${cap}</figcaption></figure>`;
});
if (errors.length) { console.error('Сборка остановлена:\n' + errors.join('\n')); process.exit(1); }

/* 3. CSS KaTeX со встроенными шрифтами (только woff2) */
let kcss = fs.readFileSync(path.join(katexDir, 'dist', 'katex.min.css'), 'utf8');
kcss = kcss.replace(/src:url\(fonts\/([^)]+?\.woff2)\) format\("woff2"\)[^;}]*/g, (m, f) =>
  `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(katexDir, 'dist', 'fonts', f)).toString('base64')}) format("woff2")`);

const SITE = 'https://ubicasmerti228.github.io/at1-analytic-geometry/';
const DESC = 'Подготовка к АТ №1 «Аналитическая геометрия» с нуля: теория по модулям, рисунки, 3D-поверхности, 20 теоретических вопросов, полный разбор пробника, тренировочный вариант и чек-лист.';
const favicon = "data:image/svg+xml," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='#1D5BA3'/>" +
  "<ellipse cx='32' cy='32' rx='24' ry='14' fill='none' stroke='#fff' stroke-width='4'/>" +
  "<circle cx='12.5' cy='32' r='4' fill='#F2937D'/><circle cx='51.5' cy='32' r='4' fill='#F2937D'/></svg>");

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>АТ №1 «Аналитическая геометрия»</title>
<meta name="description" content="${DESC}">
<meta name="theme-color" content="#F1F4F2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#131C18" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:title" content="АТ №1 · Аналитическая геометрия">
<meta property="og:description" content="${DESC}">
<meta property="og:url" content="${SITE}">
<meta property="og:image" content="${SITE}preview.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500;600;700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; } img { max-width: 100%; } [hidden] { display: none !important; }
</style>
<style>
${read('style.css')}
</style>
<style>
${kcss}
</style>
</head>
<body>
${body}
<script>
${read('plot.js')}
</script>
<script>
${read('runtime.js')}
</script>
</body>
</html>
`;
const outDir = path.join(ROOT, 'docs');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log(`Готово: docs/index.html — ${count} формул, ${(Buffer.byteLength(html) / 1024).toFixed(0)} КБ`);
