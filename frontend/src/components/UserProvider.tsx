import React from "react";

import { Scratch, User } from "../constants/models";
import { attemptSignUp, attemptToRestoreSession, signInWithPassword, supabase } from "../constants/supabaseClient";

interface UserContextProps {
    data: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    signUp: (email: string, password: string) => Promise<void>;
    updateScratch: (scratch: Scratch) => void;
    deleteScratch: (scratch: Scratch) => void;
};

const UserContext = React.createContext<UserContextProps | undefined>(undefined);

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);

    const signIn = async (email: string, password: string) => {
        const response = await signInWithPassword(email, password);
        setUser(_ => response);
    }

    const signOut = () => {
        supabase.auth.signOut();
        setUser(null);
    }

    const signUp = async (email: string, password: string) => {
        const response = await attemptSignUp(email, password);
        setUser(_ => response);
    }

    const updateScratch = (scratch: Scratch) => {
        if (user) {
            let updated = false;
            for (let i = 0; i < user.scratches.length; i++) {
                if (user.scratches[i].id === scratch.id) {
                    user.scratches[i] = {...scratch};
                    updated = true;
                    break;
                }
            }
            if (!updated) {
                user.scratches.push(scratch);
            }
            setUser({...user});
        }
    }

    const deleteScratch = (scratch: Scratch) => {
        if (user) {
            user.scratches.splice(user.scratches.findIndex(s => s.id === scratch.id), 1);
            setUser({...user});
        }
    }

    React.useEffect(() => {
        (async () => {
            try {
                const response = await attemptToRestoreSession();
                if (response) {
                    setUser(_ => response);
                }
            }
            catch (e) {
                console.error(e);
            }
        })();
    }, []);

    return (
        <UserContext.Provider value={{data: user, signIn, signOut, signUp, updateScratch, deleteScratch}}>
            { children }
        </UserContext.Provider>
    )
}

function useUser(): UserContextProps {
    const context = React.useContext(UserContext);

    if (!context) {
        throw Error("useUser must be used inside a UserProvider");
    }

    return context;
}

export { UserProvider, useUser };