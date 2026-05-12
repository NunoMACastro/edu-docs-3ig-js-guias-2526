import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const GameSettingsContext = createContext(null);

/**
 * Provider responsável pelas preferências globais do jogo.
 * @param {object} props - Props do componente.
 * @param {React.ReactNode} props.children - Componentes que recebem o contexto.
 * @returns {JSX.Element} Provider com o estado global da ficha.
 */
export function GameSettingsProvider({ children }) {
    const [playerName, setPlayerName] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [theme, setTheme] = useState("light");

    const toggleTheme = useCallback(() => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light",
        );
    }, []);

    const value = useMemo(() => {
        return {
            playerName,
            setPlayerName,
            difficulty,
            setDifficulty,
            theme,
            toggleTheme,
        };
    }, [playerName, difficulty, theme, toggleTheme]);

    return (
        <GameSettingsContext.Provider value={value}>
            {children}
        </GameSettingsContext.Provider>
    );
}

/**
 * Hook para aceder às preferências globais do Quiz Battle.
 * @returns {object} Estado e ações guardadas no contexto.
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
