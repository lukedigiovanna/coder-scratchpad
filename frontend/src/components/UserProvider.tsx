import React from "react";

import { User } from "../constants/models";
import { attemptToRestoreSession, signInWithPassword, supabase } from "../constants/supabaseClient";

interface UserContextProps {
    data: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
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
        <UserContext.Provider value={{data: user, signIn, signOut}}>
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