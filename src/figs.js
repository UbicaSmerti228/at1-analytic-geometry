const { Plot2D, Plot3D } = require('./plot.js');
const F = {};
const { sqrt, cosh, sinh, cos, sin, atan2, PI } = Math;

/* ---------- Модуль 0 ---------- */
{
  const p = new Plot2D({ xmin: -1, xmax: 6, ymin: -1, ymax: 4.5, width: 420 });
  const A = [1, 1], B = [4, 3];
  p.seg(A, [4, 1], 'st-soft dash').seg([4, 1], B, 'st-soft dash');
  p.arrow(A, B, 'blue');
  p.point(A, 'A(1; 1)', { dx: 0, dy: 20, anchor: 'middle' });
  p.point(B, 'B(4; 3)', { dx: 9, dy: -6 });
  p.text([2.5, 1], 'x₂ − x₁ = 3', { anchor: 'middle', dy: 18, small: true, cls: 'soft' });
  p.text([4, 2], 'y₂ − y₁ = 2', { dx: 8, dy: 4, small: true, cls: 'soft' });
  p.text([2.35, 2.2], 'AB = (3; 2)', { anchor: 'end', cls: 'c-blue', b: true });
  F.vecAB = p.svg('Вектор AB на координатной плоскости');
}
{
  const p = new Plot3D({ width: 400, height: 330, scale: 46, cx: 170, cy: 235 });
  p.axes([3.2, 4.2, 5], [0.6, 0.8, 0.6]);
  const d = 'st-soft dash';
  p.seg([2, 0, 0], [2, 3, 0], d).seg([0, 3, 0], [2, 3, 0], d).seg([2, 3, 0], [2, 3, 4], d);
  p.seg([0, 0, 4], [2, 0, 4], d).seg([2, 0, 4], [2, 3, 4], d).seg([0, 3, 4], [2, 3, 4], d).seg([0, 0, 4], [0, 3, 4], d);
  p.seg([2, 0, 0], [2, 0, 4], d).seg([0, 3, 0], [0, 3, 4], d);
  p.point([2, 0, 0], '2', { r: 2.6, dx: -12, dy: 6, it: false });
  p.point([0, 3, 0], '3', { r: 2.6, dx: -2, dy: 18, it: false });
  p.point([0, 0, 4], '4', { r: 2.6, dx: -14, dy: 5, it: false });
  p.point([2, 3, 0], '', { r: 2.4 });
  p.point([2, 3, 4], 'M(2; 3; 4)', { cls: 'red', lcls: 'c-red', dx: 9, dy: -6 });
  F.point3d = p.svg('Точка M(2;3;4) в пространстве');
}
{
  const p = new Plot2D({ xmin: -0.8, xmax: 5, ymin: -0.8, ymax: 3.6, width: 400 });
  const a = [4, 1], b = [1, 3];
  const k = (a[0] * b[0] + a[1] * b[1]) / 17;
  const pr = [k * a[0], k * a[1]];
  p.seg(b, pr, 'st-soft dash');
  p.rightAngle(pr, [-a[0], -a[1]], [b[0] - pr[0], b[1] - pr[1]], 0.22, 'st-soft');
  p.arrow([0, 0], a, 'blue');
  p.arrow([0, 0], b, 'green');
  p.arc([0, 0], 0.85, atan2(1, 4), atan2(3, 1), 'st-red');
  p.text([1.2 * cos(0.75), 1.2 * sin(0.75)], 'φ', { cls: 'c-red', it: true, anchor: 'middle', dy: 5 });
  p.text(a, 'a', { cls: 'c-blue', b: true, it: true, dx: 6, dy: -6 });
  p.text(b, 'b', { cls: 'c-green', b: true, it: true, dx: 6, dy: -4 });
  p.text(pr, 'проекция b на a', { small: true, cls: 'soft', dx: 4, dy: 18 });
  F.dot = p.svg('Угол между векторами a и b');
}
{
  const p = new Plot3D({ width: 380, height: 270, scale: 55, cx: 190, cy: 150, theta: -135, phi: 22 });
  const a = [2.2, 0.4, 0], b = [0.3, 2.6, 0], ab = [2.5, 3.0, 0], c = [0, 0, 2.4];
  p.poly([[0, 0, 0], a, ab, b], 'fl-blue');
  p.seg(a, ab, 'st-soft dash').seg(b, ab, 'st-soft dash');
  p.rightAngle([0, 0, 0], c, a, 0.3, 'st-soft');
  p.rightAngle([0, 0, 0], c, b, 0.3, 'st-soft');
  p.arrow([0, 0, 0], a, 'blue').arrow([0, 0, 0], b, 'green').arrow([0, 0, 0], c, 'red');
  p.text(a, 'a', { cls: 'c-blue', b: true, it: true, dx: -14, dy: 6 });
  p.text(b, 'b', { cls: 'c-green', b: true, it: true, dx: 8, dy: 4 });
  p.text(c, 'a × b', { cls: 'c-red', b: true, it: true, dx: 9, dy: 6 });
  p.text([1.3, 1.5, 0], 'S = |a × b|', { anchor: 'middle', cls: 'c-blue', small: true, dy: 4 });
  F.cross = p.svg('Векторное произведение перпендикулярно обоим векторам');
}

/* ---------- Модуль 1 ---------- */
{
  const p = new Plot2D({ xmin: -1, xmax: 6.5, ymin: -1, ymax: 4.6, width: 430 });
  p.lineEq(1, -3, 5, 'st-ink thick');
  const M0 = [1, 2], M = [5.5, 3.5];
  p.seg(M0, M, 'st-green thick');
  p.arrow(M0, [4, 3], 'blue');
  p.arrow(M0, [1.6, 0.2], 'red');
  p.rightAngle(M0, [3, 1], [1, -3], 0.3, 'st-soft');
  p.point(M0, 'M₀(x₀; y₀)', { dx: -8, dy: -10, anchor: 'end' });
  p.point(M, 'M(x; y)', { dx: 0, dy: -12, anchor: 'middle', cls: 'green' });
  p.text([3.3, 2.75], 's = (m; n)', { cls: 'c-blue', b: true, anchor: 'end', dy: -8 });
  p.text([1.6, 0.2], 'n = (A; B)', { cls: 'c-red', b: true, dx: 8, dy: 4 });
  F.lineSN = p.svg('Прямая, направляющий и нормальный векторы');
}
{
  const p = new Plot2D({ xmin: -3.5, xmax: 5, ymin: -1.2, ymax: 4, width: 420 });
  p.lineEq(0.5, -1, 1, 'st-blue thick');
  p.seg([0, 1], [2, 1], 'st-soft dash').seg([2, 1], [2, 2], 'st-soft dash');
  p.arc([-2, 0], 0.9, 0, Math.atan(0.5), 'st-red');
  p.text([-2 + 1.3 * cos(0.2), 1.3 * sin(0.2)], 'α', { cls: 'c-red', it: true, dy: 5 });
  p.point([0, 1], 'b', { dx: -9, dy: -6, anchor: 'end' });
  p.point([-2, 0], '', { r: 3 });
  p.text([1, 1], 'Δx = 2', { anchor: 'middle', dy: 16, small: true, cls: 'soft' });
  p.text([2, 1.5], 'Δy = 1', { dx: 7, dy: 4, small: true, cls: 'soft' });
  p.text([2.4, 3.3], 'y = kx + b', { cls: 'c-blue', it: true, anchor: 'end' });
  F.slope = p.svg('Угловой коэффициент k = tg α');
}
{
  const p = new Plot2D({ xmin: -1, xmax: 5.6, ymin: -1, ymax: 4, width: 400 });
  p.lineEq(3, 4, -12, 'st-blue thick');
  p.point([4, 0], 'a = 4', { dx: 2, dy: 20, anchor: 'middle', cls: 'red', lcls: 'c-red' });
  p.point([0, 3], 'b = 3', { dx: 9, dy: -4, cls: 'red', lcls: 'c-red' });
  p.text([2.6, 1.6], 'x/4 + y/3 = 1', { cls: 'c-blue', it: true, dx: 6 });
  F.intercepts = p.svg('Уравнение прямой в отрезках');
}
{
  const p = new Plot2D({ xmin: -1.5, xmax: 5, ymin: -1, ymax: 5, width: 400 });
  p.lineEq(3, 4, -5, 'st-blue thick');
  const M = [3, 4], H = [0.6, 0.8];
  p.seg(M, H, 'st-red thick');
  p.rightAngle(H, [4, -3], [2.4, 3.2], 0.3, 'st-soft');
  p.point(M, 'M(3; 4)', { dx: 8, dy: -6 });
  p.point(H, 'H', { dx: -6, dy: 18, anchor: 'end' });
  p.text([1.8, 2.4], 'd = 4', { cls: 'c-red', anchor: 'end', dx: -6, dy: 0 });
  p.text([4.6, -1.8 + 1.05], '3x + 4y − 5 = 0', { cls: 'c-blue', it: true, anchor: 'end', small: true });
  F.dist = p.svg('Расстояние от точки до прямой');
}
{
  const p = new Plot2D({ xmin: -4.2, xmax: 2.2, ymin: -3, ymax: 3.4, width: 400 });
  p.lineEq(2, -1, 3, 'st-blue thick');
  p.lineEq(1, -3, 1, 'st-red thick');
  const P = [-1.6, -0.2];
  p.arc(P, 1.0, atan2(1, 3), atan2(2, 1), 'st-ink');
  p.text([P[0] + 1.4 * cos(0.714), P[1] + 1.4 * sin(0.714)], 'φ = 45°', { it: false, dy: 4 });
  p.point(P, '(−1,6; −0,2)', { dx: -6, dy: 18, anchor: 'end', it: false });
  p.text([0, 3], 'l₁', { cls: 'c-blue', it: true, dx: -16, dy: 4 });
  p.text([2, 1], 'l₂', { cls: 'c-red', it: true, dx: -8, dy: 18 });
  F.angle2 = p.svg('Угол между двумя прямыми');
}
{
  const p = new Plot2D({ xmin: -4, xmax: 6.5, ymin: -1, ymax: 7, width: 420, tickEvery: 2 });
  const A = [3, 6], B = [-3, 0], C = [5, 2], M = [1, 1], H = [69 / 17, 30 / 17];
  p.poly([A, B, C], 'fl-soft');
  p.path([A, B, C, A], 'st-ink', true);
  p.seg(A, M, 'st-blue thick');
  p.seg(A, H, 'st-red thick');
  p.rightAngle(H, [-4, -1], [A[0] - H[0], A[1] - H[1]], 0.32, 'st-soft');
  const a1 = atan2(M[1] - A[1], M[0] - A[0]), a2 = atan2(H[1] - A[1], H[0] - A[0]);
  p.arc(A, 0.95, a1, a2, 'st-ink');
  p.text([A[0] + 1.45 * cos((a1 + a2) / 2), A[1] + 1.45 * sin((a1 + a2) / 2)], 'φ', { it: true, anchor: 'middle', dy: 5 });
  const nrm = [-1 / sqrt(17) * 0.22, 4 / sqrt(17) * 0.22];
  for (const q of [[-1, 0.5], [3, 1.5]]) p.seg([q[0] - nrm[0], q[1] - nrm[1]], [q[0] + nrm[0], q[1] + nrm[1]], 'st-ink');
  p.point(A, 'A(3; 6)', { dx: 9, dy: -4 });
  p.point(B, 'B(−3; 0)', { dx: -4, dy: -10, anchor: 'end' });
  p.point(C, 'C(5; 2)', { dx: 9, dy: 4 });
  p.point(M, 'M(1; 1)', { dx: 0, dy: 20, anchor: 'middle', cls: 'blue', lcls: 'c-blue' });
  p.point(H, 'H', { dx: 6, dy: 18, cls: 'red', lcls: 'c-red' });
  p.text([1.3, 3.7], 'медиана', { cls: 'c-blue', small: true, anchor: 'end', dx: -4 });
  p.text([3.7, 3.6], 'высота', { cls: 'c-red', small: true, dx: 8 });
  F.triangle = p.svg('Треугольник ABC: медиана AM, высота AH и угол между ними');
}

/* ---------- Модуль 2: кривые ---------- */
const ell = (a, b, x0 = 0, y0 = 0) => (t) => [x0 + a * cos(t), y0 + b * sin(t)];
{
  const p = new Plot2D({ xmin: -7, xmax: 7, ymin: -4, ymax: 4, width: 460 });
  p.curve(ell(5, 3), 0, 2 * PI, 300, 'st-blue thick');
  const P = [5 * cos(1.1), 3 * sin(1.1)];
  p.seg([-4, 0], P, 'st-green thick').seg([4, 0], P, 'st-red thick');
  p.point([-4, 0], 'F₁', { cls: 'ink', dx: 0, dy: 20, anchor: 'middle' });
  p.point([4, 0], 'F₂', { dx: 0, dy: 20, anchor: 'middle' });
  p.point(P, 'M', { dx: 6, dy: -8 });
  p.text([(-4 + P[0]) / 2, P[1] / 2], 'r₁', { cls: 'c-green', it: true, dx: -14, dy: -4 });
  p.text([(4 + P[0]) / 2, P[1] / 2], 'r₂', { cls: 'c-red', it: true, dx: 8, dy: 0 });
  p.text([-6.8, 3.5], 'r₁ + r₂ = 2a', { b: true });
  F.ellipseDef = p.svg('Определение эллипса');
}
{
  const p = new Plot2D({ xmin: -7.6, xmax: 7.6, ymin: -4.2, ymax: 4.2, width: 460, tickLabels: false });
  p.curve(ell(5, 3), 0, 2 * PI, 300, 'st-blue thick');
  for (const s of [-1, 1]) p.lineEq(1, 0, -s * 6.25, 'st-red dash');
  p.seg([0, 3], [4, 0], 'st-green dash');
  p.seg([0, 0], [4, 0], 'st-green thick');
  p.text([2, 1.5], 'a', { cls: 'c-green', it: true, dx: 6, dy: -2 });
  p.text([0, 1.5], 'b', { it: true, dx: -12, dy: 4 });
  p.text([2, 0], 'c', { cls: 'c-green', it: true, anchor: 'middle', dy: -7 });
  p.point([-5, 0], 'A₁', { dx: -6, dy: 18, anchor: 'end' });
  p.point([5, 0], 'A₂', { dx: 6, dy: 18 });
  p.point([0, 3], 'B₂', { dx: 7, dy: -7 });
  p.point([0, -3], 'B₁', { dx: 7, dy: 16 });
  p.point([-4, 0], 'F₁', { cls: 'red', lcls: 'c-red', dx: 0, dy: 18, anchor: 'middle' });
  p.point([4, 0], 'F₂', { cls: 'red', lcls: 'c-red', dx: 0, dy: 18, anchor: 'middle' });
  p.text([6.25, 3.6], 'x = a/e', { cls: 'c-red', small: true, dx: -5, anchor: 'end', it: true });
  p.text([-6.25, 3.6], 'x = −a/e', { cls: 'c-red', small: true, dx: 5, it: true });
  F.ellipseTerm = p.svg('Эллипс: вершины, фокусы, полуоси, директрисы');
}
const hypR = (a, b, x0 = 0, y0 = 0) => (t) => [x0 + a * cosh(t), y0 + b * sinh(t)];
const hypL = (a, b, x0 = 0, y0 = 0) => (t) => [x0 - a * cosh(t), y0 + b * sinh(t)];
{
  const p = new Plot2D({ xmin: -8, xmax: 8, ymin: -5, ymax: 5, width: 460, tickEvery: 2 });
  p.lineEq(3, -4, 0, 'st-soft dash').lineEq(3, 4, 0, 'st-soft dash');
  p.curve(hypR(4, 3), -2, 2, 200, 'st-blue thick').curve(hypL(4, 3), -2, 2, 200, 'st-blue thick');
  const P = [4 * cosh(0.8), 3 * sinh(0.8)];
  p.seg([-5, 0], P, 'st-green thick').seg([5, 0], P, 'st-red thick');
  p.point([-5, 0], 'F₁', { dx: 0, dy: 20, anchor: 'middle' });
  p.point([5, 0], 'F₂', { dx: 8, dy: 18 });
  p.point(P, 'M', { dx: 8, dy: -4 });
  p.text([0, P[1] / 2], 'r₁', { cls: 'c-green', it: true, dx: -4, dy: -6 });
  p.text([(5 + P[0]) / 2, P[1] / 2], 'r₂', { cls: 'c-red', it: true, dx: 7, dy: 0 });
  p.text([-7.8, 4.4], '|r₁ − r₂| = 2a', { b: true });
  F.hypDef = p.svg('Определение гиперболы');
}
{
  const p = new Plot2D({ xmin: -8, xmax: 8, ymin: -5.2, ymax: 5.2, width: 460, tickLabels: false });
  p.path([[-4, -3], [4, -3], [4, 3], [-4, 3]], 'st-soft dash', true);
  p.lineEq(3, -4, 0, 'st-ink dash').lineEq(3, 4, 0, 'st-ink dash');
  for (const s of [-1, 1]) p.lineEq(1, 0, -s * 3.2, 'st-red dash');
  p.curve(hypR(4, 3), -2, 2, 200, 'st-blue thick').curve(hypL(4, 3), -2, 2, 200, 'st-blue thick');
  p.arc([0, 0], 5, 0, atan2(3, 4), 'st-green dash');
  p.seg([0, 0], [4, 3], 'st-green');
  p.text([2, 1.5], 'c', { cls: 'c-green', it: true, dx: -12, dy: -2 });
  p.text([2, 3], 'a', { it: true, anchor: 'middle', dy: -6 });
  p.text([4, 1.5], 'b', { it: true, dx: -12, dy: 4 });
  p.point([-4, 0], 'A₁', { dx: 6, dy: 18 });
  p.point([4, 0], 'A₂', { dx: -6, dy: 18, anchor: 'end' });
  p.point([0, 3], 'B₂', { dx: 7, dy: -7, cls: 'soft' });
  p.point([0, -3], 'B₁', { dx: 7, dy: 16, cls: 'soft' });
  p.point([-5, 0], 'F₁', { cls: 'red', lcls: 'c-red', dx: -6, dy: -8, anchor: 'end' });
  p.point([5, 0], 'F₂', { cls: 'red', lcls: 'c-red', dx: 6, dy: -8 });
  p.text([7.8, 5.2 - 0.2], 'y = (b/a)x', { anchor: 'end', it: true, small: true, dy: 14 });
  p.text([-7.8, 5.2 - 0.2], 'y = −(b/a)x', { it: true, small: true, dy: 14 });
  p.text([3.2, -4.6], 'x = a/e', { cls: 'c-red', small: true, it: true, dx: 5 });
  p.text([-3.2, -4.6], 'x = −a/e', { cls: 'c-red', small: true, it: true, dx: -5, anchor: 'end' });
  F.hypTerm = p.svg('Гипербола: основной прямоугольник, асимптоты, фокусы, директрисы');
}
{
  const p = new Plot2D({ xmin: -2.6, xmax: 6, ymin: -4, ymax: 4, width: 380 });
  p.lineEq(1, 0, 1, 'st-red dash');
  p.curve((t) => [t * t / 4, t], -4.5, 4.5, 200, 'st-blue thick');
  const P = [2.25, 3], D = [-1, 3];
  p.seg(P, [1, 0], 'st-green thick').seg(P, D, 'st-green thick');
  p.rightAngle(D, [1, 0], [0, -1], 0.28, 'st-soft');
  p.point([1, 0], 'F(p/2; 0)', { cls: 'red', lcls: 'c-red', dx: 8, dy: 18 });
  p.point(P, 'M', { dx: 8, dy: -4 });
  p.point(D, 'D', { dx: -8, dy: -6, anchor: 'end' });
  p.seg([-1, -1.6], [1, -1.6], 'st-ink thin');
  p.seg([-1, -1.45], [-1, -1.75], 'st-ink thin').seg([1, -1.45], [1, -1.75], 'st-ink thin');
  p.text([0.35, -1.6], 'p', { it: true, anchor: 'middle', dy: 17 });
  p.text([-1, -3.6], 'x = −p/2', { cls: 'c-red', small: true, it: true, dx: -5, anchor: 'end' });
  p.text([2.8, 1.4], '|MF| = |MD|', { cls: 'c-green', small: true, b: true });
  F.parabDef = p.svg('Определение параболы: фокус и директриса');
}
{
  const mk = (fn, F0, dirA, dirB, dirC, aria) => {
    const p = new Plot2D({ xmin: -3, xmax: 3, ymin: -3, ymax: 3, width: 220, tickLabels: false, pad: 16 });
    p.lineEq(dirA, dirB, dirC, 'st-red dash');
    p.curve(fn, -3.5, 3.5, 120, 'st-blue thick');
    p.point(F0, 'F', { cls: 'red', lcls: 'c-red', dx: 6, dy: -6 });
    return p.svg(aria);
  };
  F.par1 = mk((t) => [t * t / 3, t], [0.75, 0], 1, 0, 0.75, 'y² = 2px');
  F.par2 = mk((t) => [-t * t / 3, t], [-0.75, 0], 1, 0, -0.75, 'y² = −2px');
  F.par3 = mk((t) => [t, t * t / 3], [0, 0.75], 0, 1, 0.75, 'x² = 2py');
  F.par4 = mk((t) => [t, -t * t / 3], [0, -0.75], 0, 1, -0.75, 'x² = −2py');
}
{
  const p = new Plot2D({ xmin: -3, xmax: 5.5, ymin: -5, ymax: 1.5, width: 400 });
  p.seg([-3, -2], [5.5, -2], 'st-soft dash').seg([1, -5], [1, 1.5], 'st-soft dash');
  p.curve(ell(3, 2, 1, -2), 0, 2 * PI, 300, 'st-blue thick');
  const c = sqrt(5);
  p.point([1, -2], "O′(1; −2)", { dx: 6, dy: 16, it: false });
  p.point([1 - c, -2], 'F₁', { cls: 'red', lcls: 'c-red', dx: 0, dy: -9, anchor: 'middle' });
  p.point([1 + c, -2], 'F₂', { cls: 'red', lcls: 'c-red', dx: 0, dy: -9, anchor: 'middle' });
  p.point([-2, -2], '', {}); p.point([4, -2], '', {});
  p.point([1, 0], '(1; 0)', { dx: 8, dy: -8, it: false });
  p.point([1, -4], '(1; −4)', { dx: 8, dy: 16, it: false });
  p.text([5.4, -2], 'x′', { it: true, anchor: 'end', dy: -7 });
  p.text([1, 1.4], 'y′', { it: true, dx: 7, dy: 10 });
  F.ellipseEx = p.svg('Эллипс со смещённым центром');
}
{
  const p = new Plot2D({ xmin: -1.6, xmax: 6.5, ymin: -2.5, ymax: 6.5, width: 360 });
  p.seg([-1.6, 2], [6.5, 2], 'st-soft dash');
  p.lineEq(1, 0, 1, 'st-red dash');
  p.curve((t) => [1 + t * t / 8, 2 + t], -7, 7, 200, 'st-blue thick');
  p.point([1, 2], 'O′(1; 2)', { dx: -6, dy: -9, anchor: 'end', it: false });
  p.point([3, 2], 'F(3; 2)', { cls: 'red', lcls: 'c-red', dx: 6, dy: 18, it: false });
  p.text([-1, 6.2], 'x = −1', { cls: 'c-red', small: true, dx: 6, it: true });
  F.parabEx = p.svg('Парабола со смещённой вершиной');
}

/* ---------- Пробник: рисунки ---------- */
{
  const p = new Plot2D({ xmin: -0.6, xmax: 4.4, ymin: -0.6, ymax: 7.6, width: 300 });
  p.lineEq(2, 1, -7, 'st-blue thick');
  p.point([2, 3], 'A(2; 3)', { dx: 9, dy: 4, cls: 'red', lcls: 'c-red' });
  p.point([1, 5], 'B(1; 5)', { dx: 9, dy: 4, cls: 'red', lcls: 'c-red' });
  p.point([0, 7], '7', { dx: 8, dy: 4, r: 2.6, it: false });
  p.point([3.5, 0], '3,5', { dx: 0, dy: -9, r: 2.6, anchor: 'middle', it: false });
  p.text([2.7, 5.6], '2x + y − 7 = 0', { cls: 'c-blue', small: true, it: true, anchor: 'start' });
  F.task1 = p.svg('Задача 1: прямая через A и B');
}
{
  const p = new Plot2D({ xmin: -5, xmax: 5, ymin: -3, ymax: 3, width: 440 });
  p.path([[-2, -1], [2, -1], [2, 1], [-2, 1]], 'st-soft dash', true);
  p.lineEq(1, -2, 0, 'st-ink dash').lineEq(1, 2, 0, 'st-ink dash');
  p.curve(hypR(2, 1), -2.2, 2.2, 200, 'st-blue thick').curve(hypL(2, 1), -2.2, 2.2, 200, 'st-blue thick');
  p.point([2, 0], '', {}); p.point([-2, 0], '', {});
  p.point([sqrt(5), 0], 'F₂(√5; 0)', { cls: 'red', lcls: 'c-red', dx: 6, dy: -9 });
  p.point([-sqrt(5), 0], 'F₁', { cls: 'red', lcls: 'c-red', dx: -6, dy: -9, anchor: 'end' });
  p.text([4.9, 2.45], 'y = x/2', { anchor: 'end', it: true, small: true, dy: -4 });
  p.text([4.9, -2.45], 'y = −x/2', { anchor: 'end', it: true, small: true, dy: 14 });
  F.task2 = p.svg('Задача 2: гипербола x²/4 − y² = 1');
}
{
  const p = new Plot2D({ xmin: -6, xmax: 4, ymin: -3, ymax: 7, width: 420 });
  p.seg([-1, -3], [-1, 7], 'st-soft dash').seg([-6, 2], [4, 2], 'st-soft dash');
  p.path([[-3, 0], [1, 0], [1, 4], [-3, 4]], 'st-soft dash', true);
  p.lineEq(1, -1, 3, 'st-ink dash').lineEq(1, 1, -1, 'st-ink dash');
  p.curve((t) => [-1 + 2 * sinh(t), 2 + 2 * cosh(t)], -2.3, 2.3, 200, 'st-blue thick');
  p.curve((t) => [-1 + 2 * sinh(t), 2 - 2 * cosh(t)], -2.3, 2.3, 200, 'st-blue thick');
  const c = 2 * sqrt(2);
  p.point([-1, 2], 'O′(−1; 2)', { dx: 7, dy: 16, it: false });
  p.point([-1, 0], '(−1; 0)', { dx: 7, dy: 16, it: false });
  p.point([-1, 4], '(−1; 4)', { dx: 7, dy: -8, it: false });
  p.point([-1, 2 + c], 'F₂', { cls: 'red', lcls: 'c-red', dx: -8, dy: 4, anchor: 'end' });
  p.point([-1, 2 - c], 'F₁', { cls: 'red', lcls: 'c-red', dx: -8, dy: 4, anchor: 'end' });
  p.text([3.9, 6.9], 'y = x + 3', { anchor: 'end', it: true, small: true, dy: 14 });
  p.text([3.9, -2.9], 'y = −x + 1', { anchor: 'end', it: true, small: true, dy: -6 });
  F.task8 = p.svg('Задача 8: гипербола (y−2)²/4 − (x+1)²/4 = 1');
}

/* ---------- Модули 3–5: пространство ---------- */
{
  const p = new Plot3D({ width: 400, height: 320, scale: 52, cx: 170, cy: 225 });
  p.axes([3.8, 4.0, 3.2], [0.6, 0.6, 0.5]);
  const A = [3, 0, 0], B = [0, 3.5, 0], C = [0, 0, 2.5];
  p.poly([A, B, C], 'fl-blue');
  p.path([A, B, C, A], 'st-blue', true);
  const M0 = [1, 7 / 6, 5 / 6];
  const nn = [1 / 3, 1 / 3.5, 1 / 2.5], L = Math.hypot(...nn);
  const nEnd = M0.map((c, i) => c + nn[i] / L * 1.5);
  const M = [0.6, 2.2, 0.4286];
  p.arrow(M0, M, 'green');
  p.rightAngle(M0, nn, M.map((c, i) => c - M0[i]), 0.25, 'st-soft');
  p.arrow(M0, nEnd, 'red');
  p.point(M0, 'M₀', { dx: -10, dy: 2, anchor: 'end' });
  p.point(M, 'M', { dx: 4, dy: 16, cls: 'green' });
  p.text(nEnd, 'n = (A; B; C)', { cls: 'c-red', b: true, dx: 8, dy: 4 });
  p.point(A, 'a', { dx: -12, dy: 4, r: 3, cls: 'blue', lcls: 'c-blue' });
  p.point(B, 'b', { dx: 2, dy: 18, r: 3, cls: 'blue', lcls: 'c-blue' });
  p.point(C, 'c', { dx: -12, dy: 2, r: 3, cls: 'blue', lcls: 'c-blue' });
  F.planeNormal = p.svg('Плоскость, её нормальный вектор и отрезки на осях');
}
{
  const p = new Plot3D({ width: 400, height: 280, scale: 62, cx: 190, cy: 175, theta: -25, phi: 24 });
  const pl = [[-2.1, -1.5, 0], [2.5, -1.5, 0], [2.5, 1.5, 0], [-2.1, 1.5, 0]];
  p.poly(pl, 'fl-blue'); p.path(pl, 'st-blue thin', true);
  const M1 = [-1.3, -0.7, 0], M2 = [1.5, -0.9, 0], M3 = [0.1, 1.1, 0], M = [1.4, 0.55, 0];
  p.rightAngle(M1, [0, 0, 1], [M2[0] - M1[0], M2[1] - M1[1], 0], 0.22, 'st-soft');
  p.arrow(M1, M2, 'blue').arrow(M1, M3, 'blue').arrow(M1, M, 'green');
  p.arrow(M1, [-1.3, -0.7, 1.45], 'red');
  p.point(M1, 'M₁', { dx: -8, dy: 14, anchor: 'end' });
  p.point(M2, 'M₂', { dx: 4, dy: 18 });
  p.point(M3, 'M₃', { dx: 6, dy: -8 });
  p.point(M, 'M', { dx: 9, dy: 4, cls: 'green' });
  p.text([-1.3, -0.7, 1.45], 'n = M₁M₂ × M₁M₃', { cls: 'c-red', b: true, dx: 8, dy: 4 });
  F.threePoints = p.svg('Плоскость через три точки');
}
{
  const p = new Plot3D({ width: 400, height: 280, scale: 60, cx: 190, cy: 190, theta: -25, phi: 22 });
  p.poly([[-2, -1.5, 0], [2.6, -1.5, 0], [2.6, 1.5, 0], [-2, 1.5, 0]], 'fl-blue');
  p.path([[-2, -1.5, 0], [2.6, -1.5, 0], [2.6, 1.5, 0], [-2, 1.5, 0]], 'st-blue thin', true);
  const M0 = [0.6, 0.2, 2.0], H = [0.6, 0.2, 0];
  p.seg(M0, H, 'st-red thick');
  p.rightAngle(H, [0, 0, 1], [1, 0, 0], 0.25, 'st-soft');
  p.arrow([-1.3, -0.5, 0], [-1.3, -0.5, 1.1], 'green');
  p.text([-1.3, -0.5, 1.1], 'n', { cls: 'c-green', b: true, it: true, dx: 6, dy: 2 });
  p.point(M0, 'M₀(x₀; y₀; z₀)', { dx: 9, dy: 0 });
  p.point(H, 'H', { dx: 8, dy: 14 });
  p.text([0.6, 0.2, 1.0], 'd', { cls: 'c-red', it: true, dx: 8, dy: 4 });
  F.distPlane = p.svg('Расстояние от точки до плоскости');
}
{
  const p = new Plot3D({ width: 420, height: 320, scale: 50, cx: 150, cy: 225 });
  p.axes([3.2, 4.3, 3.2], [0.6, 0.6, 0.6]);
  const M0 = [0, 1.2, 2.2], s = [-0.6, 1.3, 0.9];
  const at = (t) => M0.map((c, i) => c + t * s[i]);
  p.seg(at(-1.2), at(2.0), 'st-blue thick');
  p.arrow(M0, at(1), 'red');
  p.point(M0, 'M₀(x₀; y₀; z₀)', { dx: 8, dy: 18 });
  p.point(at(1.5), 'M(x; y; z)', { dx: 9, dy: 4, cls: 'green' });
  p.text(at(1), 's = (m; n; p)', { cls: 'c-red', b: true, dx: -10, dy: -6, anchor: 'end' });
  F.line3 = p.svg('Прямая в пространстве: точка и направляющий вектор');
}
{
  const p = new Plot3D({ width: 420, height: 300, scale: 58, cx: 210, cy: 160, theta: -35, phi: 20 });
  const n1v = (v) => { const l = Math.hypot(...v); return v.map((c) => c / l); };
  const u1 = n1v([0, 1, 0.6]), u2 = n1v([0, -1, 0.75]);
  const pt = (u, t, v) => [t, u[1] * v, u[2] * v];
  const patch = (u) => [pt(u, -2.2, -1.2), pt(u, 2.2, -1.2), pt(u, 2.2, 1.6), pt(u, -2.2, 1.6)];
  p.poly(patch(u2), 'fl-green'); p.path(patch(u2), 'st-green thin', true);
  p.poly(patch(u1), 'fl-blue'); p.path(patch(u1), 'st-blue thin', true);
  p.seg([-2.2, 0, 0], [2.2, 0, 0], 'st-red thick');
  p.arrow([0.4, 0, 0], [1.7, 0, 0], 'red');
  const P1 = pt(u1, -1.3, 1.0), P2 = pt(u2, 1.2, 1.0);
  const nn1 = n1v([0, -0.6, 1]), nn2 = n1v([0, 0.75, 1]);
  p.arrow(P1, P1.map((c, i) => c + nn1[i] * 1.0), 'blue');
  p.arrow(P2, P2.map((c, i) => c + nn2[i] * 1.0), 'green');
  p.text(P1.map((c, i) => c + nn1[i]), 'n₁', { cls: 'c-blue', b: true, it: true, dx: 6 });
  p.text(P2.map((c, i) => c + nn2[i]), 'n₂', { cls: 'c-green', b: true, it: true, dx: 6 });
  p.text([2.2, 0, 0], 's = n₁ × n₂', { cls: 'c-red', b: true, dx: 8, dy: 5 });
  p.text(pt(u1, 2.1, 1.5), 'π₁', { cls: 'c-blue', it: true, dx: -20, dy: 16 });
  p.text(pt(u2, -2.1, -1.1), 'π₂', { cls: 'c-green', it: true, dx: 6, dy: 2 });
  F.twoPlanes = p.svg('Прямая как пересечение двух плоскостей');
}
{
  const p = new Plot3D({ width: 420, height: 300, scale: 62, cx: 200, cy: 190, theta: -20, phi: 20 });
  const pl = [[-2.3, -1.4, 0], [2.7, -1.4, 0], [2.7, 1.4, 0], [-2.3, 1.4, 0]];
  p.poly(pl, 'fl-blue'); p.path(pl, 'st-blue thin', true);
  const s = [1.6, 0.6, 1.4], O = [0, 0, 0];
  const sl = Math.hypot(...s), su = s.map((c) => c / sl);
  const u = [1.6 / Math.hypot(1.6, 0.6), 0.6 / Math.hypot(1.6, 0.6), 0];
  const phi = Math.asin(su[2]);
  p.seg(s.map((c) => -0.5 * c), O, 'st-ink dash');
  p.seg(O, s.map((c) => 1.25 * c), 'st-ink thick');
  p.seg(O, u.map((c) => 2.6 * c), 'st-soft dash');
  p.arrow(O, [0, 0, 2.0], 'red');
  const arc = (r, t0, t1) => { const pts = []; for (let i = 0; i <= 30; i++) { const t = t0 + (t1 - t0) * i / 30; pts.push([r * cos(t) * u[0], r * cos(t) * u[1], r * sin(t)]); } return pts; };
  p.path(arc(0.95, 0, phi), 'st-blue');
  p.path(arc(0.55, phi, PI / 2), 'st-red');
  const lp = (r, t) => [r * cos(t) * u[0], r * cos(t) * u[1], r * sin(t)];
  p.text(lp(1.25, phi / 2), 'φ', { cls: 'c-blue', it: true, dy: 5 });
  p.text(lp(0.8, (phi + PI / 2) / 2), '90° − φ', { cls: 'c-red', small: true, dx: 2, dy: 2 });
  p.text(s.map((c) => 1.25 * c), 'l, s', { it: true, b: true, dx: 6 });
  p.text([0, 0, 2.0], 'n', { cls: 'c-red', b: true, it: true, dx: 7, dy: 2 });
  p.text(u.map((c) => 2.6 * c), 'проекция l', { small: true, cls: 'soft', dx: -4, dy: 16, anchor: 'end' });
  p.text([-2.2, 1.3, 0], 'π', { it: true, cls: 'c-blue', dx: 6, dy: 16 });
  F.angleLP = p.svg('Угол между прямой и плоскостью');
}

module.exports = F;
