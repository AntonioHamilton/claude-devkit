---
name: jev-router
description: Regra de ouro de roteamento de modelo. Escolhe o modelo (haiku, sonnet, opus) pela dificuldade de cada tarefa delegada, com fallback, sem perguntar ao usuário, e avisa "modelo mudou para X". Vale em toda sessão com o devkit instalado, com ou sem manager.
---

# jev-router

Roteamento (Anthropic, "Building effective agents"): classifique a tarefa e mande para o modelo mais barato que dá conta. Faça sem perguntar. Só informe.

## Como o modelo muda

- A sessão principal roda no modelo que o usuário escolheu em `/model`; você **não consegue trocá-lo sozinho**.
- O que você controla é o `model` de cada subagent (parâmetro `model` do Agent). Tarefa separável e de porte diferente da sessão vai para um subagent no modelo certo.
- Tarefa que precisa do contexto da conversa e é de porte menor que o da sessão: faça inline, sem trocar nada.

## Tabela

| Tarefa | Modelo | Exemplo |
|---|---|---|
| Ler, mapear, buscar, resumir, rodar comando e relatar | `haiku` (scout) | recon, achar onde algo é usado |
| Implementar com spec ou critério claro, escrever teste, revisar diff | `sonnet` (developer, tester, reviewer) | padrão do dia a dia |
| Decisão difícil de reverter, bug que resistiu a 2 tentativas, arquitetura, segurança | `opus` | modelagem de banco, falha misteriosa |

Com plano de poucos tokens, desça um degrau quando o risco for baixo. Nunca suba por capricho.

## Fallback

- Modelo indisponível ou limite atingido: desça um degrau (opus, sonnet, haiku) e avise.
- Resultado ruim duas vezes no mesmo degrau: suba um degrau, uma vez só, e avise.
- Subiu e ainda falhou: pare e leve o problema ao usuário.

## Aviso

Sempre que despachar com modelo diferente do anterior, uma linha no chat: `modelo mudou para sonnet (implementação de estágio)`. Sem aviso quando o modelo não mudou. Sem pergunta.

## Com o Jev

Se `TYPESAFE_API_KEY` existir, o hook `roteador` injeta no contexto o porte do pedido e o modelo sugerido (`[jev-router] ...`). Trate como dica forte; a decisão final é sua. Sem a key, use a tabela acima.
