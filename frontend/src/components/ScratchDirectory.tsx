import React from "react"

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

const ScratchDirectory: React.FC<ScratchDirectoryProps> = (props: ScratchDirectoryProps) => {
    return (
        <div className="w-full overflow-hidden p-3">
            {
                testData.map(title => 
                    <p className="cursor-pointer text-white overflow-hidden text-nowrap whitespace-nowrap">
                        {title}
                    </p>
                )
            }
        </div>
    )
};

export { ScratchDirectory };