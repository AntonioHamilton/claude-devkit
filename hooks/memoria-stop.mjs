#!/usr/bin/env node
// Hook Stop: se o usuário corrigiu ou revelou preferência neste turno e nada foi gravado, pede ao agente para gravar na ai-memory.
// Sem rede. Barra no máximo uma vez por turno (stop_hook_active). Desligar: DEVKIT_MEMORIA=off
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
  (l) => l.type === 'assistant' && blocos(l.message).some((b) => b.type === 'tool_use' && /ai-memory|\.claude[\\/]+memory/i.test(JSON.stringify(b.input ?? {}))),
);
if (jaGravou) process.exit(0);

process.stdout.write(
  JSON.stringify({
    decision: 'block',
    reason:
      'O usuário corrigiu, confirmou uma abordagem ou revelou uma preferência neste turno e nada foi gravado. Se isso muda como você deve trabalhar, grave agora com `ai-memory salvar` (uma linha, sem pedir ok). Se não muda, encerre sem gravar.',
  }),
);
