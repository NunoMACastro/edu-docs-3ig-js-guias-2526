# MongoDB (12.º Ano) - 02 · Modelação de documentos e relações

> **Objetivo deste ficheiro**
> Aprender a desenhar documentos para APIs reais.
> Decidir entre embutir dados ou referenciar por `id`.
> Evitar erros de modelação comuns no início.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Pensar por documentos](#sec-1)
- [2. [ESSENCIAL] Embutir vs referenciar](#sec-2)
- [3. [ESSENCIAL] Exemplo: tarefas e categorias](#sec-3)
- [4. [ESSENCIAL] Campos padrão recomendados](#sec-4)
- [5. [EXTRA] Antipadrões de modelação](#sec-5)
- [Exercícios - Modelação](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** domina o modelo antes de escrever controllers.
- **Como estudar:** desenha 2 versões do mesmo domínio e compara trade-offs.
- **Ligação útil:** `../Node/05_estrutura_mvc.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Pensar por documentos

Em MongoDB, modelamos pela forma como a aplicação lê/escreve dados.

Perguntas práticas:

- Que dados são lidos juntos com mais frequência?
- Que campos mudam muito?
- Precisamos de histórico ou só estado atual?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Embutir vs referenciar

### Embutir (embedded)

Usa quando os dados “pertencem” ao mesmo documento e são lidos juntos.

```json
{
  "titulo": "Projeto React",
  "subtarefas": [
    { "titulo": "Criar componentes", "feito": true },
    { "titulo": "Ligar API", "feito": false }
  ]
}
```

### Referenciar (reference)

Usa quando os dados são partilhados, grandes ou com ciclo de vida próprio.

```json
{
  "titulo": "Projeto React",
  "categoriaId": "661a...",
  "ownerId": "662b..."
}
```

Regra didática: começa simples com embutido; separa para referência quando houver necessidade real.

<a id="sec-3"></a>

## 3. [ESSENCIAL] Exemplo: tarefas e categorias

### Coleção `categorias`

```json
{ "_id": "...", "nome": "Estudo", "cor": "#0ea5e9" }
```

### Coleção `tarefas`

```json
{
  "_id": "...",
  "titulo": "Rever closures",
  "feito": false,
  "categoriaId": "...",
  "tags": ["javascript", "funcoes"]
}
```

### Decisão

- `categoriaId` referenciado: categoria pode ser reutilizada por muitas tarefas.
- `tags` embutidas: pequenas, simples e lidas com o documento.

<a id="sec-4"></a>

## 4. [ESSENCIAL] Campos padrão recomendados

Para consistência entre Node/Fullstack:

- `createdAt` e `updatedAt`
- `ativo` ou `deletedAt` para soft delete (quando necessário)
- Nomes coerentes (evitar misturar `title` e `titulo` no mesmo projeto)

Exemplo base:

```json
{
  "titulo": "Rever MongoDB",
  "feito": false,
  "createdAt": "2026-04-17T10:00:00.000Z",
  "updatedAt": "2026-04-17T10:00:00.000Z"
}
```

<a id="sec-5"></a>

## 5. [EXTRA] Antipadrões de modelação

- Documentos gigantes sem necessidade.
- Arrays sem limite com crescimento infinito.
- Duplicar dados críticos em várias coleções sem estratégia de sincronização.
- Mudar esquema todas as semanas sem migração mínima.

<a id="exercicios"></a>

## Exercícios - Modelação

1. **Desenhar domínio de biblioteca**
   - Modela `livros`, `autores`, `emprestimos`.
   - Critério: justificas embutir vs referenciar.
2. **Checklist de leitura**
   - Modela tarefas com subtarefas embutidas.
   - Critério: um documento devolve tudo para a UI principal.
3. **Revisão de consistência**
   - Uniformiza nomes de campos (`titulo` vs `title`).
   - Critério: contrato JSON consistente.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (modelação documental e relações).
