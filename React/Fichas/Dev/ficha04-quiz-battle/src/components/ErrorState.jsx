/**
 * Mostra um erro da API e permite regressar ao início.
 * @param {object} props - Props do componente.
 * @param {string} props.message - Mensagem de erro para apresentar.
 * @param {() => void} props.onReset - Volta ao ecrã inicial.
 * @param {() => void} props.onUseLocalQuestions - Começa com perguntas locais.
 * @returns {JSX.Element} Estado visual de erro.
 */
function ErrorState({ message, onReset, onUseLocalQuestions }) {
    return (
        <section className="quiz-card">
            <h2>Não foi possível começar a batalha</h2>
            <p className="error-text">{message}</p>
            <p className="muted">
                Podes voltar ao início ou continuar com perguntas locais.
            </p>

            <div className="button-row">
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
