import { translateQuestionsToPortuguese } from "./translationApi.js";

const TRIVIA_API_URL = "https://opentdb.com/api.php";

/**
 * Converte texto codificado pela API para texto normal.
 * @param {string} value - Texto codificado pela Open Trivia DB.
 * @returns {string} Texto legível.
 */
function decodeApiText(value) {
    return decodeURIComponent(value);
}

/**
 * Normaliza uma pergunta externa para o formato usado pela app.
 * @param {object} apiQuestion - Pergunta da Open Trivia DB.
 * @param {number} index - Posição da pergunta no resultado.
 * @returns {object} Pergunta no formato interno.
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
 * Carrega perguntas da Open Trivia DB e tenta traduzi-las para português.
 * @param {string} difficulty - Dificuldade escolhida pelo jogador.
 * @param {number} amount - Quantidade de perguntas.
 * @param {AbortSignal} signal - Sinal para cancelar o pedido.
 * @returns {Promise<object[]>} Perguntas normalizadas.
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
        throw new Error("Não foi possível contactar a API de perguntas.");
    }

    const data = await response.json();

    if (data.response_code !== 0) {
        throw new Error("A API não devolveu perguntas para esta configuração.");
    }

    const normalizedQuestions = data.results.map(normalizeQuestion);

    return translateQuestionsToPortuguese(normalizedQuestions, signal);
}

