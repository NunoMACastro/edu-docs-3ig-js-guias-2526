# Tutorial passo a passo - Quiz Battle: Derrota o Boss (Ficha React 12.º ano)

Esta ficha guia-te na construção de uma pequena app React em formato de jogo.

O objetivo é consolidar hooks e fluxo de dados em React com uma app divertida, mas controlada. A ficha começa com perguntas locais e só depois passa para perguntas vindas de uma API pública.

Objetivo desta versão da ficha:

1. Manter progressão realmente incremental.
2. Separar claramente lógica local, dados externos e interface.
3. Trabalhar dois usos diferentes de `useEffect`.
4. Mostrar quando props são suficientes e quando Context ajuda.
5. Garantir checkpoints curtos e validáveis.

Competências trabalhadas:

1. Setup e estrutura base com Vite.
2. JSX e renderização condicional.
3. Estado com `useState`.
4. Eventos e formulários controlados.
5. Listas com `.map()` e `key`.
6. Valores derivados com `useMemo`.
7. Efeito local com `useEffect` para temporizador.
8. Efeito externo com `useEffect` para carregar dados de API.
9. Componentização com props e callbacks.
10. Prop drilling e `useContext`.

---

## 0) O que vais construir

Uma app chamada **Quiz Battle** onde o jogador responde a perguntas para derrotar um boss.

A app permite:

- escrever o nome do jogador;
- escolher dificuldade;
- começar uma batalha;
- responder a perguntas de escolha múltipla;
- ver um temporizador por pergunta;
- calcular pontuação final;
- carregar perguntas da **Open Trivia DB**;
- mostrar estados de loading e erro;
- alternar tema claro/escuro;
- perceber e resolver um caso simples de prop drilling.

### Vocabulário rápido

- **Estado (`state`)**: dados que mudam durante a execução da app.
- **Estado derivado**: valor calculado a partir de outro estado.
- **Efeito (`useEffect`)**: código que reage a alterações ou interage com o exterior.
- **API**: serviço externo que devolve dados.
- **Loading**: estado visual enquanto algo está a carregar.
- **Erro**: estado visual quando algo falha.
- **Props**: dados/funções passadas de um componente pai para um filho.
- **Callback**: função passada por props para o filho comunicar uma ação ao pai.
- **Prop drilling**: passar props por vários componentes que não precisam delas diretamente.
- **Context**: forma de disponibilizar dados a vários componentes sem passar props por todos os níveis.

### Estratégia de estudo

1. Implementa fase a fase, sem saltar.
2. Testa no browser no fim de cada fase.
3. Só avança quando o checkpoint estiver estável.
4. Lê os comentários do código.
5. Explica em voz alta o que cada hook está a fazer.
6. Quando algo falhar, consulta primeiro a secção de erros comuns.

### Como usar os snippets desta ficha

Esta ficha usa snippets de duas formas:

1. **Substitui o ficheiro**: quando o enunciado disser “Substitui `src/App.jsx` por”, deves trocar o conteúdo completo desse ficheiro.
2. **Adiciona / atualiza / substitui um bloco**: quando o enunciado disser “Adiciona estado”, “Atualiza `startBattle`” ou “Substitui o bloco `playing`”, deves manter o resto do ficheiro igual e alterar apenas a parte indicada.

Regra prática:

- Se o snippet começa com imports e termina com `export default`, normalmente é uma versão completa do ficheiro.
- Se o snippet mostra só uma função, uma constante ou um pedaço de JSX, é uma alteração incremental.
- Depois de cada snippet incremental, relê o ficheiro completo para garantir que não criaste variáveis duplicadas.

### Debug rápido para toda a ficha

1. Estás na pasta certa? (`pwd`)
2. O servidor está a correr? (`npm run dev`)
3. Guardaste o ficheiro antes de testar?
4. A consola do browser mostra erros?
5. O terminal mostra erros de import?
6. Os nomes dos ficheiros batem certo com os imports?
7. O pedido à API aparece no separador Network?

### Pontos de paragem

- **Paragem A**: layout base com estilos.
- **Paragem B1**: nome e dificuldade controlados por estado.
- **Paragem B2**: estado do jogo (`idle`, `playing`, `finished`).
- **Paragem C1**: perguntas locais carregadas.
- **Paragem C2**: resposta avança para a pergunta seguinte.
- **Paragem C3**: resultado final aparece.
- **Paragem D1**: estatísticas calculadas com `useMemo`.
- **Paragem D2**: respostas baralhadas sem mudar a cada render.
- **Paragem E1**: temporizador desce com `useEffect`.
- **Paragem E2**: tempo esgotado bloqueia respostas.
- **Paragem F**: app separada em componentes com props.
- **Paragem G**: loading, erro e serviço da API criados.
- **Paragem H**: perguntas carregadas da API com `useEffect`.
- **Paragem I**: prop drilling identificado.
- **Paragem J**: `useContext` usado para preferências globais.

### Mapa mental da app

- **Dados locais**: `localQuestions.js`, usados para aprender a mecânica do jogo.
- **Dados externos**: perguntas carregadas da Open Trivia DB.
- **Estado principal**: vive no `App.jsx`.
- **Componentes**: mostram partes da interface e recebem props.
- **Serviço da API**: vive em `services/triviaApi.js`.
- **Context**: guarda preferências globais simples, como jogador, dificuldade e tema.

### Ligações diretas aos temas

1. **`useState`** - nome, dificuldade, estado do jogo, pergunta atual, respostas, tempo, loading e erro.
2. **`useEffect` local** - temporizador que diminui de segundo em segundo.
3. **`useEffect` externo** - pedido à API quando começa uma batalha.
4. **`useMemo`** - estatísticas finais e respostas baralhadas.
5. **Props** - componentes recebem dados e callbacks.
6. **Prop drilling** - exemplo com `theme`, `playerName` e `difficulty`.
7. **`useContext`** - preferências globais sem passar props por todos os níveis.

### Conceitos essenciais

**1) Fluxo de dados**

- A interface mostra o estado atual.
- Quando o estado muda, o React volta a renderizar.
- O dado desce por props.
- As ações sobem por callbacks.

**2) Estado local vs dados externos**

- `playerName`, `difficulty`, `gameStatus`, `timeLeft` são estados locais.
- As perguntas da API são dados externos.
- Dados externos podem demorar, falhar ou vir num formato diferente do que a app precisa.

**3) Renderização condicional**

A app mostra ecrãs diferentes conforme `gameStatus`:

- `idle`: ecrã inicial;
- `loading`: a carregar perguntas;
- `playing`: pergunta atual;
- `finished`: resultado final.

**4) Efeitos**

Usamos `useEffect` quando a app precisa de fazer algo fora do cálculo normal do JSX:

- esperar 1 segundo e diminuir o tempo;
- fazer um pedido HTTP;
- cancelar um pedido se o componente deixar de precisar dele.

**5) Memoização**

`useMemo` deve ser usado para valores derivados que queremos recalcular apenas quando certas dependências mudam.

Nesta ficha usamos para:

- estatísticas finais;
- respostas baralhadas da pergunta atual.

**6) Props vs Context**

- Usa props quando o pai comunica diretamente com o filho.
- Usa Context quando vários componentes distantes precisam do mesmo dado global.
- Context não substitui todas as props.

---

## 1) Pré-requisitos

- Node.js 18+
- npm
- VS Code ou outro editor

Verifica versões:

```bash
node -v
npm -v
```

---

## 2) Criar o projeto

```bash
npm create vite@latest ficha04-quiz-battle -- --template react
cd ficha04-quiz-battle
npm install
npm run dev
```

Opcional:

```bash
code .
```

---

## 3) Limpeza inicial

Se quiseres começar limpo:

- apagar `src/App.css`;
- remover `import "./App.css"` do `src/App.jsx`;
- apagar `src/assets/`, se existir.

No mínimo, mantém:

```text
src/
  App.jsx
  main.jsx
```

---

## 4) Estrutura de pastas da ficha

Ao longo da ficha, o projeto vai ficar assim:

```text
ficha04-quiz-battle/
├─ index.html
├─ package.json
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ data/
   │  └─ localQuestions.js
   ├─ services/
   │  └─ triviaApi.js
   ├─ context/
   │  └─ GameSettingsContext.jsx
   ├─ components/
   │  ├─ ErrorState.jsx
   │  ├─ LoadingState.jsx
   │  ├─ QuestionCard.jsx
   │  ├─ ResultScreen.jsx
   │  ├─ StartScreen.jsx
   │  └─ TimerBar.jsx
   └─ styles/
      ├─ index.css
      └─ quiz.css
```

Cria as pastas quando forem necessárias. Não precisas de criar tudo já.

---

## 5) Estilos base

Ideia desta fase:

- preparar uma interface simples, legível e consistente;
- evitar excesso de estilos inline nas fases finais.

Cria `src/styles/index.css`:

```css
/* Garante que padding e border entram no cálculo da largura total. */
* {
    box-sizing: border-box;
}

/* Remove margens padrão do browser e define uma base visual simples. */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f3f4f6;
    color: #111827;
}

/* Faz inputs, selects e botões herdarem a fonte da página. */
button,
input,
select {
    font: inherit;
}

/* Mostra visualmente que os botões são elementos clicáveis. */
button {
    cursor: pointer;
}

/* Dá feedback quando um botão está bloqueado. */
button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
```

Cria `src/styles/quiz.css`:

```css
/* Container global da aplicação. Ocupa o ecrã todo. */
.app {
    min-height: 100vh;
    padding: 24px;
    background: #f3f4f6;
    color: #111827;
}

/* Classe alternativa aplicada quando o tema escuro estiver ativo. */
.app--dark {
    background: #111827;
    color: #f9fafb;
}

/* Limita a largura da app para o conteúdo não ficar demasiado espalhado. */
.quiz-shell {
    max-width: 760px;
    margin: 0 auto;
}

/* Cartão base usado para cada ecrã principal da ficha. */
.quiz-card {
    margin-top: 24px;
    padding: 20px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #ffffff;
    color: #111827;
}

/* Ajusta o cartão quando o tema escuro está ativo. */
.app--dark .quiz-card {
    border-color: #374151;
    background: #1f2937;
    color: #f9fafb;
}

/* Cada linha de formulário fica em coluna: label em cima, campo por baixo. */
.form-row {
    display: grid;
    gap: 6px;
    margin-top: 14px;
}

/* Estilo comum para campos de texto e seleção. */
.form-row input,
.form-row select {
    padding: 10px;
    border: 1px solid #9ca3af;
    border-radius: 6px;
}

/* Grelhas simples para botões principais e respostas. */
.button-row,
.answer-grid {
    display: grid;
    gap: 10px;
    margin-top: 18px;
}

/* Botões partilham tamanho e arredondamento para consistência visual. */
.button-primary,
.button-secondary,
.answer-button {
    padding: 10px 14px;
    border: 1px solid #2563eb;
    border-radius: 6px;
    background: #2563eb;
    color: white;
}

/* Botão secundário: usado para ações menos principais. */
.button-secondary {
    border-color: #6b7280;
    background: #6b7280;
}

/* Respostas parecem botões, mas com aspeto mais neutro. */
.answer-button {
    border-color: #d1d5db;
    background: #ffffff;
    color: #111827;
    text-align: left;
}

/* Pequeno feedback ao passar o rato por uma resposta ativa. */
.answer-button:hover:not(:disabled) {
    border-color: #2563eb;
}

/* Espaçamento do bloco do temporizador. */
.timer {
    margin: 12px 0;
}

/* Fundo da barra do temporizador. */
.timer-bar {
    height: 10px;
    overflow: hidden;
    border-radius: 999px;
    background: #e5e7eb;
}

/* Parte preenchida da barra. A largura será controlada por React. */
.timer-bar__fill {
    height: 100%;
    background: #22c55e;
    transition: width 0.2s ease;
}

/* Mensagens de erro ou aviso importante. */
.error-text {
    color: #b91c1c;
}

/* Texto secundário, usado para ajuda ou contexto. */
.muted {
    color: #6b7280;
}
```

Atualiza `src/main.jsx`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import "./styles/quiz.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

**Checkpoint**

- O projeto continua a arrancar.
- Não há erro de import dos ficheiros CSS.

---

## 6) Fase 1 - Layout base (Paragem A)

Ideia nova desta fase:

- apenas renderização estática.

Substitui `src/App.jsx` por:

```jsx
/**
 * Componente principal da app Quiz Battle.
 * Nesta fase só validamos o layout base.
 * @returns {JSX.Element}
 */
function App() {
    return (
        // <main> representa o conteúdo principal da página.
        // A classe "app" aplica o fundo e o espaçamento global.
        <main className="app">
            {/* "quiz-shell" limita a largura para melhorar a leitura. */}
            <div className="quiz-shell">
                <h1>Quiz Battle</h1>
                <p>Responde a perguntas para derrotar o boss.</p>

                {/* Nesta fase, o cartão é apenas estático. */}
                <section className="quiz-card">
                    <h2>Preparar batalha</h2>
                    <p className="muted">
                        Na próxima fase vais controlar o nome e a dificuldade
                        com estado React.
                    </p>
                </section>
            </div>
        </main>
    );
}

export default App;
```

**Checkpoint A**

- Vês o título `Quiz Battle`.
- Vês o cartão “Preparar batalha”.
- Não há erros na consola.

---

## 7) Fase 2 - Nome e dificuldade (Paragem B1)

Ideia nova desta fase:

- criar inputs controlados com `useState`.

Atualiza `src/App.jsx`:

```jsx
import { useState } from "react";

/**
 * App com nome e dificuldade controlados por React.
 * @returns {JSX.Element}
 */
function App() {
    // Estado do input do nome. Começa vazio porque o jogador ainda não escreveu.
    const [playerName, setPlayerName] = useState("");

    // Estado do select da dificuldade. Começa em "easy" para haver uma opção padrão.
    const [difficulty, setDifficulty] = useState("easy");

    return (
        <main className="app">
            <div className="quiz-shell">
                <h1>Quiz Battle</h1>
                <p>Responde a perguntas para derrotar o boss.</p>

                <section className="quiz-card">
                    <h2>Preparar batalha</h2>

                    <label className="form-row">
                        Nome do jogador
                        {/*
                          Num input controlado, o valor vem sempre do state.
                          Cada tecla chama onChange e atualiza esse state.
                        */}
                        <input
                            type="text"
                            value={playerName}
                            onChange={(event) =>
                                setPlayerName(event.target.value)
                            }
                            placeholder="Ex.: Ana"
                        />
                    </label>

                    <label className="form-row">
                        Dificuldade
                        {/*
                          O select também é controlado pelo state.
                          event.target.value contém o value da option escolhida.
                        */}
                        <select
                            value={difficulty}
                            onChange={(event) =>
                                setDifficulty(event.target.value)
                            }
                        >
                            <option value="easy">Fácil</option>
                            <option value="medium">Média</option>
                            <option value="hard">Difícil</option>
                        </select>
                    </label>

                    <p className="muted">
                        {/* Esta pré-visualização serve para confirmar que o state está sincronizado. */}
                        Jogador: {playerName || "(sem nome)"} | Dificuldade:{" "}
                        {difficulty}
                    </p>
                </section>
            </div>
        </main>
    );
}

export default App;
```

**Checkpoint B1**

- O que escreves aparece em “Jogador”.
- A dificuldade muda quando alteras o `select`.

---

## 8) Fase 3 - Estado do jogo e validação (Paragem B2)

Ideia nova desta fase:

- controlar o ecrã atual da app;
- impedir começar sem nome.

Estados do jogo:

- `idle`: ecrã inicial;
- `playing`: batalha em curso;
- `finished`: resultado final;
- mais tarde vamos adicionar `loading`.

Atualiza `src/App.jsx`:

```jsx
import { useState } from "react";

/**
 * App com estado de jogo e validação simples.
 * @returns {JSX.Element}
 */
function App() {
    // Nome escrito pelo jogador.
    const [playerName, setPlayerName] = useState("");

    // Dificuldade escolhida no select.
    const [difficulty, setDifficulty] = useState("easy");

    // Estado que decide que "ecrã" a app mostra neste momento.
    const [gameStatus, setGameStatus] = useState("idle");

    // trim remove espaços no início/fim para evitar nomes como "   ".
    const cleanPlayerName = playerName.trim();

    // Regra simples de validação: pelo menos 2 caracteres úteis.
    const canStartBattle = cleanPlayerName.length >= 2;

    const startBattle = () => {
        // Se o nome ainda não for válido, a função termina imediatamente.
        if (!canStartBattle) return;

        // Mudar o estado do jogo faz a UI trocar do ecrã inicial para a batalha.
        setGameStatus("playing");
    };

    const resetBattle = () => {
        // Volta ao ecrã inicial.
        setGameStatus("idle");
    };

    return (
        <main className="app">
            <div className="quiz-shell">
                <h1>Quiz Battle</h1>

                {gameStatus === "idle" && (
                    // Renderização condicional: este bloco só aparece no estado "idle".
                    <section className="quiz-card">
                        <h2>Preparar batalha</h2>

                        <label className="form-row">
                            Nome do jogador
                            <input
                                type="text"
                                value={playerName}
                                onChange={(event) =>
                                    setPlayerName(event.target.value)
                                }
                                placeholder="Ex.: Ana"
                            />
                        </label>

                        <label className="form-row">
                            Dificuldade
                            <select
                                value={difficulty}
                                onChange={(event) =>
                                    setDifficulty(event.target.value)
                                }
                            >
                                <option value="easy">Fácil</option>
                                <option value="medium">Média</option>
                                <option value="hard">Difícil</option>
                            </select>
                        </label>

                        {!canStartBattle && (
                            // Feedback imediato para explicar porque o botão está bloqueado.
                            <p className="error-text">
                                Escreve pelo menos 2 caracteres no nome.
                            </p>
                        )}

                        <div className="button-row">
                            {/*
                              O botão fica bloqueado até o nome ser válido.
                              Isto dá feedback visual e também impede cliques inválidos.
                            */}
                            <button
                                type="button"
                                className="button-primary"
                                onClick={startBattle}
                                disabled={!canStartBattle}
                            >
                                Começar batalha
                            </button>
                        </div>
                    </section>
                )}

                {gameStatus === "playing" && (
                    // Bloco temporário para confirmar a transição de estado.
                    <section className="quiz-card">
                        <h2>Batalha em curso</h2>
                        <p>Jogador: {cleanPlayerName}</p>
                        <p>Dificuldade: {difficulty}</p>
                        <button
                            type="button"
                            className="button-secondary"
                            onClick={() => setGameStatus("finished")}
                        >
                            Terminar teste rápido
                        </button>
                    </section>
                )}

                {gameStatus === "finished" && (
                    // Bloco final temporário. Mais tarde mostraremos estatísticas reais.
                    <section className="quiz-card">
                        <h2>Fim da batalha</h2>
                        <button
                            type="button"
                            className="button-primary"
                            onClick={resetBattle}
                        >
                            Voltar ao início
                        </button>
                    </section>
                )}
            </div>
        </main>
    );
}

export default App;
```

**Checkpoint B2**

- Não consegues começar sem nome válido.
- O botão começa a batalha.
- O botão de teste termina a batalha.
- O botão final volta ao início.

---

## 9) Fase 4 - Perguntas locais (Paragem C1)

Ideia nova desta fase:

- começar com dados locais antes da API.

Isto evita misturar duas dificuldades ao mesmo tempo: primeiro aprendemos a mecânica do jogo, depois carregamos dados externos.

Cria `src/data/localQuestions.js`:

```jsx
/**
 * Perguntas locais usadas antes da integração com a API.
 * Cada pergunta tem uma resposta certa e três respostas erradas.
 */
export const localQuestions = [
    {
        // ID estável: útil para identificar a pergunta se mais tarde renderizarmos listas.
        id: "local-1",

        // Texto que aparece no ecrã.
        question: "Qual destes é um hook do React?",

        // Resposta certa. Vamos comparar a resposta escolhida com este valor.
        correctAnswer: "useState",

        // Respostas erradas. Juntas com a certa, formam as 4 opções.
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
```

Atualiza o início de `src/App.jsx`:

```jsx
import { useState } from "react";
import { localQuestions } from "./data/localQuestions";
```

A partir daqui, os snippets desta fase são **incrementais**: adicionas as linhas indicadas ao `App.jsx` que já tinhas na fase anterior.

Adiciona estado para a pergunta atual:

```jsx
// Índice da pergunta atual dentro do array de perguntas.
// Começa em 0 porque arrays em JavaScript começam no índice 0.
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
```

Adiciona estas variáveis antes do `return`:

```jsx
// Por agora, a fonte de perguntas é apenas o array local.
// Mais tarde, esta variável será substituída por state vindo da API.
const questions = localQuestions;

// A pergunta atual é encontrada pelo índice guardado no state.
const currentQuestion = questions[currentQuestionIndex];

// Guardamos o total numa variável para não repetir questions.length no JSX.
const totalQuestions = questions.length;
```

Substitui temporariamente o bloco `playing`:

```jsx
{gameStatus === "playing" && currentQuestion && (
    <section className="quiz-card">
        <p>
            Pergunta {currentQuestionIndex + 1} de {totalQuestions}
        </p>
        <h2>{currentQuestion.question}</h2>
        <p className="muted">
            Resposta certa nesta fase: {currentQuestion.correctAnswer}
        </p>
    </section>
)}
```

**Checkpoint C1**

- Ao começar, aparece a primeira pergunta local.
- Ainda não há botões de resposta.

---

## 10) Fase 5 - Responder e avançar (Paragem C2)

Ideia nova desta fase:

- criar lista de respostas;
- registar se a resposta foi certa ou errada;
- avançar para a próxima pergunta.

Adiciona estado:

```jsx
// Guarda um boolean por cada resposta:
// true = certa, false = errada.
const [answerResults, setAnswerResults] = useState([]);
```

Este snippet é incremental: adiciona o estado junto dos outros `useState`.

Adiciona esta função antes do `return`:

```jsx
/**
 * Regista a resposta escolhida e avança para a próxima pergunta.
 * @param {string} selectedAnswer - Resposta escolhida pelo jogador.
 */
const handleAnswer = (selectedAnswer) => {
    // Compara a resposta escolhida com a resposta certa da pergunta atual.
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Criamos um novo array para respeitar a regra de imutabilidade do React.
    // Nunca fazemos answerResults.push(...).
    const updatedResults = [...answerResults, isCorrect];

    // Atualiza o histórico de respostas.
    setAnswerResults(updatedResults);

    // Estamos na última pergunta se o índice atual for o último índice do array.
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
        // Se era a última pergunta, a batalha termina.
        setGameStatus("finished");
        return;
    }

    // Caso contrário, avança uma posição no array.
    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
};
```

Atualiza `startBattle` para reiniciar progresso:

```jsx
const startBattle = () => {
    // Mantemos a validação da fase anterior.
    if (!canStartBattle) return;

    // Cada nova batalha deve começar na primeira pergunta.
    setCurrentQuestionIndex(0);

    // Cada nova batalha deve limpar respostas antigas.
    setAnswerResults([]);

    // Só depois de reiniciar o progresso mudamos para o ecrã de jogo.
    setGameStatus("playing");
};
```

Cria as respostas da pergunta atual:

```jsx
// Nesta fase, as respostas ainda aparecem sempre na mesma ordem:
// primeiro a correta, depois as erradas. Mais tarde vamos baralhar.
const currentAnswers = currentQuestion
    ? [currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers]
    : [];
```

Substitui o bloco `playing`:

```jsx
{gameStatus === "playing" && currentQuestion && (
    <section className="quiz-card">
        <p>
            Pergunta {currentQuestionIndex + 1} de {totalQuestions}
        </p>
        <h2>{currentQuestion.question}</h2>

        <div className="answer-grid">
            {currentAnswers.map((answer) => (
                /*
                  Cada resposta gera um botão.
                  A key ajuda o React a identificar cada item.
                */
                <button
                    key={answer}
                    type="button"
                    className="answer-button"
                    onClick={() => handleAnswer(answer)}
                >
                    {answer}
                </button>
            ))}
        </div>
    </section>
)}
```

**Checkpoint C2**

- A pergunta mostra quatro respostas.
- Clicar numa resposta avança.
- No fim aparece o ecrã final.

---

## 11) Fase 6 - Resultado final simples (Paragem C3)

Ideia nova desta fase:

- mostrar resultado com base nas respostas registadas.

Substitui o bloco `finished`:

```jsx
{gameStatus === "finished" && (
    <section className="quiz-card">
        <h2>Fim da batalha</h2>
        <p>Jogador: {cleanPlayerName}</p>
        <p>
            Respostas certas: {answerResults.filter(Boolean).length} de{" "}
            {totalQuestions}
        </p>

        <button
            type="button"
            className="button-primary"
            onClick={resetBattle}
        >
            Voltar ao início
        </button>
    </section>
)}
```

**Checkpoint C3**

- No fim aparece o número de respostas certas.
- Se responderes tudo errado, aparece 0.
- Se responderes tudo certo, aparece 3.

---

## 12) Fase 7 - Estatísticas com `useMemo` (Paragem D1)

Ideia nova desta fase:

- calcular valores derivados sem criar estado desnecessário.

Não vamos criar `score`, `percentage` e `victory` com `useState`, porque estes valores derivam de `answerResults` e `totalQuestions`.

Atualiza o import:

```jsx
import { useMemo, useState } from "react";
```

Este snippet substitui apenas a linha de import do React. O resto do ficheiro mantém-se.

Adiciona antes do `return`:

```jsx
const battleStats = useMemo(() => {
    // Conta apenas os valores true.
    // Boolean é prático aqui porque cada resposta fica registada como true/false.
    const correctAnswers = answerResults.filter(Boolean).length;

    // Nesta regra simples, cada resposta certa vale 100 pontos.
    const score = correctAnswers * 100;

    // Evita divisão por zero caso ainda não existam perguntas.
    const percentage =
        totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0;

    // Regra do jogo: o jogador vence se acertar pelo menos 60%.
    const victory = percentage >= 60;

    // Devolvemos um objeto para agrupar todas as estatísticas finais.
    return {
        correctAnswers,
        totalQuestions,
        score,
        percentage,
        victory,
    };
// O cálculo só precisa de ser refeito quando mudam as respostas ou o total.
}, [answerResults, totalQuestions]);
```

Atualiza o bloco `finished`:

```jsx
{gameStatus === "finished" && (
    <section className="quiz-card">
        <h2>{battleStats.victory ? "Vitória!" : "Derrota!"}</h2>
        <p>Jogador: {cleanPlayerName}</p>
        <p>Pontuação: {battleStats.score}</p>
        <p>
            Certas: {battleStats.correctAnswers} de{" "}
            {battleStats.totalQuestions}
        </p>
        <p>Percentagem: {battleStats.percentage}%</p>

        <button
            type="button"
            className="button-primary"
            onClick={resetBattle}
        >
            Voltar ao início
        </button>
    </section>
)}
```

**Checkpoint D1**

- A pontuação aparece.
- A percentagem aparece.
- A vitória acontece com 60% ou mais.
- Não criaste estado extra para pontuação.

---

## 13) Fase 8 - Baralhar respostas com `useMemo` (Paragem D2)

Ideia nova desta fase:

- evitar que as respostas mudem de ordem em cada render.

Se usares `sort(() => Math.random() - 0.5)` diretamente no JSX, as respostas podem mudar de ordem sempre que o componente renderiza. Mais tarde, quando houver temporizador, isso seria muito confuso.

Adiciona esta função fora do componente `App`:

```jsx
/**
 * Baralha uma lista sem alterar o array original.
 * Esta versão é simples e suficiente para a ficha.
 * @param {string[]} items - Lista original.
 * @returns {string[]} Nova lista baralhada.
 */
function shuffleItems(items) {
    // [...items] cria uma cópia. Assim, não alteramos o array original.
    // sort com Math.random é suficiente para este exercício didático.
    return [...items].sort(() => Math.random() - 0.5);
}
```

Substitui `currentAnswers` por:

```jsx
const currentAnswers = useMemo(() => {
    // Durante alguns renders, pode ainda não existir pergunta atual.
    // Nesse caso, devolvemos array vazio para evitar erros no .map().
    if (!currentQuestion) return [];

    // Juntamos resposta certa + erradas num único array.
    return shuffleItems([
        currentQuestion.correctAnswer,
        ...currentQuestion.incorrectAnswers,
    ]);
// Só queremos baralhar quando muda a pergunta atual.
// Se o tempo mudar, currentQuestion não muda, por isso a ordem mantém-se.
}, [currentQuestion]);
```

**Checkpoint D2**

- As respostas aparecem baralhadas.
- A ordem não muda só por a app voltar a renderizar.
- Ao avançar para outra pergunta, a nova pergunta tem nova lista de respostas.

---

## 14) Fase 9 - `useEffect` local: temporizador (Paragem E1)

Ideia nova desta fase:

- usar `useEffect` para um efeito local.

Vamos dar 15 segundos por pergunta.

Atualiza o import:

```jsx
import { useEffect, useMemo, useState } from "react";
```

Este snippet substitui novamente apenas a linha de import do React.

Adiciona uma constante fora do componente:

```jsx
// Tempo inicial de cada pergunta.
// Usar uma constante evita repetir o número 15 em vários sítios.
const QUESTION_TIME_LIMIT = 15;
```

Adiciona estado:

```jsx
// Tempo restante da pergunta atual.
const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
```

Atualiza `startBattle`:

```jsx
const startBattle = () => {
    if (!canStartBattle) return;

    setCurrentQuestionIndex(0);
    setAnswerResults([]);

    // Cada batalha começa com o tempo completo.
    setTimeLeft(QUESTION_TIME_LIMIT);
    setGameStatus("playing");
};
```

Adiciona o efeito:

```jsx
useEffect(() => {
    // O temporizador só deve correr durante a batalha.
    // Se estivermos no menu, loading, erro ou resultado, não faz nada.
    if (gameStatus !== "playing") return;

    // Se o tempo chegou a 0, paramos de agendar novos segundos.
    if (timeLeft === 0) return;

    // setTimeout espera 1 segundo e depois atualiza o state.
    const timeoutId = setTimeout(() => {
        // Forma funcional: recebe o valor mais recente do state.
        setTimeLeft((currentTime) => currentTime - 1);
    }, 1000);

    // Cleanup: se o componente renderizar outra vez antes do timeout terminar,
    // cancelamos o timeout anterior para evitar contagens duplicadas.
    return () => {
        clearTimeout(timeoutId);
    };
// Dependências: o efeito depende do estado do jogo e do tempo atual.
}, [gameStatus, timeLeft]);
```

Dentro do bloco `playing`, antes da pergunta, adiciona:

```jsx
<p>Tempo restante: {timeLeft}s</p>
```

Atualiza `handleAnswer` para reiniciar o tempo ao avançar:

```jsx
// Quando avança para a próxima pergunta, o temporizador reinicia.
setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
setTimeLeft(QUESTION_TIME_LIMIT);
```

**Checkpoint E1**

- O tempo começa em 15.
- O tempo desce de segundo em segundo.
- Ao responder e avançar, o tempo volta a 15.

---

## 15) Fase 10 - Tempo esgotado (Paragem E2)

Ideia nova desta fase:

- bloquear respostas quando o tempo termina;
- contar a pergunta como errada se o jogador avançar sem responder.

Cria esta função:

```jsx
/**
 * Conta a pergunta como errada quando o tempo termina.
 */
const handleTimeout = () => {
    // Reutilizamos handleAnswer para não duplicar lógica de avanço.
    // A string vazia nunca será igual à resposta certa, por isso conta como errada.
    handleAnswer("");
};
```

Atualiza os botões de resposta:

```jsx
{currentAnswers.map((answer) => (
    <button
        key={answer}
        type="button"
        className="answer-button"
        onClick={() => handleAnswer(answer)}
        disabled={timeLeft === 0}
    >
        {answer}
    </button>
))}
```

Depois da grelha de respostas, adiciona:

```jsx
{timeLeft === 0 && (
    <div className="button-row">
        <p className="error-text">Tempo esgotado.</p>
        <button
            type="button"
            className="button-secondary"
            onClick={handleTimeout}
        >
            Avançar
        </button>
    </div>
)}
```

**Checkpoint E2**

- Quando o tempo chega a 0, os botões ficam bloqueados.
- O botão “Avançar” conta a pergunta como errada.
- A batalha continua normalmente.

---

## 16) Fase 11 - Componentes e props (Paragem F)

Ideia nova desta fase:

- separar responsabilidades;
- passar dados e callbacks por props.

Cria a pasta `src/components/`.

### 16.1) `StartScreen.jsx`

```jsx
/**
 * Ecrã inicial da app.
 * @param {object} props - Props do componente.
 * @param {string} props.playerName - Nome atual do jogador.
 * @param {(name: string) => void} props.onPlayerNameChange - Atualiza o nome.
 * @param {string} props.difficulty - Dificuldade atual.
 * @param {(difficulty: string) => void} props.onDifficultyChange - Atualiza a dificuldade.
 * @param {boolean} props.canStartBattle - Indica se o nome é válido.
 * @param {() => void} props.onStartBattle - Começa a batalha.
 * @returns {JSX.Element}
 */
function StartScreen({
    // Valores controlados pelo componente pai.
    playerName,
    onPlayerNameChange,
    difficulty,
    onDifficultyChange,

    // Validação também vem do pai, porque depende da regra da app.
    canStartBattle,

    // Callback chamado quando o jogador tenta começar.
    onStartBattle,
}) {
    return (
        <section className="quiz-card">
            <h2>Preparar batalha</h2>

            <label className="form-row">
                Nome do jogador
                {/*
                  O filho mostra o valor recebido por props e usa o callback
                  para pedir ao pai que atualize o state.
                */}
                <input
                    type="text"
                    value={playerName}
                    onChange={(event) => onPlayerNameChange(event.target.value)}
                    placeholder="Ex.: Ana"
                />
            </label>

            <label className="form-row">
                Dificuldade
                {/*
                  Mesma ideia do input: valor recebido por props,
                  atualização comunicada ao pai por callback.
                */}
                <select
                    value={difficulty}
                    onChange={(event) =>
                        onDifficultyChange(event.target.value)
                    }
                >
                    <option value="easy">Fácil</option>
                    <option value="medium">Média</option>
                    <option value="hard">Difícil</option>
                </select>
            </label>

            {!canStartBattle && (
                // A mensagem usa a validação calculada no pai.
                <p className="error-text">
                    Escreve pelo menos 2 caracteres no nome.
                </p>
            )}

            <div className="button-row">
                {/*
                  O clique sobe para o pai. O componente filho não decide
                  sozinho quando a batalha começa.
                */}
                <button
                    type="button"
                    className="button-primary"
                    onClick={onStartBattle}
                    disabled={!canStartBattle}
                >
                    Começar batalha
                </button>
            </div>
        </section>
    );
}

export default StartScreen;
```

### 16.2) `TimerBar.jsx`

```jsx
const QUESTION_TIME_LIMIT = 15;

/**
 * Mostra o tempo restante da pergunta.
 * @param {object} props - Props do componente.
 * @param {number} props.timeLeft - Tempo restante.
 * @returns {JSX.Element}
 */
function TimerBar({ timeLeft }) {
    // Converte segundos restantes em percentagem para controlar a largura da barra.
    const percentage = (timeLeft / QUESTION_TIME_LIMIT) * 100;

    return (
        <div className="timer">
            <p>Tempo restante: {timeLeft}s</p>
            <div className="timer-bar">
                {/*
                  Este é um caso aceitável de estilo inline:
                  a largura depende de um valor dinâmico calculado em React.
                */}
                <div
                    className="timer-bar__fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default TimerBar;
```

### 16.3) `QuestionCard.jsx`

```jsx
import TimerBar from "./TimerBar.jsx";

/**
 * Mostra a pergunta atual e as respostas possíveis.
 * @param {object} props - Props do componente.
 * @param {object} props.question - Pergunta atual.
 * @param {string[]} props.answers - Respostas baralhadas.
 * @param {number} props.questionNumber - Número da pergunta atual.
 * @param {number} props.totalQuestions - Total de perguntas.
 * @param {number} props.timeLeft - Tempo restante.
 * @param {(answer: string) => void} props.onAnswer - Regista resposta.
 * @param {() => void} props.onTimeout - Avança quando o tempo acaba.
 * @returns {JSX.Element}
 */
function QuestionCard({
    // Dados da pergunta atual.
    question,
    answers,
    questionNumber,
    totalQuestions,

    // Estado visual/controlado pelo pai.
    timeLeft,

    // Callbacks para comunicar ações ao pai.
    onAnswer,
    onTimeout,
}) {
    return (
        <section className="quiz-card">
            <p>
                Pergunta {questionNumber} de {totalQuestions}
            </p>

            <TimerBar timeLeft={timeLeft} />

            <h2>{question.question}</h2>

            <div className="answer-grid">
                {answers.map((answer) => (
                    /*
                      Cada resposta gera um botão independente.
                      O clique envia a resposta escolhida para o App.
                    */
                    <button
                        key={answer}
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
                <div className="button-row">
                    <p className="error-text">Tempo esgotado.</p>
                    {/*
                      O pai decide como tratar uma pergunta sem resposta.
                      Aqui apenas comunicamos que o tempo acabou.
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
```

### 16.4) `ResultScreen.jsx`

```jsx
/**
 * Ecrã final da batalha.
 * @param {object} props - Props do componente.
 * @param {string} props.playerName - Nome do jogador.
 * @param {object} props.stats - Estatísticas finais.
 * @param {() => void} props.onReset - Volta ao início.
 * @returns {JSX.Element}
 */
function ResultScreen({ playerName, stats, onReset }) {
    return (
        <section className="quiz-card">
            {/* A frase depende de stats.victory, calculado no App com useMemo. */}
            <h2>{stats.victory ? "Vitória!" : "Derrota!"}</h2>
            <p>Jogador: {playerName}</p>
            <p>Pontuação: {stats.score}</p>
            <p>
                Certas: {stats.correctAnswers} de {stats.totalQuestions}
            </p>
            <p>Percentagem: {stats.percentage}%</p>

            <button
                type="button"
                className="button-primary"
                onClick={onReset}
            >
                Voltar ao início
            </button>
        </section>
    );
}

export default ResultScreen;
```

Atualiza os imports no `App.jsx`:

```jsx
import QuestionCard from "./components/QuestionCard.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import StartScreen from "./components/StartScreen.jsx";
```

Substitui os blocos principais do JSX por:

```jsx
{gameStatus === "idle" && (
    <StartScreen
        playerName={playerName}
        onPlayerNameChange={setPlayerName}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        canStartBattle={canStartBattle}
        onStartBattle={startBattle}
    />
)}

{gameStatus === "playing" && currentQuestion && (
    <QuestionCard
        question={currentQuestion}
        answers={currentAnswers}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        timeLeft={timeLeft}
        onAnswer={handleAnswer}
        onTimeout={handleTimeout}
    />
)}

{gameStatus === "finished" && (
    <ResultScreen
        playerName={cleanPlayerName}
        stats={battleStats}
        onReset={resetBattle}
    />
)}
```

**Checkpoint F**

- A app continua a funcionar.
- `App.jsx` continua a guardar o estado principal.
- Os filhos recebem dados por props.
- Os filhos comunicam ações através de callbacks.

---

## 17) Fase 12 - Loading e erro (Paragem G)

Ideia nova desta fase:

- preparar estados visuais antes de chamar a API.

Cria `src/components/LoadingState.jsx`:

```jsx
/**
 * Mostra feedback enquanto a app carrega dados.
 * @returns {JSX.Element}
 */
function LoadingState() {
    return (
        <section className="quiz-card">
            {/* Este componente não precisa de state: só mostra feedback fixo. */}
            <h2>A carregar perguntas...</h2>
            <p className="muted">A batalha vai começar dentro de instantes.</p>
        </section>
    );
}

export default LoadingState;
```

Cria `src/components/ErrorState.jsx`:

```jsx
/**
 * Mostra uma mensagem de erro e permite voltar ao início.
 * @param {object} props - Props do componente.
 * @param {string} props.message - Mensagem de erro.
 * @param {() => void} props.onReset - Volta ao início.
 * @returns {JSX.Element}
 */
function ErrorState({ message, onReset }) {
    return (
        <section className="quiz-card">
            <h2>Não foi possível começar a batalha</h2>

            {/* A mensagem vem do App, porque o erro nasce no pedido à API. */}
            <p className="error-text">{message}</p>

            {/*
              O filho não sabe como reiniciar a app.
              Chama o callback recebido do pai.
            */}
            <button
                type="button"
                className="button-primary"
                onClick={onReset}
            >
                Voltar ao início
            </button>
        </section>
    );
}

export default ErrorState;
```

**Checkpoint G**

- Os componentes existem.
- Ainda não precisam de aparecer no ecrã.
- Não há erro de import, se já os importaste.

---

## 18) Fase 13 - Serviço da API

Ideia nova desta fase:

- separar a comunicação com a API da interface.

Vamos usar a **Open Trivia DB**:

```text
https://opentdb.com/api.php?amount=5&type=multiple&difficulty=easy&encode=url3986
```

Porque usamos `encode=url3986`?

- A API pode devolver caracteres especiais codificados.
- Com `encode=url3986`, podemos usar `decodeURIComponent`.
- Isto evita aparecerem textos estranhos no ecrã.

Cria `src/services/triviaApi.js`:

```jsx
const TRIVIA_API_URL = "https://opentdb.com/api.php";

/**
 * Converte texto codificado pela API para texto normal.
 * @param {string} value - Texto codificado.
 * @returns {string} Texto legível.
 */
function decodeApiText(value) {
    // A API devolve texto codificado quando usamos encode=url3986.
    // decodeURIComponent transforma esse texto em algo legível no ecrã.
    return decodeURIComponent(value);
}

/**
 * Normaliza uma pergunta da API para o formato usado pela app.
 * @param {object} apiQuestion - Pergunta original da API.
 * @param {number} index - Posição da pergunta.
 * @returns {object} Pergunta normalizada.
 */
function normalizeQuestion(apiQuestion, index) {
    // Primeiro descodificamos a pergunta para evitar caracteres estranhos.
    const question = decodeApiText(apiQuestion.question);

    // A app não deve depender diretamente do formato da API.
    // Por isso transformamos tudo para o formato interno usado desde as perguntas locais.
    return {
        // ID simples e estável o suficiente para esta ficha.
        id: `api-question-${index}-${question}`,
        question,

        // A API usa snake_case; a app usa camelCase.
        correctAnswer: decodeApiText(apiQuestion.correct_answer),

        // Cada resposta errada também precisa de ser descodificada.
        incorrectAnswers: apiQuestion.incorrect_answers.map(decodeApiText),
    };
}

/**
 * Carrega perguntas da Open Trivia DB.
 * @param {string} difficulty - Dificuldade escolhida.
 * @param {AbortSignal} signal - Sinal para cancelar o pedido.
 * @returns {Promise<object[]>} Perguntas normalizadas.
 */
export async function fetchTriviaQuestions(difficulty, signal) {
    // URLSearchParams constrói a query string de forma segura e legível.
    const params = new URLSearchParams({
        // Mantemos 5 perguntas para a ficha continuar curta.
        amount: "5",

        // type=multiple garante 1 resposta certa + 3 erradas.
        type: "multiple",

        // difficulty vem do state/controlado pelo utilizador.
        difficulty,

        // Facilita a descodificação dos textos.
        encode: "url3986",
    });

    // O signal permite cancelar o pedido se a batalha for reiniciada rapidamente.
    const response = await fetch(`${TRIVIA_API_URL}?${params}`, { signal });

    // response.ok valida erros HTTP, por exemplo 500 ou 404.
    if (!response.ok) {
        throw new Error("Não foi possível contactar a API.");
    }

    // Converte o corpo JSON da resposta num objeto JavaScript.
    const data = await response.json();

    // response_code é uma regra específica da Open Trivia DB.
    // 0 significa sucesso.
    if (data.response_code !== 0) {
        throw new Error("A API não devolveu perguntas para esta configuração.");
    }

    // A UI recebe sempre perguntas no nosso formato interno.
    return data.results.map(normalizeQuestion);
}
```

**Leitura guiada**

1. `fetchTriviaQuestions` faz o pedido.
2. `response.ok` valida se o pedido HTTP correu bem.
3. `response_code` valida a resposta específica da Open Trivia DB.
4. `normalizeQuestion` adapta os dados ao formato que a app já usava.
5. `AbortSignal` permite cancelar o pedido se ele deixar de ser necessário.

---

## 19) Fase 14 - `useEffect` via API (Paragem H)

Ideia nova desta fase:

- carregar perguntas externas quando começa uma batalha.

Agora a versão local já está estável. Vamos substituir o fluxo principal por API.

Atualiza os imports do `App.jsx`:

```jsx
import ErrorState from "./components/ErrorState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import { fetchTriviaQuestions } from "./services/triviaApi";
```

Estes imports são incrementais: junta-os aos imports que já existem no topo do `App.jsx`.

Adiciona estados:

```jsx
const [questions, setQuestions] = useState(localQuestions);
const [errorMessage, setErrorMessage] = useState("");
const [battleId, setBattleId] = useState(0);
```

Substitui estas linhas:

```jsx
const questions = localQuestions;
const currentQuestion = questions[currentQuestionIndex];
const totalQuestions = questions.length;
```

por:

```jsx
const currentQuestion = questions[currentQuestionIndex];
const totalQuestions = questions.length;
```

Atualiza `startBattle`:

```jsx
const startBattle = () => {
    if (!canStartBattle) return;
    setBattleId((previousId) => previousId + 1);
};
```

Adiciona o efeito da API:

```jsx
useEffect(() => {
    // battleId começa em 0. Enquanto for 0, nenhuma batalha foi pedida.
    if (battleId === 0) return;

    // AbortController permite cancelar este fetch no cleanup.
    const controller = new AbortController();

    async function loadQuestions() {
        try {
            // Antes do pedido, mostramos o ecrã de loading.
            setGameStatus("loading");

            // Limpamos erros antigos para não mostrar mensagens desatualizadas.
            setErrorMessage("");

            // Uma nova batalha recomeça sempre do início.
            setCurrentQuestionIndex(0);
            setAnswerResults([]);
            setTimeLeft(QUESTION_TIME_LIMIT);

            // Pedido real à API. A dificuldade vem do state/context.
            const apiQuestions = await fetchTriviaQuestions(
                difficulty,
                controller.signal
            );

            // Guardamos as perguntas recebidas no state.
            setQuestions(apiQuestions);

            // Só depois de ter perguntas é que entramos no modo playing.
            setGameStatus("playing");
        } catch (error) {
            // Se o erro foi causado por cancelamento, não mostramos erro ao utilizador.
            if (error.name === "AbortError") return;

            // Guardamos mensagem para o ErrorState.
            setErrorMessage(error.message);

            // Mantemos perguntas locais como fallback interno para a app continuar consistente.
            setQuestions(localQuestions);

            // Estado próprio de erro para renderização condicional.
            setGameStatus("error");
        }
    }

    loadQuestions();

    // Cleanup: cancela o pedido se este efeito for substituído ou desmontado.
    return () => {
        controller.abort();
    };
// O pedido deve correr quando começa uma nova batalha ou muda a dificuldade.
}, [battleId, difficulty]);
```

Adiciona renderização para `loading` e `error`:

```jsx
{gameStatus === "loading" && <LoadingState />}

{gameStatus === "error" && (
    <ErrorState message={errorMessage} onReset={resetBattle} />
)}
```

Atualiza `resetBattle`:

```jsx
const resetBattle = () => {
    // Volta ao ecrã inicial.
    setGameStatus("idle");

    // Limpa erro antigo para a próxima tentativa começar limpa.
    setErrorMessage("");
};
```

**Checkpoint H**

- Ao começar, aparece loading.
- Depois aparecem perguntas vindas da API.
- Se a API falhar, aparece o ecrã de erro.
- O fluxo final usa `questions.length`, ou seja, o tamanho da lista atualmente em jogo.
- As perguntas locais continuam disponíveis como base didática/fallback interno.

---

## 20) Fase 15 - Quando as props são boas

Antes de avançar para Context, fixa esta regra:

Props são boas quando existe uma relação clara entre pai e filho.

Exemplos corretos nesta app:

```jsx
<QuestionCard
    question={currentQuestion}
    answers={currentAnswers}
    onAnswer={handleAnswer}
/>
```

Aqui faz sentido usar props:

- `QuestionCard` precisa da pergunta;
- `QuestionCard` precisa das respostas;
- `QuestionCard` precisa avisar o pai quando o jogador responde.

Não uses Context só para evitar escrever props. Usa Context quando o dado é realmente global ou transversal.

---

## 21) Fase 16 - Prop drilling (Paragem I)

Ideia nova desta fase:

- identificar um caso em que as props começam a ser transportadas por componentes que não precisam delas diretamente.

Imagina que queres usar estes dados em vários sítios:

- `playerName`;
- `difficulty`;
- `theme`;
- `toggleTheme`.

Sem Context, poderias começar a fazer isto:

```jsx
<StartScreen
    playerName={playerName}
    difficulty={difficulty}
    theme={theme}
    toggleTheme={toggleTheme}
/>

<QuestionCard
    question={currentQuestion}
    theme={theme}
/>

<ResultScreen
    playerName={playerName}
    difficulty={difficulty}
    theme={theme}
/>
```

Pior: `QuestionCard` podia receber `theme` só para o passar para `TimerBar`:

```jsx
<TimerBar timeLeft={timeLeft} theme={theme} />
```

Aqui, `QuestionCard` torna-se apenas um “transportador” de props. Isto é **prop drilling**.

**Checkpoint I**

Consegues explicar:

- porque props continuam corretas para `onAnswer`;
- porque `theme` é um melhor candidato a Context;
- porque Context não deve guardar tudo.

---

## 22) Fase 17 - `useContext` para preferências globais (Paragem J)

Ideia nova desta fase:

- criar um contexto para dados globais simples.

Vamos colocar em Context:

- `playerName`;
- `difficulty`;
- `theme`;
- funções para alterar estes valores.

Cria `src/context/GameSettingsContext.jsx`:

```jsx
import { createContext, useContext, useMemo, useState } from "react";

const GameSettingsContext = createContext(null);

/**
 * Provider com preferências globais do jogo.
 * @param {object} props - Props do componente.
 * @param {React.ReactNode} props.children - Componentes filhos.
 * @returns {JSX.Element}
 */
export function GameSettingsProvider({ children }) {
    // Estes estados deixam de viver no App porque são preferências globais.
    // Vários componentes podem precisar deles.
    const [playerName, setPlayerName] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        // Atualização funcional para depender sempre do tema atual mais recente.
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    };

    const value = useMemo(() => {
        // Este objeto é o que todos os consumidores do contexto vão receber.
        return {
            playerName,
            setPlayerName,
            difficulty,
            setDifficulty,
            theme,
            toggleTheme,
        };
    // O objeto só é recriado quando alguma preferência muda.
    // Isto evita criar uma referência nova em todos os renders.
    }, [playerName, difficulty, theme]);

    return (
        <GameSettingsContext.Provider value={value}>
            {children}
        </GameSettingsContext.Provider>
    );
}

/**
 * Hook próprio para consumir as preferências do jogo.
 * @returns {object} Preferências globais do jogo.
 */
export function useGameSettings() {
    // useContext lê o valor mais próximo fornecido pelo Provider.
    const context = useContext(GameSettingsContext);

    if (!context) {
        // Erro intencional: ajuda a detetar uso do hook fora do Provider.
        throw new Error(
            "useGameSettings deve ser usado dentro de GameSettingsProvider."
        );
    }

    return context;
}
```

Atualiza `src/main.jsx`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GameSettingsProvider } from "./context/GameSettingsContext.jsx";
import "./styles/index.css";
import "./styles/quiz.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <GameSettingsProvider>
            <App />
        </GameSettingsProvider>
    </React.StrictMode>
);
```

No `App.jsx`, remove os estados:

```jsx
const [playerName, setPlayerName] = useState("");
const [difficulty, setDifficulty] = useState("easy");
```

E usa:

```jsx
const {
    playerName,
    setPlayerName,
    difficulty,
    setDifficulty,
    theme,
    toggleTheme,
} = useGameSettings();
```

Importa o hook:

```jsx
import { useGameSettings } from "./context/GameSettingsContext.jsx";
```

Atualiza o `main`:

```jsx
<main className={`app ${theme === "dark" ? "app--dark" : ""}`}>
```

Adiciona botão de tema no topo:

```jsx
<button
    type="button"
    className="button-secondary"
    onClick={toggleTheme}
>
    Alternar tema
</button>
```

**Checkpoint J**

- O tema alterna.
- O nome continua controlado.
- A dificuldade continua a afetar o pedido à API.
- `playerName`, `difficulty` e `theme` já vivem no Context.
- `onAnswer` continua a ser prop, porque é uma ação específica do jogo.

---

## 23) Versão final sugerida - `App.jsx`

Esta versão junta as fases principais depois da componentização e do Context.

```jsx
import { useEffect, useMemo, useState } from "react";
import ErrorState from "./components/ErrorState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import StartScreen from "./components/StartScreen.jsx";
import { useGameSettings } from "./context/GameSettingsContext.jsx";
import { localQuestions } from "./data/localQuestions";
import { fetchTriviaQuestions } from "./services/triviaApi";

const QUESTION_TIME_LIMIT = 15;

/**
 * Baralha uma lista sem alterar o array original.
 * @param {string[]} items - Lista original.
 * @returns {string[]} Nova lista baralhada.
 */
function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

/**
 * Componente principal da app Quiz Battle.
 * @returns {JSX.Element}
 */
function App() {
    // Preferências globais vêm do Context.
    // Assim, deixam de ter de ser passadas manualmente por vários níveis.
    const {
        playerName,
        setPlayerName,
        difficulty,
        setDifficulty,
        theme,
        toggleTheme,
    } = useGameSettings();

    // Estado do fluxo principal da app.
    // Decide que ecrã é renderizado: idle, loading, error, playing ou finished.
    const [gameStatus, setGameStatus] = useState("idle");

    // Lista de perguntas atualmente usada pela batalha.
    // Começa com perguntas locais para a app ter uma base segura.
    const [questions, setQuestions] = useState(localQuestions);

    // Índice da pergunta atual dentro de questions.
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Histórico de resultados: true para certa, false para errada.
    const [answerResults, setAnswerResults] = useState([]);

    // Tempo restante da pergunta atual.
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);

    // Mensagem mostrada quando o pedido à API falha.
    const [errorMessage, setErrorMessage] = useState("");

    // Identificador incremental para disparar uma nova batalha via useEffect.
    // Isto evita fazer fetch diretamente dentro do handler do botão.
    const [battleId, setBattleId] = useState(0);

    // Valor limpo usado na validação e no ecrã final.
    const cleanPlayerName = playerName.trim();

    // Regra mínima para poder começar.
    const canStartBattle = cleanPlayerName.length >= 2;

    // Pergunta atual derivada do array e do índice.
    const currentQuestion = questions[currentQuestionIndex];

    // Total atual. Depois da API, pode ser diferente das perguntas locais.
    const totalQuestions = questions.length;

    const currentAnswers = useMemo(() => {
        if (!currentQuestion) return [];

        return shuffleItems([
            currentQuestion.correctAnswer,
            ...currentQuestion.incorrectAnswers,
        ]);
    }, [currentQuestion]);

    const battleStats = useMemo(() => {
        const correctAnswers = answerResults.filter(Boolean).length;
        const score = correctAnswers * 100;
        const percentage =
            totalQuestions > 0
                ? Math.round((correctAnswers / totalQuestions) * 100)
                : 0;
        const victory = percentage >= 60;

        return {
            correctAnswers,
            totalQuestions,
            score,
            percentage,
            victory,
        };
    }, [answerResults, totalQuestions]);

    useEffect(() => {
        // Este efeito é exclusivamente local: controla o relógio.
        if (gameStatus !== "playing") return;
        if (timeLeft === 0) return;

        const timeoutId = setTimeout(() => {
            setTimeLeft((currentTime) => currentTime - 1);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [gameStatus, timeLeft]);

    useEffect(() => {
        // Este efeito é externo: comunica com a API.
        if (battleId === 0) return;

        const controller = new AbortController();

        async function loadQuestions() {
            try {
                setGameStatus("loading");
                setErrorMessage("");
                setCurrentQuestionIndex(0);
                setAnswerResults([]);
                setTimeLeft(QUESTION_TIME_LIMIT);

                const apiQuestions = await fetchTriviaQuestions(
                    difficulty,
                    controller.signal
                );

                setQuestions(apiQuestions);
                setGameStatus("playing");
            } catch (error) {
                if (error.name === "AbortError") return;

                setErrorMessage(error.message);
                setQuestions(localQuestions);
                setGameStatus("error");
            }
        }

        loadQuestions();

        return () => {
            controller.abort();
        };
    }, [battleId, difficulty]);

    const startBattle = () => {
        // Mantém a validação no handler para proteger a lógica,
        // mesmo que o botão já esteja disabled.
        if (!canStartBattle) return;

        // Incrementar battleId é o "sinal" para o useEffect carregar perguntas.
        setBattleId((previousId) => previousId + 1);
    };

    const resetBattle = () => {
        // Volta ao ecrã inicial sem apagar nome/dificuldade.
        setGameStatus("idle");
        setErrorMessage("");
    };

    const handleAnswer = (selectedAnswer) => {
        // Compara com a resposta certa da pergunta atual.
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        // Atualização imutável do histórico.
        const updatedResults = [...answerResults, isCorrect];

        setAnswerResults(updatedResults);

        // Se esta era a última pergunta, termina a batalha.
        const isLastQuestion = currentQuestionIndex === questions.length - 1;

        if (isLastQuestion) {
            setGameStatus("finished");
            return;
        }

        // Caso contrário, avança e reinicia o temporizador.
        setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
        setTimeLeft(QUESTION_TIME_LIMIT);
    };

    const handleTimeout = () => {
        // Resposta vazia conta sempre como errada.
        handleAnswer("");
    };

    return (
        <main className={`app ${theme === "dark" ? "app--dark" : ""}`}>
            <div className="quiz-shell">
                <h1>Quiz Battle</h1>
                <p>Responde a perguntas para derrotar o boss.</p>

                {/* toggleTheme vem do Context. */}
                <button
                    type="button"
                    className="button-secondary"
                    onClick={toggleTheme}
                >
                    Alternar tema
                </button>

                {gameStatus === "idle" && (
                    // Props específicas continuam a ser boas aqui:
                    // StartScreen precisa destes valores e callbacks diretamente.
                    <StartScreen
                        playerName={playerName}
                        onPlayerNameChange={setPlayerName}
                        difficulty={difficulty}
                        onDifficultyChange={setDifficulty}
                        canStartBattle={canStartBattle}
                        onStartBattle={startBattle}
                    />
                )}

                {gameStatus === "loading" && <LoadingState />}

                {gameStatus === "error" && (
                    // O ecrã de erro recebe só a mensagem e a ação de voltar.
                    <ErrorState message={errorMessage} onReset={resetBattle} />
                )}

                {gameStatus === "playing" && currentQuestion && (
                    // A pergunta recebe dados e callbacks específicos da batalha.
                    // Isto continua a ser props, não Context.
                    <QuestionCard
                        question={currentQuestion}
                        answers={currentAnswers}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={totalQuestions}
                        timeLeft={timeLeft}
                        onAnswer={handleAnswer}
                        onTimeout={handleTimeout}
                    />
                )}

                {gameStatus === "finished" && (
                    // O ecrã final recebe estatísticas já calculadas.
                    <ResultScreen
                        playerName={cleanPlayerName}
                        stats={battleStats}
                        onReset={resetBattle}
                    />
                )}
            </div>
        </main>
    );
}

export default App;
```

---

## 24) Critérios de aceitação obrigatórios

No fim da ficha, a app deve cumprir:

- O projeto arranca com `npm run dev`.
- O nome do jogador é obrigatório e tem validação mínima.
- A dificuldade é controlada por React.
- A batalha começa com loading.
- As perguntas vêm da Open Trivia DB.
- Se a API falhar, aparece ecrã de erro.
- O temporizador desce de segundo em segundo.
- Quando o tempo chega a 0, as respostas ficam bloqueadas.
- O botão “Avançar” conta como resposta errada.
- A pontuação final é calculada com `useMemo`.
- O tema claro/escuro funciona com Context.
- A consola do browser não tem erros.

---

## 25) Erros comuns e correções

### O projeto não encontra os ficheiros CSS

Confirma os imports no `main.jsx`:

```jsx
import "./styles/index.css";
import "./styles/quiz.css";
```

E confirma se a pasta se chama mesmo `styles`.

### O temporizador está demasiado rápido

Confirma se usaste `1000` no `setTimeout`, não `100`.

### O temporizador continua após terminar a batalha

Confirma se o `useEffect` tem esta guarda:

```jsx
if (gameStatus !== "playing") return;
```

### O temporizador cria comportamentos estranhos

Confirma se existe cleanup:

```jsx
return () => {
    clearTimeout(timeoutId);
};
```

### As respostas mudam de ordem quando o tempo desce

Provavelmente estás a baralhar diretamente no JSX.

Usa `useMemo` com dependência em `currentQuestion`.

### A API devolve textos estranhos

Confirma se o pedido inclui:

```text
encode=url3986
```

E se estás a usar `decodeURIComponent`.

### A API falha

Verifica:

1. Tens internet?
2. O endpoint está correto?
3. A consola mostra erro de CORS ou rede?
4. Estás a verificar `response.ok`?
5. Estás a tratar `data.response_code`?

### A app mostra resultado com 0 perguntas

Confirma se `totalQuestions` vem de `questions.length` e se a API carregou dados antes de entrar em `playing`.

### `useGameSettings` dá erro

Confirma se `App` está dentro do Provider:

```jsx
<GameSettingsProvider>
    <App />
</GameSettingsProvider>
```

### Context está a substituir props demais

Se o dado é específico de um componente filho, usa props.

Exemplo: `onAnswer` deve continuar a ser prop, porque é uma ação específica de `QuestionCard`.

---

## 26) Desafios finais

Escolhe 2 ou 3:

1. Adicionar botão “Jogar outra vez” no ecrã final.
2. Permitir escolher 5 ou 10 perguntas.
3. Guardar melhor pontuação no `localStorage`.
4. Mostrar uma barra de vida do boss.
5. Mostrar feedback diferente para vitória e derrota.
6. Impedir duplo clique numa resposta.
7. Criar componente `BossHealthBar`.
8. Mostrar a dificuldade no ecrã final.
9. Criar um botão “Usar perguntas locais” se a API falhar.

---

## 27) Checklist de validação

Antes de entregar, confirma:

- [ ] A app arranca com `npm run dev`.
- [ ] O layout usa `index.css` e `quiz.css`.
- [ ] O nome do jogador é controlado por React.
- [ ] O botão de começar fica bloqueado sem nome válido.
- [ ] A dificuldade altera o pedido à API.
- [ ] A batalha mostra loading.
- [ ] As perguntas externas aparecem.
- [ ] Existe ecrã de erro se a API falhar.
- [ ] O temporizador funciona.
- [ ] O temporizador bloqueia respostas aos 0 segundos.
- [ ] As respostas não mudam de ordem a cada segundo.
- [ ] A pontuação final está correta.
- [ ] `useMemo` é usado para estatísticas.
- [ ] `useMemo` é usado para respostas baralhadas.
- [ ] Os componentes recebem props adequadas.
- [ ] O prop drilling é explicado.
- [ ] `useContext` é usado para preferências globais.
- [ ] A consola do browser não tem erros.

---

## 28) Perguntas de revisão

1. Porque começámos com perguntas locais antes da API?
2. Qual é a diferença entre estado e estado derivado?
3. Porque não guardamos `score` diretamente em `useState`?
4. Porque as respostas devem ser baralhadas com `useMemo`?
5. Porque o temporizador precisa de cleanup?
6. O que aconteceria se fizesses `fetch` diretamente no corpo do componente?
7. Porque precisamos de estados `loading` e `error`?
8. O que é prop drilling?
9. Quando é melhor usar props em vez de Context?
10. Porque o `value` do Context foi criado com `useMemo`?

---

## 29) Resumo final

Nesta ficha construíste uma app React pequena, mas completa:

- começaste com layout estático;
- criaste inputs controlados;
- geriste estados de jogo;
- usaste perguntas locais para aprender a mecânica;
- calculaste estatísticas com `useMemo`;
- criaste um temporizador com `useEffect`;
- separaste a app em componentes;
- carregaste perguntas de uma API com outro `useEffect`;
- trataste loading e erro;
- identificaste prop drilling;
- usaste `useContext` para preferências globais.

O objetivo não é decorar hooks. O objetivo é perceber quando cada ferramenta faz sentido.
