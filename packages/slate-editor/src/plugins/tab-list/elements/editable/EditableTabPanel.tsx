import { RenderElementProps } from "slate-react";
import { TabPanel } from "react-tabs";
import { useContext } from "react";
import { EditableTabsContext } from "../context";
import { NodeType } from "../../../../types";

export const EditableTabPanel = (props: RenderElementProps) => {
  const tabContext = useContext(EditableTabsContext);
  const { attributes, children, element } = props;
  const tabIndex =
    props.element.type === NodeType.TAB_PANEL ? props.element.index : null;

  return <div className="p-2" hidden={tabContext.activeIndex !== tabIndex}>{children}</div>;
};
