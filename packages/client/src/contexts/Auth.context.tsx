import React, { createContext, useContext, useState } from "react";
// importing types
import { AuthContextType, AuthMode } from "../types/Auth.types";
import { ContextChildrenProps } from "../types/Context.types";

const AuthContext = createContext<AuthContextType>({
    authModal: false,
    openAuthModal: (_data: AuthMode) => { },
    closeAuthModal: () => { },
});
export const useAuthContext = () => useContext(AuthContext);
export const AuthProvider: React.FC<ContextChildrenProps> = ({ children }) => {
    const [authModal, setAuthMode] = useState<AuthMode>(false);

    const openAuthModal = (mode: AuthMode) => {
        setAuthMode(mode);
    };

    const closeAuthModal = () => {
        setAuthMode(false);
    };

    return (
        <AuthContext.Provider
            value={{
                authModal,
                openAuthModal,
                closeAuthModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};