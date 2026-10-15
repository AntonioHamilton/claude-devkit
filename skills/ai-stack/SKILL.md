---
name: ai-stack
description: Para projeto novo ou sem stack definida - faz as perguntas-chave (usuários, dados, segurança, plataforma) e sugere linguagem, banco e tipo de aplicação com racional curto, mais referências de UI. Usar ao começar um projeto, ou quando o usuário perguntar "que stack uso?".
---

# ai-stack

Objetivo: decidir a stack mais simples que serve, rápido e barato. O dono sabe JavaScript/TypeScript e quer abrir espaço para Go e Java no backend.

## 1. Perguntas-chave

Uma única rodada da ferramenta de perguntas do harness (`AskUserQuestion` no Claude Code; sem ela, pergunte em texto, numerado), 4 perguntas, opção recomendada primeiro. Pule o que o `AGENTS.md`, a memória ou o pedido já respondem.

1. **Usuários:** só eu / até dezenas / centenas / milhares ou mais.
2. **Dados:** volume (poucos MB / GB / muito) e forma (tabelas relacionais / JSON de formato livre / arquivos e mídia).
3. **Segurança:** nenhuma (uso local) / login simples / dados pessoais / pagamento ou dado sensível.
4. **Plataforma:** web / web instalável (PWA) / app mobile / desktop ou CLI.

## 2. Sugestão (formato fixo, curto)

```
STACK: <linguagem> + <framework> + <banco> + <plataforma>
POR QUE: <2-3 linhas ligando às respostas>
ALTERNATIVA: <uma, e quando valeria trocar>
CUSTO: <hospedagem e o que é grátis>
```

### Linguagens

| Linguagem | Serve para | Escolha quando |
|---|---|---|
| TypeScript/JavaScript | Front, back e scripts na mesma linguagem | Padrão: o dono domina; menos peças |
| Go | API simples e rápida, binário único, concorrência | Backend que vai crescer ou rodar barato; quer aprender |
| Java | Backend corporativo, ecossistema Spring | O trabalho usa ou o objetivo é aprender; pesado para projeto pequeno |
| Python | Scripts, dados, automação, IA | Estudo, análise, protótipo de dados |

### Bancos

| Banco | Escolha quando |
|---|---|
| SQLite | Uso pessoal ou poucos usuários, zero custo, um arquivo. Padrão para projeto pequeno |
| Postgres (Neon, Supabase) | Várias pessoas, relacional, quer crescer. Coluna `JSONB` cobre dado JSON de formato livre |
| MongoDB | Só se o dado for JSON de formato realmente imprevisível e sem relações |
| Firebase/Supabase (BaaS) | Quer login e banco sem escrever backend; protótipo rápido |
| Arquivos/S3 | Mídia e anexos; guarde só o caminho no banco |

### Tipo de aplicação

- **Web** (padrão): custo mínimo, um deploy.
- **PWA:** web que instala no celular; resolve a maioria dos "preciso de app".
- **App mobile:** Expo/React Native só se precisar de loja ou hardware.
- **Nativo (Swift/Kotlin):** só para recurso de sistema que o resto não alcança.
- **CLI/desktop:** automação pessoal.

Regra: quanto menos usuários e menos dado sensível, menos peças. Sem login, sem servidor, sem banco remoto, se não precisar.

## 3. UI

Direção visual moderna e limpa, com espaço em branco, tipografia forte e poucos tokens de cor (claro e escuro). Referências: https://www.tokos.com.br/ (landing), https://build.withcastor.co/pt, https://refero.design/ (biblioteca de padrões de tela).

- Registre a direção escolhida no `AGENTS.md` (paleta, tipografia, referência) e reutilize; não reconsulte a web a cada tela.
- Consulte no máximo uma referência por tarefa, pelo `jev-browser` (`format: "markdown"`, `max_steps` baixo), e só se o usuário pedir algo visual novo.
- UI generativa por IA: `tools/openui.md` (opcional).

## 4. Registro

Grave a decisão no `AGENTS.md` (seção Stack) e, se o usuário revelou preferência, em `ai-memory`.
