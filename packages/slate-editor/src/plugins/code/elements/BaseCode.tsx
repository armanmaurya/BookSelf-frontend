import { RenderElementProps } from "slate-react";

export const BaseCode = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  return (
    <pre
      className="bg-slate-100 dark:bg-neutral-900 p-4 pt-6 rounded my-2 overflow-auto"
      {...attributes}
    >
      <code>{children}</code>
    </pre>
  );
};
