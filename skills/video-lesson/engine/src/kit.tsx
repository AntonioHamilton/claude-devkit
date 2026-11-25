/** video-lesson piece kit. Every piece follows STYLE.md. */
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {D, FONT, letterSpacing, measure, MONO, useT, W} from './ds';
import {LOGO, LogoName} from './logos';

export const BLUE = '#7FA7E8';
export const G = {g1: '#E8EAED', g2: '#A3A9B2', g3: '#6B717B', g4: '#3A4049', g5: '#1A1D22', g6: '#0E1013'};
export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.22, 1, 0.36, 1);
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const kf = (t: number, f: [number, number][]) => {
  if (t <= f[0][0]) return f[0][1];
  for (let i = 1; i < f.length; i++) if (t <= f[i][0]) {
    const [t0, v0] = f[i - 1], [t1, v1] = f[i];
    return v0 + (v1 - v0) * ease(Math.min(1, Math.max(0, (t - t0) / Math.max(0.001, t1 - t0))));
  }
  return f[f.length - 1][1];
};
export const useK = () => { const t = useT(); return (a: number, d = 0.6) => interpolate(t, [a, a + d], [0, 1], {...cl, easing: easeIn}); };

/* ── text ── */
/** Text that enters letter by letter and (with `out`) leaves letter by letter, rising. "*x*" = blue. */
export const Glyphs: React.FC<{text: string; at: number; out?: number; size?: number; color?: string; mono?: boolean; weight?: number; step?: number}> =
  ({text, at, out, size = 40, color = D.text, mono, weight = 600, step = 0.025}) => {
    const k = useK();
    let hl = false, n = 0;
    return (<span style={{fontFamily: mono ? MONO : FONT, fontSize: size, fontWeight: weight, color, whiteSpace: 'pre', letterSpacing: `${letterSpacing(size, mono)}em`}}>
      {[...text].map((c, i) => {
        if (c === '*') { hl = !hl; return null; }
        const j = n++; const p = k(at + j * step, 0.45); const q = out === undefined ? 0 : k(out + j * step * 0.6, 0.35);
        return <span key={i} style={{display: 'inline-block', color: hl ? BLUE : undefined, opacity: p * (1 - q),
          transform: `translateY(${(1 - p) * 14 - q * 18}px)`, filter: `blur(${(1 - p) * 6 + q * 6}px)`}}>{c === ' ' ? ' ' : c}</span>;
      })}
    </span>);
  };

/** Label that changes by rolling letter by letter: steps = [[time, text], ...]. Width interpolated, no jump. */
export const Roll: React.FC<{steps: [number, string][]; size: number; color?: string; colorAt?: [number, string]}> = ({steps, size, color = D.text, colorAt}) => {
  const t = useT(); const k = useK();
  let j = 0; for (let i = 0; i < steps.length; i++) if (t >= steps[i][0]) j = i;
  const [tj, cur] = steps[j]; const prev = j > 0 ? steps[j - 1][1] : '';
  const est = (s: string) => measure(s, size, 600);
  const pAll = j > 0 ? k(tj, 0.35 + cur.length * 0.03) : 1;
  const col = colorAt && t >= colorAt[0] ? colorAt[1] : color;
  const layer = (s: string, isNew: boolean) => (
    <span style={{position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', whiteSpace: 'pre'}}>
      {[...s].map((c, i) => {
        const p = j === 0 && isNew ? 1 : k(tj + i * 0.03, 0.35);
        const y = isNew ? (1 - p) * 0.7 : -p * 0.7; const o = isNew ? p : 1 - p;
        return <span key={i} style={{display: 'inline-block', transform: `translateY(${y}em)`, opacity: o, filter: `blur(${(isNew ? 1 - p : p) * 4}px)`}}>{c === ' ' ? ' ' : c}</span>;
      })}
    </span>
  );
  const w = mix(est(prev || cur), est(cur), pAll);
  // exact (measured) width; the old layer leaves the DOM when done so it doesn't widen the column
  return (<span style={{display: 'inline-block', position: 'relative', width: w, height: '1em', overflow: 'visible',
    fontFamily: FONT, fontWeight: 600, fontSize: size, color: col, letterSpacing: `${letterSpacing(size)}em`, lineHeight: 1}}>
    {prev && pAll < 1 && layer(prev, false)}{layer(cur, true)}
  </span>);
};

/* ── logos ── */
export const LogoSvg: React.FC<{n: LogoName; s: number}> = ({n, s}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{flexShrink: 0, display: 'block'}}><path d={LOGO[n].d} fill={LOGO[n].c} /></svg>
);
/** Logo that changes by flipping (scaleX 1→0→1). A null step = no logo (width shrinks). */
export const LogoFlip: React.FC<{steps: [number, LogoName | null][]; s: number}> = ({steps, s}) => {
  const t = useT(); const k = useK();
  let j = 0; for (let i = 0; i < steps.length; i++) if (t >= steps[i][0]) j = i;
  const [tj, cur] = steps[j]; const prev = j > 0 ? steps[j - 1][1] : cur;
  const a = j > 0 ? k(tj, 0.22) : 1, b = j > 0 ? k(tj + 0.22, 0.22) : 1;
  const show = a < 1 ? prev : cur; const sx = a < 1 ? 1 - a : b;
  const w = mix(prev ? s : 0, cur ? s : 0, j > 0 ? k(tj, 0.44) : 1);
  return <div style={{width: w, height: s, display: 'flex', justifyContent: 'center', transform: `scaleX(${sx})`}}>{show && <LogoSvg n={show} s={s} />}</div>;
};

/* ── boxes and wires ── */
export type Obj = {x: number; y: number; w: number; h: number; o?: number; hot?: number; hc?: string; r?: number};
/** Box. Self-check: if content is bigger than the box (overflowing text), it logs "OVERFLOW" to the console
 *  — scripts/review.sh collects those warnings and the review fails. */
export const Box: React.FC<{s: Obj; children?: React.ReactNode; dim?: number; name?: string}> = ({s, children, dim = 0, name}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const t = useT();
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el || (s.o ?? 1) < 0.99 || !children) return;
    let r = el.getBoundingClientRect(); let maxR = r.left, maxB = r.top, minL = r.right, minT = r.bottom;
    el.querySelectorAll('*').forEach((c) => { if (c.children.length && c.tagName !== 'svg') return;   // only what paints: leaves and icons
      if (c.closest('svg') && c.tagName !== 'svg') return;
      const b = (c as HTMLElement).getBoundingClientRect(); if (b.width === 0 || b.height === 0) return;
      let op = 1, n: HTMLElement | null = c as HTMLElement;          // effective opacity (inherited up to the box)
      while (n && n !== el) { op *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement; }
      if (op < 0.05) return;
      maxR = Math.max(maxR, b.right); maxB = Math.max(maxB, b.bottom); minL = Math.min(minL, b.left); minT = Math.min(minT, b.top); });
    const over = Math.max(maxR - r.right, r.left - minL, maxB - r.bottom, r.top - minT);
    if (over > 3) console.warn(`OVERFLOW t=${t.toFixed(2)} caixa=${name ?? `${Math.round(s.x)},${Math.round(s.y)}`} excesso=${Math.round(over)}px`);
  });
  return (
  <div ref={ref} style={{position: 'absolute', left: s.x - s.w / 2, top: s.y - s.h / 2, width: s.w, height: s.h, borderRadius: s.r ?? 6, boxSizing: 'border-box',
    border: `1.5px solid color-mix(in srgb, ${s.hc ?? D.sand} ${Math.round(100 * (s.hot ?? 0))}%, ${G.g4})`,
    background: `color-mix(in srgb, ${s.hc ?? D.sand} ${Math.round(12 * (s.hot ?? 0))}%, ${G.g6})`,
    boxShadow: (s.hot ?? 0) > 0.01 ? `0 0 ${Math.round(40 * (s.hot ?? 0))}px -6px color-mix(in srgb, ${s.hc ?? D.sand} ${Math.round(55 * (s.hot ?? 0))}%, transparent)` : 'none',
    opacity: (s.o ?? 1) * (1 - 0.65 * dim), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, overflow: 'visible'}}>{children}</div>
  );
};
/** A signal on a wire: the coloured stretch grows from source to destination, then drains into it. */
export type Sig = {at: number; back?: boolean; c?: string};
export const FILL = 0.5, DRAIN = 0.45;
/** Wire between the edges of two objects. `draw` 0..1 draws; `undraw` 0..1 retracts. `sigs` = signals (fill → drain). */
export const Wire: React.FC<{a: Obj; b: Obj; draw: number; undraw?: number; sigs?: Sig[]; dim?: number}> = ({a, b, draw, undraw = 0, sigs = [], dim = 0}) => {
  const t = useT();
  const right = b.x > a.x;
  const ax = a.x + (right ? a.w / 2 : -a.w / 2), bx = b.x + (right ? -b.w / 2 : b.w / 2);
  const L = Math.max(0, draw - undraw);
  if (L < 0.005) return null;
  const P = (f: number) => [mix(ax, bx, f), mix(a.y, b.y, f)];
  const e = Easing.bezier(0.45, 0, 0.2, 1);
  return (<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - 0.65 * dim}} width={W} height={1080}>
    <line x1={ax} y1={a.y} x2={P(L)[0]} y2={P(L)[1]} stroke={G.g4} strokeWidth={2} />
    {L > 0.99 && sigs.map((g, i) => {
      const head = interpolate(t, [g.at, g.at + FILL], [0, 1], {...cl, easing: e});
      const tail = interpolate(t, [g.at + FILL * 0.7, g.at + FILL * 0.7 + DRAIN], [0, 1], {...cl, easing: e});
      if (head <= 0 || tail >= 1) return null;
      const [f0, f1] = g.back ? [1 - head, 1 - tail] : [tail, head];
      const [x1, y1] = P(f0), [x2, y2] = P(f1);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={g.c ?? (g.back ? D.sand : BLUE)} strokeWidth={4} strokeLinecap="round" />;
    })}
  </svg>);
};
/** A box lights up when a signal reaches it (from end of fill to end of drain). */
export const env = (t: number, a: number, b: number, up = 0.35, down = 0.5) =>
  Math.min(interpolate(t, [a, a + up], [0, 1], {...cl, easing: Easing.bezier(0.33, 0, 0.2, 1)}), interpolate(t, [b, b + down], [1, 0], {...cl, easing: Easing.bezier(0.4, 0, 0.6, 1)}));
export const lit = (t: number, arrivals: number[]) => Math.max(0, ...arrivals.map((a) => env(t, a + FILL * 0.8, a + FILL * 0.7 + DRAIN)));
export const Caption: React.FC<{y: number; children: React.ReactNode}> = ({y, children}) => (
  <div style={{position: 'absolute', left: 160, width: W - 320, top: y, textAlign: 'center'}}>{children}</div>
);

/* ── content layout: logos + text as ONE group centered in the box ── */
export const est = (s: string, size: number) => measure(s, size, 600);
/** Current width of a Roll (same math as the component). */
export const rollW = (t: number, k: (a: number, d?: number) => number, steps: [number, string][], size: number) => {
  let j = 0; for (let i = 0; i < steps.length; i++) if (t >= steps[i][0]) j = i;
  const [tj, cur] = steps[j]; const prev = j > 0 ? steps[j - 1][1] : '';
  return mix(est(prev || cur, size), est(cur, size), j > 0 ? k(tj, 0.35 + cur.length * 0.03) : 1);
};
/** Centres of items in a row (widths ws, gaps) centered on cx. */
export const lay = (cx: number, ws: number[], gaps: number[]) => {
  const tot = ws.reduce((a, w, i) => a + w + (i < ws.length - 1 ? gaps[i] : 0), 0);
  let x = cx - tot / 2;
  return ws.map((w, i) => { const c = x + w / 2; x += w + (i < ws.length - 1 ? gaps[i] : 0); return c; });
};
export const At: React.FC<{x: number; y: number; children: React.ReactNode; o?: number}> = ({x, y, children, o = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', opacity: o, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);


/* ── time by phrase (words.json from align.py) ── */
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9@.-]/g, '');
/** at("private data") → second the phrase starts (1st occurrence after `after`). Throws if not found. */
export const makeAt = (words: {w: string; t: number}[]) => (phrase: string, after = 0): number => {
  const ps = phrase.split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    if (words[i].t < after) continue;
    if (ps.every((p, j) => words[i + j] && norm(words[i + j].w).replace(/\.$/, '') === p.replace(/\.$/, ''))) return words[i].t;
  }
  throw new Error(`phrase not found in the audio: "${phrase}"`);
};

/* ── wires between non-horizontal objects ── */
/** Straight wire from the middle of the edge facing the other object. */
export const CWire: React.FC<{a: Obj; b: Obj; draw: number; undraw?: number; c?: string; o?: number}> = ({a, b, draw, undraw = 0, c = G.g4, o = 1}) => {
  const edge = (q: Obj, dx: number, dy: number) => { const s = Math.min(q.w / 2 / Math.abs(dx || 1e-6), q.h / 2 / Math.abs(dy || 1e-6)); return [q.x + dx * s, q.y + dy * s]; };
  const dx = b.x - a.x, dy = b.y - a.y; const [x1, y1] = edge(a, dx, dy), [x2, y2] = edge(b, -dx, -dy);
  const L = Math.max(0, draw - undraw); if (L < 0.005) return null;
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o}} width={W} height={1080}><line x1={x1} y1={y1} x2={mix(x1, x2, L)} y2={mix(y1, y2, L)} stroke={c} strokeWidth={2} /></svg>;
};
/** L-shaped wire (leaves a's left side, runs straight, rises to b's bottom middle), with fill→drain signals. */
export const LWire: React.FC<{a: Obj; b: Obj; draw: number; sigs?: Sig[]}> = ({a, b, draw, sigs = []}) => {
  const t = useT();
  const x0 = a.x - a.w / 2, y0 = a.y, x1 = b.x, y1 = b.y + b.h / 2;
  const L1 = Math.abs(x0 - x1), L2 = Math.abs(y0 - y1), tot = L1 + L2;
  const pt = (f: number) => { const d = f * tot; return d <= L1 ? [x0 - d, y0] : [x1, y0 - (d - L1)]; };
  const seg = (f0: number, f1: number) => { const pts = [pt(f0)]; if (f0 * tot < L1 && f1 * tot > L1) pts.push([x1, y0]); pts.push(pt(f1)); return pts.map((p) => p.join(',')).join(' '); };
  if (draw < 0.005) return null;
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={W} height={1080}>
    <polyline points={seg(0, draw)} fill="none" stroke={G.g4} strokeWidth={2} />
    {draw > 0.99 && sigs.map((g, i) => { const h = Math.min(1, Math.max(0, (t - g.at) / 0.6)), tl = Math.min(1, Math.max(0, (t - g.at - 0.42) / 0.5));
      return h > 0 && tl < 1 ? <polyline key={i} points={seg(tl, h)} fill="none" stroke={g.c ?? D.sand} strokeWidth={4} strokeLinecap="round" /> : null; })}
  </svg>;
};
