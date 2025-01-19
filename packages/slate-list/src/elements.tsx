import React from "react";
import { RenderElementProps } from "slate-react";

export const OrderedList = (props: RenderElementProps) => {
  return (
    <ol {...props.attributes} className="font-sans list-decimal ml-8">
      {props.children}
    </ol>
  );
};

export const UnorderedList = (props: RenderElementProps) => {
  return (
    <ul {...props.attributes} className="list-disc ml-8">
      {props.children}
    </ul>
  );
};

export const ListItem = (props: RenderElementProps) => {
  return (
    <li className="" {...props.attributes}>
      {props.children}
    </li>
  );
};
