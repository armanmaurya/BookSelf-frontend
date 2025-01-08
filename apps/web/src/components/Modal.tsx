import { useEffect, useRef } from "react";

export const Modal = ({ children, onClose }: {
    children: React.ReactNode;
    onClose: () => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            onClose();
            // console.log("Clicked outside");
        }
    };
    useEffect(() => {
        if (document) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, []);
    return (
        <div ref={ref} className="">
            {children}
        </div>
    )
}