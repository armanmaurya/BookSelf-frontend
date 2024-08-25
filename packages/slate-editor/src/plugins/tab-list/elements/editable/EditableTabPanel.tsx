import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { TabPanel } from "../base/TabPanel";

export const EditableTabPanel = (props: RenderElementProps) => {
  const editor = useSlateStatic();
    // console.log(ReactEditor.findPath(editor, props.element));

  return (
    <TabPanel {...props} />
  )
};
