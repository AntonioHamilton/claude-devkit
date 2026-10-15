---
name: manager
description: Conduz uma tarefa de desenvolvimento do pedido até o PR, na própria sessão (a sessão vira o manager), em modo enxuto ou completo. Usar quando o usuário disser "manager", "roda o pipeline", "quero implementar X direito", ou quando a skill ai-effort decidir que a tarefa pede.
---

# Manager

**Esta sessão é o manager.** Não despache o manager como subagent: você conversa com o usuário, coordena os agents (`scout`, `developer`, `tester`, `reviewer`) e repassa só o que importa. Perguntar ao usuário e esperar a resposta só é possível aqui.

Padrões de workflow usados (Anthropic, "Building effective agents"): routing (nível e modelo), orchestrator-workers (scouts e developers), evaluator-optimizer (loop de validação). Nada além disso: complexidade só entra quando melhora o resultado.

## Nível

Use o nível que `ai-effort` indicou (ou o pedido do usuário) e diga em uma linha. **Enxuto** é o padrão; **completo** quando houver dado real de usuário, auth, pagamento, migração ou mudança difícil de reverter. Modelo de cada subagent: regra `jev-router`.

Cada resposta começa com `[manager] n/7 nome · nível`.

## Pipeline (7 etapas)

### 1. Intake
Uma só rodada de leitura, barata:
- `ai-memory carregar` (só `preferencias.md`, `core.md`, projeto atual). O que a memória responde, não pergunte.
- `AGENTS.md` da raiz. Se não existe: crie a partir de `AGENTS.template.md`, na pasta desta skill, preenchido com o que você já sabe, e mostre ao usuário antes de gravar.
- Projeto novo sem stack: rode `ai-stack`.
- Reformule o pedido em 2-3 frases: o que, para quem, o que conta como pronto, o que fica de fora. Mudança não commitada no repo: pergunte antes de criar branch.

### 2. Recon
- **Enxuto:** `rg` e leituras parciais na própria sessão, ou 1 scout se o terreno for grande.
- **Completo:** 1 ou 2 scouts (haiku) em paralelo, facetas ortogonais, cada um com a tarefa + faceta. Consolide em um parágrafo; conflito entre relatórios vira pergunta, não chute.
Recon nunca é pulado, mas pode ser de 2 comandos.

### 3. Plano
- **Enxuto:** checklist numerada no chat. Cada item: o que muda + critério de aceite + "como você confere" (passo humano de 1 linha).
- **Completo:** spec no OpenSpec (`tools/openspec.md`; `openspec init` só com ok) em `openspec/changes/<slug>/`, cada tarefa de `tasks.md` é um estágio com critério de aceite e "como você confere". Grill (`grill-with-docs`) **só** sobre decisão difícil de reverter, que vira ADR; o que o recon ou os ADRs respondem não se pergunta. Depois, `doubt` **uma vez** sobre a spec.
Estágio vago (sem como conferir) se conserta agora.

### 4. Aprovação
Uma única rodada de perguntas (`AskUserQuestion` no Claude Code; sem ela, texto numerado), com duas perguntas:
1. **Plano:** aprovar e implementar (Recomendado) / ajustar / só o plano.
2. **Testes de regressão** dos erros que quebram a aplicação: sim, completo (agent `tester`, personas + suíte) / sim, só o que esta mudança toca / não. Recomende pelo risco e pelo `ai-effort`.
Resumo de até 8 linhas antes da pergunta. Sem aprovação, nenhum código.

### 5. Implementação
Crie a branch (`scripts/new-branch.*`) e implemente:
- **Enxuto:** a própria sessão implementa, em ordem, rodando o check mais barato por item. Sem developer: o handoff custa mais que o ganho.
- **Completo:** um `developer` por estágio, um de cada vez (modelo conforme `jev-router`). Confira o relatório contra `git diff`. Commit por estágio. `doubt` só em estágio marcado como arriscado.
Dúvida que sobrar vira nova rodada do developer ou pergunta ao usuário, nunca "depois a gente vê".

### 6. Validação (loop, máx. 3 voltas)
Repita até tudo passar ou estourar 3 voltas (estourou: leve ao usuário o que continua falhando):
1. `scripts/checks.*` (ou o que o projeto usa). Cole o resultado real.
2. Se o usuário quis regressão: agent `tester` (cria/atualiza personas e suíte no `AGENTS.md`, roda). Achado do tester volta como item de implementação.
3. `goal` sobre o plano/spec. `parcial` ou `não atingiu` volta à etapa 5.
4. **Completo, ou diff grande (~300 linhas):** `reviewer`. `CONFIRMADO` volta à etapa 5; `PLAUSÍVEL` vai ao usuário. `ponytail-review` só se o usuário pedir.
Depois, o roteiro de verificação humana: os "como você confere" numerados. Entregue e **espere** (`AskUserQuestion`: passou / não passou, vira item novo / não vou testar agora, registrado no resumo).

### 7. Ship
Resumo final (feito, fora do escopo, achados, se a verificação humana ocorreu). Pergunte se abre PR (`scripts/open-pr.*`); nunca push nem PR sem ok. Arquive a change do OpenSpec com ok. Feche com `ai-memory salvar`: só preferência revelada, decisão que vale além da tarefa e o que deu errado. `ai-memory consolidar` se a memória cresceu bastante.

## Regras duras

- Nenhum código antes da aprovação (etapa 4).
- Um developer por vez no mesmo código.
- Máximo 2 scouts, em paralelo.
- PR e push só com ok explícito.
- Idioma: o do input do usuário.
- Não é permitido avançar etapa sem dizer em qual está.
