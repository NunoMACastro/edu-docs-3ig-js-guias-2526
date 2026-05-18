import TimerBar from "./TimerBar.jsx";

/**
 * Propósito: apresentar a pergunta atual e permitir escolher uma resposta.
 * Produz/Devolve: devolve o cartão com número da pergunta, temporizador, respostas e botão de timeout.
 * @param {object} props - Dados e ações enviados pelo App.
 * @param {object} props.question - Pergunta atual que vai aparecer no ecrã.
 * @param {string[]} props.answers - Lista de respostas já baralhadas.
 * @param {number} props.questionNumber - Número da pergunta mostrado ao jogador.
 * @param {number} props.totalQuestions - Total de perguntas do jogo atual.
 * @param {number} props.timeLeft - Segundos restantes, usados para bloquear respostas aos 0 segundos.
 * @param {number} props.timeLimit - Tempo total da pergunta, usado pelo temporizador visual.
 * @param {(answer: string) => void} props.onAnswer - Função chamada quando o jogador escolhe uma resposta.
 * @param {() => void} props.onTimeout - Função chamada quando o jogador avança depois do tempo acabar.
 * @returns {JSX.Element} JSX da pergunta jogável.
 */
function QuestionCard({
    // Dados da pergunta atual.
    // Estes valores são apenas lidos; o QuestionCard não altera a pergunta.
    question,
    answers,
    questionNumber,
    totalQuestions,

    // Estado visual/controlado pelo pai.
    // timeLeft decide se os botões ainda estão ativos e que feedback aparece.
    // timeLimit permite que TimerBar calcule a percentagem sem duplicar constantes.
    timeLeft,
    timeLimit,

    // Callbacks para comunicar ações ao pai.
    // O componente não sabe calcular pontuação; apenas informa o que aconteceu.
    onAnswer,
    onTimeout,
}) {
    return (
        <section className="quiz-card">
            <p>
                Pergunta {questionNumber} de {totalQuestions}
            </p>

            <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />

            <h2>{question.question}</h2>

            <div className="answer-grid">
                {answers.map((answer, index) => (
                    /*
                      Cada resposta gera um botão independente.
                      O clique envia a resposta escolhida para o App.
                      A key junta id, posição e texto para evitar colisões se duas traduções ficarem iguais.
                      O index é aceitável aqui porque as respostas são pequenas, fixas e não editáveis.
                    */
                    <button
                        key={`${question.id}-${index}-${answer}`}
                        type="button"
                        className="answer-button"
                        onClick={() => onAnswer(answer)}
                        disabled={timeLeft === 0}
                    >
                        {answer}
                    </button>
                ))}
            </div>

            {timeLeft === 0 && (
                // Este bloco só aparece quando já não é possível responder.
                // Separar este estado visual evita cliques tardios depois do tempo terminar.
                <div className="button-row">
                    <p className="error-text">Tempo esgotado.</p>
                    {/*
                      O pai decide como tratar uma pergunta sem resposta.
                      Aqui apenas comunicamos que o tempo acabou.
                      Isto mantém a regra de pontuação concentrada no App.
                    */}
                    <button
                        type="button"
                        className="button-secondary"
                        onClick={onTimeout}
                    >
                        Avançar
                    </button>
                </div>
            )}
        </section>
    );
}

export default QuestionCard;
