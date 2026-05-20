const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

/**
 * Lê a resposta HTTP e lança um erro quando o status não indica sucesso.
 *
 * O fetch só rejeita automaticamente em falhas de rede.
 * Por isso, respostas como 400, 404 ou 422 precisam de validação manual com response.ok.
 *
 * @param {Response} response - Resposta devolvida pelo fetch.
 * @returns {Promise<any>} Corpo JSON da resposta.
 * @throws {Error} Lança erro com mensagem vinda da API ou mensagem genérica.
 */
async function parseJsonOrThrow(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.error?.message || "Pedido falhou";
        throw new Error(message);
    }

    return data;
}

/**
 * Vai buscar a lista de tarefas ao backend.
 *
 * @returns {Promise<Array<{_id:string, titulo:string, feito:boolean}>>} Lista de tarefas.
 */
export async function getTarefas() {
    const response = await fetch(`${API_BASE_URL}/api/tarefas`);
    return await parseJsonOrThrow(response);
}

/**
 * Envia uma nova tarefa para o backend.
 *
 * @param {{titulo:string}} input - Dados necessários para criar a tarefa.
 * @returns {Promise<{_id:string, titulo:string, feito:boolean}>} Tarefa criada pela API.
 */
export async function createTarefa(input) {
    const response = await fetch(`${API_BASE_URL}/api/tarefas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    return await parseJsonOrThrow(response);
}
