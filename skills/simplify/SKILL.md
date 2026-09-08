---
name: simplify
description: Reduzir complexidade desnecessária no que foi produzido recentemente — documento, spec, ou explicação dada ao usuário — mantendo o comportamento/conteúdo esperado. Usar depois de uma primeira versão pronta, ou antes de entregar uma explicação mais longa.
---

# Simplify

Trabalho recente acumula complexidade desnecessária. Essa skill reduz isso com disciplina, pra ficar mais claro pra quem vai usar — seja um documento, uma spec, ou uma explicação falada/escrita pro usuário.

## Quando rodar

- Depois que a primeira versão de algo existe (spec, documento, board).
- Antes de entregar uma explicação passo a passo mais longa pro usuário.

## Princípios

- **Preservar o conteúdo/comportamento esperado.** Só a apresentação fica mais simples.
- **Seguir as convenções do projeto e do que já existe.**
- **Clareza acima de esperteza.**
- **Mostrar o que foi simplificado.**

## Processo

1. **Entender antes de mexer** (cerca de Chesterton): saber por que algo existe antes de tirar. Se não conseguir explicar o propósito, perguntar ou deixar como está.
2. **Identificar sinais**: aninhamento profundo (3+ níveis de condição), um trecho fazendo dois trabalhos ao mesmo tempo, o mesmo fato duplicado em lugares diferentes, passo que nenhuma decisão do usuário alcança, texto que o usuário não consegue escanear rápido.
3. **Aplicar incrementalmente**: uma simplificação por vez — nunca empacotar limpezas não relacionadas numa mudança só.
4. **Verificar o resultado** depois de cada passo: ficou realmente mais fácil de entender? Ajuda o usuário no momento em que ele vai usar isso? É coerente com o que veio antes e depois?

Terminar com uma lista curta do que foi simplificado e por quê.

## Quando o alvo é uma explicação pro usuário (não um documento)

Adaptar o processo: em vez de revisar arquivo, revisar a explicação antes de enviar.
- Cortar todo passo que não é essencial pro usuário conseguir agir.
- Ajustar a linguagem ao nível de conhecimento técnico dele — sem jargão sem exemplo concreto.
- Preferir frase curta e direta a parágrafo explicativo.

## No contexto do devkit (pipeline do manager)

O alvo aqui é **a spec e a explicação entregue ao usuário**, não o código já aprovado.

- No **Gate 1**, rodar depois dos checks: cortar passo não-essencial da spec, remover fato duplicado entre estágios, ajustar a linguagem ao nível técnico de quem vai ler.
- Nunca usar jargão sem exemplo concreto.
- Simplificar apresentação nunca pode mudar comportamento acordado na spec. Se for preciso mudar comportamento, isso é mudança de spec — voltar pro Approval Gate.
