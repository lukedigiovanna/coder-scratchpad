import React from "react";

import { getTheme, ThemeName } from "../themes";
import { editor } from "monaco-editor";

interface ThemeContextProps {
    name: ThemeName;
    data: editor.IStandaloneThemeData;
    setTheme: (name: ThemeName) => void;
};

const ThemeContext = React.createContext<ThemeContextProps | undefined>(undefined);

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [themeName, setThemeState] = React.useState<ThemeName>("GithubDark"); 
    const theme = React.useMemo<editor.IStandaloneThemeData>(() => getTheme(themeName), [themeName]);

    const setTheme = (theme: ThemeName) => {
        setThemeState(theme);
        localStorage.setItem("csp_theme", theme);
    }

    React.useEffect(() => {
        const ls = localStorage.getItem("csp_theme");
        if (ls !== null) {
            setTheme(ls as ThemeName);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{name: themeName, data: theme, setTheme}}>
            { children }
        </ThemeContext.Provider>
    )
}

function useTheme(): ThemeContextProps {
    const context = React.useContext(ThemeContext);

    if (!context) {
        throw Error("useTheme must be used inside a ThemeProvider");
    }

    return context;
}

export { ThemeProvider, useTheme };