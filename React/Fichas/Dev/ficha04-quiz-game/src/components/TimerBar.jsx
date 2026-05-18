/**
 * Propósito: mostrar o tempo restante de forma textual e visual.
 * Produz/Devolve: devolve uma barra cuja largura representa a percentagem de tempo restante.
 * @param {object} props - Props necessárias para calcular a barra.
 * @param {number} props.timeLeft - Segundos que ainda faltam para a pergunta terminar.
 * @param {number} props.timeLimit - Tempo total disponível para cada pergunta.
 * @returns {JSX.Element} JSX do temporizador.
 */
function TimerBar({ timeLeft, timeLimit }) {
    // Converte segundos restantes em percentagem para controlar a largura da barra.
    // timeLimit vem do App para existir uma única fonte de verdade para a regra dos segundos.
    const percentage = (timeLeft / timeLimit) * 100;

    return (
        <div className="timer">
            <p>Tempo restante: {timeLeft}s</p>
            <div className="timer-bar">
                {/*
                  Este é um caso aceitável de estilo inline:
                  a largura depende de um valor dinâmico calculado em React.
                  As restantes regras visuais continuam no CSS para manter responsabilidades separadas.
                */}
                <div
                    className="timer-bar__fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default TimerBar;
