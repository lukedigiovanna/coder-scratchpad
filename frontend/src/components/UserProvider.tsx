import React from "react";

import { User } from "../constants/models";
import { attemptToRestoreSession, signInWithPassword } from "../constants/supabaseClient";

interface UserContextProps {
    data: User | null;
    signIn: (email: string, password: string) => void;
};

const UserContext = React.createContext<UserContextProps>({
    data: null,
    signIn: async () => {}
});

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await signInWithPassword(email, password);
            setUser(_ => response);
        }
        catch (e) {
            console.error(e);
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
        <UserContext.Provider value={{data: user, signIn}}>
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