# Tutorial passo a passo - Task Tracker da Turma (Ficha React 12.º ano)

Este tutorial guia-te na construção de uma app React incremental para gestão de tarefas.

A ficha consolida:

1. Setup e estrutura base
2. JSX e componentes
3. Estado com `useState`
4. Eventos e formulários controlados
5. Listas e renderização condicional
6. Composição com props
7. Persistência com `useEffect` + `localStorage`

---

## 0) O que vais construir

Uma app chamada **Task Tracker da Turma** onde podes:

- criar tarefas;
- marcar tarefas como concluídas;
- remover tarefas;
- filtrar tarefas (`Todas`, `Ativas`, `Concluídas`);
- ver contadores;
- guardar dados no browser com `localStorage`.

### Vocabulário rápido

- **Tarefa ativa**: ainda não concluída.
- **Tarefa concluída**: já terminada.
- **Persistência**: dados mantêm-se após recarregar a página.
- **Componente pai**: mantém estado principal.
- **Componente filho**: recebe dados e funções por props.

### Debug rápido para toda a ficha

1. O terminal está na pasta do projeto? (`pwd`)
2. O servidor está a correr? (`npm run dev`)
3. Há erros no terminal ou consola do browser?
4. Os imports apontam para caminhos corretos?
5. Guardaste os ficheiros antes de testar?

### Pontos de paragem

- **Paragem A**: layout base a renderizar.
- **Paragem B**: adicionar tarefa funciona.
- **Paragem C**: concluir/remover funciona.
- **Paragem D**: filtros e contadores corretos.
- **Paragem E**: dados persistem após refresh.
- **Paragem F**: app separada em componentes.

---

## 1) Pré-requisitos

- Node.js 18+
- npm
- VS Code (ou editor equivalente)

Verifica versões:

```bash
node -v
npm -v
```

---

## 2) Criar o projeto

```bash
npm create vite@latest ficha02-task-tracker -- --template react
cd ficha02-task-tracker
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
- remover `import "./App.css"` do `src/App.jsx`.

No mínimo, mantém:

```text
src/
  App.jsx
  main.jsx
```

---

## 4) Fase 1 - Layout base (Paragem A)

`src/App.jsx`

```jsx
function App() {
    return (
        <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
            <h1>Task Tracker da Turma</h1>
            <p>Organiza as tuas tarefas de estudo.</p>
        </main>
    );
}

export default App;
```

**Checkpoint A**

- Título e descrição visíveis.
- Sem erros na consola.

---

## 5) Fase 2 - Adicionar tarefas (Paragem B)

Objetivo: criar input controlado e adicionar tarefas à lista.

`src/App.jsx`

```jsx
import { useState } from "react";

function App() {
    const [texto, setTexto] = useState("");
    const [tarefas, setTarefas] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const textoLimpo = texto.trim();
        if (!textoLimpo) return;

        const novaTarefa = {
            id: crypto.randomUUID(),
            texto: textoLimpo,
            concluida: false,
        };

        setTarefas((anteriores) => [...anteriores, novaTarefa]);
        setTexto("");
    };

    return (
        <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
            <h1>Task Tracker da Turma</h1>
            <p>Organiza as tuas tarefas de estudo.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                <input
                    type="text"
                    placeholder="Nova tarefa"
                    value={texto}
                    onChange={(event) => setTexto(event.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>

            <ul style={{ marginTop: "16px" }}>
                {tarefas.map((tarefa) => (
                    <li key={tarefa.id}>{tarefa.texto}</li>
                ))}
            </ul>
        </main>
    );
}

export default App;
```

**Checkpoint B**

- Ao submeter texto, entra nova tarefa na lista.
- Input limpa após submit.
- Submit vazio não adiciona tarefa.

---

## 6) Fase 3 - Concluir e remover (Paragem C)

Objetivo: adicionar ações por tarefa.

`src/App.jsx`

```jsx
import { useState } from "react";

function App() {
    const [texto, setTexto] = useState("");
    const [tarefas, setTarefas] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const textoLimpo = texto.trim();
        if (!textoLimpo) return;

        const novaTarefa = {
            id: crypto.randomUUID(),
            texto: textoLimpo,
            concluida: false,
        };

        setTarefas((anteriores) => [...anteriores, novaTarefa]);
        setTexto("");
    };

    const alternarConcluida = (id) => {
        setTarefas((anteriores) =>
            anteriores.map((tarefa) =>
                tarefa.id === id
                    ? { ...tarefa, concluida: !tarefa.concluida }
                    : tarefa
            )
        );
    };

    const removerTarefa = (id) => {
        setTarefas((anteriores) => anteriores.filter((tarefa) => tarefa.id !== id));
    };

    return (
        <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
            <h1>Task Tracker da Turma</h1>
            <p>Organiza as tuas tarefas de estudo.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                <input
                    type="text"
                    placeholder="Nova tarefa"
                    value={texto}
                    onChange={(event) => setTexto(event.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>

            <ul style={{ marginTop: "16px" }}>
                {tarefas.map((tarefa) => (
                    <li key={tarefa.id} style={{ marginBottom: "8px" }}>
                        <span
                            style={{
                                textDecoration: tarefa.concluida ? "line-through" : "none",
                                marginRight: "12px",
                            }}
                        >
                            {tarefa.texto}
                        </span>

                        <button onClick={() => alternarConcluida(tarefa.id)}>
                            {tarefa.concluida ? "Reabrir" : "Concluir"}
                        </button>

                        <button onClick={() => removerTarefa(tarefa.id)} style={{ marginLeft: "8px" }}>
                            Remover
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default App;
```

**Checkpoint C**

- Botão `Concluir` marca visualmente a tarefa.
- Botão `Reabrir` volta ao estado ativo.
- Botão `Remover` elimina apenas a tarefa certa.

---

## 7) Fase 4 - Filtros e contadores (Paragem D)

Objetivo: renderização condicional e derivação de dados.

`src/App.jsx`

```jsx
import { useState } from "react";

function App() {
    const [texto, setTexto] = useState("");
    const [tarefas, setTarefas] = useState([]);
    const [filtro, setFiltro] = useState("todas");

    const handleSubmit = (event) => {
        event.preventDefault();
        const textoLimpo = texto.trim();
        if (!textoLimpo) return;

        const novaTarefa = {
            id: crypto.randomUUID(),
            texto: textoLimpo,
            concluida: false,
        };

        setTarefas((anteriores) => [...anteriores, novaTarefa]);
        setTexto("");
    };

    const alternarConcluida = (id) => {
        setTarefas((anteriores) =>
            anteriores.map((tarefa) =>
                tarefa.id === id
                    ? { ...tarefa, concluida: !tarefa.concluida }
                    : tarefa
            )
        );
    };

    const removerTarefa = (id) => {
        setTarefas((anteriores) => anteriores.filter((tarefa) => tarefa.id !== id));
    };

    const tarefasFiltradas = tarefas.filter((tarefa) => {
        if (filtro === "ativas") return !tarefa.concluida;
        if (filtro === "concluidas") return tarefa.concluida;
        return true;
    });

    const total = tarefas.length;
    const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;
    const ativas = total - concluidas;

    return (
        <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
            <h1>Task Tracker da Turma</h1>
            <p>Organiza as tuas tarefas de estudo.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                <input
                    type="text"
                    placeholder="Nova tarefa"
                    value={texto}
                    onChange={(event) => setTexto(event.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>

            <div style={{ marginTop: "16px" }}>
                <button onClick={() => setFiltro("todas")}>Todas</button>
                <button onClick={() => setFiltro("ativas")} style={{ marginLeft: "8px" }}>
                    Ativas
                </button>
                <button onClick={() => setFiltro("concluidas")} style={{ marginLeft: "8px" }}>
                    Concluídas
                </button>
            </div>

            <p style={{ marginTop: "12px" }}>
                Total: {total} | Ativas: {ativas} | Concluídas: {concluidas}
            </p>

            {tarefasFiltradas.length === 0 ? (
                <p>Sem tarefas para este filtro.</p>
            ) : (
                <ul>
                    {tarefasFiltradas.map((tarefa) => (
                        <li key={tarefa.id} style={{ marginBottom: "8px" }}>
                            <span
                                style={{
                                    textDecoration: tarefa.concluida ? "line-through" : "none",
                                    marginRight: "12px",
                                }}
                            >
                                {tarefa.texto}
                            </span>

                            <button onClick={() => alternarConcluida(tarefa.id)}>
                                {tarefa.concluida ? "Reabrir" : "Concluir"}
                            </button>

                            <button
                                onClick={() => removerTarefa(tarefa.id)}
                                style={{ marginLeft: "8px" }}
                            >
                                Remover
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

export default App;
```

**Checkpoint D**

- Filtros mostram corretamente as tarefas.
- Contadores atualizam em tempo real.
- Mensagem `Sem tarefas para este filtro.` aparece quando aplicável.

---

## 8) Fase 5 - Persistência com localStorage (Paragem E)

Objetivo: manter tarefas após refresh.

Substitui o topo de `src/App.jsx` por:

```jsx
import { useEffect, useState } from "react";
```

E no componente, altera o estado inicial de `tarefas`:

```jsx
const [tarefas, setTarefas] = useState(() => {
    const guardadas = localStorage.getItem("tarefas_turma");
    return guardadas ? JSON.parse(guardadas) : [];
});
```

Adiciona este efeito abaixo dos estados:

```jsx
useEffect(() => {
    localStorage.setItem("tarefas_turma", JSON.stringify(tarefas));
}, [tarefas]);
```

**Checkpoint E**

- Cria/edita tarefas.
- Faz refresh da página.
- A lista mantém-se.

---

## 9) Fase 6 - Separar em componentes (Paragem F)

Cria pasta e ficheiros:

```text
src/components/
  TaskForm.jsx
  TaskFilters.jsx
  TaskList.jsx
  TaskItem.jsx
```

### 9.1) `src/components/TaskForm.jsx`

```jsx
import { useState } from "react";

function TaskForm({ onAddTask }) {
    const [texto, setTexto] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const textoLimpo = texto.trim();
        if (!textoLimpo) return;

        onAddTask(textoLimpo);
        setTexto("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
            <input
                type="text"
                placeholder="Nova tarefa"
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
            />
            <button type="submit">Adicionar</button>
        </form>
    );
}

export default TaskForm;
```

### 9.2) `src/components/TaskFilters.jsx`

```jsx
function TaskFilters({ filtro, onChangeFiltro }) {
    return (
        <div style={{ marginTop: "16px" }}>
            <button onClick={() => onChangeFiltro("todas")} disabled={filtro === "todas"}>
                Todas
            </button>
            <button
                onClick={() => onChangeFiltro("ativas")}
                disabled={filtro === "ativas"}
                style={{ marginLeft: "8px" }}
            >
                Ativas
            </button>
            <button
                onClick={() => onChangeFiltro("concluidas")}
                disabled={filtro === "concluidas"}
                style={{ marginLeft: "8px" }}
            >
                Concluídas
            </button>
        </div>
    );
}

export default TaskFilters;
```

### 9.3) `src/components/TaskItem.jsx`

```jsx
function TaskItem({ tarefa, onToggleTask, onRemoveTask }) {
    return (
        <li style={{ marginBottom: "8px" }}>
            <span
                style={{
                    textDecoration: tarefa.concluida ? "line-through" : "none",
                    marginRight: "12px",
                }}
            >
                {tarefa.texto}
            </span>

            <button onClick={() => onToggleTask(tarefa.id)}>
                {tarefa.concluida ? "Reabrir" : "Concluir"}
            </button>

            <button onClick={() => onRemoveTask(tarefa.id)} style={{ marginLeft: "8px" }}>
                Remover
            </button>
        </li>
    );
}

export default TaskItem;
```

### 9.4) `src/components/TaskList.jsx`

```jsx
import TaskItem from "./TaskItem";

function TaskList({ tarefas, onToggleTask, onRemoveTask }) {
    if (tarefas.length === 0) {
        return <p>Sem tarefas para este filtro.</p>;
    }

    return (
        <ul>
            {tarefas.map((tarefa) => (
                <TaskItem
                    key={tarefa.id}
                    tarefa={tarefa}
                    onToggleTask={onToggleTask}
                    onRemoveTask={onRemoveTask}
                />
            ))}
        </ul>
    );
}

export default TaskList;
```

### 9.5) `src/App.jsx` final

```jsx
import { useEffect, useState } from "react";
import TaskFilters from "./components/TaskFilters";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
    const [tarefas, setTarefas] = useState(() => {
        const guardadas = localStorage.getItem("tarefas_turma");
        return guardadas ? JSON.parse(guardadas) : [];
    });
    const [filtro, setFiltro] = useState("todas");

    useEffect(() => {
        localStorage.setItem("tarefas_turma", JSON.stringify(tarefas));
    }, [tarefas]);

    const addTask = (texto) => {
        const novaTarefa = {
            id: crypto.randomUUID(),
            texto,
            concluida: false,
        };

        setTarefas((anteriores) => [...anteriores, novaTarefa]);
    };

    const toggleTask = (id) => {
        setTarefas((anteriores) =>
            anteriores.map((tarefa) =>
                tarefa.id === id
                    ? { ...tarefa, concluida: !tarefa.concluida }
                    : tarefa
            )
        );
    };

    const removeTask = (id) => {
        setTarefas((anteriores) => anteriores.filter((tarefa) => tarefa.id !== id));
    };

    const tarefasFiltradas = tarefas.filter((tarefa) => {
        if (filtro === "ativas") return !tarefa.concluida;
        if (filtro === "concluidas") return tarefa.concluida;
        return true;
    });

    const total = tarefas.length;
    const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;
    const ativas = total - concluidas;

    return (
        <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
            <h1>Task Tracker da Turma</h1>
            <p>Organiza as tuas tarefas de estudo.</p>

            <TaskForm onAddTask={addTask} />

            <TaskFilters filtro={filtro} onChangeFiltro={setFiltro} />

            <p style={{ marginTop: "12px" }}>
                Total: {total} | Ativas: {ativas} | Concluídas: {concluidas}
            </p>

            <TaskList
                tarefas={tarefasFiltradas}
                onToggleTask={toggleTask}
                onRemoveTask={removeTask}
            />
        </main>
    );
}

export default App;
```

**Checkpoint F**

- Mesma funcionalidade da fase anterior.
- Código dividido por responsabilidade.
- `App.jsx` mais limpo e fácil de manter.

---

## 10) Erros comuns e correções

1. `Cannot find module` nos componentes

- Confirma nomes/caminhos em `src/components`.
- Confirma maiúsculas/minúsculas.

2. Tarefas desaparecem após refresh

- Verifica se o `useEffect` grava no `localStorage`.
- Verifica se o estado inicial lê com `localStorage.getItem(...)`.

3. Botões não atuam na tarefa certa

- Confirma se passas `tarefa.id` nas callbacks.

4. Filtro parece não funcionar

- Confirma as strings: `todas`, `ativas`, `concluidas`.

---

## 11) Desafios finais

1. Não permitir tarefas com o mesmo texto.
2. Botão “Limpar concluídas”.
3. Editar o texto de uma tarefa.
4. Ordenar tarefas por mais recentes.
5. Adicionar prioridade (`baixa`, `média`, `alta`).

---

## 12) Checklist de validação

- [ ] Criação de tarefas funcional
- [ ] Concluir/reabrir funcional
- [ ] Remover funcional
- [ ] Filtros funcionais
- [ ] Contadores corretos
- [ ] Persistência com `localStorage`
- [ ] Componentização concluída
