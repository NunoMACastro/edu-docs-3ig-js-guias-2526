import TimerBar from "./TimerBar.jsx";
import BossHealthBar from "./BossHealthBar.jsx";

/**
 * Mostra a pergunta atual, as respostas possíveis e o temporizador.
 * @param {object} props - Props do componente.
 * @param {object} props.question - Pergunta atual.
 * @param {string[]} props.answers - Respostas possíveis, já baralhadas.
 * @param {number} props.questionNumber - Número da pergunta atual.
 * @param {number} props.totalQuestions - Número total de perguntas.
 * @param {number} props.timeLeft - Tempo restante em segundos.
 * @param {number} props.bossHealth - Vida atual do boss.
 * @param {boolean} props.isAnswerLocked - Impede cliques repetidos na resposta.
 * @param {(answer: string) => void} props.onAnswer - Regista uma resposta.
 * @param {() => void} props.onTimeout - Avança quando o tempo acaba.
 * @returns {JSX.Element} Cartão da pergunta atual.
 */
function QuestionCard({
    question,
    answers,
    questionNumber,
    totalQuestions,
    timeLeft,
    bossHealth,
    isAnswerLocked,
    onAnswer,
    onTimeout,
}) {
    return (
        <section className="quiz-card">
            <p>
                Pergunta {questionNumber} de {totalQuestions}
            </p>

            <TimerBar timeLeft={timeLeft} />

            <BossHealthBar health={bossHealth} />

            <h2>{question.question}</h2>

            <div className="answer-grid">
                {answers.map((answer) => (
                    <button
                        key={answer}
                        type="button"
                        className="answer-button"
                        onClick={() => onAnswer(answer)}
                        disabled={timeLeft === 0 || isAnswerLocked}
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
