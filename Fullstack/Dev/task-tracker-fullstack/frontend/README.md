![Header](../../../../Images/Header.png)

# Frontend - Task Tracker Fullstack

Projeto React usado na ficha **Task Tracker Fullstack**. Este frontend comunica com o backend Express e permite observar, de forma simples, o percurso completo entre interface, API e MongoDB.

## O que este projeto permite estudar

- Como carregar dados do backend quando a aplicação abre.
- Como criar uma tarefa através de um formulário React.
- Como guardar loading, erro e dados no estado do componente.
- Como isolar chamadas HTTP num ficheiro de serviços.

## Execução local

Antes de abrir o frontend, confirma que o backend da ficha está a correr.

```bash
npm install
npm run dev
```

## Variável de ambiente

Cria um ficheiro `.env` a partir de `.env.example` quando precisares de alterar o endereço da API.

```text
VITE_API_BASE=http://localhost:3000
```

## Comandos úteis

- `npm run dev`: abre o projeto em modo de desenvolvimento.
- `npm run build`: cria a versão final.
- `npm run lint`: verifica problemas comuns de código.
- `npm run preview`: mostra localmente a versão final.

![Footer](../../../../Images/Footer.png)
