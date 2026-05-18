/**
 * Propósito: guardar perguntas locais para a app conseguir funcionar antes ou quando a API falha.
 * Produz/Devolve: exporta uma lista de perguntas no mesmo formato que a aplicação vai usar no jogo.
 */
export const localQuestions = [
    {
        // ID estável: útil para identificar a pergunta se mais tarde renderizarmos listas.
        // Mesmo que nesta fase ainda não seja essencial, habituamo-nos a modelar dados com identidade própria.
        id: "local-1",

        // Texto que aparece no ecrã.
        // Mantemos este campo com o mesmo nome que a app vai usar depois da API.
        question: "Qual destes é um hook do React?",

        // Resposta certa.
        // A função handleAnswer vai comparar a escolha do jogador com este valor exato.
        correctAnswer: "useState",

        // Respostas erradas.
        // Juntas com a resposta certa, formam as quatro opções de escolha múltipla.
        incorrectAnswers: ["setHTML", "createStyle", "onRender"],
    },
    {
        id: "local-2",
        question: "O que acontece quando o state muda?",
        correctAnswer: "O componente pode voltar a renderizar",
        incorrectAnswers: [
            "O browser fecha",
            "O ficheiro JSX é apagado",
            "O npm instala pacotes automaticamente",
        ],
    },
    {
        id: "local-3",
        question: "Para que servem props?",
        correctAnswer: "Para passar dados de pai para filho",
        incorrectAnswers: [
            "Para criar pastas",
            "Para substituir o CSS",
            "Para ligar diretamente à base de dados",
        ],
    },
];
