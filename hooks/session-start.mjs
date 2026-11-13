#!/usr/bin/env node
// SessionStart hook: opens the session with the two steps that belong to the user, in large colored font.
// The other two (review, save the lesson) are reminders for the agent only.
// Uses no network. Turn off: DEVKIT_BANNER=off. No color: DEVKIT_BANNER_COLOR=off
// Output: systemMessage (what the user sees) + additionalContext (what the agent reads).

if (process.env.DEVKIT_BANNER === 'off') process.exit(0);

const PASSOS = [
  ['Choose one limited job', 'Pick a job with a clear end and a result you can check. Keep the first change small enough to review.'],
  ['State the constraints', 'Tell the agent what must stay true, which commands verify the work, and what it must not touch.'],
];

const COR = process.env.DEVKIT_BANNER_COLOR === 'off' ? ['', '', ''] : ['\x1b[1;38;5;214m', '\x1b[38;5;180m', '\x1b[0m'];
const [AMBAR, SUAVE, FIM] = COR;

// 3x5 block font. Each glyph: 5 rows of 3 columns ('#' = filled).
const G = {
  A: ['###', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'],
  C: ['###', '#..', '#..', '#..', '###'], D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'],
  G: ['###', '#..', '#.#', '#.#', '###'], H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'], J: ['..#', '..#', '..#', '#.#', '###'],
  L: ['#..', '#..', '#..', '#..', '###'], M: ['#.#', '###', '###', '#.#', '#.#'],
  N: ['##.', '#.#', '#.#', '#.#', '#.#'], O: ['###', '#.#', '#.#', '#.#', '###'],
  P: ['###', '#.#', '###', '#..', '#..'], Q: ['###', '#.#', '#.#', '###', '..#'],
  R: ['###', '#.#', '##.', '#.#', '#.#'], S: ['###', '#..', '###', '..#', '###'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Z: ['###', '..#', '.#.', '#..', '###'],
};
const LARGURA_MAX = 96;

const semAcento = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

function quebrar(palavras) {
  const larg = (ws) => ws.join(' ').length * 4;
  const linhas = [];
  let atual = [];
  for (const p of palavras) {
    if (atual.length && larg([...atual, p]) > LARGURA_MAX) {
      linhas.push(atual);
      atual = [];
    }
    atual.push(p);
  }
  if (atual.length) linhas.push(atual);
  return linhas.map((l) => l.join(' '));
}

function grande(titulo) {
  const out = [];
  for (const linha of quebrar(semAcento(titulo).split(' '))) {
    for (let r = 0; r < 5; r++) {
      out.push(
        [...linha].map((c) => (c === ' ' ? '   ' : (G[c] ?? G.O)[r].replace(/#/g, '█').replace(/\./g, ' '))).join(' ').trimEnd(),
      );
    }
    out.push('');
  }
  return out;
}

const tela = ['', ...PASSOS.flatMap(([t, d], i) => [`  ${AMBAR}${i + 1}.${FIM}`, ...grande(t).map((l) => `  ${AMBAR}${l}${FIM}`), `  ${SUAVE}${d}${FIM}`, ''])].join('\n');

const contexto =
  'Session start (claude-devkit). The user has just seen on screen: (1) choose one limited job and (2) state the constraints. If their first request is big or vague, help narrow it and write the constraints (what must stay true, verification commands, what not to touch) into the project AGENTS.md. Two reminders for you only: (3) deliver the change so a person can review the diff and run the checks; that person remains responsible for accepting it; (4) every fixed failure becomes a test or a rule written for the next session. Do not repeat these notices to the user.';

process.stdout.write(
  JSON.stringify({
    systemMessage: tela,
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: contexto },
  }),
);
process.exit(0);
