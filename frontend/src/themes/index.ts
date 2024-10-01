import { editor } from "monaco-editor";

import BlackboardData from "./Blackboard.json";
import SpaceCadetData from "./SpaceCadet.json";
import { Monaco } from "@monaco-editor/react";

const Blackboard = BlackboardData as editor.IStandaloneThemeData;
const SpaceCadet = SpaceCadetData as editor.IStandaloneThemeData;

interface ThemeData {
    name: string;
    data?: editor.IStandaloneThemeData;
}

const themes = [
    {
        name: "vs-dark",
        data: undefined,
    },
    {
        name: "vs-light",
        data: undefined,
    },
    {
        name: "Blackboard",
        data: Blackboard
    },
    {
        name: "SpaceCadet",
        data: SpaceCadet,
    },
] as const;

type Theme = typeof themes[number]['name'];

const defineThemes = (monaco: Monaco) => {
    for (const { name, data } of themes) {
        if (data) {
            monaco.editor.defineTheme(name, data);        
        }
    }
}

export { defineThemes };
export { themes };
export type { Theme };
