---
name: doubt
description: Revisão adversarial antes de uma decisão que gera consequência — defender a tese oposta antes de bater o martelo. Usar antes de decisões de alto impacto ou difíceis de reverter, em qualquer projeto.
---

# Doubt

Fazer uma revisão adversarial, como se você quisesse defender a tese oposta, antes de tomar uma decisão que gera consequência. Sessões longas fazem fatos não-questionados parecerem inquestionáveis — e isso dá errado rápido exatamente quando corrigir o rumo ainda é barato.

## Quando usar

- Antes de uma decisão de alto impacto (matar um NPC, fechar uma linha de plot, mudar a interpretação de uma regra, sobrescrever um gênero/keymap já em uso, reescrever material já publicado).
- Antes de qualquer ação difícil de reverter dentro de um plano maior (etapa cética do pipeline).

## Processo

1. **Declarar a decisão** em uma frase, mais o que ela assume como verdade.
2. **Defender o oposto**: escrever o caso mais forte e honesto para NÃO fazer (ou fazer o contrário).
3. **Listar o que precisaria ser verdade** para o caso oposto vencer.
4. **Checar a evidência**: verificar essas suposições contra os dados reais do projeto (arquivos, histórico, documentação) — não confiar na memória da conversa para fatos que vivem em arquivos.
5. **Veredito**: seguir como planejado · ajustar a decisão · perguntar ao usuário. Dizer qual e por quê, em duas ou três frases.

## No contexto do devkit (pipeline do manager)

Rodar `doubt` em três pontos fixos:

- **Spec Skeptic pass** — depois da spec escrita, antes do Approval Gate. A decisão em jogo é "essa spec é a coisa certa a construir".
- **Fim de cada estágio** — depois do developer entregar, antes de seguir pro próximo. A decisão é "esse estágio realmente implementa a spec e não deixa dúvida em aberto".
- **Antes de qualquer ação difícil de reverter** — sobrescrever arquivo em uso, apagar migração, trocar contrato público, forçar push.

Ação aditiva e reversível não precisa dessa etapa.
