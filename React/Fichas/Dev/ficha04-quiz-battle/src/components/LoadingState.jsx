/**
 * Mostra feedback enquanto a app carrega e traduz perguntas.
 * @returns {JSX.Element}
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

