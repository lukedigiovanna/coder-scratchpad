import React from "react";
import { DeleteConfirmationModal, SignInModal, SignUpModal } from "./Modal";

interface Modal {
    show: () => void;
    hide: () => void;
}

interface ModalContextProps {
    signIn: Modal;
    signUp: Modal;
    deleteConfirmation: Modal & { setCallback: (cb: () => void) => void };
};

const ModalContext = React.createContext<ModalContextProps | undefined>(undefined);

const ModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [signInVisible, setSignInVisible] = React.useState<boolean>(false);
    const [signUpVisible, setSignUpVisible] = React.useState<boolean>(false);
    const [deleteVisible, setDeleteVisible] = React.useState<boolean>(false);
    const [deleteConfirmCallback, setDeleteConfirmCallback] = React.useState<() => void>(() => {});

    const contextValue = {
        signIn: {
            show() { setSignInVisible(true); },
            hide() { setSignInVisible(false); },
        },
        signUp: {
            show() { setSignUpVisible(true); },
            hide() { setSignUpVisible(false); },
        },
        deleteConfirmation: {
            show() { setDeleteVisible(true); },
            hide() { setDeleteVisible(false); },
            setCallback(cb: () => void) {
                setDeleteConfirmCallback(_ => cb);
            }
        }
    }

    return (
        <ModalContext.Provider value={contextValue}>
            <SignInModal visible={signInVisible} onClose={() => contextValue.signIn.hide()} />
            <SignUpModal visible={signUpVisible} onClose={() => contextValue.signUp.hide()} />
            <DeleteConfirmationModal visible={deleteVisible} onClose={() => contextValue.deleteConfirmation.hide()} onConfirm={deleteConfirmCallback} />
            { children }
        </ModalContext.Provider>
    )
}

function useModal(): ModalContextProps {
    const context = React.useContext(ModalContext);

    if (!context) {
        throw Error("useModal must be used inside a ModalProvider");
    }

    return context;
}

export { ModalProvider, useModal };