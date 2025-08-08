import { UserContext } from "@/context/auth-context";
import { useContext } from "react";


export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useAuth must be used within an UserProvider");
    }

    return context;
}