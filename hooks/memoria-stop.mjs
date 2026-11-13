#!/usr/bin/env node
// Stop hook: if the user corrected you or revealed a preference this turn and nothing was saved, asks the agent to save it to devkit-memory.
// No network. Blocks at most once per turn (stop_hook_active). Turn off: DEVKIT_MEMORIA=off
import fs from 'node:fs';

if (process.env.DEVKIT_MEMORIA === 'off') process.exit(0);

const SINAL =
  /\b(n[aã]o fa[cç]a assim|n[aã]o era isso|errado|de novo|prefiro|sempre que|nunca (mais )?(fa[cç]a|use|rode)|para de|pare de|lembre|anota|guarda isso|a partir de agora|daqui pra frente|isso mesmo|era isso|perfeito, continue)\b/i;

let entrada;
try {
  let s = '';
  for await (const parte of process.stdin) s += parte;
  entrada = JSON.parse(s);
} catch {
  process.exit(0);
}
if (entrada.stop_hook_active || !entrada.transcript_path) process.exit(0);

let linhas;
try {
  linhas = fs.readFileSync(entrada.transcript_path, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
} catch {
  process.exit(0);
}

const blocos = (m) => (Array.isArray(m?.content) ? m.content : [{ type: 'text', text: String(m?.content ?? '') }]);
const textoUsuario = (m) =>
  blocos(m)
    .filter((b) => b.type === 'text')
    .map((b) => b.text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, ''))
    .join(' ')
    .trim();

let inicio = -1;
for (let i = linhas.length - 1; i >= 0; i--) {
  const l = linhas[i];
  if (l.type === 'user' && textoUsuario(l.message)) {
    inicio = i;
    break;
  }
}
if (inicio < 0) process.exit(0);

const turno = linhas.slice(inicio);
if (!SINAL.test(textoUsuario(turno[0].message))) process.exit(0);

const jaGravou = turno.some(
  (l) => l.type === 'assistant' && blocos(l.message).some((b) => b.type === 'tool_use' && /devkit-memory|\.claude[\\/]+memory/i.test(JSON.stringify(b.input ?? {}))),
);
if (jaGravou) process.exit(0);

process.stdout.write(
  JSON.stringify({
    decision: 'block',
    reason:
      'The user corrected you, confirmed an approach, or revealed a preference in this turn, and nothing was saved. If that changes how you should work, save it now with `devkit-memory salvar` (one line, no need to ask). If it does not, end without saving.',
  }),
);
