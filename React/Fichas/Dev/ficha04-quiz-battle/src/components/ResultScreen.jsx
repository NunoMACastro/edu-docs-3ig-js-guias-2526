import BossHealthBar from "./BossHealthBar.jsx";

/**
 * Ecrã final com as estatísticas da batalha.
 * @param {object} props - Props do componente.
 * @param {string} props.playerName - Nome final do jogador.
 * @param {string} props.difficultyLabel - Dificuldade da batalha.
 * @param {object} props.stats - Estatísticas calculadas no App.
 * @param {number} props.bestScore - Melhor pontuação guardada.
 * @param {number} props.bossHealth - Vida final do boss.
 * @param {() => void} props.onPlayAgain - Começa outra batalha.
 * @param {() => void} props.onReset - Volta ao ecrã inicial.
 * @returns {JSX.Element} Resultado final da batalha.
 */
function ResultScreen({
    playerName,
    difficultyLabel,
    stats,
    bestScore,
    bossHealth,
    onPlayAgain,
    onReset,
}) {
    return (
        <section className="quiz-card">
            <h2>{stats.victory ? "Vitória!" : "Derrota!"}</h2>
            <p
                className={
                    stats.victory
                        ? "result-message--win"
                        : "result-message--lose"
                }
            >
                {stats.victory
                    ? "Conseguiste derrotar o boss. Boa batalha!"
                    : "O boss aguentou o ataque. Tenta outra vez!"}
            </p>

            <p>Jogador: {playerName}</p>
            <p>Dificuldade: {difficultyLabel}</p>
            <p>Pontuação: {stats.score}</p>
            <p>Melhor pontuação: {bestScore}</p>
            <p>
                Certas: {stats.correctAnswers} de {stats.totalQuestions}
            </p>
            <p>Percentagem: {stats.percentage}%</p>

            <BossHealthBar health={bossHealth} />

            <div className="button-row">
                <button
                    type="button"
                    className="button-primary"
                    onClick={onPlayAgain}
                >
                    Jogar outra vez
                </button>

                <button
                    type="button"
                    className="button-secondary"
                    onClick={onReset}
                >
                    Voltar ao início
                </button>
            </div>
        </section>
    );
}

export default ResultScreen;
