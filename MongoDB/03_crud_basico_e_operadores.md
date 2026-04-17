# MongoDB (12.º Ano) - 03 · CRUD básico e operadores

> **Objetivo deste ficheiro**
> Dominar operações CRUD base em MongoDB.
> Usar filtros, projeções e operadores de forma segura.
> Preparar a API para paginação e pesquisa.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Criar e ler documentos](#sec-1)
- [2. [ESSENCIAL] Atualizar com segurança](#sec-2)
- [3. [ESSENCIAL] Remover (hard delete e soft delete)](#sec-3)
- [4. [ESSENCIAL] Filtros e projeções úteis](#sec-4)
- [5. [EXTRA] Operadores frequentes](#sec-5)
- [Exercícios - CRUD](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** começa por `insert/find/update/delete` antes de operadores avançados.
- **Como estudar:** executa cada operação e observa o resultado no Atlas.
- **Ligação útil:** `../Fullstack/02_contrato_api_e_erros.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Criar e ler documentos

```js
const col = db.collection("tarefas");

await col.insertOne({ titulo: "Estudar Node", feito: false, tags: ["backend"] });

const items = await col
    .find({ feito: false })
    .project({ titulo: 1, feito: 1 })
    .toArray();
```

Boas práticas:

- Inserir sempre estrutura mínima válida.
- Na leitura, projetar apenas campos necessários para a UI.

<a id="sec-2"></a>

## 2. [ESSENCIAL] Atualizar com segurança

Evita substituir documentos completos sem necessidade.

```js
await col.updateOne(
    { _id: tarefaId },
    {
        $set: { feito: true, updatedAt: new Date() },
        $currentDate: { atualizadoEm: true },
    }
);
```

Para vários documentos:

```js
await col.updateMany({ feito: false }, { $set: { prioridade: "normal" } });
```

<a id="sec-3"></a>

## 3. [ESSENCIAL] Remover (hard delete e soft delete)

### Hard delete

```js
await col.deleteOne({ _id: tarefaId });
```

### Soft delete (recomendado quando precisas de histórico)

```js
await col.updateOne(
    { _id: tarefaId },
    { $set: { deletedAt: new Date(), ativo: false } }
);
```

<a id="sec-4"></a>

## 4. [ESSENCIAL] Filtros e projeções úteis

```js
const page = 1;
const limit = 20;
const q = "react";

const filter = {
    deletedAt: { $exists: false },
    titulo: { $regex: q, $options: "i" },
};

const items = await col
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .project({ titulo: 1, feito: 1, createdAt: 1 })
    .toArray();

const total = await col.countDocuments(filter);
```

<a id="sec-5"></a>

## 5. [EXTRA] Operadores frequentes

- `$in` / `$nin`: listas de valores.
- `$gte` / `$lte`: intervalos numéricos ou datas.
- `$regex`: pesquisa textual simples.
- `$exists`: campo existe/não existe.
- `$or` / `$and`: condições compostas.

Exemplo:

```js
await col.find({
    $or: [
        { prioridade: "alta" },
        { prazo: { $lte: new Date("2026-05-01") } },
    ],
});
```

<a id="exercicios"></a>

## Exercícios - CRUD

1. **API base de tarefas**
   - Implementa `GET` e `POST` com coleção `tarefas`.
   - Critério: contrato JSON coerente.
2. **PATCH parcial**
   - Permite atualizar `titulo` e `feito` sem substituir documento inteiro.
   - Critério: usa `$set`.
3. **Paginação + total**
   - Implementa `page`, `limit`, `total`.
   - Critério: frontend consegue paginar.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (CRUD, filtros e operadores essenciais).
