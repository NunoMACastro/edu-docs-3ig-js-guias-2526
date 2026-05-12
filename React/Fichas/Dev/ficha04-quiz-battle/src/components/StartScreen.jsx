/**
 * Ecrã inicial da aplicação.
 * @param {object} props - Props do componente.
 * @param {string} props.playerName - Nome atual do jogador.
 * @param {(name: string) => void} props.onPlayerNameChange - Atualiza o nome.
 * @param {string} props.difficulty - Dificuldade atual.
 * @param {(difficulty: string) => void} props.onDifficultyChange - Atualiza a dificuldade.
 * @param {number} props.questionAmount - Quantidade de perguntas.
 * @param {(amount: number) => void} props.onQuestionAmountChange - Atualiza a quantidade.
 * @param {boolean} props.canStartGame - Indica se o nome é válido.
 * @param {() => void} props.onStartGame - Começa o jogo.
 * @param {object | null} props.bestScore - Melhor pontuação guardada.
 * @returns {JSX.Element}
 */
function StartScreen({
    playerName,
    onPlayerNameChange,
    difficulty,
    onDifficultyChange,
    questionAmount,
    onQuestionAmountChange,
    canStartGame,
    onStartGame,
    bestScore,
}) {
    return (
        <section className="quiz-card">
            <h2>Preparar jogo</h2>

            <label className="form-row">
                Nome do jogador
                <input
                    type="text"
                    value={playerName}
                    onChange={(event) => onPlayerNameChange(event.target.value)}
                    placeholder="Ex.: Ana"
                />
            </label>

            <label className="form-row">
                Dificuldade
                <select
                    value={difficulty}
                    onChange={(event) => onDifficultyChange(event.target.value)}
                >
                    <option value="easy">Fácil</option>
                    <option value="medium">Média</option>
                    <option value="hard">Difícil</option>
                </select>
            </label>

            <label className="form-row">
                Número de perguntas
                <select
                    value={questionAmount}
                    onChange={(event) =>
                        onQuestionAmountChange(Number(event.target.value))
                    }
                >
                    <option value={5}>5 perguntas</option>
                    <option value={10}>10 perguntas</option>
                </select>
            </label>

            {!canStartGame && (
                <p className="error-text">
                    Escreve pelo menos 2 caracteres no nome.
                </p>
            )}

            {bestScore && (
                <p className="muted">
                    Melhor pontuação: {bestScore.score} pontos por{" "}
                    {bestScore.playerName}.
                </p>
            )}

            <div className="button-row">
                <button
                    type="button"
                    className="button-primary"
                    onClick={onStartGame}
                    disabled={!canStartGame}
                >
                    Começar jogo
                </button>
            </div>
        </section>
    );
}

export default StartScreen;

