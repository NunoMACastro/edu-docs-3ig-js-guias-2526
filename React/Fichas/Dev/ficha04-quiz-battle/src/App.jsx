import { useEffect, useMemo, useRef, useState } from "react";
import ErrorState from "./components/ErrorState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import StartScreen from "./components/StartScreen.jsx";
import { useGameSettings } from "./context/GameSettingsContext.jsx";
import { localQuestions } from "./data/localQuestions.js";
import { fetchTriviaQuestions } from "./services/triviaApi.js";

const QUESTION_TIME_LIMIT = 15;
const BEST_SCORE_STORAGE_KEY = "ficha04QuizBattleBestScore";

/**
 * Baralha uma lista sem alterar o array original.
 * @param {string[]} items - Lista original.
 * @returns {string[]} Nova lista baralhada.
 */
function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

/**
 * Lê a melhor pontuação guardada no browser.
 * @returns {object | null} Melhor pontuação ou null.
 */
function readBestScore() {
    try {
        const storedScore = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);

        return storedScore ? JSON.parse(storedScore) : null;
    } catch {
        return null;
    }
}

/**
 * Devolve perguntas locais na quantidade escolhida.
 * @param {number} amount - Quantidade pretendida.
 * @returns {object[]} Perguntas locais.
 */
function getLocalQuestions(amount) {
    return localQuestions.slice(0, amount);
}

/**
 * Calcula as estatísticas finais sem criar estado extra.
 * @param {boolean[]} results - Histórico de respostas certas/erradas.
 * @param {number} totalQuestions - Total de perguntas do jogo.
 * @returns {object} Estatísticas calculadas.
 */
function calculateGameStats(results, totalQuestions) {
    const correctAnswers = results.filter(Boolean).length;
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
}

/**
 * Componente principal da app Quiz Battle.
 * @returns {JSX.Element}
 */
function App() {
    const {
        playerName,
        setPlayerName,
        difficulty,
        setDifficulty,
        questionAmount,
        setQuestionAmount,
        theme,
        toggleTheme,
    } = useGameSettings();

    const [gameStatus, setGameStatus] = useState("idle");
    const [questions, setQuestions] = useState(() =>
        getLocalQuestions(questionAmount),
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerResults, setAnswerResults] = useState([]);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
    const [errorMessage, setErrorMessage] = useState("");
    const [gameId, setGameId] = useState(0);
    const [answeredQuestionIndex, setAnsweredQuestionIndex] = useState(-1);
    const [bestScore, setBestScore] = useState(readBestScore);
    const lockedQuestionIndexRef = useRef(-1);

    const cleanPlayerName = playerName.trim();
    const canStartGame = cleanPlayerName.length >= 2;
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const currentAnswers = useMemo(() => {
        if (!currentQuestion) return [];

        return shuffleItems([
            currentQuestion.correctAnswer,
            ...currentQuestion.incorrectAnswers,
        ]);
    }, [currentQuestion]);

    const gameStats = useMemo(() => {
        return calculateGameStats(answerResults, totalQuestions);
    }, [answerResults, totalQuestions]);

    useEffect(() => {
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
        if (gameId === 0) return;

        const controller = new AbortController();

        async function loadQuestions() {
            try {
                setGameStatus("loading");
                setErrorMessage("");
                setCurrentQuestionIndex(0);
                setAnswerResults([]);
                setTimeLeft(QUESTION_TIME_LIMIT);
                lockedQuestionIndexRef.current = -1;
                setAnsweredQuestionIndex(-1);

                const apiQuestions = await fetchTriviaQuestions(
                    difficulty,
                    questionAmount,
                    controller.signal,
                );

                setQuestions(apiQuestions);
                setGameStatus("playing");
            } catch (error) {
                if (error.name === "AbortError") return;

                setErrorMessage(error.message);
                setQuestions(getLocalQuestions(questionAmount));
                setGameStatus("error");
            }
        }

        loadQuestions();

        return () => {
            controller.abort();
        };
    }, [gameId, difficulty, questionAmount]);

    const saveBestScore = (stats) => {
        const finalScore = {
            score: stats.score,
            percentage: stats.percentage,
            playerName: cleanPlayerName,
            difficulty,
            questionAmount,
            date: new Date().toISOString(),
        };

        if (!bestScore || finalScore.score > bestScore.score) {
            setBestScore(finalScore);

            try {
                window.localStorage.setItem(
                    BEST_SCORE_STORAGE_KEY,
                    JSON.stringify(finalScore),
                );
            } catch {
                // Se o browser bloquear o localStorage, a app continua funcional.
            }
        }
    };

    const startGame = () => {
        if (!canStartGame) return;

        setGameId((previousId) => previousId + 1);
    };

    const resetGame = () => {
        setGameStatus("idle");
        setErrorMessage("");
        lockedQuestionIndexRef.current = -1;
        setAnsweredQuestionIndex(-1);
    };

    const startLocalGame = () => {
        setQuestions(getLocalQuestions(questionAmount));
        setCurrentQuestionIndex(0);
        setAnswerResults([]);
        setTimeLeft(QUESTION_TIME_LIMIT);
        setErrorMessage("");
        lockedQuestionIndexRef.current = -1;
        setAnsweredQuestionIndex(-1);
        setGameStatus("playing");
    };

    const handleAnswer = (selectedAnswer) => {
        if (
            !currentQuestion ||
            lockedQuestionIndexRef.current === currentQuestionIndex
        ) {
            return;
        }

        lockedQuestionIndexRef.current = currentQuestionIndex;
        setAnsweredQuestionIndex(currentQuestionIndex);

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const updatedResults = [...answerResults, isCorrect];

        setAnswerResults(updatedResults);

        const isLastQuestion = currentQuestionIndex === questions.length - 1;

        if (isLastQuestion) {
            saveBestScore(calculateGameStats(updatedResults, questions.length));
            setGameStatus("finished");
            return;
        }

        setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
        setTimeLeft(QUESTION_TIME_LIMIT);
    };

    const handleTimeout = () => {
        handleAnswer("");
    };

    return (
        <main className={`app ${theme === "dark" ? "app--dark" : ""}`}>
            <div className="quiz-shell">
                <header className="quiz-header">
                    <div>
                        <h1>Quiz Battle</h1>
                        <p>Responde a perguntas para testar conhecimentos.</p>
                    </div>

                    <button
                        type="button"
                        className="button-secondary"
                        onClick={toggleTheme}
                    >
                        Alternar tema
                    </button>
                </header>

                {gameStatus === "idle" && (
                    <StartScreen
                        playerName={playerName}
                        onPlayerNameChange={setPlayerName}
                        difficulty={difficulty}
                        onDifficultyChange={setDifficulty}
                        questionAmount={questionAmount}
                        onQuestionAmountChange={setQuestionAmount}
                        canStartGame={canStartGame}
                        onStartGame={startGame}
                        bestScore={bestScore}
                    />
                )}

                {gameStatus === "loading" && <LoadingState />}

                {gameStatus === "error" && (
                    <ErrorState
                        message={errorMessage}
                        onUseLocalQuestions={startLocalGame}
                        onReset={resetGame}
                    />
                )}

                {gameStatus === "playing" && currentQuestion && (
                    <QuestionCard
                        question={currentQuestion}
                        answers={currentAnswers}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={totalQuestions}
                        timeLeft={timeLeft}
                        isAnswerLocked={
                            answeredQuestionIndex === currentQuestionIndex
                        }
                        onAnswer={handleAnswer}
                        onTimeout={handleTimeout}
                    />
                )}

                {gameStatus === "finished" && (
                    <ResultScreen
                        playerName={cleanPlayerName}
                        difficulty={difficulty}
                        stats={gameStats}
                        bestScore={bestScore}
                        onStartAgain={startGame}
                        onReset={resetGame}
                    />
                )}
            </div>
        </main>
    );
}

export default App;
