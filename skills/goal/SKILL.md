---
name: goal
description: Verifica se a implementação feita está de acordo com a spec e atingiu o objetivo pedido. Usar depois do stage loop, ou quando o usuário disser "/goal" ou "isso atingiu o objetivo?".
---

# Goal

Responde uma pergunta: **o que foi construído cumpre a spec e o objetivo original?** Não reimplementa nada e não corrige; só veredita.

## Passos

1. Ache a spec da mudança em andamento: a pasta de change do OpenSpec (`openspec/changes/<slug>/`: `proposal.md`, `specs/`, `design.md`, `tasks.md`). Sem spec, pergunte ao usuário qual é o objetivo e use isso.
2. Se o CLI `openspec` existir, rode a validação dele (`openspec validate <slug>`) e cole o resultado real.
3. Para cada requisito/cenário da spec e cada item de `tasks.md`, ache a evidência no código ou num teste (`git diff <default>...HEAD`). Marque `atendido`, `parcial` ou `não atendido`, com `arquivo:linha`.
4. Releia o objetivo da `proposal.md` (o porquê, não só os requisitos). Pode estar tudo atendido e o objetivo não ter sido atingido; diga isso se for o caso.
5. Procure escopo a mais: mudança no diff que nenhum requisito pede.

## Saída

```
Veredito: atingiu | parcial | não atingiu
Requisitos: <n atendidos>/<n total>
Pendências: <lista com arquivo:linha>
Escopo a mais: <lista ou "nenhum">
```

Pendência `não atendido` volta para o stage loop como estágio novo. Não declare "atingiu" sem evidência para cada requisito.
