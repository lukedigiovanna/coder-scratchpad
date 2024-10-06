import React from "react";
import { useModal } from "./ModalProvider";

interface ModalProps {
    visible: boolean;
    onClose?: () => void;
    className?: string;
};

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({ visible, children, className, onClose }) => {
    return (
        <div className={`${visible ? "" : "hidden"} fixed w-full h-full bg-[rgba(0,0,0,0.3)] z-10 transition-colors`}
             onClick={() => {
                if (onClose) {
                    onClose();
                }
             }}>
            <div className={`block mx-auto mt-32 max-w-xl h-[50%] rounded z-20 ${className ? className : ""}`}
                 onClick={(e) => {
                    e.stopPropagation();
                 }}>
                { children }
            </div>
        </div>
    )
};

const SignInModal: React.FC<ModalProps> = ({ visible, onClose }) => {
    const modal = useModal();

    return (
        <Modal visible={visible} onClose={onClose} className="bg-white">
            <h1 className="text-center text-3xl font-bold">
                Sign in
            </h1>
            <button onClick={() => {
                modal.signIn.hide();
                modal.signUp.show();
            }}>
                Sign up
            </button>
        </Modal>
    )
}

const SignUpModal: React.FC<ModalProps> = ({ visible, onClose }) => {
    return (
        <Modal visible={visible} onClose={onClose} className="bg-white">
            <h1 className="text-center text-3xl font-bold">
                Sign up
            </h1>
        </Modal>
    )
}


export { Modal, SignInModal, SignUpModal };