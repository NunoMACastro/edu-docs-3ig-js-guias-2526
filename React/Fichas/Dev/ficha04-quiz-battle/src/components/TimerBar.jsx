const QUESTION_TIME_LIMIT = 15;

/**
 * Mostra o temporizador da pergunta atual.
 * @param {object} props - Props do componente.
 * @param {number} props.timeLeft - Tempo restante.
 * @returns {JSX.Element}
 */
function TimerBar({ timeLeft }) {
    const percentage = (timeLeft / QUESTION_TIME_LIMIT) * 100;

    return (
        <div className="timer">
            <p>Tempo restante: {timeLeft}s</p>
            <div className="timer-bar" aria-hidden="true">
                <div
                    className="timer-bar__fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default TimerBar;

