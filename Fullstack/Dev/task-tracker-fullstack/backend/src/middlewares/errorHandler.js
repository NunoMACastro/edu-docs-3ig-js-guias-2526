/**
 * Middleware final de erro.
 *
 * Recebe erros inesperados e devolve uma resposta JSON segura.
 * Em produção, evita expor detalhes internos da aplicação ao cliente.
 *
 * @param {Error} error - Erro apanhado pelo Express.
 * @param {import("express").Request} _req - Pedido HTTP original.
 * @param {import("express").Response} res - Resposta HTTP enviada ao cliente.
 * @param {import("express").NextFunction} _next - Próximo middleware, não usado aqui.
 * @returns {void}
 */
export function errorHandler(error, _req, res, _next) {
    console.error(error);

    const status = Number(error.status || error.statusCode || 500);
    const safeStatus = status >= 400 && status < 500 ? status : 500;

    res.status(safeStatus).json({
        error: {
            code: safeStatus === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST",
            message:
                safeStatus === 500
                    ? "Erro interno do servidor"
                    : "Pedido inválido",
            details: [],
        },
    });
}
