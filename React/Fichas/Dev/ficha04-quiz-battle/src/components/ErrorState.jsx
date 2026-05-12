/**
 * Mostra uma mensagem de erro e permite escolher o fallback local.
 * @param {object} props - Props do componente.
 * @param {string} props.message - Mensagem de erro.
 * @param {() => void} props.onUseLocalQuestions - Começa com perguntas locais.
 * @param {() => void} props.onReset - Volta ao início.
 * @returns {JSX.Element}
 */
function ErrorState({ message, onUseLocalQuestions, onReset }) {
    return (
        <section className="quiz-card">
            <h2>Não foi possível começar o jogo</h2>
            <p className="error-text">{message}</p>
            <p className="muted">
                Podes tentar novamente ou usar as perguntas locais da ficha.
            </p>

            <div className="button-row button-row--split">
                <button
                    type="button"
                    className="button-primary"
                    onClick={onUseLocalQuestions}
                >
                    Usar perguntas locais
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

export default ErrorState;

