/**
 * video-lesson base: tokens, fonts, sound, stage, reveal, 3D corridor and text measuring.
 * Diagram pieces (box, wire, rolling text, logos) live in kit.tsx. Rules: STYLE.md.
 * Stage = 1920×1080, absolute coordinates. Colours and fonts are defined only here: edit them to restyle.
 */
import React, {useId} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';

export const FPS = 30;
export const W = 1920, H = 1080;

export const D = {
  bg: '#000000', surface: '#111318', raised: '#171A20', line: '#262B33',
  text: '#F2F4F7', muted: '#8A8F98', faint: '#4A505A', sand: '#C9A96E',
};
export const HUE = {
  sand: '#C9A96E', blue: '#5B8DEF', green: '#3FB27F', red: '#E5484D',
  amber: '#F5A524', purple: '#9B6BFF', teal: '#2BB3A3', gray: '#6B7280',
} as const;
export type Hue = keyof typeof HUE;
const tint = (h: Hue, a = 0.14) => `color-mix(in srgb, ${HUE[h]} ${Math.round(a * 100)}%, ${D.surface})`;

export const FONT = '"M PLUS 1p"', MONO = '"M PLUS 1 Code", monospace', DISPLAY = 'Oxanium';
/** Fonts: M PLUS 1p for text and M PLUS 1 Code for code/data (SIL OFL 1.1, see public/OFL.txt).
 *  600 maps to Bold (M PLUS 1p has no 600). Spacing: see letterSpacing() below. */
export const Fonts: React.FC = () => (
  <style>{[[400, 'Regular'], [500, 'Medium'], [600, 'Bold'], [700, 'Bold'], [800, 'Bold']].map(([w, f]) => `@font-face{font-family:"M PLUS 1p";font-weight:${w};src:url(${staticFile(`MPLUS1p-${f}.ttf`)})}`).join('') +
    `@font-face{font-family:"M PLUS 1 Code";font-weight:100 700;src:url(${staticFile('MPLUS1Code-var.ttf')})}`}</style>
);
/** Letter spacing: +0.02em on text (clearer), 0 on big titles (≥50 px) and code. */
export const letterSpacing = (size: number, mono = false) => (mono || size >= 50 ? 0 : 0.02);

export const useT = () => useCurrentFrame() / FPS;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
/** 0→1 from `at` (s), with a slight overshoot. */
export const useAp = () => {
  const t = useT();
  return (at: number, d = 0.45, ease = Easing.bezier(0.3, 1.35, 0.6, 1)) => interpolate(t, [at, at + d], [0, 1], {...clamp, easing: ease});
};
export const enter = (p: number, dy = 24): React.CSSProperties => ({opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * dy}px) scale(${0.94 + 0.06 * p})`});

/* ───────────── SFX ───────────── */
// No sounds ship with the skill. Drop your own `<name>.mp3` files in engine/public/sfx/ and list them in SFX_AVAILABLE.
export type Sfx = 'pop' | 'click' | 'key' | 'tap' | 'confirm' | 'ting' | 'alert' | 'whoosh' | 'whoosh-soft' | 'whoosh-air' | 'boom' | 'page' | 'coins' | 'kaching' | 'typing' | 'pencil' | 'energy' | 'plim' | 'space';
export type Cue = [at: number, s: Sfx, vol?: number];
const VOL: Partial<Record<Sfx, number>> = {boom: 0.55, whoosh: 0.35, 'whoosh-air': 0.35, 'whoosh-soft': 0.4, typing: 0.25, energy: 0.35};
export const SFX_AVAILABLE: Sfx[] = [];
export const SfxTrack: React.FC<{cues: Cue[]}> = ({cues}) => (<>
  {cues.filter(([, s]) => SFX_AVAILABLE.includes(s)).map(([at, s, v], i) => (
    <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={FPS * 4} layout="none">
      <Audio src={staticFile(`sfx/${s}.mp3`)} volume={(v ?? VOL[s] ?? 0.45) * 0.8} />
    </Sequence>
  ))}
</>);

/* ───────────── Pieces ───────────── */
/**
 * REVEAL: the key term takes the screen (background darkens, big sand term coming from behind, short definition).
 * Only for the video's central concept (1–2 per video). Sound: revealCues (boom). Use `at` = at("the term").
 * If the concept has a drawing, DON'T use Reveal: put the title next to the drawing.
 */
export const Reveal: React.FC<{at: number; dur?: number; term: string; def?: string; kicker?: string}> = ({at, dur = 3.2, term, def, kicker = 'conceito'}) => {
  const t = useT();
  if (t < at - 0.3 || t > at + dur + 0.5) return null;
  const k = (a: number, b: number, e = Easing.bezier(0.16, 1, 0.3, 1)) => interpolate(t, [at + a, at + b], [0, 1], {...clamp, easing: e});
  const out = interpolate(t, [at + dur, at + dur + 0.4], [1, 0], clamp);
  const zin = k(0, 0.55);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <AbsoluteFill style={{background: `rgba(0,0,0,${0.88 * k(-0.25, 0.1, Easing.linear)})`, backdropFilter: `blur(${10 * k(-0.25, 0.2)}px)`}} />
      <AbsoluteFill style={{background: '#fff', opacity: 0.18 * (1 - k(0.05, 0.35, Easing.linear)) * (t > at + 0.05 ? 1 : 0)}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 132, letterSpacing: `${0.08 * (1 - zin)}em`, color: D.sand, lineHeight: 1,
          transform: `scale(${2.2 - 1.2 * zin})`, filter: `blur(${(1 - zin) * 14}px)`, opacity: zin}}>{term}</div>
        {def && <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 36, color: D.muted, marginTop: 30, ...enter(k(0.7, 1.2))}}>{def}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const revealCues = (at: number): Cue[] => [[at + 0.02, 'boom', 0.6]];

/**
 * 3D CORRIDOR: the camera walks down a corridor toward the centre of the screen; items on the walls
 * pass by on the sides. `items` in depth order. Sound: corridorCues (one whoosh on entry).
 */
export const Corridor: React.FC<{from: number; to: number; items: {label: string; sub?: string; side: 'l' | 'r'; hit?: boolean}[]; spacing?: number}> =
  ({from, to, items, spacing = 900}) => {
    const t = useT();
    const len = items.length * spacing + 600;
    const z = interpolate(t, [from, to], [0, len - 300], {...clamp, easing: Easing.bezier(0.45, 0, 0.35, 1)});
    const wallW = 560, hallH = 640;
    return (
      <AbsoluteFill style={{perspective: 700, perspectiveOrigin: '50% 48%', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: W / 2, top: H / 2, transformStyle: 'preserve-3d', transform: `translateZ(${z}px)`}}>
          {/* floor and walls: a grid of lines */}
          {Array.from({length: Math.ceil(len / 200)}).map((_, i) => (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: -wallW, top: hallH / 2, width: wallW * 2, height: 2, background: D.line, transform: `translateZ(${-i * 200}px)`}} />
              <div style={{position: 'absolute', left: -wallW, top: -hallH / 2, width: wallW * 2, height: 2, background: D.surface, transform: `translateZ(${-i * 200}px)`}} />
              <div style={{position: 'absolute', left: -wallW, top: -hallH / 2, width: 2, height: hallH, background: D.line, transform: `translateZ(${-i * 200}px)`}} />
              <div style={{position: 'absolute', left: wallW, top: -hallH / 2, width: 2, height: hallH, background: D.line, transform: `translateZ(${-i * 200}px)`}} />
            </React.Fragment>
          ))}
          {items.map((it, i) => {
            const zi = -(i + 1) * spacing;
            const dist = -(zi + z); // >0 = à frente
            const fade = interpolate(dist, [-150, 100, 400, 2600], [0, 1, 1, 0.25], clamp);
            const x = it.side === 'l' ? -wallW + 40 : wallW - 40 - 380;
            const c = it.hit ? D.sand : '#E8EAED';
            return (
              <div key={i} style={{position: 'absolute', left: x, top: -200, width: 380, height: 380, transformOrigin: it.side === 'l' ? 'left center' : 'right center',
                transform: `translateZ(${zi}px) rotateY(${it.side === 'l' ? 55 : -55}deg)`, opacity: fade,
                background: '#000', border: `2px solid ${c}`, borderRadius: 6, padding: 34, boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, boxShadow: 'none'}}>
                <div style={{fontFamily: MONO, fontSize: 26, color: D.muted}}>label</div>
                <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 52, color: c}}>{it.label}</div>
                {it.sub && <div style={{fontFamily: MONO, fontSize: 24, color: D.muted, marginTop: 10}}>{it.sub}</div>}
              </div>
            );
          })}
        </div>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 48%, transparent 30%, ${D.bg} 85%)`}} />
      </AbsoluteFill>
    );
  };
export const corridorCues = (from: number): Cue[] => [[from + 0.1, 'whoosh-air', 0.35]];

/* ───────────── Palco ───────────── */
export type Scene = {from: number; to: number; C: React.FC; cues?: Cue[]};
export const makeStage = (audio: string, scenes: Scene[], extra: Cue[] = []) => {
  const cues: Cue[] = [...extra, ...scenes.flatMap((s) => s.cues ?? [])];
  const S: React.FC = () => {
    const t = useT();
    return (
      <AbsoluteFill style={{background: D.bg}}>
        <Fonts />
        <Audio src={staticFile(audio)} />
        <SfxTrack cues={cues} />
        {scenes.map(({from, to, C: Sc}, i) => {
          if (t < from - 0.1 || t > to + 0.35) return null;
          const o = interpolate(t, [from - 0.1, from + 0.25, to, to + 0.35], [0, 1, 1, 0], clamp);
          return <AbsoluteFill key={i} style={{opacity: o, transform: `scale(${1.02 - 0.02 * o})`}}><Sc /></AbsoluteFill>;
        })}
      </AbsoluteFill>
    );
  };
  return S;
};

export const makePoster = (kicker: string, title: string, sub: string, _I?: any, _h?: Hue) => {
  const P: React.FC = () => (
    <AbsoluteFill style={{background: D.bg}}>
      <Fonts />
      <div style={{position: 'absolute', left: 140, top: 330, width: 1100}}>
        <div style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, letterSpacing: '.2em', color: D.sand}}>{kicker}</div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: 0, color: D.text, marginTop: 24}}>{title}</div>
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 36, color: D.muted, marginTop: 30}}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
  return P;
};

/* ───────────── Data objects (instead of icons) ───────────── */
// Rule: draw the real thing (a line of code, a token, an email, a log, a table). Thin outline, sand only on what matters now.
/* ───────────── Real text measuring (deterministic) ───────────── */
// Never estimate width by letter count: measure with the real loaded font.
let _ctx: CanvasRenderingContext2D | null = null;
const _cache = new Map<string, number>();
export const measure = (text: string, size: number, weight = 600, family = FONT, spacingEm?: number) => {
  if (spacingEm === undefined) spacingEm = letterSpacing(size, family.includes('Code'));
  const key = `${text}|${size}|${weight}|${family}|${spacingEm}`;
  const hit = _cache.get(key); if (hit !== undefined) return hit;
  if (!_ctx) _ctx = document.createElement('canvas').getContext('2d');
  const c = _ctx!;
  c.font = `${weight} ${size}px ${family}`;
  (c as any).letterSpacing = `${spacingEm * size}px`;
  const w = c.measureText(text).width;
  if (document.fonts.check(c.font)) _cache.set(key, w);
  return w;
};
/** Holds the render until fonts load (otherwise measuring uses the fallback font). */
export const useFontsReady = () => {
  const [ready, setReady] = React.useState(false);
  const [h] = React.useState(() => delayRender('fontes'));
  React.useEffect(() => {
    Promise.all([...[400, 500, 700].map((w) => document.fonts.load(`${w} 40px "M PLUS 1p"`)), document.fonts.load('400 40px "M PLUS 1 Code"')]).then(() => { _cache.clear(); setReady(true); continueRender(h); });
  }, [h]);
  return ready;
};
