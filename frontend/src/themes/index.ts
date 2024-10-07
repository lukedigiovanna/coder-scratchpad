import { editor } from "monaco-editor";
import { Monaco } from "@monaco-editor/react";

import BlackboardData from "./Blackboard.json";
import SpaceCadetData from "./SpaceCadet.json";
import BirdsOfParadiseData from "./BirdsOfParadise.json";
import GithubDarkData from "./GithubDark.json";
import GithubLightData from "./GithubLight.json";
import Active4DData from "./Active4D.json";
import AmyData from "./Amy.json";
import CobaltData from "./Cobalt.json";
import OceanicNextData from "./OceanicNext.json";
import PastelsOnDarkData from "./PastelsOnDark.json";
import SunburstData from "./Sunburst.json";
import TwilightData from "./Twilight.json";
import XCodeData from "./XCode.json";

// const DarkPlus = DarkPlusData as editor.IStandaloneThemeData;
const Blackboard = BlackboardData as editor.IStandaloneThemeData;
const SpaceCadet = SpaceCadetData as editor.IStandaloneThemeData;
const BirdsOfParadise = BirdsOfParadiseData as editor.IStandaloneThemeData;
const GithubDark = GithubDarkData as editor.IStandaloneThemeData;
const GithubLight = GithubLightData as editor.IStandaloneThemeData;
const Active4D = Active4DData as editor.IStandaloneThemeData;
const Amy = AmyData as editor.IStandaloneThemeData;
const Cobalt = CobaltData as editor.IStandaloneThemeData;
const OceanicNext = OceanicNextData as editor.IStandaloneThemeData;
const PastelsOnDark = PastelsOnDarkData as editor.IStandaloneThemeData;
const Sunburst = SunburstData as editor.IStandaloneThemeData;
const Twilight = TwilightData as editor.IStandaloneThemeData;
const XCode = XCodeData as editor.IStandaloneThemeData;

const themes = {
    "GithubDark": GithubDark,
    "GithubLight": GithubLight,
    "Blackboard": Blackboard,
    "SpaceCadet": SpaceCadet,
    "BirdsOfParadise": BirdsOfParadise,
    "Active4D": Active4D,
    "Amy": Amy,
    "Cobalt": Cobalt,
    "OceanicNext": OceanicNext,
    "PastelsOnDark": PastelsOnDark,
    "Sunburst": Sunburst,
    "Twilight": Twilight,
    "XCode": XCode
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
