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
    isSaved?: boolean;
    running?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps>  = (props: EditorHeaderProps) => {
    return (
        <div className="grid grid-cols-2 grid-rows-1 bg-neutral-800 p-3 border-b-neutral-950 border-b-4">
            <div className="flex flex-row w-full">
                <h1 className="font-bold text-gray-100 text-xl overflow-hidden whitespace-nowrap overflow-ellipsis">
                    { props.scratch.title }
                </h1>

                {
                    !props.isSaved &&
                    <p className="ml-1 mb-[1px] italic text-gray-400 text-sm self-end">
                        (unsaved)
                    </p>
                }

{
                    !props.running ?
                    <button 
                        onClick={() => {
                            props.executeCode();
                        }}
                        className="justify-self-end mx-2 px-2 border-green-200 border-2 rounded bg-green-50 font-bold hover:bg-green-100"
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
            </div>
        </div>
    )
};

export { EditorHeader };