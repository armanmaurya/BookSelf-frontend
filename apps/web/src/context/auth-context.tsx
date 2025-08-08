"use client";
import { API_ENDPOINT } from "@/app/utils";
import { User } from "@/types/user";
import { createContext, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@bookself/react-loading";
import nProgress from "nprogress";

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
};

export const UserContext = createContext<UserContextType>({
    user: null,
    logout: () => { },
    setUser: () => { },
});

export const UserProvider = ({
    children,
    userData: initialUser = null,
}: {
    children: React.ReactNode;
    userData: User | null;
}) => {
    const [user, setUser] = useState<User | null>(initialUser);
    const router = useRouter();
    const loader = useLoading();

    const logout = async () => {
        try {
            loader.show();
            const res = await fetch(API_ENDPOINT.logout.url, {
                method: API_ENDPOINT.logout.method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.ok) {
                console.log("Logout successful");
                setUser(null);
                nProgress.start();
                router.push("/signin");
                loader.hide();
            }
        } catch (error) {
            loader.hide();
            console.log("Network error");
        }
    };

    return (
        <UserContext.Provider value={{ user, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
};