# Tutorial passo a passo - Quiz Game: Jogo de Perguntas (Ficha React 12.º ano)

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

Uma app chamada **Quiz Game** onde o jogador responde a perguntas para testar conhecimentos.

A app permite:

- escrever o nome do jogador;
- escolher dificuldade;
- começar um jogo;
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
2. **Adiciona / atualiza / substitui um bloco**: quando o enunciado disser “Adiciona estado”, “Atualiza `startGame`” ou “Substitui o bloco `playing`”, deves manter o resto do ficheiro igual e alterar apenas a parte indicada.

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
- **Paragem K**: perguntas traduzidas para português com fallback.

### Mapa mental da app

- **Dados locais**: `localQuestions.js`, usados para aprender a mecânica do jogo.
- **Dados externos**: perguntas carregadas da Open Trivia DB.
- **Tradução externa**: textos traduzidos pela MyMemory, quando possível.
- **Estado principal**: vive no `App.jsx`.
- **Componentes**: mostram partes da interface e recebem props.
- **Serviço da API**: vive em `services/triviaApi.js`.
- **Context**: guarda preferências globais simples, como jogador, dificuldade e tema.

### Ligações diretas aos temas

1. **`useState`** - nome, dificuldade, estado do jogo, pergunta atual, respostas, tempo, loading e erro.
2. **`useEffect` local** - temporizador que diminui de segundo em segundo.
3. **`useEffect` externo** - pedido à API quando começa um jogo.
4. **`useMemo`** - estatísticas finais e respostas baralhadas.
5. **Props** - componentes recebem dados e callbacks.
6. **Prop drilling** - exemplo com `theme`, `playerName` e `difficulty`.
7. **`useContext`** - preferências globais sem passar props por todos os níveis.
8. **Camada de tradução** - segunda API com fallback para manter a app funcional.

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
npm create vite@latest ficha04-quiz-game -- --template react
cd ficha04-quiz-game
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
ficha04-quiz-game/
├─ index.html
├─ package.json
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ data/
   │  └─ localQuestions.js
   ├─ services/
   │  ├─ triviaApi.js
   │  └─ translationApi.js
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

Ficheiros a criar/editar nesta fase:

- criar `src/styles/index.css`;
- criar `src/styles/quiz.css`;
- editar `src/main.jsx`.

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
    background:
        radial-gradient(circle at top left, #dbeafe 0, transparent 30%),
        radial-gradient(circle at bottom right, #dcfce7 0, transparent 28%),
        #f8fafc;
    color: #111827;
}

/* Classe alternativa aplicada quando o tema escuro estiver ativo. */
.app--dark {
    background:
        radial-gradient(circle at top left, #1d4ed8 0, transparent 28%),
        radial-gradient(circle at bottom right, #047857 0, transparent 24%),
        #0f172a;
    color: #f9fafb;
}

/* Limita a largura da app para o conteúdo não ficar demasiado espalhado. */
.quiz-shell {
    max-width: 820px;
    margin: 0 auto;
}

/* Título principal da app. */
.quiz-shell h1 {
    margin: 0;
    font-size: 2.4rem;
}

/* Texto introdutório logo abaixo do título. */
.quiz-shell > p {
    margin: 8px 0 0;
    color: #475569;
}

.app--dark .quiz-shell > p {
    color: #cbd5e1;
}

/* Cartão base usado para cada ecrã principal da ficha. */
.quiz-card {
    margin-top: 24px;
    padding: 24px;
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.92);
    color: #111827;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
    backdrop-filter: blur(10px);
}

/* Remove a margem superior do primeiro título dentro de um cartão. */
.quiz-card h2 {
    margin-top: 0;
}

/* Ajusta o cartão quando o tema escuro está ativo. */
.app--dark .quiz-card {
    border-color: rgba(148, 163, 184, 0.24);
    background: rgba(15, 23, 42, 0.9);
    color: #f9fafb;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
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
    padding: 11px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #ffffff;
    color: #111827;
}

.form-row input:focus,
.form-row select:focus {
    outline: 3px solid rgba(37, 99, 235, 0.18);
    border-color: #2563eb;
}

.app--dark .form-row input,
.app--dark .form-row select {
    border-color: #475569;
    background: #020617;
    color: #f8fafc;
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
    padding: 11px 14px;
    border: 1px solid #2563eb;
    border-radius: 6px;
    background: #2563eb;
    color: white;
    transition:
        transform 0.15s ease,
        border-color 0.15s ease,
        background-color 0.15s ease,
        box-shadow 0.15s ease;
}

.button-primary:hover:not(:disabled),
.button-secondary:hover:not(:disabled),
.answer-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);
}

/* Botão secundário: usado para ações menos principais. */
.button-secondary {
    border-color: #6b7280;
    background: #6b7280;
}

/* Respostas parecem botões, mas com aspeto mais neutro. */
.answer-button {
    border-color: #cbd5e1;
    background: #f8fafc;
    color: #0f172a;
    text-align: left;
}

/* Pequeno feedback ao passar o rato por uma resposta ativa. */
.answer-button:hover:not(:disabled) {
    border-color: #2563eb;
    background: #eff6ff;
}

.app--dark .answer-button {
    border-color: #475569;
    background: #111827;
    color: #f8fafc;
}

.app--dark .answer-button:hover:not(:disabled) {
    border-color: #60a5fa;
    background: #1e293b;
}

/* Espaçamento do bloco do temporizador. */
.timer {
    margin: 12px 0;
}

/* Fundo da barra do temporizador. */
.timer-bar {
    height: 12px;
    overflow: hidden;
    border-radius: 999px;
    background: #e2e8f0;
}

/* Parte preenchida da barra. A largura será controlada por React. */
.timer-bar__fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #eab308, #ef4444);
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

.app--dark .muted {
    color: #cbd5e1;
}

@media (min-width: 700px) {
    .answer-grid {
        grid-template-columns: 1fr 1fr;
    }
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
    </React.StrictMode>,
);
```

**Checkpoint**

- O projeto continua a arrancar.
- Não há erro de import dos ficheiros CSS.

---

## 6) Fase 1 - Layout base (Paragem A)

Ideia nova desta fase:

- apenas renderização estática.

Ficheiro a editar nesta fase: `src/App.jsx`.

Substitui `src/App.jsx` por:

```jsx
/**
 * Componente principal da app Quiz Game.
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
                <h1>Quiz Game</h1>
                <p>Responde a perguntas para testar conhecimentos.</p>

                {/* Nesta fase, o cartão é apenas estático. */}
                <section className="quiz-card">
                    <h2>Preparar jogo</h2>
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

- Vês o título `Quiz Game`.
- Vês o cartão “Preparar jogo”.
- Não há erros na consola.

---

## 7) Fase 2 - Nome e dificuldade (Paragem B1)

Ideia nova desta fase:

- criar inputs controlados com `useState`.

Ficheiro a editar nesta fase: `src/App.jsx`.

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
                <h1>Quiz Game</h1>
                <p>Responde a perguntas para testar conhecimentos.</p>

                <section className="quiz-card">
                    <h2>Preparar jogo</h2>

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

Ficheiro a editar nesta fase: `src/App.jsx`.

Estados do jogo:

- `idle`: ecrã inicial;
- `playing`: jogo em curso;
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
    const canStartGame = cleanPlayerName.length >= 2;

    const startGame = () => {
        // Se o nome ainda não for válido, a função termina imediatamente.
        if (!canStartGame) return;

        // Mudar o estado do jogo faz a UI trocar do ecrã inicial para o jogo.
        setGameStatus("playing");
    };

    const resetGame = () => {
        // Volta ao ecrã inicial.
        setGameStatus("idle");
    };

    return (
        <main className="app">
            <div className="quiz-shell">
                <h1>Quiz Game</h1>

                {gameStatus === "idle" && (
                    // Renderização condicional: este bloco só aparece no estado "idle".
                    <section className="quiz-card">
                        <h2>Preparar jogo</h2>

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

                        {!canStartGame && (
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
                                onClick={startGame}
                                disabled={!canStartGame}
                            >
                                Começar jogo
                            </button>
                        </div>
                    </section>
                )}

                {gameStatus === "playing" && (
                    // Bloco temporário para confirmar a transição de estado.
                    <section className="quiz-card">
                        <h2>Jogo em curso</h2>
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
                        <h2>Fim do jogo</h2>
                        <button
                            type="button"
                            className="button-primary"
                            onClick={resetGame}
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
- O botão começa o jogo.
- O botão de teste termina o jogo.
- O botão final volta ao início.

---

## 9) Fase 4 - Perguntas locais (Paragem C1)

Ideia nova desta fase:

- começar com dados locais antes da API.

Isto evita misturar duas dificuldades ao mesmo tempo: primeiro aprendemos a mecânica do jogo, depois carregamos dados externos.

Ficheiros a criar/editar nesta fase:

- criar `src/data/localQuestions.js`;
- editar `src/App.jsx`.

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

Ficheiro a editar nesta fase: `src/App.jsx`.

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
        // Se era a última pergunta, o jogo termina.
        setGameStatus("finished");
        return;
    }

    // Caso contrário, avança uma posição no array.
    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
};
```

Atualiza `startGame` para reiniciar progresso:

```jsx
const startGame = () => {
    // Mantemos a validação da fase anterior.
    if (!canStartGame) return;

    // Cada novo jogo deve começar na primeira pergunta.
    setCurrentQuestionIndex(0);

    // Cada novo jogo deve limpar respostas antigas.
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

Ficheiro a editar nesta fase: `src/App.jsx`.

Substitui o bloco `finished`:

```jsx
{gameStatus === "finished" && (
    <section className="quiz-card">
        <h2>Fim do jogo</h2>
        <p>Jogador: {cleanPlayerName}</p>
        <p>
            Respostas certas: {answerResults.filter(Boolean).length} de{" "}
            {totalQuestions}
        </p>

        <button
            type="button"
            className="button-primary"
            onClick={resetGame}
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

Ficheiro a editar nesta fase: `src/App.jsx`.

Atualiza o import:

```jsx
import { useMemo, useState } from "react";
```

Este snippet substitui apenas a linha de import do React. O resto do ficheiro mantém-se.

Adiciona antes do `return`:

```jsx
const gameStats = useMemo(() => {
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
        <h2>
            {gameStats.victory ? "Objetivo atingido!" : "Tenta novamente!"}
        </h2>
        <p>Jogador: {cleanPlayerName}</p>
        <p>Pontuação: {gameStats.score}</p>
        <p>
            Certas: {gameStats.correctAnswers} de{" "}
            {gameStats.totalQuestions}
        </p>
        <p>Percentagem: {gameStats.percentage}%</p>

        <button
            type="button"
            className="button-primary"
            onClick={resetGame}
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

Ficheiro a editar nesta fase: `src/App.jsx`.

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

Ficheiro a editar nesta fase: `src/App.jsx`.

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

Atualiza `startGame`:

```jsx
const startGame = () => {
    if (!canStartGame) return;

    setCurrentQuestionIndex(0);
    setAnswerResults([]);

    // Cada jogo começa com o tempo completo.
    setTimeLeft(QUESTION_TIME_LIMIT);
    setGameStatus("playing");
};
```

Adiciona o efeito:

```jsx
useEffect(() => {
    // O temporizador só deve correr durante o jogo.
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

Ficheiro a editar nesta fase: `src/App.jsx`.

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
{
    currentAnswers.map((answer) => (
        <button
            key={answer}
            type="button"
            className="answer-button"
            onClick={() => handleAnswer(answer)}
            disabled={timeLeft === 0}
        >
            {answer}
        </button>
    ));
}
```

Depois da grelha de respostas, adiciona:

```jsx
{
    timeLeft === 0 && (
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
    );
}
```

**Checkpoint E2**

- Quando o tempo chega a 0, os botões ficam bloqueados.
- O botão “Avançar” conta a pergunta como errada.
- O jogo continua normalmente.

---

## 16) Fase 11 - Componentes e props (Paragem F)

Ideia nova desta fase:

- separar responsabilidades;
- passar dados e callbacks por props.

Ficheiros a criar/editar nesta fase:

- criar a pasta `src/components/`;
- criar `src/components/StartScreen.jsx`;
- criar `src/components/TimerBar.jsx`;
- criar `src/components/QuestionCard.jsx`;
- criar `src/components/ResultScreen.jsx`;
- editar `src/App.jsx`.

Cria a pasta `src/components/`.

### 16.1) `StartScreen.jsx`

Cria o ficheiro `src/components/StartScreen.jsx`:

```jsx
/**
 * Ecrã inicial da app.
 * @param {object} props - Props do componente.
 * @param {string} props.playerName - Nome atual do jogador.
 * @param {(name: string) => void} props.onPlayerNameChange - Atualiza o nome.
 * @param {string} props.difficulty - Dificuldade atual.
 * @param {(difficulty: string) => void} props.onDifficultyChange - Atualiza a dificuldade.
 * @param {boolean} props.canStartGame - Indica se o nome é válido.
 * @param {() => void} props.onStartGame - Começa o jogo.
 * @returns {JSX.Element}
 */
function StartScreen({
    // Valores controlados pelo componente pai.
    playerName,
    onPlayerNameChange,
    difficulty,
    onDifficultyChange,

    // Validação também vem do pai, porque depende da regra da app.
    canStartGame,

    // Callback chamado quando o jogador tenta começar.
    onStartGame,
}) {
    return (
        <section className="quiz-card">
            <h2>Preparar jogo</h2>

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
                    onChange={(event) => onDifficultyChange(event.target.value)}
                >
                    <option value="easy">Fácil</option>
                    <option value="medium">Média</option>
                    <option value="hard">Difícil</option>
                </select>
            </label>

            {!canStartGame && (
                // A mensagem usa a validação calculada no pai.
                <p className="error-text">
                    Escreve pelo menos 2 caracteres no nome.
                </p>
            )}

            <div className="button-row">
                {/*
                  O clique sobe para o pai. O componente filho não decide
                  sozinho quando o jogo começa.
                */}
                <button
                    type="button"
                    className="button-primary"
                    onClick={onStartGame}
                    disabled={!canStartGame}
                >
                    Começar jogo
                </button>
            </div>
        </section>
    );
}

export default StartScreen;
```

### 16.2) `TimerBar.jsx`

Cria o ficheiro `src/components/TimerBar.jsx`:

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

Cria o ficheiro `src/components/QuestionCard.jsx`:

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

Cria o ficheiro `src/components/ResultScreen.jsx`:

```jsx
/**
 * Ecrã final do jogo.
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
            <h2>{stats.victory ? "Objetivo atingido!" : "Tenta novamente!"}</h2>
            <p>Jogador: {playerName}</p>
            <p>Pontuação: {stats.score}</p>
            <p>
                Certas: {stats.correctAnswers} de {stats.totalQuestions}
            </p>
            <p>Percentagem: {stats.percentage}%</p>

            <button type="button" className="button-primary" onClick={onReset}>
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
        canStartGame={canStartGame}
        onStartGame={startGame}
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
        stats={gameStats}
        onReset={resetGame}
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

Ficheiros a criar nesta fase:

- criar `src/components/LoadingState.jsx`;
- criar `src/components/ErrorState.jsx`.

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
            <p className="muted">O jogo vai começar dentro de instantes.</p>
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
            <h2>Não foi possível começar o jogo</h2>

            {/* A mensagem vem do App, porque o erro nasce no pedido à API. */}
            <p className="error-text">{message}</p>

            {/*
              O filho não sabe como reiniciar a app.
              Chama o callback recebido do pai.
            */}
            <button type="button" className="button-primary" onClick={onReset}>
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

Ficheiro a criar nesta fase: `src/services/triviaApi.js`.

Vamos usar a **Open Trivia DB**:

```text
https://opentdb.com/api.php?amount=5&type=multiple&difficulty=easy&encode=url3986
```

### 18.1) O que é a Open Trivia DB?

A **Open Trivia DB** é uma API pública de perguntas de trivia. Em vez de escrevermos todas as perguntas manualmente, podemos pedir perguntas a este serviço e receber uma resposta em JSON.

Documentação: `https://opentdb.com/api_config.php`

Nesta ficha, ela serve para praticar:

- pedidos HTTP com `fetch`;
- leitura de JSON;
- estados de `loading` e `error`;
- transformação de dados externos para o formato interno da app;
- cuidados com APIs públicas.

Segundo a documentação da Open Trivia DB:

- não é necessária API key para usar o endpoint principal;
- o endpoint devolve um objeto com `response_code` e `results`;
- `response_code` indica se a resposta foi bem-sucedida;
- cada pergunta pode vir com caracteres especiais codificados;
- o parâmetro `encode` controla o formato dessa codificação;
- existe limite de pedidos, por isso não devemos chamar a API sem necessidade.

### 18.2) Que parâmetros vamos usar?

O nosso pedido usa estes parâmetros:

| Parâmetro | Valor | Significado |
|---|---|---|
| `amount` | `5` | Queremos 5 perguntas. |
| `type` | `multiple` | Queremos perguntas de escolha múltipla. |
| `difficulty` | `easy`, `medium` ou `hard` | Vem do estado escolhido pelo jogador. |
| `encode` | `url3986` | Faz a API devolver texto em URL encoding RFC 3986. |

Exemplo:

```text
https://opentdb.com/api.php?amount=5&type=multiple&difficulty=easy&encode=url3986
```

### 18.3) Como é a resposta da API?

A resposta vem num formato parecido com este:

```json
{
    "response_code": 0,
    "results": [
        {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Science & Nature",
            "question": "What%20is%20H2O%3F",
            "correct_answer": "Water",
            "incorrect_answers": ["Oxygen", "Hydrogen", "Salt"]
        }
    ]
}
```

Repara em dois detalhes importantes:

1. A API usa nomes como `correct_answer` e `incorrect_answers`.
2. A nossa app usa nomes como `correctAnswer` e `incorrectAnswers`.

Por isso vamos criar uma função de normalização. A UI não deve depender diretamente do formato da API.

### 18.4) Porque usamos `encode=url3986`?

Algumas perguntas têm acentos, símbolos ou aspas. A API pode devolver esses caracteres codificados.

Com `encode=url3986`, uma pergunta pode vir assim:

```text
What%20is%20H2O%3F
```

Depois usamos:

```js
decodeURIComponent("What%20is%20H2O%3F");
```

Resultado:

```text
What is H2O?
```

Isto torna o tratamento mais previsível para esta ficha.

### 18.5) Limitação importante

A Open Trivia DB devolve perguntas em inglês. Mais à frente, antes dos desafios finais, vamos adicionar uma camada de tradução com a **MyMemory Translation API**.

Por agora, o objetivo é só carregar perguntas externas corretamente.

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

    // O signal permite cancelar o pedido se o jogo for reiniciado rapidamente.
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

- carregar perguntas externas quando começa um jogo.

Agora a versão local já está estável. Vamos substituir o fluxo principal por API.

Ficheiro a editar nesta fase: `src/App.jsx`.

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
const [gameId, setGameId] = useState(0);
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

Atualiza `startGame`:

```jsx
const startGame = () => {
    if (!canStartGame) return;
    setGameId((previousId) => previousId + 1);
};
```

Adiciona o efeito da API:

```jsx
useEffect(() => {
    // gameId começa em 0. Enquanto for 0, nenhum jogo foi pedido.
    if (gameId === 0) return;

    // AbortController permite cancelar este fetch no cleanup.
    const controller = new AbortController();

    async function loadQuestions() {
        try {
            // Antes do pedido, mostramos o ecrã de loading.
            setGameStatus("loading");

            // Limpamos erros antigos para não mostrar mensagens desatualizadas.
            setErrorMessage("");

            // Um novo jogo recomeça sempre do início.
            setCurrentQuestionIndex(0);
            setAnswerResults([]);
            setTimeLeft(QUESTION_TIME_LIMIT);

            // Pedido real à API. A dificuldade vem do state/context.
            const apiQuestions = await fetchTriviaQuestions(
                difficulty,
                controller.signal,
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
    // O pedido deve correr quando começa um novo jogo ou muda a dificuldade.
}, [gameId, difficulty]);
```

Adiciona renderização para `loading` e `error`:

```jsx
{gameStatus === "loading" && <LoadingState />}

{gameStatus === "error" && (
    <ErrorState message={errorMessage} onReset={resetGame} />
)}
```

Atualiza `resetGame`:

```jsx
const resetGame = () => {
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

Esta fase é conceptual. Não precisas de criar nem editar ficheiros.

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

Esta fase é conceptual. Não precisas de criar nem editar ficheiros.

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

Ficheiros a criar/editar nesta fase:

- criar `src/context/GameSettingsContext.jsx`;
- editar `src/main.jsx`;
- editar `src/App.jsx`.

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
            currentTheme === "light" ? "dark" : "light",
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
            "useGameSettings deve ser usado dentro de GameSettingsProvider.",
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
    </React.StrictMode>,
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
<button type="button" className="button-secondary" onClick={toggleTheme}>
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

## 23) Fase 18 - Tradução automática com MyMemory (Paragem K)

Ideia nova desta fase:

- usar uma segunda API para melhorar a experiência do utilizador;
- traduzir as perguntas da Open Trivia DB de inglês para português;
- manter fallback para inglês se a tradução falhar.

Ficheiros a criar/editar nesta fase:

- criar `src/services/translationApi.js`;
- editar `src/services/triviaApi.js`;
- editar `src/components/LoadingState.jsx`.

Esta fase aparece no fim porque a app principal já está funcional. Assim, se a tradução falhar, a ficha continua válida.

### 23.1) O que é a MyMemory?

A **MyMemory** é uma API de tradução baseada numa grande memória de tradução. Uma memória de tradução é uma coleção de frases já traduzidas. Quando não existe uma tradução humana adequada, o serviço pode recorrer a tradução automática.

Documentação técnica: `https://mymemory.translated.net/doc/spec.php`

Limites de utilização: `https://mymemory.translated.net/doc/usagelimits.php`

Nesta ficha, a MyMemory serve para traduzir:

- o texto da pergunta;
- a resposta certa;
- as respostas erradas.

Vamos usar o endpoint público:

```text
https://api.mymemory.translated.net/get
```

Segundo a documentação da MyMemory:

- o endpoint `get` recebe o texto no parâmetro `q`;
- o parâmetro `langpair` indica o par de línguas, por exemplo `en|pt-PT`;
- sem API key, é possível consultar memórias públicas;
- existe limite de utilização para pedidos gratuitos/anónimos;
- cada segmento em `q` deve ser curto;
- a resposta inclui normalmente `responseData.translatedText`.
- em projetos reais ou uso mais intensivo, é recomendado identificar o pedido com `de`, um email de contacto, para limites mais altos e suporte.

### 23.2) Porque esta fase deve ter fallback?

Agora a app passa a depender de duas APIs:

1. Open Trivia DB para perguntas;
2. MyMemory para tradução.

Isto aumenta a possibilidade de falha:

- a tradução pode atingir limite diário;
- a rede pode falhar;
- o serviço pode devolver uma tradução fraca;
- o texto pode não ter tradução encontrada;
- a tradução pode demorar mais do que o pedido inicial.

Por isso, a regra desta fase é:

> Se a tradução falhar, a app mostra a pergunta original em inglês.

Isto é uma decisão importante de UX: é melhor ter um quiz em inglês do que não ter quiz nenhum.

### 23.3) Criar `src/services/translationApi.js`

Cria o ficheiro `src/services/translationApi.js`:

```jsx
const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";
const SOURCE_LANGUAGE = "en";
const TARGET_LANGUAGE = "pt-PT";

/**
 * Traduz um segmento de texto de inglês para português.
 * @param {string} text - Texto original em inglês.
 * @param {AbortSignal} signal - Sinal para cancelar o pedido.
 * @returns {Promise<string>} Texto traduzido ou texto original.
 */
async function translateTextToPortuguese(text, signal) {
    // Proteção simples: se o texto estiver vazio, não vale a pena chamar a API.
    if (!text.trim()) return text;

    // A MyMemory usa query string, por isso URLSearchParams ajuda a codificar o texto.
    const params = new URLSearchParams({
        q: text,
        langpair: `${SOURCE_LANGUAGE}|${TARGET_LANGUAGE}`,
    });

    // Cada tradução é um pedido GET.
    const response = await fetch(`${MYMEMORY_API_URL}?${params}`, { signal });

    if (!response.ok) {
        throw new Error("Não foi possível traduzir o texto.");
    }

    const data = await response.json();

    // responseData.translatedText é o campo principal usado pela API.
    // Se ele não existir, devolvemos o texto original como fallback local.
    return data.responseData?.translatedText || text;
}

/**
 * Traduz uma pergunta completa: enunciado, resposta certa e respostas erradas.
 * @param {object} question - Pergunta normalizada da app.
 * @param {AbortSignal} signal - Sinal para cancelar pedidos.
 * @returns {Promise<object>} Pergunta traduzida ou pergunta original.
 */
export async function translateQuestionToPortuguese(question, signal) {
    try {
        // Juntamos todos os textos da pergunta numa lista.
        const textsToTranslate = [
            question.question,
            question.correctAnswer,
            ...question.incorrectAnswers,
        ];

        // Traduzimos os textos da mesma pergunta em paralelo.
        const translatedTexts = await Promise.all(
            textsToTranslate.map((text) => translateTextToPortuguese(text, signal)),
        );

        const [translatedQuestion, translatedCorrectAnswer, ...translatedIncorrectAnswers] =
            translatedTexts;

        return {
            ...question,
            question: translatedQuestion,
            correctAnswer: translatedCorrectAnswer,
            incorrectAnswers: translatedIncorrectAnswers,
        };
    } catch (error) {
        // AbortError deve continuar a subir para o useEffect cancelar corretamente.
        if (error.name === "AbortError") throw error;

        // Se a tradução falhar, mantemos a pergunta original em inglês.
        return question;
    }
}

/**
 * Traduz uma lista de perguntas.
 * @param {object[]} questions - Perguntas normalizadas.
 * @param {AbortSignal} signal - Sinal para cancelar pedidos.
 * @returns {Promise<object[]>} Perguntas traduzidas sempre que possível.
 */
export async function translateQuestionsToPortuguese(questions, signal) {
    const translatedQuestions = [];

    // Usamos ciclo sequencial para ser mais simpático com a API gratuita.
    // Dentro de cada pergunta, os 5 textos continuam a ser traduzidos em paralelo.
    for (const question of questions) {
        const translatedQuestion = await translateQuestionToPortuguese(
            question,
            signal,
        );

        translatedQuestions.push(translatedQuestion);
    }

    return translatedQuestions;
}
```

### 23.4) Atualizar `src/services/triviaApi.js`

Agora vamos ligar a camada de tradução à camada de perguntas.

No topo de `src/services/triviaApi.js`, adiciona:

```jsx
import { translateQuestionsToPortuguese } from "./translationApi";
```

Depois, no fim de `fetchTriviaQuestions`, substitui:

```jsx
return data.results.map(normalizeQuestion);
```

por:

```jsx
const normalizedQuestions = data.results.map(normalizeQuestion);

return translateQuestionsToPortuguese(normalizedQuestions, signal);
```

**O que mudou?**

- `triviaApi.js` continua responsável por carregar perguntas.
- `translationApi.js` fica responsável por traduzir textos.
- `App.jsx` não precisa de saber que existem duas APIs.
- Se a tradução falhar, a pergunta original continua disponível.

### 23.5) Ajustar o loading

Agora o loading pode demorar um pouco mais, porque a app faz:

1. pedido à Open Trivia DB;
2. normalização das perguntas;
3. pedidos de tradução à MyMemory.

Atualiza `LoadingState.jsx` para explicar melhor:

```jsx
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
```

**Checkpoint K**

- O jogo continua a carregar perguntas.
- Sempre que a tradução funcionar, as perguntas aparecem em português.
- Se a tradução falhar, a app continua a mostrar perguntas em inglês.
- O `App.jsx` não ficou cheio de lógica de tradução.

---

## 24) Versão final sugerida - `App.jsx`

Esta versão junta as fases principais depois da componentização e do Context.

Ficheiro de referência desta secção: `src/App.jsx`.

Nota importante: nesta fase, `fetchTriviaQuestions` já carrega perguntas da Open Trivia DB e tenta traduzi-las através da MyMemory. O `App.jsx` não precisa de conhecer os detalhes da tradução.

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
 * Componente principal da app Quiz Game.
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

    // Lista de perguntas atualmente usada pelo jogo.
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

    // Identificador incremental para disparar um novo jogo via useEffect.
    // Isto evita fazer fetch diretamente dentro do handler do botão.
    const [gameId, setGameId] = useState(0);

    // Valor limpo usado na validação e no ecrã final.
    const cleanPlayerName = playerName.trim();

    // Regra mínima para poder começar.
    const canStartGame = cleanPlayerName.length >= 2;

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

    const gameStats = useMemo(() => {
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
        if (gameId === 0) return;

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
                    controller.signal,
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
    }, [gameId, difficulty]);

    const startGame = () => {
        // Mantém a validação no handler para proteger a lógica,
        // mesmo que o botão já esteja disabled.
        if (!canStartGame) return;

        // Incrementar gameId é o "sinal" para o useEffect carregar perguntas.
        setGameId((previousId) => previousId + 1);
    };

    const resetGame = () => {
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

        // Se esta era a última pergunta, termina o jogo.
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
                <h1>Quiz Game</h1>
                <p>Responde a perguntas para testar conhecimentos.</p>

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
                        canStartGame={canStartGame}
                        onStartGame={startGame}
                    />
                )}

                {gameStatus === "loading" && <LoadingState />}

                {gameStatus === "error" && (
                    // O ecrã de erro recebe só a mensagem e a ação de voltar.
                    <ErrorState message={errorMessage} onReset={resetGame} />
                )}

                {gameStatus === "playing" && currentQuestion && (
                    // A pergunta recebe dados e callbacks específicos do jogo.
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
                        stats={gameStats}
                        onReset={resetGame}
                    />
                )}
            </div>
        </main>
    );
}

export default App;
```

---

## 25) Critérios de aceitação obrigatórios

No fim da ficha, a app deve cumprir:

- O projeto arranca com `npm run dev`.
- O nome do jogador é obrigatório e tem validação mínima.
- A dificuldade é controlada por React.
- O jogo começa com loading.
- As perguntas vêm da Open Trivia DB.
- A app tenta traduzir as perguntas com a MyMemory.
- Se a tradução falhar, as perguntas continuam a aparecer em inglês.
- Se a API falhar, aparece ecrã de erro.
- O temporizador desce de segundo em segundo.
- Quando o tempo chega a 0, as respostas ficam bloqueadas.
- O botão “Avançar” conta como resposta errada.
- A pontuação final é calculada com `useMemo`.
- O tema claro/escuro funciona com Context.
- A consola do browser não tem erros.

---

## 26) Erros comuns e correções

### O projeto não encontra os ficheiros CSS

Confirma os imports no `main.jsx`:

```jsx
import "./styles/index.css";
import "./styles/quiz.css";
```

E confirma se a pasta se chama mesmo `styles`.

### O temporizador está demasiado rápido

Confirma se usaste `1000` no `setTimeout`, não `100`.

### O temporizador continua após terminar o jogo

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

### A tradução não aparece em português

Verifica:

1. A função `translateQuestionsToPortuguese` está importada no `triviaApi.js`?
2. Estás a chamar `translateQuestionsToPortuguese(normalizedQuestions, signal)`?
3. A consola mostra erro da MyMemory?
4. Atingiste o limite gratuito/anónimo?
5. A pergunta pode simplesmente não ter tradução boa disponível.

Lembra-te: nesta ficha, tradução é melhoria. Se falhar, o fallback para inglês é comportamento esperado.

### A tradução fica lenta

É normal ficar mais lenta do que antes. Agora a app faz pedidos à Open Trivia DB e depois vários pedidos à MyMemory.

Para reduzir pedidos:

- mantém `amount` em `5`;
- não chames a API a cada render;
- só começa novo jogo quando o utilizador carrega no botão.

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

## 27) Desafios finais

Escolhe 2 ou 3:

1. Adicionar botão “Jogar outra vez” no ecrã final.
2. Permitir escolher 5 ou 10 perguntas.
3. Guardar melhor pontuação no `localStorage`.
4. Mostrar uma medalha diferente conforme a percentagem final.
5. Mostrar feedback diferente para objetivo atingido e objetivo por atingir.
6. Impedir duplo clique numa resposta.
7. Criar componente `ScoreBadge`.
8. Mostrar a dificuldade no ecrã final.
9. Criar um botão “Usar perguntas locais” se a API falhar.

---

## 28) Checklist de validação

Antes de entregar, confirma:

- [ ] A app arranca com `npm run dev`.
- [ ] O layout usa `index.css` e `quiz.css`.
- [ ] O nome do jogador é controlado por React.
- [ ] O botão de começar fica bloqueado sem nome válido.
- [ ] A dificuldade altera o pedido à API.
- [ ] O jogo mostra loading.
- [ ] As perguntas externas aparecem.
- [ ] A app tenta traduzir perguntas para português.
- [ ] Se a tradução falhar, a app mantém perguntas em inglês.
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

## 29) Perguntas de revisão

1. Porque começámos com perguntas locais antes da API?
2. Qual é a diferença entre estado e estado derivado?
3. Porque não guardamos `score` diretamente em `useState`?
4. Porque as respostas devem ser baralhadas com `useMemo`?
5. Porque o temporizador precisa de cleanup?
6. O que aconteceria se fizesses `fetch` diretamente no corpo do componente?
7. Porque precisamos de estados `loading` e `error`?
8. O que é prop drilling?
9. Quando é melhor usar props em vez de Context?
10. Porque a tradução deve ter fallback para inglês?
11. Porque o `value` do Context foi criado com `useMemo`?

---

## 30) Resumo final

Nesta ficha construíste uma app React pequena, mas completa:

- começaste com layout estático;
- criaste inputs controlados;
- geriste estados de jogo;
- usaste perguntas locais para aprender a mecânica;
- calculaste estatísticas com `useMemo`;
- criaste um temporizador com `useEffect`;
- separaste a app em componentes;
- carregaste perguntas de uma API com outro `useEffect`;
- adicionaste uma camada de tradução com uma segunda API;
- trataste loading e erro;
- identificaste prop drilling;
- usaste `useContext` para preferências globais.

O objetivo não é decorar hooks. O objetivo é perceber quando cada ferramenta faz sentido.
