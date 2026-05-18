/**
 * Propósito: mostrar o resultado final do jogador depois de terminar o quiz.
 * Produz/Devolve: devolve pontuação, respostas certas, percentagem, mensagem final e botão de reinício.
 * @param {object} props - Dados finais recebidos do App.
 * @param {string} props.playerName - Nome do jogador que terminou o jogo.
 * @param {object} props.stats - Estatísticas calculadas no App com base nas respostas.
 * @param {() => void} props.onReset - Função para voltar ao ecrã inicial.
 * @returns {JSX.Element} JSX do ecrã de resultado final.
 */
function ResultScreen({ playerName, stats, onReset }) {
    return (
        <section className="quiz-card">
            {/* A frase depende de stats.victory, calculado no App com useMemo.
                O ResultScreen só apresenta dados; não recalcula a regra de sucesso. */}
            <h2>{stats.victory ? "Objetivo atingido!" : "Tenta novamente!"}</h2>
            <p>Jogador: {playerName}</p>
            <p>Pontuação: {stats.score}</p>
            <p>
                Certas: {stats.correctAnswers} de {stats.totalQuestions}
            </p>
            <p>Percentagem: {stats.percentage}%</p>

            <button type="button" className="button-primary" onClick={onReset}>
                Voltar ao início
            </button>
        </section>
    );
}

export default ResultScreen;
