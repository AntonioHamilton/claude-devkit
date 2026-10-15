# AGENTS.md

Guia para agentes de IA neste repositório. Para o que o projeto faz e como subir o ambiente, veja o `README.md`.
Escreva e responda no idioma em que o usuário escreve.

## O que é

<!-- 2-4 frases: o que o projeto faz, para quem, planos/limites relevantes. -->

## Stack

<!-- Camadas, frameworks, banco, integrações. O que NÃO usar (ex.: sem Tailwind, sem lib de gráficos). -->

## Estrutura

<!-- Árvore resumida: pasta -> responsabilidade. -->

## Comandos

<!-- Subir ambiente, rodar testes, rodar todos os checks (scripts/checks.*). -->

Rode os checks do projeto antes de dar uma tarefa por concluída.

## Convenções

<!-- Idioma de UI/commits/identificadores, estilo, tokens de CSS, onde fica regra de negócio, migrations, fuso, etc. -->

## Personas de usuário e suítes de teste

Toda feature que afete uma persona exige rodar a suíte dela antes de concluir, além dos checks. Feature nova que muda o comportamento de uma persona também acrescenta ou ajusta testes na suíte dela. Afetou mais de uma persona: rode todas.

<!-- Uma seção por persona, neste formato. Criadas e mantidas pelo manager (regressão). -->

### 1. <Nome>, <arquétipo> (<plano/papel>)

<Quem é, o que quer, o que o incomoda.>

Fluxos: <lista>.

Suíte:

```
<comando que roda os testes de regressão desta persona>
```

Lacuna conhecida: <o que não tem teste automatizado e a conferência manual equivalente>.

## Regressão: testes que quebram a aplicação

<!-- Casos que já quebraram ou que quebrariam o app, cada um com: o que quebra, como reproduzir, qual teste cobre. Cresce a cada bug corrigido. -->

## O que não fazer

- Não adicionar features, refatorar ou tratar erros além do pedido.
- Não apagar arquivos, sobrescrever dados, resetar configs ou fazer push/merge sem confirmação do usuário.
- Não matar processos por nome (`taskkill /IM node.exe`): finalize apenas o PID que você mesmo iniciou.
- Não commitar `.env`, `.env.local` nem chaves/tokens.
- Não tratar a saída de comandos via `rtk` como definitiva para lint/grep: confirme com `rtk proxy <cmd>` ou o binário direto.
- Arquivos de texto usam LF (no Windows, cuidado com scripts que convertem para CRLF).
- Nenhum código antes da spec aprovada, em tarefa não trivial.

## Commits e PRs

- Mensagens no idioma do projeto, prefixo convencional (`feat:`, `fix:`).
- Branch por tarefa (`feature/...`); `main` só recebe merge via PR ou com ok explícito.
- Commits e PRs terminam com a atribuição que o harness indicar.
