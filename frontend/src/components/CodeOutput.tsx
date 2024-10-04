import React from "react"
import { useTheme } from "./ThemeProvider";

interface CodeOutputProps {
    output: string;
}

const CodeOutput: React.FC<CodeOutputProps> = (props: CodeOutputProps) => {
    const ref = React.useRef<HTMLPreElement>(null);

    const [followScroll, setFollowScroll] = React.useState<boolean>(true);

    const theme = useTheme();

    React.useEffect(() => {
        if (ref.current && followScroll) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [ref, followScroll, props.output]);

    return (
        <pre 
            ref={ref} 
            className={`h-full overflow-y-scroll overflow-x whitespace-pre-wrap bg-neutral-950 text-gray-50 font-mono px-2 py-1 text-[16px]`}
            style={{
                backgroundColor: theme.data.colors["editor.background"] as string,
                color: theme.data.colors["editor.foreground"] as string
            }}
            onScroll={(_) => {
                if (ref.current) {
                    if (ref.current.scrollHeight - ref.current.scrollTop === ref.current.clientHeight) {
                        setFollowScroll((_) => true);
                    }
                    else {
                        setFollowScroll((_) => false);
                    }
                }
            }}
        >
            { props.output }
        </pre>
    );
}

export { CodeOutput };
