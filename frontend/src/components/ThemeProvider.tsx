import React from "react";

import { getTheme, ThemeName } from "../themes";
import { editor } from "monaco-editor";

interface ThemeContextProps {
    name: ThemeName;
    data: editor.IStandaloneThemeData;
    setTheme: (name: ThemeName) => void;
};

const ThemeContext = React.createContext<ThemeContextProps>({
    name: "GithubDark",
    data: getTheme("GithubDark"),
    setTheme: (_) => {},
});

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [themeName, setTheme] = React.useState<ThemeName>("GithubDark"); 
    const theme = React.useMemo<editor.IStandaloneThemeData>(() => getTheme(themeName), [themeName]);

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