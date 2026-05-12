const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";
const SOURCE_LANGUAGE = "en";
const TARGET_LANGUAGE = "pt-PT";

/**
 * Traduz um segmento de texto de inglês para português.
 * @param {string} text - Texto original.
 * @param {AbortSignal} signal - Sinal para cancelar o pedido.
 * @returns {Promise<string>} Texto traduzido ou original.
 */
async function translateTextToPortuguese(text, signal) {
    if (!text.trim()) return text;

    const params = new URLSearchParams({
        q: text,
        langpair: `${SOURCE_LANGUAGE}|${TARGET_LANGUAGE}`,
    });

    const response = await fetch(`${MYMEMORY_API_URL}?${params}`, { signal });

    if (!response.ok) {
        throw new Error("Não foi possível traduzir o texto.");
    }

    const data = await response.json();

    return data.responseData?.translatedText || text;
}

/**
 * Traduz uma pergunta completa. Se a tradução falhar, devolve a original.
 * @param {object} question - Pergunta normalizada.
 * @param {AbortSignal} signal - Sinal para cancelar os pedidos.
 * @returns {Promise<object>} Pergunta traduzida ou original.
 */
export async function translateQuestionToPortuguese(question, signal) {
    try {
        const textsToTranslate = [
            question.question,
            question.correctAnswer,
            ...question.incorrectAnswers,
        ];

        const translatedTexts = await Promise.all(
            textsToTranslate.map((text) =>
                translateTextToPortuguese(text, signal),
            ),
        );

        const [
            translatedQuestion,
            translatedCorrectAnswer,
            ...translatedIncorrectAnswers
        ] = translatedTexts;

        return {
            ...question,
            question: translatedQuestion,
            correctAnswer: translatedCorrectAnswer,
            incorrectAnswers: translatedIncorrectAnswers,
        };
    } catch (error) {
        if (error.name === "AbortError") throw error;
        return question;
    }
}

/**
 * Traduz uma lista de perguntas com um ritmo simples para não abusar da API.
 * @param {object[]} questions - Lista de perguntas normalizadas.
 * @param {AbortSignal} signal - Sinal de cancelamento.
 * @returns {Promise<object[]>} Perguntas traduzidas quando possível.
 */
export async function translateQuestionsToPortuguese(questions, signal) {
    const translatedQuestions = [];

    for (const question of questions) {
        const translatedQuestion = await translateQuestionToPortuguese(
            question,
            signal,
        );

        translatedQuestions.push(translatedQuestion);
    }

    return translatedQuestions;
}

