import React from "react";
import { RenderElementProps } from "slate-react";

export const TabList = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  return (
    <ul className="flex bg-slate-200 overflow-x-scroll whitespace-pre bg-opacity-10" style={{listStyle: "none"}}>
      {children}
    </ul>
  );
};
