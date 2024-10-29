import React from "react";
import { useModal } from "./ModalProvider";
import { useUser } from "./UserProvider";

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
            <div className={`block mx-auto mt-32 rounded z-20 ${className ? className : ""}`}
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

    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const [error, setError] = React.useState<string>("");

    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        setEmail("");
        setPassword("");
        setError("");
    }, [visible]);

    React.useEffect(() => {
        setError("");
    }, [email, password]);

    const user = useUser();

    const attemptSignIn = () => {
        setLoading(true);
        user.signIn(email, password).then(() => {
            modal.signIn.hide();
        }).catch(e => {
            setError(e.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Modal visible={visible} onClose={onClose} className="bg-white max-w-sm p-5">
            <h1 className="text-center text-3xl font-bold">
                Sign in
            </h1>

            <form className="flex flex-col space-y-8 mt-12 mx-12">
                <input className="border-b-[3px] outline-none border-b-neutral-600 px-2 pb-1 focus:border-b-blue-500" 
                       type="email"
                       placeholder="email"
                       value={email}
                       onChange={(e) => setEmail(_ => e.target.value)}
                       autoComplete="email" />
                <input className="border-b-[3px] outline-none border-b-neutral-600 px-2 pb-1 focus:border-b-blue-500" 
                       type="password"
                       placeholder="password"
                       value={password}
                       onChange={(e) => setPassword(_ => e.target.value)}
                       onKeyUp={(e) => {
                        if (e.key === 'Enter' && email.length > 0 && password.length > 0) {
                            attemptSignIn();
                        }
                       }}
                       autoComplete="current-password" />
            </form>

            <button type="submit" className="block mx-auto mt-12 text-sm font-bold text-gray-100 rounded-sm px-4 py-2 bg-blue-600 hover:bg-blue-800 active:bg-blue-500 transition-colors disabled:bg-blue-600 disabled:opacity-50"
                    disabled={loading || email.length === 0 || password.length === 0}
                    onClick={attemptSignIn}>
                Sign In
            </button>

            <p className="text-center mt-8 min-h-6 font-bold text-red-500">
                { error }
            </p>

            <p className="text-center mt-6">
                No account?
                {" "}
                <button className="italic font-bold hover:text-blue-500 active:text-blue-700" onClick={() => {
                    modal.signIn.hide();
                    modal.signUp.show();
                }}>
                    Sign up
                </button>
            </p>
        </Modal>
    )
}

const SignUpModal: React.FC<ModalProps> = ({ visible, onClose }) => {
    const modal = useModal();
    const user = useUser();

    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [confirmPassword, setConfirmPassword] = React.useState<string>("");

    const [error, setError] = React.useState<string>("");

    const match = React.useMemo(() => confirmPassword === password, [password, confirmPassword]);
    const valid = React.useMemo(() => password.length >= 6, [password]);

    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (password.length > 0) {
            if (!valid) {
                setError("Password must be at least 6 characters long");
            }
            else if (!match && confirmPassword.length > 0) {
                setError("Passwords do not match");
            }
            else {
                setError("");
            }
        }
        else {
            setError("");
        }
    }, [match, valid, password, confirmPassword]);

    const attemptSignUp = () => {
        setLoading(true);
        user.signUp(email, password).then(() => {
            modal.signUp.hide();
        }).catch(e => {
            setError(e.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Modal visible={visible} onClose={onClose} className="bg-white max-w-sm p-5">
            <h1 className="text-center text-3xl font-bold">
                Sign up
            </h1>

            <form className="flex flex-col space-y-8 mt-12 mx-12">
                <input className="border-b-[3px] outline-none border-b-neutral-600 px-2 pb-1 focus:border-b-blue-500" 
                       type="email"
                       placeholder="email"
                       value={email}
                       onChange={(e) => setEmail(_ => e.target.value)} />
                <input className="border-b-[3px] outline-none border-b-neutral-600 px-2 pb-1 focus:border-b-blue-500" 
                       type="password"
                       placeholder="password"
                       value={password}
                       onChange={(e) => setPassword(_ => e.target.value)} />
                <input className="border-b-[3px] outline-none border-b-neutral-600 px-2 pb-1 focus:border-b-blue-500" 
                       type="password"
                       placeholder="confirm password"
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(_ => e.target.value)} />
            </form>

            <p className="text-center mt-4 min-h-6 font-bold text-red-500">
                { error }
            </p>

            <button className="block mx-auto mt-6 text-sm font-bold text-gray-100 rounded-sm px-4 py-2 bg-blue-600 hover:bg-blue-800 active:bg-blue-500 transition-colors disabled:bg-blue-600 disabled:opacity-50"
                    disabled={loading || email.length === 0 || !match || !valid}
                    onClick={attemptSignUp}>
                Sign Up
            </button>

            
            
        </Modal>
    )
}

const DeleteConfirmationModal: React.FC<ModalProps & { onConfirm: () => void}> = ({ visible, onClose, onConfirm }) => {
    return (
        <Modal visible={visible} onClose={onClose} className="bg-white max-w-sm p-5">
            <h1 className="text-center font-bold text-xl">
                Confirm?
            </h1>
            <p className="text-center italic text-neutral-700 mb-4">
                This operation cannot be undone
            </p>
            <div className="flex flex-row justify-center space-x-8">
                <button className="text-sm font-bold text-gray-100 rounded-sm px-4 py-2 m-0 bg-blue-600 hover:bg-blue-800 active:bg-blue-500 transition-colors"
                        onClick={() => {
                            onConfirm();
                            if (onClose) onClose();
                        }}>
                    Confirm
                </button>
                <button className="text-sm font-bold text-gray-100 rounded-sm px-4 py-2 m-0 bg-gray-600 hover:bg-gray-800 active:bg-gray-500 transition-colors"
                        onClick={() => {
                            if (onClose) onClose();
                        }}>
                    Cancel
                </button>
            </div>
        </Modal>
    )
}

export { Modal, SignInModal, SignUpModal, DeleteConfirmationModal };