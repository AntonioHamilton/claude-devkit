# OpenSpec

Framework de spec-driven development. O manager o usa na etapa 6 no lugar do antigo `templates/spec.md`. Site: https://openspec.dev/

## Instalar

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Também funciona com pnpm, bun, yarn e nix. Requer Node.

## Ligar num projeto

Na raiz do projeto, uma vez:

```bash
openspec init
```

Escolha Claude Code quando ele perguntar as ferramentas: ele cria a pasta `openspec/` e os slash commands do projeto. Isso escreve no repo do usuário: **avise antes de rodar** e não commite sem ele pedir.

## Estrutura de uma mudança

Cada mudança vive em `openspec/changes/<slug>/`:

- `proposal.md` — por que e o que muda.
- `specs/` — requisitos e cenários.
- `design.md` — como será feito.
- `tasks.md` — checklist de implementação (os estágios do manager).

Fluxo do OpenSpec: explore, propose, apply, verify, archive. Os nomes exatos dos slash commands são os que `openspec init` gerar; use esses.

## Como o manager usa

- Etapa 6: gera a change (propose) em vez de escrever `specs/<slug>.md`. O campo **Como você confere** de cada estágio vai em `tasks.md`.
- Etapa 11: skill `goal` roda `openspec validate`/verify.
- Etapa 13: ao fim, `archive`.
- Projeto sem `openspec/` e sem ok do usuário para o `init`: pare e pergunte; não volte para o template antigo em silêncio.
