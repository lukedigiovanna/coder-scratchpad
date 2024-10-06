import React from "react";

interface ModalProps {
    visible: boolean;
    className?: string;
};

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({ visible, children, className }) => {
    return (
        <div className={`${!visible ? "hidden" : ""} absolute left-0 top-0 w-[100vw] h-[100vh] z-10`}>
            <div className="bg-black opacity-50 w-full h-full absolute z-10">
            </div>
            <div className={`z-50 block mx-auto max-w-xl h-[50%] rounded bg-blue-500 ${className ? className : ""}`}>
                { children }
            </div>
        </div>
    )
};

export { Modal };