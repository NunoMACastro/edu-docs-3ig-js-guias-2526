![Header](../Images/Header.png)

# MongoDB (12.º Ano) - 08 · Validação e erros

> **Objetivo deste ficheiro**
> Fechar o ciclo técnico com validação e tratamento de erros.
> Uniformizar respostas de erro em APIs com MongoDB.
> Aplicar regra didática: `INVALID_ID` vs `NOT_FOUND`.

---

## Índice

- [0. Enquadramento do material](#sec-0)
- [1. [ESSENCIAL] Validação de input antes da BD](#sec-1)
- [2. [ESSENCIAL] Regra de IDs: 400 vs 404](#sec-2)
- [3. [ESSENCIAL] Erros frequentes no Mongo/Mongoose](#sec-3)
- [4. [ESSENCIAL] Middleware de erro consistente](#sec-4)
- [5. [EXTRA] Checklist de robustez para entrega](#sec-5)
- [Exercícios - Validação e erros](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Enquadramento do material

Esta secção situa o ficheiro dentro do módulo de MongoDB e clarifica a relação entre dados, API e aplicação fullstack.

- **Núcleo do tema:** as secções [ESSENCIAL] apresentam os conceitos de base para trabalhar com documentos, consultas ou validação.
- **Aprofundamento:** as secções [EXTRA] acrescentam contexto, optimizações ou alternativas úteis em projetos mais completos.
- **Ligação ao percurso:** os exemplos e exercícios relacionam MongoDB com Node, Express, React e contratos de API.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Validação de input antes da BD

Exemplo para `POST /api/tarefas`:

```js
function validateCreateTarefa(body) {
    const errors = [];

    if (!body || typeof body.titulo !== "string" || body.titulo.trim().length < 3) {
        errors.push({ field: "titulo", message: "Título obrigatório (mínimo 3 chars)" });
    }

    if (body?.feito !== undefined && typeof body.feito !== "boolean") {
        errors.push({ field: "feito", message: "feito deve ser boolean" });
    }

    return errors;
}
```

Se `errors.length > 0`:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Dados inválidos", "details": [] } }
```

<a id="sec-2"></a>

## 2. [ESSENCIAL] Regra de IDs: 400 vs 404

Regra do curso:

- ID malformado (`abc`) -> `400 INVALID_ID`
- ID válido mas inexistente -> `404 NOT_FOUND`

### Com Node driver

```js
import { ObjectId } from "mongodb";

if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: { code: "INVALID_ID", message: "ID inválido", details: [] } });
}
```

### Com Mongoose

```js
import mongoose from "mongoose";

if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: { code: "INVALID_ID", message: "ID inválido", details: [] } });
}
```

<a id="sec-3"></a>

## 3. [ESSENCIAL] Erros frequentes no Mongo/Mongoose

- `11000 duplicate key` -> `409 DUPLICATE_KEY`
- `ValidationError` (Mongoose) -> `422 VALIDATION_ERROR`
- cast inválido de id -> `400 INVALID_ID`

Mapeamento útil:

```js
function mapDbError(err) {
    if (err?.code === 11000) {
        return { status: 409, code: "DUPLICATE_KEY", message: "Valor já existente" };
    }
    if (err?.name === "ValidationError") {
        return { status: 422, code: "VALIDATION_ERROR", message: "Dados inválidos" };
    }
    return { status: 500, code: "INTERNAL_ERROR", message: "Erro interno" };
}
```

<a id="sec-4"></a>

## 4. [ESSENCIAL] Middleware de erro consistente

```js
export function errorHandler(err, req, res, next) {
    const mapped = mapDbError(err);

    res.status(mapped.status).json({
        error: {
            code: mapped.code,
            message: mapped.message,
            details: err?.details ?? [],
        },
    });
}
```

Objetivo: frontend nunca ter de adivinhar formato de erro.

<a id="sec-5"></a>

## 5. [EXTRA] Checklist de robustez para entrega

- Todas as rotas devolvem erro no mesmo formato.
- `INVALID_ID` e `NOT_FOUND` estão distintos.
- `PATCH` usa validação de campos permitidos.
- Erros de duplicado mapeados para `409`.

<a id="exercicios"></a>

## Exercícios - Validação e erros

1. **POST inválido**
   - Envia `titulo` vazio.
   - Critério: `422 VALIDATION_ERROR` com `details`.
2. **GET por id**
   - Testa id malformado e id inexistente.
   - Critério: `400` e `404` corretos.
3. **Duplicado com índice unique**
   - Cria duas categorias com mesmo `nome`.
   - Critério: `409 DUPLICATE_KEY`.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (validação, mapeamento de erros e contrato de erro).

![Footer](../Images/Footer.png)
