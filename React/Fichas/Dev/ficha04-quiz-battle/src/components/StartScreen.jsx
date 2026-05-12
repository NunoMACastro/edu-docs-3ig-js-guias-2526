/**
 * Ecrã inicial onde o jogador configura a batalha.
 * @param {object} props - Props do componente.
 * @param {string} props.playerName - Nome atual do jogador.
 * @param {(name: string) => void} props.onPlayerNameChange - Atualiza o nome.
 * @param {string} props.difficulty - Dificuldade selecionada.
 * @param {(difficulty: string) => void} props.onDifficultyChange - Atualiza a dificuldade.
 * @param {number} props.questionCount - Número de perguntas da batalha.
 * @param {(questionCount: number) => void} props.onQuestionCountChange - Atualiza o número de perguntas.
 * @param {boolean} props.canStartBattle - Indica se a batalha pode começar.
 * @param {() => void} props.onStartBattle - Callback para iniciar a batalha.
 * @returns {JSX.Element} Formulário inicial da app.
 */
function StartScreen({
    playerName,
    onPlayerNameChange,
    difficulty,
    onDifficultyChange,
    questionCount,
    onQuestionCountChange,
    canStartBattle,
    onStartBattle,
}) {
    return (
        <section className="quiz-card">
            <h2>Preparar batalha</h2>

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
                    onChange={(event) =>
                        onDifficultyChange(event.target.value)
                    }
                >
                    <option value="easy">Fácil</option>
                    <option value="medium">Média</option>
                    <option value="hard">Difícil</option>
                </select>
            </label>

            <label className="form-row">
                Número de perguntas
                <select
                    value={questionCount}
                    onChange={(event) =>
                        onQuestionCountChange(Number(event.target.value))
                    }
                >
                    <option value={5}>5 perguntas</option>
                    <option value={10}>10 perguntas</option>
                </select>
            </label>

            {!canStartBattle && (
                <p className="error-text">
                    Escreve pelo menos 2 caracteres no nome.
                </p>
            )}

            <div className="button-row">
                <button
                    type="button"
                    className="button-primary"
                    onClick={onStartBattle}
                    disabled={!canStartBattle}
                >
                    Começar batalha
                </button>
            </div>
        </section>
    );
}

export default StartScreen;
