/**
 * Perguntas locais usadas como base didática e como fallback interno.
 * Cada pergunta tem uma resposta certa e três respostas erradas.
 */
export const localQuestions = [
    {
        id: "local-1",
        question: "Qual destes é um hook do React?",
        correctAnswer: "useState",
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
    {
        id: "local-4",
        question: "Qual hook é usado para executar efeitos?",
        correctAnswer: "useEffect",
        incorrectAnswers: ["useClass", "useHTML", "useFolder"],
    },
    {
        id: "local-5",
        question: "O que significa renderização condicional?",
        correctAnswer: "Mostrar conteúdo diferente conforme uma condição",
        incorrectAnswers: [
            "Apagar componentes automaticamente",
            "Trocar JavaScript por CSS",
            "Executar npm dentro do browser",
        ],
    },
    {
        id: "local-6",
        question: "Porque usamos key quando fazemos map em JSX?",
        correctAnswer: "Para o React identificar cada item da lista",
        incorrectAnswers: [
            "Para encriptar os dados",
            "Para importar ficheiros CSS",
            "Para impedir cliques nos botões",
        ],
    },
    {
        id: "local-7",
        question: "Qual é uma boa razão para usar useMemo?",
        correctAnswer: "Calcular valores derivados apenas quando dependências mudam",
        incorrectAnswers: [
            "Guardar passwords no browser",
            "Substituir todos os useState",
            "Criar componentes sem JSX",
        ],
    },
    {
        id: "local-8",
        question: "O que é um componente controlado?",
        correctAnswer: "Um input cujo valor vem do state",
        incorrectAnswers: [
            "Um botão sem onClick",
            "Um ficheiro que não pode ser editado",
            "Um componente que só usa CSS",
        ],
    },
    {
        id: "local-9",
        question: "Para que serve o cleanup num useEffect com temporizador?",
        correctAnswer: "Para cancelar temporizadores antigos",
        incorrectAnswers: [
            "Para aumentar a pontuação",
            "Para criar novas perguntas",
            "Para mudar o nome da app",
        ],
    },
    {
        id: "local-10",
        question: "Quando faz sentido usar Context?",
        correctAnswer: "Quando vários componentes precisam de dados globais",
        incorrectAnswers: [
            "Sempre que existe uma variável",
            "Apenas para fazer pedidos HTTP",
            "Para substituir todos os ficheiros JSX",
        ],
    },
];
