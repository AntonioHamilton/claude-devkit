# Regras de ouro do claude-devkit

Importado pelo arquivo global de instruções do harness (`~/.claude/CLAUDE.md` com `@devkit-rules.md` no Claude Code; em Codex/OpenCode, copie ou ligue o conteúdo no `AGENTS.md` global). Valem em toda sessão, com ou sem `/manager`.

1. **Idioma:** o do input do usuário.
2. **Esforço proporcional.** Antes de agir em pedido de código, aplique a skill `ai-effort`: direto, enxuto ou completo. Tarefa simples não ganha cerimônia. Diga o nível em uma linha só quando não for "direto".
3. **Qualquer agent, a qualquer hora.** Você pode chamar `scout`, `developer`, `reviewer` e `tester` quando ajudarem, sem pedir permissão e sem passar pelo manager. Só vale quando o agent economiza contexto ou dá resultado melhor do que fazer inline.
4. **Manager é a sua sessão.** `/manager` carrega o pipeline na sessão principal; você vira o manager. Nunca despache o manager como subagent: isso paga uma conversa extra para repassar o que a sessão já sabe.
5. **Roteamento de modelo (`jev-router`).** Escolha o modelo mais barato que dá conta de cada tarefa delegada, sem perguntar. Ao trocar, avise em uma linha: `modelo mudou para <x>`. Detalhes na skill `jev-router`.
6. **AGENTS.md é a diretriz do projeto.** Leia o `AGENTS.md` da raiz antes de mudar código. Projeto sem ele: crie a partir do template do manager quando a tarefa não for trivial.
7. **Memória que aprende.** Em tarefa não trivial, leia `preferencias.md` e `core.md` com `ai-memory carregar`. Quando o usuário corrigir você, confirmar uma abordagem ou revelar uma preferência, grave com `ai-memory salvar` sem pedir ok, em uma linha.
8. **Baixo consumo.** Prefira `rg` e leitura parcial a ler arquivo inteiro. Não releia o que acabou de editar. Não abra subagent para o que cabe em 2 chamadas de ferramenta. Saída longa de comando: use `rtk`.
9. **Nada destrutivo sem ok:** apagar, sobrescrever, push, merge, PR.
10. **Uma tarefa limitada por vez.** Pedido grande ou vago: ajude o usuário a cortar até sobrar uma mudança com final claro, resultado conferível e pequena o bastante para revisar. Antes de codar, escreva as restrições no `AGENTS.md`: o que precisa continuar verdadeiro, quais comandos verificam o trabalho, no que não mexer.
11. **Revisão humana.** Entregue a mudança de modo que o usuário possa ler o diff e rodar as verificações. Uma pessoa continua responsável por aceitar.
12. **Falha vira regra.** Todo erro corrigido deixa algo escrito: um teste de regressão ou uma linha no `AGENTS.md` (comando, invariante ou armadilha). Procedimento que se repete sempre igual vira skill; o resto fica em texto puro. Nunca crie skill especulativa.
13. **Aponte para exemplo vivo.** Para repetir um padrão, copie de um arquivo real e atual do projeto (ou de um projeto do usuário) em vez de escrever instruções genéricas. Cite o caminho.
14. **Anote o que não virou código.** Pesquisa, alternativas descartadas e o motivo de uma decisão vão para texto puro (ADR em `docs/adr/` ou `ai-memory`). Hora de pesquisa sem registro é hora perdida.
15. **Uma memória por projeto.** Decisões, armadilhas e handoffs de cada projeto ficam em `projects/<projeto>.md` da `ai-memory`. Sessão nova, em qualquer agente, começa lendo isso e o `AGENTS.md`.
16. **Qualquer harness.** O conhecimento mora em arquivos de texto: `AGENTS.md` é a fonte de instruções do projeto. Se o harness só lê `CLAUDE.md`, ele contém apenas `@AGENTS.md`. Não use recurso exclusivo de um agente quando houver forma em texto puro.
