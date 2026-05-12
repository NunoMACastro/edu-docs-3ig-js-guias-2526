/**
 * Mostra feedback enquanto as perguntas estão a ser carregadas.
 * @returns {JSX.Element} Estado visual de loading.
 */
function LoadingState() {
    return (
        <section className="quiz-card">
            <h2>A carregar perguntas...</h2>
            <p className="muted">A batalha vai começar dentro de instantes.</p>
        </section>
    );
}

export default LoadingState;
