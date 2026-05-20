import mongoose from "mongoose";

/**
 * Schema da coleção de tarefas.
 *
 * Cada tarefa tem:
 * - titulo: texto obrigatório;
 * - feito: booleano com valor inicial false;
 * - createdAt/updatedAt: datas criadas automaticamente pelo Mongoose.
 */
const tarefaSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "Título obrigatório"],
            trim: true,
            minlength: [1, "Título obrigatório"],
            maxlength: [120, "Título demasiado longo"],
        },
        feito: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

/**
 * Model Mongoose usado pelos controllers para ler e escrever tarefas.
 */
export const Tarefa = mongoose.model("Tarefa", tarefaSchema);
