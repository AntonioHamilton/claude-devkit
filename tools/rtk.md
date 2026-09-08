# RTK — redução de tokens de saída do shell

**RTK não é uma skill.** É um binário Rust (`rtk`) que fica entre o agent e o shell e comprime a saída dos comandos antes de o modelo ler: `ls`, `cat`, `grep`, `git status/diff/log`, `npm test`, `pytest`, `cargo test`, `docker ps` e ~100 outros. Por isso ele mora em `tools/`, não em `skills/` — não há `SKILL.md` para copiar.

Fonte: https://github.com/rtk-ai/rtk (Apache-2.0)

## O que ele faz de verdade

Corta até 90% da **saída de bash** que o agent lê. Isso não é 90% da conta: saída de bash é uma parte dos tokens de entrada, e entrada é uma parte do custo. Os percentuais que ele reporta são confiáveis; os números absolutos de token são estimados por `bytes / 4`.

Limite importante: o hook só intercepta chamadas da ferramenta **Bash**. `Read`, `Grep` e `Glob` do Claude Code não passam por ele. Para ganhar com RTK nesses casos, use comando de shell (`cat`, `rg`, `find`) ou chame `rtk read` / `rtk grep` / `rtk find` direto.

> Isso combina com a regra de auto mode do devkit — trabalhar via Bash em vez das ferramentas dedicadas — mas é uma troca: com RTK ligado, `cat` fica mais barato que `Read`; sem RTK, não fica.

## Instalar

macOS / Linux:

```bash
brew install rtk
# ou
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

Windows: baixar o zip da release, colocar `rtk.exe` no PATH (ex.: `C:\Users\<voce>\.local\bin`) e rodar de Prompt/PowerShell/Windows Terminal — não dar duplo clique no `.exe`. Precisa de `ripgrep` no PATH (`winget install BurntSushi.ripgrep.MSVC`).

Ligar o hook no Claude Code:

```bash
rtk init -g       # instala o hook PreToolUse + RTK.md
rtk init --show   # verificar
```

Depois disso, **reiniciar o Claude Code**.

## Cuidados

- `rtk init -g` **escreve no `~/.claude/settings.json`** do usuário (hook global). Ação que afeta todas as sessões — o instalador do devkit não faz isso; confirme com o usuário antes.
- Colisão de nome no crates.io: existe outro pacote `rtk` (Rust Type Kit). Se `rtk gain` falhar, foi o pacote errado — use `cargo install --git https://github.com/rtk-ai/rtk`.
- Não quebra o prompt cache: o filtro roda uma vez por comando e o resultado vai pro histórico normalmente.
