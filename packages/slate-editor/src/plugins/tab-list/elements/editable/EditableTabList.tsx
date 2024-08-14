import { RenderElementProps } from "slate-react";
import { TabList } from "react-tabs";

export const EditableTabList = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  return <ul className="flex bg-slate-200 bg-opacity-10">{children}</ul>;
};
