// The EditorHeader is a horizontal bar that contains information and
// UI tools for executing the working file: 
//  * The name of the script
//  * The date/time of creation
//  * Last saved time
//  * Buttons to run/stop

import React from "react";
import { Scratch } from "../constants/models";
import { ThemeName, themeNames } from "../themes";

interface EditorHeaderProps {
    scratch: Scratch;
    executeCode: () => void;
    setTheme: (themeName: ThemeName) => void;
    running?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps>  = (props: EditorHeaderProps) => {
    return (
        <div className="flex flex-row bg-neutral-800 p-3 border-b-neutral-950 border-b-4">
            <h1 className="font-bold text-gray-100 text-xl">
                { props.scratch.title }
            </h1>

            <div className="flex flex-row">
                <select onChange={(e) => {
                    props.setTheme(e.currentTarget.value as ThemeName);
                }}>
                    {
                        themeNames.map((name) => {
                            return <option value={name}>
                                {name}
                            </option>
                        })
                    }
                </select>
                {
                    !props.running ?
                    <button 
                        onClick={() => {
                            props.executeCode();
                        }}
                        className="mx-2 px-2 border-green-200 border-2 rounded bg-green-50 font-bold hover:bg-green-100"
                    >
                        Run
                    </button>
                    :
                    <button
                        className="mx-2 px-2 border-red-200 border-2 rounded bg-red-50 font-bold hover:bg-red-100"
                    >
                        Stop
                    </button>
                }
            </div>
        </div>
    )
};

export { EditorHeader };