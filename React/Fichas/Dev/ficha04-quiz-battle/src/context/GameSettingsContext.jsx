/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const GameSettingsContext = createContext(null);

/**
 * Provider com preferências globais do Quiz Battle.
 * @param {object} props - Props do componente.
 * @param {React.ReactNode} props.children - Componentes filhos.
 * @returns {JSX.Element}
 */
export function GameSettingsProvider({ children }) {
    const [playerName, setPlayerName] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [questionAmount, setQuestionAmount] = useState(5);
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light",
        );
    };

    const value = useMemo(() => {
        return {
            playerName,
            setPlayerName,
            difficulty,
            setDifficulty,
            questionAmount,
            setQuestionAmount,
            theme,
            toggleTheme,
        };
    }, [playerName, difficulty, questionAmount, theme]);

    return (
        <GameSettingsContext.Provider value={value}>
            {children}
        </GameSettingsContext.Provider>
    );
}

/**
 * Hook próprio para ler as preferências globais do jogo.
 * @returns {object} Preferências e funções globais.
 */
export function useGameSettings() {
    const context = useContext(GameSettingsContext);

    if (!context) {
        throw new Error(
            "useGameSettings deve ser usado dentro de GameSettingsProvider.",
        );
    }

    return context;
}
