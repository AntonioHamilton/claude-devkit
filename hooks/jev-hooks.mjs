#!/usr/bin/env node
// Hooks globais do Claude Code que usam o Jev (TypeSafe) para decisões pequenas e baratas.
// Uso: node jev-hooks.mjs <filtro-saida|roteador|guarda-bash>   (JSON do hook no stdin)
// Sem TYPESAFE_API_KEY, sem rede ou com qualquer erro: sai 0 sem alterar nada (a sessão segue normal).
// Envia à TypeSafe: prompts (roteador), comandos Bash de aparência arriscada (guarda) e texto de
// páginas da web (filtro), com segredos mascarados. Desligar tudo: JEV_HOOKS=off

const API = 'https://api.typesafe.ai/v1/systemone';
const MODELO = 'jev-latest';
const TIMEOUT_MS = 4000;

const SEGREDOS = [
  /\b(?:sk|pk|ts|ghp|gho|xox[bp]|AKIA)[-_A-Za-z0-9]{16,}\b/g,
  /\b(?:password|passwd|senha|secret|token|api[_-]?key|authorization)\s*[=:]\s*\S+/gi,
  /\bBearer\s+[A-Za-z0-9._~+/-]{16,}/g,
  /\b[A-Fa-f0-9]{32,}\b/g,
];
const mascarar = (s) => SEGREDOS.reduce((t, re) => t.replace(re, '[segredo]'), s);

async function julgar(state, questions) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODELO, state, questions }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!r.ok) throw new Error(`TypeSafe ${r.status}`);
  return (await r.json()).answers;
}

async function lerEntrada() {
  let s = '';
  for await (const parte of process.stdin) s += parte;
  return JSON.parse(s);
}

const saida = (obj) => process.stdout.write(JSON.stringify(obj));

// ---------- filtro-saida: PostToolUse em WebFetch e jev-browser ----------

const MIN_CHARS_FILTRAR = 6000;
const TAMANHO_BLOCO = 1500;
const LIMIAR_BLOCO = 0.5;
const GANHO_MINIMO = 0.2;
const SIMULTANEAS = 8;

function blocos(texto) {
  const limpo = texto.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  const out = [];
  for (let i = 0; i < limpo.length; i += TAMANHO_BLOCO) out.push(limpo.slice(i, i + TAMANHO_BLOCO));
  return out;
}

async function filtrarTexto(texto, objetivo) {
  if (texto.length < MIN_CHARS_FILTRAR) return null;
  const partes = blocos(texto);
  const notas = new Array(partes.length);
  let proximo = 0;
  const trabalhador = async () => {
    while (proximo < partes.length) {
      const i = proximo++;
      const a = await julgar(
        { objetivo: mascarar(objetivo), texto: mascarar(partes[i]) },
        {
          util: {
            type: 'noul',
            instructions: 'O texto traz informação que ajuda a cumprir o objetivo?',
            criteria: {
              true: 'Contém fatos, dados, argumentos ou citações relevantes para o objetivo',
              false: 'Menu, navegação, propaganda, rodapé, aviso de cookies ou assunto sem relação com o objetivo',
            },
          },
        },
      );
      notas[i] = a.util.noul;
    }
  };
  await Promise.all(Array.from({ length: Math.min(SIMULTANEAS, partes.length) }, trabalhador));

  const mantidos = partes.filter((_, i) => notas[i] >= LIMIAR_BLOCO);
  const filtrado = mantidos.join('\n');
  if (!mantidos.length || filtrado.length > texto.length * (1 - GANHO_MINIMO)) return null;
  return `${filtrado}\n\n[jev: ${mantidos.length} de ${partes.length} blocos mantidos por relevância]`;
}

// aplica fn a cada texto da resposta, preservando o formato original; devolve null se nada mudou
async function mapearResposta(resp, fn) {
  if (typeof resp === 'string') return await fn(resp);
  if (!resp || typeof resp !== 'object') return null;
  if (Array.isArray(resp.content)) {
    let mudou = false;
    const content = await Promise.all(
      resp.content.map(async (c) => {
        if (c?.type !== 'text' || typeof c.text !== 'string') return c;
        const novo = await fn(c.text);
        if (novo === null) return c;
        mudou = true;
        return { ...c, text: novo };
      }),
    );
    return mudou ? { ...resp, content } : null;
  }
  for (const campo of ['result', 'text', 'content']) {
    if (typeof resp[campo] === 'string') {
      const novo = await fn(resp[campo]);
      return novo === null ? null : { ...resp, [campo]: novo };
    }
  }
  return null;
}

async function filtroSaida(e) {
  const entrada = e.tool_input ?? {};
  const objetivo = entrada.prompt ?? entrada.task ?? '';
  if (!objetivo) return;
  const novo = await mapearResposta(e.tool_response, (t) => filtrarTexto(t, objetivo));
  if (novo === null) return;
  saida({ hookSpecificOutput: { hookEventName: 'PostToolUse', updatedToolOutput: novo } });
}

// ---------- roteador: UserPromptSubmit ----------

const DICAS = {
  simples: '[jev] Pedido simples: responda direto e curto, sem explorar o repositório nem abrir subagents.',
  grande: '[jev] Pedido grande (várias partes ou arquivos): planeje antes de editar e divida em etapas; considere /manager.',
};

async function roteador(e) {
  const prompt = (e.prompt ?? '').trim();
  if (prompt.length < 3 || prompt.startsWith('/')) return;
  const a = await julgar(
    { pedido: mascarar(prompt.slice(0, 4000)) },
    {
      porte: {
        type: 'choice',
        instructions: 'Qual o porte do trabalho que este pedido exige de um assistente de programação?',
        criteria: {
          simples: 'Pergunta direta, explicação curta, confirmação ou ajuste trivial de uma linha; nenhuma investigação necessária',
          normal: 'Tarefa comum: corrigir um bug, editar um arquivo, investigar algo específico',
          grande: 'Feature nova, refatoração ampla, mudança em vários arquivos ou módulos, ou trabalho com várias etapas',
        },
      },
    },
  );
  const { choice, confidence } = a.porte;
  if (choice === 'normal' || confidence < 0.8) return;
  saida({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: DICAS[choice] } });
}

// ---------- guarda-bash: PreToolUse em Bash ----------

const PARECE_RISCO =
  /\b(rm|rmdir|del|erase|rd|mv|truncate|shred|dd|mkfs|format|kill|killall|pkill|chmod|chown|drop|delete|reset|clean|checkout|restore|stash|rebase|push|force|Remove-Item|Clear-Content|Stop-Process)\b|--force|\s-f\b|>\s*\S/i;
const LIMIAR_RISCO = 0.9;

async function guardaBash(e) {
  const comando = e.tool_input?.command ?? '';
  if (!comando || !PARECE_RISCO.test(comando)) return;
  const a = await julgar(
    { comando: mascarar(comando.slice(0, 2000)) },
    {
      destrutivo: {
        type: 'noul',
        instructions: 'Este comando de shell apaga, sobrescreve ou altera de forma difícil de reverter dados, histórico git ou sistemas compartilhados?',
        criteria: {
          true: 'Apaga arquivos fora de pastas de build/cache, sobrescreve dados, reescreve histórico git, força push, derruba processos ou altera sistema compartilhado',
          false: 'Só lê, lista, cria, compila, testa, ou apaga apenas artefatos regeneráveis (node_modules, dist, build, cache, temporários)',
        },
      },
    },
  );
  if (a.destrutivo.noul < LIMIAR_RISCO) return;
  saida({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: `[jev] Comando provavelmente destrutivo (${Math.round(a.destrutivo.noul * 100)}%): confirme antes de rodar.`,
    },
  });
}

// ---------- main ----------

const MODOS = { 'filtro-saida': filtroSaida, roteador, 'guarda-bash': guardaBash };

try {
  if (process.env.JEV_HOOKS === 'off' || !process.env.TYPESAFE_API_KEY) process.exit(0);
  const modo = MODOS[process.argv[2]];
  if (modo) await modo(await lerEntrada());
} catch {
  // falha aberta: o hook nunca atrapalha a sessão
}
process.exit(0);
