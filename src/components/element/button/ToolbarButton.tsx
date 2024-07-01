export const ToolbarButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <button
      className={`px-1 m-1 rounded ${
        isActive ? "dark:bg-sky-400 bg-sky-400" : "dark:hover:bg-neutral-400 hover:bg-neutral-400"
      } dark:hover:bg-opacity-15 dark:bg-opacity-15 bg-opacity-15 hover:bg-opacity-15`}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
        {children}
    </button>
  );
};
