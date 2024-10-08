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
import { LanguageLogo } from "./LanguageLogo";
import { updateScratch } from "../constants/supabaseClient";
import { useUser } from "./UserProvider";

interface EditorHeaderProps {
    scratch: Scratch;
    executeCode: () => void;
    isSaved?: boolean;
    running?: boolean;
}

const EditorHeader: React.FC<EditorHeaderProps>  = (props: EditorHeaderProps) => {
    const theme = useTheme();
    const user = useUser();
    
    const [scratchTitle, setScratchTitle] = React.useState<string>("");

    React.useEffect(() => {
        setScratchTitle(props.scratch.title);
    }, [props.scratch]);

    return (
        <div className="grid grid-cols-2 grid-rows-1 pl-3 py-3 bg-neutral-800"
             style={{
                backgroundColor: chroma(theme.data.colors["editor.background"]).brighten(0.4).hex(),
                color: theme.data.colors["editor.foreground"]
             }}>
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center w-full">
                    <LanguageLogo language={props.scratch.language} className="w-6 mr-2" />
                    <input className={`font-mono font-bold text-xl overflow-hidden whitespace-nowrap overflow-ellipsis bg-transparent w-full outline-none`} 
                           value={scratchTitle}
                           style={{
                            width: (scratchTitle.length) + "ch"
                           }}
                           spellCheck={false}
                           onChange={e => {
                            setScratchTitle(e.target.value);
                           }} 
                           onBlur={() => {
                            if (scratchTitle.length === 0) {
                                setScratchTitle(props.scratch.title);
                            }
                            else if (scratchTitle !== props.scratch.title) {
                                props.scratch.title = scratchTitle;
                                updateScratch(props.scratch).then(scratch => {
                                    user.updateScratch(scratch);
                                }).catch((e) => {
                                    console.log(e);
                                });
                            }
                           }}
                           />
                        
                        {
                            !props.isSaved &&
                            <p className="ml-1">
                                *
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
                        className="rounded bg-transparent font-bold outline-none mr-4"
                        onChange={(e) => {
                            theme.setTheme(e.currentTarget.value as ThemeName);
                        }}>
                        {
                            themeNames.map((name) => {
                                return <option value={name} key={name} className="text-neutral-900 bg-gray-100">
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