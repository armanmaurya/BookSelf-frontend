"use client";
import { User } from "@/types/auth";
import { createContext, useState, useContext } from "react";

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
});

export const AuthProvider = ({
    children,
    userData: initialUser = null,
}: {
    children: React.ReactNode;
    userData: User | null;
}) => {
    const [user, setUser] = useState<User | null>(initialUser);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
