import React from "react"

interface CodeOutputProps {
    output: string;
    backgroundColor?: string;
    foregroundColor?: string;
}

const CodeOutput: React.FC<CodeOutputProps> = (props: CodeOutputProps) => {
    const ref = React.useRef<HTMLPreElement>(null);

    const [followScroll, setFollowScroll] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (ref.current && followScroll) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [ref, followScroll, props.output]);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.style.backgroundColor = props.backgroundColor as string;
            ref.current.style.color = props.foregroundColor as string;
        }
    }, [props.backgroundColor, props.foregroundColor])

    return (
        <pre 
            ref={ref} 
            className={`h-full overflow-y-scroll overflow-x whitespace-pre-wrap bg-neutral-950 text-gray-50 font-mono px-2 py-1 text-[16px]`}
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
