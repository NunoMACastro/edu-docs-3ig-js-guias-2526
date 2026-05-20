import { Tarefa } from "../models/Tarefa.js";

/**
 * Lista todas as tarefas guardadas na base de dados.
 *
 * Fluxo:
 * 1. Procura tarefas no MongoDB.
 * 2. Ordena pelas mais recentes.
 * 3. Devolve a lista em JSON.
 *
 * @param {import("express").Request} _req - Pedido HTTP recebido pelo Express.
 * @param {import("express").Response} res - Resposta HTTP enviada ao cliente.
 * @param {import("express").NextFunction} next - Função usada para encaminhar erros.
 * @returns {Promise<void>}
 */
export async function listarTarefas(_req, res, next) {
    try {
        const tarefas = await Tarefa.find().sort({ createdAt: -1 });
        res.status(200).json(tarefas);
    } catch (error) {
        next(error);
    }
}

/**
 * Cria uma nova tarefa na base de dados.
 *
 * Nesta fase, o titulo já foi validado pelo middleware validateTitulo.
 * O campo feito não vem do frontend porque uma tarefa nova começa sempre por fazer.
 *
 * @param {import("express").Request} req - Pedido HTTP com o body da nova tarefa.
 * @param {import("express").Response} res - Resposta HTTP enviada ao cliente.
 * @param {import("express").NextFunction} next - Função usada para encaminhar erros.
 * @returns {Promise<void>}
 */
export async function criarTarefa(req, res, next) {
    try {
        const novaTarefa = await Tarefa.create({
            titulo: req.body.titulo,
        });

        res.status(201).json(novaTarefa);
    } catch (error) {
        next(error);
    }
}
