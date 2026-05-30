![Header](../Images/Header.png)

# Tutorial passo a passo - Task Tracker Fullstack (12.º ano)

Esta ficha guia-te na construção de uma pequena app **fullstack** com:

- **React + Vite** no frontend;
- **Node.js + Express** no backend;
- **MongoDB Atlas** como base de dados;
- **Mongoose** para criar o modelo e falar com o MongoDB.

O objetivo não é criar uma app grande. O objetivo é perceber, pela primeira vez de forma integrada, como uma ação no browser pode chegar ao servidor, ser guardada numa base de dados e voltar para a interface.

---

## 0) O que vais construir

Uma app chamada **Task Tracker Fullstack** onde podes:

- ver tarefas guardadas no MongoDB Atlas;
- criar uma nova tarefa através de um formulário React;
- ver a nova tarefa aparecer no ecrã sem recarregar a página.

Nesta primeira versão vamos implementar apenas:

```txt
GET  /api/tarefas  -> listar tarefas
POST /api/tarefas  -> criar tarefa
```

O `PATCH /api/tarefas/:id` fica como **desafio final**.

### Vocabulário rápido

- **Frontend**: a aplicação que corre no browser. Nesta ficha é o React.
- **Backend**: o servidor que recebe pedidos HTTP. Nesta ficha é o Express.
- **Base de dados**: onde os dados ficam guardados. Nesta ficha é o MongoDB Atlas.
- **API**: conjunto de rotas que o frontend pode chamar.
- **Rota**: endereço do backend, por exemplo `GET /api/tarefas`.
- **Controller**: função que recebe o pedido, chama o modelo e envia a resposta.
- **Model**: representação de uma coleção MongoDB no código Node.js.
- **Middleware**: função que corre antes do controller para preparar, validar ou bloquear pedidos.

### Debug rápido para toda a ficha

1. Estás na pasta certa? (`pwd`)
2. O backend está a correr? (`npm run dev` dentro de `backend`)
3. O frontend está a correr? (`npm run dev` dentro de `frontend`)
4. O ficheiro `.env` existe no backend?
5. O `MONGODB_URI` está correto?
6. O browser mostra erros na consola?
7. O separador Network mostra o pedido para `/api/tarefas`?
8. O CORS está configurado para `http://localhost:5173`?

### Pontos de paragem

- **Paragem A**: backend responde em `GET /api/health`.
- **Paragem B**: backend liga ao MongoDB Atlas.
- **Paragem C**: `GET /api/tarefas` devolve uma lista.
- **Paragem D**: `POST /api/tarefas` cria uma tarefa.
- **Paragem E**: React carrega tarefas com `useEffect`.
- **Paragem F**: React cria tarefa com formulário controlado.
- **Paragem G**: desafio final com `PATCH`.

### Mapa mental da app

```txt
React App
  -> fetch("GET /api/tarefas")
  -> Express route
  -> controller
  -> Mongoose model
  -> MongoDB Atlas
  <- JSON com tarefas
  <- setTarefas(...)
  <- UI atualizada
```

### Ligações diretas aos temas já estudados

1. **React `useState`** - guardar tarefas, input, loading e erro.
2. **React `useEffect`** - carregar tarefas quando a app abre.
3. **Formulários controlados** - input `titulo` ligado ao estado.
4. **Fetch e async/await** - chamadas do frontend para o backend.
5. **Express** - rotas, JSON e CORS.
6. **Middlewares** - validação simples antes de criar tarefa.
7. **Controllers** - funções separadas para listar e criar.
8. **Mongoose** - schema, model e ligação ao MongoDB.

### Conceitos essenciais

**1) O React não fala diretamente com o MongoDB**

O browser nunca deve guardar credenciais da base de dados. O React pede dados ao backend. O backend é que usa o `MONGODB_URI` para falar com o Atlas.

**2) O backend é a fonte de verdade**

O estado React mostra dados, mas a fonte principal é o servidor/base de dados. Quando crias uma tarefa, primeiro envias para o backend. Depois atualizas a UI com a tarefa que o backend devolveu.

**3) O contrato tem de ser claro**

Antes de programar, sabemos que:

```txt
GET /api/tarefas
Resposta 200:
[
  { "_id": "...", "titulo": "Estudar React", "feito": false }
]
```

```txt
POST /api/tarefas
Body:
{ "titulo": "Rever MongoDB" }

Resposta 201:
{ "_id": "...", "titulo": "Rever MongoDB", "feito": false }
```

```txt
POST /api/tarefas
Body inválido:
{ "titulo": "" }

Resposta 422:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Título obrigatório",
    "details": []
  }
}
```

**4) GET e POST chegam para a primeira integração**

Nesta aula, o objetivo é fechar o ciclo completo:

```txt
listar -> mostrar no React
criar  -> guardar no MongoDB -> mostrar no React
```

Editar, remover, autenticar, paginar e filtrar são evoluções futuras.

---

## 1) Pré-requisitos

- Node.js 18+
- npm
- VS Code ou outro editor
- Conta MongoDB Atlas
- Cluster Atlas criado
- String de ligação `MONGODB_URI`

Verifica versões:

```bash
node -v
npm -v
```

---

## 2) Criar a pasta do projeto

Cria uma pasta para o projeto fullstack:

```bash
mkdir task-tracker-fullstack
cd task-tracker-fullstack
```

Dentro dela vamos ter duas apps:

```txt
task-tracker-fullstack/
  backend/
  frontend/
```

---

## 3) Backend - setup inicial

Cria a pasta do backend:

```bash
mkdir backend
cd backend
npm init -y
npm pkg set type=module
npm install express cors mongoose dotenv
npm install -D nodemon
```

Atualiza os scripts do `package.json`:

```json
{
    "scripts": {
        "dev": "nodemon src/server.js",
        "start": "node src/server.js"
    }
}
```

Cria a estrutura:

```bash
mkdir -p src/controllers src/db src/middlewares src/models src/routes
touch src/app.js src/server.js
```

No fim, o backend deve ficar assim:

```txt
backend/
  package.json
  src/
    app.js
    server.js
    controllers/
      tarefas.controller.js
    db/
      mongoose.js
    middlewares/
      errorHandler.js
      validateTitulo.js
    models/
      Tarefa.js
    routes/
      tarefas.routes.js
```

---

## 4) Backend - variáveis de ambiente

Cria o ficheiro `.env` dentro de `backend/`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://UTILIZADOR:PASSWORD@cluster0.xxxxx.mongodb.net/task_tracker_turma?retryWrites=true&w=majority
```

Cria também `.gitignore`:

```gitignore
node_modules
.env
```

Cria ainda `.env.example`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://UTILIZADOR:PASSWORD@cluster0.xxxxx.mongodb.net/task_tracker_turma?retryWrites=true&w=majority
```

> Nunca coloques o `.env` no Git. A string do MongoDB contém credenciais.
> O `.env.example` pode ficar no projeto porque serve apenas como modelo, sem credenciais reais.

> Enquanto o `MONGODB_URI` tiver `UTILIZADOR`, `PASSWORD` ou `xxxxx`, o backend não vai conseguir ligar ao Atlas. Isso é esperado: antes de testar a API completa, substitui esses valores pelos dados reais do teu cluster.

**Checkpoint**

- O ficheiro `.env` está dentro de `backend/`.
- O `.gitignore` tem `.env`.
- O `.env.example` existe e não tem credenciais reais.
- O `MONGODB_URI` tem o utilizador, password, cluster e nome da base de dados.

---

## 5) Backend - ligação ao MongoDB

Cria `src/db/mongoose.js`:

```js
import mongoose from "mongoose";

/**
 * Liga a aplicação ao MongoDB Atlas usando a variável MONGODB_URI.
 *
 * Esta função deve ser chamada antes de o servidor começar a aceitar pedidos.
 * Se a ligação falhar, a API não deve arrancar, porque as rotas dependem da base de dados.
 *
 * @returns {Promise<void>} Promise resolvida quando a ligação ao MongoDB estiver ativa.
 * @throws {Error} Lança erro se MONGODB_URI estiver em falta ou se a ligação falhar.
 */
export async function connectDb() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI em falta no ficheiro .env");
    }

    if (
        uri.includes("UTILIZADOR") ||
        uri.includes("PASSWORD") ||
        uri.includes("xxxxx")
    ) {
        throw new Error("Substitui o MONGODB_URI pelo valor real do Atlas");
    }

    await mongoose.connect(uri);
    console.log("MongoDB ligado com sucesso");
}
```

**Checkpoint**

- A função usa `process.env.MONGODB_URI`.
- A função é `async`.
- O código não tem a password escrita diretamente no ficheiro.
- Se o aluno deixar o placeholder do Atlas, o erro explica o que falta corrigir.

---

## 6) Backend - modelo `Tarefa`

Cria `src/models/Tarefa.js`:

```js
import mongoose from "mongoose";

/**
 * Schema da coleção de tarefas.
 *
 * Cada tarefa tem:
 * - titulo: texto obrigatório;
 * - feito: booleano com valor inicial false;
 * - createdAt/updatedAt: datas criadas automaticamente pelo Mongoose.
 */
const tarefaSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "Título obrigatório"],
            trim: true,
            minlength: [1, "Título obrigatório"],
            maxlength: [120, "Título demasiado longo"],
        },
        feito: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

/**
 * Model Mongoose usado pelos controllers para ler e escrever tarefas.
 */
export const Tarefa = mongoose.model("Tarefa", tarefaSchema);
```

**Checkpoint**

- O model chama-se `Tarefa`.
- O campo `feito` começa com `false`.
- O schema tem `timestamps: true`.

---

## 7) Backend - middleware de validação

Cria `src/middlewares/validateTitulo.js`:

```js
/**
 * Valida o campo titulo antes de criar uma tarefa.
 *
 * Este middleware corre antes do controller de POST.
 * Se o titulo for inválido, a função termina a resposta com status 422.
 * Se o titulo for válido, limpa espaços extra e chama next().
 *
 * @param {import("express").Request} req - Pedido HTTP recebido pelo Express.
 * @param {import("express").Response} res - Resposta HTTP que será enviada ao cliente.
 * @param {import("express").NextFunction} next - Função que passa para o próximo middleware/controller.
 * @returns {void}
 */
export function validateTitulo(req, res, next) {
    const titulo = req.body?.titulo;

    if (typeof titulo !== "string" || titulo.trim() === "") {
        res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Título obrigatório",
                details: [],
            },
        });
        return;
    }
    
    const tituloLimpo = titulo.trim();

    if (tituloLimpo.length > 120) {
        res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Título demasiado longo",
                details: [],
            },
        });
        return;
    }

    req.body.titulo = tituloLimpo;
    next();
}
```

**Checkpoint**

- Um `POST` com título vazio deve devolver `422`.
- O controller só recebe títulos válidos.
- O middleware chama `next()` apenas quando está tudo bem.

---

## 8) Backend - middleware de erro

Cria `src/middlewares/errorHandler.js`:

```js
/**
 * Middleware final de erro.
 *
 * Recebe erros inesperados e devolve uma resposta JSON segura.
 * Em produção, evita expor detalhes internos da aplicação ao cliente.
 *
 * @param {Error} error - Erro apanhado pelo Express.
 * @param {import("express").Request} _req - Pedido HTTP original.
 * @param {import("express").Response} res - Resposta HTTP enviada ao cliente.
 * @param {import("express").NextFunction} _next - Próximo middleware, não usado aqui.
 * @returns {void}
 */
export function errorHandler(error, _req, res, _next) {
    console.error(error);

    const status = Number(error.status || error.statusCode || 500);
    const safeStatus = status >= 400 && status < 500 ? status : 500;

    res.status(safeStatus).json({
        error: {
            code: safeStatus === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST",
            message:
                safeStatus === 500
                    ? "Erro interno do servidor"
                    : "Pedido inválido",
            details: [],
        },
    });
}
```

**Checkpoint**

- Este middleware fica no fim do `app.js`.
- O frontend recebe JSON mesmo quando há erro inesperado.

---

## 9) Backend - controllers

Cria `src/controllers/tarefas.controller.js`:

```js
import { Tarefa } from "../models/Tarefa.js";

/**
 * Lista todas as tarefas guardadas na base de dados.
 *
 * Fluxo:
 * 1. Procura tarefas no MongoDB.
 * 2. Ordena pelas mais recentes.
 * 3. Devolve a lista em JSON.
 *
 * @param {import("express").Request} _req - Pedido HTTP recebido pelo Express.
 * @param {import("express").Response} res - Resposta HTTP enviada ao cliente.
 * @param {import("express").NextFunction} next - Função usada para encaminhar erros.
 * @returns {Promise<void>}
 */
export async function listarTarefas(_req, res, next) {
    try {
        const tarefas = await Tarefa.find().sort({ createdAt: -1 });
        res.status(200).json(tarefas);
    } catch (error) {
        next(error);
    }
}

/**
 * Cria uma nova tarefa na base de dados.
 *
 * Nesta fase, o titulo já foi validado pelo middleware validateTitulo.
 * O campo feito não vem do frontend porque uma tarefa nova começa sempre por fazer.
 *
 * @param {import("express").Request} req - Pedido HTTP com o body da nova tarefa.
 * @param {import("express").Response} res - Resposta HTTP enviada ao cliente.
 * @param {import("express").NextFunction} next - Função usada para encaminhar erros.
 * @returns {Promise<void>}
 */
export async function criarTarefa(req, res, next) {
    try {
        const novaTarefa = await Tarefa.create({
            titulo: req.body.titulo,
        });

        res.status(201).json(novaTarefa);
    } catch (error) {
        next(error);
    }
}
```

**Checkpoint**

- `listarTarefas` usa `Tarefa.find()`.
- `criarTarefa` usa `Tarefa.create()`.
- Os controllers não configuram CORS, portas ou ligação à base de dados.

---

## 10) Backend - rotas

Cria `src/routes/tarefas.routes.js`:

```js
import { Router } from "express";
import {
    criarTarefa,
    listarTarefas,
} from "../controllers/tarefas.controller.js";
import { validateTitulo } from "../middlewares/validateTitulo.js";

const router = Router();

router.get("/", listarTarefas);
router.post("/", validateTitulo, criarTarefa);

export default router;
```

**Checkpoint**

- O `GET /` chama `listarTarefas`.
- O `POST /` passa primeiro por `validateTitulo`.
- A rota ainda não tem `PATCH`.

---

## 11) Backend - app Express

Cria `src/app.js`:

```js
import cors from "cors";
import express from "express";
import tarefasRoutes from "./routes/tarefas.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/tarefas", tarefasRoutes);

app.use((_req, res) => {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Rota não encontrada",
            details: [],
        },
    });
});

app.use(errorHandler);

export default app;
```

**Checkpoint**

- `express.json()` aparece antes das rotas.
- As tarefas ficam em `/api/tarefas`.
- O `errorHandler` fica depois das rotas.

---

## 12) Backend - server

Cria `src/server.js`:

```js
import "dotenv/config";
import app from "./app.js";
import { connectDb } from "./db/mongoose.js";

const PORT = Number(process.env.PORT || 3000);

/**
 * Arranca a API apenas depois de confirmar ligação ao MongoDB.
 *
 * @returns {Promise<void>} Promise resolvida quando o servidor fica a escutar.
 */
async function startServer() {
    try {
        await connectDb();

        app.listen(PORT, () => {
            console.log(`API a correr em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Falha ao arrancar a API:", error.message);
        process.exit(1);
    }
}

startServer();
```

Corre o backend:

```bash
npm run dev
```

Testa no browser:

```txt
http://localhost:3000/api/health
```

Resposta esperada:

```json
{ "status": "ok" }
```

**Checkpoint A/B**

- O terminal mostra `MongoDB ligado com sucesso`.
- O terminal mostra `API a correr em http://localhost:3000`.
- O browser mostra `{ "status": "ok" }`.

> Nota de diagnóstico: nesta versão, o servidor só começa a escutar depois de conseguir ligar ao MongoDB. Se `/api/health` não abrir, olha primeiro para o terminal. Se o erro mencionar `MONGODB_URI`, o problema está na configuração do Atlas, não na rota `/api/health`.

---

## 13) Testar GET e POST antes do React

Antes de ligar o frontend, confirma que a API funciona.

### Testar GET

Abre no browser:

```txt
http://localhost:3000/api/tarefas
```

Resposta esperada se a coleção estiver vazia:

```json
[]
```

### Testar POST

Usa Thunder Client, Postman ou Insomnia.

```txt
POST http://localhost:3000/api/tarefas
Content-Type: application/json
```

Body:

```json
{
    "titulo": "Estudar integração fullstack"
}
```

Resposta esperada:

```json
{
    "_id": "...",
    "titulo": "Estudar integração fullstack",
    "feito": false,
    "createdAt": "...",
    "updatedAt": "..."
}
```

### Testar validação

Body inválido:

```json
{
    "titulo": ""
}
```

Resposta esperada:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Título obrigatório",
        "details": []
    }
}
```

**Checkpoint C/D**

- `GET /api/tarefas` devolve uma lista.
- `POST /api/tarefas` cria uma tarefa no Atlas.
- `POST /api/tarefas` com título vazio devolve `422`.

---

## 14) Frontend - criar app React

Volta à pasta principal:

```bash
cd ..
```

Cria o frontend:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Limpa o projeto:

- apaga `src/App.css`;
- remove o import de `./App.css`, se existir;
- apaga `src/index.css`;
- remove o import de `./index.css` do `src/main.jsx`;
- apaga `src/assets/`, se existir.

> Nota: o template do Vite pode mudar com o tempo. Se aparecerem ficheiros extra como `src/assets/hero.png`, `src/assets/react.svg` ou `src/assets/vite.svg`, podes apagar a pasta `src/assets/` inteira nesta ficha, porque não vamos usar imagens. Ficheiros dentro de `public/` podem ficar; não afetam a app se não forem importados.

Cria a estrutura:

```bash
mkdir -p src/services src/styles
```

No fim, o frontend deve ficar assim:

```txt
frontend/
  package.json
  src/
    App.jsx
    main.jsx
    services/
      tarefasApi.js
    styles/
      index.css
```

---

## 15) Frontend - variável de ambiente

Cria `.env` dentro de `frontend/`:

```env
VITE_API_BASE=http://localhost:3000
```

Cria também `.env.example` dentro de `frontend/`:

```env
VITE_API_BASE=http://localhost:3000
```

> Em Vite, variáveis usadas no frontend têm de começar por `VITE_`.
> O `.env` do frontend não deve guardar segredos. Mesmo assim, manter `.env.example` ajuda outra pessoa a saber que variável precisa de criar.

**Checkpoint**

- O `.env` do frontend não tem segredos.
- O `.env.example` existe e mostra a variável necessária.
- A variável aponta para o backend.

---

## 16) Frontend - serviço de API

Cria `src/services/tarefasApi.js`:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

/**
 * Lê a resposta HTTP e lança um erro quando o status não indica sucesso.
 *
 * O fetch só rejeita automaticamente em falhas de rede.
 * Por isso, respostas como 400, 404 ou 422 precisam de validação manual com response.ok.
 *
 * @param {Response} response - Resposta devolvida pelo fetch.
 * @returns {Promise<any>} Corpo JSON da resposta.
 * @throws {Error} Lança erro com mensagem vinda da API ou mensagem genérica.
 */
async function parseJsonOrThrow(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.error?.message || "Pedido falhou";
        throw new Error(message);
    }

    return data;
}

/**
 * Vai buscar a lista de tarefas ao backend.
 *
 * @returns {Promise<Array<{_id:string, titulo:string, feito:boolean}>>} Lista de tarefas.
 */
export async function getTarefas() {
    const response = await fetch(`${API_BASE_URL}/api/tarefas`);
    return await parseJsonOrThrow(response);
}

/**
 * Envia uma nova tarefa para o backend.
 *
 * @param {{titulo:string}} input - Dados necessários para criar a tarefa.
 * @returns {Promise<{_id:string, titulo:string, feito:boolean}>} Tarefa criada pela API.
 */
export async function createTarefa(input) {
    const response = await fetch(`${API_BASE_URL}/api/tarefas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    return await parseJsonOrThrow(response);
}
```

**Checkpoint**

- O `fetch` usa `VITE_API_BASE`.
- O serviço tem uma função para `GET`.
- O serviço tem uma função para `POST`.
- O componente React não vai escrever URLs à mão.

---

## 17) Frontend - App com `useState` e `useEffect`

Substitui `src/App.jsx` por:

```jsx
import { useEffect, useState } from "react";
import { createTarefa, getTarefas } from "./services/tarefasApi.js";
import "./styles/index.css";

/**
 * Página principal da app Task Tracker Fullstack.
 *
 * Responsabilidades:
 * - carregar tarefas do backend quando a app abre;
 * - guardar tarefas no estado React;
 * - controlar o input do formulário;
 * - enviar novas tarefas para a API;
 * - mostrar loading, erro e lista de tarefas.
 *
 * @returns {JSX.Element} Interface principal da aplicação.
 */
function App() {
    const [tarefas, setTarefas] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [status, setStatus] = useState("loading");
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ignorar = false;

        /**
         * Carrega tarefas a partir do backend.
         *
         * Esta função fica dentro do useEffect porque só deve correr quando
         * o componente aparece no ecrã. O React não permite tornar diretamente
         * a função do useEffect em async.
         *
         * @returns {Promise<void>}
         */
        async function carregarTarefas() {
            try {
                setStatus("loading");
                setErro("");

                const dados = await getTarefas();

                if (!ignorar) {
                    setTarefas(dados);
                    setStatus("success");
                }
            } catch (error) {
                if (!ignorar) {
                    setErro(
                        error instanceof Error
                            ? error.message
                            : "Falha ao carregar tarefas"
                    );
                    setStatus("error");
                }
            }
        }

        carregarTarefas();

        return () => {
            ignorar = true;
        };
    }, []);

    /**
     * Trata o submit do formulário de criação.
     *
     * Primeiro valida o texto no frontend para dar feedback rápido.
     * Depois envia para o backend, que faz a validação final.
     *
     * @param {React.FormEvent<HTMLFormElement>} event - Evento de submit do formulário.
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();

        const tituloLimpo = titulo.trim();

        if (!tituloLimpo) {
            setErro("Escreve um título antes de criar a tarefa.");
            setStatus("error");
            return;
        }

        try {
            setErro("");

            const novaTarefa = await createTarefa({ titulo: tituloLimpo });

            setTarefas((tarefasAtuais) => [novaTarefa, ...tarefasAtuais]);
            setTitulo("");
            setStatus("success");
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Falha ao criar tarefa"
            );
            setStatus("error");
        }
    }

    return (
        <main className="app-shell">
            <section className="app-header">
                <p className="eyebrow">React + Express + MongoDB</p>
                <h1>Task Tracker Fullstack</h1>
                <p>Cria tarefas no React e guarda-as no MongoDB Atlas.</p>
            </section>

            <form className="task-form" onSubmit={handleSubmit}>
                <label htmlFor="titulo">Nova tarefa</label>
                <div className="form-row">
                    <input
                        id="titulo"
                        type="text"
                        placeholder="Ex.: Rever useEffect"
                        value={titulo}
                        onChange={(event) => setTitulo(event.target.value)}
                    />
                    <button type="submit">Criar</button>
                </div>
            </form>

            {status === "loading" && <p className="info">A carregar...</p>}

            {status === "error" && erro && (
                <p className="error" role="alert">
                    {erro}
                </p>
            )}

            {status !== "loading" && tarefas.length === 0 && (
                <p className="info">Ainda não existem tarefas.</p>
            )}

            {tarefas.length > 0 && (
                <ul className="task-list">
                    {tarefas.map((tarefa) => (
                        <li key={tarefa._id} className="task-card">
                            <span>{tarefa.titulo}</span>
                            <small>
                                {tarefa.feito ? "Concluída" : "Por fazer"}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

export default App;
```

**Checkpoint E/F**

- A app carrega tarefas quando abre.
- O input é controlado por `useState`.
- O submit faz `POST`.
- A lista atualiza sem refresh.

---

## 18) Frontend - estilos simples

Cria `src/styles/index.css` com:

```css
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background: #f4f7f6;
    color: #17201c;
    font-family:
        Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        sans-serif;
}

button,
input {
    font: inherit;
}

.app-shell {
    width: min(760px, calc(100% - 32px));
    margin: 0 auto;
    padding: 48px 0;
}

.app-header {
    margin-bottom: 28px;
}

.eyebrow {
    margin: 0 0 8px;
    color: #48695d;
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
}

h1 {
    margin: 0 0 8px;
    font-size: 2.2rem;
}

.app-header p:last-child {
    margin: 0;
    color: #52635d;
}

.task-form {
    display: grid;
    gap: 8px;
    margin-bottom: 20px;
}

.task-form label {
    font-weight: 700;
}

.form-row {
    display: flex;
    gap: 8px;
}

.form-row input {
    flex: 1;
    min-width: 0;
    border: 1px solid #c8d7d1;
    border-radius: 8px;
    padding: 12px 14px;
}

.form-row button {
    border: 0;
    border-radius: 8px;
    background: #1c6b4f;
    color: white;
    cursor: pointer;
    font-weight: 700;
    padding: 12px 18px;
}

.info,
.error {
    border-radius: 8px;
    margin: 16px 0;
    padding: 12px 14px;
}

.info {
    background: #e8f1ee;
    color: #35554a;
}

.error {
    background: #fdeaea;
    color: #8a1f1f;
}

.task-list {
    display: grid;
    gap: 10px;
    list-style: none;
    margin: 20px 0 0;
    padding: 0;
}

.task-card {
    align-items: center;
    background: white;
    border: 1px solid #dbe6e2;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    padding: 14px 16px;
}

.task-card small {
    color: #64766f;
}

@media (max-width: 520px) {
    .form-row {
        flex-direction: column;
    }

    .form-row button {
        width: 100%;
    }
}
```

Corre o frontend:

```bash
npm run dev
```

Abre:

```txt
http://localhost:5173
```

**Checkpoint final da versão base**

- Backend a correr em `http://localhost:3000`.
- Frontend a correr em `http://localhost:5173`.
- React mostra tarefas vindas do MongoDB.
- Criar tarefa no React grava no MongoDB Atlas.
- Recarregar a página mantém as tarefas.

---

## 19) Debug guiado

### Problema: `Failed to fetch`

Verifica:

- O backend está ligado?
- O URL do frontend está correto?
- `VITE_API_BASE=http://localhost:3000`
- Reiniciaste o Vite depois de criar o `.env`?

### Problema: erro de CORS

Verifica no backend:

```env
CORS_ORIGIN=http://localhost:5173
```

Verifica também se o `app.js` usa:

```js
cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
});
```

### Problema: MongoDB não liga

Verifica:

- o `MONGODB_URI` já não tem `UTILIZADOR`, `PASSWORD` ou `xxxxx`;
- utilizador e password no Atlas;
- IP autorizado em Network Access;
- base de dados no fim do `MONGODB_URI`;
- `.env` está dentro de `backend/`;
- o backend foi reiniciado depois de alterar `.env`.

### Problema: `POST` devolve 422

Isto significa que o backend recebeu um título vazio ou inválido.

Verifica:

- o input tem texto;
- o frontend envia `{ titulo: "..." }`;
- o header é `"Content-Type": "application/json"`;
- o body usa `JSON.stringify(input)`.

---

## 20) Desafio final - PATCH para concluir tarefa

Agora que `GET` e `POST` funcionam, implementa:

```txt
PATCH /api/tarefas/:id
```

Objetivo:

- clicar numa tarefa no React;
- alternar `feito` entre `true` e `false`;
- guardar a alteração no MongoDB;
- atualizar a UI sem refresh.

### Contrato sugerido

```txt
PATCH /api/tarefas/:id
Body:
{ "feito": true }

Resposta 200:
{ "_id": "...", "titulo": "Estudar React", "feito": true }
```

### Pistas para o backend

No router:

```js
router.patch("/:id", atualizarTarefa);
```

No controller, vais precisar de:

```js
Tarefa.findByIdAndUpdate(id, dados, {
    new: true,
    runValidators: true,
});
```

Também deves validar:

- `id` inválido;
- tarefa inexistente;
- `feito` que não seja boolean.

### Pistas para o frontend

No serviço:

```js
export async function updateTarefa(id, input) {
    // fazer fetch com method PATCH
}
```

No `App.jsx`:

```js
async function handleToggle(tarefa) {
    // enviar o valor contrário de tarefa.feito
    // substituir a tarefa antiga pela tarefa atualizada
}
```

Critério de aceitação:

- ao clicar numa tarefa, o estado visual muda;
- ao recarregar a página, a alteração continua guardada;
- erros aparecem na UI.

---

## 21) Entrega

A versão base está completa quando:

1. O backend tem `GET /api/tarefas`.
2. O backend tem `POST /api/tarefas`.
3. O backend valida título vazio com `422`.
4. O backend guarda dados no MongoDB Atlas.
5. O React carrega tarefas com `useEffect`.
6. O React cria tarefas com formulário controlado.
7. A lista atualiza sem recarregar a página.
8. O `.env` não está no Git.

### Perguntas de revisão

1. Porque é que o React não usa diretamente o `MONGODB_URI`?
2. Qual é a diferença entre `useEffect` e `onSubmit` nesta ficha?
3. Para que serve o middleware `validateTitulo`?
4. Porque é que o controller usa `try/catch`?
5. O que acontece no frontend quando `response.ok` é `false`?
6. Porque é que atualizamos o estado com `[novaTarefa, ...tarefasAtuais]`?

---

## Changelog

- 2026-05-19: adicionados `.env.example`, notas sobre placeholders do Atlas, diagnóstico de `/api/health` e limpeza mais explícita do template Vite.
- 2026-05-18: criação da ficha inicial com integração React, Express, Mongoose e MongoDB Atlas usando apenas `GET` e `POST`; `PATCH` definido como desafio final.

![Footer](../Images/Footer.png)
