# MongoDB (12.º Ano) - 05 · Mongoose: schemas e models

> **Objetivo deste ficheiro**
> Usar Mongoose para definir schema, validações e models.
> Comparar abordagem Mongoose com Node driver.
> Implementar CRUD com timestamps e regras de negócio básicas.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Porque usar Mongoose](#sec-1)
- [2. [ESSENCIAL] Schema de tarefa](#sec-2)
- [3. [ESSENCIAL] Model e operações CRUD](#sec-3)
- [4. [ESSENCIAL] Populate e referências](#sec-4)
- [5. [EXTRA] Hooks e métodos úteis](#sec-5)
- [Exercícios - Mongoose](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** dominar schema/model antes de hooks.
- **Como estudar:** migrar uma rota do driver para Mongoose e comparar.
- **Ligação útil:** `../Node/07_erros_e_async_handler.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Porque usar Mongoose

Vantagens no contexto do curso:

- validação declarativa no schema;
- defaults e timestamps automáticos;
- operações de alto nível mais curtas.

Trade-off:

- abstração adicional (menos “cru” que driver).

<a id="sec-2"></a>

## 2. [ESSENCIAL] Schema de tarefa

```js
import mongoose from "mongoose";

const tarefaSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "Título obrigatório"],
            trim: true,
            minlength: [3, "Título curto"],
            maxlength: [120, "Título longo"],
        },
        feito: { type: Boolean, default: false },
        prioridade: {
            type: String,
            enum: ["baixa", "normal", "alta"],
            default: "normal",
        },
        categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria" },
    },
    { timestamps: true }
);

export const Tarefa = mongoose.model("Tarefa", tarefaSchema);
```

<a id="sec-3"></a>

## 3. [ESSENCIAL] Model e operações CRUD

```js
export async function listTarefas({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Tarefa.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Tarefa.countDocuments(),
    ]);
    return { items, page, limit, total };
}

export async function createTarefa(data) {
    return Tarefa.create(data);
}

export async function patchTarefa(id, data) {
    return Tarefa.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}
```

> **Nota importante:** em `findByIdAndUpdate`, usar `runValidators: true` para manter regras do schema.

<a id="sec-4"></a>

## 4. [ESSENCIAL] Populate e referências

Quando precisas mostrar dados da categoria junto da tarefa:

```js
const tarefas = await Tarefa.find()
    .populate("categoriaId", "nome cor")
    .sort({ createdAt: -1 });
```

Usa `populate` com moderação para não carregar dados desnecessários.

<a id="sec-5"></a>

## 5. [EXTRA] Hooks e métodos úteis

```js
tarefaSchema.pre("save", function (next) {
    if (this.isModified("titulo")) {
        this.titulo = this.titulo.trim();
    }
    next();
});
```

Outros extras úteis:

- métodos estáticos para queries repetidas;
- virtuals para dados derivados (não persistidos).

<a id="exercicios"></a>

## Exercícios - Mongoose

1. **Schema com validações**
   - Cria schema `Tarefa` com `titulo`, `feito`, `prioridade`.
   - Critério: rejeita títulos vazios e prioridade inválida.
2. **CRUD paginado**
   - Implementa lista com `page/limit`.
   - Critério: devolve envelope com `total`.
3. **Referência de categoria**
   - Adiciona `categoriaId` e usa `populate`.
   - Critério: resposta inclui dados mínimos da categoria.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (schemas, models, CRUD e populate).
