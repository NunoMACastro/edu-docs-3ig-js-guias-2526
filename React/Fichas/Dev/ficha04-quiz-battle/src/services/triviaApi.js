const TRIVIA_API_URL = "https://opentdb.com/api.php";

/**
 * Converte texto codificado pela API para texto normal.
 * @param {string} value - Texto codificado pela Open Trivia DB.
 * @returns {string} Texto pronto a mostrar na interface.
 */
function decodeApiText(value) {
    return decodeURIComponent(value);
}

/**
 * Transforma uma pergunta da API no formato usado pela aplicação.
 * @param {object} apiQuestion - Pergunta devolvida pela Open Trivia DB.
 * @param {number} index - Posição da pergunta na lista.
 * @returns {object} Pergunta normalizada para a app.
 */
function normalizeQuestion(apiQuestion, index) {
    const question = decodeApiText(apiQuestion.question);

    return {
        id: `api-question-${index}-${question}`,
        question,
        correctAnswer: decodeApiText(apiQuestion.correct_answer),
        incorrectAnswers: apiQuestion.incorrect_answers.map(decodeApiText),
    };
}

/**
 * Carrega perguntas da Open Trivia DB.
 * @param {string} difficulty - Dificuldade escolhida pelo jogador.
 * @param {number} amount - Número de perguntas a carregar.
 * @param {AbortSignal} signal - Sinal usado para cancelar o pedido.
 * @returns {Promise<object[]>} Lista de perguntas normalizadas.
 */
export async function fetchTriviaQuestions(difficulty, amount, signal) {
    const params = new URLSearchParams({
        amount: String(amount),
        type: "multiple",
        difficulty,
        encode: "url3986",
    });

    const response = await fetch(`${TRIVIA_API_URL}?${params}`, { signal });

    if (!response.ok) {
        throw new Error("Não foi possível contactar a API.");
    }

    const data = await response.json();

    if (data.response_code !== 0) {
        throw new Error("A API não devolveu perguntas para esta configuração.");
    }

    return data.results.map(normalizeQuestion);
}
