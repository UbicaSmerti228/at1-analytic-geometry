const fs = require('fs'), path = require('path');
const KDIR = '/opt/npm-tools/node_modules/katex/dist';
const katex = require(path.join(KDIR, 'katex.js'));
const F = require('./figs-v.js');
const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');
let body = read('content.html');
const errors = []; let count = 0;
const stack = (s) => /\\ \\Rightarrow\\ /.test(s) && !/aligned|gathered/.test(s)
  ? '\\begin{gathered} ' + s.split(/\s*\\ \\Rightarrow\\ \s*/).join(' \\\\ \\Rightarrow\\ ') + ' \\end{gathered}' : s;
const tex = (src, display) => {
  if (/[<>]/.test(src)) { errors.push('HTML inside math: ' + src.slice(0, 80)); return src; }
  count++;
  try { return katex.renderToString(src, { displayMode: display, output: 'html', throwOnError: true, strict: 'ignore' }); }
  catch (e) { errors.push(e.message + '  <-  ' + src.slice(0, 80)); return src; }
};
body = body.split(/(<svg[\s\S]*?<\/svg>)/).map((seg) => seg.startsWith('<svg') ? seg : seg
  .replace(/\$\$([\s\S]+?)\$\$/g, (m, s) => tex(stack(s.trim()), true))
  .replace(/\$([^$]+?)\$/g, (m, s) => tex(s, false))).join('');
body = body.replace(/\{\{fig:([a-zA-Z0-9]+)\|([\s\S]*?)\}\}(?!\})/g, (m, name, cap) => {
  if (!F[name]) { errors.push('missing fig ' + name); return ''; }
  return `<figure class="fig">${F[name]}<figcaption>${cap}</figcaption></figure>`;
});
if (/\{\{fig:/.test(body)) errors.push('unreplaced fig');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
let kcss = fs.readFileSync(path.join(KDIR, 'katex.min.css'), 'utf8');
kcss = kcss.replace(/src:url\(fonts\/([^)]+?\.woff2)\) format\("woff2"\)[^;}]*/g, (m, f) =>
  `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(KDIR, 'fonts', f)).toString('base64')}) format("woff2")`);
const out = `<title>Разбор вариантов АТ №1</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jura:wght@500;600;700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
${read('style.css')}
${read('extra.css')}
</style>
<style>
${kcss}
</style>
${body}
<script>
${read('plot.js')}
</script>
<script>
${read('runtime.js')}
</script>
`;
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out', 'varianty-at1.html'), out);
console.log('OK', count, 'formulas', (Buffer.byteLength(out) / 1024).toFixed(0) + ' KB');
