import TimerBar from "./TimerBar.jsx";

/**
 * Mostra a pergunta atual e as respostas possíveis.
 * @param {object} props - Props do componente.
 * @param {object} props.question - Pergunta atual.
 * @param {string[]} props.answers - Respostas baralhadas.
 * @param {number} props.questionNumber - Número da pergunta atual.
 * @param {number} props.totalQuestions - Total de perguntas.
 * @param {number} props.timeLeft - Tempo restante.
 * @param {boolean} props.isAnswerLocked - Bloqueia resposta depois do clique.
 * @param {(answer: string) => void} props.onAnswer - Regista a resposta.
 * @param {() => void} props.onTimeout - Avança quando o tempo acaba.
 * @returns {JSX.Element}
 */
function QuestionCard({
    question,
    answers,
    questionNumber,
    totalQuestions,
    timeLeft,
    isAnswerLocked,
    onAnswer,
    onTimeout,
}) {
    const answersDisabled = timeLeft === 0 || isAnswerLocked;

    return (
        <section className="quiz-card">
            <p className="question-progress">
                Pergunta {questionNumber} de {totalQuestions}
            </p>

            <TimerBar timeLeft={timeLeft} />

            <h2>{question.question}</h2>

            <div className="answer-grid">
                {answers.map((answer) => (
                    <button
                        key={answer}
                        type="button"
                        className="answer-button"
                        onClick={() => onAnswer(answer)}
                        disabled={answersDisabled}
                    >
                        {answer}
                    </button>
                ))}
            </div>

            {timeLeft === 0 && (
                <div className="button-row">
                    <p className="error-text">Tempo esgotado.</p>
                    <button
                        type="button"
                        className="button-secondary"
                        onClick={onTimeout}
                        disabled={isAnswerLocked}
                    >
                        Avançar
                    </button>
                </div>
            )}
        </section>
    );
}

export default QuestionCard;

