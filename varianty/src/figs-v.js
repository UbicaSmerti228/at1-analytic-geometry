const { Plot2D } = require('./plot.js');
const F = {};
const { sqrt, cosh, sinh, cos, sin, atan2, PI } = Math;
const ell = (a, b, x0 = 0, y0 = 0) => (t) => [x0 + a * cos(t), y0 + b * sin(t)];

/* ---------- №6 ---------- */
{ // IV: две прямые через M(1;1) под 45° к y = 3x + 1
  const p = new Plot2D({ xmin: -2, xmax: 3, ymin: -1, ymax: 4.2, width: 400 });
  p.lineEq(3, -1, 1, 'st-ink thick');
  p.lineEq(2, 1, -3, 'st-blue thick');
  p.lineEq(1, -2, 1, 'st-red thick');
  const P1 = [0.4, 2.2], P2 = [-0.2, 0.4], g = Math.atan(3);
  p.arc(P1, 0.55, g, PI - Math.atan(2), 'st-blue');
  p.arc(P2, 0.55, Math.atan(0.5), g, 'st-red');
  p.text([P1[0] + 0.85 * cos(1.6), P1[1] + 0.85 * sin(1.6)], '45°', { cls: 'c-blue', small: true, anchor: 'middle', dy: 4 });
  p.text([P2[0] + 0.95 * cos(0.85), P2[1] + 0.95 * sin(0.85)], '45°', { cls: 'c-red', small: true, anchor: 'middle', dy: 4 });
  p.point([1, 1], 'M(1; 1)', { dx: 9, dy: 4 });
  p.text([0.95, 4.1], 'y = 3x + 1', { dx: 6, dy: 12, small: true, it: true });
  p.text([-0.45, 3.9], 'y = −2x + 3', { cls: 'c-blue', dx: -6, dy: 10, anchor: 'end', small: true, it: true });
  p.text([2.9, 1.95], 'y = x/2 + 1/2', { cls: 'c-red', anchor: 'end', dy: -8, small: true, it: true });
  F.t6iv = p.svg('Две прямые через M под углом 45° к прямой y = 3x + 1');
}
{ // III: центроид
  const p = new Plot2D({ xmin: 1, xmax: 5, ymin: -0.6, ymax: 2.8, width: 380, grid: 1, axes: true, tickLabels: false });
  const A = [2, 2], B = [3, 0], C = [4, 1], O = [3, 1];
  p.poly([A, B, C], 'fl-soft'); p.path([A, B, C], 'st-ink', true);
  const mids = [[3.5, 0.5], [3, 1.5], [2.5, 1]];
  p.seg(A, mids[0], 'st-blue dash').seg(B, mids[1], 'st-blue dash').seg(C, mids[2], 'st-blue dash');
  p.point(A, 'A(2; 2)', { dx: -6, dy: -8, anchor: 'end' });
  p.point(B, 'B(3; 0)', { dx: 8, dy: 14 });
  p.point(C, 'C(4; 1) ?', { dx: 8, dy: 4, cls: 'red', lcls: 'c-red' });
  p.point(O, 'O(3; 1)', { dx: -8, dy: 18, anchor: 'end', cls: 'blue', lcls: 'c-blue' });
  F.t6iii = p.svg('Треугольник ABC и точка пересечения медиан O');
}
{ // II: угол между AB и медианой AM
  const p = new Plot2D({ xmin: 1, xmax: 5, ymin: -0.7, ymax: 2.8, width: 380, tickLabels: false });
  const A = [4, 2], B = [2, 1], C = [3, 0], M = [2.5, 0.5];
  p.poly([A, B, C], 'fl-soft'); p.path([A, B, C], 'st-ink', true);
  p.seg(A, B, 'st-red thick'); p.seg(A, M, 'st-blue thick');
  const a1 = atan2(-1, -2), a2 = atan2(-1.5, -1.5);
  p.arc(A, 0.9, a1, a2, 'st-ink');
  p.text([A[0] + 1.2 * cos((a1 + a2) / 2), A[1] + 1.2 * sin((a1 + a2) / 2)], 'φ', { it: true, anchor: 'middle', dy: 5 });
  p.point(A, 'A(4; 2)', { dx: 8, dy: -4 });
  p.point(B, 'B(2; 1)', { dx: -8, dy: -4, anchor: 'end' });
  p.point(C, 'C(3; 0)', { dx: 8, dy: 14 });
  p.point(M, 'M(2,5; 0,5)', { dx: -8, dy: 16, anchor: 'end', cls: 'blue', lcls: 'c-blue', it: false });
  F.t6ii = p.svg('Угол между стороной AB и медианой AM');
}

/* ---------- №8: три эллипса ---------- */
function ellipseFig(o) {
  const p = new Plot2D(o.box);
  p.seg([o.box.xmin, o.y0], [o.box.xmax, o.y0], 'st-soft dash').seg([o.x0, o.box.ymin], [o.x0, o.box.ymax], 'st-soft dash');
  p.curve(ell(o.a, o.b, o.x0, o.y0), 0, 2 * PI, 300, 'st-blue thick');
  p.point([o.x0, o.y0], o.cl, { dx: 7, dy: 16, it: false });
  o.verts.forEach(([pt, lab, dx, dy, an]) => p.point(pt, lab, { dx, dy, anchor: an, it: false, r: 3.4 }));
  o.foci.forEach(([pt, lab, dx, dy, an]) => p.point(pt, lab, { cls: 'red', lcls: 'c-red', dx, dy, anchor: an, r: 3.4 }));
  return p.svg(o.aria);
}
F.t8iv = ellipseFig({
  box: { xmin: -5, xmax: 1.6, ymin: -1.8, ymax: 1.8, width: 420, tickEvery: 1 },
  a: 2, b: 1, x0: -2, y0: 0, cl: "O′(−2; 0)",
  verts: [[[-4, 0], '(−4; 0)', -6, -8, 'end'], [[0, 1], '', 0, 0], [[-2, 1], '(−2; 1)', 7, -7], [[-2, -1], '(−2; −1)', 7, 16]],
  foci: [[[-2 - sqrt(3), 0], 'F₁', 0, -9, 'middle'], [[-2 + sqrt(3), 0], 'F₂', 0, -9, 'middle']],
  aria: 'Эллипс (x + 2)²/4 + y² = 1'
});
F.t8iii = ellipseFig({
  box: { xmin: -2, xmax: 6, ymin: -2, ymax: 8, width: 340, tickEvery: 2 },
  a: 2 * sqrt(2), b: 4, x0: 2, y0: 3, cl: "O′(2; 3)",
  verts: [[[2, 7], '(2; 7)', 8, -4], [[2, -1], '(2; −1)', 8, 14], [[2 - 2 * sqrt(2), 3], '', 0, 0], [[2 + 2 * sqrt(2), 3], '', 0, 0]],
  foci: [[[2, 3 + 2 * sqrt(2)], 'F₂', -8, 4, 'end'], [[2, 3 - 2 * sqrt(2)], 'F₁', -8, 4, 'end']],
  aria: 'Эллипс (x − 2)²/8 + (y − 3)²/16 = 1'
});
F.t8ii = ellipseFig({
  box: { xmin: -7, xmax: 5, ymin: -3, ymax: 7, width: 440, tickEvery: 2 },
  a: 5, b: 4, x0: -1, y0: 2, cl: "O′(−1; 2)",
  verts: [[[-6, 2], '(−6; 2)', -6, -8, 'end'], [[4, 2], '(4; 2)', 6, -8], [[-1, 6], '(−1; 6)', 7, -7], [[-1, -2], '(−1; −2)', 7, 16]],
  foci: [[[-4, 2], 'F₁(−4; 2)', 0, 18, 'middle'], [[2, 2], 'F₂(2; 2)', 0, 18, 'middle']],
  aria: 'Эллипс (x + 1)²/25 + (y − 2)²/16 = 1'
});

/* ---------- №9: направляющие кривые ---------- */
function hyperSection(h, v, aria) {
  const p = new Plot2D({ xmin: -3, xmax: 3, ymin: -3, ymax: 3, width: 300, xName: h, yName: v });
  p.lineEq(1, -1, 0, 'st-soft dash').lineEq(1, 1, 0, 'st-soft dash');
  p.curve((t) => [sinh(t), cosh(t)], -1.9, 1.9, 160, 'st-red thick');
  p.curve((t) => [sinh(t), -cosh(t)], -1.9, 1.9, 160, 'st-red thick');
  p.point([0, 1], '1', { dx: 8, dy: -6, it: false });
  p.point([0, -1], '−1', { dx: 8, dy: 16, it: false });
  return p.svg(aria);
}
F.t9iv = hyperSection('y', 'z', 'Сечение x = 0: гипербола z² − y² = 1');
F.t9iii = hyperSection('x', 'z', 'Сечение y = 0: гипербола z² − x² = 1');
{
  const p = new Plot2D({ xmin: -1, xmax: 5, ymin: -2.6, ymax: 2.6, width: 300 });
  p.curve((t) => [t * t, t], -2.3, 2.3, 160, 'st-red thick');
  p.point([1, 1], '(1; 1)', { dx: 6, dy: -6, it: false });
  p.point([4, 2], '(4; 2)', { dx: -6, dy: -8, anchor: 'end', it: false });
  p.point([1, -1], '(1; −1)', { dx: 6, dy: 16, it: false });
  F.t9ii = p.svg('Сечение z = 0: парабола x = y²');
}

/* ---------- №10: выводы ---------- */
{ // через две точки
  const p = new Plot2D({ xmin: -0.6, xmax: 6.4, ymin: -0.6, ymax: 4, width: 400 });
  p.lineEq(1, -2, 1, 'st-ink thick');
  p.arrow([1, 1], [3, 2], 'blue');
  p.arrow([1, 1], [5.2, 3.1], 'green', 'mid');
  p.point([1, 1], 'M₁(x₁; y₁)', { dx: 4, dy: 18 });
  p.point([3, 2], 'M₂(x₂; y₂)', { dx: 4, dy: 18, cls: 'blue', lcls: 'c-blue' });
  p.point([5.2, 3.1], 'M(x; y)', { dx: -6, dy: -8, anchor: 'end', cls: 'green', lcls: 'c-green' });
  F.q1 = p.svg('Прямая через две точки');
}
{ // точка и направляющий
  const p = new Plot2D({ xmin: -1, xmax: 6.5, ymin: -0.6, ymax: 4.4, width: 400 });
  p.lineEq(1, -3, 5, 'st-ink thick');
  p.seg([1, 2], [5.5, 3.5], 'st-green thick');
  p.arrow([1, 2], [4, 3], 'blue');
  p.point([1, 2], 'M₀(x₀; y₀)', { dx: -6, dy: -10, anchor: 'end' });
  p.point([5.5, 3.5], 'M(x; y)', { dx: 0, dy: -12, anchor: 'middle', cls: 'green', lcls: 'c-green' });
  p.text([3, 2.67], 's = (m; n)', { cls: 'c-blue', b: true, dy: 20, anchor: 'middle' });
  F.q2 = p.svg('Прямая через точку с направляющим вектором');
}
{ // точка и нормаль
  const p = new Plot2D({ xmin: -1, xmax: 6.5, ymin: -1, ymax: 4.4, width: 400 });
  p.lineEq(1, -3, 5, 'st-ink thick');
  p.seg([1, 2], [5.5, 3.5], 'st-green thick');
  p.arrow([1, 2], [1.6, 0.2], 'red');
  p.rightAngle([1, 2], [3, 1], [1, -3], 0.3, 'st-soft');
  p.point([1, 2], 'M₀(x₀; y₀)', { dx: -6, dy: -10, anchor: 'end' });
  p.point([5.5, 3.5], 'M(x; y)', { dx: 0, dy: -12, anchor: 'middle', cls: 'green', lcls: 'c-green' });
  p.text([1.6, 0.2], 'n = (A; B)', { cls: 'c-red', b: true, dx: 8, dy: 4 });
  F.q3 = p.svg('Прямая через точку перпендикулярно нормальному вектору');
}
{ // угловой коэффициент и точка
  const p = new Plot2D({ xmin: -1.6, xmax: 6, ymin: -1, ymax: 4.6, width: 400 });
  const k = 0.6, x0 = 1, y0 = 1.4, X = 5;
  p.lineEq(k, -1, y0 - k * x0, 'st-blue thick');
  const Y = y0 + k * (X - x0), xi = x0 - y0 / k;
  p.seg([x0, y0], [X, y0], 'st-soft dash').seg([X, y0], [X, Y], 'st-soft dash');
  p.rightAngle([X, y0], [-1, 0], [0, 1], 0.25, 'st-soft');
  p.arc([x0, y0], 0.8, 0, Math.atan(k), 'st-red');
  p.arc([xi, 0], 0.8, 0, Math.atan(k), 'st-red');
  p.text([x0 + 1.15, y0 + 0.28], 'α', { cls: 'c-red', it: true, dy: 4 });
  p.text([xi + 1.15, 0.28], 'α', { cls: 'c-red', it: true, dy: 4 });
  p.point([x0, y0], 'M₀(x₀; y₀)', { dx: -6, dy: -10, anchor: 'end' });
  p.point([X, Y], 'M(x; y)', { dx: -8, dy: -8, anchor: 'end' });
  p.text([(x0 + X) / 2, y0], 'x − x₀', { anchor: 'middle', dy: 17, small: true, cls: 'soft' });
  p.text([X, (y0 + Y) / 2], 'y − y₀', { dx: 7, dy: 4, small: true, cls: 'soft' });
  F.q4 = p.svg('Угловой коэффициент: tg α = (y − y₀)/(x − x₀)');
}

/* ---------- Прогноз №8 ---------- */
F.p8i = ellipseFig({
  box: { xmin: -2.5, xmax: 4.5, ymin: -6, ymax: 2, width: 320, tickEvery: 2 },
  a: 2, b: 3, x0: 1, y0: -2, cl: "O′(1; −2)",
  verts: [[[1, 1], '(1; 1)', 8, -4], [[1, -5], '(1; −5)', 8, 14], [[-1, -2], '', 0, 0], [[3, -2], '', 0, 0]],
  foci: [[[1, -2 + sqrt(5)], 'F₂', -8, 4, 'end'], [[1, -2 - sqrt(5)], 'F₁', -8, 4, 'end']],
  aria: 'Эллипс (x − 1)²/4 + (y + 2)²/9 = 1'
});
{
  const p = new Plot2D({ xmin: -4, xmax: 8, ymin: -4.5, ymax: 2.5, width: 440, tickEvery: 2 });
  p.seg([-4, -1], [8, -1], 'st-soft dash').seg([2, -4.5], [2, 2.5], 'st-soft dash');
  p.path([[0, -2], [4, -2], [4, 0], [0, 0]], 'st-soft dash', true);
  p.lineEq(1, -2, -4, 'st-ink dash').lineEq(1, 2, 0, 'st-ink dash');
  p.curve((t) => [2 + 2 * cosh(t), -1 + sinh(t)], -2, 2, 160, 'st-blue thick');
  p.curve((t) => [2 - 2 * cosh(t), -1 + sinh(t)], -2, 2, 160, 'st-blue thick');
  p.point([2, -1], "O′(2; −1)", { dx: 6, dy: 16, it: false });
  p.point([0, -1], '(0; −1)', { dx: 6, dy: -7, it: false, r: 3.4 });
  p.point([4, -1], '(4; −1)', { dx: -6, dy: -7, anchor: 'end', it: false, r: 3.4 });
  p.point([2 - sqrt(5), -1], 'F₁', { cls: 'red', lcls: 'c-red', dx: 0, dy: 18, anchor: 'middle', r: 3.4 });
  p.point([2 + sqrt(5), -1], 'F₂', { cls: 'red', lcls: 'c-red', dx: 0, dy: 18, anchor: 'middle', r: 3.4 });
  F.p8v = p.svg('Гипербола (x − 2)²/4 − (y + 1)² = 1');
}
{
  const p = new Plot2D({ xmin: -1, xmax: 7, ymin: -6.5, ymax: 2.5, width: 340, tickEvery: 2 });
  p.seg([-1, -2], [7, -2], 'st-soft dash');
  p.lineEq(1, 0, 0, 'st-red dash');
  p.curve((t) => [1 + t * t / 4, -2 + t], -4.4, 4.4, 160, 'st-blue thick');
  p.point([1, -2], "O′(1; −2)", { dx: -6, dy: -9, anchor: 'end', it: false });
  p.point([2, -2], 'F(2; −2)', { cls: 'red', lcls: 'c-red', dx: 6, dy: 16, it: false });
  p.text([0, 2.3], 'директриса x = 0', { cls: 'c-red', small: true, dx: 6, dy: 12 });
  F.p8vi = p.svg('Парабола (y + 2)² = 4(x − 1)');
}

module.exports = F;
