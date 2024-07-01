import { RenderElementProps } from "slate-react";

export const Ol = (props: RenderElementProps) => {
  return (
    <ol {...props.attributes} className="font-sans list-decimal ml-4 my-2">
      {props.children}
    </ol>
  );
};

export const Ul = (props: RenderElementProps) => {
  return (
    <ul {...props.attributes} className="list-disc ml-4 my-2">
      {props.children}
    </ul>
  );
};

export const Li = (props: RenderElementProps) => {
  return (
    <li className="ml-4" {...props.attributes}>
      {props.children}
    </li>
  );
};
