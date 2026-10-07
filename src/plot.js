/* Tiny SVG plotting kit for the guide. Works in Node (build) and in the browser (interactives). */
(function (root) {
  const R = (n) => Math.round(n * 100) / 100;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fmt = (n) => {
    const v = Math.round(n * 100) / 100;
    return (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ',');
  };
  let UID = 0;

  function arrowHead(x1, y1, x2, y2, cls, L = 10, W = 4.2) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const bx = x2 - ux * L, by = y2 - uy * L;
    return `<polygon class="hd ${cls}" points="${R(x2)},${R(y2)} ${R(bx - uy * W)},${R(by + ux * W)} ${R(bx + uy * W)},${R(by - ux * W)}"/>`;
  }

  function textEl(x, y, str, o = {}) {
    const anchor = o.anchor || 'start';
    const cls = ['lb', o.cls || '', o.it ? 'it' : '', o.b ? 'bd' : '', o.small ? 'sm' : ''].join(' ').trim();
    return `<text class="${cls}" x="${R(x + (o.dx || 0))}" y="${R(y + (o.dy || 0))}" text-anchor="${anchor}">${esc(str)}</text>`;
  }

  class Plot2D {
    constructor(o) {
      Object.assign(this, {
        xmin: -5, xmax: 5, ymin: -5, ymax: 5, width: 440, pad: 22,
        grid: 1, ticks: 1, tickEvery: 1, axes: true, tickLabels: true, label: ''
      }, o);
      this.s = (this.width - 2 * this.pad) / (this.xmax - this.xmin);
      this.height = Math.round((this.ymax - this.ymin) * this.s + 2 * this.pad);
      this.id = 'clp' + (++UID) + (o.idp || '');
      this.back = []; this.mid = []; this.front = [];
    }
    X(x) { return R(this.pad + (x - this.xmin) * this.s); }
    Y(y) { return R(this.pad + (this.ymax - y) * this.s); }
    _grid() {
      const out = [];
      const { xmin, xmax, ymin, ymax, grid } = this;
      const minor = grid / 5;
      if (this.s * minor >= 5) {
        for (let x = Math.ceil(xmin / minor) * minor; x <= xmax + 1e-9; x += minor)
          out.push(`<line class="g0" x1="${this.X(x)}" y1="${this.Y(ymin)}" x2="${this.X(x)}" y2="${this.Y(ymax)}"/>`);
        for (let y = Math.ceil(ymin / minor) * minor; y <= ymax + 1e-9; y += minor)
          out.push(`<line class="g0" x1="${this.X(xmin)}" y1="${this.Y(y)}" x2="${this.X(xmax)}" y2="${this.Y(y)}"/>`);
      }
      for (let x = Math.ceil(xmin / grid) * grid; x <= xmax + 1e-9; x += grid)
        out.push(`<line class="g1" x1="${this.X(x)}" y1="${this.Y(ymin)}" x2="${this.X(x)}" y2="${this.Y(ymax)}"/>`);
      for (let y = Math.ceil(ymin / grid) * grid; y <= ymax + 1e-9; y += grid)
        out.push(`<line class="g1" x1="${this.X(xmin)}" y1="${this.Y(y)}" x2="${this.X(xmax)}" y2="${this.Y(y)}"/>`);
      return out.join('');
    }
    _axes() {
      if (!this.axes) return '';
      const o = [];
      const { xmin, xmax, ymin, ymax } = this;
      if (ymin <= 0 && ymax >= 0) {
        const y0 = this.Y(0);
        o.push(`<line class="ax" x1="${this.X(xmin)}" y1="${y0}" x2="${this.X(xmax) + 8}" y2="${y0}"/>`);
        o.push(arrowHead(this.X(xmin), y0, this.X(xmax) + 14, y0, 'axh', 9, 3.6));
        o.push(textEl(this.X(xmax) + 6, y0 - 8, 'x', { it: true, anchor: 'end' }));
      }
      if (xmin <= 0 && xmax >= 0) {
        const x0 = this.X(0);
        o.push(`<line class="ax" x1="${x0}" y1="${this.Y(ymin)}" x2="${x0}" y2="${this.Y(ymax) - 8}"/>`);
        o.push(arrowHead(x0, this.Y(ymin), x0, this.Y(ymax) - 14, 'axh', 9, 3.6));
        o.push(textEl(x0 + 9, this.Y(ymax) - 2, 'y', { it: true }));
      }
      if (this.tickLabels && ymin <= 0 && ymax >= 0 && xmin <= 0 && xmax >= 0) {
        const t = this.ticks, every = this.tickEvery;
        let i = 0;
        for (let x = Math.ceil(xmin / t) * t; x <= xmax - t * 0.5; x += t) {
          if (Math.abs(x) < 1e-9) continue;
          o.push(`<line class="ax" x1="${this.X(x)}" y1="${this.Y(0) - 3}" x2="${this.X(x)}" y2="${this.Y(0) + 3}"/>`);
          if (Math.round(x / t) % every === 0) o.push(textEl(this.X(x), this.Y(0) + 15, fmt(x), { anchor: 'middle', cls: 'tk' }));
          i++;
        }
        for (let y = Math.ceil(ymin / t) * t; y <= ymax - t * 0.5; y += t) {
          if (Math.abs(y) < 1e-9) continue;
          o.push(`<line class="ax" x1="${this.X(0) - 3}" y1="${this.Y(y)}" x2="${this.X(0) + 3}" y2="${this.Y(y)}"/>`);
          if (Math.round(y / t) % every === 0) o.push(textEl(this.X(0) - 6, this.Y(y) + 4.5, fmt(y), { anchor: 'end', cls: 'tk' }));
        }
        o.push(textEl(this.X(0) - 6, this.Y(0) + 15, 'O', { anchor: 'end', cls: 'tk', it: true }));
      }
      return o.join('');
    }
    // a x + b y + c = 0
    lineEq(a, b, c, cls = 'st-blue', layer = 'mid') {
      const pts = [];
      const { xmin, xmax, ymin, ymax } = this;
      if (Math.abs(b) > 1e-12) for (const x of [xmin, xmax]) { const y = -(a * x + c) / b; if (y >= ymin - 1e-9 && y <= ymax + 1e-9) pts.push([x, y]); }
      if (Math.abs(a) > 1e-12) for (const y of [ymin, ymax]) { const x = -(b * y + c) / a; if (x >= xmin - 1e-9 && x <= xmax + 1e-9) pts.push([x, y]); }
      if (pts.length < 2) return this;
      let best = [pts[0], pts[1]], bd = -1;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d > bd) { bd = d; best = [pts[i], pts[j]]; }
      }
      return this.seg(best[0], best[1], cls, layer);
    }
    seg(p, q, cls = 'st-ink', layer = 'mid') {
      this[layer].push(`<line class="${cls}" x1="${this.X(p[0])}" y1="${this.Y(p[1])}" x2="${this.X(q[0])}" y2="${this.Y(q[1])}"/>`);
      return this;
    }
    path(pts, cls = 'st-blue', closed = false, layer = 'mid') {
      const d = pts.map((p, i) => (i ? 'L' : 'M') + this.X(p[0]) + ' ' + this.Y(p[1])).join(' ') + (closed ? ' Z' : '');
      this[layer].push(`<path class="${cls}" d="${d}"/>`);
      return this;
    }
    poly(pts, cls = 'fl-blue', layer = 'back') { return this.path(pts, cls, true, layer); }
    curve(fn, t0, t1, n = 240, cls = 'st-blue', layer = 'mid') {
      let cur = [];
      const flush = () => { if (cur.length > 1) this.path(cur, cls, false, layer); cur = []; };
      const big = 4 * Math.max(this.xmax - this.xmin, this.ymax - this.ymin);
      for (let i = 0; i <= n; i++) {
        const t = t0 + (t1 - t0) * i / n;
        const p = fn(t);
        if (!p || !isFinite(p[0]) || !isFinite(p[1]) || Math.abs(p[0]) > big || Math.abs(p[1]) > big) { flush(); continue; }
        cur.push(p);
      }
      flush();
      return this;
    }
    arrow(p, q, cls = 'blue', layer = 'front') {
      const x1 = this.X(p[0]), y1 = this.Y(p[1]), x2 = this.X(q[0]), y2 = this.Y(q[1]);
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const ex = x2 - (x2 - x1) / len * 8, ey = y2 - (y2 - y1) / len * 8;
      this[layer].push(`<line class="vec st-${cls}" x1="${x1}" y1="${y1}" x2="${R(ex)}" y2="${R(ey)}"/>` + arrowHead(x1, y1, x2, y2, 'fl-' + cls));
      return this;
    }
    point(p, label, o = {}) {
      const cls = o.cls || 'ink';
      this.front.push(`<circle class="pt fl-${cls}" cx="${this.X(p[0])}" cy="${this.Y(p[1])}" r="${o.r || 3.8}"/>`);
      if (label) this.front.push(textEl(this.X(p[0]), this.Y(p[1]), label, { dx: o.dx ?? 7, dy: o.dy ?? -7, anchor: o.anchor, it: o.it !== false, cls: o.lcls || '' }));
      return this;
    }
    text(p, str, o = {}) { this.front.push(textEl(this.X(p[0]), this.Y(p[1]), str, o)); return this; }
    rightAngle(v, d1, d2, size = 0.32, cls = 'st-ink') {
      const n1 = Math.hypot(...d1), n2 = Math.hypot(...d2);
      const a = [d1[0] / n1 * size, d1[1] / n1 * size], b = [d2[0] / n2 * size, d2[1] / n2 * size];
      return this.path([[v[0] + a[0], v[1] + a[1]], [v[0] + a[0] + b[0], v[1] + a[1] + b[1]], [v[0] + b[0], v[1] + b[1]]], cls + ' thin', false, 'front');
    }
    arc(c, r, a1, a2, cls = 'st-red') {
      const pts = [];
      for (let i = 0; i <= 40; i++) { const t = a1 + (a2 - a1) * i / 40; pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); }
      return this.path(pts, cls + ' thin', false, 'front');
    }
    svg(aria = '') {
      const W = this.width, H = this.height;
      return `<svg class="fig2d" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(aria)}">` +
        `<defs><clipPath id="${this.id}"><rect x="${this.pad}" y="${this.pad}" width="${W - 2 * this.pad}" height="${H - 2 * this.pad}"/></clipPath></defs>` +
        `<rect class="paper" x="0" y="0" width="${W}" height="${H}"/>` +
        this._grid() + this.back.join('') + this._axes() +
        `<g clip-path="url(#${this.id})">${this.mid.join('')}</g>` + this.front.join('') + `</svg>`;
    }
  }

  class Plot3D {
    constructor(o) {
      Object.assign(this, { width: 440, height: 340, scale: 50, cx: 200, cy: 200, theta: -110, phi: 22 }, o);
      const t = this.theta * Math.PI / 180, p = this.phi * Math.PI / 180;
      this.ct = Math.cos(t); this.st = Math.sin(t); this.cp = Math.cos(p); this.sp = Math.sin(p);
      this.els = [];
    }
    P(v) {
      const [x, y, z] = v;
      const x1 = x * this.ct - y * this.st, y1 = x * this.st + y * this.ct;
      return [R(this.cx + this.scale * x1), R(this.cy - this.scale * (z * this.cp + y1 * this.sp))];
    }
    seg(p, q, cls = 'st-ink') { const a = this.P(p), b = this.P(q); this.els.push(`<line class="${cls}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`); return this; }
    path(pts, cls = 'st-blue', closed = false) {
      const d = pts.map((p, i) => { const s = this.P(p); return (i ? 'L' : 'M') + s[0] + ' ' + s[1]; }).join(' ') + (closed ? ' Z' : '');
      this.els.push(`<path class="${cls}" d="${d}"/>`); return this;
    }
    poly(pts, cls = 'fl-blue') { return this.path(pts, cls, true); }
    arrow(p, q, cls = 'blue') {
      const a = this.P(p), b = this.P(q);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const ex = b[0] - (b[0] - a[0]) / len * 8, ey = b[1] - (b[1] - a[1]) / len * 8;
      this.els.push(`<line class="vec st-${cls}" x1="${a[0]}" y1="${a[1]}" x2="${R(ex)}" y2="${R(ey)}"/>` + arrowHead(a[0], a[1], b[0], b[1], 'fl-' + cls));
      return this;
    }
    point(p, label, o = {}) {
      const s = this.P(p);
      this.els.push(`<circle class="pt fl-${o.cls || 'ink'}" cx="${s[0]}" cy="${s[1]}" r="${o.r || 3.8}"/>`);
      if (label) this.els.push(textEl(s[0], s[1], label, { dx: o.dx ?? 7, dy: o.dy ?? -7, anchor: o.anchor, it: o.it !== false, cls: o.lcls || '' }));
      return this;
    }
    text(p, str, o = {}) { const s = this.P(p); this.els.push(textEl(s[0], s[1], str, o)); return this; }
    axes(L = [3, 3, 3], neg = [0.7, 0.7, 0.7], tick = null) {
      const names = ['x', 'y', 'z'];
      for (let i = 0; i < 3; i++) {
        const e = [0, 0, 0]; e[i] = 1;
        const n = e.map((c) => -c * neg[i]);
        const p = e.map((c) => c * L[i]);
        this.seg(n, [0, 0, 0], 'ax dash');
        this.arrow([0, 0, 0], p, 'axc');
        const q = e.map((c) => c * (L[i] + 0.28));
        const s = this.P(q);
        this.els.push(textEl(s[0], s[1], names[i], { it: true, anchor: 'middle', dy: 5 }));
      }
      const o = this.P([0, 0, 0]);
      this.els.push(textEl(o[0], o[1], 'O', { it: true, dx: -9, dy: 14, anchor: 'middle', cls: 'tk' }));
      return this;
    }
    rightAngle(v, d1, d2, size = 0.28, cls = 'st-ink') {
      const nz = (d) => { const l = Math.hypot(...d); return d.map((c) => c / l * size); };
      const a = nz(d1), b = nz(d2);
      return this.path([[v[0] + a[0], v[1] + a[1], v[2] + a[2]], [v[0] + a[0] + b[0], v[1] + a[1] + b[1], v[2] + a[2] + b[2]], [v[0] + b[0], v[1] + b[1], v[2] + b[2]]], cls + ' thin');
    }
    svg(aria = '') {
      return `<svg class="fig3d" viewBox="0 0 ${this.width} ${this.height}" width="${this.width}" height="${this.height}" role="img" aria-label="${esc(aria)}"><rect class="paper" x="0" y="0" width="${this.width}" height="${this.height}"/>${this.els.join('')}</svg>`;
    }
  }

  const api = { Plot2D, Plot3D, fmt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GeoPlot = api;
})(typeof window !== 'undefined' ? window : globalThis);
