/**
 * Valida o campo titulo antes de criar uma tarefa.
 *
 * Este middleware corre antes do controller de POST.
 * Se o titulo for inválido, a função termina a resposta com status 422.
 * Se o titulo for válido, limpa espaços extra e chama next().
 *
 * @param {import("express").Request} req - Pedido HTTP recebido pelo Express.
 * @param {import("express").Response} res - Resposta HTTP que será enviada ao cliente.
 * @param {import("express").NextFunction} next - Função que passa para o próximo middleware/controller.
 * @returns {void}
 */
export function validateTitulo(req, res, next) {
    const titulo = req.body?.titulo;

    if (typeof titulo !== "string" || titulo.trim() === "") {
        res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Título obrigatório",
                details: [],
            },
        });
        return;
    }

    const tituloLimpo = titulo.trim();

    if (tituloLimpo.length > 120) {
        res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Título demasiado longo",
                details: [],
            },
        });
        return;
    }

    req.body.titulo = tituloLimpo;
    next();
}
