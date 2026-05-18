const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";
const SOURCE_LANGUAGE = "en";
const TARGET_LANGUAGE = "pt-PT";

/**
 * Propósito: traduzir um texto simples de inglês para português usando a MyMemory.
 * Produz/Devolve: devolve uma Promise com o texto traduzido ou com o texto original se faltar tradução.
 * @param {string} text - Texto que vai ser enviado para a API de tradução.
 * @param {AbortSignal} signal - Sinal usado para cancelar o pedido se o jogo já não precisar dele.
 * @returns {Promise<string>} Promise resolvida com o texto traduzido ou com o texto original.
 */
async function translateTextToPortuguese(text, signal) {
    // Proteção simples: se o texto estiver vazio, não vale a pena chamar a API.
    // Evita pedidos inúteis e reduz o risco de atingir limites gratuitos.
    if (!text.trim()) return text;

    // A MyMemory usa query string, por isso URLSearchParams ajuda a codificar o texto.
    // Isto é importante porque perguntas podem ter espaços, símbolos e pontuação.
    const params = new URLSearchParams({
        q: text,
        langpair: `${SOURCE_LANGUAGE}|${TARGET_LANGUAGE}`,
    });

    // Cada tradução é um pedido GET.
    // O signal segue junto para permitir cancelar traduções pendentes se o jogo mudar.
    const response = await fetch(`${MYMEMORY_API_URL}?${params}`, { signal });

    if (!response.ok) {
        throw new Error("Não foi possível traduzir o texto.");
    }

    const data = await response.json();

    // responseData.translatedText é o campo principal usado pela API.
    // Se ele não existir, devolvemos o texto original como fallback local.
    // O objetivo é melhorar a experiência, não impedir o jogo por causa da tradução.
    return data.responseData?.translatedText || text;
}

/**
 * Propósito: traduzir a pergunta, a resposta certa e as respostas erradas.
 * Produz/Devolve: devolve uma pergunta com a mesma estrutura, mas com os textos traduzidos quando possível.
 * @param {object} question - Pergunta já normalizada para o formato interno da aplicação.
 * @param {AbortSignal} signal - Sinal que permite cancelar os pedidos de tradução desta pergunta.
 * @returns {Promise<object>} Promise resolvida com a pergunta traduzida ou com a pergunta original.
 */
export async function translateQuestionToPortuguese(question, signal) {
    try {
        // Juntamos todos os textos da pergunta numa lista.
        // Traduzir pergunta e respostas em conjunto mantém o formato interno fácil de reconstruir.
        const textsToTranslate = [
            question.question,
            question.correctAnswer,
            ...question.incorrectAnswers,
        ];

        // Traduzimos os textos da mesma pergunta em paralelo.
        // Isto torna cada pergunta mais rápida do que traduzir pergunta, certa e erradas uma a uma.
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
        // AbortError deve continuar a subir para o useEffect cancelar corretamente.
        // Se engolíssemos este erro, a app poderia tratar um cancelamento como tradução falhada normal.
        if (error.name === "AbortError") throw error;

        // Se a tradução falhar, mantemos a pergunta original em inglês.
        // Este fallback preserva o jogo mesmo quando a segunda API está indisponível.
        return question;
    }
}

/**
 * Propósito: traduzir uma lista de perguntas depois de elas já estarem normalizadas.
 * Produz/Devolve: devolve uma Promise com a lista final usada pelo jogo.
 * @param {object[]} questions - Lista de perguntas antes da tradução.
 * @param {AbortSignal} signal - Sinal que permite cancelar o processo de tradução.
 * @returns {Promise<object[]>} Promise resolvida com perguntas traduzidas sempre que possível.
 */
export async function translateQuestionsToPortuguese(questions, signal) {
    const translatedQuestions = [];

    // Usamos ciclo sequencial para ser mais simpático com a API gratuita.
    // Dentro de cada pergunta, os 5 textos continuam a ser traduzidos em paralelo.
    // É um compromisso: menos pressão sobre a API, mas ainda com alguma velocidade por pergunta.
    for (const question of questions) {
        const translatedQuestion = await translateQuestionToPortuguese(
            question,
            signal,
        );

        translatedQuestions.push(translatedQuestion);
    }

    return translatedQuestions;
}
