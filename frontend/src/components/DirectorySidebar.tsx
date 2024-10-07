import React from "react"
import { useTheme } from "./ThemeProvider";
import { useUser } from "./UserProvider";
import chroma from "chroma-js";
import { Scratch } from "../constants/models";
import { formatDateForDirectory } from "../constants/utils";
import { LanguageLogo } from "./LanguageLogo";
import { useModal } from "./ModalProvider";

interface ScratchDirectoryProps {
    setScratch: (scratch: Scratch) => void;
    scratch: Scratch;
}

type SortMode = 'language' | 'title' | 'date';
type SortDirection = 'ascending' | 'descending';

const DirectorySidebar: React.FC<ScratchDirectoryProps> = (props: ScratchDirectoryProps) => {
    const theme = useTheme();
    const user = useUser();

    const [width, setWidth] = React.useState<number>(420);
    const backgroundColor = React.useMemo(() => chroma(theme.data.colors["editor.background"]).darken(0.4).hex(), [theme]);
    const foregroundColor = React.useMemo(() => theme.data.colors["editor.foreground"], [theme]);

    const [dragging, setDragging] = React.useState<boolean>(false);

    const [sortMode, setSortMode] = React.useState<SortMode>('date');
    const [sortDirection, setSortDirection] = React.useState<SortDirection>('descending');

    const modal = useModal();

    const scratches = React.useMemo(() => {
        if (user.data) {
            // Sort scratches according to sort mode/sort direction
            const dir = sortDirection === 'descending' ? -1 : 1;
            const sorted = user.data.scratches.toSorted((a: Scratch, b: Scratch) => {
                let c = 0;
                switch (sortMode) {
                    case 'date':
                        c = a.updatedAt.getTime() - b.updatedAt.getTime();
                        break;
                    case 'language':
                        c = a.title.localeCompare(b.title);
                        break;
                    case 'title':
                        c = a.title.localeCompare(b.title);
                        break;
                }
                return c * dir;
            })
            return sorted;
        }
        else {
            return [];
        }
    }, [sortMode, sortDirection, user.data]);

    const handleMouseUp = React.useMemo(() => () => {
        setDragging(false);
    }, []);

    const handleMouseMove = React.useMemo(() => (ev: MouseEvent) => {
        if (ev.clientX < 15) {
            setWidth(0);
        }
        else {
            setWidth(Math.min(ev.clientX, 420));
        }
    }, []);

    React.useEffect(() => {
        if (dragging) {
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mousemove", handleMouseMove);
            document.body.style.userSelect = "none";
        }
        else {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
            document.body.style.userSelect = "auto";
        }
    }, [dragging, handleMouseMove, handleMouseUp]);

    const handleSortChange = (targetMode: SortMode) => {
        return () => {
            if (sortMode !== targetMode) {
                setSortMode(_ => targetMode);
                setSortDirection(_ => "descending");
            }
            else {
                setSortDirection(old => old === "ascending" ? "descending" : "ascending");
            }
        }
    }

    const getSortIndicator = (mode: SortMode) => {
        if (sortMode === mode) {
            if (sortDirection === "ascending") {
                return "↓";
            }
            else {
                return "↑";
            }
        }
        else {
            return "";
        }
    }

    return (
        <div className={`h-[100vh] flex flex-row box-border`} style={{
            backgroundColor,
            color: foregroundColor,
            width: width + "px",
            minWidth: width + "px",
        }}>
            {/* Directory Content */}
            <div className="w-full overflow-hidden">
                <div className="p-3">
                    {
                        user.data ?
                        <div className="flex flex-col justify-center">
                            <p>
                                Signed in as
                                {" "}
                                <span className="font-bold">
                                    {user.data.email.split("@")[0]}
                                </span>
                                {" "}
                                <button className="text-xs hover:text-red-500 active:text-red-700 transition"
                                    onClick={() => {
                                        user.signOut();
                                    }}>
                                (Sign out)
                            </button>
                            </p>
                        </div>
                        :
                        <button className="block mx-auto text-sm font-bold text-gray-100 rounded-sm px-4 py-2 m-0 bg-blue-600 hover:bg-blue-800 active:bg-blue-500 transition-colors" onClick={() => {
                            modal.signIn.show();
                        }}>
                            Sign In
                        </button>
                    }
                </div>

                <hr className="mx-3 mb-3"/>
                
                {
                    user.data ? 
                    <table>
                        <thead>
                            <tr className="select-none">
                                <th className="cursor-pointer mx-2 min-w-16" onClick={handleSortChange("language")}>
                                    Lang. {getSortIndicator("language")}
                                </th>
                                <th className="cursor-pointer mx-2 max-w-48" onClick={handleSortChange("title")}>
                                    Title {getSortIndicator("title")}
                                </th>
                                <th className="cursor-pointer mx-2 min-w-44" onClick={handleSortChange("date")}>
                                    Date {getSortIndicator("date")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                scratches.map((scratch, i) => 
                                    <tr key={i} className={`cursor-pointer overflow-hidden text-nowrap whitespace-nowrap hover:font-bold ${props.scratch.id && scratch.id === props.scratch.id ? "font-bold" : ""}`}
                                        onClick={() => {
                                            props.setScratch(scratch);
                                        }}>
                                        <td className="min-w-16">
                                            <LanguageLogo language={scratch.language} className='block mx-auto w-4' />
                                        </td>
                                        <td className="max-w-48 overflow-ellipsis overflow-hidden">
                                            {scratch.title}
                                        </td>
                                        <td className="min-w-44">
                                            {formatDateForDirectory(scratch.updatedAt)}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    :
                    <p className="text-center mx-2 mt-4">
                        Sign in/sign up to save your scratches!
                    </p>
                }
            </div>

            {/* Sidebar Handle */}
            <div className="h-full w-4 min-w-4 z-10 cursor-col-resize"
                onMouseDown={(_) => {
                    setDragging(_ => true);
                }}
            >
                
            </div>
        </div>
    )
};

export { DirectorySidebar };