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

Opções: `--dry-run` (mostra o que faria, não copia), `--force` (sobrescreve, guardando `.bak` do que existia), `--dest <caminho>` / `-Dest <caminho>` (destino alternativo).

O instalador **nunca sobrescreve sem `--force`**. Ele imprime três listas: instalado, pulado (já existia), pendente (skill sem `SKILL.md`).

### Passo 2 — Ler a saída e reportar

Repasse ao usuário as três listas. Item em "pulado" precisa de decisão dele: manter o que já existe ou rodar de novo com `--force`. **Não decida sozinho** — sobrescrever skill que ele já usa é ação difícil de reverter.

### Passo 3 — MCP do Chrome

O instalador não mexe em MCP. Abra `mcp/README.md` e siga a opção A (extensão Claude in Chrome, preferida no Claude Code) ou a opção B (`chrome-devtools-mcp` via npx, portátil). Pergunte ao usuário qual ele quer.

### Passo 4 — RTK (obrigatório)

RTK faz parte do kit, não é extra. Sem ele o devkit trabalha via Bash (regra de auto mode) pagando o preço cheio de cada saída de comando. Siga `tools/rtk.md`: instalar o binário, garantir `ripgrep` no PATH e rodar `rtk init -g`.

Antes de rodar `rtk init -g`, **diga ao usuário o que o comando faz**: escreve um hook `PreToolUse` global no `~/.claude/settings.json`, valendo para todas as sessões dele, não só para este projeto. Rode em seguida — a etapa não é opcional —, mas ele precisa saber o que mudou na config. O hook é global mesmo em instalação só de projeto; se o usuário recusar essa escrita, pare e reporte a instalação como incompleta em vez de seguir em silêncio.

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

Depois disso, reinicie a sessão do harness para ele carregar skills e agents novos. Confirme que `/manager` aparece e que os agents `scout`, `developer` e `reviewer` estão listados.

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
| `grill-me` | interna | Entrevista o usuário até fechar toda decisão aberta do plano. Etapa 5 do manager. |
| `doubt` | externa | Revisão adversarial antes de decisão difícil de reverter. Etapas 7 e 9 do manager. |
| `simplify` | externa (alvo adaptado) | Simplifica a **spec e a explicação dada ao usuário**, não o código aprovado. Etapa 10. |
| `manager` | interna | Dispara o pipeline de 13 etapas nesta sessão. Ver `agents/manager.md`. |
| `memoria` | interna (desenho inspirado em [hanfang/claude-memory-skill](https://github.com/hanfang/claude-memory-skill)) | Memória persistente em `~/.claude/memory/` do que muda **como** o Claude trabalha: preferência de código, decisão de spec, lição de pipeline. Lida na etapa 3, escrita na etapa 13. |
| `ponytail-review` | externa ([DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)) | Revisão que só caça excesso de engenharia: o que dá pra deletar. Complementar ao `reviewer`. Etapa 11. |
| `caveman` | externa ([JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)) | Modo de resposta ultracomprimido — corta token de saída sem perder substância técnica. Opcional, ligado pelo usuário. |

`ponytail-review` e `caveman` são **cópias verbatim do upstream**, em inglês, com a origem anotada no fim de cada arquivo. Não foram traduzidas de propósito: editar o corpo delas quebra a fidelidade e dificulta atualizar. O caveman responde no idioma em que você escreve, então em pt-BR ele responde em pt-BR.

**RTK não é skill.** É um binário Rust que comprime a saída dos comandos de shell antes de o agent ler. Fica em `tools/rtk.md`, com instalação própria: o `install.sh`/`install.ps1` não o instala, mas o passo 4 do README é obrigatório e cobre isso à mão.

#### Cuidado ao ligar o caveman

O `caveman` vale pra sessão inteira até o usuário dizer "stop caveman". Os agents deste kit (`scout`, `developer`, `reviewer`) têm formato de saída fixo — mantenha o formato e comprima só a prosa dentro dele. Ele já se desliga sozinho em aviso de segurança e em confirmação de ação irreversível, que é exatamente o Approval Gate e a etapa Ship.

### Agents

| Agent | Quem pode chamar | Permissão | Papel |
|---|---|---|---|
| `manager` | usuário | total | Conversa com o usuário e coordena todo o resto. Não escreve código. |
| `scout` | **só o manager** | read-only | Reconhecimento de uma faceta do projeto. Máx. 2 por tarefa, em paralelo. |
| `developer` | **só o manager** | escrita | Implementa **um estágio** da spec aprovada. Nada além do estágio. |
| `reviewer` | manager **ou** usuário | read-only | Revisa o que foi feito contra a spec. Também revisa PR. |

### Scripts

| Script | Usado em | O que faz |
|---|---|---|
| `scripts/new-branch.*` | etapa 2 (Branch) | Cria branch a partir da default. Aborta se houver mudança não commitada. |
| `scripts/checks.*` | etapa 10 (Gate 1) | Detecta npm/pnpm/yarn/bun, python, go ou rust e roda lint, typecheck, teste e build. |
| `scripts/open-pr.*` | etapa 12 (Ship) | Push da branch e `gh pr create`. Só depois do ok explícito do usuário. |

Cada um existe em `.sh` e `.ps1`.

### MCP

`chrome` — controle do navegador. Ver `mcp/README.md`.

### Ferramentas externas

| Ferramenta | Onde | Instala junto? |
|---|---|---|
| `rtk` | `tools/rtk.md` | Não pelo instalador — é o passo 4 do README, obrigatório e feito à mão. Binário separado + hook que escreve no `settings.json` do usuário; avise antes de rodar `rtk init -g`. |

---

## O pipeline do manager

Treze etapas, na ordem. O detalhe canônico está em `agents/manager.md`; este resumo serve para o usuário saber onde está.

| # | Etapa | O que acontece |
|---|---|---|
| 1 | Intake | Reformula o pedido e o que fica de fora. Confirma. |
| 2 | Branch | Cria branch a partir da `main`. |
| 3 | Pre-recon | Carrega a `memoria`, olha o projeto e decide quantos scouts (1–2) e quais facetas. |
| 4 | **Recon** | Dispara os scouts. **Obrigatório, nunca pulado.** |
| 5 | Grill | `grill-me` sobre a implementação. Uma pergunta por vez. |
| 6 | Spec | Escreve a spec (SDD) em `specs/<slug>.md` a partir de `templates/spec.md`, com o passo humano de conferência por estágio. |
| 7 | Spec Skeptic | `doubt` sobre a spec. |
| 8 | Approval Gate | Resumo + spec, e `AskUserQuestion` com a opção recomendada primeiro. Sem ok, não começa. |
| 9 | Stage loop | Por estágio: `developer` → `doubt` → commit. |
| 10 | Gate 1 | `checks` + `simplify`. |
| 11 | Gate 2 | `reviewer` (correção) + `ponytail-review` (excesso) sobre o diff da branch. |
| 12 | **Verificação humana** | Entrega o roteiro de conferência e **espera**. Reprovou, volta pro stage loop. |
| 13 | Ship | Pergunta se abre PR e captura o aprendizado na `memoria`. |

Invariantes que não podem ser quebradas:

- Recon nunca é pulado, por mais simples que a tarefa pareça.
- Nenhuma linha de código antes do Approval Gate.
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
/memoria salvar <observação>   # registra o que muda como o Claude deve trabalhar
/memoria buscar <termo>        # consulta por grep
/memoria ver                   # mostra o estado da memória
/memoria esquecer <tema>       # remove, com confirmação
```

Rodar uma skill isolada: `/grill-me`, `/doubt`, `/simplify`.

---

## Desinstalar

Apagar do destino as skills e agents deste kit:

```bash
rm -rf ~/.claude/skills/{manager,memoria,ponytail-review,caveman}
rm -f ~/.claude/agents/{manager,scout,developer,reviewer}.md
```

`grill-me`, `doubt` e `simplify` podem já ser do usuário — confirme com ele antes de apagar. Apagar a skill `memoria` **não** apaga `~/.claude/memory/`: o conteúdo é do usuário e só sai se ele pedir. Arquivos `.bak.<timestamp>` gerados por `--force` ficam ao lado do original.

---

## Estrutura

```
claude-devkit/
├── README.md              ← este arquivo (manual de instalação)
├── install.sh / .ps1      ← instalador
├── skills/<nome>/SKILL.md
├── agents/<nome>.md
├── scripts/               ← new-branch, checks, open-pr (.sh e .ps1)
├── mcp/                   ← config e instruções do Chrome
├── tools/                 ← ferramentas externas (rtk), instaladas à parte (passo obrigatório)
└── templates/spec.md
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
