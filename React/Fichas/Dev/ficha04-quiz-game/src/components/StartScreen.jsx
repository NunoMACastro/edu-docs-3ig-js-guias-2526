/**
 * Propósito: mostrar o formulário inicial antes de o jogo começar.
 * Produz/Devolve: devolve o ecrã com nome, dificuldade, validação e botão para começar.
 * @param {object} props - Dados e callbacks recebidos do App.
 * @param {string} props.playerName - Valor atual do input do nome.
 * @param {(name: string) => void} props.onPlayerNameChange - Função chamada quando o nome muda.
 * @param {string} props.difficulty - Valor atual da dificuldade escolhida.
 * @param {(difficulty: string) => void} props.onDifficultyChange - Função chamada quando a dificuldade muda.
 * @param {boolean} props.canStartGame - Indica se o nome já permite começar o jogo.
 * @param {() => void} props.onStartGame - Função chamada quando o jogador carrega em começar.
 * @returns {JSX.Element} JSX do ecrã inicial do quiz.
 */
function StartScreen({
    // Valores controlados pelo componente pai.
    // O StartScreen não guarda estado próprio para estes campos; apenas mostra e comunica alterações.
    playerName,
    onPlayerNameChange,
    difficulty,
    onDifficultyChange,

    // Validação também vem do pai, porque depende da regra da app.
    // Isto evita duplicar a mesma regra em dois componentes diferentes.
    canStartGame,

    // Callback chamado quando o jogador tenta começar.
    // O filho não muda gameStatus diretamente; pede ao App para decidir.
    onStartGame,
}) {
    return (
        <section className="quiz-card">
            <h2>Preparar jogo</h2>

            <label className="form-row">
                Nome do jogador
                {/*
                  O filho mostra o valor recebido por props e usa o callback
                  para pedir ao pai que atualize o state.
                  Isto é o fluxo normal do React: dados descem, ações sobem.
                */}
                <input
                    type="text"
                    value={playerName}
                    onChange={(event) => onPlayerNameChange(event.target.value)}
                    placeholder="Ex.: Ana"
                />
            </label>

            <label className="form-row">
                Dificuldade
                {/*
                  Mesma ideia do input: valor recebido por props,
                  atualização comunicada ao pai por callback.
                  O select não decide a dificuldade global sozinho.
                */}
                <select
                    value={difficulty}
                    onChange={(event) => onDifficultyChange(event.target.value)}
                >
                    <option value="easy">Fácil</option>
                    <option value="medium">Média</option>
                    <option value="hard">Difícil</option>
                </select>
            </label>

            {!canStartGame && (
                // A mensagem usa a validação calculada no pai.
                // Assim, o botão e o texto de erro obedecem exatamente à mesma condição.
                <p className="error-text">
                    Escreve pelo menos 2 caracteres no nome.
                </p>
            )}

            <div className="button-row">
                {/*
                  O clique sobe para o pai. O componente filho não decide
                  sozinho quando o jogo começa.
                  Esta separação deixa o componente reutilizável e fácil de testar.
                */}
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
