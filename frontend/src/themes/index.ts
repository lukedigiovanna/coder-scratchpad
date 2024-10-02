import { editor } from "monaco-editor";
import { Monaco } from "@monaco-editor/react";

import BlackboardData from "./Blackboard.json";
import SpaceCadetData from "./SpaceCadet.json";
import BirdsOfParadiseData from "./BirdsOfParadise.json";
import GithubDarkData from "./GithubDark.json";
import GithubLightData from "./GithubLight.json";

// const DarkPlus = DarkPlusData as editor.IStandaloneThemeData;
const Blackboard = BlackboardData as editor.IStandaloneThemeData;
const SpaceCadet = SpaceCadetData as editor.IStandaloneThemeData;
const BirdsOfParadise = BirdsOfParadiseData as editor.IStandaloneThemeData;
const GithubDark = GithubDarkData as editor.IStandaloneThemeData;
const GithubLight = GithubLightData as editor.IStandaloneThemeData;

const themes = {
    "GithubDark": GithubDark,
    "GithubLight": GithubLight,
    "Blackboard": Blackboard,
    "SpaceCadet": SpaceCadet,
    "BirdsOfParadise": BirdsOfParadise,
} as const;

type ThemeName = keyof typeof themes;

const themeNames = Object.keys(themes) as ThemeName[];

function defineThemes(monaco: Monaco): void {
    for (const themeName of themeNames) {
        monaco.editor.defineTheme(themeName, themes[themeName] as editor.IStandaloneThemeData);        
    }
}

function getTheme(themeName: ThemeName): editor.IStandaloneThemeData {
    return themes[themeName];
}

export { defineThemes, getTheme };
export { themeNames };
export type { ThemeName };
