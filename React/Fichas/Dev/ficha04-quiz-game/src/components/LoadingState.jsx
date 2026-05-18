/**
 * Propósito: mostrar feedback enquanto a app carrega e tenta traduzir perguntas.
 * Produz/Devolve: devolve uma mensagem simples de espera para o utilizador.
 * @returns {JSX.Element} JSX do ecrã de loading.
 */
function LoadingState() {
    return (
        <section className="quiz-card">
            <h2>A preparar perguntas...</h2>
            <p className="muted">
                A carregar perguntas e a tentar traduzir para português.
            </p>
        </section>
    );
}

export default LoadingState;
