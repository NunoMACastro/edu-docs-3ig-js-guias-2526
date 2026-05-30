import { useEffect, useMemo, useRef, useState } from "react";
import ErrorState from "./components/ErrorState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import StartScreen from "./components/StartScreen.jsx";
import { useGameSettings } from "./context/GameSettingsContext.jsx";
import { localQuestions } from "./data/localQuestions";
import { fetchTriviaQuestions } from "./services/triviaApi";

const QUESTION_TIME_LIMIT = 15;

/**
 * Propósito: baralhar respostas sem alterar o array original.
 * Produz/Devolve: devolve uma cópia da lista recebida com a ordem alterada.
 * @param {string[]} items - Lista de respostas que pode ser baralhada.
 * @returns {string[]} Nova lista com os mesmos itens noutra ordem.
 */
function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

/**
 * Propósito: coordenar o jogo completo, juntando estado, efeitos, API, contexto e componentes.
 * Produz/Devolve: devolve o ecrã certo conforme o estado atual do jogo.
 * @returns {JSX.Element} JSX principal da aplicação de quiz.
 */
function App() {
    // Preferências globais vêm do Context.
    // Assim, deixam de ter de ser passadas manualmente por vários níveis.
    // Isto resolve o caso de prop drilling sem transformar todas as props em Context.
    const {
        playerName,
        setPlayerName,
        difficulty,
        setDifficulty,
        theme,
        toggleTheme,
    } = useGameSettings();

    // Estado do fluxo principal da app.
    // Decide que ecrã é renderizado: idle, loading, error, playing ou finished.
    // Um único estado textual é mais fácil de manter do que vários booleans que podem entrar em conflito.
    const [gameStatus, setGameStatus] = useState("idle");

    // Lista de perguntas atualmente usada pelo jogo.
    // Começa com perguntas locais para a app ter uma base segura.
    // Depois da API, este mesmo state passa a guardar perguntas externas traduzidas quando possível.
    const [questions, setQuestions] = useState(localQuestions);

    // Índice da pergunta atual dentro de questions.
    // Guardar o índice mantém a pergunta atual derivada da lista, em vez de duplicar objetos em state.
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Histórico de resultados: true para certa, false para errada.
    // Este array é suficiente para calcular pontuação, percentagem e objetivo atingido.
    const [answerResults, setAnswerResults] = useState([]);

    // Tempo restante da pergunta atual.
    // É reiniciado sempre que o jogo começa ou avança para outra pergunta.
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);

    // Bloqueia respostas repetidas na mesma pergunta.
    // useRef muda imediatamente e evita duplo clique antes do próximo render.
    const answeredQuestionRef = useRef(-1);

    // Mensagem mostrada quando o pedido à API falha.
    // Guardamos a mensagem separada para o ErrorState poder apresentar feedback específico.
    const [errorMessage, setErrorMessage] = useState("");

    // Pedido explícito para iniciar um novo jogo via useEffect.
    // Guardamos a dificuldade escolhida no momento do clique em "Começar jogo".
    // Assim, mudar a dificuldade depois não dispara outro pedido automaticamente.
    const [gameRequest, setGameRequest] = useState(null);

    // Valor limpo usado na validação e no ecrã final.
    // trim evita que espaços extra contem como nome real.
    const cleanPlayerName = playerName.trim();

    // Regra mínima para poder começar.
    // Esta variável é usada no botão e no handler, mantendo a validação consistente.
    const canStartGame = cleanPlayerName.length >= 2;

    // Pergunta atual derivada do array e do índice.
    // Se a lista mudar ou o índice mudar, esta variável acompanha automaticamente.
    const currentQuestion = questions[currentQuestionIndex];

    // Total atual. Depois da API, pode ser diferente das perguntas locais.
    // Usar questions.length evita referências antigas a localQuestions.length.
    const totalQuestions = questions.length;

    const currentAnswers = useMemo(() => {
        if (!currentQuestion) return [];

        return shuffleItems([
            currentQuestion.correctAnswer,
            ...currentQuestion.incorrectAnswers,
        ]);
    }, [currentQuestion]);

    const gameStats = useMemo(() => {
        const correctAnswers = answerResults.filter(Boolean).length;
        const score = correctAnswers * 100;
        const percentage =
            totalQuestions > 0
                ? Math.round((correctAnswers / totalQuestions) * 100)
                : 0;
        const victory = percentage >= 60;

        return {
            correctAnswers,
            totalQuestions,
            score,
            percentage,
            victory,
        };
    }, [answerResults, totalQuestions]);

    useEffect(() => {
        // Este efeito é exclusivamente local: controla o relógio.
        // Não comunica com APIs nem lê dados externos; apenas reage ao estado do jogo e ao tempo.
        if (gameStatus !== "playing") return;
        if (timeLeft === 0) return;

        const timeoutId = setTimeout(() => {
            setTimeLeft((currentTime) => currentTime - 1);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [gameStatus, timeLeft]);

    useEffect(() => {
        // Este efeito é externo: comunica com a API.
        // Está separado do temporizador para distinguir bem os dois usos de useEffect.
        if (!gameRequest) return;

        const controller = new AbortController();

        async function loadQuestions() {
            try {
                setGameStatus("loading");
                setErrorMessage("");
                setCurrentQuestionIndex(0);
                setAnswerResults([]);
                answeredQuestionRef.current = -1;
                setTimeLeft(QUESTION_TIME_LIMIT);

                const apiQuestions = await fetchTriviaQuestions(
                    gameRequest.difficulty,
                    controller.signal,
                );

                setQuestions(apiQuestions);
                setGameStatus("playing");
            } catch (error) {
                if (error.name === "AbortError") return;

                setErrorMessage(error.message);
                setQuestions(localQuestions);
                setGameStatus("error");
            }
        }

        loadQuestions();

        return () => {
            controller.abort();
        };
    }, [gameRequest]);

    const startGame = () => {
        // Mantém a validação no handler para proteger a lógica,
        // mesmo que o botão já esteja disabled.
        // A interface ajuda o utilizador, mas a função continua responsável por validar.
        if (!canStartGame) return;

        // Criar um novo gameRequest é o "sinal" para o useEffect carregar perguntas.
        // A dificuldade fica congelada neste pedido concreto.
        answeredQuestionRef.current = -1;
        setGameRequest({
            id: Date.now(),
            difficulty,
        });
    };

    const resetGame = () => {
        // Volta ao ecrã inicial sem apagar nome/dificuldade.
        // Isto permite ao jogador repetir sem preencher tudo novamente.
        setGameStatus("idle");
        setErrorMessage("");
    };

    const startLocalGame = () => {
        // Fallback útil quando a API externa falha.
        // A ficha continua testável mesmo sem rede ou com limites da API.
        setQuestions(localQuestions);
        setCurrentQuestionIndex(0);
        setAnswerResults([]);
        answeredQuestionRef.current = -1;
        setTimeLeft(QUESTION_TIME_LIMIT);
        setErrorMessage("");
        setGameStatus("playing");
    };

    const handleAnswer = (selectedAnswer) => {
        // Evita que a mesma pergunta seja respondida duas vezes por duplo clique.
        // A ref é atualizada imediatamente, sem esperar por nova renderização.
        if (answeredQuestionRef.current === currentQuestionIndex) return;

        answeredQuestionRef.current = currentQuestionIndex;

        // Compara com a resposta certa da pergunta atual.
        // Toda a lógica de pontuação nasce desta comparação simples.
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        // Atualização imutável do histórico.
        // Criar novo array garante que o React deteta a alteração.
        const updatedResults = [...answerResults, isCorrect];

        setAnswerResults(updatedResults);

        // Se esta era a última pergunta, termina o jogo.
        // Evita avançar para um índice sem pergunta correspondente.
        const isLastQuestion = currentQuestionIndex === questions.length - 1;

        if (isLastQuestion) {
            setGameStatus("finished");
            return;
        }

        // Caso contrário, avança e reinicia o temporizador.
        // Índice e tempo mudam juntos para a próxima pergunta começar limpa.
        setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
        setTimeLeft(QUESTION_TIME_LIMIT);
    };

    const handleTimeout = () => {
        // Resposta vazia conta sempre como errada.
        // Isto permite reutilizar handleAnswer sem criar uma segunda lógica de pontuação.
        handleAnswer("");
    };

    return (
        <main className={`app ${theme === "dark" ? "app--dark" : ""}`}>
            <div className="quiz-shell">
                <h1>Quiz Game</h1>
                <p>Responde a perguntas para testar conhecimentos.</p>

                {/* toggleTheme vem do Context porque o tema é uma preferência global da app. */}
                <button
                    type="button"
                    className="button-secondary"
                    onClick={toggleTheme}
                >
                    Alternar tema
                </button>

                {gameStatus === "idle" && (
                    // Props específicas continuam a ser boas aqui:
                    // StartScreen precisa destes valores e callbacks diretamente.
                    // Context não substitui automaticamente comunicação direta entre pai e filho.
                    <StartScreen
                        playerName={playerName}
                        onPlayerNameChange={setPlayerName}
                        difficulty={difficulty}
                        onDifficultyChange={setDifficulty}
                        canStartGame={canStartGame}
                        onStartGame={startGame}
                    />
                )}

                {gameStatus === "loading" && <LoadingState />}

                {gameStatus === "error" && (
                    // O ecrã de erro também permite continuar com perguntas locais.
                    // Esta decisão melhora a experiência quando a API falha.
                    <ErrorState
                        message={errorMessage}
                        onUseLocalQuestions={startLocalGame}
                        onReset={resetGame}
                    />
                )}

                {gameStatus === "playing" && currentQuestion && (
                    // A pergunta recebe dados e callbacks específicos do jogo.
                    // Isto continua a ser props, não Context.
                    // onAnswer é uma ação local deste fluxo, não uma preferência global.
                    <QuestionCard
                        question={currentQuestion}
                        answers={currentAnswers}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={totalQuestions}
                        timeLeft={timeLeft}
                        timeLimit={QUESTION_TIME_LIMIT}
                        onAnswer={handleAnswer}
                        onTimeout={handleTimeout}
                    />
                )}

                {gameStatus === "finished" && (
                    // O ecrã final recebe estatísticas já calculadas.
                    // Assim o componente de apresentação não duplica lógica de cálculo.
                    <ResultScreen
                        playerName={cleanPlayerName}
                        stats={gameStats}
                        onReset={resetGame}
                    />
                )}
            </div>
        </main>
    );
}

export default App;
