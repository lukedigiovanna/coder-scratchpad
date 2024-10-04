import React from "react"
import { useTheme } from "./ThemeProvider";
import chroma from "chroma-js";

interface ScratchDirectoryProps {

}

const testData = [
    "API",
    "Latch",
    "BirdsOfParadise",
    "Square algorithm",
    "RSA implementation",
    "dates in TS",
    "python variables",
    "C++ class ownership",
    "idk?"
]

const DirectorySidebar: React.FC<ScratchDirectoryProps> = (props: ScratchDirectoryProps) => {
    const theme = useTheme();

    const [width, setWidth] = React.useState<number>(250);
    const backgroundColor = React.useMemo(() => chroma(theme.data.colors["editor.background"]).darken(0.4).hex(), [theme]);
    const foregroundColor = React.useMemo(() => theme.data.colors["editor.foreground"], [theme]);

    const [dragging, setDragging] = React.useState<boolean>(false);

    const handleMouseUp = React.useMemo(() => () => {
        setDragging(false);
    }, []);

    const handleMouseMove = React.useMemo(() => (ev: MouseEvent) => {
        setWidth(Math.min(ev.clientX, 400));
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
                    testData.map(title => 
                        <p key={title} className="cursor-pointer text-white overflow-hidden text-nowrap whitespace-nowrap">
                            {title}
                        </p>
                    )
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