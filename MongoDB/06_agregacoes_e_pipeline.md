# MongoDB (12.º Ano) - 06 · Agregações e pipeline

> **Objetivo deste ficheiro**
> Introduzir pipelines de agregação com casos úteis para APIs.
> Aplicar `match`, `group`, `project`, `sort` e `limit`.
> Perceber quando usar agregação em vez de lógica no frontend.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O que é um pipeline](#sec-1)
- [2. [ESSENCIAL] Etapas mais usadas](#sec-2)
- [3. [ESSENCIAL] Exemplos práticos (tarefas)](#sec-3)
- [4. [ESSENCIAL] Agregar por período](#sec-4)
- [5. [EXTRA] Dicas de performance em agregações](#sec-5)
- [Exercícios - Agregações](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** primeiro acertar resultados, depois otimizar.
- **Como estudar:** executa pipeline no Atlas e replica no Node.
- **Ligação útil:** `../React/15_upload_paginacao_filtros_e_cliente_api.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é um pipeline

Pipeline é uma sequência de etapas que transforma documentos.

Exemplo mental:

1. filtrar (`$match`),
2. agrupar (`$group`),
3. formatar (`$project`),
4. ordenar (`$sort`).

<a id="sec-2"></a>

## 2. [ESSENCIAL] Etapas mais usadas

- `$match`: filtrar dados de entrada.
- `$group`: calcular totais/médias por grupo.
- `$project`: escolher e transformar campos.
- `$sort`: ordenar resultado.
- `$limit`: limitar linhas de saída.
- `$unwind`: explodir arrays.

<a id="sec-3"></a>

## 3. [ESSENCIAL] Exemplos práticos (tarefas)

### Total de tarefas por estado `feito`

```js
const rows = await db.collection("tarefas").aggregate([
    { $match: { deletedAt: { $exists: false } } },
    { $group: { _id: "$feito", total: { $sum: 1 } } },
    { $project: { _id: 0, feito: "$_id", total: 1 } },
    { $sort: { feito: 1 } },
]).toArray();
```

### Top categorias com mais tarefas

```js
const rows = await db.collection("tarefas").aggregate([
    { $match: { deletedAt: { $exists: false } } },
    { $group: { _id: "$categoriaId", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
]).toArray();
```

<a id="sec-4"></a>

## 4. [ESSENCIAL] Agregar por período

```js
const rows = await db.collection("tarefas").aggregate([
    {
        $group: {
            _id: {
                ano: { $year: "$createdAt" },
                mes: { $month: "$createdAt" },
            },
            total: { $sum: 1 },
        },
    },
    { $sort: { "_id.ano": 1, "_id.mes": 1 } },
]).toArray();
```

Isto é útil para dashboards simples sem lógica pesada no frontend.

<a id="sec-5"></a>

## 5. [EXTRA] Dicas de performance em agregações

- Filtra cedo com `$match` para reduzir volume.
- Usa índices nos campos de filtro/ordenação.
- Evita pipelines gigantes sem necessidade didática.

<a id="exercicios"></a>

## Exercícios - Agregações

1. **Total por prioridade**
   - `baixa`, `normal`, `alta`.
   - Critério: devolve lista com totais.
2. **Top 3 tags**
   - Usa `$unwind` em `tags`.
   - Critério: resultado ordenado por total.
3. **Evolução mensal**
   - Agrupa por ano/mês com `createdAt`.
   - Critério: gráfico pode ser desenhado a partir do JSON.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (pipeline base e casos práticos).
