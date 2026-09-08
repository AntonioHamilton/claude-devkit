# MCP — navegador Chrome

Duas formas de dar ao agent controle do Chrome. Escolha **uma**.

## Opção A — Claude in Chrome (preferida no Claude Code)

Extensão oficial do Chrome. Não é instalada por arquivo de config: o usuário instala a extensão, conecta com o Claude Code e libera as permissões por site dentro dela.

- Ferramentas ficam disponíveis como `mcp__claude-in-chrome__*` (navigate, computer, read_page, read_console_messages, form_input, ...).
- Roda **na sessão de Chrome existente do usuário**, com os logins dele. Trate como ambiente real, não sandbox.

Verificar se já está ativa: peça ao agent para chamar `tabs_context_mcp`. Se responder com as abas, está funcionando.

## Opção B — chrome-devtools-mcp (portátil, qualquer harness)

Servidor MCP via `npx`, útil em harness que não tem a extensão. Config em `mcp-servers.json` deste diretório.

Instalar no Claude Code:

```
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

Em outro harness, copie o bloco de `mcp-servers.json` para o arquivo de configuração MCP dele.

Requisitos: Node.js instalado e Chrome instalado. Confirme o nome do pacote antes de rodar em máquina nova — o instalador do devkit **não** instala essa opção automaticamente, só escreve/oferece a configuração.

## Regras de uso (valem para as duas opções)

- Nunca disparar `alert`, `confirm` ou `prompt`: diálogo modal trava a sessão inteira do navegador.
- Nunca reaproveitar ID de aba de sessão anterior — chamar `tabs_context_mcp` primeiro.
- Antes de clicar em algo destrutivo (deletar, enviar, pagar), avisar o usuário.
- Falhou 2 ou 3 vezes seguidas: parar e perguntar, não insistir.
