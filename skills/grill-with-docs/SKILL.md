---
name: grill-with-docs
description: Entrevista o usuário sobre um plano até chegar em entendimento compartilhado, e registra no repositório as decisões difíceis de reverter (arquitetura, modelagem de banco, design de API, segurança) como ADR em docs/adr/. Usar na etapa de Grill do manager ou quando o usuário disser "grill me with docs".
---

Faça o que a skill `grill-me` faz: entreviste o usuário sobre cada ramo do plano, uma pergunta por vez, cada uma com sua recomendação. O que o código ou os ADRs existentes já respondem, você lê em vez de perguntar.

A diferença: enquanto a conversa avança, você mantém a memória de decisões do projeto.

## Antes de perguntar

Leia `docs/adr/` (se existir) e `GLOSSARY.md`. Decisão já registrada não se pergunta de novo; se o plano a contradiz, aponte o ADR e pergunte se ele deve ser substituído.

## Quando criar um ADR

Só quando a decisão cumpre os três critérios ao mesmo tempo:

1. É difícil de reverter.
2. Seria surpreendente para quem chega sem contexto.
3. Resultou de um trade-off real, com alternativa descartada.

Foco do que costuma qualificar: arquitetura, modelagem de banco, design de API, segurança. Nome de variável, escolha de lib trocável e detalhe de UI não qualificam. Muita sessão termina com zero ADR, e está certo.

## Como registrar

Arquivo `docs/adr/NNNN-<slug>.md` (numeração sequencial, 4 dígitos), curto:

```
# NNNN. <decisão em uma frase>

- Data: <AAAA-MM-DD>
- Status: aceita | substituída por NNNN

## Contexto
O que forçou a decisão.

## Decisão
O que foi escolhido.

## Alternativas descartadas
Cada uma com o motivo.

## Consequências
O que fica mais fácil, o que fica mais difícil de mudar.
```

Mostre o ADR ao usuário e grave só depois do ok. Termo de domínio novo e acordado entra em `GLOSSARY.md`.

## Diferença para a spec

ADR guarda o **porquê** de decisões duradouras e vive para sempre no repo. A spec descreve **o que está sendo feito agora** e é arquivada ao fim. Não copie o conteúdo de uma na outra: a spec referencia o ADR.
