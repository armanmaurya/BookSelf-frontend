const defaultonMouseDown = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
  e.preventDefault();
};

export const ToolbarButton = ({
  isActive,
  onClick,
  children,
  onMouseDown = defaultonMouseDown,
}: {
  isActive?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  return (
    <button
      className={`px-1.5 m-0.5 rounded ${
        isActive
          ? "dark:bg-sky-400 bg-sky-400"
          : "dark:hover:bg-neutral-400 hover:bg-neutral-400"
      } dark:hover:bg-opacity-15 dark:bg-opacity-15 bg-opacity-15 hover:bg-opacity-15`}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  );
};
