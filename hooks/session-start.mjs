#!/usr/bin/env node
// Hook SessionStart: abre a sessão com os dois passos que cabem ao usuário, em fonte grande e colorida.
// Os outros dois (revisar, guardar a lição) são lembretes só para o agente.
// Não usa rede nem TYPESAFE_API_KEY. Desligar: DEVKIT_BANNER=off. Sem cor: DEVKIT_BANNER_COLOR=off
// Saída: systemMessage (o que o usuário vê) + additionalContext (o que o agente lê).

if (process.env.DEVKIT_BANNER === 'off') process.exit(0);

const PASSOS = [
  ['Escolha uma tarefa limitada', 'Escolha um trabalho com um final claro e um resultado que você consiga conferir. Mantenha a primeira mudança pequena o bastante pra revisar.'],
  ['Escreva as restrições', 'Diga ao agente o que precisa continuar verdadeiro, quais comandos verificam o trabalho e no que ele não deve mexer.'],
];

const COR = process.env.DEVKIT_BANNER_COLOR === 'off' ? ['', '', ''] : ['\x1b[1;38;5;214m', '\x1b[38;5;180m', '\x1b[0m'];
const [AMBAR, SUAVE, FIM] = COR;

// Fonte 3x5 em blocos. Cada glifo: 5 linhas de 3 colunas ('#' = cheio).
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
  'Início de sessão (claude-devkit). O usuário acabou de ver na tela: (1) escolha uma tarefa limitada e (2) escreva as restrições. Se o primeiro pedido dele for grande ou vago, ajude a limitar e grave as restrições (o que precisa continuar verdadeiro, comandos de verificação, no que não mexer) no AGENTS.md do projeto. Dois lembretes só para você: (3) entregue a mudança de forma que uma pessoa revise o diff e rode as verificações; ela continua responsável por aceitar; (4) toda falha corrigida vira um teste ou uma regra escrita para a próxima sessão. Não repita estes avisos ao usuário.';

process.stdout.write(
  JSON.stringify({
    systemMessage: tela,
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: contexto },
  }),
);
process.exit(0);
