---
name: ai-effort
description: Decide o esforço de uma tarefa de desenvolvimento antes de agir - direto, enxuto ou completo (manager) - e o nível de teste. Usar no início de qualquer pedido de código, ou quando o usuário perguntar "precisa do manager?" ou "que teste rodar?".
---

# ai-effort

O usuário não precisa pedir o manager. **A decisão é sua**, tomada em silêncio no começo de cada pedido. Contexto do dono: projetos pessoais, poucos usuários, plano com poucos tokens. O padrão é o menor esforço que entrega com segurança.

## Três níveis

| Nível | Quando | O que faz |
|---|---|---|
| **Direto** | Ajuste pequeno, bug de causa óbvia, texto, estilo, dúvida, script curto, estudo | Sem manager. Lê o `AGENTS.md`, edita, roda o check relevante, responde. Nenhum subagent. |
| **Enxuto** | Feature média, vários arquivos, bug sem causa óbvia, projeto novo e simples | `/manager` em modo enxuto: checklist no chat, sem OpenSpec, 0 ou 1 scout, a própria sessão implementa. |
| **Completo** | Dado de usuário real, autenticação, pagamento, migração, mudança difícil de reverter, vários módulos, ou o usuário pediu "direito"/"manager" | `/manager` em modo completo: scouts, spec, aprovação, developer por estágio, validação em loop. |

Regras de decisão:
- Dúvida entre dois níveis: o menor, se a mudança for fácil de reverter; o maior, se não for.
- Usuário pediu `/manager` e a tarefa é trivial: diga uma vez que "direto" resolve e siga o que ele escolher.
- Estudo ou projetinho de aprendizado: nível direto ou enxuto, e explique o porquê das escolhas em 1-2 frases.
- Projeto novo sem stack definida: rode a skill `ai-stack` antes.
- O nível pode subir no meio (apareceu migração, auth): avise e suba. Não precisa descer.

## Nível de teste

Escolha o menor que dá confiança:

1. **Conferência pela IA:** mudança visual ou trivial. Abra, veja, registre o que viu.
2. **Teste pontual** ao lado do código: lógica nova ou bug corrigido. Todo bug corrigido ganha um teste que falha sem a correção.
3. **Suíte da persona** (do `AGENTS.md`): mudança que toca um fluxo de usuário. Rode só as personas afetadas.
4. **Agent `tester` + framework de regressão** (Playwright, Vitest, testes de contrato da API): fluxo crítico (login, pagamento, cadastro) ou projeto com mais de uma tela. Existe para não retestar o site inteiro a cada mudança. Use o framework que o projeto já tem; ferramenta nova só com ok.

Personas e regressão novas vão para o `AGENTS.md` do projeto, nunca para a memória global.

## Modelo

Aplique a regra `jev-router` a tudo que delegar.
