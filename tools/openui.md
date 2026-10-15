# OpenUI

Padrão aberto de UI generativa: o modelo descreve a interface em OpenUI Lang e o app renderiza com os componentes e o design system do projeto. Serve para dashboards, formulários, tabelas, gráficos e telas, não só chat. Site: https://www.openui.com/ · Código: https://github.com/thesysdev/openui

Opcional. Só faz sentido em projeto que tenha (ou queira) UI gerada por IA.

## Instalar

Não há instalação global: o CLI roda via `npx`, sem pacote para instalar antes (requer Node).

Projeto novo:

```bash
npx @openuidev/cli@latest create
```

Projeto existente, para agentes de código (Claude Code, Codex, Cursor) saberem usar o OpenUI:

```bash
npx @openuidev/cli@latest setup-agent
```

`setup-agent` cria ou **edita o `AGENTS.md` do projeto**, acrescentando as instruções do OpenUI. Pode ser rodado de novo para atualizar. Projetos criados com `create` já vêm com isso.

## Regras para o agent

- **Avise antes de rodar**: os dois comandos escrevem no repositório do usuário (`setup-agent` altera o `AGENTS.md`). Peça ok.
- Rode a partir da raiz do projeto, depois do `AGENTS.md` base do devkit existir, para o OpenUI acrescentar em vez de criar um arquivo paralelo.
- Não commite sem o usuário pedir.
- A página oficial não documenta MCP nem plugin do Claude Code; não invente. Dúvida de uso: consulte a documentação em /docs do site.
