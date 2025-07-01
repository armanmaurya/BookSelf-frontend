import { CodeElementProps } from "../../types/element";

export const BaseCode = (props: CodeElementProps) => {
    const { attributes, children, element } = props;
    return (
        <pre
            className="border rounded-md p-4 py-6 my-2 overflow-auto"
            {...attributes}
        >
            <code>{children}</code>
        </pre>
    )
}