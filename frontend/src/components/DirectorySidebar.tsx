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
}

type SortMode = 'language' | 'title' | 'date';
type SortDirection = 'ascending' | 'descending';

const DirectorySidebar: React.FC<ScratchDirectoryProps> = (props: ScratchDirectoryProps) => {
    const theme = useTheme();
    const user = useUser();

    React.useEffect(() => {
        console.log(user.data);
    }, [user.data]);

    const [width, setWidth] = React.useState<number>(250);
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
            setWidth(Math.min(ev.clientX, 900));
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
                return "↑";
            }
            else {
                return "↓";
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
                {
                    user.data ?
                    <p>
                        {user.data.email}
                    </p>
                    :
                    <button onClick={() => {
                        modal.signIn.show();
                    }}>
                        Sign In
                    </button>
                }
                {
                    user.data && 
                    <table>
                        <tr>
                            <th className="cursor-pointer mx-2" onClick={handleSortChange("language")}>
                                Lang. {getSortIndicator("language")}
                            </th>
                            <th className="cursor-pointer mx-2" onClick={handleSortChange("title")}>
                                Title {getSortIndicator("title")}
                            </th>
                            <th className="cursor-pointer mx-2" onClick={handleSortChange("date")}>
                                Date {getSortIndicator("date")}
                            </th>
                        </tr>
                        {
                            scratches.map((scratch, i) => 
                                <tr key={i} className="cursor-pointer text-white overflow-hidden text-nowrap whitespace-nowrap"
                                    onClick={() => {
                                        props.setScratch(scratch);
                                    }}>
                                    <td>
                                        <LanguageLogo language={scratch.language} className='block mx-auto w-4' />
                                    </td>
                                    <td>
                                        {scratch.title}
                                    </td>
                                    <td>
                                        {formatDateForDirectory(scratch.updatedAt)}
                                    </td>
                                </tr>
                            )
                        }
                    </table>
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