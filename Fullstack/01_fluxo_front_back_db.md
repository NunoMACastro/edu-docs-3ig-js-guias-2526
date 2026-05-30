![Header](../Images/Header.png)

# Fullstack (12.º Ano) - 01 · Fluxo React → Express → MongoDB

> **Objetivo deste ficheiro**
> Ver o ciclo completo de um pedido fullstack.
> Entender onde vive cada parte (React, Node, MongoDB).
> Usar o mesmo domínio de tarefas com contrato consistente.

---

## Índice

-   [0. Enquadramento do material](#sec-0)
-   [1. [ESSENCIAL] O fluxo completo (request → response)](#sec-1)
-   [2. [ESSENCIAL] Onde vive cada parte](#sec-2)
-   [3. [ESSENCIAL] Contrato base de tarefas](#sec-3)
-   [4. [ESSENCIAL] Fluxo de dados no React](#sec-4)
-   [5. [EXTRA] Pontes para auth/upload/paginacao](#sec-5)
-   [Exercícios - Fluxo fullstack](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Enquadramento do material

Esta secção situa o ficheiro dentro do percurso fullstack e destaca a ligação entre frontend, backend e base de dados.

- **Núcleo do tema:** as secções [ESSENCIAL] apresentam o fluxo principal e os contratos que mantêm as partes alinhadas.
- **Aprofundamento:** as secções [EXTRA] acrescentam contexto para cenários mais completos ou próximas evoluções.
- **Ligação ao percurso:** os exemplos e exercícios articulam conteúdos de React, Node/Express e MongoDB.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O fluxo completo (request → response)

### Modelo mental

1. **React (frontend)** faz um pedido HTTP (`fetch`).
2. **Express (backend)** recebe, valida e decide a resposta.
3. **MongoDB** guarda ou devolve dados.
4. **Express** devolve JSON.
5. **React** atualiza o estado e mostra na UI.

### Diagrama simples

```
React UI -> fetch -> Express -> MongoDB
React UI <- JSON  <- Express <- MongoDB
```

### Checkpoint

-   Onde acontece a validação final?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Onde vive cada parte

### Backend (Node/Express)

-   **Rotas** recebem o pedido (`/api/tarefas`).
-   **Controllers** validam e escolhem status codes.
-   **DB** (Mongo/Mongoose) guarda e devolve dados.

### Frontend (React)

-   **Serviços** fazem `fetch`.
-   **Componentes** mostram `loading/erro/dados`.

### Checkpoint

-   Em que ficheiro fica o `fetch` no React?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Contrato base de tarefas

### Formato de erro (padrão)

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

### Exemplo de contrato

```text
GET /api/tarefas
200 OK
{
  "items": [ { "_id": "...", "titulo": "Estudar Mongo", "feito": false } ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

```text
POST /api/tarefas
Body: { "titulo": "Rever React" }

201 Created
{ "_id": "...", "titulo": "Rever React", "feito": false }
```

### Erros comuns

-   Backend devolver um formato diferente do que o frontend espera.
-   Usar 200 em erros de validação.

### Boas práticas

-   Mantém o mesmo formato de erro em todas as rotas.
-   Usa status codes coerentes (200/201/400/404/409/422).

### Checkpoint

-   Porque é que o contrato facilita o frontend?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Fluxo de dados no React

### Modelo mental

-   **Dados descem** (props).
-   **Ações sobem** (callbacks).
-   **Estado sobe** quando vários componentes precisam do mesmo dado.

### Exemplo curto

```jsx
function App() {
    const [tarefas, setTarefas] = useState([]);
    return <ListaTarefas tarefas={tarefas} onAdd={(t) => setTarefas((p) => [...p, t])} />;
}
```

### Checkpoint

-   Quando é que faz sentido “levantar estado”?

<a id="sec-5"></a>

## 5. [EXTRA] Pontes para auth/upload/paginação

-   **Auth:** vê `../React/14_autenticacao_em_spa_jwt_sessions_cookies.md`.
-   **Upload:** vê `../React/15_upload_paginacao_filtros_e_cliente_api.md`.
-   **Paginação/Filtros:** vê `../MongoDB/07_queries_e_indexacao.md`.

<a id="exercicios"></a>

## Exercícios - Fluxo fullstack

1. **GET /api/tarefas no backend e lista no React**
   Passos:
   - Implementa o GET no backend com o envelope `{ items, page, limit, total }`.
   - No React, faz fetch e mostra os `items`.
   Critério de aceitação:
   - A UI mostra a lista e o response inclui `page`, `limit`, `total`.
   Dica de debugging:
   - Abre DevTools → Network e confirma status + JSON.

2. **POST /api/tarefas e atualizar lista sem recarregar**
   Passos:
   - Faz POST com `titulo` válido.
   - Atualiza o estado local com o item criado.
   Critério de aceitação:
   - A nova tarefa aparece sem refresh.
   Dica de debugging:
   - Verifica se o `setTarefas` usa cópia (`...prev`).

3. **POST inválido → 422 → mostrar erro no frontend**
   Passos:
   - Envia `POST /api/tarefas` com `titulo` vazio.
   - Backend responde `422` com JSON de erro.
   - Frontend mostra a mensagem ao utilizador.
   Critério de aceitação:
   - Status `422` e mensagem visível na UI.
   Dica de debugging:
   - Confirma o `res.ok` e a leitura do JSON de erro.

<a id="changelog"></a>

## Changelog

-   2026-01-14: criação do ficheiro com o fluxo fullstack base.
-   2026-01-14: contrato GET com envelope, links corrigidos e exercícios guiados.

![Footer](../Images/Footer.png)
