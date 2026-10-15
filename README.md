# claude-devkit

Kit de skills, agents, scripts e MCP para desenvolvimento assistido por IA. Funciona no Claude Code e, com adaptação de caminho, em qualquer harness que leia arquivos de instrução.

Este README é o **manual de instalação executável**: um agent lê este arquivo e instala tudo sem precisar de mais nada.

---

## PARA A IA: como instalar

Quando o usuário disser algo como "leia o README e instala tudo", execute exatamente os passos abaixo, na ordem. Não pule verificação. Não invente caminho.

### Passo 0 — Confirmar o destino

O destino padrão é a pasta de configuração do usuário:

| Sistema | Destino |
|---|---|
| Windows | `%USERPROFILE%\.claude` |
| macOS / Linux | `~/.claude` |

Para instalar só no projeto atual (e não global), o destino vira `<projeto>/.claude`. **Pergunte ao usuário qual dos dois antes de copiar** se ele não tiver dito.

### Passo 1 — Rodar o instalador

Windows (PowerShell):

```powershell
.\install.ps1
```

macOS / Linux / Git Bash:

```bash
./install.sh
```

Opções: `--dry-run` (mostra o que faria, não copia), `--force` (sobrescreve, guardando `.bak` do que existia), `--no-hooks` / `-NoHooks` (não instala os hooks do Jev, ver Passo 5b), `--no-rules` / `-NoRules` (não importa as regras de ouro, ver Passo 5c), `--link-agents` / `-LinkAgents` (liga as skills em Codex, OpenCode, Kimi e `~/.agents`, ver "Outros agentes"), `--dest <caminho>` / `-Dest <caminho>` (destino alternativo).

O instalador **nunca sobrescreve sem `--force`**. Ele imprime três listas: instalado, pulado (já existia), pendente (skill sem `SKILL.md`).

### Passo 2 — Ler a saída e reportar

Repasse ao usuário as três listas. Item em "pulado" precisa de decisão dele: manter o que já existe ou rodar de novo com `--force`. **Não decida sozinho** — sobrescrever skill que ele já usa é ação difícil de reverter.

### Passo 3 — MCP do Chrome

O instalador não mexe em MCP. Abra `mcp/README.md` e siga a opção A (extensão Claude in Chrome, preferida no Claude Code) ou a opção B (`chrome-devtools-mcp` via npx, portátil). Pergunte ao usuário qual ele quer.

### Passo 4 — RTK (obrigatório)

RTK faz parte do kit, não é extra. Sem ele o devkit trabalha via Bash (regra de auto mode) pagando o preço cheio de cada saída de comando. Siga `tools/rtk.md`: instalar o binário, garantir `ripgrep` no PATH e rodar `rtk init -g`.

Antes de rodar `rtk init -g`, **diga ao usuário o que o comando faz**: escreve um hook `PreToolUse` global no `~/.claude/settings.json`, valendo para todas as sessões dele, não só para este projeto. Rode em seguida — a etapa não é opcional —, mas ele precisa saber o que mudou na config. O hook é global mesmo em instalação só de projeto; se o usuário recusar essa escrita, pare e reporte a instalação como incompleta em vez de seguir em silêncio.

### Passo 4b — Vault da memória (pergunte)

Pergunte ao usuário o caminho do vault do Obsidian onde a memória compartilhada vai ficar (`<vault>/_memoria/devkit/`). Grave em `~/.claude/memory/config.md` (`vault: <caminho>`), confirmando que a pasta existe. Se ele não quiser vault, a memória fica só em `~/.claude/memory/`.

### Passo 4c — OpenUI (opcional)

Pergunte se o usuário quer o OpenUI no projeto atual. Se sim, siga `tools/openui.md`.

### Passo 5 — Effort da sessão principal

Cada subagent declara `model` e `effort` no próprio frontmatter — não há nada a instalar para eles. A **spec**, porém, é escrita pelo manager rodando como sessão principal, e ali frontmatter não vale: quem manda é o `~/.claude/settings.json`.

Antes de escrever, **leia o `settings.json` atual, mostre ao usuário o que vai mudar e peça ok**. Faça *merge* — nunca sobrescreva o arquivo, ele já tem o hook do RTK e provavelmente outras chaves.

```json
{
  "modelSettings": {
    "claude-sonnet-5": { "effort": "high" }
  }
}
```

Só essa entrada. **Não escreva `model` nem `effortLevel`**: esse arquivo vale para todas as sessões do usuário, em todo projeto, e o kit não decide o modelo do trabalho dele fora do devkit. Quem escolhe o modelo continua sendo ele, no `/model`.

Os agents usam ID fixo (`claude-sonnet-5`, `claude-haiku-4-5`), não alias — quando sair geração nova de modelo, revise os quatro arquivos em `agents/` e esta entrada.

### Passo 5b — Hooks do Jev (já feito pelo instalador)

O instalador copia `hooks/jev-hooks.mjs` e `hooks/session-start.mjs` para `~/.claude/hooks/` e registra os hooks **globais** no `settings.json` (merge com backup em `.devkit-backups/`, nunca sobrescreve o arquivo): `UserPromptSubmit` (roteador de porte do pedido), `PreToolUse` em Bash (guarda de comando destrutivo, só pede confirmação) e `PostToolUse` em `WebFetch`/`jev-browser` (filtra blocos irrelevantes de saídas longas). Não precisam de agent: valem em toda sessão.

- Só agem se `TYPESAFE_API_KEY` existir no ambiente. Sem key (ou sem rede, ou com erro), saem sem fazer nada e a sessão segue normal.
- Com a key, enviam à TypeSafe: prompts, comandos Bash de aparência arriscada e texto de páginas lidas, com tokens e senhas mascarados. **Diga isso ao usuário** e ofereça `--no-hooks` / `-NoHooks` se ele não quiser.
- `JEV_HOOKS=off` desliga tudo sem desinstalar. Remover: `node hooks/merge-settings.mjs ~/.claude/settings.json ~/.claude/hooks/jev-hooks.mjs --remove`.
- Requer Node 22+; sem Node o instalador avisa e pula.

**Banner de início de sessão** (`session-start.mjs`): ao abrir (`startup` e `clear`), mostra em fonte grande e colorida (âmbar) dois passos, cada um com sua descrição: **escolha uma tarefa limitada** e **escreva as restrições**. Os outros dois (revise a mudança, guarde a lição) vão só como lembrete ao agente. Não usa rede nem key. `DEVKIT_BANNER=off` desliga; `DEVKIT_BANNER_COLOR=off` tira a cor.

### Passo 5c — Regras de ouro (já feito pelo instalador)

O instalador copia `rules/devkit-rules.md` para `~/.claude/devkit-rules.md` e acrescenta uma linha `@devkit-rules.md` ao fim do `~/.claude/CLAUDE.md` (backup em `.devkit-backups/`). **Diga ao usuário**: as regras valem em toda sessão dele (esforço proporcional, qualquer agent a qualquer hora, roteamento de modelo, `AGENTS.md`, memória, baixo consumo). Para remover, apague essa linha.

### Passo 6 — Verificar

```bash
ls ~/.claude/skills ~/.claude/agents        # bash
rtk --version && rtk init --show            # binário instalado e hook ligado
grep -A3 modelSettings ~/.claude/settings.json   # effort da sessão principal
```

```powershell
Get-ChildItem "$HOME\.claude\skills","$HOME\.claude\agents"   # powershell
rtk --version; rtk init --show
Select-String modelSettings "$HOME\.claude\settings.json"
```

Depois disso, reinicie a sessão do harness para ele carregar skills e agents novos. Confirme que `/manager` aparece e que os agents `scout`, `developer`, `reviewer` e `tester` estão listados. Se existir `~/.claude/agents/manager.md` de uma versão antiga, apague: o manager agora é só a skill.

### O que NÃO fazer na instalação

- Não copiar skill sem `SKILL.md` (pasta vazia = conteúdo pendente).
- Não editar skills que já existiam no destino.
- Não registrar MCP sem perguntar.
- Não tratar o RTK como extra: pular o passo 4 deixa a instalação incompleta.
- Não commitar nada no repositório do usuário como parte da instalação.

---

## Inventário

### Skills

| Skill | Origem | Papel |
|---|---|---|
| `grill-me` | interna | Entrevista o usuário até fechar toda decisão aberta do plano. Versão sem registro de `grill-with-docs`. |
| `grill-with-docs` | interna (ideia de [mattpocock/skills](https://github.com/mattpocock/skills/blob/main/docs/engineering/grill-with-docs.md)) | `grill-me` que também grava ADRs em `docs/adr/` para decisões difíceis de reverter. Etapa 3 do manager (modo completo). |
| `goal` | interna | Confere a implementação contra a spec e o objetivo. Etapa 6. |
| `doubt` | externa | Revisão adversarial antes de decisão difícil de reverter. Etapa 3 do manager (modo completo). |
| `simplify` | externa (alvo adaptado) | Simplifica a **spec e a explicação dada ao usuário**, não o código aprovado. Uso avulso. |
| `manager` | interna | A própria sessão vira o manager (nunca subagent) e conduz o pipeline de 7 etapas, em modo enxuto ou completo. |
| `ai-memory` | interna (desenho inspirado em [hanfang/claude-memory-skill](https://github.com/hanfang/claude-memory-skill)) | Memória persistente (no vault do Obsidian, com fallback em `~/.claude/memory/`; `/ai-memory consolidar` reorganiza e arquiva o lixo) do que muda **como** o Claude trabalha: preferência de código, decisão de spec, lição de pipeline. Lida na etapa 1, escrita na etapa 7. |
| `ai-effort` | interna | A IA decide sozinha o esforço (direto, enxuto ou completo) e o nível de teste. Vale mesmo sem `/manager`. |
| `jev-router` | interna | Regra de ouro: escolhe haiku, sonnet ou opus por tarefa delegada, com fallback, sem perguntar, avisando "modelo mudou para X". Com `TYPESAFE_API_KEY`, o hook do Jev injeta a sugestão. |
| `ai-stack` | interna | Projeto novo: 4 perguntas-chave (usuários, dados, segurança, plataforma) e sugestão de linguagem, banco e tipo de app, com referências de UI. |
| `ponytail-review` | externa ([DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)) | Revisão que só caça excesso de engenharia: o que dá pra deletar. Complementar ao `reviewer`. Só a pedido do usuário. |
| `caveman` | externa ([JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)) | Modo de resposta ultracomprimido — corta token de saída sem perder substância técnica. Opcional, ligado pelo usuário. |

| `reflect` | externa ([akitaonrails/my-skills](https://github.com/akitaonrails/my-skills)) | Revê o trabalho recente, acha padrões repetidos e sugere skills, regras ou configs novas. É o "guarde a lição" em forma de skill. |
| `verification-planning` | externa (my-skills) | Antes de implementar, planeja a evidência que prova que funciona. |
| `agent-browser` | externa (my-skills) | Automação de navegador por CLI (`npm i -g agent-browser && agent-browser install`). Serve ao `tester`. O texto diz "prefira agent-browser a qualquer navegador embutido": isso passa por cima do `jev-browser`; ligue só se quiser. |
| `clonedeps` | externa (my-skills) | Clona o código das dependências para ler como a biblioteca funciona por dentro. Bom para estudo. |
| `humanizer` | externa (my-skills; de blader/humanizer, MIT) | Tira o tom de texto gerado por IA. |
| `pr-bump` | externa (my-skills) | Funde PRs de bump do Dependabot com segurança. Só PR de bot, só dependência. |
| `improve-codebase-architecture` | externa (my-skills) | Acha oportunidades de aprofundar módulos, guiado por `CONTEXT.md` e `docs/adr/`. |
| `worktrees` | externa (my-skills) | Git worktrees como pistas isoladas para trabalho arriscado ou paralelo. |
| `release` | externa (my-skills) | Deriva a versão do changelog e publica a release seguindo a estratégia do repo. |
| `security-audit` | externa (my-skills) | Modelo de ameaça e auditoria de vulnerabilidades, com checklists e script de superfície. Nível completo do `ai-effort` quando houver login ou pagamento. |
| `deepwork` | externa (my-skills) | Orquestração cara para trabalho grande e de alto risco. Só por pedido explícito: gasta muito token. |
| `loop-engineering` | externa (my-skills) | Entrevista e monitor de loop com verificação. |
| `codemap` | externa (my-skills) | Mapa hierárquico de um repositório desconhecido. Caro: só por pedido explícito. |
| `fact-check` | externa (my-skills) | Checagem adversarial de artigos e ensaios: verifica cada afirmação em fontes primárias, com subagentes baratos em CLI headless. Dispara outros CLIs de agente (o padrão da config é grok, com passada final em claude) e pode gastar API paga: leia `skills/fact-check/references/harness-setup.md` antes de usar. |

As 14 skills acima são **cópias verbatim** de `akitaonrails/my-skills` (commit `2ae1eb8`), em inglês, com a origem no fim de cada arquivo. `clonedeps`, `codemap`, `worktrees`, `deepwork` e `loop-engineering` são forks do oh-my-opencode-slim e foram escritas para o runtime do OpenCode (agentes como oracle/observer, callbacks, pasta `.slim/`): no Claude Code funcionam como roteiro de trabalho, não como runtime. O repositório de origem não declara licença; só a `humanizer` traz a dela (MIT). Confira antes de redistribuir o devkit.

`ponytail-review` e `caveman` são **cópias verbatim do upstream**, em inglês, com a origem anotada no fim de cada arquivo. Não foram traduzidas de propósito: editar o corpo delas quebra a fidelidade e dificulta atualizar. O caveman responde no idioma em que você escreve, então em pt-BR ele responde em pt-BR.

**RTK não é skill.** É um binário Rust que comprime a saída dos comandos de shell antes de o agent ler. Fica em `tools/rtk.md`, com instalação própria: o `install.sh`/`install.ps1` não o instala, mas o passo 4 do README é obrigatório e cobre isso à mão.

#### Cuidado ao ligar o caveman

O `caveman` vale pra sessão inteira até o usuário dizer "stop caveman". Os agents deste kit (`scout`, `developer`, `reviewer`) têm formato de saída fixo — mantenha o formato e comprima só a prosa dentro dele. Ele já se desliga sozinho em aviso de segurança e em confirmação de ação irreversível, que é exatamente o Approval Gate e a etapa Ship.

### Agents

O manager **não é agent**: é a skill `manager`, que roda na sua sessão. Os agents abaixo são os subagents que ela (ou qualquer sessão, a qualquer hora) pode chamar. Modelos: scout `haiku`, developer/tester/reviewer `sonnet`; a regra `jev-router` ajusta por tarefa.

| Agent | Quem pode chamar | Permissão | Papel |
|---|---|---|---|
| `tester` | manager **ou** qualquer sessão | escrita (só testes e `AGENTS.md`) | Cria personas, testa como elas, registra achados e vira suíte de regressão no `AGENTS.md`. |
| `scout` | qualquer sessão | read-only | Reconhecimento de uma faceta do projeto. Máx. 2 por tarefa, em paralelo. |
| `developer` | qualquer sessão | escrita | Implementa **um estágio** da spec aprovada. Nada além do estágio. |
| `reviewer` | qualquer sessão | read-only | Revisa o que foi feito contra a spec. Também revisa PR. |

### Scripts

| Script | Usado em | O que faz |
|---|---|---|
| `scripts/new-branch.*` | etapa 2 (Branch) | Cria branch a partir da default. Aborta se houver mudança não commitada. |
| `scripts/checks.*` | etapa 10 (Gate 1) | Detecta npm/pnpm/yarn/bun, python, go ou rust e roda lint, typecheck, teste e build. |
| `scripts/open-pr.*` | etapa 12 (Ship) | Push da branch e `gh pr create`. Só depois do ok explícito do usuário. |

Cada um existe em `.sh` e `.ps1`.

### MCP

`chrome` — controle do navegador; `jev-browser` — leitura de páginas com o Jev. Ver `mcp/README.md`.

### Ferramentas externas

| Ferramenta | Onde | Instala junto? |
|---|---|---|
| `openspec` | `tools/openspec.md` | Não — `npm install -g @fission-ai/openspec@latest`, e `openspec init` por projeto, com ok do usuário. Etapa 6 do manager. |
| `openui` | `tools/openui.md` | Não — opcional, `npx @openuidev/cli@latest setup-agent` por projeto (escreve no `AGENTS.md`). Avise antes de rodar. |
| `rtk` | `tools/rtk.md` | Não pelo instalador — é o passo 4 do README, obrigatório e feito à mão. Binário separado + hook que escreve no `settings.json` do usuário; avise antes de rodar `rtk init -g`. |

---

## Outros agentes (Codex, OpenCode, Kimi)

O conhecimento do devkit é texto puro (`SKILL.md`, `AGENTS.md`, `rules/`). Uma pasta, todos os agentes: `--link-agents` / `-LinkAgents` cria links simbólicos por skill, apontando para `~/.claude/skills/<skill>`, em cada diretório que já existir:

| Agente | Diretório de skills |
|---|---|
| Compartilhado | `~/.agents/skills` |
| Codex | `~/.codex/skills` |
| OpenCode | `~/.config/opencode/skills` |
| Kimi | `~/.kimi-code/skills` |

Edição em uma skill chega a todos. Link por skill, não da pasta inteira, porque esses diretórios guardam entradas que não são do devkit; o instalador nunca sobrescreve link ou pasta existente. No Windows, symlink exige modo desenvolvedor ou admin; sem isso o instalador pula a skill. Reinicie o agente para ele ler as skills novas.

Fora do Claude Code: os **agents** (`scout`, `developer`, `reviewer`, `tester`) e os hooks são do Claude Code; a skill `manager` e as demais funcionam em qualquer harness que leia `SKILL.md`, usando os agents só se existirem. As regras de ouro: cole ou ligue `rules/devkit-rules.md` no `AGENTS.md` global do agente. Nos projetos, `AGENTS.md` é a fonte; o `CLAUDE.md` contém só `@AGENTS.md`.

---

## O pipeline do manager

Sete etapas, no modo **enxuto** (padrão) ou **completo** (dado real, auth, pagamento, migração, mudança difícil de reverter). A skill `ai-effort` escolhe o nível; tarefa simples nem passa pelo manager. O detalhe canônico está em `skills/manager/SKILL.md`.

| # | Etapa | Enxuto | Completo |
|---|---|---|---|
| 1 | Intake | Memória, `AGENTS.md` (cria se faltar), pedido reformulado | igual, mais `ai-stack` se for projeto novo |
| 2 | Recon | `rg` na própria sessão (ou 1 scout) | 1 a 2 scouts em paralelo |
| 3 | Plano | Checklist no chat | OpenSpec + grill só do difícil de reverter + `doubt` uma vez |
| 4 | Aprovação | Uma pergunta: plano + testes de regressão | igual |
| 5 | Implementação | A própria sessão | `developer` por estágio, commit por estágio |
| 6 | Validação | checks, `tester` (se quis), `goal`, em loop de até 3 voltas, e verificação humana | mais `reviewer` |
| 7 | Ship | PR com ok, `ai-memory salvar` | igual, arquiva a change |

Invariantes que não podem ser quebradas:

- Recon nunca é pulado (pode ser de 2 comandos).
- Nenhuma linha de código antes da aprovação (etapa 4).
- Máximo 2 scouts, sempre em paralelo, facetas ortogonais.
- Um developer por vez no mesmo código.
- Nada de PR antes da verificação humana ser respondida.
- PR e push só com ok explícito.

---

## Uso

```
/manager          # pipeline completo, do pedido até o PR
```

Chamar o reviewer direto, sem pipeline:

> "roda o reviewer no diff da branch" · "usa o reviewer no PR 42"

Memória:

```
/ai-memory salvar <observação>   # registra o que muda como o Claude deve trabalhar
/ai-memory buscar <termo>        # consulta por grep
/ai-memory ver                   # mostra o estado da memória
/ai-memory esquecer <tema>       # remove, com confirmação
```

Rodar uma skill isolada: `/grill-me`, `/grill-with-docs`, `/doubt`, `/simplify`.

---

## Desinstalar

Apagar do destino as skills e agents deste kit:

```bash
rm -rf ~/.claude/skills/{manager,ai-effort,jev-router,ai-stack,ai-memory,ponytail-review,caveman,grill-with-docs,fact-check,reflect,verification-planning,agent-browser,clonedeps,humanizer,pr-bump,improve-codebase-architecture,worktrees,release,security-audit,deepwork,loop-engineering,codemap}
rm -f ~/.claude/agents/{manager,scout,developer,reviewer,tester}.md ~/.claude/devkit-rules.md   # e a linha @devkit-rules.md do CLAUDE.md
```

`grill-me`, `doubt` e `simplify` podem já ser do usuário — confirme com ele antes de apagar. Apagar a skill `ai-memory` **não** apaga `~/.claude/memory/`: o conteúdo é do usuário e só sai se ele pedir. O que o `--force` sobrescreve vai para `~/.claude/.devkit-backups/<timestamp>/`, fora de `skills/` e `agents/` — backup dentro de `skills/` é carregado pelo harness como skill de verdade.

---

## Estrutura

```
claude-devkit/
├── README.md              ← este arquivo (manual de instalação)
├── install.sh / .ps1      ← instalador
├── skills/<nome>/SKILL.md
├── agents/<nome>.md
├── rules/devkit-rules.md  ← regras de ouro, importadas pelo CLAUDE.md
├── scripts/               ← new-branch, checks, open-pr (.sh e .ps1)
├── hooks/                 ← banner de sessão (session-start.mjs), hooks do Jev (jev-hooks.mjs) + merge-settings.mjs
├── mcp/                   ← config e instruções do Chrome e do jev-browser
├── tools/                 ← ferramentas externas (rtk, openspec), instaladas à parte
```

Adicionar coisa nova: crie a pasta/arquivo no lugar certo. O instalador varre os diretórios — não precisa registrar em lista nenhuma.

---

## Créditos e licenças

Skills de terceiros incluídas como cópia verbatim, com o cabeçalho de origem em cada arquivo:

| Skill | Autor | Licença |
|---|---|---|
| `ponytail-review` | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | MIT |
| `caveman` | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | MIT (a skill; o runtime do proxy é BSL-1.1 e não está aqui) |

Ferramenta externa apenas referenciada, não redistribuída:

| Ferramenta | Autor | Licença |
|---|---|---|
| `rtk` | [rtk-ai/rtk](https://github.com/rtk-ai/rtk) | Apache-2.0 |

O resto (agents, scripts, templates, instalador, `manager`, e as adaptações de `doubt`, `grill-me` e `simplify`) é deste repositório.
