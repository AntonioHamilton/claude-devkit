/**
 * Lesson scene template. Copy to lessons/<slug>/scenes.tsx and replace everything marked ▸.
 * It already follows STYLE.md: times from speech, one element per object, flex content inside the box,
 * box sized by measured text, signals fill→drain, no fades.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Inbox} from 'lucide-react';
import {Cue, D, makePoster, makeStage, measure, Reveal, revealCues, Scene, useFontsReady, useT, W} from '../ds';
import {BLUE, Box, env, G, Glyphs, kf, LogoSvg, makeAt, mix, Obj, Roll, Sig, useK, Wire} from '../kit';
import A from './current.anchors.json';
import WORDS from './current.words.json';

const a = A as Record<string, number>;
const at = makeAt(WORDS as any);
const END = a.end;
const sig = (x: number, c?: string, back?: boolean): Sig => ({at: x, c, back});

/* ▸ Every time comes from speech. If the phrase isn't in the audio, makeAt throws. */
const T = {
  agent: at('agent'),           // when the object is named
  tool: at('tool'),
  call: at('calls'),           // when the action happens
  concept: at('this is'),       // reveal of the central concept
  end: at('in one sentence'),
};

const Main = () => {
  useFontsReady();                              // required: measure() needs the fonts loaded
  const t = useT(); const k = useK();
  const X = (f: [number, number][]) => kf(t, f);

  /* ▸ ONE object = ONE Obj, continuous geometry across phases (never swap elements midway). */
  const grow = X([[T.end - 2, 0], [T.end - 1, 1]]);
  const agent: Obj = {x: mix(620, 960, grow), y: 540, w: 300, h: 116, o: k(T.agent - 0.1)};
  agent.hot = env(t, T.call + 1.0, T.call + 1.8); agent.hc = D.sand;          // lights up when the result arrives

  /* ▸ A box with text: width from measured text (+ icon + padding). */
  const label = 'Tool';
  const tool: Obj = {x: 1300, y: 540, w: 2 * 40 + 30 + 18 + measure(label, 36, 600), h: 100, o: k(T.tool)};
  tool.hot = env(t, T.call + 0.45, T.call + 1.0); tool.hc = BLUE;           // lights up when the request arrives

  return (<AbsoluteFill>
    {/* wire + signals: blue going (request), sand coming back (result) */}
    <Wire a={agent} b={tool} draw={k(T.tool + 0.1, 0.5)} sigs={[sig(T.call, BLUE), sig(T.call + 0.6, D.sand, true)]} />

    {/* content = flex children of the box itself (centered together) */}
    <Box s={agent}><LogoSvg n="claude" s={44} /><Glyphs text="Agent" at={T.agent} size={40} /></Box>
    <Box s={tool}><Inbox size={30} color={D.text} strokeWidth={1.6} /><Glyphs text={label} at={T.tool + 0.1} size={36} /></Box>

    {/* a changing title = Roll (never fade) */}
    <div style={{position: 'absolute', left: 0, width: W, top: 110, textAlign: 'center', opacity: k(T.end, 0.4)}}>
      <Roll size={52} steps={[[T.end, '▸ Summary line']]} colorAt={[T.end, D.sand]} />
    </div>

    <Reveal at={T.concept} dur={2.4} term="▸ Term" def="▸ short definition" />
  </AbsoluteFill>);
};

export const SCENES: Scene[] = [{from: 0, to: END, C: Main, cues: [...revealCues(T.concept)] as Cue[]}];
export const DUR = END;
export const Stage = makeStage('current.mp3', SCENES);
export const Poster = makePoster('LESSON', '▸ Title', '▸ Subtitle');
