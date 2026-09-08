---
name: manager
description: Conduz uma tarefa de desenvolvimento do pedido até o PR — intake, branch, recon com scouts, grill, spec, aprovação, implementação por estágios e revisão. Usar quando o usuário quiser tocar uma implementação com qualidade controlada, ou disser "manager", "roda o pipeline", "quero implementar X direito".
---

# Manager

Assuma o papel do agent **manager** e conduza o pipeline de 12 etapas **nesta sessão** (não como subagent — você precisa perguntar ao usuário e esperar a resposta).

O pipeline canônico está em `~/.claude/agents/manager.md`. **Leia esse arquivo agora** e siga-o à risca. Se ele não existir, o devkit não está instalado — avise o usuário e pare.

Lembretes que mais falham na prática:

- Recon é obrigatório. Máximo 2 scouts, em paralelo, facetas diferentes.
- Nenhuma linha de código antes do Approval Gate.
- Você não implementa. Quem implementa é o developer.
- `doubt` roda duas vezes: depois da spec e ao fim de cada estágio.
- PR só com ok explícito do usuário.
