/**
 * Perguntas locais usadas como base da ficha e como fallback quando a API falha.
 * Mantive 10 perguntas para suportar também o desafio da escolha de quantidade.
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
        question: "Qual é a principal função do useEffect?",
        correctAnswer: "Executar efeitos depois da renderização",
        incorrectAnswers: [
            "Criar automaticamente componentes",
            "Apagar o state",
            "Substituir todos os eventos",
        ],
    },
    {
        id: "local-5",
        question: "Porque usamos key quando fazemos map em React?",
        correctAnswer: "Para ajudar o React a identificar cada item",
        incorrectAnswers: [
            "Para encriptar os dados",
            "Para criar CSS automático",
            "Para impedir o browser de renderizar",
        ],
    },
    {
        id: "local-6",
        question: "O que é um input controlado?",
        correctAnswer: "Um input cujo valor vem do state",
        incorrectAnswers: [
            "Um input que não aceita texto",
            "Um input criado fora do React",
            "Um input que só funciona com CSS",
        ],
    },
    {
        id: "local-7",
        question: "Para que serve useMemo nesta ficha?",
        correctAnswer: "Para calcular valores derivados quando as dependências mudam",
        incorrectAnswers: [
            "Para guardar palavras-passe",
            "Para substituir todos os useState",
            "Para instalar dependências",
        ],
    },
    {
        id: "local-8",
        question: "O que significa prop drilling?",
        correctAnswer: "Passar props por componentes intermédios que não as usam",
        incorrectAnswers: [
            "Furar ficheiros do projeto",
            "Criar props dentro do CSS",
            "Chamar uma API com muitos parâmetros",
        ],
    },
    {
        id: "local-9",
        question: "Quando faz sentido usar Context?",
        correctAnswer: "Quando dados globais são usados em vários componentes",
        incorrectAnswers: [
            "Sempre que existe um botão",
            "Para evitar escrever qualquer prop",
            "Apenas quando não existe state",
        ],
    },
    {
        id: "local-10",
        question: "Porque um pedido fetch deve ter tratamento de erro?",
        correctAnswer: "Porque a rede ou a API podem falhar",
        incorrectAnswers: [
            "Porque fetch apaga ficheiros",
            "Porque React exige sempre localStorage",
            "Porque CSS depende da resposta da API",
        ],
    },
];

