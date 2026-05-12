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
const BEST_SCORE_KEY = "quiz-battle-best-score";
const DIFFICULTY_LABELS = {
    easy: "Fácil",
    medium: "Média",
    hard: "Difícil",
};

/**
 * Lê a melhor pontuação guardada no browser.
 * @returns {number} Melhor pontuação encontrada ou 0.
 */
function readBestScore() {
    try {
        if (typeof window === "undefined") return 0;

        const storedScore = window.localStorage.getItem(BEST_SCORE_KEY);
        const parsedScore = Number(storedScore);

        return Number.isNaN(parsedScore) ? 0 : parsedScore;
    } catch {
        return 0;
    }
}

/**
 * Guarda a melhor pontuação no browser.
 * @param {number} score - Pontuação a guardar.
 */
function saveBestScore(score) {
    try {
        if (typeof window === "undefined") return;

        window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    } catch {
        // Se o browser bloquear localStorage, o jogo continua a funcionar.
    }
}

/**
 * Baralha uma lista sem alterar o array original.
 * @param {string[]} items - Lista original.
 * @returns {string[]} Nova lista baralhada.
 */
function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

/**
 * Componente principal da app Quiz Battle.
 * Gere o fluxo da batalha, os efeitos, as perguntas e as estatísticas.
 * @returns {JSX.Element} Aplicação completa da ficha.
 */
function App() {
    const {
        playerName,
        setPlayerName,
        difficulty,
        setDifficulty,
        theme,
        toggleTheme,
    } = useGameSettings();

    const [gameStatus, setGameStatus] = useState("idle");
    const [questions, setQuestions] = useState(localQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerResults, setAnswerResults] = useState([]);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
    const [errorMessage, setErrorMessage] = useState("");
    const [battleId, setBattleId] = useState(0);
    const [battleDifficulty, setBattleDifficulty] = useState(difficulty);
    const [questionCount, setQuestionCount] = useState(5);
    const [battleQuestionCount, setBattleQuestionCount] = useState(5);
    const [bestScore, setBestScore] = useState(readBestScore);
    const [isAnswerLocked, setIsAnswerLocked] = useState(false);
    const answerLockRef = useRef(false);

    const cleanPlayerName = playerName.trim();
    const canStartBattle = cleanPlayerName.length >= 2;
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const difficultyLabel =
        DIFFICULTY_LABELS[battleDifficulty] ?? battleDifficulty;

    const currentAnswers = useMemo(() => {
        if (!currentQuestion) return [];

        return shuffleItems([
            currentQuestion.correctAnswer,
            ...currentQuestion.incorrectAnswers,
        ]);
    }, [currentQuestion]);

    const battleStats = useMemo(() => {
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

    const bossHealth = useMemo(() => {
        if (totalQuestions === 0) return 100;

        const damage = Math.round(
            (battleStats.correctAnswers / totalQuestions) * 100,
        );

        return Math.max(0, 100 - damage);
    }, [battleStats.correctAnswers, totalQuestions]);

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
        answerLockRef.current = false;
        setIsAnswerLocked(false);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (gameStatus !== "finished") return;
        if (battleStats.score <= bestScore) return;

        setBestScore(battleStats.score);
        saveBestScore(battleStats.score);
    }, [battleStats.score, bestScore, gameStatus]);

    useEffect(() => {
        if (battleId === 0) return;

        const controller = new AbortController();

        async function loadQuestions() {
            try {
                setGameStatus("loading");
                setErrorMessage("");
                setCurrentQuestionIndex(0);
                setAnswerResults([]);
                setTimeLeft(QUESTION_TIME_LIMIT);
                answerLockRef.current = false;
                setIsAnswerLocked(false);

                const apiQuestions = await fetchTriviaQuestions(
                    battleDifficulty,
                    battleQuestionCount,
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
    }, [battleId, battleDifficulty, battleQuestionCount]);

    const startBattle = () => {
        if (!canStartBattle) return;

        setBattleDifficulty(difficulty);
        setBattleQuestionCount(questionCount);
        setBattleId((previousId) => previousId + 1);
    };

    const resetBattle = () => {
        setGameStatus("idle");
        setErrorMessage("");
    };

    const useLocalQuestions = () => {
        setQuestions(localQuestions.slice(0, battleQuestionCount));
        setCurrentQuestionIndex(0);
        setAnswerResults([]);
        setTimeLeft(QUESTION_TIME_LIMIT);
        answerLockRef.current = false;
        setIsAnswerLocked(false);
        setGameStatus("playing");
    };

    const handleAnswer = (selectedAnswer) => {
        if (!currentQuestion) return;
        if (answerLockRef.current) return;

        answerLockRef.current = true;
        setIsAnswerLocked(true);

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const updatedResults = [...answerResults, isCorrect];

        setAnswerResults(updatedResults);

        const isLastQuestion = currentQuestionIndex === questions.length - 1;

        if (isLastQuestion) {
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
                <header className="app-header">
                    <div>
                        <h1>Quiz Battle</h1>
                        <p>Responde a perguntas para derrotar o boss.</p>
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
                        questionCount={questionCount}
                        onQuestionCountChange={setQuestionCount}
                        canStartBattle={canStartBattle}
                        onStartBattle={startBattle}
                    />
                )}

                {gameStatus === "loading" && <LoadingState />}

                {gameStatus === "error" && (
                    <ErrorState
                        message={errorMessage}
                        onReset={resetBattle}
                        onUseLocalQuestions={useLocalQuestions}
                    />
                )}

                {gameStatus === "playing" && currentQuestion && (
                    <QuestionCard
                        question={currentQuestion}
                        answers={currentAnswers}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={totalQuestions}
                        timeLeft={timeLeft}
                        bossHealth={bossHealth}
                        isAnswerLocked={isAnswerLocked}
                        onAnswer={handleAnswer}
                        onTimeout={handleTimeout}
                    />
                )}

                {gameStatus === "finished" && (
                    <ResultScreen
                        playerName={cleanPlayerName}
                        difficultyLabel={difficultyLabel}
                        stats={battleStats}
                        bestScore={Math.max(bestScore, battleStats.score)}
                        bossHealth={bossHealth}
                        onPlayAgain={startBattle}
                        onReset={resetBattle}
                    />
                )}
            </div>
        </main>
    );
}

export default App;
