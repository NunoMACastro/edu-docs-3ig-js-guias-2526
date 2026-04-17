# MongoDB (12.º Ano) - 04 · Node driver: fundamentos

> **Objetivo deste ficheiro**
> Implementar MongoDB com o driver oficial no backend Node.
> Criar camada de acesso a dados limpa e reutilizável.
> Garantir integração estável com controllers Express.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Estrutura mínima recomendada](#sec-1)
- [2. [ESSENCIAL] Ligação singleton](#sec-2)
- [3. [ESSENCIAL] Repositório de tarefas (driver)](#sec-3)
- [4. [ESSENCIAL] Controller com contrato consistente](#sec-4)
- [5. [EXTRA] Conversão de `id` e ObjectId](#sec-5)
- [Exercícios - Node driver](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** primeiro monta ligação + repositório + controller.
- **Como estudar:** cria rota real e testa com Postman/Insomnia.
- **Ligações úteis:**
  - Node: `../Node/06_rotas_controladores_validacao.md`
  - Fullstack: `../Fullstack/01_fluxo_front_back_db.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Estrutura mínima recomendada

```text
src/
  db/
    mongo.js
  repositories/
    tarefas.repo.mongo.js
  controllers/
    tarefas.controller.js
  routes/
    tarefas.router.js
```

Separar responsabilidades evita misturar HTTP com acesso à BD.

<a id="sec-2"></a>

## 2. [ESSENCIAL] Ligação singleton

```js
// src/db/mongo.js
import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "escola";

if (!uri) throw new Error("MONGODB_URI em falta");

const client = new MongoClient(uri);
let db;

export async function getDb() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}
```

<a id="sec-3"></a>

## 3. [ESSENCIAL] Repositório de tarefas (driver)

```js
// src/repositories/tarefas.repo.mongo.js
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo.js";

const COLLECTION = "tarefas";

export async function listTarefas({ page = 1, limit = 20 }) {
    const db = await getDb();
    const col = db.collection(COLLECTION);
    const filter = { deletedAt: { $exists: false } };

    const [items, total] = await Promise.all([
        col.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray(),
        col.countDocuments(filter),
    ]);

    return { items, page, limit, total };
}

export async function createTarefa({ titulo }) {
    const db = await getDb();
    const col = db.collection(COLLECTION);
    const now = new Date();

    const doc = { titulo, feito: false, createdAt: now, updatedAt: now };
    const result = await col.insertOne(doc);
    return { ...doc, _id: result.insertedId };
}

export async function patchTarefa(id, data) {
    const db = await getDb();
    const col = db.collection(COLLECTION);

    const update = { $set: { ...data, updatedAt: new Date() } };
    const result = await col.findOneAndUpdate(
        { _id: new ObjectId(id), deletedAt: { $exists: false } },
        update,
        { returnDocument: "after" }
    );

    return result;
}
```

<a id="sec-4"></a>

## 4. [ESSENCIAL] Controller com contrato consistente

```js
// src/controllers/tarefas.controller.js
import * as repo from "../repositories/tarefas.repo.mongo.js";

export async function getTarefas(req, res, next) {
    try {
        const page = Math.max(1, Number(req.query.page || 1));
        const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
        const data = await repo.listTarefas({ page, limit });
        res.json(data);
    } catch (err) {
        next(err);
    }
}
```

<a id="sec-5"></a>

## 5. [EXTRA] Conversão de `id` e ObjectId

- Converter `id` para `ObjectId` no repositório.
- Se o formato for inválido, devolver `400 INVALID_ID`.
- Se for válido mas não existir documento, devolver `404 NOT_FOUND`.

```js
import { ObjectId } from "mongodb";

if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: { code: "INVALID_ID", message: "ID inválido", details: [] } });
}
```

<a id="exercicios"></a>

## Exercícios - Node driver

1. **Criar `GET /api/tarefas`**
   - Repositório + controller com paginação.
   - Critério: devolve `{ items, page, limit, total }`.
2. **Criar `POST /api/tarefas`**
   - Validar `titulo` e inserir documento.
   - Critério: `201` com documento criado.
3. **PATCH por id**
   - Atualizar `feito`.
   - Critério: `400` id inválido, `404` não encontrado, `200` sucesso.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (integração Node driver com estrutura de API).
