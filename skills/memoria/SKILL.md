---
name: memoria
description: Memória persistente do que muda COMO o Claude trabalha — preferências de código, decisões de spec, lições de pipeline. Guarda índice das specs por projeto e lições por tema em ~/.claude/memory/. Usar quando o usuário disser "lembre disso", "/memoria", quando o manager fechar uma tarefa, ou quando for útil consultar o que já foi aprendido.
---

# Memória

Memória em markdown, em `~/.claude/memory/`, global — vale em qualquer projeto. Arquivo simples, editável à mão, busca por grep. Sem busca semântica, sem banco, sem agent em background.

## Fronteira — o que entra aqui

Entra **só o que muda como o Claude trabalha**: preferência de código, decisão de spec e o motivo dela, lição de pipeline, armadilha de ferramenta.

**Não entra o que aconteceu.** Registro narrativo de sessão, projeto pessoal, estudo, vida — isso é do `/vault`, que guarda por tema no vault de notas. Se as duas parecerem servir, pergunte: *isso muda como eu devo trabalhar da próxima vez?* Se não muda, é `/vault`.

Também não entra: nada que o repositório já registre (estrutura do código, histórico do git, `CLAUDE.md`), nem coisa que só vale nesta conversa.

## Estrutura

```
~/.claude/memory/
├── core.md                # resumo + ponteiros — sempre lido
├── preferencias.md        # como o Claude deve trabalhar — sempre lido
├── projects/<projeto>.md  # índice de specs + lições daquele repositório
└── topics/<tema>.md       # lição transversal (godot, powershell, git, ...)
```

`<projeto>` é o nome da pasta raiz do repositório. `<tema>` é kebab-case, criado na hora se não existir.

Se o diretório não existir, crie-o na primeira escrita, junto com `core.md` e `preferencias.md` vazios.

## Formato de entrada

Uma entrada é um bloco `##`. Atômica: um fato por bloco.

```markdown
## <Título curto> [AAAA-MM-DD]
<O fato em 1–3 frases, incluindo o porquê.>
```

Em `core.md`, a entrada é resumo mais ponteiro — nunca o conteúdo inteiro:

```markdown
## <Tema>
<Uma linha.>
→ topics/<tema>.md
```

Entrada de spec, em `projects/<projeto>.md`, aponta para o arquivo em vez de copiá-lo:

```markdown
## <slug da spec> [AAAA-MM-DD]
- **Spec:** <caminho absoluto de specs/<slug>.md>
- **Decidido:** <as decisões que valem além desta tarefa>
- **O que deu errado:** <o que foi refeito, o que o reviewer pegou, o que a verificação humana reprovou — ou "nada">
```

## Comandos

### `/memoria salvar <observação>`

1. Classifique: preferência de trabalho → `preferencias.md`; ligada a um repositório → `projects/<projeto>.md`; lição transversal → `topics/<tema>.md`.
2. Leia o arquivo alvo antes de escrever. Se já houver entrada sobre o mesmo fato, **atualize essa entrada** em vez de criar uma segunda — memória com duas versões do mesmo fato é pior que memória vazia.
3. Acrescente ou atualize a entrada, datada.
4. Só toque em `core.md` se o fato for recorrente ou valer além daquele projeto. `core.md` é sempre lido: cada linha ali custa contexto em toda tarefa.
5. Informe: "Salvo em `<caminho>`."

### `/memoria buscar <termo>`

1. `grep` em `core.md` e `preferencias.md`.
2. Siga os ponteiros dos temas que casaram e leia esses arquivos.
3. Devolva as entradas relevantes com o caminho de cada uma. Nada achado: diga "nada na memória sobre isso" — não preencha com suposição.

### `/memoria carregar`

Leitura de contexto: `preferencias.md` + `core.md` + `projects/<projeto>.md` do repositório atual, se existir. Resuma em poucas linhas o que se aplica à tarefa em curso.

### `/memoria ver`

Liste a árvore de `~/.claude/memory/`, o conteúdo de `core.md` e o título das entradas de cada arquivo.

### `/memoria esquecer <tema>`

Apagar é destrutivo: **mostre o que vai sair e peça confirmação antes**. Depois de confirmado, remova o arquivo ou a entrada e a linha correspondente em `core.md`.

## Regras duras

- Não invente entrada. Só entra o que o usuário disse ou o que aconteceu de fato na sessão.
- Data absoluta, sempre (`2026-09-11`), nunca "ontem" ou "semana passada".
- Uma entrada errada é dívida: se algo se provar falso, corrija ou apague na hora.
- Memória recuperada descreve o que era verdade quando foi escrita. Se a entrada cita arquivo, função ou flag, confirme que ainda existe antes de recomendar.
- Nunca copie a spec inteira para cá. A spec mora no repositório, versionada; aqui fica o ponteiro e o que foi decidido.
