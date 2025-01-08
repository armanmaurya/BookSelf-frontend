import { useState } from "react";
import { createContext } from "react";

export interface MenuContextType<T> {
    clicked: boolean;
    point: { x: number, y: number };
    setClicked: (clicked: boolean) => void;
    setPoint: (point: { x: number, y: number }) => void;
    data: T | null;
    setData: (data: T) => void;
}

export const MenuContext = createContext<MenuContextType<any>>({
    clicked: false,
    point: { x: 0, y: 0 },
    setClicked: () => { },
    setPoint: () => { },
    data: null,
    setData: () => { }
});

export const MenuProvider = <T,>({ children }: { children: React.ReactNode }) => {
    const [clicked, setClicked] = useState(false);
    const [point, setPoint] = useState({ x: 0, y: 0 });
    const [data, setData] = useState<T | null>(null);

    return (
        <MenuContext.Provider value={{ clicked, point, setClicked, setPoint, data, setData }}>
            {children}
        </MenuContext.Provider>
    );
};