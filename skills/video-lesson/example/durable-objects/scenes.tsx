/**
 * Estado e tarefas longas — Durable Objects e workflows duráveis (narrador Rafael, ~4:25). Cena contínua:
 *   Servidor de notas → vira a nota "Pipeline" (deals) → vira o armazenamento do Durable Object → vira a fonte "Notas" da indexação
 *   Worker sobe/responde/some → vários → dois Workers em corrida (Acme some) → os dois se fundem no Durable Object
 *   Pedidos entram numa fila → um de cada vez → nada se perde
 *   Indexação em 10 passos: cai no 6 → recomeça do zero (sem durabilidade) → workflow durável retoma do 6
 *   Os passos se reagrupam no relatório semanal (CRM, e-mails, resumir, escrever)
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Check, Database, Server, X as XIcon} from 'lucide-react';
import {Cue, D, makePoster, makeStage, measure, MONO, Reveal, revealCues, Scene, useFontsReady, useT, W} from '../ds';
import {BLUE, Box, env, G, Glyphs, kf, LogoSvg, makeAt, mix, Obj, Roll, Sig, useK, Wire} from '../kit';
import A from './current.anchors.json';
import WORDS from './current.words.json';

const a = A as Record<string, number>;
const at = makeAt(WORDS as any);
const RED = '#E5736B', GREEN = '#7ED3A0';
const END = a.end;
const sig = (x: number, c?: string, back?: boolean): Sig => ({at: x, c, back});

const T = {
  srv: at('servidor de notas'), cf: at('Cloudflare Workers'), wk: at('Um Worker'), req: at('responde um pedido'), gone: at('e some'),
  noKeep: at('Ele não guarda'), many: at('podem existir'), places: at('lugares diferentes'), scale: at('Escala sozinho'),
  agent: at('Mas um agente'), conv: at('uma conversa'), see: at('Agora veja'), pipe: at('nota Pipeline tem'), claude: at('O Claude pede'), acme: at('a Acme.', at('O Claude pede')),
  cursor: at('o Cursor'), bolt: at('a Bolt.', at('o Cursor')), two: at('Dois Workers'), read: at('Cada um lê'), w1: at('O primeiro grava:'), w1acme: at('mais a Acme'),
  w2: at('O segundo grava'), w2bolt: at('mais a Bolt'), lost: at('A Acme sumiu'), race: at('condição de corrida'), noModel: at('E não adianta'), procs: at('dois processos'),
  dO: at('O Durable Object'), name: at('com um nome'), pipeName: at('a nota Pipeline.', at('com um nome')), one: at('só uma instância'), falls: at('Todo pedido'),
  state: at('guarda o próprio'), oneAt: at('um pedido de cada'), noLock: at('Não tem trava'), design: at('um nome, uma'),
  again: at('Vamos repetir'), queue: at('entram numa fila'), q1: at('O primeiro grava a'), four: at('quatro deals'), q2: at('O segundo lê'), five: at('cinco deals'), safe: at('Nada se perde'),
  mine: at('no meu servidor'), perKey: at('Um por chave'), convDO: at('a conversa de um agente'), aws: at('Na AWS não'), gcp: at('No Google, com'),
  time: at('O segundo problema'), index: at('Indexar as notas'), ten: at('dez passos'), cost: at('duas mil notas'),
  run: at('Ela roda'), s1: at('Passo um'), s2: at('dois,', at('Passo um')), s3: at('três,', at('Passo um')), s6: at('até o seis'),
  timeout: at('dá timeout'), dies: at('o processo morre'), restart: at('recomeça do passo'), pay: at('Paga de novo'), half: at('metade das notas'), wrong: at('A busca passa'),
  wf: at('Um workflow durável'), save: at('Cada passo, ao'), fail6: at('Quando o passo seis'), r1: at('um segundo'), r2: at('dois,', at('um segundo')), r4: at('quatro.', at('um segundo')),
  crash: at('servidor inteiro cair'), back6: at('volta do passo seis'), five5: at('os cinco primeiros'),
  cfwf: at('Na Cloudflare'), sfn: at('Step Functions'), gwf: at('No Google, Workflows'), agentWf: at('Pra um agente'),
  report: at('Por exemplo: o relatório'), crm: at('no CRM'), mails: at('quarenta e-mails,'), sum: at('resumir,'), write: at('escrever a nota'), sfail: at('Se o resumo'), noRe: at('não lê os'),
  fin: [at('um dono pra'), at('e cada passo guardado')],
};

const CWire: React.FC<{a: Obj; b: Obj; draw: number; undraw?: number; sigs?: Sig[]}> = ({a, b, draw, undraw = 0, sigs = []}) => {
  const t = useT();
  const edge = (q: Obj, dx: number, dy: number) => { const s = Math.min(q.w / 2 / Math.abs(dx || 1e-6), q.h / 2 / Math.abs(dy || 1e-6)); return [q.x + dx * s, q.y + dy * s]; };
  const dx = b.x - a.x, dy = b.y - a.y; const [x1, y1] = edge(a, dx, dy), [x2, y2] = edge(b, -dx, -dy);
  const L = Math.max(0, draw - undraw); if (L < 0.005) return null;
  return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={W} height={1080}>
    <line x1={x1} y1={y1} x2={mix(x1, x2, L)} y2={mix(y1, y2, L)} stroke={G.g4} strokeWidth={2} />
    {L > 0.99 && sigs.map((g, i) => { const h = Math.min(1, Math.max(0, (t - g.at) / 0.5)), tl = Math.min(1, Math.max(0, (t - g.at - 0.35) / 0.45));
      if (h <= 0 || tl >= 1) return null; const [f0, f1] = g.back ? [1 - h, 1 - tl] : [tl, h];
      return <line key={i} x1={mix(x1, x2, f0)} y1={mix(y1, y2, f0)} x2={mix(x1, x2, f1)} y2={mix(y1, y2, f1)} stroke={g.c ?? BLUE} strokeWidth={4} strokeLinecap="round" />; })}
  </svg>;
};

const Main = () => {
  useFontsReady();
  const t = useT(); const k = useK();
  const X = (f: [number, number][]) => kf(t, f);
  const lw = (labels: string[], size: number, icon = 40) => 2 * 36 + icon + 18 + Math.max(...labels.map((l) => measure(l, size)));

  /* ── fases ── */
  const toC = X([[T.dO, 0], [T.dO + 1.2, 1]]);                 // corrida → Durable Object
  const toD = X([[T.time, 0], [T.time + 1.6, 1]]);             // DO → indexação
  const toR = X([[T.report, 0], [T.report + 1.2, 1]]);          // 10 passos → relatório

  /* ── clientes ── */
  const CL: Obj = {x: mix(420, 330, toC), y: mix(380, 330, toC), w: lw(['Claude'], 38), h: 110, o: k(T.agent)};
  const CU: Obj = {x: mix(420, 330, toC), y: mix(700, 610, toC), w: lw(['Cursor'], 38), h: 110, o: k(T.cursor - 0.2)};

  /* ── Workers → Durable Object (W2 entra por baixo do W1, depois o objeto vai pro lugar) ── */
  const wSpawn = X([[T.wk, 0], [T.wk + 0.5, 1]]) * (1 - X([[T.gone, 0], [T.gone + 0.4, 1]])) + X([[T.two, 0], [T.two + 0.5, 1]]);
  const tuck = X([[T.dO, 0], [T.dO + 0.6, 1]]), place = X([[T.dO + 0.6, 0], [T.dO + 1.2, 1]]);
  const doW = lw(['Durable Object', 'DO · Pipeline'], 36);
  const W1: Obj = {x: mix(960, 1050, place), y: t < T.two ? 540 : mix(380, 470, place), w: mix(lw(['3 + Acme', 'Worker'], 34), doW, X([[T.dO, 0], [T.dO + 0.3, 1]])), h: 110, o: Math.min(1, wSpawn)};
  W1.hot = Math.max(env(t, T.procs, T.dO), env(t, T.one, T.state), env(t, T.q1 + 0.5, T.q1 + 1.4), env(t, T.q2 + 0.5, T.q2 + 1.4)); W1.hc = t < T.dO ? '#E8B36B' : D.sand;
  const W2: Obj = {x: mix(960, W1.x, tuck), y: mix(700, W1.y, tuck), w: mix(lw(['3 + Bolt', 'Worker'], 34), W1.w, tuck), h: 110, o: k(T.two) * (tuck < 0.999 ? 1 : 0)};
  W2.hot = env(t, T.procs, T.dO); W2.hc = '#E8B36B';

  /* ── Workers fantasmas: sobem e somem o tempo todo (vários, em lugares diferentes) ── */
  const ghosts = [{x: 720, y: 300}, {x: 1220, y: 420}, {x: 900, y: 780}].map((g, i) => {
    const on = X([[T.many + i * 0.3, 0], [T.many + 0.5 + i * 0.3, 1]]) * (1 - X([[T.agent - 0.2 + i * 0.1, 0], [T.agent + 0.4 + i * 0.1, 1]]));
    const pulse = 0.75 + 0.25 * Math.sin((t - T.many) * 2.4 + i * 2.1);
    const s = on * pulse; return {...g, s};
  });

  /* ── nota (servidor → Pipeline → armazenamento do DO → fonte da indexação) — UM elemento ── */
  const stor = X([[T.state, 0], [T.state + 0.9, 1]]);
  const back3 = X([[T.again, 0], [T.again + 0.6, 1]]);
  const r4 = Math.max(0, k(T.w1acme + 0.2, 0.5) - back3) + k(T.four - 0.3, 0.5);
  const r5 = k(T.five - 0.3, 0.5);
  const nRows = 3 + r4 + r5;
  const noteH = mix(64 + nRows * 56 + 16, 120, toD), noteW = mix(380, lw(['Notas · 2.000'], 34), toD);
  const NOTE: Obj = {x: mix(mix(1500, 1050, stor), 260, toD), y: mix(mix(540, 790, stor), 540, toD), w: noteW, h: t < T.pipe ? 120 : noteH, o: k(T.srv)};
  NOTE.hot = Math.max(env(t, T.lost, T.lost + 2.2), env(t, T.safe, T.safe + 1.8), env(t, T.wrong, T.wrong + 1.6)); NOTE.hc = t > T.safe - 0.2 && t < T.time ? GREEN : RED;
  const rowsO = k(T.pipe, 0.4) * (1 - k(T.time, 0.3));
  const row4Label: [number, string][] = t < T.again ? [[0, 'Acme'], [T.w2bolt + 0.4, 'Bolt']] : [[0, 'Acme']];

  /* ── fila e conexões do DO ── */
  const QW = 2 * 18 + measure('+ Acme', 26, 400, MONO);
  const QU: Obj = {x: 640, y: 470, w: QW + 20, h: 150, o: k(T.queue - 0.2)};
  const DO2: Obj = {x: 1560, y: 470, w: lw(['Conversa'], 34), h: 110, o: k(T.convDO + 0.4)};
  const eqLines = ['AWS · Lambda + DynamoDB', 'GCP · Cloud Run + Firestore'];
  const EQ: Obj = {x: 1560, y: 790, w: 2 * 28 + Math.max(...eqLines.map((l) => measure(l, 24, 400, MONO))), h: 130, o: k(T.aws)};

  /* recolhendo pra fonte "Notas" quando começa a indexação (um por vez, por baixo) */
  const fold = (i: number, o: Obj): Obj => { const f = X([[T.time + i * 0.18, 0], [T.time + 0.6 + i * 0.18, 1]]);
    return {...o, x: mix(o.x, NOTE.x, f), y: mix(o.y, NOTE.y, f), w: mix(o.w, NOTE.w, f), h: mix(o.h, NOTE.h, f), o: (o.o ?? 1) * (f < 0.999 ? 1 : 0)}; };
  const drain = X([[T.q2 + 1.4, 0], [T.q2 + 2.0, 1]]);
  const QU2: Obj = {...QU, x: mix(QU.x, W1.x, drain), y: mix(QU.y, W1.y, drain), w: mix(QU.w, W1.w, drain), h: mix(QU.h, W1.h, drain), o: (QU.o ?? 1) * (drain < 0.999 ? 1 : 0)};
  const cl = fold(0, CL), cu = fold(1, CU), qu = fold(2, QU2), w1 = fold(3, W1), do2 = fold(4, DO2), eq = fold(5, EQ);

  /* ── passos da indexação (10) → relatório (4) ── */
  const N = 10, SX = (i: number) => 560 + i * 128;
  const RL = ['CRM', '40 e-mails', 'Resumir', 'Escrever nota'];
  const RW = RL.map((l) => 2 * 30 + 26 + 18 + measure(l, 30)), RG = 70;
  const RX: number[] = []; { let x = 500; RW.forEach((w) => { RX.push(x + w / 2); x += w + RG; }); }
  const rW = Math.max(...RW);
  const steps: Obj[] = Array.from({length: N}, (_, i) => {
    const p = k(T.index + 0.8 + i * 0.12, 0.45);
    const tuckIn = i >= 4 ? X([[T.report + (i - 4) * 0.08, 0], [T.report + 0.6 + (i - 4) * 0.08, 1]]) : 0;
    const x = i < 4 ? mix(SX(i), RX[i], toR) : mix(SX(i), RX[3], tuckIn);
    return {x, y: 540, w: i < 4 ? mix(104, RW[i], toR) : mix(104, RW[3], tuckIn), h: 92, o: p * (tuckIn < 0.999 ? 1 : 0)};
  });
  const doneAt1 = [T.s1, T.s2, T.s3, T.s3 + 0.4, T.s6 - 0.3];
  const doneAt2 = [T.save + 0.3, T.save + 0.75, T.save + 1.2, T.save + 1.65, T.save + 2.1];
  const rerun = [T.restart + 0.8, T.restart + 1.3, T.restart + 1.8];
  const state = (i: number): {done: number; fail: number; dim: number} => {
    let done = 0, fail = 0;
    if (t < T.wf) {                                   // execução sem durabilidade
      if (i < 5) done = k(doneAt1[i], 0.3) * (1 - k(T.restart - 0.2 + (5 - i) * 0.1, 0.25));
      if (i < 3) done = Math.max(done, k(rerun[i], 0.3));
      if (i === 5) fail = env(t, T.timeout, T.restart);
    } else {                                          // workflow durável
      if (i < 5) done = k(doneAt2[i], 0.3);
      if (i === 5) { fail = env(t, T.fail6 + 0.6, T.back6 + 0.3); done = k(T.back6 + 0.8, 0.3); }
      if (i > 5) done = k(T.five5 + 0.4 + (i - 6) * 0.5, 0.3);
    }
    if (t > T.report) { done = i < 2 ? 1 : i === 2 ? k(T.noRe + 0.6, 0.3) : i === 3 ? k(T.noRe + 1.2, 0.3) : 0; fail = i === 2 ? env(t, T.sfail + 0.4, T.noRe) : 0; }
    const dim = env(t, T.crash + 1.0, T.back6 - 0.2);
    return {done, fail, dim};
  };
  const idx: Obj = {x: 1100, y: 800, w: lw(['Índice'], 32, 30) + 140, h: 100, o: k(T.half) * (1 - X([[T.wf, 0], [T.wf + 0.6, 1]]))};
  idx.hot = env(t, T.wrong, T.wf); idx.hc = RED;
  const plat = [{n: 'Cloudflare Workflows', at: T.cfwf}, {n: 'AWS Step Functions', at: T.sfn}, {n: 'GCP Workflows', at: T.gwf}].map((p, i) => {
    const w = 2 * 26 + (i === 0 ? 34 + 18 : 0) + measure(p.n, 28);
    const s = k(p.at, 0.5) * (1 - k(T.report + i * 0.08, 0.4));
    return {...p, o: {x: [560, 1000, 1400][i], y: 800, w: w * Math.max(s, 0.001), h: 90 * Math.max(s, 0.001), o: s > 0.02 ? 1 : 0} as Obj, s};
  });

  return (<AbsoluteFill>
    {/* fios da corrida */}
    <Wire a={cl} b={W1} draw={k(T.two + 0.3, 0.5)} undraw={k(T.dO - 0.3, 0.3)} sigs={[sig(T.two + 0.9, BLUE)]} />
    <Wire a={cu} b={W2} draw={k(T.two + 0.4, 0.5)} undraw={k(T.dO - 0.3, 0.3)} sigs={[sig(T.two + 1.0, BLUE)]} />
    <CWire a={W1} b={NOTE} draw={k(T.read - 0.3, 0.5)} undraw={k(T.dO - 0.3, 0.3)} sigs={[sig(T.read + 0.4, D.sand, true), sig(T.w1 + 0.3, BLUE)]} />
    <CWire a={W2} b={NOTE} draw={k(T.read - 0.2, 0.5)} undraw={k(T.dO - 0.3, 0.3)} sigs={[sig(T.read + 0.5, D.sand, true), sig(T.w2 + 0.3, RED)]} />
    {/* fios do DO: direto (todo pedido cai nele) → depois pela fila */}
    <CWire a={cl} b={w1} draw={k(T.falls, 0.5)} undraw={k(T.queue - 0.6, 0.4)} sigs={[sig(T.falls + 0.6, BLUE), sig(T.oneAt, BLUE)]} />
    <CWire a={cu} b={w1} draw={k(T.falls + 0.1, 0.5)} undraw={k(T.queue - 0.6, 0.4)} sigs={[sig(T.falls + 0.7, BLUE), sig(T.oneAt + 0.9, BLUE)]} />
    <CWire a={cl} b={qu} draw={k(T.queue, 0.4)} undraw={k(T.time, 0.3)} sigs={[sig(T.queue + 0.3, BLUE)]} />
    <CWire a={cu} b={qu} draw={k(T.queue + 0.1, 0.4)} undraw={k(T.time, 0.3)} sigs={[sig(T.queue + 0.4, BLUE)]} />
    <Wire a={qu} b={w1} draw={k(T.queue + 0.2, 0.4)} undraw={k(T.time, 0.3)} sigs={[sig(T.q1, BLUE), sig(T.q2, BLUE)]} />
    <CWire a={w1} b={NOTE} draw={k(T.state + 0.6, 0.4)} undraw={k(T.time, 0.3)} sigs={[sig(T.q1 + 0.6, BLUE), sig(T.q2 + 0.4, D.sand, true), sig(T.q2 + 1.0, BLUE)]} />
    <CWire a={cl} b={do2} draw={k(T.convDO + 0.6, 0.5)} undraw={k(T.time, 0.3)} sigs={[sig(T.convDO + 1.4, BLUE)]} />
    <CWire a={cl} b={w1} draw={k(T.q2 + 1.6, 0.5)} undraw={k(T.time, 0.3)} sigs={[sig(T.mine + 0.6, BLUE)]} />
    <CWire a={cu} b={w1} draw={k(T.q2 + 1.7, 0.5)} undraw={k(T.time, 0.3)} sigs={[sig(T.perKey, BLUE)]} />
    {/* fios da indexação */}
    <Wire a={NOTE} b={steps[0]} draw={k(T.index + 0.6, 0.4)} undraw={k(T.report, 0.3)} />
    {steps.slice(1).map((s, i) => <Wire key={i} a={steps[i]} b={s} draw={k(T.index + 0.9 + i * 0.12, 0.3)} undraw={i >= 3 ? k(T.report, 0.3) : 0} sigs={[sig(T.cost + 0.4 + i * 0.5, BLUE)]} />)}

    {/* fantasmas */}
    {ghosts.map((g, i) => g.s > 0.02 && <Box key={i} s={{x: g.x, y: g.y, w: 200 * g.s, h: 80 * g.s, o: 1}}>{g.s > 0.6 && <LogoSvg n="cloudflare" s={30} />}</Box>)}

    {/* nota / armazenamento / fonte */}
    <Box s={NOTE}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 1 - k(T.pipe - 0.3, 0.3)}}>
        <Server size={34} color={G.g1} strokeWidth={1.6} /><Glyphs text="Servidor de notas" at={T.srv} size={32} /></div>
      <div style={{position: 'absolute', left: 24, top: 18, right: 24, opacity: rowsO}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
          {stor > 0.5 ? <Database size={26} color={G.g2} strokeWidth={1.7} /> : <Server size={26} color={G.g2} strokeWidth={1.7} />}
          <Roll size={28} steps={[[0, 'Pipeline'], [T.state + 0.5, 'Estado · Pipeline']]} color={G.g2} /></div>
        {['Atlas', 'Nimbus', 'Orbit', 'r4', 'r5'].map((n, i) => {
          const h = i < 3 ? 1 : i === 3 ? Math.min(1, r4) : r5; if (h < 0.02) return null;
          const lost = i === 3 ? env(t, T.lost, T.lost + 2.2) : 0, fresh = i >= 3 ? env(t, i === 3 ? (t < T.again ? T.w1acme : T.four) : T.five, (i === 3 ? (t < T.again ? T.w1acme : T.four) : T.five) + 1.6) : 0;
          return <div key={i} style={{height: 44 * h, marginBottom: 12 * h, overflow: 'hidden', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 16px',
            background: `color-mix(in srgb, ${lost > 0.01 ? RED : GREEN} ${Math.round(28 * Math.max(lost, fresh))}%, ${G.g5})`, border: `1.5px solid color-mix(in srgb, ${lost > 0.01 ? RED : GREEN} ${Math.round(100 * Math.max(lost, fresh))}%, ${G.g4})`}}>
            {i < 3 ? <Glyphs text={n} at={T.pipe + 0.4 + i * 0.1} size={26} /> : i === 3 ? <Roll size={26} steps={row4Label} /> : <Glyphs text="Bolt" at={T.five - 0.2} size={26} />}
          </div>;
        })}
      </div>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: k(T.time + 1.4, 0.4)}}>
        <Database size={34} color={G.g1} strokeWidth={1.6} /><Glyphs text="Notas · 2.000" at={T.time + 1.4} size={34} /></div>
    </Box>

    {/* clientes */}
    <Box s={cl}><LogoSvg n="claude" s={40} /><Glyphs text="Claude" at={T.agent} size={38} /></Box>
    <Box s={cu}><LogoSvg n="cursor" s={40} /><Glyphs text="Cursor" at={T.cursor} size={38} /></Box>
    {/* rótulos dos pedidos */}
    <div style={{position: 'absolute', left: 560, width: 260, top: 300, textAlign: 'center', opacity: k(T.acme) * (1 - k(T.dO - 0.4, 0.3))}}><Glyphs text="+ Acme" at={T.acme} out={T.dO - 0.4} size={28} mono color={BLUE} weight={500} /></div>
    <div style={{position: 'absolute', left: 560, width: 260, top: 620, textAlign: 'center', opacity: k(T.bolt) * (1 - k(T.dO - 0.4, 0.3))}}><Glyphs text="+ Bolt" at={T.bolt} out={T.dO - 0.4} size={28} mono color={BLUE} weight={500} /></div>

    {/* workers / DO */}
    <Box s={W2}><LogoSvg n="cloudflare" s={40} /><Roll size={34} steps={[[0, 'Worker'], [T.read + 0.6, '3 deals'], [T.w2bolt, '3 + Bolt']]} /></Box>
    <Box s={w1}><LogoSvg n="cloudflare" s={40} /><Roll size={34} steps={[[0, 'Worker'], [T.read + 0.6, '3 deals'], [T.w1acme, '3 + Acme'], [T.dO + 0.3, 'Durable Object'], [T.pipeName, 'DO · Pipeline']]} /></Box>

    {/* fila */}
    <Box s={qu}><div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {['+ Acme', '+ Bolt'].map((c, i) => { const leave = k((i === 0 ? T.q1 : T.q2) - 0.2, 0.4); return <div key={c} style={{fontFamily: MONO, fontSize: 26, color: BLUE, opacity: k(T.queue + 0.2 + i * 0.15) * (1 - leave), transform: `scale(${1 - 0.6 * leave})`}}>{c}</div>; })}
    </div></Box>
    <Box s={do2}><LogoSvg n="claude" s={34} /><Glyphs text="Conversa" at={T.convDO + 0.5} size={34} /></Box>
    <Box s={eq}><div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
      {eqLines.map((l, i) => <Glyphs key={l} text={l} at={i === 0 ? T.aws + 0.3 : T.gcp} size={24} mono color={G.g1} weight={400} step={0.012} />)}
    </div></Box>

    {/* passos */}
    {steps.map((s, i) => { const st = state(i); const c = st.fail > 0.01 ? RED : GREEN;
      const label = t > T.report && i < 4;
      const named = i < 4 ? env(t, [at('ler,', T.ten), at('dividir'), at('gerar embeddings'), at('gravar no')][i], [at('ler,', T.ten), at('dividir'), at('gerar embeddings'), at('gravar no')][i] + 1.0) : 0;
      const work = t > T.cost && t < T.run ? env(t, T.cost + 0.9 + (i - 1) * 0.5, T.cost + 1.4 + (i - 1) * 0.5) : 0;
      const hb = Math.max(named, work);
      return <Box key={i} s={{...s, hot: Math.max(st.done * 0.7, st.fail, hb), hc: hb > 0.01 && st.done < 0.5 && st.fail < 0.01 ? BLUE : c, o: (s.o ?? 1) * (1 - 0.65 * st.dim)}}>
        {st.fail > 0.5 ? <XIcon size={26} color={RED} strokeWidth={2.2} /> : st.done > 0.5 ? <Check size={26} color={GREEN} strokeWidth={2.4} /> : null}
        {label ? <Roll size={30} steps={[[0, String(i + 1)], [[T.crm, T.mails, T.sum, T.write][i], RL[i]]]} /> : <span style={{fontFamily: MONO, fontSize: 30, color: G.g1}}>{i + 1}</span>}
      </Box>; })}
    {/* rótulos sob o passo 6 (timeout / esperas) */}
    <div style={{position: 'absolute', left: SX(5) - 120, width: 240, top: 610, textAlign: 'center', opacity: Math.max(env(t, T.timeout, T.restart), env(t, T.r1 - 0.3, T.crash)) * (t < T.report ? 1 : 0)}}>
      <Roll size={28} steps={[[0, 'timeout'], [T.r1, 'espera 1 s'], [T.r2, 'espera 2 s'], [T.r4, 'espera 4 s']]} color={RED} />
    </div>
    <div style={{position: 'absolute', left: SX(2) - 160, width: 320, top: 610, textAlign: 'center', opacity: env(t, T.pay, T.half) * (t < T.wf ? 1 : 0)}}>
      <Glyphs text="pago 2×" at={T.pay} out={T.half} size={28} mono color={RED} weight={500} />
    </div>
    {/* índice pela metade */}
    {(idx.o ?? 0) > 0.02 && <Box s={idx}><Database size={30} color={G.g1} strokeWidth={1.6} /><Glyphs text="Índice" at={T.half} size={32} />
      <div style={{width: 120, height: 12, borderRadius: 3, background: G.g5, overflow: 'hidden'}}><div style={{width: `${50 * k(T.half + 0.4, 0.6)}%`, height: '100%', background: RED}} /></div></Box>}
    {/* plataformas */}
    {plat.map((p, i) => p.s > 0.02 && <Box key={p.n} s={p.o}>{p.s > 0.98 && <>{i === 0 && <LogoSvg n="cloudflare" s={34} />}<Glyphs text={p.n} at={p.at + 0.2} size={28} /></>}</Box>)}

    {/* título */}
    <div style={{position: 'absolute', left: 0, width: W, top: 110, textAlign: 'center', opacity: Math.max(k(T.race, 0.3) * (1 - k(T.dO - 0.3, 0.3)), k(T.dO + 2.6, 0.3) * (1 - k(T.time - 0.3, 0.3)), k(T.ten, 0.3) * (1 - k(T.wf - 0.3, 0.3)), k(T.wf + 2.6, 0.3))}}>
      <Roll size={52} steps={[[T.race, 'Condição de corrida'], [T.dO + 2.6, 'Durable Object'], [T.ten, 'Tarefa de 10 passos'], [T.wf + 2.6, 'Workflow durável'], [T.report, 'Relatório semanal'], [T.fin[0], 'Um dono pra cada estado.'], [T.fin[1], 'E cada passo guardado.']]} colorAt={[T.fin[1], D.sand]} />
    </div>

    <Reveal at={T.dO + 0.2} dur={2.2} term="Durable Object" def="um nome, uma instância, um pedido de cada vez" />
    <Reveal at={T.wf + 0.3} dur={2.2} term="Workflow durável" def="cada passo guardado, retoma de onde parou" />
  </AbsoluteFill>);
};

export const SCENES: Scene[] = [
  {from: 0, to: END, C: Main, cues: [...revealCues(T.dO + 0.2), ...revealCues(T.wf + 0.3), [T.lost, 'alert', 0.45], [T.timeout, 'alert', 0.4]] as Cue[]},
];
export const DUR = END;
export const Stage = makeStage('current.mp3', SCENES);
export const Poster = makePoster('LESSON', 'Estado e tarefas longas', 'Durable Objects e workflows duráveis');
