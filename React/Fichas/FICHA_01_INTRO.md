# Exercícios de Introdução ao React (12º ano)

## Exercício 1: Instalar o React

1. Abre o terminal e navega até à pasta onde queres criar o teu projeto React.
2. Executa o seguinte comando para criar um novo projeto React usando o Vite:

```bash
npm create vite@latest ficha01 -- --template react
```

3. Navega até à pasta do projeto:

```bash
cd ficha01
```

4. Instala as dependências do projeto:

```bash
npm install
```

5. Se o servidor de desenvolvimento não iniciar automaticamente, executa o seguinte comando para iniciar o servidor:

```bash
npm run dev
```

## Exercício 2: Criar um Componente Simples

1. Abre o ficheiro `src/App.jsx`.
2. Substitui o conteúdo do ficheiro pelo seguinte código para criar um componente simples que exibe uma mensagem de boas-vindas:

```jsx
import React from "react"; // Esta importação é opcional a partir do React 17, mas é boa prática incluí-la.

function App() {
    return (
        <div>
            <h1>Bem-vindo ao React!</h1>
            <p>Este é o meu primeiro componente React.</p>
        </div>
    );
}

export default App;
```

## Exercício 3: Criar um botão que muda a cor do fundo

1. No mesmo ficheiro `src/App.jsx`, adiciona um estado para controlar a cor do fundo e um botão para alterar essa cor. Substitui o conteúdo do ficheiro pelo seguinte código:

```jsx
import React, { useState } from "react";

function App() {
    const [backgroundColor, setBackgroundColor] = useState("white");

    const changeBackgroundColor = () => {
        setBackgroundColor(backgroundColor === "white" ? "lightblue" : "white");
    };

    return (
        <div
            style={{
                backgroundColor: backgroundColor,
                height: "100vh",
                padding: "20px",
            }}
        >
            <h1>Bem-vindo ao React!</h1>
            <p>Este é o meu primeiro componente React.</p>
            <button onClick={changeBackgroundColor}>Mudar Cor do Fundo</button>
        </div>
    );
}

export default App;
```

## Exercício 4: Criar um componente de lista

1. Cria um novo ficheiro chamado `src/components/Lista.jsx`.

2. Adiciona o seguinte código ao ficheiro `src/components/Lista.jsx` para criar um componente que exibe uma lista de itens:

```jsx
import React from "react";

function Lista() {
    const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

    return (
        <div>
            <h2>Minha Lista</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default Lista;
```

3. Agora, importa o componente `Lista` no ficheiro `src/App.jsx` e adiciona-o ao JSX para exibir a lista na tua aplicação:

```jsx
import React, { useState } from "react";
import Lista from "./components/Lista"; // Importa o componente Lista

function App() {
    const [backgroundColor, setBackgroundColor] = useState("white");

    const changeBackgroundColor = () => {
        setBackgroundColor(backgroundColor === "white" ? "lightblue" : "white");
    };

    return (
        <div
            style={{
                backgroundColor: backgroundColor,
                height: "100vh",
                padding: "20px",
            }}
        >
            <h1>Bem-vindo ao React!</h1>
            <p>Este é o meu primeiro componente React.</p>
            <button onClick={changeBackgroundColor}>Mudar Cor do Fundo</button>
            <Lista /> {/* Adiciona o componente Lista aqui */}
        </div>
    );
}

export default App;
```

## Exercício 5: Criar um componente de formulário

1. Cria um novo ficheiro chamado `src/components/Formulario.jsx`.

2. Adiciona o seguinte código ao ficheiro `src/components/Formulario.jsx` para criar um componente de formulário simples:

```jsx
import React, { useState } from "react";

function Formulario() {
    const [nome, setNome] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Olá, ${nome}!`);
    };

    return (
        <div>
            <h2>Formulário de Saudação</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Formulario;
```

3. Agora, importa o componente `Formulario` no ficheiro `src/App.jsx` e adiciona-o ao JSX para exibir o formulário na tua aplicação:

```jsx
import React, { useState } from "react";
import Lista from "./components/Lista"; // Importa o componente Lista
import Formulario from "./components/Formulario"; // Importa o componente Formulario

function App() {
    const [backgroundColor, setBackgroundColor] = useState("white");

    const changeBackgroundColor = () => {
        setBackgroundColor(backgroundColor === "white" ? "lightblue" : "white");
    };

    return (
        <div
            style={{
                backgroundColor: backgroundColor,
                height: "100vh",
                padding: "20px",
            }}
        >
            <h1>Bem-vindo ao React!</h1>
            <p>Este é o meu primeiro componente React.</p>
            <button onClick={changeBackgroundColor}>Mudar Cor do Fundo</button>
            <Lista /> {/* Adiciona o componente Lista aqui */}
            <Formulario /> {/* Adiciona o componente Formulario aqui */}
        </div>
    );
}

export default App;
```
