# MongoDB (12.º Ano) - 07 · Queries e indexação

> **Objetivo deste ficheiro**
> Melhorar queries para paginação, filtros e pesquisa.
> Compreender índices e impacto em desempenho.
> Evitar regressões comuns em APIs com mais dados.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Query de paginação e filtros](#sec-1)
- [2. [ESSENCIAL] Índices: o que são e porque importam](#sec-2)
- [3. [ESSENCIAL] Criar índices úteis no curso](#sec-3)
- [4. [ESSENCIAL] Sort + índice e custo de query](#sec-4)
- [5. [EXTRA] Explain e leitura rápida de plano](#sec-5)
- [Exercícios - Queries e indexação](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** dominar query certa antes de otimização fina.
- **Como estudar:** medir antes/depois ao criar índices.
- **Ligações úteis:**
  - Fullstack: `../Fullstack/01_fluxo_front_back_db.md`
  - Fullstack: `../Fullstack/02_contrato_api_e_erros.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Query de paginação e filtros

```js
const page = Math.max(1, Number(req.query.page || 1));
const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
const q = (req.query.q || "").trim();
const feito = req.query.feito;

const filter = { deletedAt: { $exists: false } };
if (q) filter.titulo = { $regex: q, $options: "i" };
if (feito === "true" || feito === "false") filter.feito = feito === "true";

const items = await col.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

const total = await col.countDocuments(filter);
res.json({ items, page, limit, total });
```

<a id="sec-2"></a>

## 2. [ESSENCIAL] Índices: o que são e porque importam

Índice funciona como “índice remissivo” de um livro.

Sem índice:

- MongoDB percorre muitos documentos (scan amplo).

Com índice certo:

- encontra os candidatos mais rápido;
- melhora filtros e ordenações frequentes.

<a id="sec-3"></a>

## 3. [ESSENCIAL] Criar índices úteis no curso

### Índice para ordenação por criação

```js
await col.createIndex({ createdAt: -1 });
```

### Índice composto para filtros comuns

```js
await col.createIndex({ feito: 1, createdAt: -1 });
```

### Índice único (evitar duplicados)

```js
await db.collection("categorias").createIndex({ nome: 1 }, { unique: true });
```

> Cria índices pelos padrões de acesso reais da API, não por “achismo”.

<a id="sec-4"></a>

## 4. [ESSENCIAL] Sort + índice e custo de query

Se usas muito:

- `find({ feito: false }).sort({ createdAt: -1 })`

um índice `{ feito: 1, createdAt: -1 }` evita ordenação cara em memória.

Checklist rápido:

- o campo de filtro vem primeiro no índice;
- o campo de ordenação vem a seguir;
- confirma com `explain` em ambiente de teste.

<a id="sec-5"></a>

## 5. [EXTRA] Explain e leitura rápida de plano

```js
const plan = await col.find({ feito: false }).sort({ createdAt: -1 }).explain("executionStats");
console.log(plan.executionStats.totalDocsExamined);
```

Comparar:

- antes do índice,
- depois do índice.

Objetivo didático: perceber diferença de documentos examinados.

<a id="exercicios"></a>

## Exercícios - Queries e indexação

1. **Paginação completa**
   - Implementa `page/limit/q/feito`.
   - Critério: contrato estável `{ items, page, limit, total }`.
2. **Índice composto**
   - Cria índice para `feito + createdAt`.
   - Critério: query frequente fica consistente com ordenação.
3. **Duplicados em categorias**
   - Aplica índice `unique` em `nome`.
   - Critério: segunda inserção igual falha com erro de duplicado.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (queries práticas e fundamentos de indexação).
