import {
  RenderElementProps,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react";
import { NodeType } from "../types";
import { useState } from "react";

export const Anchor = (props: RenderElementProps) => {
  return (
    <a
      className="underline text-blue-500"
      {...props.attributes}
      href={props.element.type === NodeType.LINK ? props.element.url : ""}
    >
      {props.children}
    </a>
  );
};
