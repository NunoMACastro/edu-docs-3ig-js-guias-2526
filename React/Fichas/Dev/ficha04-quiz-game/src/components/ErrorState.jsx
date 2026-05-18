/**
 * Propósito: mostrar uma falha ao carregar perguntas e dar formas de continuar.
 * Produz/Devolve: devolve uma mensagem de erro e botões para usar perguntas locais ou voltar ao início.
 * @param {object} props - Dados e callbacks usados no ecrã de erro.
 * @param {string} props.message - Mensagem criada pelo App a partir do erro real.
 * @param {() => void} props.onUseLocalQuestions - Função para começar com perguntas locais.
 * @param {() => void} props.onReset - Função para voltar ao ecrã inicial.
 * @returns {JSX.Element} JSX do ecrã de erro.
 */
function ErrorState({ message, onUseLocalQuestions, onReset }) {
    return (
        <section className="quiz-card">
            <h2>Não foi possível começar o jogo</h2>

            {/* A mensagem vem do App, porque o erro nasce no pedido à API.
                O componente de erro não deve inventar a causa da falha. */}
            <p className="error-text">{message}</p>
            <p className="muted">
                Podes voltar ao início ou continuar com as perguntas locais da
                ficha.
            </p>

            {/*
              O filho não decide como recuperar do erro.
              Apenas chama os callbacks recebidos do pai.
              Assim, a recuperação continua centralizada no App.
            */}
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
