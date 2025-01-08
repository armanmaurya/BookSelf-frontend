export const ContextMenuItem = ({ children, onClick, disabled, className, style, }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}) => {
    return (
        <div
            className={`px-2 p-1  cursor-pointer hover:bg-neutral-700 ${disabled ? "opacity-50" : ""} ${className}`}
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
}