import ScoreBadge from "./ScoreBadge.jsx";

/**
 * Ecrã final do jogo.
 * @param {object} props - Props do componente.
 * @param {string} props.playerName - Nome do jogador.
 * @param {string} props.difficulty - Dificuldade jogada.
 * @param {object} props.stats - Estatísticas finais.
 * @param {object | null} props.bestScore - Melhor pontuação guardada.
 * @param {() => void} props.onStartAgain - Começa outro jogo.
 * @param {() => void} props.onReset - Volta ao início.
 * @returns {JSX.Element}
 */
function ResultScreen({
    playerName,
    difficulty,
    stats,
    bestScore,
    onStartAgain,
    onReset,
}) {
    const feedback = stats.victory
        ? "Bom trabalho! Conseguiste atingir o objetivo do jogo."
        : "Ainda não chegou, mas já tens uma base para melhorar na próxima tentativa.";

    return (
        <section className="quiz-card">
            <h2>{stats.victory ? "Objetivo atingido!" : "Tenta novamente!"}</h2>

            <ScoreBadge stats={stats} bestScore={bestScore} />

            <p>{feedback}</p>
            <p>Jogador: {playerName}</p>
            <p>Dificuldade: {difficulty}</p>
            <p>Pontuação: {stats.score}</p>
            <p>
                Certas: {stats.correctAnswers} de {stats.totalQuestions}
            </p>
            <p>Percentagem: {stats.percentage}%</p>

            {bestScore && (
                <p className="muted">
                    Recorde guardado: {bestScore.score} pontos por{" "}
                    {bestScore.playerName}.
                </p>
            )}

            <div className="button-row button-row--split">
                <button
                    type="button"
                    className="button-primary"
                    onClick={onStartAgain}
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

