# Tutorial passo a passo - Lista de Boas-vindas (Ficha React 12.º ano)

Este tutorial explica, do início ao fim, como construir uma app React introdutória.

É uma ficha pensada para consolidar os seguintes temas:

1. Fundamentos e setup
2. JSX e componentes
3. Estado e eventos
4. Formulários controlados
5. Listas e renderização condicional
6. Composição com props

---

## 0) O que vais construir

Uma app chamada **Lista de Boas-vindas** que permite:

- alternar tema claro/escuro;
- escrever um nome num formulário;
- ao submeter, mostrar `Olá, <nome>!`;
- guardar esse nome numa lista apresentada por baixo.

### Vocabulário rápido

- **Componente**: bloco reutilizável da interface.
- **Estado (`state`)**: dados que mudam e atualizam a UI.
- **Props**: dados/funções passadas do componente pai para o filho.
- **Input controlado**: `value` e `onChange` ligados ao estado React.

### Debug rápido para toda a ficha

1. Estás na pasta certa? (`pwd`)
2. O projeto foi criado sem erros?
3. O servidor está a correr? (`npm run dev`)
4. A consola do browser mostra erros?
5. Os imports têm caminhos corretos?

### Pontos de paragem

- **Paragem A**: app mínima com título e texto.
- **Paragem B**: botão de tema funciona.
- **Paragem C**: formulário mostra saudação com o último nome.
- **Paragem D**: cada nome entra na lista.
- **Paragem E**: app separada em componentes (`FormularioNome`, `ListaNomes`).

### 0.1) Mapa de fases

- Fase 1 - Setup e app mínima: `src/App.jsx`
- Fase 2 - Tema com `useState`: `src/App.jsx`
- Fase 3 - Formulário controlado + saudação: `src/App.jsx`
- Fase 4 - Lista incremental de nomes: `src/App.jsx`
- Fase 5 - Separação por componentes: `src/App.jsx`, `src/components/FormularioNome.jsx`, `src/components/ListaNomes.jsx`

---

## 1) Pré-requisitos

- Node.js 18+
- npm
- VS Code (ou outro editor)

Verifica versões:

```bash
node -v
npm -v
```

---

## 2) Criar o projeto com Vite

1. Criar projeto:

```bash
npm create vite@latest ficha01 -- --template react
```

2. Entrar na pasta:

```bash
cd ficha01
```

3. Instalar dependências:

```bash
npm install
```

4. Arrancar servidor:

```bash
npm run dev
```

5. Abrir no editor (opcional):

```bash
code .
```

---

## 3) Limpeza inicial

Se quiseres começar limpo:

- apagar `src/App.css`;
- remover `import "./App.css"` do `src/App.jsx`.

No fim, garante que tens pelo menos:

```text
src/
  App.jsx
  main.jsx
```

---

## 4) Fase 1 - App mínima (Paragem A)

Substitui o conteúdo de `src/App.jsx` por:

```jsx
function App() {
    return (
        <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
            <h1>Lista de Boas-vindas</h1>
            <p>Primeira app React da turma.</p>
        </main>
    );
}

export default App;
```

**Checkpoint A**

- Vês título e texto na página.
- Não há erros na consola.

---

## 5) Fase 2 - Tema claro/escuro (Paragem B)

Agora adiciona estado com `useState` e botão de alternância.

`src/App.jsx`:

```jsx
import { useState } from "react";

function App() {
    const [temaEscuro, setTemaEscuro] = useState(false);

    const estilos = {
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: temaEscuro ? "#1f2937" : "#f3f4f6",
        color: temaEscuro ? "#f9fafb" : "#111827",
    };

    return (
        <main style={estilos}>
            <h1>Lista de Boas-vindas</h1>
            <p>Primeira app React da turma.</p>

            <button onClick={() => setTemaEscuro(!temaEscuro)}>
                Mudar tema
            </button>
        </main>
    );
}

export default App;
```

**Checkpoint B**

- O botão altera fundo e cor de texto.
- O estado mantém-se coerente a cada clique.

---

## 6) Fase 3 - Formulário controlado e saudação (Paragem C)

Nesta fase:

- crias um input controlado (`value` + `onChange`);
- no submit mostras saudação com o último nome enviado.

`src/App.jsx`:

```jsx
import { useState } from "react";

function App() {
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [nome, setNome] = useState("");
    const [ultimoNome, setUltimoNome] = useState("");

    const estilos = {
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: temaEscuro ? "#1f2937" : "#f3f4f6",
        color: temaEscuro ? "#f9fafb" : "#111827",
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) return;

        setUltimoNome(nomeLimpo);
        setNome("");
    };

    return (
        <main style={estilos}>
            <h1>Lista de Boas-vindas</h1>
            <p>Primeira app React da turma.</p>

            <button onClick={() => setTemaEscuro(!temaEscuro)}>
                Mudar tema
            </button>

            <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                <input
                    type="text"
                    placeholder="Escreve um nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>

            {ultimoNome && <p>Olá, {ultimoNome}!</p>}
        </main>
    );
}

export default App;
```

**Checkpoint C**

- Se submeteres vazio, nada acontece.
- Se submeteres um nome, aparece `Olá, nome!`.
- O input limpa após submit.

---

## 7) Fase 4 - Guardar nomes numa lista (Paragem D)

Agora vem o comportamento principal da ficha:

Sempre que submetes um nome:

1. mostra `Olá, <nome>!`;
2. adiciona o nome à lista;
3. mostra a lista por baixo.

`src/App.jsx`:

```jsx
import { useState } from "react";

function App() {
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [nome, setNome] = useState("");
    const [ultimoNome, setUltimoNome] = useState("");
    const [nomes, setNomes] = useState([]);

    const estilos = {
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: temaEscuro ? "#1f2937" : "#f3f4f6",
        color: temaEscuro ? "#f9fafb" : "#111827",
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) return;

        setUltimoNome(nomeLimpo);
        setNomes((nomesAnteriores) => [...nomesAnteriores, nomeLimpo]);
        setNome("");
    };

    return (
        <main style={estilos}>
            <h1>Lista de Boas-vindas</h1>
            <p>Primeira app React da turma.</p>

            <button onClick={() => setTemaEscuro(!temaEscuro)}>
                Mudar tema
            </button>

            <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                <input
                    type="text"
                    placeholder="Escreve um nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>

            {ultimoNome && <p>Olá, {ultimoNome}!</p>}

            <h2>Lista de nomes</h2>
            <ul>
                {nomes.map((nomeAtual, index) => (
                    <li key={`${nomeAtual}-${index}`}>{nomeAtual}</li>
                ))}
            </ul>
        </main>
    );
}

export default App;
```

**Checkpoint D**

- A saudação mostra sempre o último nome submetido.
- A lista acumula todos os nomes submetidos.
- O render da lista usa `.map()`.

---

## 8) Fase 5 - Separar em componentes (Paragem E)

Nesta fase vais manter o mesmo comportamento, mas com melhor organização.

### 8.1) Criar `src/components/ListaNomes.jsx`

```jsx
function ListaNomes({ nomes }) {
    return (
        <>
            <h2>Lista de nomes</h2>
            <ul>
                {nomes.map((nomeAtual, index) => (
                    <li key={`${nomeAtual}-${index}`}>{nomeAtual}</li>
                ))}
            </ul>
        </>
    );
}

export default ListaNomes;
```

### 8.2) Criar `src/components/FormularioNome.jsx`

```jsx
import { useState } from "react";

function FormularioNome({ onAdicionarNome }) {
    const [nome, setNome] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const nomeLimpo = nome.trim();
        if (!nomeLimpo) return;

        onAdicionarNome(nomeLimpo);
        setNome("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
            <input
                type="text"
                placeholder="Escreve um nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
            />
            <button type="submit">Adicionar</button>
        </form>
    );
}

export default FormularioNome;
```

### 8.3) Atualizar `src/App.jsx`

```jsx
import { useState } from "react";
import FormularioNome from "./components/FormularioNome";
import ListaNomes from "./components/ListaNomes";

function App() {
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [ultimoNome, setUltimoNome] = useState("");
    const [nomes, setNomes] = useState([]);

    const estilos = {
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: temaEscuro ? "#1f2937" : "#f3f4f6",
        color: temaEscuro ? "#f9fafb" : "#111827",
    };

    const adicionarNome = (nomeNovo) => {
        setUltimoNome(nomeNovo);
        setNomes((nomesAnteriores) => [...nomesAnteriores, nomeNovo]);
    };

    return (
        <main style={estilos}>
            <h1>Lista de Boas-vindas</h1>
            <p>Primeira app React da turma.</p>

            <button onClick={() => setTemaEscuro(!temaEscuro)}>
                Mudar tema
            </button>

            <FormularioNome onAdicionarNome={adicionarNome} />

            {ultimoNome && <p>Olá, {ultimoNome}!</p>}

            <ListaNomes nomes={nomes} />
        </main>
    );
}

export default App;
```

**Checkpoint E**

- Comportamento final mantém-se igual ao da fase anterior.
- O `App` fica mais simples e legível.
- A lista e o formulário ficam reutilizáveis.

---

## 9) Erros comuns e correções

1. `Cannot find module ...`

- Confirma se criaste `src/components/ListaNomes.jsx` e `src/components/FormularioNome.jsx`.
- Revê maiúsculas/minúsculas nos nomes dos ficheiros e imports.

2. O botão não muda o tema

- Confirma o `onClick={() => setTemaEscuro(!temaEscuro)}`.
- Confirma que `temaEscuro` está a ser usado no objeto `estilos`.

3. Submeter não faz nada

- Verifica se o botão tem `type="submit"`.
- Verifica se o `<form>` tem `onSubmit={handleSubmit}`.

4. Lista não atualiza

- Confirma se estás a usar:

```jsx
setNomes((nomesAnteriores) => [...nomesAnteriores, nomeLimpo]);
```

- Não uses `nomes.push(...)` diretamente.

---

## 10) Desafios finais

1. Não permitir nomes repetidos.
2. Adicionar botão para remover cada nome.
3. Mostrar contador total de nomes.
4. Ordenar lista alfabeticamente.
5. Guardar lista no `localStorage`.

---

## 11) Checklist de validação

Antes de terminares, confirma:

- projeto criado com Vite e a correr;
- tema claro/escuro funcional;
- formulário controlado funcional;
- saudação ao último nome submetido;
- lista de nomes acumulada e visível;
- app separada em componentes.
