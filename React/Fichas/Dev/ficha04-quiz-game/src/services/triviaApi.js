import { translateQuestionsToPortuguese } from "./translationApi";

const TRIVIA_API_URL = "https://opentdb.com/api.php";

/**
 * Propósito: transformar texto codificado pela API em texto legível.
 * Produz/Devolve: devolve uma string já descodificada para poder aparecer na interface.
 * @param {string} value - Texto recebido da API em formato URL encoded.
 * @returns {string} Texto descodificado para mostrar ao utilizador.
 */
function decodeApiText(value) {
    // A API devolve texto codificado quando usamos encode=url3986.
    // decodeURIComponent transforma esse texto em algo legível no ecrã.
    // Fazemos isto no serviço para os componentes receberem sempre texto já tratado.
    return decodeURIComponent(value);
}

/**
 * Propósito: adaptar uma pergunta da Open Trivia DB ao formato usado pela nossa app.
 * Produz/Devolve: devolve um objeto com id, question, correctAnswer e incorrectAnswers.
 * @param {object} apiQuestion - Pergunta recebida diretamente da Open Trivia DB.
 * @param {number} index - Posição da pergunta na lista, usada para ajudar a criar um id.
 * @returns {object} Pergunta normalizada para o formato interno da aplicação.
 */
function normalizeQuestion(apiQuestion, index) {
    // Primeiro descodificamos a pergunta para evitar caracteres estranhos.
    // A UI não deve ter de saber se o texto veio codificado pela API.
    const question = decodeApiText(apiQuestion.question);

    // A app não deve depender diretamente do formato da API.
    // Por isso transformamos tudo para o formato interno usado desde as perguntas locais.
    // Esta normalização permite trocar dados locais por dados externos sem reescrever os componentes.
    return {
        // ID simples e estável o suficiente para esta ficha.
        // Combinar índice e texto reduz a hipótese de chaves repetidas nos exemplos.
        id: `api-question-${index}-${question}`,
        question,

        // A API usa snake_case; a app usa camelCase.
        // Adaptar nomes aqui mantém o resto do código consistente com JavaScript moderno.
        correctAnswer: decodeApiText(apiQuestion.correct_answer),

        // Cada resposta errada também precisa de ser descodificada.
        // Se tratássemos só a pergunta, as opções ainda poderiam aparecer com símbolos codificados.
        incorrectAnswers: apiQuestion.incorrect_answers.map(decodeApiText),
    };
}

/**
 * Propósito: pedir perguntas à Open Trivia DB e prepará-las para a aplicação.
 * Produz/Devolve: devolve uma Promise com perguntas normalizadas e traduzidas quando possível.
 * @param {string} difficulty - Dificuldade escolhida pelo jogador para o pedido à API.
 * @param {AbortSignal} signal - Sinal que permite cancelar o pedido se a app já não precisar dele.
 * @returns {Promise<object[]>} Promise resolvida com perguntas prontas a usar no quiz.
 */
export async function fetchTriviaQuestions(difficulty, signal) {
    // URLSearchParams constrói a query string de forma segura e legível.
    // Evita montar URLs manualmente com concatenações difíceis de rever.
    const params = new URLSearchParams({
        // Mantemos 5 perguntas para a ficha continuar curta.
        // Um número pequeno reduz tempo de espera e facilita testar todos os estados.
        amount: "5",

        // type=multiple garante 1 resposta certa + 3 erradas.
        // Isto bate certo com o formato que a app já aprendeu nas perguntas locais.
        type: "multiple",

        // difficulty vem do state/controlado pelo utilizador.
        // O serviço recebe a dificuldade já escolhida; não lê diretamente a UI.
        difficulty,

        // Facilita a descodificação dos textos.
        // Como escolhemos url3986, sabemos que decodeURIComponent é a ferramenta certa.
        encode: "url3986",
    });

    // O signal permite cancelar o pedido se o jogo for reiniciado rapidamente.
    // Isto evita atualizar state com uma resposta antiga que já não interessa.
    const response = await fetch(`${TRIVIA_API_URL}?${params}`, { signal });

    // response.ok valida erros HTTP, por exemplo 500 ou 404.
    // fetch só rejeita por erro de rede; por isso temos de tratar status HTTP manualmente.
    if (!response.ok) {
        throw new Error("Não foi possível contactar a API.");
    }

    // Converte o corpo JSON da resposta num objeto JavaScript.
    // A partir daqui podemos validar response_code e mapear results.
    const data = await response.json();

    // response_code é uma regra específica da Open Trivia DB.
    // 0 significa sucesso.
    // Mesmo com HTTP 200, a API pode dizer que não encontrou perguntas para esta configuração.
    if (data.response_code !== 0) {
        throw new Error("A API não devolveu perguntas para esta configuração.");
    }

    // Mesmo com response_code 0, validamos se existe uma lista utilizável.
    // Assim evitamos entrar no jogo sem perguntas ou com uma resposta inesperada.
    if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error("A API não devolveu perguntas válidas.");
    }

    // A tradução só recebe perguntas já normalizadas e validadas.
    // Se a tradução falhar, o próprio serviço de tradução mantém o texto original.
    const normalizedQuestions = data.results.map(normalizeQuestion);

    return translateQuestionsToPortuguese(normalizedQuestions, signal);
}
