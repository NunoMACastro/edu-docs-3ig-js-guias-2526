# MongoDB (12.º Ano) - 01 · Introdução e setup Atlas

> **Objetivo deste ficheiro**
> Perceber o que é MongoDB no contexto do curso.
> Criar uma base no Atlas e ligar um projeto Node com `MONGODB_URI`.
> Validar ligação e preparar o terreno para CRUD e modelação.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] MongoDB no ecossistema do curso](#sec-1)
- [2. [ESSENCIAL] Criar cluster, utilizador e network access](#sec-2)
- [3. [ESSENCIAL] String de ligação e variáveis de ambiente](#sec-3)
- [4. [ESSENCIAL] Ligação no Node (teste mínimo)](#sec-4)
- [5. [EXTRA] Troubleshooting rápido](#sec-5)
- [Exercícios - Setup Atlas](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** garante ligação estável antes de avançar.
- **Como estudar:** cria um mini projeto Node e testa ligação real.
- **Ligações úteis:**
  - Node: `../Node/00_setup_projeto.md`
  - Fullstack: `../Fullstack/03_setup_fullstack.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] MongoDB no ecossistema do curso

MongoDB é a base de dados documental usada no percurso Fullstack.

- Em **Node**, vais guardar e ler dados da API.
- Em **React**, vais consumir esses dados.
- Em **Fullstack**, vais manter contrato estável `{ items, page, limit, total }`.

### Modelo mental

- Coleção = “tabela” no mundo SQL.
- Documento = “linha”, mas em JSON/BSON.
- Campo pode conter objetos/arrays embutidos.

<a id="sec-2"></a>

## 2. [ESSENCIAL] Criar cluster, utilizador e network access

### Passos Atlas (resumo)

1. Criar conta e cluster gratuito.
2. Criar utilizador de BD (`dbUser`) com password forte.
3. Em `Network Access`, permitir o teu IP (ou `0.0.0.0/0` apenas para aula/dev).
4. Abrir `Database` e copiar string de ligação (`Drivers > Node.js`).

> **Boa prática didática:** em aulas presenciais, começar por IP aberto temporário para reduzir fricção e depois fechar para IP específico.

<a id="sec-3"></a>

## 3. [ESSENCIAL] String de ligação e variáveis de ambiente

### `.env` (backend)

```env
MONGODB_URI=mongodb+srv://dbUser:password@cluster0.xxxxx.mongodb.net/escola?retryWrites=true&w=majority
DB_NAME=escola
```

### Regras importantes

- Nunca commitar segredos no Git.
- Escapar caracteres especiais da password quando necessário.
- Usar nomes previsíveis (`MONGODB_URI`, `DB_NAME`).

<a id="sec-4"></a>

## 4. [ESSENCIAL] Ligação no Node (teste mínimo)

### Instalação

```bash
npm i mongodb dotenv
```

### Exemplo (`src/db/connect.js`)

```js
import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Falta MONGODB_URI no .env");

const client = new MongoClient(uri);

export async function connectDb() {
    await client.connect();
    const dbName = process.env.DB_NAME || "escola";
    return client.db(dbName);
}

export async function closeDb() {
    await client.close();
}
```

### Teste rápido (`src/scripts/ping-db.js`)

```js
import { connectDb, closeDb } from "../db/connect.js";

try {
    const db = await connectDb();
    const result = await db.command({ ping: 1 });
    console.log("MongoDB OK:", result);
} catch (err) {
    console.error("Falha de ligação:", err.message);
} finally {
    await closeDb();
}
```

<a id="sec-5"></a>

## 5. [EXTRA] Troubleshooting rápido

- `MongoServerSelectionError`:
  - confirmar `MONGODB_URI`.
  - verificar IP permitido no Atlas.
- `Authentication failed`:
  - validar utilizador/password.
- timeout de rede:
  - confirmar ligação internet/firewall da escola.

<a id="exercicios"></a>

## Exercícios - Setup Atlas

1. **Criar e ligar cluster**
   - Configura Atlas e executa `ping-db.js`.
   - Critério: output inclui `MongoDB OK`.
2. **Variáveis de ambiente corretas**
   - Muda `DB_NAME` para `escola_teste` e repete.
   - Critério: ligação continua funcional.
3. **Diagnóstico guiado**
   - Introduz um erro na password e identifica a mensagem.
   - Critério: explicas causa e correção.

<a id="changelog"></a>

## Changelog

- 2026-04-17: capítulo criado (setup Atlas + ligação mínima Node).
