import React from "react";
import { SignInModal, SignUpModal } from "./Modal";

interface Modal {
    show: () => void;
    hide: () => void;
}

interface ModalContextProps {
    signIn: Modal;
    signUp: Modal;
};

const ModalContext = React.createContext<ModalContextProps | undefined>(undefined);

const ModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [signInVisible, setSignInVisible] = React.useState<boolean>(false);
    const [signUpVisible, setSignUpVisible] = React.useState<boolean>(false);

    const contextValue = {
        signIn: {
            show() { setSignInVisible(true); },
            hide() { setSignInVisible(false); },
        },
        signUp: {
            show() { setSignUpVisible(true); },
            hide() { setSignUpVisible(false); },
        }
    }

    return (
        <ModalContext.Provider value={contextValue}>
            <SignInModal visible={signInVisible} onClose={() => contextValue.signIn.hide()} />
            <SignUpModal visible={signUpVisible} onClose={() => contextValue.signUp.hide()} />
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