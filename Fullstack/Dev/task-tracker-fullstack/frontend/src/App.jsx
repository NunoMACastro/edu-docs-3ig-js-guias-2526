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
