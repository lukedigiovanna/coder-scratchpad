// The EditorHeader is a horizontal bar that contains information and
// UI tools for executing the working file: 
//  * The name of the script
//  * The date/time of creation
//  * Last saved time
//  * Buttons to run/stop

import React from "react";
import { Scratch } from "../constants/models";
import { ThemeName, themeNames } from "../themes";
import { useTheme } from "./ThemeProvider";
import chroma from "chroma-js";

interface EditorHeaderProps {
    scratch: Scratch;
    executeCode: () => void;
    isSaved?: boolean;
    running?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps>  = (props: EditorHeaderProps) => {
    const theme = useTheme();
    
    return (
        <div className="grid grid-cols-2 grid-rows-1 pl-3 py-3 bg-neutral-800"
             style={{
                backgroundColor: chroma(theme.data.colors["editor.background"]).brighten(0.4).hex()
             }}>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center">
                    <h1 className="font-bold text-gray-100 text-xl overflow-hidden whitespace-nowrap overflow-ellipsis">
                        { props.scratch.title }
                    </h1>

                    {
                        !props.isSaved &&
                        <p className="ml-1 mt-1 italic text-gray-400 text-sm">
                            (unsaved)
                        </p>
                    }
                </div>

                <div className="mr-2">
                    {
                        !props.running ?
                        <button 
                            onClick={() => {
                                props.executeCode();
                            }}
                            className="text-sm font-bold text-gray-100 rounded-sm px-4 py-2 m-0 bg-blue-600 hover:bg-blue-800 active:bg-blue-500 transition-colors"
                        >
                            Run
                        </button>
                        :
                        <button
                            className="text-sm font-bold text-gray-100 rounded-sm px-4 py-2 m-0 bg-red-600 hover:bg-red-800 active:bg-red-500 transition-colors"
                        >
                            Stop
                        </button>
                    }
                </div>
            </div>

            <div className="flex flex-row items-center justify-end">
                <div>
                    <select 
                        className="rounded bg-transparent font-bold text-gray-100 outline-none mr-4"
                        onChange={(e) => {
                            theme.setTheme(e.currentTarget.value as ThemeName);
                        }}>
                        {
                            themeNames.map((name) => {
                                return <option value={name} key={name}>
                                    {name}
                                </option>
                            })
                        }
                    </select>
                </div>
            </div>
        </div>
    )
};

export { EditorHeader };