"use client";
import { ReactEditor, RenderElementProps } from "slate-react";
import { useContext, useRef } from "react";
import { EditableTabsContext } from "../context";
import { NodeType } from "../../../../types";

export const Tab = (props: RenderElementProps) => {
  const tabContext = useContext(EditableTabsContext);
  const { attributes, children, element } = props;
  // const tabIndex =
  //   props.element.type === NodeType.TAB ? props.element.index : null;

  const tabRef = useRef<HTMLLIElement>(null);
  const smoothScrollToView = (itemRef: React.RefObject<HTMLLIElement>): void => {
    if (itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <li
      ref={tabRef}
      className={`p-2 hover:cursor-pointer mx-1 whitespace-nowrap ${
        tabContext.activeIndex ===
        (props.element.type === NodeType.TAB ? props.element.index : null)
          ? "dark:bg-white rounded-md dark:bg-opacity-50"
          : ""
      }`}
      onMouseDown={(e) => {
        if (
          tabContext.activeIndex !==
          ((props.element.type === NodeType.TAB
            ? props.element.index
            : null) as number)
        ) {
          // e.preventDefault();
          tabContext.setActiveIndex(
            (props.element.type === NodeType.TAB
              ? props.element.index
              : null) as number
          );
          smoothScrollToView(tabRef);
        }
      }}
    >
      {children}
    </li>
  );
};
