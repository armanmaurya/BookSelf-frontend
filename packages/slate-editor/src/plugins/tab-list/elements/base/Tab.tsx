"use client";
import { ReactEditor, RenderElementProps } from "slate-react";
import { useContext } from "react";
import { EditableTabsContext } from "../context";
import { NodeType } from "../../../../types";

export const Tab = (props: RenderElementProps) => {
  const tabContext = useContext(EditableTabsContext);
  const { attributes, children, element } = props;
  // const tabIndex =
  //   props.element.type === NodeType.TAB ? props.element.index : null;
  
  return (
    <li
      className={`p-2 hover:cursor-pointer whitespace-nowrap  ${
        tabContext.activeIndex ===  (props.element.type === NodeType.TAB ? props.element.index : null) ? "border-b-4" : ""
      }`}
      onMouseDown={(e) => {
        if (tabContext.activeIndex !== (props.element.type === NodeType.TAB ? props.element.index : null) as number) {
          e.preventDefault();
          tabContext.setActiveIndex((props.element.type === NodeType.TAB ? props.element.index : null) as number);
        }
      }}
    >
      {children}
    </li>
  );
};
