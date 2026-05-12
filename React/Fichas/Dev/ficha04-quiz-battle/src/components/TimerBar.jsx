const QUESTION_TIME_LIMIT = 15;

/**
 * Mostra o tempo restante da pergunta atual.
 * @param {object} props - Props do componente.
 * @param {number} props.timeLeft - Tempo restante em segundos.
 * @returns {JSX.Element} Temporizador visual com barra de progresso.
 */
function TimerBar({ timeLeft }) {
    const percentage = (timeLeft / QUESTION_TIME_LIMIT) * 100;

    return (
        <div className="timer">
            <p>Tempo restante: {timeLeft}s</p>
            <div className="timer-bar">
                <div
                    className="timer-bar__fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default TimerBar;
